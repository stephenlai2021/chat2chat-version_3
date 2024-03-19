/* react */
import { useState, useRef, useEffect } from "react";

/* next */
import Image from "next/image";

/* firebase */
import {
  doc,
  addDoc,
  updateDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { firestore, storage } from "@/lib/firebase/client";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

/* react-icons */
import { IoImageOutline } from "react-icons/io5";
import { IoCloseCircleOutline } from "react-icons/io5";
import { LuSend } from "react-icons/lu";

/* utils */
import EmojiPicker from "emoji-picker-react";
import ImagePreviewModal from "../modal/ImagePreviewModal";

export default function MessageInput({ sendMessage, message, setMessage, image, setImage }) {
  // function MessageInput({ me, chatRoomId }) {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showUploadBtn, setShowUploadBtn] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Move from ChatRoom
  // const [message, setMessage] = useState("");
  // const [image, setImage] = useState(null);

  const inputFile = useRef(null);
  const messageInput = useRef(null);
  const messagesContainerRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setFile(selectedFile);
    } else {
      setFile(null);
      return;
    }

    // Display image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setShowUploadBtn(true);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      console.error("No file selected.");
      return;
    }
    setShowUploadBtn(false);

    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading file:", error.message);
      },
      () => {
        // Upload complete, get download URL and log it
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // Reset file && upload progress state and update message with download URL
          setFile(null);
          setUploadProgress(null);
          console.log("File available at", downloadURL);

          setImage(downloadURL);
          console.log("image | downloadURL: ", image);

          // Clear image preview
          setImagePreview(null);
          inputFile.current.value = "";
          document.getElementById("imagePreviewModal").close();
        });
      }
    );
  };

  const handleEmojiClick = (emojiData, event) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
  };

  const handleSubmit = async (event) => {
    if (event.key == "Enter") sendMessage();
  };

  const closeAndClearModal = () => {
    inputFile.current.value = "";
    setMessage("")
    setImagePreview(null);
    document.getElementById("imagePreviewModal").close();
  };

  /* 
    put messages in db 
  */
  // const sendMessage = async () => {
  //   // if (message == "" && image == null) return;

  //   if (
  //     (message == "" && image !== null) ||
  //     (message !== "" && image == null) ||
  //     (message !== "" && image !== null)
  //   ) {
  //     try {
  //       let newMessage = {
  //         chatRoomId,
  //         sender: me.id,
  //         content: message,
  //         time: serverTimestamp(),
  //         image,
  //       };

  //       /*
  //         Clear the input field before sending the message
  //         This is important to clear input field in here !!!
  //       */
  //       // setMessage("");
  //       // setImage(null);

  //       // add new message in messages collection
  //       const messagesCollection = collection(firestore, "messages");
  //       await addDoc(messagesCollection, newMessage);

  //       // update last message in chatrooms collection
  //       const chatroomRef = doc(firestore, "chatrooms", chatRoomId);
  //       await updateDoc(chatroomRef, {
  //         lastImage: image ? image : "",
  //         lastMessage: message ? message : "",
  //         lastMessageSentTime: serverTimestamp(),
  //         // [`usersData.${otherUserData.id}.newMessage`]:
  //         //   otherUserData.newMessage + 1,
  //       });
  //     } catch (error) {
  //       console.error("Error sending message:", error.message);
  //     }
  //   }

  //   // Scroll to the bottom after sending a message
  //   if (messagesContainerRef.current) {
  //     messagesContainerRef.current.scrollTop =
  //       messagesContainerRef.current.scrollHeight;
  //   }
  // };

  /* 
    Once we get the image, send message 
    because it takes time to set image, 
    so we put the logic inside useEffect hook !!!
  */
  useEffect(() => {
    // console.log("image | downloadURL: ", image);
    sendMessage();
  }, [image]);

  return (
    <div className="relative flex items-center px-0 py-0 shadow-inner">
      {/* image icon */}
      <div className="absolute left-4 mr-4">
        <IoImageOutline
          onClick={() =>
            document.getElementById("imagePreviewModal").showModal()
          }
          className={`cursor-pointer text-gray-40 text-base-content w-[24px] h-[24px]`}
        />
      </div>

      {/* Emoji Picker section */}
      {/* <button
        className="mr-3 text-[18px]"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      >
        😊
      </button>
      {showEmojiPicker && (
        <div className="absolute right-0 bottom-full p-2">
          <span
            className="absolute top-[10px] right-[10px] z-50 hover:cursor-pointer text-black text-lg font-bold"
            onClick={() => setShowEmojiPicker(false)}
          >
            <IoIosCloseCircleOutline />
          </span>
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            disableAutoFocus={true}
          />
        </div>
      )} */}

      {/* When user type something in message input, show close button */}
      <div
        className={`
          border- absolute left-12 top-[50%] translate-y-[-50%] py-2 px-1
          ${message ? "block" : "hidden"}
        `}
      >
        <IoCloseCircleOutline
          className="w-[20px] h-[20px] hover:cursor-pointer text-base-content"
          onClick={() => setMessage("")}
        />
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleSubmit}
        type="text"
        // autoFocus
        ref={messageInput}
        placeholder="Type a message..."
        className={`
          ${message ? "pl-[76px]" : "pl-[52px]"} 
          ${!imagePreview ? "block" : "hidden"}
          border-none outline-none pr-10 input-bordered bg-base-300 inpu input-m h-[56px] text-base-content flex-1 w-full
        `}
      />

      {/* if message input is not empty, show submit icon  */}
      <LuSend
        onClick={sendMessage}
        className={`
          absolute right-4 ml-4 text-base-content cursor-pointer w-[20px] h-[20px]
          ${message ? "block" : "hidden"}
        `}
      />

      <ImagePreviewModal
        from="MessageInput"
        id="imagePreviewModal"
        handleUpload={handleUpload}
        handleFileChange={handleFileChange}
        closeAndClearModal={closeAndClearModal}
        message={message}
        setMessage={setMessage}
        inputFile={inputFile}
        imagePreview={imagePreview}
        showUploadBtn={showUploadBtn}
        uploadProgress={uploadProgress}
      />
    </div>
  );
}
