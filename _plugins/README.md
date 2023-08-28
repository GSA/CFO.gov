# Jekyll aliases
generate_alias_pages.rb - custom plugin to generate page duplicates using aliases.

## How to use
Add aliases to your page.
aliases:
  - /page/alias1/
  - page/alias2/

New pages will be created as a copy of the current page.
`page.canonical` will be set from the `page.permalink` value.
