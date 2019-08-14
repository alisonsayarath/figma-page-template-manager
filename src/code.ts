import { FigmaDocument } from "./types";

figma.showUI(__html__);

const doc = figma.root;
const cs = figma.clientStorage;
const ui = figma.ui;

const createPage = () => figma.createPage();
const renamePage = (page: PageNode, name: string) => (page.name = name);
const setCurrentPage = (page: PageNode) => (figma.currentPage = page);

// renamePage(figma.currentPage, "Components");
// createPage();
// renamePage(doc.children[1] as PageNode, "_______________________");
// createPage();
// renamePage(doc.children[2] as PageNode, "🏗V1");

const Mock: FigmaDocument = [
  { name: "Component" },
  { name: "_________________" },
  { name: "V1" }
];

figma.showUI(__html__, { width: 600, height: 310 });
cs.setAsync("test", Mock).then(() => cs.getAsync("test"));
ui.postMessage(Mock);

// createPage();
// setCurrentPage(doc.children[1]);
// figma.viewport.scrollAndZoomIntoView(nodes);

figma.closePlugin();
