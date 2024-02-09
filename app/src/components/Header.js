import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CreateAccount from "../pages/CreateAccount";

const Header = ({ page, connectStats, connectFunc, userId, isUser }) => {
  const [showCreateAccount, set_showCreateAccount] = useState(false);

  const switchCreateAccount = () => {
    set_showCreateAccount((prevVal) => !prevVal);
  };

  return (
    <div className="w-full   flex flex-col items-center gap-9">
      <div className="w-full pb-2 pt-9 flex justify-between rounded-b-lg max-w-[1000px]  ">
        <div className="flex justify-center items-center gap-3">
          <img className="w-[50px] " src={"https://i.imgur.com/tLNln7x.jpeg"} />
          <h1 className="text-slate-400 text-left font-black tracking-widest text-3xl">
            DeNews
          </h1>
        </div>
        {!connectStats && (
          <button
            onClick={connectFunc}
            className="bg-[#e7e752] rounded-3xl  font-black px-3 py-1 "
          >
            Connect Wallet
          </button>
        )}

        {connectStats && isUser && (
          <a href={"/author/" + userId}>
            <button>
              <AccountCircleIcon sx={{ color: "grey", fontSize: 40 }} />
            </button>
          </a>
        )}
        {connectStats && !isUser && (
          <button onClick={() => set_showCreateAccount(true)}>
            <AccountCircleIcon sx={{ color: "grey", fontSize: 40 }} />
          </button>
        )}
      </div>
      <div className="flex justify-center items-center gap-3">
        {page != "home" && (
          <a href="/home">
            <button className="font-bold text-slate-400">Home</button>
          </a>
        )}
        {page == "home" && (
          <a href="/home">
            <button className="font-bold text-black py-1 px-3 bg-[#e7e752] rounded-3xl ">
              Home
            </button>
          </a>
        )}
        {page != "airdrop" && (
          <a href="/news">
            <button className="font-bold text-slate-400">News</button>
          </a>
        )}

        {page == "airdrop" && (
          <a href="/news">
            <button className="font-bold text-black py-1 px-3 bg-[#e7e752] rounded-3xl ">
              News
            </button>{" "}
          </a>
        )}

        {page != "authors" && (
          <a href="/author">
            <button className="font-bold text-slate-400">Authors</button>
          </a>
        )}
        {page == "authors" && (
          <a href="/author">
            <button className="font-bold text-black py-1 px-3 bg-[#e7e752] rounded-3xl ">
              Authors
            </button>
          </a>
        )}
      </div>
      {showCreateAccount && (
        <CreateAccount switchCreateAccount={switchCreateAccount} />
      )}
    </div>
  );
};

export default Header;
