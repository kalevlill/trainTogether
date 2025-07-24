import React from "react";
import "../style/DasMenu.css";

function DasMenu({ onCreate, onUpdate, onDelete }) {
  return (
    <div className="das-menu">
      <button onClick={onCreate}>Create</button>
      <button onClick={onUpdate}>Update</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}

export default DasMenu;