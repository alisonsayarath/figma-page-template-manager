import * as React from "react";
import { useState } from "react";
import * as ReactDOM from "react-dom";

import { Pages, PageId, PageName, MessageState } from "./types";
import "./ui.css";

const PageField = ({ page, onChange, onDelete }) => {
  return (
    <div className="field">
      <input
        className="input"
        id="count"
        placeholder="Page name"
        value={page.name}
        onChange={e => onChange(page._temporaryId, e.target.value)}
        autoFocus={!page.name}
      />
      <button
        className="button button--secondary-destructive"
        onClick={() => onDelete(page._temporaryId)}
      >
        Delete
      </button>
    </div>
  );
};

const App = () => {
  const [pages, setPages] = useState<Pages>([]);

  onmessage = event => {
    setPages(formatPages(event.data.pluginMessage));
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

  const onRenamePage = (pageId: PageId, value: PageName) => {
    const updatedPages = pages.map(p =>
      p._temporaryId === pageId ? { _temporaryId: pageId, name: value } : p
    );
    setPages(updatedPages);
  };

  const onDeletePage = (pageId: PageId) => {
    const updatedPages = pages.filter(p => p._temporaryId !== pageId);
    setPages(updatedPages);
  };

  const onCreatePage = () => {
    setPages(pages.concat({ _temporaryId: `${pages.length}`, name: "" }));
  };

  const onCancel = () =>
    parent.postMessage({ pluginMessage: { action: "QUIT_PLUGIN" } }, "*");

  const createTemplateFromPages = () => {
    parent.postMessage(
      { pluginMessage: { action: "CREATE_TEMPLATE_FROM_PAGE" } },
      "*"
    );
  };

  const hasNewPage = pages.filter(p => !p.id && !p.name).length;

  return (
    <>
      <div className="container">
        {pages &&
          pages.map(page => (
            <PageField
              key={page._temporaryId}
              page={page}
              onChange={onRenamePage}
              onDelete={onDeletePage}
            />
          ))}
        {/* {hasNewPage ? ( */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="button button--secondary" onClick={onCreatePage}>
            Create a new page
          </button>
        </div>
        {/* ) : null} */}
      </div>
      <div className="footer container">
        <button
          onClick={createTemplateFromPages}
          className="button button--secondary"
        >
          Create template from current document
        </button>
        <button onClick={onCancel} className="button button--secondary">
          Cancel changes
        </button>
        <button onClick={triggerChanges} className="button button--primary">
          Trigger changes
        </button>
      </div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
