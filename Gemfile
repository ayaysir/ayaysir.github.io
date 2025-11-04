# frozen_string_literal: true

source "https://rubygems.org"

gem "jekyll", "~> 4.4"
gem "jekyll-theme-chirpy"

# Optional plugins you want locally
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17"
  gem "jekyll-seo-tag", "~> 2.8"
  gem "jekyll-youtube"
  gem "jekyll-gist"
end

# test helper
gem "html-proofer", "~> 5.0", group: :test

platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.2.0", platforms: [:mingw, :x64_mingw, :mswin]