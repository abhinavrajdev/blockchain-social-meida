import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import getPublicAddress from "../blockchain/getPublicAddress";

import Post from "../components/Post";
import AuthorsBrick from "../components/AuthorsBrick";
import { CircularProgress } from "@mui/material";
import CreateAccount from "./CreateAccount";
import isConnected from "../blockchain/checkMetamaskConnection";
import getIsUser from "../blockchain/getIsUser";
import AddIcon from "@mui/icons-material/Add";
import PublishArticleWindow from "../components/PublishArticleWindow";
import getPostCurrentIndex from "../blockchain/getPostCurrentIndex";
import getPost from "../blockchain/getPost";
import getFollowingByAddr from "../blockchain/getFollowingByAddr";

const Landingpage = () => {
  const [UserAdderss, setUserAddress] = useState("");
  const [connected, setConnecyed] = useState(false);
  const [posts, setPosts] = useState([]);
  const [authorsFollowing, set_authorsFollowing] = useState([]);
  const [floowSwitchLoading, set_floowSwitchLoading] = useState(false);
  const [latestModeSelected, set_latestModeSelected] = useState(true);
  const [pagrLoading, set_pagrLoading] = useState(true);
  const [userDetails, set_userDetails] = useState({ id: "" });
  const [isUser, set_isUser] = useState(false);

  useEffect(() => {
    setPosts([]);
    console.log("_addr");
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
          const postCurrentIndex = await getPostCurrentIndex();
          const _posts = [];
          for (let i = 0; i < postCurrentIndex; i++) {
            const _currentPost = await getPost(i);
            _posts.push(_currentPost);
          }
          setPosts(_posts);
          const _followingIDs = await getFollowingByAddr(_addr);
          set_authorsFollowing(_followingIDs);
          set_pagrLoading(false);
        } else {
          const _addr = await getPublicAddress();
          const _user = await getIsUser(_addr);
          set_userDetails(_user);
          const postCurrentIndex = await getPostCurrentIndex();
          const _followingIDs = await getFollowingByAddr(_addr);
          set_authorsFollowing(_followingIDs);
          const _posts = [];
          for (let i = 0; i < postCurrentIndex; i++) {
            const _currentPost = await getPost(i);
            if (_followingIDs.includes(_currentPost.authorId)) {
              _posts.push(_currentPost);
            }
          }
          setPosts(_posts);

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
        page={"airdrop"}
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
      {/* All news */}
      <div className="w-full flex items-center justify-center  pb-9 px-4 lg:px-0">
        <div className="w-full max-w-[500px] gap-[100px] flex flex-col ">
          {!pagrLoading && connected && (
            <div>
              <PublishArticleWindow />
            </div>
          )}
          {/* One Post */}
          {!pagrLoading &&
            connected &&
            posts.map((post) => {
              return (
                <div className="flex flex-col gap-6">
                  <AuthorsBrick
                    uid={post.authorId}
                    name={post.authorName}
                    followStatss={
                      authorsFollowing.includes(post.authorId) ? true : false
                    }
                    handleFollowSwitchClick={() =>
                      handleFollowSwitchClick(post.authorId)
                    }
                    loading={floowSwitchLoading}
                    showFollow={true}
                    authorAddress={post.authorAddress}
                  />
                  <Post
                    imageURL={post.bannerUrl}
                    tagLine={post.title}
                    para={
                      post.content.split(" ").slice(0, 20).join(" ") + "..."
                    }
                    uid={post.id}
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

export default Landingpage;
