const form = document.getElementById("search_term_form");
const input = document.getElementById("search_text_input")
const pagesGroupSelect = document.getElementById("pages_group_select")
const pages = [
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

const pages_group_options = []
for (let pagesIndex = 0; pagesIndex < pages.length; pagesIndex++) {
  const element = pages[pagesIndex];
  pages_group_options.push(`
    <option id="${element.name}_option" name="${element.name}" value="${element.name}">${element.name}</option>
  `)
}

pagesGroupSelect.innerHTML = pages_group_options.join(" ")
pagesGroupSelect.firstElementChild.checked = true
input.focus()
form.addEventListener("submit", async (event) => {
  const tabs = []
  const input = document.querySelector("input");
  if (input.value.length == 0) return;

  const buttonData = new FormData(form);
  const group_name = buttonData.get("pages_group_select");
  const group_pages = pages.filter((e) => e.name == group_name)[0].pages;

  for (let pagesIndex = 0; pagesIndex < group_pages.length; pagesIndex++) {
    const page_URL = group_pages[pagesIndex];
    tabs.push(chrome.tabs.create({ url: page_URL.replaceAll("{{}}", encodeURIComponent(input.value)) }))
  }

  /**
   * very weird syntax
   * but things have to resolved using promise.then
   * as there seems to be a limit on how many awaits there can be
   * (it looks like it's 5 to 6 awaits)
   */
  Promise.all(tabs).then((tabs) => {
    Promise.any([chrome.tabs.group({ tabIds: tabs.map((tab) => tab.id) })]).then(groupId => {
      chrome.tabGroups.update(groupId, { title: input.value });
    })
  })
});