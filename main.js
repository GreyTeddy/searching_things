import { setDefaults } from "./shared.js";

const form = document.getElementById("search_term_form");
const input = document.getElementById("search_text_input")
const pagesGroupSelect = document.getElementById("pages_group_select")

const groupAndPages = (await chrome.storage.sync.get())["groupsAndPages"]
if (groupAndPages == undefined) {
  setDefaults()
}

const pages_group_options = []
for (let pagesIndex = 0; pagesIndex < groupAndPages.length; pagesIndex++) {
  const element = groupAndPages[pagesIndex];
  pages_group_options.push(`
    <option id="${element.name}_option" name="${element.name}" value="${element.name}">${element.name}</option>
  `)
}

pagesGroupSelect.innerHTML = pages_group_options.join(" ")
if (pagesGroupSelect.firstElementChild) {
  pagesGroupSelect.firstElementChild.checked = true
}
input.focus()
form.addEventListener("submit", async (event) => {
  const tabs = []
  const input = document.querySelector("input");
  if (input.value.length == 0) return;

  const buttonData = new FormData(form);
  const group_name = buttonData.get("pages_group_select");
  const group_pages = groupAndPages.filter((e) => e.name == group_name)[0].pages;

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