"use client";

/* react */
import { useState, useRef, useEffect } from "react";

/* zustand */
import { useStore } from "@/zustand/store";

/* firebase */
import { firestore, storage } from "@/lib/firebase/client";
import {
  doc,
  query,
  where,
  getDocs,
  updateDoc,
  onSnapshot,
  collection,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

/* react-icons */
import { FaRegEdit } from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5";
import { AiOutlineCloudUpload } from "react-icons/ai";

export default function EditProfileModal({ id, userData }) {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showUploadBtn, setShowUploadBtn] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);

  const imageFileInputBoxRef = useRef(null);

  const { userImage, setUserImage, userDataStore } = useStore();

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
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          // Reset file && upload progress state and update message with download URL
          setFile(null);
          setUploadProgress(null);
          // console.log("File available at", downloadURL);

          setImage(downloadURL);
          setUserImage(downloadURL);
          // console.log("image | downloadURL: ", image);

          document.getElementById("editProfileModal").close();
          // imageFileInputBoxRef.current.value = "";

          // Update firestore user data
          await updateDoc(doc(firestore, "users", userDataStore?.email), {
            avatarUrl: downloadURL,
          });

          const chatroomsQuery = query(
            collection(firestore, "chatrooms"),
            where("users", "array-contains", userDataStore?.id)
          );
          const querySnapshot = await getDocs(chatroomsQuery);
          querySnapshot.forEach(async (document) => {
            console.log(document.id, document.data());
            await updateDoc(doc(firestore, "chatrooms", document.id), {
              [`usersData.${userDataStore?.id}.avatarUrl`]: downloadURL,
            });
          });

          // Clear image preview
          // setImagePreview(null);
        });
      }
    );
  };

  const handleClose = () => {
    setImagePreview(null);
    // imageFileInputBoxRef.current.value = "";
    document.getElementById("editProfileModal").close();
  };

  const handleInputChange = () => {}

  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={handleClose}
        >
          ✕
        </button>

        <h3 className="font-bold text-lg">Edit Your Profile</h3>

        <div className="mt-4 flex flex-col border- border-red-30">
          <div className="flex flex-col items-center justify-center border- border-green-30">
            {userData?.avatarUrl && !imagePreview && (
              <div className="relative">
                <img
                  alt=""
                  src={userData?.avatarUrl}
                  className={`object-cover rounded-full w-[100px] h-[100px]`}
                />
                <div
                  className={`
                    rounded-full right-0 bottom-0 flex justify-center items-center 
                    absolute w-7 h-7 backdrop-opacity-30 backdrop-invert bg-base-100/30
                  `}
                >
                  <label>
                    <input
                      type="file"
                      accept="image/*"
                      ref={imageFileInputBoxRef}
                      onChange={handleFileChange}
                      className="w-0 h-0 opacity-0"
                    />
                    <FaRegEdit
                      className={`
                      w-5 h-5 rounded-full text-base-content mb-6 hover:cursor-pointer       
                    `}
                    />
                  </label>
                </div>
              </div>
            )}

            {!userData?.avatarUrl && !imagePreview && (
              <div className="relative">
                <img
                  alt=""
                  src="/avatar.png"
                  className={`object-cover rounded-full w-[100px] h-[100px]`}
                />
                <div
                  className={`
                    rounded-full right-0 bottom-0 flex justify-center items-center 
                    absolute w-7 h-7 backdrop-opacity-30 backdrop-invert bg-base-100/30
                  `}
                >
                  <label>
                    <input
                      type="file"
                      accept="image/*"
                      ref={imageFileInputBoxRef}
                      onChange={handleFileChange}
                      className="w-0 h-0 opacity-0 hover:cursor-pointer"
                    />
                    <FaRegEdit
                      className={`
                      w-5 h-5 rounded-full text-base-content mb-6 hover:cursor-pointer       
                    `}
                    />
                  </label>
                </div>
              </div>
            )}

            {userData?.avatarUrl && imagePreview && (
              <div className="relative">
                <img
                  alt=""
                  src={imagePreview}
                  className={`object-cover rounded-full w-[100px] h-[100px]`}
                />
                <div
                  className={`
                    backdrop-opacity-30 backdrop-invert bg-base-100/30 rounded-full w-[40px] h-[40px]
                    absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] hover:cursor-pointer
                    ${showUploadBtn ? "block" : "hidden"}
                  `}
                >
                  <AiOutlineCloudUpload
                    className={`
                      text-base-content w-[30px] h-[30px] absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]
                    `}
                    onClick={handleUpload}
                  />
                </div>
                <div
                  className={`
                    backdrop-opacity-30 backdrop-invert bg-base-100/30 rounded-full w-[40px] h-[40px]
                    absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] 
                    ${
                      uploadProgress !== null && !showUploadBtn
                        ? "block"
                        : "hidden"
                    } 
                  `}
                >
                  {uploadProgress !== null && !showUploadBtn && (
                    <div
                      className={`
                        w-[35px] h-[35px] backdrop-opacity-30 backdrop-invert bg-base-100/30 radial-progress text-base-content absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]
                      `}
                      style={{
                        "--value": uploadProgress,
                        "--size": "1rem",
                        "--thickness": "",
                      }}
                      role="progressbar"
                    >
                      {uploadProgress.toFixed(0)}%
                    </div>
                  )}
                </div>
              </div>
            )}

            {!userData?.avatarUrl && imagePreview && (
              <div className="relative">
                <img
                  alt=""
                  src={imagePreview}
                  className={`object-cover rounded-full w-[100px] h-[100px]`}
                />
                {/* ${imagePreview == null ? "hidden" : ""}  */}
                <div
                  className={`
                    backdrop-opacity-30 backdrop-invert bg-base-100/30 rounded-full w-[40px] h-[40px]
                    absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] hover:cursor-pointer
                    ${showUploadBtn ? "block" : "hidden"}
                  `}
                >
                  <AiOutlineCloudUpload
                    className={`
                      text-base-content w-[30px] h-[30px] absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]
                    `}
                    onClick={handleUpload}
                  />
                </div>
                <div
                  className={`
                    backdrop-opacity-30 backdrop-invert bg-base-100/30 rounded-full w-[40px] h-[40px]
                    absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] hover:cursor-pointer
                    ${
                      uploadProgress !== null && !showUploadBtn
                        ? "block"
                        : "hidden"
                    } 
                  `}
                >
                  {uploadProgress !== null && !showUploadBtn && (
                    <div
                      className={`
                        w-[30px] h-[30px] backdrop-opacity-30 backdrop-invert bg-base-100/30 radial-progress text-base-content absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]
                      `}
                      style={{
                        "--value": uploadProgress,
                        "--size": "1rem",
                        "--thickness": "",
                      }}
                      role="progressbar"
                    >
                      {uploadProgress.toFixed(0)}%
                    </div>
                  )}
                </div>
              </div>
            )}

            <div
              className={`relative flex justify-center mt-3
              `}
              >
              {/* ${isSearch ? "my-3" : "my-1"} */}
              <input
                type="text"
                value={userData?.name}
                // autoFocus
                onFocus={(e) => e.currentTarget.select()}
                onChange={handleInputChange}
                placeholder="Name"
                className={`
                px-3 bg-base-300 py-3 rounded-xl outline-none w-full
                `}
                />
                {/* ${isSearch ? "block" : "hidden"} */}
              <IoCloseCircleOutline
                className={`
                w-[22px] h-[22px] absolute top-[50%] translate-y-[-50%] right-3 hover:cursor-pointer
                `}
                onClick={() => setIsSearch(false)}
                />
                {/* ${!searchTerm && isSearch ? "block" : "hidden"} */}
            </div>
          </div>
        </div>

        {/* Close Button */}
        {/* <div className="modal-action">
          <button className="btn" onClick={handleClose}>
            Close
          </button>
        </div> */}
      </div>
    </dialog>
  );
}
