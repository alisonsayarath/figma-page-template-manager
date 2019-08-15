import { PageName } from "./types";

figma.showUI(__html__);

const doc = figma.root;
const cs = figma.clientStorage;
const ui = figma.ui;

const createPage = () => figma.createPage();
const renamePage = (page: PageNode, name: PageName) => {
  page.name = name;
};

cs.setAsync("pages", null);

const getPages = () => cs.getAsync("pages");
const existingPages = () => {
  return new Promise(resolver => {
    resolver(doc.children.map(p => ({ id: p.id, name: p.name })));
  });
};

const generateNewArrayFromPages = () =>
  doc.children.map(p => ({
    id: p.id,
    name: p.name
  }));

const triggerChanges = messageData => {
  return new Promise(resolver => {
    // deletes pages
    const newPageIdArray = messageData.map(p => p.id);
    for (let i = 0; i < doc.children.length; i++) {
      if (!newPageIdArray.includes(doc.children[i].id)) {
        doc.children[i].remove();
      }
    }

    // renames pages
    for (let i = 0; i < doc.children.length; i++) {
      if (messageData[i].id) {
        const id = messageData[i].id;
        const page = doc.children.find(p => p.id === id);
        renamePage(page as PageNode, messageData[i].name);
      }
    }

    // creates new pages and renames them
    const newPagesNames = messageData
      .slice(doc.children.length)
      .map(p => p.name);

    if (newPagesNames) {
      for (let i = 0; i < newPagesNames.length; i++) {
        createPage();
        renamePage(
          doc.children[doc.children.length - 1] as PageNode,
          newPagesNames[i]
        );
      }
    }

    resolver(generateNewArrayFromPages());
  });
};

getPages().then(asyncPages => ui.postMessage(asyncPages));

ui.onmessage = message => {
  switch (message.action) {
    case "CREATE_TEMPLATE_FROM_PAGE":
      existingPages().then(resp => {
        cs.setAsync("pages", resp);
        ui.postMessage(resp);
      });
      break;
    case "QUIT_PLUGIN":
      figma.closePlugin();
      break;
    case "TRIGGER_CHANGES":
      triggerChanges(message.data).then(resp => {
        cs.setAsync("pages", resp);
        ui.postMessage(resp);
        figma.closePlugin();
      });
      break;
  }
};

figma.showUI(__html__, { width: 400, height: 300 });
