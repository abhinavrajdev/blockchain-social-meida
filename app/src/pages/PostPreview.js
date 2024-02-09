import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import getPublicAddress from "../blockchain/getPublicAddress";
import Post from "../components/Post";
import AuthorsBrick from "../components/AuthorsBrick";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import isConnected from "../blockchain/checkMetamaskConnection";
import getIsUser from "../blockchain/getIsUser";
import getCurrentPost from "../blockchain/getCurrentPost";
import { useParams } from "react-router-dom";
import getIsUserById from "../blockchain/getUserById";
import getFollowingByAddr from "../blockchain/getFollowingByAddr";
import { CircularProgress } from "@mui/material";

const PostPreview = () => {
  const [UserAdderss, setUserAddress] = useState("");
  const [connected, setConnecyed] = useState(false);
  const [pagrLoading, set_pagrLoading] = useState(true);
  const [post, setPost] = useState({});
  const [author, setAuthor] = useState({});
  const [authorsFollowing, set_authorsFollowing] = useState([]);
  const [floowSwitchLoading, set_floowSwitchLoading] = useState(false);
  const [userDetails, set_userDetails] = useState({});

  const { filter } = useParams();
  useEffect(() => {
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
        const _addr = await getPublicAddress();
        const _currentPost = await getCurrentPost(filter);
        const _authorID = await _currentPost.authorId;
        const _author = await getIsUserById(_authorID);
        setAuthor(_author);
        const _user = await getIsUser(_addr);
        set_userDetails(_user);

        setPost(_currentPost);
        const _followingIDs = await getFollowingByAddr(_addr);
        set_authorsFollowing(_followingIDs);
        set_pagrLoading(false);
      }
    };
    firstRun();
  }, [connected]);

  const handleConnectWallet = async () => {
    try {
      const pubAddress = await getPublicAddress();

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
    <div className="w-screen  flex flex-col bg-black gap-[50px] px-3 lg:px-9 pb-[10px] ">
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
        <div className="px-4 flex items-center py-2  w-full max-w-[1000px] cursor-pointer ">
          <a
            href="/news/"
            className="px-4 flex items-center py-2  w-full max-w-[1000px] cursor-pointer"
          >
            <ArrowBackIosIcon sx={{ color: "grey", fontSize: 20 }} />
            <h1 className="text-slate-400 text- font-bold tracking-widest">
              Back
            </h1>
          </a>
        </div>
      </div>

      <div className="w-full flex items-center justify-center  pb-9 px-4 lg:px-0">
        <div className="w-full max-w-[500px] gap-[50px] flex flex-col ">
          {!pagrLoading && connected && (
            <div className="py-0">
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
          )}

          {!pagrLoading && connected && (
            <div className="flex flex-col gap-6">
              <Post
                imageURL={post.bannerUrl}
                tagLine={post.title}
                para={post.content}
                uid={post.id}
                postPreview={true}
              />
            </div>
          )}
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

export default PostPreview;
