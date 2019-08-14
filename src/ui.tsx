import * as React from "react";
import { useState } from "react";
import * as ReactDOM from "react-dom";

import { FigmaDocument } from "./types";
import "./ui.css";

const PageField = ({ page, onChange }) => {
  return (
    <div className="field">
      <input
        className="input"
        id="count"
        placeholder="Page name"
        value={page.name}
        onChange={e => onChange(page.id, e.target.value)}
      />
      <button className="button button--secondary-destructive" id="create">
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

  const onChangeName = (pageId, value: string) => {
    const updatedPages = pages.map(p =>
      p.id == pageId ? { id: pageId, name: value } : p
    );

    setPages(updatedPages);
  };

  React.useEffect(() => {
    console.log(pages);
  }, [pages]);

  return (
    <>
      <div>
        {pages &&
          pages.map((page, i) => (
            <PageField key={page.id} page={page} onChange={onChangeName} />
          ))}
        <button className="button button--primary" id="create">
          Create a new page
        </button>
      </div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
