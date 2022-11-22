import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function ImageModal({ postURL, setShowModal, showModal }) {
  return (
    <div className="flex items-center justify-center p-4 rounded bg-white ">
      <div className="p-10 bg-gray-800 rounded-md relative">
        <img
          src={postURL}
          className=" max-w-[1000px] max-h-[1000px] object-cover cursor-pointer"
          alt=""
          onClick={() => setShowModal(!showModal)}
        />
        <div className="absolute top-0 right-0 p-1">
          <XMarkIcon
            className="w-10 h-10 cursor-pointer text-white"
            onClick={() => setShowModal(!showModal)}
          />
        </div>
      </div>
    </div>
  );
}
