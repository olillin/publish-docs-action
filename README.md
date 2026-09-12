# Publish Docs Action

[![GitHub Super-Linter](https://github.com/olillin/publish-docs-action/actions/workflows/linter.yml/badge.svg)](https://github.com/actions/javascript-action/actions/workflows/linter.yml)
[![CI](https://github.com/olillin/publish-docs-action/actions/workflows/ci.yml/badge.svg)](https://github.com/actions/javascript-action/actions/workflows/ci.yml)
[![Check dist/](https://github.com/olillin/publish-docs-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/javascript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/olillin/publish-docs-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/javascript-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

Upload new revisions of division documents to
[new-docs](https://github.com/olillin/new-docs).

## Usage

Example usage in workflow:

```yaml
name: Publish to Docs
on:
  push:
    branches:
      - master

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7

      - name: Get current date
        id: date
        run: echo "::set-output name=date::$(date +'%Y-%m-%d')"

      - name: Publish bylaws
        uses: olillin/publish-docs-action@v1
        with:
          path: ./pdfs/bylaws.pdf
          category_slug: operational-documents
          document_slug: bylaws
          ignore_conflicts: true
          revised_at: ${{steps.date.outputs.date}}
```

### Inputs

| Name             | Description                                     | Required |
| ---------------- | ----------------------------------------------- | -------- |
| path             | Path to the file to upload                      | true     |
| base_url         | The docs server to publish documents to         | false    |
| category_slug    | Slug of the category where the document resides | true     |
| document_slug    | Slug of the document to update                  | true     |
| revised_at       | Date when the document was revised              | false    |
| ignore_conflicts | Ignore conflicts with existing revisions        | false    |
