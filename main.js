import { openTabs, setDefaults } from "./shared.js";

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
  event.preventDefault()
  const input = document.querySelector("input");
  if (input.value.length == 0) return;

  const buttonData = new FormData(form);
  const group_name = buttonData.get("pages_group_select");
  openTabs(group_name, input.value)
});