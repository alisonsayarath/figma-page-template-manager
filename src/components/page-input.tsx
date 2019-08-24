import * as React from "react";

export const PageInput = ({ page, onChange, onDelete, onSave }) => {
  return (
    <div className="field">
      <input
        className="input"
        id="count"
        placeholder="Page name"
        value={page.name}
        onChange={e => onChange(page.id, e.target.value)}
        autoFocus={!page.name}
      />
      <span
        className="icon icon--plus icon--button"
        onClick={() => onSave(page.id)}
      />
      <span
        className="icon icon--trash icon--button"
        onClick={() => onDelete(page.id)}
      />
    </div>
  );
};
