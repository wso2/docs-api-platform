/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * Page lifecycle helpers
 * -------------------------------------------------------------------------
 * With instant loading (theme.features: navigation.instant) the browser loads
 * one document per session: every later navigation swaps
 * [data-md-component=container] in place, so DOMContentLoaded fires only for
 * the first page. Material exposes `document$`, which emits for the current
 * page and again after every swap.
 *
 * Use onEachPage for anything that touches the content or the navigation
 * sidebar, both of which are replaced. Use onFirstPage for the header and the
 * search dialog, which stay in place.
 */
function onEachPage(callback) {
  if (typeof window.document$ !== 'undefined') {
    window.document$.subscribe(callback);
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}

function onFirstPage(callback) {
  var done = false;
  onEachPage(function () {
    if (done) return;
    done = true;
    callback();
  });
}

// Initialize version dropdown
function initVersionDropdown() {
  const dropdown = document.querySelector('.md-header__version-select-dropdown');
  
  if (dropdown) {
    // Add a click event listener to the dropdown link
    const dropdownLink = dropdown.querySelector('.dropdown-link');

    if (dropdownLink) {
      // Remove any existing event listeners by cloning
      const newDropdownLink = dropdownLink.cloneNode(true);
      dropdownLink.parentNode.replaceChild(newDropdownLink, dropdownLink);
      
      newDropdownLink.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        dropdown.classList.toggle('open');
      });
    }

    // Add a click event listener to close dropdown when clicking outside
    document.addEventListener('click', function(event) {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('open');
      }
    });
  }
}

// The dropdown lives in the header, which survives instant navigation.
onFirstPage(initVersionDropdown);

// Content tab styling and navigation sidebar state: both are re-rendered on
// every navigation, so this runs per page.
onEachPage(function() {
  // Add a class to content tabs that has multiple child elements rather than a code block
  document.querySelectorAll('.tabbed-content').forEach(tabbedContent => {
    const tabbedBlocks = Array.from(tabbedContent.querySelectorAll('.tabbed-block'));

    // Check if each .tabbed-block has more than 1 child or if its immediate child is not .highlight
    const shouldAddClass = tabbedBlocks.some(tabbedBlock => 
      tabbedBlock.children.length > 1 || !tabbedBlock.firstElementChild.classList.contains('highlight')
    );

    if (shouldAddClass) {
      tabbedContent.classList.add('tab_with_no_code');
    }
  });

  // Toggle active state of nested nav items
  const activeNavItems = document.querySelectorAll('.md-nav__list > .md-nav__item.md-nav__item--active.md-nav__item--nested');

  if (activeNavItems) {
    activeNavItems.forEach((item) => {
      const checkbox = item.querySelector('input[type="checkbox"].md-nav__toggle.md-toggle');

      if (checkbox) {
        checkbox.checked = true;
      }
    });
  }

  // Expanded sections start with checked=true due to the vertical-line design.
  // Fix: uncheck every non-active section toggle at any nesting depth (e.g.
  // "Guides > Developer Portal") so only the section chain containing the
  // current page stays expanded on load.
  const nestedItems = document.querySelectorAll('.md-nav--primary .md-nav__item--nested');
  nestedItems.forEach(function(item) {
    if (!item.classList.contains('md-nav__item--active')) {
      const toggle = Array.from(item.children).find(function(el) {
        return el.tagName === 'INPUT' && el.type === 'checkbox' && el.classList.contains('md-nav__toggle');
      });
      if (toggle) {
        toggle.checked = false;
      }
    }
  });

  // Menu items expand/collapse independently: expanding one item no longer
  // collapses its siblings. Each item stays open until the user collapses it.
});

/*
 * Handle opening external links in a new tab
 * and initialize JSON tree formatter
 */
onEachPage(function() {
  // Open external links in new tab. Header and footer links survive instant
  // navigation and are seen again on every page, so use classList.add rather
  // than appending to className, which would stack duplicate class names.
  var links = document.links;
  for (var i = 0, linksLength = links.length; i < linksLength; i++) {
    if (links[i].hostname != window.location.hostname) {
      links[i].target = "_blank";
      links[i].setAttribute("rel", "noopener noreferrer");
      links[i].classList.add("externalLink");
    } else {
      links[i].classList.add("localLink");
    }
  }
  
  // Initialize JSON tree formatter
  var jsonTreeInputs = document.getElementsByClassName('jsonTreeInput');
  if (jsonTreeInputs && jsonTreeInputs.length > 0) {
    for (var i = 0; i < jsonTreeInputs.length; i++) {
      try {
        var jsonTreeInput = jsonTreeInputs[i];
        var jsonTreeOutput = jsonTreeInput.previousElementSibling;
        var level = jsonTreeInput.getAttribute('data-level');
        var levelInteger = level ? parseInt(level) : 1;
        var formatter = new JSONFormatter(JSON.parse(jsonTreeInput.innerHTML), levelInteger, { hoverPreviewEnabled: false });
        jsonTreeOutput.innerHTML = '';
        jsonTreeOutput.appendChild(formatter.render());
        jsonTreeInput.style.display = 'none';
      } catch (e) {
        console.error(e);
      }
    }
  }
});

