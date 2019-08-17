import * as React from "react";
import { Template } from "../types";

type TemplateFieldProps = {
  isSelected?: boolean;
  onSelectTemplate: (Template) => void;
};

export const TemplateField = ({
  isSelected,
  onSelectTemplate,
  name,
  id,
  isDefault
}: TemplateFieldProps & Template) => {
  return (
    <div
      className={isSelected ? `option option--selected` : `option`}
      onClick={() => onSelectTemplate({ name, id, isDefault })}
    >
      <span>{name}</span>
      <span className="icon icon--trash icon--button" />
    </div>
  );
};
