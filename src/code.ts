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

ui.onmessage = message => {
  cs.setAsync("pages", message);
};

// console.log(doc.children);
figma.showUI(__html__, { width: 600, height: 310 });
cs.getAsync("pages").then(asyncPages => ui.postMessage(asyncPages));

const getPages = () => cs.getAsync("pages");

getPages().then(pages => {
  for (let i = 0; i < doc.children.length; i++) {
    renamePage(doc.children[i] as PageNode, pages[i].name);
  }
});

// createPage();
// setCurrentPage(doc.children[1]);
// figma.viewport.scrollAndZoomIntoView(nodes);

// figma.closePlugin();
