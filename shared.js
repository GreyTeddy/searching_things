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