import * as React from "react";
import { useState } from "react";
import * as ReactDOM from "react-dom";

import { FigmaDocument } from "./types";
import "./ui.css";

const App = () => {
  const [pages, setPages] = useState<FigmaDocument>([]);

  onmessage = event => {
    setPages(event.data.pluginMessage);
  };

  React.useEffect(() => {
    console.log(pages);
  }, [pages]);

  return (
    <>
      <div>
        <input className="input" id="count" placeholder="Page name" />
        <button className="button button--primary" id="create">
          Create a new page
        </button>
      </div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
