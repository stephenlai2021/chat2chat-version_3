"use client";

/* react */
import { useEffect, useState } from "react";

/* next */
import { useRouter } from "next/navigation";

/* firebase */
import { firestore } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";

/* components */
import ChatList from "@/components/main/ChatList";
import ChatRoom from "../../components/chatroom/ChatRoom";
import LoadingSkeleton from "@/components/skeleton/LoadingSkeleton";

function Main({ userCred }) {
  // console.log('user credentail | dashboard client: ', userCred)
  // console.log('user email: ', loginUser.email)

  const [user, setUser] = useState({});
  const [selectedChatroom, setSelectedChatroom] = useState(null);

  const router = useRouter();
  
  const getLoginUserData = async () => {
    const docRef = doc(firestore, "users", userCred.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setUser(data);
    } else {
      console.log("Cannot find this user !");
    }
  };

  useEffect(() => {
    getLoginUserData();
  }, [userCred]);

  return (
    <div className="flex h-screen">
      <div
        className={`relative ${
          selectedChatroom == null ? "users-mobile" : "users-hide"
        }`}
      >
        <ChatList userData={user} setSelectedChatroom={setSelectedChatroom} />
      </div>

      {selectedChatroom && (
        <div
          className={`w-9/12 ${
            selectedChatroom ? "chatroom-mobile" : "chatroom-hide"
          }`}
        >
          <ChatRoom
            selectedChatroom={selectedChatroom}
            setSelectedChatroom={setSelectedChatroom}
          />
        </div>
      )}

      {selectedChatroom == null && (
        <div
          className={`${
            selectedChatroom == null ? "chatroom-hide" : "chatroom-mobile"
          } shadow-inner w-9/12 flex items-center justify-center h-full chatroom-none`}
        >
          <div className="text-2xl text-gray-400">Select a chatroom</div>
        </div>
      )}
    </div>
  );
}

export default Main;
