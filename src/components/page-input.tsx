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
        onKeyDown={e => {
          if (e.keyCode === 13) {
            onSave(page.id);
          }
        }}
        autoFocus={true}
      />
      <div className="buttons-wrapper">
        <span
          className="icon icon--resolve icon--button"
          onClick={() => onSave(page.id)}
        />
        <span
          className="icon icon--trash icon--button"
          onClick={() => onDelete(page.id)}
        />
      </div>
    </div>
  );
};
