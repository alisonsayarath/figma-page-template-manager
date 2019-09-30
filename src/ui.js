import * as React from "react";
import { useState } from "react";
import * as ReactDOM from "react-dom";
import { createTemplate, deleteTemplate, updateTemplate } from "./services/templates";
import { PageField } from "./components/page-field";
import { PageInput } from "./components/page-input";
import { TemplateField } from "./components/template-field";
import { TemplateInput } from "./components/template-input";
import "./styles/figma.css";
import "./styles/ui.css";
const App = () => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [creatingTemplate, setCreatingTemplate] = useState(null);
    const [creatingPage, setCreatingPage] = useState(null);
    onmessage = ({ data }) => {
        // console.log(data.pluginMessage);
        setTemplates(data.pluginMessage);
        if (!selectedTemplate && data.pluginMessage) {
            setSelectedTemplate(data.pluginMessage[0]);
        }
    };
    const openTemplateInput = () => {
        const creatingTemplateMock = {
            name: "",
            id: (templates.length + 1).toString(),
            isDefault: false,
            pages: []
        };
        setCreatingTemplate(creatingTemplateMock);
        setSelectedTemplate(creatingTemplateMock);
    };
    const openPageInput = () => {
        const creatingPageMock = {
            name: "",
            id: (selectedTemplate.pages.length + 1).toString()
        };
        setCreatingPage(creatingPageMock);
    };
    const onSelectTemplate = (template) => {
        setCreatingTemplate(null);
        setCreatingPage(null);
        setSelectedTemplate(template);
    };
    /** PAGES */
    const onDeletePage = (pageId) => {
        const newPagesArray = selectedTemplate.pages.filter(p => p.id !== pageId);
        const updatedTemplates = templates.map(t => t.id === selectedTemplate.id
            ? {
                name: selectedTemplate.name,
                id: selectedTemplate.id,
                isDefault: selectedTemplate.isDefault,
                pages: newPagesArray
            }
            : t);
        setTemplates(updatedTemplates);
        updateTemplate(updatedTemplates);
        setSelectedTemplate(Object.assign(Object.assign({}, selectedTemplate), { pages: newPagesArray }));
    };
    const onRenamePage = (pageId) => {
        if (!creatingPage.name) {
            return;
        }
        const newPagesArray = selectedTemplate.pages.map(p => p.id === pageId ? { id: pageId, name: creatingPage.name } : p);
        const updatedTemplates = templates.map(t => t.id === selectedTemplate.id
            ? {
                name: selectedTemplate.name,
                id: selectedTemplate.id,
                isDefault: selectedTemplate.isDefault,
                pages: newPagesArray
            }
            : t);
        setTemplates(updatedTemplates);
        updateTemplate(updatedTemplates);
        setSelectedTemplate(Object.assign(Object.assign({}, selectedTemplate), { pages: newPagesArray }));
        setCreatingPage(null);
    };
    const onSavePage = (pageId) => {
        if (!creatingPage.name) {
            return;
        }
        const newPagesArray = selectedTemplate.pages.concat(creatingPage);
        const updatedTemplates = templates.map(t => t.id === selectedTemplate.id
            ? {
                name: selectedTemplate.name,
                id: selectedTemplate.id,
                isDefault: selectedTemplate.isDefault,
                pages: newPagesArray
            }
            : t);
        setTemplates(updatedTemplates);
        updateTemplate(updatedTemplates);
        setSelectedTemplate(Object.assign(Object.assign({}, selectedTemplate), { pages: newPagesArray }));
        setCreatingPage(null);
    };
    /** TEMPLATE  */
    const onDeleteTemplate = (templateId) => {
        const newTemplatesArray = templates.filter(p => p.id !== templateId);
        setTemplates(newTemplatesArray);
        deleteTemplate(newTemplatesArray);
        if (selectedTemplate.id == templateId) {
            setSelectedTemplate(newTemplatesArray[0]);
        }
    };
    /** CREATING TEMPLATE */
    const onChangeCreatingTemplate = (value) => {
        setCreatingTemplate(Object.assign(Object.assign({}, creatingTemplate), { name: value }));
        setSelectedTemplate(Object.assign(Object.assign({}, selectedTemplate), { name: value }));
    };
    const onCreateTemplate = () => {
        if (!creatingTemplate.name) {
            return;
        }
        const newTemplatesArray = templates.concat(creatingTemplate);
        setTemplates(newTemplatesArray);
        createTemplate(newTemplatesArray);
        setCreatingTemplate(null);
    };
    const createTemplateFromPages = () => {
        // parent.postMessage(
        //   { pluginMessage: { action: "CREATE_TEMPLATE_FROM_PAGE" } },
        //   "*"
        // );
    };
    const pageIds = selectedTemplate && selectedTemplate.pages.map(p => p.id);
    console.log("coucou", pageIds);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "container" },
            React.createElement("div", { className: "template-container" },
                React.createElement("div", { className: "headtitle" },
                    React.createElement("span", { className: "section-title" }, "Templates"),
                    React.createElement("span", { className: "icon icon--plus icon--button", onClick: openTemplateInput })),
                templates
                    ? templates.map(t => (React.createElement(TemplateField, { key: t.id, name: t.name, id: t.id, pages: t.pages, isDefault: t.isDefault, isSelected: selectedTemplate && t.id === selectedTemplate.id, onSelectTemplate: onSelectTemplate, onDeleteTemplate: onDeleteTemplate })))
                    : null,
                creatingTemplate ? (React.createElement(TemplateInput, { isSelected: true, onChange: onChangeCreatingTemplate, onCreateTemplate: onCreateTemplate, onDeleteCreatingTemplate: () => setCreatingTemplate(null) })) : null),
            React.createElement("div", { className: "page-container" },
                React.createElement("div", { className: "headtitle" },
                    React.createElement("span", { className: "section-title", style: { marginBottom: ".5rem" } }, selectedTemplate ? `Pages in ${selectedTemplate.name}` : "Pages"),
                    React.createElement("span", { className: "icon icon--plus icon--button", onClick: openPageInput })),
                React.createElement("div", { className: "pages" }, selectedTemplate &&
                    selectedTemplate.pages &&
                    selectedTemplate.pages.map(page => {
                        if (creatingPage && creatingPage.id === page.id) {
                            return (React.createElement(PageInput, { key: page.id, page: creatingPage, onChange: (_, value) => {
                                    setCreatingPage(Object.assign(Object.assign({}, creatingPage), { name: value }));
                                }, onDelete: () => { }, onSave: onRenamePage }));
                        }
                        return (React.createElement(PageField, { key: page.id, page: page, onTriggerRename: () => {
                                setCreatingPage(page);
                            }, onDelete: onDeletePage, onSave: onSavePage }));
                    })))),
        React.createElement("div", { className: "footer container" },
            React.createElement("button", { onClick: createTemplateFromPages, className: "button button--secondary" }, "Create template from current document"),
            React.createElement("button", { onClick: () => parent.postMessage({ pluginMessage: { action: "TRIGGER_CHANGES", data: templates } }, "*"), className: "button button--primary" }, "Generate template"))));
};
ReactDOM.render(React.createElement(App, null), document.getElementById("app"));
