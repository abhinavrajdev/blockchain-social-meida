import { CircularProgress } from "@mui/material";
import React, { useState } from "react";
import followUser from "../blockchain/follow";
import CreateIcon from "@mui/icons-material/Create";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import SendIcon from "@mui/icons-material/Send";
import sendEther from "../blockchain/sendEther";
import SaveIcon from "@mui/icons-material/Save";
import editProfile from "../blockchain/editProfile";
import getIsUserById from "../blockchain/getUserById";

const AuthorsBrick = ({
  uid,
  name,
  description,
  followStatss,
  showFollow,
  reloadFollowingList,
  authorAddress,
  editable,
}) => {
  const [loading, setloading] = useState(false);
  const [follow, set_follow] = useState(followStatss);
  const [showDonateDialog, set_showDonateDialog] = useState(false);
  const [amount, set_amount] = useState();
  const [donateLoading, set_donateLoading] = useState(false);
  const [showIDedit, set_showIDedit] = useState(false);
  const [author_name, set_author_name] = useState(name);
  const [editLoading, set_editLoading] = useState(false);

  const handleFollowSwitchClick = async () => {
    setloading(true);
    try {
      const res = await followUser(uid);
      set_follow((prev) => !prev);
      reloadFollowingList();
    } catch (error) {}
    setloading(false);
  };

  const handleDonate = async () => {
    set_donateLoading(true);
    const res = await sendEther(authorAddress, amount);
    set_showDonateDialog(false);
    set_donateLoading(false);
  };

  const handleSaveClick = async () => {
    set_editLoading(true);
    const res = await editProfile(author_name, description);
    const author = await getIsUserById(uid);
    set_author_name(author_name);
    set_editLoading(false);
    set_showIDedit(false);
  };

  return (
    <div className="w-full flex items-center ">
      <div className="w-full flex flex-col">
        <div className="flex gap-3 items-center">
          <a className="" href={"/author/" + uid}>
            {!showIDedit && (
              <h1 className="text-slate-300 font-bold ">{name}</h1>
            )}
          </a>
          {editable && !showIDedit && (
            <CreateIcon
              className="cursor-pointer"
              fontSize="small"
              sx={{ color: "pink" }}
              onClick={() => set_showIDedit(true)}
            />
          )}
          {editable && showIDedit && (
            <input
              type="text"
              value={author_name}
              onChange={(e) => set_author_name(e.target.value)}
              className="rounded-lg border-none px-3 py-1 tracking-widest font-bold bg-slate-700 text-slate-200"
            />
          )}
          {editable && showIDedit && !editLoading && (
            <SaveIcon
              className="cursor-pointer"
              fontSize="small"
              sx={{ color: "pink" }}
              onClick={handleSaveClick}
            />
          )}
          {editable && showIDedit && editLoading && (
            <CircularProgress
              className="cursor-pointer"
              fontSize="small"
              sx={{ color: "pink" }}
              onClick={handleSaveClick}
            />
          )}
        </div>
        <a className="w-fit" href={"/author/" + uid}>
          <h1 className="text-[#e7e752] ftext-sm tracking-widest">{uid}</h1>
        </a>
      </div>

      <div>
        {showFollow && (
          <div className="flex items-center gap-3 ">
            {showDonateDialog && (
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => set_amount(e.target.value)}
                  className="rounded-lg border-none px-3 py-1 tracking-widest font-bold bg-slate-700 text-slate-200"
                />
                {!donateLoading && (
                  <SendIcon
                    className="cursor-pointer"
                    onClick={handleDonate}
                    fontSize="small"
                    sx={{ color: "pink" }}
                  />
                )}
                {donateLoading && (
                  <CircularProgress CircularProgress sx={{ fontSize: 0 }} />
                )}
              </div>
            )}
            {!showDonateDialog && (
              <CardGiftcardIcon
                className="cursor-pointer"
                onClick={() => set_showDonateDialog(true)}
                fontSize="small"
                sx={{ color: "pink" }}
              />
            )}
            <button
              disable={loading ? true : false}
              className="bg-[#232b2b] text-slate-400 py-2 px-6 font-bold rounded-xl"
              onClick={handleFollowSwitchClick}
            >
              {follow && !loading && "Unfollow"}
              {!follow && !loading && "Follow"}
              {loading && <CircularProgress sx={{ fontSize: 0 }} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorsBrick;