// Set last visited valid page in session storage
onEachPage(function () {
  // Check if the server indicated this page is valid
  const isPageValid = document.documentElement.getAttribute("data-page-valid") === "true";
  
  if (isPageValid) {
    sessionStorage.setItem("lastValidPage", window.location.href);
  }
});

/* 
 * Reading versions
 */
onEachPage(function() {
  var pageHeader = document.getElementById('page-header');
  if (!pageHeader) return;

  // Only fetch versions.json when this page has somewhere to put the result:
  // the header dropdown, or the tables on the versions page. The dropdown
  // survives instant navigation, so populate it once; the tables are page
  // content and are re-rendered on every navigation.
  var dropdownEl = document.getElementById('version-select-dropdown');
  var versionsPageEl = document.getElementById('current-version-stable');
  if (!dropdownEl && !versionsPageEl) return;
  if (!versionsPageEl && dropdownEl.getAttribute('data-versions-rendered')) return;
  var docSetLang = pageHeader.getAttribute('data-lang') == null ? 'en' : pageHeader.getAttribute('data-lang');

  if (window.location.pathname.split('/')[1] !== docSetLang) {
    docSetLang = '';
  } else {
    docSetLang = docSetLang + '/';
  }

  var docSetUrl = window.location.origin + '/' + docSetLang;
  
  // Try to load from local first, fallback to remote
  var versionsUrl = docSetUrl + 'versions/assets/versions.json';
  
  var request = new XMLHttpRequest();

  request.open('GET', versionsUrl, true);
  
  // Add error handler
  request.onerror = function() {
    console.error("Failed to load versions.json. CORS or network error.");
    // For development, you can add mock data here
    console.log("You can create a local versions.json file at: /en/versions/assets/versions.json");
  };

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {

      var data;
      try {
        data = JSON.parse(request.responseText);
      } catch (e) {
        console.error("Failed to parse versions.json:", e);
        return;
      }
      var dropdown =  document.getElementById('version-select-dropdown');
      var checkVersionsPage = document.getElementById('current-version-stable');
      
      /* 
       * Appending versions to the version selector dropdown 
       */
      if (dropdown && !dropdown.getAttribute('data-versions-rendered')){
          dropdown.setAttribute('data-versions-rendered', 'true');
          data.list.sort().forEach(function(key, index){
              var versionData = data.all[key];
              
              if(versionData) {
                  var liElem = document.createElement('li');
                  var docLinkType = data.all[key].doc.split(':')[0];
                  var target = '_self';
                  var url = data.all[key].doc;

                  if ((docLinkType == 'https') || (docLinkType == 'http')) {
                      target = '_blank'
                  }
                  else {
                      url = docSetUrl + url;
                  }
                  const anchor = document.createElement('a');

                  anchor.setAttribute('href', url);
                  anchor.setAttribute('target', target);
                  anchor.textContent = key;

                  liElem.appendChild(anchor);

                  dropdown.insertBefore(liElem, dropdown.firstChild);
              }
          });

          document.getElementById('show-all-versions-link')
              .setAttribute('href', docSetUrl + 'versions');
      }
      
      /* 
       * Appending versions to the version tables in versions page
       */
      if (checkVersionsPage){
          var previousVersions = [];

          Object.keys(data.all).forEach(function(key, index){
              if ((key !== data.current) && (key !== data['pre-release'])) {
                  var docLinkType = data.all[key].doc.split(':')[0];
                  var target = '_self';

                  if ((docLinkType == 'https') || (docLinkType == 'http')) {
                      target = '_blank'
                  }

                  previousVersions.push('<tr>' +
                    '<th>' + key + '</th>' +
                        '<td>' +
                            '<a href="' + data.all[key].doc + '" target="' + 
                                target + '">Documentation</a>' +
                        '</td>' +
                        '<td>' +
                            '<a href="' + data.all[key].notes + '" target="' + 
                                target + '">Release Notes</a>' +
                        '</td>' +
                    '</tr>');
              }
          });

          /// --- Past releases update ---
const prevEl = document.getElementById('previous-versions');
if (prevEl) {
  prevEl.innerHTML = previousVersions.join(' ');
}

// --- Current released version update ---
const currentNum = document.getElementById('current-version-number');
if (currentNum) {
  currentNum.textContent = data.current; // safer than innerHTML
}

const docLink = document.getElementById('current-version-documentation-link');
if (docLink) {
  docLink.setAttribute('href', docSetUrl + data.all[data.current].doc);
}

const notesLink = document.getElementById('current-version-release-notes-link');
if (notesLink) {
  notesLink.setAttribute('href', docSetUrl + data.all[data.current].notes);
}

// --- Pre-release version update ---
const preRelLink = document.getElementById('pre-release-version-documentation-link');
if (preRelLink) {
  preRelLink.setAttribute('href', docSetUrl + 'next/');
}

      }
      
  } else {
      console.error("We reached our target server, but it returned an error");
  }
  };

  request.send();
});

