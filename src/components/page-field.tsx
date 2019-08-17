import * as React from "react";

export const PageField = ({ page, onChange, onDelete }) => {
  return (
    <div className="field">
      <input
        className="input"
        id="count"
        placeholder="Page name"
        value={page.name}
        onChange={e => onChange(page._temporaryId, e.target.value)}
        autoFocus={!page.name}
      />
      <span
        className="icon icon--trash icon--button"
        onClick={() => onDelete(page._temporaryId)}
      />
    </div>
  );
};
