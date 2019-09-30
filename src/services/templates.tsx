import { Template } from "../types";

export const createTemplate = (templatesArray: Template[]) => {
  return parent.postMessage(
    { pluginMessage: { action: "CREATE_TEMPLATE", data: templatesArray } },
    "*"
  );
};

export const deleteTemplate = (templatesArray: Template[]) => {
  return parent.postMessage(
    {
      pluginMessage: { action: "DELETE_TEMPLATE", data: templatesArray }
    },
    "*"
  );
};

export const updateTemplate = (templatesArray: Template[]) => {
  return parent.postMessage(
    { pluginMessage: { action: "CHANGE_TEMPLATE", data: templatesArray } },
    "*"
  );
};
