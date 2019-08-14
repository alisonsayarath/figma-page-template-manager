import * as React from "react";
import { useState } from "react";
import * as ReactDOM from "react-dom";

import { FigmaDocument } from "./types";
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
  const [pages, setPages] = useState<FigmaDocument>([]);

  onmessage = event => {
    setPages(event.data.pluginMessage);
  };

  const setData = (updatedPages: FigmaDocument) => {
    parent.postMessage({ pluginMessage: updatedPages }, "*");
    setPages(updatedPages);
  };

  const onChangeName = (pageId, value: string) => {
    const updatedPages = pages.map(p =>
      p.id == pageId ? { id: pageId, name: value } : p
    );
    setData(updatedPages);
  };

  const onDeletePage = pageId => {
    const updatedPages = pages.filter(p => p.id !== pageId);
    setData(updatedPages);
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
        <button className="button button--primary" id="create">
          Create a new page
        </button>
      </div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
