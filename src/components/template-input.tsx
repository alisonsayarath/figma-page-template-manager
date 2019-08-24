import * as React from "react";

type TemplateInputProps = {
  isSelected: boolean;
  onChange: (string) => void;
  onDeleteCreatingTemplate: () => void;
  onCreateTemplate: () => void;
};

export const TemplateInput = ({
  onChange,
  isSelected,
  onDeleteCreatingTemplate,
  onCreateTemplate
}: TemplateInputProps) => {
  return (
    <div className={isSelected ? `option option--selected` : `option`}>
      <input
        type="text"
        autoFocus={true}
        className="input"
        placeholder="Template name..."
        onChange={e => onChange(e.target.value)}
      />
      <div className="buttons-wrapper">
        <span
          className="icon icon--resolve icon--button"
          onClick={onCreateTemplate}
        />
        <span
          className="icon icon--trash icon--button"
          onClick={onDeleteCreatingTemplate}
        />
      </div>
    </div>
  );
};
