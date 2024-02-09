import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import getPublicAddress from "../blockchain/getPublicAddress";
import isConnected from "../blockchain/checkMetamaskConnection";
import getIsUser from "../blockchain/getIsUser";
import CallMadeIcon from "@mui/icons-material/CallMade";

const Home = () => {
  const [UserAdderss, setUserAddress] = useState("");
  const [connected, setConnecyed] = useState(false);
  const [userDetails, set_userDetails] = useState({ id: "" });
  const [pagrLoading, set_pagrLoading] = useState(true);

  useEffect(() => {
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
        set_pagrLoading(true);
      }
    };
    firstRun();
  }, [connected]);

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

  return (
    <div className="w-screen  flex flex-col bg-black gap-[90px] px-3 lg:px-9 pb-[10px] ">
      <Header
        page={"home"}
        connectStats={connected}
        connectFunc={handleConnectWallet}
        userAddr={UserAdderss}
        userId={userDetails.id}
        isUser={userDetails.exists}
      />
      {/* First Box */}

      {/* All news */}
      <div className="w-full flex items-center justify-center  pb-9 px-4 lg:px-0">
        <div className="w-full max-w-[1000px] gap-[100px] flex flex-col ">
          <h1 className="text-[#e7e752] text-3xl lg:text-4xl font-black tracking-widest ">
            DECENTRALIZED
            <br />
            <span className="text-8xl lg:text-9xl">
              Social <br /> Media
            </span>
          </h1>
          <div className="flex items-center w-full flex-col gap-6">
            <a className="text-blue-300 cursor-pointer  text-center font-black tracking-widest ">
              Smart Contract <CallMadeIcon />
            </a>
            <a className="text-blue-300 cursor-pointer  text-center font-black tracking-widest ">
              Source Code <CallMadeIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
