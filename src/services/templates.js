export const createTemplate = (templatesArray) => {
    return parent.postMessage({ pluginMessage: { action: "CREATE_TEMPLATE", data: templatesArray } }, "*");
};
export const deleteTemplate = (templatesArray) => {
    return parent.postMessage({
        pluginMessage: { action: "DELETE_TEMPLATE", data: templatesArray }
    }, "*");
};
export const updateTemplate = (templatesArray) => {
    return parent.postMessage({ pluginMessage: { action: "CHANGE_TEMPLATE", data: templatesArray } }, "*");
};
