import React, { useEffect, useState } from "react";
import isConnected from "../blockchain/checkMetamaskConnection";
import { CircularProgress } from "@mui/material";
import createAuthor from "../blockchain/createAuthor";
import getPublicAddress from "../blockchain/getPublicAddress";
import AddIcon from "@mui/icons-material/Add";
import createPost from "../blockchain/createPost";
import getPostCurrentIndex from "../blockchain/getPostCurrentIndex";

const PublishArticleWindow = ({ switchCreateAccount }) => {
  const [userID, set_userID] = useState("");
  const [userName, set_userName] = useState("");
  const [loading, set_loading] = useState(false);
  const [isUser, set_isUser] = useState(false);
  const [showDialog, set_showDialog] = useState(false);
  const [title, set_title] = useState("");
  const [bannerURL, set_bannerURL] = useState("");
  const [description, set_description] = useState("");

  const handlePublish = async () => {
    var success = true;
    set_loading(true);

    try {
      const _addr = await getPublicAddress();
      const _currentPostIndex = await getPostCurrentIndex();
      const res = await createPost(
        _addr + _currentPostIndex,
        title,
        description,
        bannerURL
      );
      const resTrx = await res.wait();
      const trxHash = await resTrx.blockHash;
      window.location.href = window.location.href;
      // const pubAddr = await getPublicAddress();
      // const isUserStats = await isUser(pubAddr);

      // console.log(trxHash);
      // console.log("is User:  " + isUserStats);
    } catch (error) {
      success = false;
      set_loading(false);
      alert("User Exists");
    }
    set_loading(false);
  };

  return (
    <div>
      {!showDialog && (
        <button
          className="w-full border-dashed border-2 rounded-2xl flex py-3 gap-6 cursor-pointer justify-center items-center border-[#e7e752] "
          onClick={() => set_showDialog(true)}
        >
          <AddIcon sx={{ color: "grey", fontSize: 40 }} />
          <h1 className="tracking-widest text-[#e7e752] font-black text-xl ">
            Publish an Article
          </h1>
        </button>
      )}
      {showDialog && (
        <div className="px-3 py-9 flex flex-col border-dashed border-2 border-[#e7e752]  rounded-2xl  w-full ">
          <div className="flex justify-center items-center gap-3">
            <img
              className="w-[50px] "
              src={"https://i.imgur.com/tLNln7x.jpeg"}
            />
          </div>
          <h1 className="text-green-400 text-center mt-9 text-2xl font-black ">
            Publish Article
          </h1>
          <h1 className="text-[#e7e752] text-left mt-9 ">Title: </h1>
          <input
            type="text"
            value={title}
            onChange={(e) => set_title(e.target.value)}
            className="w-full border-0 bg-slate-700 rounded-lg py-2 px-2 text-slate-300 mt-1 "
          />
          <h1 className="text-[#e7e752] text-left mt-9"> Banner Image URL:</h1>
          <input
            type="text"
            value={bannerURL}
            onChange={(e) => set_bannerURL(e.target.value)}
            className="w-full border-0 bg-slate-700 rounded-lg py-2 px-2 text-slate-300 mt-1 "
          />
          <h1 className="text-[#e7e752] text-left mt-9"> Description:</h1>
          <textarea
            type="text"
            value={description}
            onChange={(e) => set_description(e.target.value)}
            className="w-full border-0 bg-slate-700 rounded-lg py-2 px-2 text-slate-300 mt-1 "
          />
          <button
            disabled={loading ? true : false}
            onClick={handlePublish}
            className="w-full border-0 bg-[#e7e752] rounded-lg py-2 px-2 text-black font-bold mt-1 mt-9"
          >
            {!loading && "Publish"}
            {loading && <CircularProgress />}
          </button>
          <h1 className="text-red-400 text-center mt-9">
            Cannot be tampered or deleted once published to blockchain
          </h1>
        </div>
      )}
    </div>
  );
};

export default PublishArticleWindow;
