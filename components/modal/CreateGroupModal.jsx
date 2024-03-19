import React from "react";

export default function CreateGroupModal({ id }) {
  return (
    <dialog id={id} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Create Group</h3>
          <p className="py-4">Please select your group members !</p>
        </div>
      </dialog>
  );
}
