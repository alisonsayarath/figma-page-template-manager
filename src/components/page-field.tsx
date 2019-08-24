import * as React from "react";

export const PageField = ({ page, onChange, onDelete, onSave }) => {
  console.log(page);
  return (
    <div className="field">
      <span>{page.name}</span>
      <span
        className="icon icon--trash icon--button"
        onClick={() => onDelete(page.id)}
      />
    </div>
  );
};
