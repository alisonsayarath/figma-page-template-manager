const doc = figma.root;
const cs = figma.clientStorage;
const ui = figma.ui;
const createPage = () => figma.createPage();
const renamePage = (page, name) => {
    page.name = name;
};
const getTemplates = () => cs.getAsync("templates");
const getExistingPages = () => doc.children.map(p => ({ name: p.name }));
const TEMPLATES = [
    {
        name: "Premier template",
        id: "1",
        isDefault: false,
        pages: [{ name: "Bonjour", id: "0" }]
    },
    {
        name: "Deuxième template",
        id: "2",
        isDefault: true,
        pages: [{ name: "Bonjour", id: "0" }, { name: "Salut ça farte ?", id: "1" }]
    },
    {
        name: "Troisième template",
        id: "3",
        isDefault: false,
        pages: [{ name: "KIKOO", id: "0" }]
    }
];
const triggerChanges = (messageData) => {
    console.log(messageData);
    // messageData.forEach(page => {
    //   createPage();
    //   renamePage(doc.children[doc.children.length - 1] as PageNode, page.name);
    // });
    // const firstPage = doc.children[0] as PageNode;
    // const firstPageChildren = firstPage.children.length
    //   ? firstPage.children
    //   : null;
    // /** Moves all the layers from the first page to the new first one */
    // if (firstPageChildren) {
    //   const secondPage = doc.children[1] as PageNode;
    //   firstPageChildren.forEach(slice => {
    //     secondPage.appendChild(slice);
    //   });
    // }
    // figma.currentPage = doc.children[1] as PageNode;
    // firstPage.remove();
};
// cs.setAsync("templates", undefined);
getTemplates().then(asyncTemplates => {
    console.log(asyncTemplates);
    if (asyncTemplates.length) {
        const newTemplates = asyncTemplates.map((t, i) => {
            return {
                name: t.name,
                id: (i + 1).toString(),
                isDefault: false,
                pages: t.pages.map((p, j) => ({
                    name: p.name,
                    id: (j + 1).toString()
                }))
            };
        });
        ui.postMessage(newTemplates);
        return;
    }
    else {
        cs.setAsync("templates", []);
        ui.postMessage({ pluginMessage: { data: [] } });
    }
});
ui.onmessage = (message) => {
    const templates = message.data;
    switch (message.action) {
        case "CREATE_TEMPLATE_FROM_PAGE":
            const existingPages = getExistingPages();
            cs.setAsync("pages", existingPages);
            ui.postMessage(existingPages);
            break;
        case "TRIGGER_CHANGES":
            // triggerChanges(message.data);
            cs.setAsync("pages", templates);
            ui.postMessage(templates);
            figma.closePlugin();
            break;
        case "CHANGE_TEMPLATE":
            cs.setAsync("templates", templates);
            ui.postMessage(templates);
        case "CREATE_TEMPLATE":
            cs.setAsync("templates", templates);
            ui.postMessage(templates);
        case "DELETE_TEMPLATE":
            cs.setAsync("templates", templates);
            ui.postMessage(templates);
    }
};
figma.showUI(__html__, { width: 640, height: 300 });
