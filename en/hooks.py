import re
import os
import json
import hashlib
import logging
import tempfile
from urllib.parse import urlsplit

logger = logging.getLogger('mkdocs.plugins.' + __name__)

_HOOKS_DIR = os.path.dirname(os.path.abspath(__file__))

# Populated in on_pre_build; used by on_post_page and on_post_build.
_partial_hashes: dict[str, str] = {}
_theme_css_version: str = ""

# Maps each page URL to its breadcrumb (list of ancestor section titles).
# Populated in on_nav; written to a JSON asset in on_post_build so the search
# results UI can show which doc set / version a result belongs to.
_breadcrumbs: dict[str, list[str]] = {}

# Slug -> version -> page URLs for version switching
_version_manifest: dict[str, dict[str, list[str]]] = {}


def _file_hash(path: str) -> str:
    """Return the first 8 hex characters of the MD5 hash of a file's content."""
    with open(path, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()[:8]


def on_pre_build(config, **kwargs):
    """Pre-compute content hashes from source CSS files.

    The combined hash of theme.css + every partial is stored as the version
    string added to the <link> tag in HTML, so any change to any partial also
    busts the theme.css browser/CDN cache.
    """
    global _theme_css_version
    _partial_hashes.clear()

    css_src_dir = os.path.join(_HOOKS_DIR, "theme", "material", "assets", "css")
    partials_src_dir = os.path.join(css_src_dir, "partials")

    # Collect raw bytes of theme.css + all partials for a combined hash
    combined = bytearray()

    theme_css_src = os.path.join(css_src_dir, "theme.css")
    if os.path.exists(theme_css_src):
        with open(theme_css_src, "rb") as f:
            combined += f.read()

    if os.path.exists(partials_src_dir):
        for fname in sorted(os.listdir(partials_src_dir)):
            if fname.endswith(".css"):
                path = os.path.join(partials_src_dir, fname)
                data = open(path, "rb").read()
                combined += data
                _partial_hashes[fname] = hashlib.md5(data).hexdigest()[:8]

    _theme_css_version = hashlib.md5(combined).hexdigest()[:8]


def on_nav(nav, config, files):
    """Build a URL -> breadcrumb map from the navigation tree.

    The breadcrumb is the list of ancestor section titles for each page (e.g.
    ["API Gateway", "1.1.0", "Policies"]). This is used to disambiguate search
    results that share the same title across versions / doc sets.
    """
    _breadcrumbs.clear()
    for page in nav.pages:
        crumbs = []
        item = page.parent
        while item is not None:
            if getattr(item, "title", None):
                crumbs.insert(0, item.title)
            item = item.parent
        if page.url and crumbs:
            _breadcrumbs[page.url] = crumbs

    _build_version_manifest(nav, config)
    return nav


def _collect_page_urls(item, urls):
    """Collect doc-local URLs from nav tree (excludes external/absolute links).
    URLs stored as relative paths without leading slash.
    """
    if item.is_page:
        if item.url:
            if item.url.startswith('/'):
                raise ValueError(f'Page URL unexpected leading slash: {item.url}')
            urls.append(item.url)
    elif item.is_link:
        if item.url:
            parsed = urlsplit(item.url)
            if not parsed.scheme and not parsed.netloc and not item.url.startswith('/'):
                urls.append(item.url)
            else:
                logger.debug('Excluding external URL: %s', item.url)
    elif item.children:
        for child in item.children:
            _collect_page_urls(child, urls)


def _build_version_manifest(nav, config):
    """Build slug -> version -> page URLs for versioned sections.
    Validates config and nav structure.
    """
    _version_manifest.clear()
    versioned_sections = (config.get("extra") or {}).get("versioned_sections") or {}
    
    # Validate no duplicate slugs
    seen_slugs = {}
    for title, cfg in versioned_sections.items():
        slug = cfg.get("slug")
        if not slug:
            continue
        if slug in seen_slugs:
            raise ValueError(f'Duplicate slug "{slug}" in versioned_sections')
        seen_slugs[slug] = title
    
    slug_by_title = {
        title: cfg["slug"] for title, cfg in versioned_sections.items() if cfg.get("slug")
    }
    if not slug_by_title:
        logger.debug("No versioned sections configured in extra.versioned_sections")
        return

    for item in nav.items:
        slug = slug_by_title.get(getattr(item, "title", None))
        if not slug:
            continue
        if not getattr(item, "children", None):
            logger.warning("Versioned section '%s' (slug: %s) has no child versions in nav", item.title, slug)
            continue
        version_urls = _version_manifest.setdefault(slug, {})
        for version_item in item.children:
            urls = []
            _collect_page_urls(version_item, urls)
            if urls:
                version_urls[version_item.title] = urls
                logger.debug("  %s/%s: %d pages", slug, version_item.title, len(urls))
            else:
                logger.warning(
                    "  %s/%s: no pages found (version excluded from manifest)",
                    slug, version_item.title
                )

    # Validate configured default and versions exist
    build_errors = []
    for section_cfg in versioned_sections.values():
        slug = section_cfg.get('slug')
        if not slug:
            continue

        # nav-item.html indexes versions[0] as the fallback "latest" whenever
        # default isn't a member of versions, so an empty list crashes the
        # template build and a default outside the list silently mislabels
        # whichever version happens to be first as "Latest Version".
        configured_versions = section_cfg.get('versions') or []
        default = section_cfg.get('default')

        if not configured_versions:
            error_msg = f'No versions configured for slug "{slug}" (extra.versioned_sections.versions must be non-empty)'
            logger.error(error_msg)
            build_errors.append(error_msg)

        if not default:
            error_msg = f'No default version configured for slug "{slug}" (extra.versioned_sections.default is required)'
            logger.error(error_msg)
            build_errors.append(error_msg)
        elif default not in configured_versions:
            configured_titles = ', '.join(configured_versions) if configured_versions else '(none)'
            error_msg = (f'Default version "{default}" not in configured versions for slug "{slug}". '
                         f'Configured: {configured_titles}')
            logger.error(error_msg)
            build_errors.append(error_msg)

        versions_dict = _version_manifest.get(slug, {})
        version_titles = ', '.join(sorted(versions_dict.keys())) if versions_dict else '(none)'

        if default and default not in versions_dict:
            error_msg = (f'Default version "{default}" not found in nav (slug: {slug}). '
                         f'Available: {version_titles}')
            logger.error(error_msg)
            build_errors.append(error_msg)

        for version in configured_versions:
            if version not in versions_dict:
                error_msg = (f'Configured version "{version}" not found in nav (slug: {slug}). '
                             f'Available: {version_titles}')
                logger.error(error_msg)
                build_errors.append(error_msg)

    # Validate sections have content
    for section_slug, versions_dict in _version_manifest.items():
        if not versions_dict:
            error_msg = f"Section '{section_slug}' has no versions"
            logger.error(error_msg)
            build_errors.append(error_msg)
    
    if build_errors:
        error_summary = '\n'.join(f'  - {msg}' for msg in build_errors)
        raise ValueError(f'Manifest validation failed:\n{error_summary}')

    # Log summary statistics
    total_versions = sum(len(versions) for versions in _version_manifest.values())
    total_pages = sum(len(urls) for versions in _version_manifest.values() for urls in versions.values())
    logger.info("Version manifest built: %d sections, %d versions, %d total pages", 
                len(_version_manifest), total_versions, total_pages)


def on_post_build(config, **kwargs):
    """Append content-hash query strings to @import URLs inside the built theme.css
    so that CDN / browser caches are busted whenever a partial file changes.
    Also writes the search breadcrumb map and version manifest collected in on_nav."""
    site_dir = config["site_dir"]

    # Write the breadcrumb map for the search results UI.
    breadcrumbs_path = os.path.join(site_dir, "assets", "search-breadcrumbs.json")
    os.makedirs(os.path.dirname(breadcrumbs_path), exist_ok=True)
    with open(breadcrumbs_path, "w", encoding="utf-8") as f:
        json.dump(_breadcrumbs, f, ensure_ascii=False)
    logger.info("Wrote breadcrumbs map: %s (%d URLs)", breadcrumbs_path, len(_breadcrumbs))

    # Write the version manifest for theme.js's version switcher.
    # Use atomic write (temp file + rename) to prevent partial reads on slow builds.
    manifest_path = os.path.join(site_dir, "assets", "version-manifest.json")
    os.makedirs(os.path.dirname(manifest_path), exist_ok=True)
    
    manifest_dir = os.path.dirname(manifest_path)
    try:
        temp_fd, temp_path = tempfile.mkstemp(dir=manifest_dir, prefix=".version-manifest-", suffix=".tmp")
    except Exception as e:
        logger.error("Failed to create temp file for version manifest: %s", e)
        raise
    try:
        f = os.fdopen(temp_fd, 'w', encoding='utf-8')
        temp_fd = None  # fdopen now owns the descriptor
        with f:
            json.dump(_version_manifest, f, ensure_ascii=False)
        # mkstemp() creates the file mode 0600 regardless of umask; os.replace()
        # preserves that on rename. Match the permissions other site_dir files
        # get via plain open() so a different serving user/process can read it.
        os.chmod(temp_path, 0o644)
        # Ensure atomic manifest write
        os.replace(temp_path, manifest_path)
    except Exception as e:
        logger.error("Failed to write version manifest: %s", e)
        # Close file descriptor only if fdopen() never adopted it
        if temp_fd is not None:
            try:
                os.close(temp_fd)
            except OSError:
                logger.debug("Temp descriptor already closed", exc_info=True)
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except OSError:
                logger.debug("Could not remove temp file: %s", temp_path, exc_info=True)
        raise
    
    # Validate manifest is not empty
    if not _version_manifest:
        logger.warning("Version manifest is empty! Check that extra.versioned_sections is configured.")
    else:
        total_sections = len(_version_manifest)
        total_versions = sum(len(versions) for versions in _version_manifest.values())
        logger.info("Wrote version manifest: %s (%d sections, %d versions)", 
                    manifest_path, total_sections, total_versions)

    theme_css_path = os.path.join(site_dir, "assets", "css", "theme.css")

    if not os.path.exists(theme_css_path):
        return

    with open(theme_css_path, "r", encoding="utf-8") as f:
        content = f.read()

    def _add_hash(match):
        url = match.group(1)
        base_url = url.split("?")[0]
        fname = os.path.basename(base_url)
        version = _partial_hashes.get(fname)
        if version:
            return f"@import url('{base_url}?v={version}')"
        return match.group(0)

    new_content = re.sub(r"@import url\('([^']+)'\)", _add_hash, content)

    with open(theme_css_path, "w", encoding="utf-8") as f:
        f.write(new_content)


def on_post_page(output, page, config, **kwargs):
    # Add cache-busting version to the theme.css <link> tag so CDN/browser
    # cache is invalidated whenever theme.css or any of its partials change.
    if _theme_css_version:
        output = re.sub(
            r'(<link[^>]+href="[^"]*assets/css/theme\.css)(")',
            rf'\1?v={_theme_css_version}\2',
            output,
        )

    if page.is_homepage:
        return output

    first = next(iter(page.toc), None)
    # we want the page's title to be derived from the frontmatter's title key.
    # if frontmatter or title key is unavailable, we fall back to the page's H1
    # heading
    if page.meta and page.meta.get("title"):
        title = page.meta["title"]
    elif first and first.level == 1:
        title = re.sub(r"<[^>]+>", "", first.title).strip()
    elif page.title:
        title = re.sub(r"<[^>]+>", "", page.title).strip()
    else:
        return output

    suffix = config.get("extra", {}).get("page_title_suffix", "")
    full_title = f"{title} | {suffix}" if suffix else title

    return re.sub(r"<title>.*?</title>", f"<title>{full_title}</title>", output, count=1)

# Matches a YAML frontmatter block at the start of a file.
FRONTMATTER_RE = re.compile(r"\A-{3}[ \t]*\n.*?\n(?:-{3}|\.{3})[ \t]*\n", re.DOTALL)


def _raw_frontmatter(src_path: str) -> str:
    """
    Return the page's frontmatter block as written in the source file.
    """
    try:
        with open(src_path, encoding="utf-8-sig") as f:
            source = f.read()
    except OSError:
        return ""
    match = FRONTMATTER_RE.match(source)
    return match.group(0) if match else ""


def _drop_tags_from_search(page):
    """Stop frontmatter tags from dominating search ranking.

    Material weights `tags` very heavily. Broad tags (e.g. the homepage's
    "platform-overview", "api-management") tokenize into common query words and
    let unrelated pages outrank the exact page a user searched for. There is no
    `tags` plugin in this project, so tags exist only to feed search — removing
    them from the index restores title/content-driven ranking with no other
    side effects.
    """
    if isinstance(page.meta, dict) and page.meta.get("tags"):
        page.meta["tags"] = []


def on_page_markdown(markdown, page, config, **kwargs):
    """Write Markdown files to a parallel .md file in the build output.

    For example, it creates the file `SITE_DIR/cloud/ai-gateway/overview.md`
    alongside the HTML page.
    """
    # Keep tags out of the search index (see helper above).
    _drop_tags_from_search(page)

    site_dir = config["site_dir"]
    # page.url is like "cloud/ai-gateway/overview/" so strip trailing slash
    # to produce "cloud/ai-gateway/overview.md".
    # When use_directory_urls is false, page.url ends in .html so strip that too.
    url_path = page.url.rstrip("/")
    if url_path.endswith(".html"):
        url_path = url_path[:-5]
    # If page.url is the homepage, after the rstrip, it becomes ""
    if not url_path:
        url_path = "index"
    md_output_path = os.path.join(site_dir, url_path + ".md")
    parent_dir = os.path.dirname(md_output_path)
    if parent_dir:
        os.makedirs(parent_dir, exist_ok=True)
    with open(md_output_path, "w", encoding="utf-8") as f:
        frontmatter = _raw_frontmatter(page.file.abs_src_path)
        if frontmatter:
            f.write(frontmatter)
            if not markdown.startswith("\n"):
                f.write("\n")
        f.write(markdown)
    return markdown
