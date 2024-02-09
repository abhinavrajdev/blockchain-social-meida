import React, { useEffect, useState } from "react";
import isConnected from "../blockchain/checkMetamaskConnection";
import { CircularProgress } from "@mui/material";
import createAuthor from "../blockchain/createAuthor";
import getPublicAddress from "../blockchain/getPublicAddress";

const CreateAccount = ({ switchCreateAccount }) => {
  const [userID, set_userID] = useState("");
  const [userName, set_userName] = useState("");
  const [loading, set_loading] = useState(false);
  const [isUser, set_isUser] = useState(false);

  const handleCreateAccount = async () => {
    var success = true;
    set_loading(true);

    try {
      const res = await createAuthor(userID, userName);
      const resTrx = await res.wait();
      const trxHash = await resTrx.blockHash;
      // const pubAddr = await getPublicAddress();
      // const isUserStats = await isUser(pubAddr);

      // console.log(trxHash);
      // console.log("is User:  " + isUserStats);
    } catch (error) {
      success = false;
      set_loading(false);
      alert("User Exists");
    }
    success && switchCreateAccount();
    set_loading(false);
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center fixed top-0 left-0 bg-black px-3">
      <div className="px-3 py-9 flex flex-col border-2 border-[#e7e752] rounded-3xl max-w-[400px] w-full ">
        <div className="flex justify-center items-center gap-3">
          <img className="w-[50px] " src={"https://i.imgur.com/tLNln7x.jpeg"} />
          <h1 className="text-[#e7e752] text-left font-black tracking-widest text-3xl">
            DeNews
          </h1>
        </div>
        <h1 className="text-green-400 text-center mt-9 text-2xl font-black ">
          Blockchain Publishing, <br />! Right to Speech !
        </h1>
        <h1 className="text-[#e7e752] text-left mt-9 ">Author ID</h1>
        <input
          type="text"
          value={userID}
          onChange={(e) => set_userID(e.target.value)}
          className="w-full border-0 bg-slate-700 rounded-lg py-2 px-2 text-slate-300 mt-1 "
        />
        <h1 className="text-[#e7e752] text-left mt-9">Author Name</h1>
        <input
          type="text"
          value={userName}
          onChange={(e) => set_userName(e.target.value)}
          className="w-full border-0 bg-slate-700 rounded-lg py-2 px-2 text-slate-300 mt-1 "
        />
        <button
          disabled={loading ? true : false}
          onClick={handleCreateAccount}
          className="w-full border-0 bg-[#e7e752] rounded-lg py-2 px-2 text-black font-bold mt-1 mt-9"
        >
          {!loading && "Claim Account"}
          {loading && <CircularProgress />}
        </button>
        <h1 className="text-red-400 text-center mt-9">
          Already have an account, Switch metamask to the account and refresh
          the page.
        </h1>
      </div>
    </div>
  );
};

export default CreateAccount;
