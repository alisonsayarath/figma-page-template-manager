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
    parent.postMessage({ pluginMessage: { state: "TRIGGER_CHANGES" } }, "*");
  };

  const setData = (updatedPages: Pages, state: MessageState) => {
    parent.postMessage({ pluginMessage: { state, data: updatedPages } }, "*");
    setPages(updatedPages);
  };

  const onChangeName = (pageId: PageId, value: PageName) => {
    const updatedPages = pages.map(p =>
      p.id == pageId ? { id: pageId, name: value } : p
    );
    setData(updatedPages, "PAGE_RENAMED");
  };

  const onDeletePage = (pageId: PageId) => {
    const updatedPages = pages.filter(p => p.id !== pageId);
    setData(updatedPages, "PAGE_DELETED");
  };

  const onCreatePage = () => {
    setData(pages.concat({ id: pages.length + 1, name: "" }), "PAGE_CREATED");
  };

  return (
    <>
      <div>
        {pages &&
          pages.map((page, i) => (
            <PageField
              key={page.id}
              page={page}
              onChange={onChangeName}
              onDelete={onDeletePage}
            />
          ))}
        <button
          className="button button--primary"
          id="create"
          onClick={onCreatePage}
        >
          Create a new page
        </button>

        <button
          onClick={triggerChanges}
          className="button button--primary"
          id="create"
        >
          Trigger changes
        </button>
      </div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