/*
 * Per-section versioned navigation
 * -------------------------------------------------------------------------
 * Sections configured under `extra.versioned_sections` in mkdocs.yml render a
 * version <select> plus one `.md-nav__version-group[data-md-version]` per
 * version (see partials/nav-item.html). Here we:
 *   1. Resolve the active version (URL segment > localStorage > default).
 *   2. Show only the active version's group.
 *   3. On change, keep the user on the equivalent page under the new version,
 *      falling back to that version's overview when it does not exist.
 */
// The navigation sidebar is re-rendered on every navigation, so resolve the
// active version and rebind the selectors per page.
onEachPage(function () {
  // Version-scoped root nav sections (extra.version_scoped_navs): rendered
  // hidden (see nav-item.html / _version-select.css), revealed while the
  // current URL contains the matching version as a path segment — e.g.
  // Developer Portal and AI Workspace appear at root level on /next/... and
  // /api-gateway/next/... pages.
  var pathSegments = window.location.pathname.split('/').filter(Boolean);
  document.querySelectorAll('.md-nav--primary [data-md-scoped-version]').forEach(function (el) {
    var visible = pathSegments.indexOf(el.getAttribute('data-md-scoped-version')) !== -1;
    el.classList.toggle('md-nav__scoped--visible', visible);
  });

  document.querySelectorAll('.md-nav__item--versioned').forEach(function (section) {
    var slug = section.getAttribute('data-md-versioned-section');
    var defaultVersion = section.getAttribute('data-md-default-version');
    var select = section.querySelector('.md-nav__version-dropdown');
    var groups = Array.prototype.slice.call(
      section.querySelectorAll('.md-nav__version-group')
    );
    if (!slug || !select || groups.length === 0) return;

    var storageKey = 'docVersion:' + slug;

    // Available version values, in the order rendered.
    var versions = groups.map(function (g) {
      return g.getAttribute('data-md-version');
    });

    // Resolve the active version: URL path segment wins, then stored
    // preference, then the configured default.
    function versionFromPath() {
      // Match ".../<slug>/<version>/..." anywhere in the path.
      var parts = window.location.pathname.split('/').filter(Boolean);
      var idx = parts.lastIndexOf(slug);
      if (idx !== -1 && idx + 1 < parts.length) {
        var candidate = parts[idx + 1];
        if (versions.indexOf(candidate) !== -1) return candidate;
      }
      return null;
    }

    var stored = null;
    try {
      stored = window.localStorage.getItem(storageKey);
    } catch (e) {
      stored = null;
    }

    var active =
      versionFromPath() ||
      (versions.indexOf(stored) !== -1 ? stored : null) ||
      (versions.indexOf(defaultVersion) !== -1 ? defaultVersion : versions[0]);

    function showVersion(version) {
      groups.forEach(function (g) {
        g.classList.toggle('is-active', g.getAttribute('data-md-version') === version);
      });
      // A version can be active without being offered in the dropdown (e.g.
      // "next" exists in the nav but is reachable only by URL). Append it
      // under its own group so the select reflects the active version
      // instead of going blank, and so the user can switch back to a
      // released version.
      if (!select.querySelector('option[value="' + version + '"]')) {
        var unreleasedGroup = select.querySelector('optgroup[label="Unreleased"]');
        if (!unreleasedGroup) {
          unreleasedGroup = document.createElement('optgroup');
          unreleasedGroup.label = 'Unreleased';
          select.appendChild(unreleasedGroup);
        }
        var option = document.createElement('option');
        option.value = version;
        option.textContent = version;
        unreleasedGroup.appendChild(option);
      }
      if (select.value !== version) select.value = version;
      try {
        window.localStorage.setItem(storageKey, version);
      } catch (e) {
        /* storage unavailable: selection simply won't persist */
      }
    }

    showVersion(active);

    // Collect the set of page paths available in a given version's group, plus
    // that version's overview (first link) as the fallback target.
    function groupForVersion(version) {
      return groups.filter(function (g) {
        return g.getAttribute('data-md-version') === version;
      })[0];
    }

    function pathTailAfterVersion(pathname, version) {
      // Returns the part of the path after "<slug>/<version>/", or null.
      var marker = '/' + slug + '/' + version + '/';
      var i = pathname.indexOf(marker);
      if (i === -1) return null;
      return pathname.slice(i + marker.length);
    }

    select.addEventListener('change', function () {
      var target = select.value;
      var group = groupForVersion(target);
      if (!group) return;

      var links = Array.prototype.slice.call(group.querySelectorAll('a[href]'));
      if (links.length === 0) {
        showVersion(target);
        return;
      }

      // Build the equivalent URL: same tail path, new version segment. Compare
      // against each link's resolved pathname (hrefs in the nav are relative).
      var current = versionFromPath();
      var tail = current ? pathTailAfterVersion(window.location.pathname, current) : null;

      var destination = null;
      if (tail !== null) {
        var wanted = ('/' + slug + '/' + target + '/' + tail).replace(/\/+$/, '');
        for (var i = 0; i < links.length; i++) {
          var linkPath = new URL(links[i].href).pathname.replace(/\/+$/, '');
          if (linkPath.slice(-wanted.length) === wanted) {
            destination = links[i].href;
            break;
          }
        }
      }

      // Fall back to the new version's overview (its first rendered link).
      if (!destination) destination = links[0].href;

      // Persist before navigating so the new page restores the same version.
      try {
        window.localStorage.setItem(storageKey, target);
      } catch (e) {
        /* ignore */
      }
      window.location.href = destination;
    });
  });
});

