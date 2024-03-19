/* utils */
import moment from "moment";

/* next */
import Image from "next/image";

/* react-icons */
import { CiMenuKebab } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { MdOutlineModeEditOutline } from "react-icons/md";

/* react */
import { useState } from "react";

/* components */
import DeleteMsgModal from "../modal/DeleteMsgModal";

function MessageCard({ message, me, other, deleteMsg }) {
  const isMessageFromMe = message.sender === me.id;

  const [deleteMsgMenu, setDeleteMsgMenu] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  const getCurrentDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const currentDate = `${month}/${day}/${year}`;
    return currentDate;
  };

  const getYesterday = () => {
    const date = new Date();
    const day = date.getDate() - 1;
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const yesterday = `${month}/${day}/${year}`;
    return yesterday;
  };

  // Format: 03/12/2024
  const formatDate = (timestamp) => {
    const date = timestamp?.toDate();
    const momentDate = moment(date);
    return momentDate.format("l");
  };

  // 2:21PM
  const formatTimeClock = (timestamp) => {
    const date = timestamp?.toDate();
    const momentDate = moment(date);
    return momentDate.format("LT");
  };

  return (
    <>
      {/* <div className="divide text-[10px] flex justify-center my-2 opacity-50 overflow-x-hidde">
        {formatDate(message.time) == getCurrentDate()
          ? "Today"
          : formatDate(message.time) == getYesterday()
          ? "Yesterday"
          : formatDate(message.time).substring(
              0,
              formatDate(message.time).length - 5
            )}
      </div> */}
      {/* : moment(message?.time.toDate()).format("MMM Do") */}

      <div
        key={message.id}
        className={`
          ${isMessageFromMe ? "chat-end" : "chat-start"}
          chat border- border-red-30
        `}
      >
        <div className="chat-image avatar">
          <div className="w-6 rounded-full bg-[url('/avatar.png')]">
            <img
              tabIndex={0}
              src={isMessageFromMe ? me.avatarUrl : other.avatarUrl}
              alt="Avatar"
              role="button"
              className="object-cover"
            />
          </div>
        </div>

        <div 
          className={`
            chat-header flex ml-1
            ${isMessageFromMe ? 'mr-2' : 'ml-2'}
          `}
        >
          <time className="opacity-50 text-[10px]">
            {formatTimeClock(message.time)}
          </time>
        </div>

        <div
          className={`
            ${
              isMessageFromMe
                ? "chat-bubble chat-bubble-accent"
                : "chat-bubble chat-bubble-primary"
            } 
            flex flex-col items-center justify-center border- border-green-30                      
            string-break relative
          `}
        >
          <img src={message.image} className="max-h-60 rounded" />
          <p
            className={`
                leading-tight string-break text-sm border- border-red-30
                ${
                  isMessageFromMe
                    ? "text-accent-content"
                    : "text-primary-content"
                }
                ${message.image ? "mt-2" : "flex justify-start"}             
            `}
          >
            {message.content}
          </p>
        </div>
        <div className="chat-footer opacity-50 ml-1 text-[10px]">Read</div>

        {/* Option Icon */}
        <div className="dropdown dropdown-left dropdown-end">
          <CiMenuKebab
            tabIndex={0}
            role="button"
            className={`
              ${isMessageFromMe ? "left-[-20px]" : "hidden"} 
              absolute left-[-47px] top-[-45px] w-5 h-5 hover:cursor-pointer text-warning opacity-50
            `}
          />
          <ul
            tabIndex={0}
            className={`
                dropdown-content z-[100] menu menu-horizontal
                flex bg-base-300 rounded-box shadow
              `}
          >
            <li>
              <a className="toolti tooltip-lef" data-tip="Edit">
                <MdOutlineModeEditOutline className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a className="toolti tooltip-lef" data-tip="Delete">
                <MdOutlineDeleteOutline
                  className="w-5 h-5"
                  onClick={() => deleteMsg(message.id)}
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default MessageCard;
