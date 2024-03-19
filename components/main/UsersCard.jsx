"use client";

/* react */
import { useState } from "react";

/* utils */
import moment from "moment";

/* react-icons */
import { IoImageOutline } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";

/* next */
import { usePathname } from "next/navigation";

export default function UsersCard({
  user,
  goal = "none",
  name,
  email,
  found,
  purpose,
  avatarUrl,
  lastImage,
  newMessage,
  createChat,
  lastMessage,
  createChatLoading,
  lastMessageSentTime,
}) {
  // const [createChatLoading, setCreateChatLoading] = useState(false);
  /*  
    時間格式 
    - a few seconds ago
    - 6 minutes ago
    - 3 hours ago
    - 5 days ago
  */
  const formatTimeAgo = (timestamp) => {
    const date = timestamp.toDate();
    const momentDate = moment(date);
    return momentDate.fromNow();
  };

  return (
    <>
      <div
        className={`
          ${found ? "hover:cursor-pointer" : ""} 
          hover:bg-base-300 px-4 w-full flex items-center justify-between rounded p-3 relative
        `}
      >
        {/* <div className="relative"> */}
        {/* avatar && new-message-indicator */}
        <div className="flex-shrink-0 mr-4 relative">
          <div className="w-12 h-12 rounded-full overflow-hidden avatar-bg">
            <img
              className="w-full h-full object-cover"
              src={
                avatarUrl
                  ? avatarUrl
                  : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToK4qEfbnd-RN82wdL2awn_PMviy_pelocqQ&usqp=CAU"
              }
              alt="Avatar"
            />
          </div>
        </div>

        <div className="flex-1">
          {/* name and last message sent time */}
          <div className="flex items-center justify-between">
            <h2 className="text-md font-semibold truncate text-base-content max-w-[120px] truncate">
              {name}
            </h2>
            <div className="text-xs text-base-content truncate time-stamp-deskto max-w-[60px] truncate">
              {lastMessageSentTime ? formatTimeAgo(lastMessageSentTime) : ""}
            </div>
          </div>

          {/* last message && new message badge */}
          <div className="flex justify-between">
            <p
              className={`${
                !lastMessage && !lastImage ? "block" : "hidden"
              } text-base-content truncate text-sm text-desktop text-tablet text-phone text-watch`}
            >
              {email}
            </p>

            {/* Render message if user submit message only */}
            <p
              className={`
              ${found && lastMessage && !lastImage ? "block" : "hidden"} 
              text-base-content truncate text-sm text-desktop text-tablet text-phone
              ${newMessage != 0 ? "opacity-1" : "opacity-50"}              
            `}
            >
              {lastMessage}
            </p>

            {/* Render image icon if user submit image only */}
            <p
              className={`${
                found && !lastMessage && lastImage ? "block" : "hidden"
              } text-base-content truncate text-sm text-desktop text-tablet text-phone`}
            >
              <IoImageOutline className="w-5 h-5 opacity-50" />
            </p>

            {/* Render image icon and message if user submit image and message both */}
            <div
              className={`${
                found && lastMessage && lastImage ? "block" : "hidden"
              } border- flex text-base-content truncate text-sm text-desktop text-tablet text-phone`}
            >
              <IoImageOutline className="w-5 h-5" />
              <span className="ml-2 truncate">{lastMessage}</span>
            </div>

            {/* message count is optional !!! */}
            <div
              className={`
              ${newMessage >= 1 ? "block badge badge-primary" : "hidden"}
              text-xs flex items-center
            `}
            >
              {newMessage}
            </div>
          </div>
        </div>
        {goal == "addFriend" && (
          <>
            <span
              className={`${
                createChatLoading ? "block" : "hidden"
              } loading loading-spinner loading-sm text-base-content absolute right-3 top-[50%] translate-y-[-50%]`}
            />
            <IoIosAddCircleOutline
              className={`${
                createChatLoading ? "hidden" : "block"
              } w-6 h-6 text-base-content absolute right-3 top-[50%] translate-y-[-50%] hover:cursor-pointer`}
              // onClick={() => createChat(user)}
              onClick={createChat}
            />
          </>
        )}
      </div>
    </>
  );
}
