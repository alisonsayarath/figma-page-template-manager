import * as React from "react";
import { useState } from "react";
import * as ReactDOM from "react-dom";
import "./ui.css";
const PageField = ({ page, onChange, onDelete }) => {
    return (React.createElement("div", { className: "field" },
        React.createElement("input", { className: "input", id: "count", placeholder: "Page name", value: page.name, onChange: e => onChange(page.id, e.target.value) }),
        React.createElement("button", { className: "button button--secondary-destructive", onClick: () => onDelete(page.id) },
            React.createElement("div", { className: "icon icon--trash icon--red" }))));
};
const App = () => {
    const [pages, setPages] = useState([]);
    onmessage = event => {
        setPages(event.data.pluginMessage);
    };
    const triggerChanges = () => {
        parent.postMessage({ pluginMessage: { data: pages } }, "*");
    };
    const onChangeName = (pageId, value) => {
        const updatedPages = pages.map(p => p.id == pageId ? { id: pageId, name: value } : p);
        setPages(updatedPages);
    };
    const onDeletePage = (pageId) => {
        const updatedPages = pages.filter(p => p.id !== pageId);
        setPages(updatedPages);
    };
    const onCreatePage = () => {
        setPages(pages.concat({ name: "V1" }));
    };
    const onCancel = () => {
        parent.postMessage({ pluginMessage: { quit: true } }, "*");
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "container" },
            pages &&
                pages.map((page, i) => (React.createElement(PageField, { key: page.id || i, page: page, onChange: onChangeName, onDelete: onDeletePage }))),
            React.createElement("div", { style: { display: "flex", justifyContent: "flex-end" } },
                React.createElement("button", { className: "button button--secondary", onClick: onCreatePage }, "Create a new page"))),
        React.createElement("div", { className: "footer container" },
            React.createElement("button", { onClick: onCancel, className: "button button--secondary" }, "Cancel changes"),
            React.createElement("button", { onClick: triggerChanges, className: "button button--primary" }, "Trigger changes"))));
};
ReactDOM.render(React.createElement(App, null), document.getElementById("app"));
