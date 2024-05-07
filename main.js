const button = document.getElementById("search_term_form");
button.addEventListener("submit", async  (event) => {
  // console.log(event);
  const tabs = []
  const input = document.querySelector("input");
  if (input.value.length == 0) return;
  tabs.push(await chrome.tabs.create({url:`https://www.google.com/search?q=${encodeURIComponent(input.value)}`}));
  tabs.push(await chrome.tabs.create({url:`https://uk.search.yahoo.com/search?p=${encodeURIComponent(input.value)}`}));

  const tabIds = tabs.map(({id}) => id);
  if (tabIds.length == 0){
    return
  }
  const group = await chrome.tabs.group({ tabIds });
  console.log(chrome);
  await chrome.tabGroups.update(group, { title: input.value });
});