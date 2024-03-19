import React from "react";

export default function DeleteModal({id, msgId, deleteMsg}) {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Warning ! 🤔</h3>
        <p className="py-4">Are you sure to delete this message ?</p>
        <div className="modal-action">
          <button
            className="btn btn-error"
            onClick={() => deleteMsg(msgId)}
            // onClick={() => handleDeleteMsg(message.id)}
          >
            Yes
          </button>
          <button
            className="btn"
            onClick={() => document.getElementById("deleteMsgModal").close()}
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
