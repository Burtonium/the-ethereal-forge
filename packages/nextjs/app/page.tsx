/* eslint-disable prettier/prettier */
'use client';

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import ForgeCollection from "~~/components/ForgeCollection";

const Home: NextPage = () => {
  const { address } = useAccount();
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          {address
            ? <ForgeCollection address={address} />
            : <p>Please connect your wallet to play the game.</p>}
        </div>
      </div>
    </>
  );
};

export default Home;
