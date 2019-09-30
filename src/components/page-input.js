import * as React from "react";
export const PageInput = ({ page, onChange, onDelete, onSave }) => {
    return (React.createElement("div", { className: "field" },
        React.createElement("input", { className: "input", id: "count", placeholder: "Page name", value: page.name, onChange: e => onChange(page.id, e.target.value), onKeyDown: e => {
                if (e.keyCode === 13) {
                    onSave(page.id);
                }
            }, autoFocus: true }),
        React.createElement("div", { className: "buttons-wrapper" },
            React.createElement("span", { className: "icon icon--resolve icon--button", onClick: () => onSave(page.id) }),
            React.createElement("span", { className: "icon icon--trash icon--button", onClick: () => onDelete(page.id) }))));
};
