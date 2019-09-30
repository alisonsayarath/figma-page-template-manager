import * as React from "react";
export const TemplateField = ({ isSelected, name, id, pages, isDefault, onDeleteTemplate, onSelectTemplate }) => {
    return (React.createElement("div", { className: isSelected ? `option option--selected` : `option`, onClick: () => onSelectTemplate({ name, id, isDefault, pages }) },
        React.createElement("span", null,
            name,
            " ",
            React.createElement("span", { className: "text--lighter" },
                "(",
                pages.length ? `${pages.length}` : "no",
                " ",
                pages.length === 1 ? "page" : "pages",
                ")")),
        React.createElement("span", { className: "icon icon--trash icon--button", onClick: () => onDeleteTemplate(id) })));
};
