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

// const yo = [
//   { id: "0:1", name: "Component" },
//   { id: "7:64", name: "__________" }
// ];

// cs.setAsync("pages", yo);
getPages().then(asyncPages => ui.postMessage(asyncPages));

ui.onmessage = message => {
  switch (message.state) {
    case "PAGE_RENAMED":
      const page = doc.children.filter(p => p.id == message.data.id);
      renamePage(page[0] as PageNode, message.data.name);
      cs.setAsync("pages", message.pages);
      break;
    case "TRIGGER_CHANGES":
      triggerChanges();
      cs.setAsync("pages", message.pages);
      break;
    case "PAGE_DELETED":
      console.log("deletePage!");
      const pageToDelete = doc.children.filter(p => p.id == message.data.id);
      pageToDelete[0].remove();
      cs.setAsync("pages", message.pages);
      break;
    case "PAGE_CREATED":
      console.log("Lets create a page...");
      createPage();
      getPages().then(resp => {
        const newPageName = "Coucou";
        const newPages = resp.concat({
          id: doc.children[doc.children.length - 1].id,
          name: newPageName
        });

        renamePage(
          doc.children[doc.children.length - 1] as PageNode,
          newPageName
        );

        cs.setAsync("pages", newPages);
        ui.postMessage(newPages);
      });

      // const newPagesNames = message.data
      //   .slice(doc.children.length)
      //   .map(p => p.name);
      // for (let i = 0; i < newPagesNames.length; i++) {
      //   createPage();
      //   renamePage(
      //     doc.children[doc.children.length - 1] as PageNode,
      //     newPagesNames[i]
      //   );
      // }
      break;
  }
};

figma.showUI(__html__, { width: 600, height: 310 });

// createPage();
// setCurrentPage(doc.children[1]);
// figma.viewport.scrollAndZoomIntoView(nodes);

// figma.closePlugin();
