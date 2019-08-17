import * as React from "react";
import { useState } from "react";
import * as ReactDOM from "react-dom";

import { Pages, TemporaryPageId, PageName, Template } from "./types";
import { PageField } from "./components/page-field";
import { TemplateField } from "./components/template-field";
import "./figma.css";
import "./ui.css";

const TEMPLATES = [
  { name: "Premier template", id: "1", isDefault: false },
  { name: "Deuxième template", id: "2", isDefault: true },
  { name: "Troisième template", id: "3", isDefault: false }
] as Template[];

const App = () => {
  const [pages, setPages] = useState<Pages>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(null);

  onmessage = event => {
    setPages(formatPages(event.data.pluginMessage));
    const selectedTemplate = TEMPLATES.filter(t => t.isDefault === true);
    setSelectedTemplate(selectedTemplate[0]);
  };

  const onSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };

  const formatPages = (pages: Pages) =>
    pages.map((item, index) => ({
      name: item.name,
      _temporaryId: index.toString()
    }));

  const triggerChanges = () => {
    parent.postMessage(
      { pluginMessage: { action: "TRIGGER_CHANGES", data: pages } },
      "*"
    );
  };

  const onRenamePage = (pageId: TemporaryPageId, value: PageName) => {
    const updatedPages = pages.map(p =>
      p._temporaryId === pageId ? { _temporaryId: pageId, name: value } : p
    );
    setPages(updatedPages);
  };

  const onDeletePage = (pageId: TemporaryPageId) => {
    const updatedPages = pages.filter(p => p._temporaryId !== pageId);
    setPages(updatedPages);
  };

  const onCreatePage = () => {
    setPages(pages.concat({ _temporaryId: `${pages.length}`, name: "" }));
  };

  const createTemplateFromPages = () => {
    parent.postMessage(
      { pluginMessage: { action: "CREATE_TEMPLATE_FROM_PAGE" } },
      "*"
    );
  };

  return (
    <>
      <div className="container">
        <div className="template-container">
          <div className="headtitle">
            <span className="section-title">Templates</span>
            <span className="icon icon--plus icon--button" />
          </div>
          {TEMPLATES.map(t => (
            <TemplateField
              key={t.id}
              name={t.name}
              id={t.id}
              isDefault={t.isDefault}
              isSelected={selectedTemplate && t.id == selectedTemplate.id}
              onSelectTemplate={onSelectTemplate}
            />
          ))}
        </div>
        <div className="page-container">
          <div className="headtitle">
            <span className="section-title" style={{ marginBottom: ".5rem" }}>
              {selectedTemplate ? `Pages in ${selectedTemplate.name}` : "Pages"}
            </span>
            <span
              className="icon icon--plus icon--button"
              onClick={onCreatePage}
            />
          </div>
          <div className="pages">
            {pages &&
              pages.map(page => (
                <PageField
                  key={page._temporaryId}
                  page={page}
                  onChange={onRenamePage}
                  onDelete={onDeletePage}
                />
              ))}
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
        <button onClick={triggerChanges} className="button button--primary">
          Generate template
        </button>
      </div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
