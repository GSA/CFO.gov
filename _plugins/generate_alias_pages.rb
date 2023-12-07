Jekyll::Hooks.register :pages, :post_init do |page|
  if page.data['aliases']
    site = page.site
    original_page = page.dup
    page.data['aliases'].each do |alias_path|
      alias_path = alias_path.gsub(/^\//, '')  # Remove leading slash
      alias_path_with_extension = "#{alias_path}index.html"  # Add .html extension

      # Create a new page for the alias
      alias_page = Jekyll::Page.new(site, site.source, '_pages', 'empty.md')

      alias_page.data = original_page.data.clone
      alias_page.content = original_page.content

      # Set the basename for the alias page
      alias_page.basename = File.basename(alias_path_with_extension, ".*")

      # Update the permalink for the alias page
      alias_page.data['permalink'] = alias_path

      # Add canonical for the alias page
      alias_page.data['canonical'] = page.data['permalink']

      # Add the alias page to the site's pages collection
      site.pages << alias_page
    end
  end
end
