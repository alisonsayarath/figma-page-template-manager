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
        onChange={e => onChange(page.id, e.target.value)}
      />
      <button
        className="button button--secondary-destructive"
        onClick={() => onDelete(page.id)}
      >
        Delete
      </button>
    </div>
  );
};

const App = () => {
  const [pages, setPages] = useState<Pages>([]);

  onmessage = event => {
    setPages(event.data.pluginMessage);
  };

  const triggerChanges = () => {
    parent.postMessage({ pluginMessage: { data: pages } }, "*");
  };

  const onChangeName = (pageId: PageId, value: PageName) => {
    const updatedPages = pages.map(p =>
      p.id == pageId ? { id: pageId, name: value } : p
    );
    setPages(updatedPages);
  };

  const onDeletePage = (pageId: PageId) => {
    const updatedPages = pages.filter(p => p.id !== pageId);
    setPages(updatedPages);
  };

  const onCreatePage = () => {
    setPages(pages.concat({ name: "V3" }));
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { quit: true } }, "*");
  };

  return (
    <>
      <div className="container">
        {pages &&
          pages.map((page, i) => (
            <PageField
              key={page.id || i}
              page={page}
              onChange={onChangeName}
              onDelete={onDeletePage}
            />
          ))}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="button button--secondary" onClick={onCreatePage}>
            Create a new page
          </button>
        </div>
      </div>
      <div className="footer container">
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
