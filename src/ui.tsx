import * as React from "react";
import { useState, useEffect, useRef } from "react";
import * as ReactDOM from "react-dom";

import { Pages, TemporaryPageId, PageName, Template } from "./types";
import {
  createTemplate,
  deleteTemplate,
  updateTemplate
} from "./services/templates";

import { PageField } from "./components/page-field";
import { PageInput } from "./components/page-input";
import { TemplateField } from "./components/template-field";
import { TemplateInput } from "./components/template-input";

import "./styles/figma.css";
import "./styles/ui.css";

const App = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [creatingTemplate, setCreatingTemplate] = useState<Template | null>(
    null
  );
  const [creatingPage, setCreatingPage] = useState<Template>(null);

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

  const onSelectTemplate = (template: Template) => {
    setCreatingTemplate(null);
    setCreatingPage(null);
    setSelectedTemplate(template);
  };

  /** PAGES */

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
    updateTemplate(updatedTemplates);
    setSelectedTemplate({ ...selectedTemplate, pages: newPagesArray });
  };

  const onRenamePage = (pageId: TemporaryPageId) => {
    if (!creatingPage.name) {
      return;
    }

    const newPagesArray = selectedTemplate.pages.map(p =>
      p.id === pageId ? { id: pageId, name: creatingPage.name } : p
    );
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
    updateTemplate(updatedTemplates);
    setSelectedTemplate({ ...selectedTemplate, pages: newPagesArray });
    setCreatingPage(null);
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
    updateTemplate(updatedTemplates);
    setSelectedTemplate({ ...selectedTemplate, pages: newPagesArray });
    setCreatingPage(null);
  };

  /** TEMPLATE  */

  const onDeleteTemplate = (templateId: string) => {
    const newTemplatesArray = templates.filter(p => p.id !== templateId);
    setTemplates(newTemplatesArray);
    deleteTemplate(newTemplatesArray);

    if (selectedTemplate.id == templateId) {
      setSelectedTemplate(newTemplatesArray[0]);
    }
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
              selectedTemplate.pages.map(page => {
                if (creatingPage && creatingPage.id === page.id) {
                  return (
                    <PageInput
                      key={page.id}
                      page={creatingPage}
                      onChange={(_: string, value: string) => {
                        setCreatingPage({ ...creatingPage, name: value });
                      }}
                      onDelete={() => {}}
                      onSave={onRenamePage}
                    />
                  );
                }
                return (
                  <PageField
                    key={page.id}
                    page={page}
                    onTriggerRename={() => {
                      setCreatingPage(page);
                    }}
                    onDelete={onDeletePage}
                    onSave={onSavePage}
                  />
                );
              })}

            {/* {creatingPage && !pageIds.includes(creatingPage.id) ? (
              <PageInput
                page={creatingPage}
                onChange={(_: string, value: string) => {
                  setCreatingPage({ ...creatingPage, name: value });
                }}
                onDelete={() => {}}
                onSave={onSavePage}
              />
            ) : null} */}
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