/*
 * Search result breadcrumbs + version scoping
 * -------------------------------------------------------------------------
 * Across products / versions many pages share a title ("Overview", "Regex
 * Guardrail", ...). Material's search results show only the title, so results
 * are ambiguous and (because every version is indexed) the same page appears
 * once per version. We:
 *   1. Load a URL -> breadcrumb map produced at build time
 *      (assets/search-breadcrumbs.json, see hooks.py) and inject the breadcrumb
 *      (e.g. "AI Gateway › 1.1.0 › LLM Proxy › Guardrails") under each result.
 *   2. Hide results from a NON-active version of a versioned product, so a user
 *      who selected 1.0.0 only sees 1.0.0 hits (plus non-versioned results such
 *      as Cloud / Guides). Active version is resolved exactly like the nav
 *      selector: URL segment > localStorage > configured default.
 */
(function () {
  // The search dialog belongs to the header, which instant navigation keeps in
  // place, so the observer is installed once per session.
  var output = null;

  // Material exposes the site root as an absolute URL in `window.__md_scope`
  // (set on every page, e.g. https://host/bijira/docs/). Use it to build the
  // fetch URL and to turn a result's pathname into a build-time breadcrumb key.
  // Fall back to a <base> tag, then the server root.
  var scope = window.__md_scope ||
    (document.querySelector('base') ? new URL(document.querySelector('base').href) : new URL('/', location));
  var basePath = scope.pathname;
  if (basePath.charAt(basePath.length - 1) !== '/') basePath += '/';

  var breadcrumbs = null;
  var pending = false;

  // Resolve, per versioned product (slug), which version is "active" for this
  // page. Reads the global versioned-nav DOM, mirroring the nav selector logic.
  var activeVersions = null;
  function getActiveVersions() {
    if (activeVersions) return activeVersions;
    activeVersions = {};
    document.querySelectorAll('.md-nav__item--versioned').forEach(function (section) {
      var slug = section.getAttribute('data-md-versioned-section');
      var def = section.getAttribute('data-md-default-version');
      if (!slug) return;
      var versions = [];
      section.querySelectorAll('.md-nav__version-group').forEach(function (g) {
        var v = g.getAttribute('data-md-version');
        if (v) versions.push(v);
      });
      var active = null;
      var parts = window.location.pathname.split('/').filter(Boolean);
      var idx = parts.lastIndexOf(slug);
      if (idx !== -1 && idx + 1 < parts.length && versions.indexOf(parts[idx + 1]) !== -1) {
        active = parts[idx + 1];
      }
      if (!active) {
        try {
          var s = window.localStorage.getItem('docVersion:' + slug);
          if (versions.indexOf(s) !== -1) active = s;
        } catch (e) { /* ignore */ }
      }
      if (!active) active = versions.indexOf(def) !== -1 ? def : versions[0];
      activeVersions[slug] = { active: active, versions: versions };
    });
    return activeVersions;
  }

  function keyForHref(href) {
    var path;
    try {
      path = new URL(href, scope).pathname;
    } catch (e) {
      return null;
    }
    // Strip the base path prefix to match the JSON keys (relative page URLs).
    if (basePath !== '/' && path.indexOf(basePath) === 0) {
      path = path.slice(basePath.length);
    } else {
      path = path.replace(/^\//, '');
    }
    if (path && path.charAt(path.length - 1) !== '/') path += '/';
    return path;
  }

  // Version values used by version-scoped doc sets (extra.version_scoped_navs),
  // whose pages live under "<version>/..." (e.g. next/ai-workspace/...).
  var scopedVersions = null;
  function getScopedVersions() {
    if (scopedVersions) return scopedVersions;
    scopedVersions = {};
    document.querySelectorAll('.md-nav--primary [data-md-scoped-version]').forEach(function (el) {
      scopedVersions[el.getAttribute('data-md-scoped-version')] = true;
    });
    return scopedVersions;
  }

  // True if the page key belongs to a non-active version (should be hidden).
  function isHiddenVersion(key) {
    if (!key) return false;
    var parts = key.split('/');
    if (parts.length < 2) return false;
    // Version-scoped doc sets: hide unless that version is in the current URL
    // (mirrors the nav visibility rule for these sections).
    if (getScopedVersions()[parts[0]]) {
      return window.location.pathname.split('/').indexOf(parts[0]) === -1;
    }
    var cfg = getActiveVersions()[parts[0]];
    if (!cfg) return false;
    if (cfg.versions.indexOf(parts[1]) === -1) return false; // not a version segment
    return parts[1] !== cfg.active;
  }

  function decorate() {
    if (!breadcrumbs || !output) return;
    var items = output.querySelectorAll('.md-search-result__item');
    var visible = 0;
    items.forEach(function (item) {
      var link = item.querySelector('.md-search-result__link');
      if (!link) return;
      var key = keyForHref(link.getAttribute('href') || link.href);

      // 1. Version scoping: hide results from non-active versions.
      var hide = isHiddenVersion(key);
      item.style.display = hide ? 'none' : '';
      if (!hide) visible++;

      // 2. Breadcrumb: inject once, under the document-level result title.
      if (!item.querySelector('.md-search-result__breadcrumbs')) {
        var crumbs = key && breadcrumbs[key];
        if (crumbs && crumbs.length) {
          var el = document.createElement('div');
          el.className = 'md-search-result__breadcrumbs';
          el.textContent = crumbs.join(' › '); // " > "
          var title = link.querySelector('.md-search-result__title');
          if (title && title.parentNode) {
            title.parentNode.insertBefore(el, title.nextSibling);
          } else {
            link.insertBefore(el, link.firstChild);
          }
        }
      }
    });

    // Keep the "N matching documents" meta count honest about what's shown.
    // Idempotent: only writes when the number actually changes (loop-safe).
    var meta = output.querySelector('.md-search-result__meta');
    if (meta && items.length && /\d/.test(meta.textContent)) {
      var desired = meta.textContent.replace(/\d[\d,]*/, String(visible));
      if (meta.textContent !== desired) meta.textContent = desired;
    }
  }

  function ensureLoadedThenDecorate() {
    if (breadcrumbs) {
      decorate();
      return;
    }
    if (pending) return;
    pending = true;
    var url = new URL('assets/search-breadcrumbs.json', scope).href;
    fetch(url)
      .then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (data) { breadcrumbs = data; decorate(); })
      .catch(function () { breadcrumbs = {}; });
  }

  // Results are rendered asynchronously and re-rendered on each keystroke, so
  // observe the output container and (re)decorate whenever it changes.
  onFirstPage(function () {
    output = document.querySelector('[data-md-component="search-result"]');
    if (!output) return;
    var observer = new MutationObserver(function () { ensureLoadedThenDecorate(); });
    observer.observe(output, { childList: true, subtree: true });
  });

  // The active version is derived from the URL and from the navigation sidebar,
  // both of which change on navigation, so drop the resolved values and let the
  // next search re-read them.
  onEachPage(function () {
    activeVersions = null;
    scopedVersions = null;
    // Results rendered for a search made on the previous page carry that page's
    // version scoping, and Material only re-renders them when the query
    // changes, so decorate what is already on screen again.
    if (output && output.querySelector('.md-search-result__item')) {
      ensureLoadedThenDecorate();
    }
  });
})();

