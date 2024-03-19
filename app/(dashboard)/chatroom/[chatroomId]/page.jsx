"use client";

/* react */
import { useState, useEffect, useRef } from "react";

/* hooks */
import useWindowSize from "@/hooks/useWindowSize";

/* firebase */
import {
  doc,
  query,
  where,
  addDoc,
  setDoc,
  getDoc,
  orderBy,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase/client";

/* components */
import MessageCard from "@/components/chatroom/MessageCard";
import MessageInput from "@/components/chatroom/MessageInput";
import MessageSkeleton from "@/components/skeleton/MessageSkeleton";

/* react-icons */
import { FaArrowLeft, FaBullseye } from "react-icons/fa";

/* zustand */
import { useStore } from "@/zustand/store";

/* utils */
import moment from "moment";

// export default function ChatroomIdPage({ params: { chatroomId } }) {
export default function ChatroomIdPage() {
  const size = useWindowSize();
  const { 
    mobile, 
    toggleMobile, 
    userDataStore,
    selectedChatroom, 
  } = useStore();

  // const me = selectedChatroom?.myData;
  const me = userDataStore;
  const chatroomId = selectedChatroom?.id;
  const theOther = selectedChatroom?.otherUserData;

  const messagesContainerRef = useRef(null);

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [other, setOther] = useState(null);
  const [msgCount, setMsgCount] = useState(0);
  const [otherUserData, setOtherUserData] = useState(null);
  const [isMessageBottom, setIsMessageBottom] = useState(false);

  const deleteMsg = async (id) => {
    try {
      await deleteDoc(doc(firestore, "messages", id));

      /* updateDoc triggers snapshot twice which is a bug !!! */
      // const chatroomRef = doc(firestore, "chatrooms", chatroomId);
      // await updateDoc(chatroomRef, {
      //   lastMessage: `message removed`,
      //   lastMessageSentTime: serverTimestamp(),
      // });
    } catch (err) {
      console.log("error: ", err);
    }
  };

  const getDay = () => {
    const date = new Date();
    const day = date.getDate().toString();
    return day;
  };

  const getMonth = () => {
    const date = new Date();
    const month = (date.getMonth() + 1).toString();
    return month;
  };
  const getYear = () => {
    const date = new Date();
    const year = date.getFullYear();
    return year;
  };

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

  /* 
    put messages in db 
    This function triggers realtime snapshot (messages && chatrooms) twice !!!
  */
  const sendMessage = async (msg) => {
    if (message == "" && image == null) return;
    try {
      let newMessage = {
        image,
        sender: me.id,
        content: message,
        chatRoomId: chatroomId,
        time: serverTimestamp(),
        // date: moment(serverTimestamp()).format("l"),
        date: getMonth() + "/" + getDay(),
      };
      console.log("mmdd: ", getMonth() + "/" + getDay());

      /*
        Clear the input field before sending the message
        This is important to clear input field in here !!!
      */
      setMessage("");
      setImage(null);

      // add new message in messages collection
      const messagesCollection = collection(firestore, "messages");
      await addDoc(messagesCollection, newMessage);

      /* update last message in chatrooms collection */
      const chatroomRef = doc(firestore, "chatrooms", chatroomId);
      await updateDoc(chatroomRef, {
        lastImage: image ? image : "",
        lastMessage: message ? message : "",
        lastMessageSentTime: serverTimestamp(),
        [`usersData.${otherUserData.id}.newMessage`]:
          otherUserData.newMessage + 1,
      });
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
    // }

    // Scroll to the bottom after sending a message
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  /*
    Auto scroll to the bottom of the messages container after
    click user card component.
    Not working at the first loading !!!
  */
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messagesContainerRef, messages]);

  /* 
    Hide chat bubble loading skeleton after 3s 
  */
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [loading]);

  /* 
    Get Messages 
  */
  useEffect(() => {
    // Do not delete this line !!!
    // if (!chatroomId) return;

    // setLoading(true);
    const unsubMsgs = onSnapshot(
      query(
        collection(firestore, "messages"),
        where("chatRoomId", "==", chatroomId),
        orderBy("time", "asc")
      ),
      (snapshot) => {
        setMessages([]);
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messages);

        if (messages.length !== 0) setLoading(false);
        console.log("messages: ", messages);
      }
    );
    return () => unsubMsgs();
    // }, [chatroomId]);
  }, []);

  /* 
    Get Other User
    We get otherUser because we want the avatar in top menu get updated in realtime
  */
  useEffect(() => {
    const unsubOtherUser = onSnapshot(
      doc(firestore, "users", theOther.email),
      (doc) => {
        setOther(doc.data());
        console.log('otherUser: ', theOther)
      }
    );
    return () => unsubOtherUser();
  }, [theOther]);

  /* 
    Do not delete !!!
    Get selectedChatroom in order to get otherUserData 
    to set the message count in realtime
  */
  useEffect(() => {
    const unsub = onSnapshot(doc(firestore, "chatrooms", chatroomId), (doc) => {
      const selectedRoom = doc.data();
      console.log("selectedChatroom: ", selectedRoom);

      const otherUserData =
        selectedRoom.usersData[
          selectedRoom.users.find((id) => id !== me.id)
        ];
      setOtherUserData(otherUserData);
    });
    return () => unsub();
  // }, [chatroomId]);
  }, []);

  return (
    <div
      className={`
        flex flex-col h-screen shadow-inner overflow-x-hidden
        ${
          size.width <= 800 && !mobile
            ? "w-screen"
            : size.width <= 800 && mobile
            ? "hidden"
            : "w-full"
        }
      `}
    >
      {/* top menu */}
      <div className="h-[64px] flex items-center shadow-inner">
        {loading ? (
          <div className="hidde show-fle flex">
            <div className="flex items-end ml-4 pb-1 hidden show-flex">
              <div className="skeleton rounded w-[18px] h-[18px] pt-"></div>
            </div>
            <div className="skeleton rounded-full w-9 h-9 ml-4 navbar-avatar-margin"></div>
            <div className="flex items-end pb-1 border-1 ml-2">
              <div className="skeleton rounded w-[72px] h-4"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Left Arrow Icon */}
            <div
              className={`
                ml-4 pr-1 pt-3 hover:cursor-pointer
                ${size.width <= 800 ? "flex" : "hidden"} 
              `}
              onClick={toggleMobile}
            >
              <FaArrowLeft className="text-base-content w-[18px] h-[18px]" />
            </div>

            {/* Other User Avatar */}
            <div
              className={`
                ${size.width > 800 ? "ml-4" : "m-1"}
                border-base-content avatar
              `}
            >
              <div
                className="w-9 h-9 rounded-full hover:cursor-pointer"
                onClick={toggleMobile}
              >
                {other?.avatarUrl ? (
                  <img src={other?.avatarUrl} />
                ) : (
                  <img src="/avatar.png" />
                )}
              </div>
            </div>

            {/* Other User Name */}
            <div className="h-8 font-semibold flex items-end ml-2 text-base-content">
              {other?.name}
            </div>
          </>
        )}
      </div>

      <div
        ref={messagesContainerRef}
        className="shadow-inner flex-1 overflow-auto py-5 px-3"
      >
        {/* : moment(message?.time.toDate()).format("MMM Do") */}
        {!loading &&
          messages?.map((message) => (
            <div key={message.id}>
              {/* Timeline */}
              {/* <div className="divide my-3 flex justify-center text-[10px] opacity-50">
                {formatDate(message.time) == getCurrentDate()
                  ? "Today"
                  : formatDate(message.time) == getYesterday()
                  ? "Yesterday"
                  : formatDate(message.time).substring(
                      0,
                      formatDate(message.time).length - 5
                    )}
              </div> */}
              <MessageCard
                me={me}
                other={other}
                key={message.id}
                message={message}
                deleteMsg={deleteMsg}
              />
            </div>
          ))}

        {loading && <MessageSkeleton />}
      </div>

      <MessageInput
        image={image}
        message={message}
        setImage={setImage}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
}
