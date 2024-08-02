ruby '>= 3.1.3'

source "https://rubygems.org"

gem 'jekyll', '~> 4.3.3'
gem 'jekyll-sass-converter', '~> 3.0'

gem "webrick" # not included in jekyll directly until 4.3.0 https://github.com/jekyll/jekyll/pull/8524

# See https://github.com/envygeeks/jekyll-assets/issues/622
gem "sprockets", "~> 3.7"
group :jekyll_plugins do
  gem 'jekyll-paginate-v2', "3.0.0"  
  gem 'jekyll-sitemap'
  gem 'jekyll-seo-tag'
  gem "jekyll-feed", "~> 0.6"
  gem 'jekyll-redirect-from'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
gem "wdm", "~> 0.1.0" if Gem.win_platform?

gem "html-proofer", "~> 3.15"
gem "kramdown-parser-gfm", "1.1.0"
