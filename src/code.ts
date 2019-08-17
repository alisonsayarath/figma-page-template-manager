import { PageName, Message, Pages } from "./types";

figma.showUI(__html__);

const doc = figma.root;
const cs = figma.clientStorage;
const ui = figma.ui;

const createPage = () => figma.createPage();
const renamePage = (page: PageNode, name: PageName): void => {
  page.name = name;
};
const getPages = (): Promise<any> => cs.getAsync("pages");

const getExistingPages = (): { name: PageName }[] =>
  doc.children.map(p => ({ name: p.name }));

const triggerChanges = (messageData: Pages) => {
  messageData.forEach(page => {
    createPage();
    renamePage(doc.children[doc.children.length - 1] as PageNode, page.name);
  });

  const firstPage = doc.children[0] as PageNode;
  const firstPageChildren = firstPage.children.length
    ? firstPage.children
    : null;

  /** Moves all the layers from the first page to the new first one */
  if (firstPageChildren) {
    const secondPage = doc.children[1] as PageNode;
    firstPageChildren.forEach(slice => {
      secondPage.appendChild(slice);
    });
  }

  figma.currentPage = doc.children[1] as PageNode;
  firstPage.remove();
};

getPages().then(asyncPages => {
  if (asyncPages) {
    ui.postMessage(asyncPages);
    return;
  }

  const existingPages = getExistingPages();
  cs.setAsync("pages", existingPages);
  ui.postMessage(existingPages);
});

ui.onmessage = (message: Message) => {
  switch (message.action) {
    case "CREATE_TEMPLATE_FROM_PAGE":
      const existingPages = getExistingPages();
      cs.setAsync("pages", existingPages);
      ui.postMessage(existingPages);
      break;
    case "TRIGGER_CHANGES":
      triggerChanges(message.data);
      const pages = message.data;
      cs.setAsync("pages", pages);
      ui.postMessage(pages);
      figma.closePlugin();
      break;
  }
};

figma.showUI(__html__, { width: 580, height: 300 });
