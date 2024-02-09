import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import getPublicAddress from "../blockchain/getPublicAddress";
import AuthorsBrick from "../components/AuthorsBrick";
import { CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import isConnected from "../blockchain/checkMetamaskConnection";
import getIsUser from "../blockchain/getIsUser";
import getAuthorCurrentIndex from "../blockchain/getAuthorCurrentIndex";
import getAuthorByIndex from "../blockchain/getAuthorByIndex";
import getFollowingByAddr from "../blockchain/getFollowingByAddr";

const Authors = () => {
  const [UserAdderss, setUserAddress] = useState("");
  const [connected, setConnecyed] = useState(false);
  const [authorsFollowing, set_authorsFollowing] = useState([]);
  const [floowSwitchLoading, set_floowSwitchLoading] = useState(false);
  const [latestModeSelected, set_latestModeSelected] = useState(true);
  const [authors, set_authors] = useState([]);
  const [pagrLoading, set_pagrLoading] = useState(true);
  const [userDetails, set_userDetails] = useState({});

  useEffect(() => {
    console.log("_addr");
    set_authors([""]);
    const firstRun = async () => {
      set_pagrLoading(true);
      if (!connected) {
        const connectionStats = await isConnected();
        if (connectionStats) {
          setConnecyed(true);
          const _addr = await getPublicAddress();
          setUserAddress(_addr);
        } else {
          alert("Connect to MetaMask to continue.");
        }
      } else {
        if (latestModeSelected) {
          const _addr = await getPublicAddress();
          const _user = await getIsUser(_addr);
          set_userDetails(_user);
          const _authorCurretIndex = await getAuthorCurrentIndex();
          const _followingIDs = await getFollowingByAddr(_addr);
          set_authorsFollowing(_followingIDs);
          const _authors = [];
          for (let i = 0; i < _authorCurretIndex; i++) {
            const _currentPost = await getAuthorByIndex(i);
            _authors.push(_currentPost);
          }
          set_authors(_authors);

          set_pagrLoading(false);
        } else {
          const _addr = await getPublicAddress();
          const _user = await getIsUser(_addr);
          set_userDetails(_user);
          const _authorCurretIndex = await getAuthorCurrentIndex();
          const _followingIDs = await getFollowingByAddr(_addr);
          set_authorsFollowing(_followingIDs);
          const _authors = [];
          for (let i = 0; i < _authorCurretIndex; i++) {
            const _currentAuthor = await getAuthorByIndex(i);
            if (_followingIDs.includes(_currentAuthor.id)) {
              _authors.push(_currentAuthor);
            }
          }
          set_authors(_authors);

          set_pagrLoading(false);
        }
      }
    };
    firstRun();
  }, [connected, latestModeSelected]);

  const handleConnectWallet = async () => {
    try {
      const pubAddress = await getPublicAddress();
      setUserAddress(pubAddress);
      if (pubAddress != null) {
        setConnecyed(true);
      }
    } catch (e) {
      setConnecyed(false);
    }
  };

  const handleFollowSwitchClick = async (_author) => {
    set_floowSwitchLoading(true);
    await alert(_author);
    set_floowSwitchLoading(false);
  };

  const reloadFollowingList = async () => {
    const _addr = await getPublicAddress();
    const _followingIDs = await getFollowingByAddr(_addr);
    set_authorsFollowing(_followingIDs);
  };

  return (
    <div className="w-screen  flex flex-col bg-black gap-[90px] px-3 lg:px-9 pb-[10px] ">
      <Header
        page={"authors"}
        connectStats={connected}
        connectFunc={handleConnectWallet}
        userAddr={UserAdderss}
        userId={userDetails.id}
        isUser={userDetails.exists}
        reloadFollowingList={reloadFollowingList}
      />
      {/* First Box */}
      <div className="flex w-full justify-center items-center">
        {/* Latest and following */}
        <div className="px-4 lg:px-0 py-2  w-full max-w-[500px] ">
          <button
            onClick={() => set_latestModeSelected(true)}
            className={
              latestModeSelected
                ? "text-slate-300 w-1/2 border-b-[1px] border-[#e7e752] "
                : "text-slate-300 w-1/2 border-b-0 border-[#e7e752]   "
            }
          >
            Latest
          </button>
          <button
            onClick={() => set_latestModeSelected(false)}
            className={
              !latestModeSelected
                ? "text-slate-300 w-1/2 border-b-[1px] border-[#e7e752] "
                : "text-slate-300 w-1/2 border-b-0 border-[#e7e752]   "
            }
          >
            Following
          </button>
        </div>
      </div>

      {/* Following */}
      <div className="w-full flex items-center justify-center  pb-9 px-4 lg:px-0">
        <div className="w-full max-w-[500px] gap-9 flex flex-col ">
          {!pagrLoading &&
            connected &&
            authors.map((author) => {
              return (
                <div className="flex flex-col gap-6">
                  <AuthorsBrick
                    uid={author.id}
                    name={author.authorName}
                    followStatss={
                      authorsFollowing.includes(author.id) ? true : false
                    }
                    handleFollowSwitchClick={() =>
                      handleFollowSwitchClick(author.id)
                    }
                    loading={floowSwitchLoading}
                    showFollow={true}
                    authorAddress={author.authorAddress}
                  />
                </div>
              );
            })}
          {pagrLoading && connected && (
            <div className="w-full flex justify-center items-center">
              {" "}
              <CircularProgress />
            </div>
          )}
          {!connected && (
            <div className="w-full flex justify-center items-center">
              <h1 className="text-xl text-red-400 tracking-widest">
                Connect to Metamask to Continue...
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Authors;
