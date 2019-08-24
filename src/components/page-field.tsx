import * as React from "react";

export const PageField = ({ page, onTriggerRename, onDelete, onSave }) => {
  return (
    <div className="field">
      <span>{page.name}</span>
      <div className="buttons-wrapper">
        <span
          className="icon icon--break icon--button"
          onClick={onTriggerRename}
        />
        <span
          className="icon icon--trash icon--button"
          onClick={() => onDelete(page.id)}
        />
      </div>
    </div>
  );
};
