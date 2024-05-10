const defaultGroupsAndPages = [
  {
    "name": "General",
    "pages": [
      "https://www.google.com/search?q={{}}",
      "https://uk.search.yahoo.com/search?p={{}}",
      "https://duckduckgo.com/?q={{}}",
      "https://www.baidu.com/s?wd={{}}&oq={{}}",
      "https://www.ecosia.org/search?q={{}}",
      "https://www.bing.com/search?q={{}}",
    ],
  },
  {
    "name": "Stocks",
    "pages": [
      "https://uk.finance.yahoo.com/quote/{{}}",
      "https://www.tradingview.com/symbols/{{}}/",
      "https://www.marketwatch.com/investing/index/{{}}",
      "https://finviz.com/quote.ashx?t={{}}"
    ]
  }
]

export const setDefaults = async () => {
  chrome.storage.sync.set(
    { groupsAndPages: defaultGroupsAndPages },
    async () => {
      console.log(await chrome.storage.sync.get())
      console.log("defaults set")
      location.reload()
    }
  );
}

export const openTabs = async (group_name, search_term) => {
  chrome.storage.sync.get().then(storage => {
    const tabs = [];
    const groupsAndPages = storage["groupsAndPages"];
    const group_pages = groupsAndPages.filter((e) => e.name == group_name)[0].pages;

    for (let pagesIndex = 0; pagesIndex < group_pages.length; pagesIndex++) {
      const page_URL = group_pages[pagesIndex];
      tabs.push(chrome.tabs.create({ url: page_URL.replaceAll("{{}}", encodeURIComponent(search_term)), active: false }))
    }

    /**
     * very weird syntax
     * but things have to resolved using promise.then
     * as there seems to be a limit on how many awaits there can be
     * (it looks like it's 5 to 6 awaits)
     */
    Promise.all(tabs).then((tabs) => {
      Promise.any([chrome.tabs.group({ tabIds: tabs.map((tab) => tab.id) })]).then(groupId => {
        chrome.tabGroups.update(groupId, { title: search_term });
        chrome.tabs.update(tabs[tabs.length-1].id, { active: true })
      })
    })
  })
}