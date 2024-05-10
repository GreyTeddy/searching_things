import { setDefaults } from "./shared.js";

const clearGroups = async () => {
  await chrome.storage.sync.set({ groupsAndPages: [] });
  console.log(await chrome.storage.sync.get())
  location.reload()
};
const restoreDefaults = async () => {
  await setDefaults()
};

document.getElementById('clear_groups').addEventListener('click', clearGroups);
document.getElementById('restore_defaults').addEventListener('click', restoreDefaults);

const addPage = async (group_name, page_URLs) => {
  let groupsAndPages = (await chrome.storage.sync.get())["groupsAndPages"]
  if (!groupsAndPages || groupsAndPages.map(e => e.name).indexOf(group_name) == -1) {
    return { success: false, reason: "Group Name does not exist" }
  }
  const index_of_group = groupsAndPages.map(e => e.name).indexOf(group_name)
  for (const url of page_URLs) {
    groupsAndPages[index_of_group].pages.push(url);
  }
  await chrome.storage.sync.set(
    { groupsAndPages: groupsAndPages },
    async () => {
      console.log(await chrome.storage.sync.get())
    }
  );
  location.reload()
  return { success: true }
}

const removePage = async (group_name, page_URL) => {
  let groupsAndPages = (await chrome.storage.sync.get())["groupsAndPages"]
  if (!groupsAndPages || groupsAndPages.map(e => e.name).indexOf(group_name) == -1) {
    return { success: false, reason: "Group Name does not exist" }
  }
  const index_of_group = groupsAndPages.map(e => e.name).indexOf(group_name)
  const index_of_page = groupsAndPages[index_of_group].pages.indexOf(page_URL)
  if (index_of_page == -1) {
    return { success: false, reason: `Page URL ${page_URL} is not part of the group: ${group_name}` }
  }
  groupsAndPages[index_of_group].pages.splice(index_of_page, 1)
  await chrome.storage.sync.set(
    { groupsAndPages: groupsAndPages },
    async () => {
      console.log(await chrome.storage.sync.get())
      console.log("defaults set")
    }
  );
  location.reload()
  return { success: true }
}

const removeGroup = async (group_name) => {
  let groupsAndPages = (await chrome.storage.sync.get())["groupsAndPages"]
  if (!groupsAndPages || groupsAndPages.map(e => e.name).indexOf(group_name) == -1) {
    return { success: false, reason: "Group Name does not exist" }
  }
  const index_of_group = groupsAndPages.map(e => e.name).indexOf(group_name)
  groupsAndPages.splice(index_of_group, 1)
  await chrome.storage.sync.set(
    { groupsAndPages: groupsAndPages },
    async () => {
      console.log(await chrome.storage.sync.get())
    }
  );
  location.reload()
  return { success: true }
}

const addGroup = async (group_name) => {
  let groupsAndPages = (await chrome.storage.sync.get())["groupsAndPages"]
  if (!groupsAndPages || groupsAndPages.map(e => e.name).indexOf(group_name) != -1) {
    return { success: false, reason: "Group name already exists" }
  }
  groupsAndPages.push({ name: group_name, pages: [] })
  await chrome.storage.sync.set(
    { groupsAndPages: groupsAndPages },
    async () => {
      console.log(await chrome.storage.sync.get())
    }
  );
  location.reload()
  return { success: true }
}
const handleButtonClick = async (e) => {
  if (e.target.classList.contains("remove-group-button")) {
    console.log(await removeGroup(e.target.nextSibling.data.trim()))
  } else if (e.target.classList.contains("remove-page-button")) {
    console.log(await removePage(e.target.parentElement.parentElement.previousElementSibling.nextSibling.data.trim(), e.target.nextSibling.data.trim()))
  }
}
const handleFormSubmit = async (e) => {
  console.log(e)
  if (e.target.classList.contains("add-page-form")) {
    console.log(await addPage(e.target.parentElement.previousSibling.textContent.trim(), e.target.firstChild.value.split(",").map(e=>e.trim())))
  } else if (e.target.classList.contains("add-group-form")) {
    console.log(e.target.firstChild.value)
    // return
    console.log(await addGroup(e.target.firstChild.value))
  }
}
const showPages = () => {
  chrome.storage.sync.get(
    "groupsAndPages",
    (items) => {
      if (!items.groupsAndPages) {
        document.getElementById('groups_and_pages').innerHTML = `
          <p>No Settings Set</p>
        `;
        return
      }
      let result = ""
      for (let index = 0; index < items.groupsAndPages.length; index++) {
        const group = items.groupsAndPages[index];
        result += `
        <button class="remove-group-button groups-and-pages-button" style='margin-right: 5px'>-</button>
        ${group.name}
        <div style="margin-left: 20px">
        ${group.pages.map(page_URL =>
          `<div><button class="remove-page-button groups-and-pages-button" style="margin-right: 5px">-</button>${page_URL}</div>`
        ).reduce((e, i) => e + i, "")}
        <form action="#" class="add-page-form groups-and-pages-form"><input class="test" placeholder="Add Page"></input></form>
        </div>
        `
      }
      result += `<form action="#" class="add-group-form groups-and-pages-form"><input class="test" placeholder="Add Group"></input></form>`
      document.getElementById('groups_and_pages').innerHTML = result;
      let groupsAndPagesButtons = document.getElementsByClassName('groups-and-pages-button');
      for (let index = 0; index < groupsAndPagesButtons.length; index++) {
        const element = groupsAndPagesButtons.item(index);
        element.addEventListener('click', handleButtonClick)
      }
      let groupsAndPagesForms = document.getElementsByClassName('groups-and-pages-form');
      for (let index = 0; index < groupsAndPagesForms.length; index++) {
        const element = groupsAndPagesForms.item(index);
        element.addEventListener('submit', handleFormSubmit)
      }
    }
  );
};

// .forEach(e=>e.addEventListener('click', test))
document.addEventListener('DOMContentLoaded', showPages);