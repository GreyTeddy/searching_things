# Search Things



An extension to search using multiple sites at once!


## Features
- It creates a group of tabs of different websites that use the search term provided
  - The group is named after the search term.
- The extension can be shown through a keyboard shortcut.
  - The shortcut can be changed in the Extensions Settings.
  - Defaults:
    - Windows/Linux: `Control` + `Shift` + `S`
    - macOS: `Command` + `Shift` + `S`
- You can add/remove groups and pages in the Options page.
  - When adding a page, you can specify the search_term by adding `{{}}` in the URL.
    - e.g. `https://www.google.com/search?q={{}}` to search the term on google
    - It can also be used multiple times if needed
      - e.g. `https://www.baidu.com/s?wd={{}}&oq={{}}`
    - To add multiple pages at once you can use `,` as a delimiter.
      - e.g `https://www.google.com/search?q={{}},https://www.baidu.com/s?wd={{}}&oq={{}}`

## Installation

- [From the Chrome Web Store](https://chromewebstore.google.com/detail/search-things/aokpbbgodkjgafgdegbhiaebhamejakn)! 
- To install manually, you can find the release `.crx` package in the [Releases](https://github.com/GreyTeddy/searching_things/releases) page.
- To install from source, you can download the source code and [Load Unpacked](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked) from the root folder.

## Bugs/Feature Requests
You can look at [Issues](https://github.com/GreyTeddy/searching_things/issues) for any bugs and feature request that exist already.

If not, then feel free to request something or leave the error, preferably with ways to replicate it. A screenrecording or a screenshot will help a lot!

## ʕ •ᴥ•ʔ
I use this to search for news or stock information from multiple sources and I am finding it pretty neat! 
