/* next */
import Image from "next/image";

/* react */
import { useRef, useState } from "react";

/* react-icons */
import { AiOutlineCloudUpload } from "react-icons/ai";
import { IoCloseCircleOutline } from "react-icons/io5";

export default function ImagePreviewModal({
  id,
  from,
  message,
  inputFile,
  setMessage,
  handleUpload,
  imagePreview,
  showUploadBtn,
  uploadProgress,
  handleFileChange,
  closeAndClearModal,
}) {
  const captionInputRef = useRef(null);
  const [isUploadBtnClicked, setIsUploadBtnClicked] = useState(false);

  const handleSubmit = (event) => {
    if (event.key == "Enter") {
      setIsUploadBtnClicked(true);
      captionInputRef.disabled = true;
      handleUpload();
      captionInputRef.disabled = false;
      setIsUploadBtnClicked(false);
    }
  };

  const handleImageUpload = () => {
    setIsUploadBtnClicked(true);
    captionInputRef.disabled = true;
    handleUpload();
    captionInputRef.disabled = false;
    setIsUploadBtnClicked(false);
  };

  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        {/* close button */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={closeAndClearModal}
        >
          ✕
        </button>

        <div className="pt-2 relative flex flex-col justify-center items-center">
          {/* Image Preview Section */}
          {imagePreview && (
            <div className="relative">
              <div className="flex justify-center relative">
                {/* upload icon */}
                <div
                  className={`
                    backdrop-opacity-30 backdrop-invert bg-base-100/30 rounded-full p-1 w-16 h-16 
                    absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] hover:cursor-pointer
                    ${showUploadBtn && message ? "hidden" : "block"}
                  `}
                >
                  <AiOutlineCloudUpload
                    className={`text-base-content w-full h-full`}
                    onClick={handleImageUpload}
                  />
                </div>

                {/* image preview */}
                <Image
                  src={imagePreview}
                  alt="Uploaded"
                  width={200}
                  height={200}
                  className="mb-4 rounded"
                />

                {/* radial progress */}
                {uploadProgress !== null && (
                  <div
                    className="w-16 h-16 backdrop-opacity-30 backdrop-invert bg-base-100/30 radial-progress text-base-content absolute z-[500] top-[50%] translate-y-[-50%]"
                    style={{ "--value": uploadProgress }}
                    role="progressbar"
                  >
                    {uploadProgress.toFixed(0)}%
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Caption Input Section */}
          <div className="relative">
            {/* Close Icon */}
            <IoCloseCircleOutline
              className={`
                w-[20px] h-[20px] hover:cursor-pointer text-base-content
                absolute left-2 top-[50%] translate-y-[-50%]
                ${imagePreview && message ? "block" : "hidden"}
                ${isUploadBtnClicked ? 'invisible' : 'visible'}
              `}
              onClick={() => setMessage("")}
            />

            {/* Caption Input Box */}
            <input
              type="text"
              value={message}
              ref={captionInputRef}
              onKeyDown={handleSubmit}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Caption(optional)"
              className={`
                bg-base-300 rounded-md input-m w-[px]
                pr-9 py-3 w-full max-w-xs text-base-content
                ${message ? "pl-8" : "pl-4"} 
                ${imagePreview && from == "MessageInput" ? "block" : "hidden"}
              `}
            />

            {/* Upload Icon */}
            <AiOutlineCloudUpload
              className={`
                w-[20px] h-[20px] hover:cursor-pointer text-base-content
                absolute right-[10px] top-[50%] translate-y-[-50%]
                ${
                  // imagePreview && from == "MessageInput" && message
                  imagePreview && message
                    ? "block"
                    : "hidden"
                }
                ${isUploadBtnClicked ? 'invisible' : 'visible'}
              `}
              onClick={handleImageUpload}
            />
          </div>

          {/* Image File Input */}
          <input
            type="file"
            accept="image/*"
            className="mt-2 file-input file-input-bordered file-input-primary text-base-content w-full max-w-xs"
            ref={inputFile}
            onChange={handleFileChange}
          />
        </div>
      </div>
    </dialog>
  );
}
