import * as React from "react";
export const TemplateInput = ({ onChange, isSelected, onDeleteCreatingTemplate, onCreateTemplate }) => {
    return (React.createElement("div", { className: isSelected ? `option option--selected` : `option` },
        React.createElement("input", { type: "text", autoFocus: true, className: "input", placeholder: "Template name...", onChange: e => onChange(e.target.value), onKeyDown: e => {
                if (e.keyCode === 13) {
                    onCreateTemplate();
                }
            } }),
        React.createElement("div", { className: "buttons-wrapper" },
            React.createElement("span", { className: "icon icon--resolve icon--button", onClick: onCreateTemplate }),
            React.createElement("span", { className: "icon icon--trash icon--button", onClick: onDeleteCreatingTemplate }))));
};
