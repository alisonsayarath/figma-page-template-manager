import * as React from "react";
export const PageField = ({ page, onTriggerRename, onDelete, onSave }) => {
    return (React.createElement("div", { className: "field" },
        React.createElement("span", null, page.name),
        React.createElement("div", { className: "buttons-wrapper" },
            React.createElement("span", { className: "icon icon--break icon--button", onClick: onTriggerRename }),
            React.createElement("span", { className: "icon icon--trash icon--button", onClick: () => onDelete(page.id) }))));
};
