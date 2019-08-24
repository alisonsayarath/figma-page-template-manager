import * as React from "react";
import { useState, useEffect, useRef } from "react";
import * as ReactDOM from "react-dom";

import { Pages, TemporaryPageId, PageName, Template } from "./types";

import { PageField } from "./components/page-field";
import { PageInput } from "./components/page-input";
import { TemplateField } from "./components/template-field";
import { TemplateInput } from "./components/template-input";

import "./figma.css";
import "./ui.css";

const App = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(null);
  const [creatingTemplate, setCreatingTemplate] = useState<Template | null>(
    null
  );

  const [creatingPage, setCreatingPage] = useState(null);

  onmessage = ({ data }) => {
    setTemplates(data.pluginMessage);
    if (data.pluginMessage) {
      setSelectedTemplate(data.pluginMessage[0]);
    }
  };

  // useEffect(() => {
  //   if (selectedTemplate) setPages(selectedTemplate.pages);
  // }, [selectedTemplate]);

  const openTemplateInput = () => {
    const creatingTemplateMock = {
      name: "",
      id: (templates.length + 1).toString(),
      isDefault: false,
      pages: []
    };

    setCreatingTemplate(creatingTemplateMock);
  };

  const openPageInput = () => {
    const creatingPageMock = {
      name: "",
      id: (selectedTemplate.pages.length + 1).toString()
    };

    setCreatingPage(creatingPageMock);
  };

  const onSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };

  /** PAGES */

  const onRenamePage = (pageId: TemporaryPageId, value: PageName) => {
    const updatedPages = selectedTemplate.pages.map(p =>
      p.id === pageId ? { id: pageId, name: value } : p
    );
    setSelectedTemplate({ ...selectedTemplate, pages: updatedPages });
  };

  const onDeletePage = (pageId: TemporaryPageId) => {
    const newPagesArray = selectedTemplate.pages.filter(p => p.id !== pageId);
    const updatedTemplates = templates.map(t =>
      t.id === selectedTemplate.id
        ? {
            name: selectedTemplate.name,
            id: selectedTemplate.id,
            isDefault: selectedTemplate.isDefault,
            pages: newPagesArray
          }
        : t
    );

    setTemplates(updatedTemplates);
    parent.postMessage(
      { pluginMessage: { action: "CHANGE_TEMPLATE", data: updatedTemplates } },
      "*"
    );
  };

  const onCreatePage = () => {
    const newPagesArray = selectedTemplate.pages.concat({
      id: (selectedTemplate.pages.length + 1).toString(),
      name: ""
    });

    setSelectedTemplate({ ...selectedTemplate, pages: newPagesArray });
  };

  const onSavePage = (pageId: TemporaryPageId) => {
    if (!creatingPage.name) {
      return;
    }

    const newPagesArray = selectedTemplate.pages.concat(creatingPage);
    const updatedTemplates = templates.map(t =>
      t.id === selectedTemplate.id
        ? {
            name: selectedTemplate.name,
            id: selectedTemplate.id,
            isDefault: selectedTemplate.isDefault,
            pages: newPagesArray
          }
        : t
    );

    setTemplates(updatedTemplates);
    parent.postMessage(
      { pluginMessage: { action: "CHANGE_TEMPLATE", data: updatedTemplates } },
      "*"
    );
    setCreatingPage(null);
  };

  /** TEMPLATE  */

  const onDeleteTemplate = id => {
    // const updatedTemplates = TEMPLATES.filter(p => p.id !== id);
    // setTemplates(updatedTemplates);
  };

  /** CREATING TEMPLATE */

  const onChangeCreatingTemplate = (value: string) => {
    setCreatingTemplate({ ...creatingTemplate, name: value });
    setSelectedTemplate({ ...selectedTemplate, name: value });
  };

  const onCreateTemplate = () => {
    if (!creatingTemplate.name) {
      return;
    }

    const newTemplatesArray = templates.concat(creatingTemplate);
    setTemplates(newTemplatesArray);
    parent.postMessage(
      { pluginMessage: { action: "CREATE_TEMPLATE", data: newTemplatesArray } },
      "*"
    );
    setCreatingTemplate(null);
  };

  const createTemplateFromPages = () => {
    // parent.postMessage(
    //   { pluginMessage: { action: "CREATE_TEMPLATE_FROM_PAGE" } },
    //   "*"
    // );
  };

  return (
    <>
      <div className="container">
        <div className="template-container">
          <div className="headtitle">
            <span className="section-title">Templates</span>
            <span
              className="icon icon--plus icon--button"
              onClick={openTemplateInput}
            />
          </div>
          {templates
            ? templates.map(t => (
                <TemplateField
                  key={t.id}
                  name={t.name}
                  id={t.id}
                  pages={t.pages}
                  isDefault={t.isDefault}
                  isSelected={selectedTemplate && t.id === selectedTemplate.id}
                  onSelectTemplate={onSelectTemplate}
                  onDeleteTemplate={onDeleteTemplate}
                />
              ))
            : null}
          {creatingTemplate ? (
            <TemplateInput
              isSelected={true}
              onChange={onChangeCreatingTemplate}
              onCreateTemplate={onCreateTemplate}
              onDeleteCreatingTemplate={() => setCreatingTemplate(null)}
            />
          ) : null}
        </div>
        <div className="page-container">
          <div className="headtitle">
            <span className="section-title" style={{ marginBottom: ".5rem" }}>
              {selectedTemplate ? `Pages in ${selectedTemplate.name}` : "Pages"}
            </span>
            <span
              className="icon icon--plus icon--button"
              onClick={openPageInput}
            />
          </div>
          <div className="pages">
            {selectedTemplate &&
              selectedTemplate.pages &&
              selectedTemplate.pages.map(page => (
                <PageField
                  key={page.id}
                  page={page}
                  onChange={onRenamePage}
                  onDelete={onDeletePage}
                  onSave={onSavePage}
                />
              ))}
            {creatingPage ? (
              <PageInput
                page={creatingPage}
                onChange={(_: string, value: string) => {
                  setCreatingPage({ ...creatingPage, name: value });
                }}
                onDelete={() => {}}
                onSave={onSavePage}
              />
            ) : null}
          </div>
        </div>
      </div>
      <div className="footer container">
        <button
          onClick={createTemplateFromPages}
          className="button button--secondary"
        >
          Create template from current document
        </button>
        <button
          onClick={() =>
            parent.postMessage(
              { pluginMessage: { action: "TRIGGER_CHANGES", data: templates } },
              "*"
            )
          }
          className="button button--primary"
        >
          Generate template
        </button>
      </div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
