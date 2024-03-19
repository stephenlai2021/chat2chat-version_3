"use client";

/* next */
import { useRouter } from "next/navigation";
import Link from "next/link";

/* react-icons */
import { IoMdChatboxes } from "react-icons/io";
import { IoPersonAddSharp } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { BsChatDots } from "react-icons/bs";
import { RiUserAddLine } from "react-icons/ri";
import { GrGroup } from "react-icons/gr";
import { RxAvatar } from "react-icons/rx";
import { BsPersonAdd } from "react-icons/bs";
import { AiOutlineUsergroupAdd } from "react-icons/ai";

/* components */
import UsersCard from "./UsersCard";
import ThemeSwitcher from "../switcher/ThemeSwitcher";
import AddFriendModal from "../modal/AddFriendModal";
import EditProfileModal from "../modal/EditProfileModal";

/* utils */
import { languages } from "@/data/utils";

/* zustand */
import { useStore } from "@/zustand/store";

export default function BottomNavbar({ userData }) {
  const router = useRouter();
  const {
    setSelectedChatroom,
    mobile,
    toggleMobile,
    userDataStore,
    setUserDataStore,
  } = useStore();

  const handleAddFriend = () => {
    router.push("/addfriend");
    toggleMobile();
  };

  const handleCreateGroup = () => {
    router.push("/creategroup");
    toggleMobile();
  };

  return (
    <div className="mt-auto hidden users-mobile">
      <div className="btm-na h-14 w-full flex bg-base-200 shadow-inner">
        <div className={`w-1/3 flex flex-col justify-center items-center`}>
          <BsPersonAdd
            className={`w-[23px] h-[23px] font-bold text-base-content hover:cursor-pointer`}
            onClick={() =>
              document.getElementById("addFriendModalBottomNav").showModal()
            }
          />
          <span className="btm-nav-label text-xs">Add Friend</span>
        </div>

        <div
          className={`
            w-1/3 flex flex-col justify-center items-center hover:cursor-pointer     
          `}
        >
          <AiOutlineUsergroupAdd className="w-[24px] h-[24px] font-bold text-base-content" />
          <span className="btm-nav-label text-xs">Create Group</span>
        </div>

        <div
          className={`
            w-1/3 flex flex-col justify-center items-center cursor-pointer   
          `}
        >
          {/* <AiOutlineUsergroupAdd className="w-[24px] h-[24px] font-bold text-base-content" /> */}
          {userData?.avatarUrl ? (
            <img
              src={userData?.avatarUrl}
              // onClick={() =>
              //   document.getElementById("editProfileModal").showModal()
              // }
              className="object-cover rounded-full w-[24px] h-[24px] font-bold text-base-content"
            />
          ) : (
            <img
              src="/avatar.png"
              // onClick={() =>
              //   document.getElementById("editProfileModal").showModal()
              // }
              className="object-cover rounded-full w-[24px] h-[24px] font-bold text-base-content"
            />
          )}
          <span className="btm-nav-label text-xs">You</span>
        </div>

        {/* user avatar */}
        {/* <div className="drawer z-[500]">
          <input
            id="bottom-navbar-drawer-settings"
            type="checkbox"
            className="drawer-toggle"
          />
          <button
            className={`
              w-full h-full flex flex-col justify-cente items-center pt-[6px]
            `}
          >
            <label
              htmlFor="bottom-navbar-drawer-settings"
              aria-label="close sidebar"
              className=""
            >
              <RxAvatar className="w-[22px] h-[22px] hover:cursor-pointer text-base-content" />
            </label>
            <span className="btm-nav-label text-xs text-center mt-1">
              Settings
            </span>
          </button>
          <div className="drawer-side">
            <label
              htmlFor="bottom-navbar-drawer-settings"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="pt-4 w-80 min-h-full bg-base-200 text-base-content">
              <UsersCard
                name={userData?.name}
                email={userData?.email}
                avatarUrl={userData?.avatarUrl}
                found={false}
              />
              <div className="divider" />
              <li>
                <ul className="menu bg-base-200 w-ful rounded-box">
                  <li>
                    <details>
                      <summary className="">Theme</summary>
                      <ThemeSwitcher />
                    </details>
                  </li>
                  <li>
                    <details>
                      <summary>Language</summary>
                      <ul>
                        {languages.map((language) => (
                          <li key={language.label}>
                            <a>{language.value}</a>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                  <div className="divider" />
                  <li>
                    <div onClick={logoutClick}>
                      {logoutLoading ? (
                        <div className="loading loading-spinner loading-xs text-base-content flex justify-center ml-2" />
                      ) : (
                        "Logout"
                      )}
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div> */}

        <EditProfileModal id="editProfileModal" userData={userData} />
        <AddFriendModal id="addFriendModalBottomNav" userData={userData} />
      </div>
    </div>
  );
}
