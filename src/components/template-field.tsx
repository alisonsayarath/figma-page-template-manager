import * as React from "react";
import { Template } from "../types";

type TemplateFieldProps = {
  isSelected?: boolean;
  onDeleteTemplate: (string) => void;
  onSelectTemplate: (Template) => void;
};

export const TemplateField = ({
  isSelected,
  name,
  id,
  pages,
  isDefault,
  onDeleteTemplate,
  onSelectTemplate
}: TemplateFieldProps & Template) => {
  return (
    <div
      className={isSelected ? `option option--selected` : `option`}
      onClick={() => onSelectTemplate({ name, id, isDefault, pages })}
    >
      <span>{name}</span>
      <span
        className="icon icon--trash icon--button"
        onClick={() => onDeleteTemplate(id)}
      />
    </div>
  );
};
