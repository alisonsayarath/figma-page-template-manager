import { PageName } from "./types";

figma.showUI(__html__);

const doc = figma.root;
const cs = figma.clientStorage;
const ui = figma.ui;

const createPage = () => figma.createPage();
const renamePage = (page: PageNode, name: PageName) => {
  page.name = name;
};
const setCurrentPage = (page: PageNode) => (figma.currentPage = page);
const getPages = () => cs.getAsync("pages");

const triggerChanges = () => {
  getPages().then(pages => {
    for (let i = 0; i < doc.children.length; i++) {
      renamePage(doc.children[i] as PageNode, pages[i].name);
    }
  });
};

ui.onmessage = message => {
  switch (message.state) {
    case "PAGE_RENAMED":
      const page = doc.children.filter(p => p.id == message.data.id);
      renamePage(page[0] as PageNode, message.data.name);
      break;
    case "TRIGGER_CHANGES":
      triggerChanges();
      break;
    case "PAGE_CREATED":
      const newPagesNames = message.data
        .slice(doc.children.length)
        .map(p => p.name);
      for (let i = 0; i < newPagesNames.length; i++) {
        createPage();
        renamePage(
          doc.children[doc.children.length - 1] as PageNode,
          newPagesNames[i]
        );
      }
      break;
  }
  cs.setAsync("pages", message.pages);
};

figma.showUI(__html__, { width: 600, height: 310 });
// const yo = [
//   { id: "0:1", name: "Component" },
//   { id: "7:64", name: "__________" }
// ];

cs.getAsync("pages").then(asyncPages => ui.postMessage(asyncPages));

// createPage();
// setCurrentPage(doc.children[1]);
// figma.viewport.scrollAndZoomIntoView(nodes);

// figma.closePlugin();
