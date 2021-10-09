import React, { useState } from "react";
import { User } from "../../App";
import "./Row.style.scss";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { ImCheckboxUnchecked } from "react-icons/im";
import { ImCheckboxChecked } from "react-icons/im";
declare interface RowProps extends User {
  isChecked?: boolean;
  selectionHandler: (id: number) => void;
  deleteHandler: (id: number) => void;
  editHandler: (newUser: User) => void;
}

const Row: React.FC<RowProps> = ({
  name,
  email,
  role,
  isChecked = false,
  selectionHandler,
  id,
  deleteHandler,
  editHandler
}) => {
  const [isEditMode, setInEditMode] = useState(false);
  const [nameText, setNameText] = useState(name);
  const [emailText, setEmailText] = useState(email);
  const [roleText, setRoleText] = useState(role);
  return (
    <div className={`row-container ${isChecked ? "checked" : ""}`}>
      <div className="name">
        {isChecked ? (
          <ImCheckboxChecked size={20} onClick={() => selectionHandler(id)} />
        ) : (
          <ImCheckboxUnchecked size={20} onClick={() => selectionHandler(id)} />
        )}
        {isEditMode ? (
          <input
            value={nameText}
            onChange={(e) => setNameText(e.target.value)}
          />
        ) : (
          name
        )}
      </div>
      <div>
        {isEditMode ? (
          <input
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
          />
        ) : (
          email
        )}
      </div>
      <div>
        {isEditMode ? (
          <input
            value={roleText}
            onChange={(e) => setRoleText(e.target.value)}
          />
        ) : (
          role
        )}
      </div>
      <div className="actions">
        {isEditMode ? (
          <>
            <button
              onClick={() => {
                editHandler({
                  isChecked,
                  id,
                  name: nameText,
                  email: emailText,
                  role: roleText
                });
                setInEditMode(false);
              }}
            >
              Save
            </button>
            <button onClick={() => setInEditMode(false)}>Cancel</button>
          </>
        ) : (
          <>
            <FiEdit onClick={() => setInEditMode(true)} size={20} />
            <MdDeleteOutline
              className="delete-icon"
              onClick={() => deleteHandler(id)}
              size={20}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Row;
