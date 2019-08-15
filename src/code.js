figma.showUI(__html__);
const doc = figma.root;
const cs = figma.clientStorage;
const ui = figma.ui;
const createPage = () => figma.createPage();
const renamePage = (page, name) => {
    page.name = name;
};
const getPages = () => cs.getAsync("pages");
const generateNewArrayFromPages = () => doc.children.map(p => ({
    id: p.id,
    name: p.name
}));
const triggerChanges = message => {
    return new Promise(resolver => {
        // deletes pages
        const newPageIdArray = message.data.map(p => p.id);
        for (let i = 0; i < doc.children.length; i++) {
            if (!newPageIdArray.includes(doc.children[i].id)) {
                doc.children[i].remove();
            }
        }
        // renames pages
        for (let i = 0; i < doc.children.length; i++) {
            if (message.data[i].id) {
                const id = message.data[i].id;
                const page = doc.children.find(p => p.id === id);
                renamePage(page, message.data[i].name);
            }
        }
        // creates new pages and renames them
        const newPagesNames = message.data
            .slice(doc.children.length)
            .map(p => p.name);
        if (newPagesNames) {
            for (let i = 0; i < newPagesNames.length; i++) {
                createPage();
                renamePage(doc.children[doc.children.length - 1], newPagesNames[i]);
            }
        }
        resolver(generateNewArrayFromPages());
    });
};
getPages().then(asyncPages => ui.postMessage(asyncPages));
ui.onmessage = message => {
    if (message.quit) {
        figma.closePlugin();
        return;
    }
    else {
        triggerChanges(message).then(resp => {
            cs.setAsync("pages", resp);
            ui.postMessage(resp);
            figma.closePlugin();
        });
    }
};
figma.showUI(__html__, { width: 400, height: 300 });
