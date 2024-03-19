"use client";

/* react */
import { useState, useEffect, useRef } from "react";

/* zustand */
import { useStore } from "@/zustand/store";

/* components */
import UsersCard from "@/components/main/UsersCard";

/* react-icons */
import { IoIosSearch } from "react-icons/io";
import { IoCloseCircleOutline } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaArrowLeft, FaBullseye } from "react-icons/fa";

/* hooks */
import useWindowSize from "@/hooks/useWindowSize";

/* firebase */
import { firestore } from "@/lib/firebase/client";
import {
  or,
  query,
  collection,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

/* utils */
import { toast } from "react-hot-toast";

/* 
  加朋友會遇到的情況
  1. 用戶聊天清單已經有此人 (👍)
  2. 用戶輸入錯誤的資料 (資料庫找不到用戶輸入的資料) (👍)
  3. 用戶的資料是自己 (👍)
  4. 用戶輸入人名 (列出資料庫相同姓名的清單) (👍)
  5. 用戶輸入的朋友不在聊天清單 (成功加入) ()
*/

export default function AddFriendPage() {
  const [userInfo, setUserInfo] = useState("");
  const [foundUsers, setFoundUsers] = useState("");
  const [loading, setLoading] = useState(false);
  const [createChatLoading, setCreateChatLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isErrorMsg, setIsErrorMsg] = useState(false);

  const {
    setSelectedChatroom,
    mobile,
    toggleMobile,
    userDataStore,
    setUserDataStore,
  } = useStore();
  const size = useWindowSize();

  const userInfoRef = useRef(null);

  useEffect(() => {
    userInfoRef.current.focus();
  }, [userInfo]);

  const createChat = async (user) => {
    if (user.email === userDataStore?.email) {
      setErrorMsg(`You cannot add yourself 😅`);
      toast(`You cannot add yourself !`, {
        icon: "😅",
        position: "bottom-right",
      });
      return;
    }
    setCreateChatLoading(true);

    // 檢查聊天室是否存在
    const existingChatroomsQuery = query(
      collection(firestore, "chatrooms"),
      where("users", "in", [
        [userDataStore?.id, user.id],
        [user.id, userDataStore?.id],
      ])
    );

    try {
      const existingChatroomsSnapshot = await getDocs(existingChatroomsQuery);
      if (existingChatroomsSnapshot.docs.length > 0) {
        toast(`${user.name} is already in your chat list`, {
          icon: "😎",
          position: "bottom-right",
        });
        setCreateChatLoading(false);
        return;
      }

      const usersData = {
        [userDataStore?.id]: userDataStore,
        [user.id]: user,
        // uD4d3fzZKMQN5wzMFfnL5ivJ1VL2: {
        //   avatarUrl:
        //     "https://avataaars.io/?accessoriesType=Round&avatarStyle=Circle&clotheColor=PastelBlue&clotheType=Overall&eyeType=Cry&eyebrowType=SadConcernedNatural&facialHairColor=BlondeGolden&facialHairType=MoustacheFancy&hairColor=Auburn&hatColor=PastelOrange&mouthType=Sad&skinColor=Tanned&topType=Eyepatch",
        //   email: "pirateman@gmail.com",
        //   id: "uD4d3fzZKMQN5wzMFfnL5ivJ1VL2",
        //   name: "pirateman",
        // },
      };

      const chatroomData = {
        // users: [userDataStore?.id, user.id, "uD4d3fzZKMQN5wzMFfnL5ivJ1VL2"],
        users: [userDataStore?.id, user.id],
        usersData,
        timestamp: serverTimestamp(),
        lastMessage: null,
        lastMessageSentTime: null,

        // 以下是是新加的 field, 要注意既有的 chatrooms 都沒有, 所以讀取時會報錯 !!!
        newMessage: 0,
        lastImage: null,
      };

      await addDoc(collection(firestore, "chatrooms"), chatroomData);
      setCreateChatLoading(false);
      setUserInfo("");
      setFoundUsers("");
      document.getElementById("addFriendModal").close();
    } catch (error) {
      console.error("Error creating or checking chatroom:", error);
    }
  };

  const searchUserByNameOrEmail = async () => {
    console.log("user info: ", userInfo);

    setLoading(true);
    const q = query(
      collection(firestore, "users"),
      or(
        where("name", "==", userInfo.toLowerCase()),
        where("email", "==", userInfo.toLowerCase())
      )
    );
    const users = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    });
    setFoundUsers(users);
    setLoading(false);

    if (users.length == 0) {
      toast("This user is not existed !", {
        icon: "🤔",
        position: "bottom-right",
      });
    }
  };

  const resetUserInfoAndFoundUsers = () => {
    setUserInfo("");
    setErrorMsg("");
    setFoundUsers("");
  };

  const handleUserInfoKeyDown = (event) => {
    if (event.key === "Enter") searchUserByNameOrEmail();
  };

  /* handle chat bubble loading time */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsErrorMsg(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isErrorMsg]);

  return (
    <div
      className={`
        h-screen
        ${
          size.width <= 800 && !mobile
            ? "w-screen"
            : size.width <= 800 && mobile
            ? "hidden"
            : "w-full"
        }
      `}
    >
      <div className="w-full h-[64px] flex items-center">
        <FaArrowLeft
          className={`
              text-base-content w-[20px] h-[20px] ml-4 hover:cursor-pointer
              ${size.width <= 800 ? "block" : "hidden"} 
            `}
          onClick={toggleMobile}
        />
      </div>
      <div className="flex justify-center">
        <div 
          role="tablist" 
          className={`
            tabs tabs-lifted
            ${size.width <= 800 ? 'w-full px-5' : 'w-3/4'}
          `}
        >
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab"
            aria-label="Create Group"
            checked
            onChange={() => console.log(e.target.value)}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            {/* search input */}
            <div className="mt-3 relative">
              <div
                className={`${
                  userInfo ? "block" : "hidden"
                } absolute left-1 top-[50%] translate-y-[-50%] py-2 px-1`}
              >
                <IoCloseCircleOutline
                  className={`w-[20px] h-[20px] hover:cursor-pointer 
                ${loading ? "text-neutral-content" : "text-base-content"}
            `}
                  onClick={resetUserInfoAndFoundUsers}
                />
              </div>
              <input
                type="text"
                value={userInfo}
                ref={userInfoRef}
                autoFocus
                onChange={(e) => setUserInfo(e.target.value)}
                onKeyDown={handleUserInfoKeyDown}
                placeholder="Enter name or email"
                className={`
                  bg-base-300 rounded-md pr-8 py-3 w-full outline-none border-none
                  ${userInfo ? "pl-8" : "pl-4"}
                  ${loading ? "text-neutral-content" : "text-base-content"}
                `}
              />
              <IoIosSearch
                className={`${
                  userInfo && !loading ? "block" : "hidden"
                } w-[20px] h-[20px] hover:cursor-pointer text-base-content absolute right-[10px] top-[50%] translate-y-[-50%]`}
                onClick={searchUserByNameOrEmail}
              />
              <span
                className={`${
                  loading ? "block text-neutral-content" : "hidden"
                } loading loading-spinner loading-sm text-base-conten absolute right-[10px] top-[50%] translate-y-[-50%]`}
              />
            </div>
            <div
              className={`${
                isErrorMsg ? "block" : "hidden"
              } toast toast-bottom toast-end z-[500]`}
            >
              <div className="alert alert-error">
                <span className="text-error-content">{errorMsg}</span>
              </div>
            </div>

            {/* search results */}
            <div className="relative mt-8 flex flex-col">
              {!loading &&
                foundUsers &&
                foundUsers?.map((user, index, arr) => (
                  <div key={user.id}>
                    <div
                      className={`
                        relative mb-[0px] shadow-m 
                        ${user.createChatLoading ? "btn-disabled" : ""}
                      `}
                    >
                      <UsersCard
                        user={user}
                        found={true}
                        goal="addFriend"
                        name={user.name}
                        email={user.email}
                        avatarUrl={user.avatarUrl}
                        lastMessage={user.lastMessage}
                        createChat={() => createChat(user)}
                        createChatLoading={createChatLoading}
                      />
                    </div>
                    <div
                      className={`${index != arr.length - 1 ? "divider" : ""}`}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
