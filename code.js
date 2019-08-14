
figma.showUI(__html__);

const doc = figma.root;
const createPage = () => figma.createPage();
const renamePage = (page, name) => (page.name = name);
const setCurrentPage = (page) => (figma.currentPage = page);

// renamePage(figma.currentPage, "Components");
// createPage();
// renamePage(doc.children[1] as PageNode, "_______________________");
// createPage();
// renamePage(doc.children[2] as PageNode, "🏗V1");
figma.showUI(__html__, { width: 600, height: 310 });
// createPage();
// setCurrentPage(doc.children[1]);
// console.log((figma.currentPage.name = "coucou"));
// figma.viewport.scrollAndZoomIntoView(nodes);
// Make sure to close the plugin when you're done. Otherwise the plugin will
// keep running, which shows the cancel button at the bottom of the screen.
// figma.closePlugin();
