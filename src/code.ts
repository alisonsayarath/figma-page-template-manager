import { Pages } from "./types";

figma.showUI(__html__);

const doc = figma.root;
const cs = figma.clientStorage;
const ui = figma.ui;

const createPage = () => figma.createPage();
const renamePage = (page: PageNode, name: string) => (page.name = name);
const setCurrentPage = (page: PageNode) => (figma.currentPage = page);

ui.onmessage = message => {
  cs.setAsync("pages", message);
};

figma.showUI(__html__, { width: 600, height: 310 });
cs.getAsync("pages").then(asyncPages => ui.postMessage(asyncPages));

// createPage();
// setCurrentPage(doc.children[1]);
// figma.viewport.scrollAndZoomIntoView(nodes);

// figma.closePlugin();
