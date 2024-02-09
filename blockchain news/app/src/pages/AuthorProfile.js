import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import getPublicAddress from "../blockchain/getPublicAddress";
import Post from "../components/Post";
import AuthorsBrick from "../components/AuthorsBrick";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import isConnected from "../blockchain/checkMetamaskConnection";
import { CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import getIsUser from "../blockchain/getIsUser";
import getIsUserById from "../blockchain/getUserById";
import getPostById from "../blockchain/getPostById";
import getPostByItsIdX from "../blockchain/getPostByItsIdX";
import getFollowingByAddr from "../blockchain/getFollowingByAddr";

const AuthorProfile = () => {
  const [UserAdderss, setUserAddress] = useState("");
  const [connected, setConnecyed] = useState(false);
  const [author, setAuthor] = useState({});
  const [pagrLoading, set_pagrLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [authorsFollowing, set_authorsFollowing] = useState([]);
  const [floowSwitchLoading, set_floowSwitchLoading] = useState(false);
  const [userDetails, set_userDetails] = useState({});
  const [editable, set_editable] = useState(false);

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
        const _user = await getIsUser(_addr);
        set_userDetails(_user);
        const _author = await getIsUserById(filter);
        set_editable(_user.id == _author.id ? true : false);
        console.log(_author);
        setAuthor(_author);
        const _postIdss = await getPostById(filter);
        console.log(_postIdss[0]);
        var _posts = [];
        for (var i = 0; i < _postIdss.length; i++) {
          var _currentPost = await getPostByItsIdX(_postIdss[i]);
          _posts.push(_currentPost);
        }
        console.log(_posts);
        setPosts(_posts);
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
        <div className="px-4 flex items-center py-2  w-full max-w-[1000px] cursor-pointer ">
          <ArrowBackIosIcon sx={{ color: "grey", fontSize: 20 }} />
          <h1 className="text-slate-400 text- font-bold tracking-widest">
            Back
          </h1>
        </div>
      </div>

      <div className="w-full flex items-center justify-center  pb-9 px-4 lg:px-0">
        <div className="w-full max-w-[500px] gap-[50px] flex flex-col ">
          {!pagrLoading && connected && (
            <div className="py-9">
              <AuthorsBrick
                uid={author.id}
                name={author.authorName}
                description={author.authorDescription}
                followStatss={
                  authorsFollowing.includes(author.id) ? true : false
                }
                handleFollowSwitchClick={() =>
                  handleFollowSwitchClick(author.id)
                }
                loading={floowSwitchLoading}
                showFollow={!editable}
                editable={editable}
                authorAddress={author.authorAddress}
              />
              <h1 className="text-slate-400 pt-2">
                {author.authorDescription}
              </h1>
            </div>
          )}

          {posts.map((post) => {
            return (
              <div className="flex flex-col gap-6">
                <Post
                  imageURL={post.bannerUrl}
                  tagLine={post.title}
                  para={post.content.split(" ").slice(0, 20).join(" ") + "..."}
                  uid={post.id}
                />
              </div>
            );
          })}

          {filter.length == 0 && !pagrLoading && (
            <div className="w-full flex justify-center items-center">
              <h1 className="text-red-400 text-xl font-bold tracking-widest">
                Seems like you do not have a account.
              </h1>
            </div>
          )}
          {pagrLoading && connected && (
            <div className="w-full flex justify-center items-center">
              {" "}
              <CircularProgress />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorProfile;
