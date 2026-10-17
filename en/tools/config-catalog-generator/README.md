# API Manager Config Catalog Generator Tool

This is a tool to generate the markdown file of the API Manager server's configuration catalog by using a JSON file as the source.

## Instructions

1. Clone the `docs-api-platform` repo.
2. Navigate to the `docs-api-platform/en/tools/config-catalog-generator` folder.
3. Run the following command:

    ```
    npm install
    ```

4. Open the `data/configs.json` file and add your content. If a config section has an example, add it as a `.toml` file in the `data/` folder and reference it from the section's `exampleFile` field.
5. Come back to root folder (`docs-api-platform/en/tools/config-catalog-generator`) and run the following command:

    ```
    npm run build
    ```

6. Go to the `dist/` folder: A markdown file named `config-catalog.md` is created. It includes the page frontmatter, with `last_updated` set to the date of the build.
7. Copy the `config-catalog.md` file to the `docs-api-platform/en/docs/api-manager/next/reference` folder, replacing the existing file.

> **Note:** The frontmatter (title, description, `canonical_url`, `md_url`, tags and so on) comes from `templates/index.njk`. Edit it there, not in the generated file, or the change is lost on the next build.
