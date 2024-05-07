const form = document.getElementById("search_term_form");
const input = document.getElementById("search_text_input")
const general_search_pages = [
  "https://www.google.com/search?q={{}}",
  "https://uk.search.yahoo.com/search?p={{}}"
]
input.focus()
form.addEventListener("submit", async  (event) => {
  // console.log(event);
  const tabs = []
  const input = document.querySelector("input");
  if (input.value.length == 0) return;

  const pages = general_search_pages;
  for (let pagesIndex = 0; pagesIndex < pages.length; pagesIndex++) {
    const element = pages[pagesIndex];
    tabs.push(await chrome.tabs.create({url:element.replaceAll("{{}}",encodeURIComponent(input.value))}))
  }

  const tabIds = tabs.map(({id}) => id);
  if (tabIds.length == 0){
    return
  }
  const group = await chrome.tabs.group({ tabIds });
  console.log(chrome);
  await chrome.tabGroups.update(group, { title: input.value });
});