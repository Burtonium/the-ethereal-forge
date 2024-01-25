"use client";

import { FC, useCallback } from "react";
import { usePublicClient } from "wagmi";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import useCountdown from "~~/hooks/useCountdown";
import useTokens from "~~/hooks/useTokensMetadata";
import { ipfsToHttps } from "~~/utils/ipfs";

type Props = {
  address: string;
};

const tokenIds = [0, 1, 2, 3, 4, 5];

const ForgeCollection: FC<Props> = ({ address }) => {
  const client = usePublicClient();
  const metadatas = useTokens();
  const [cooldown, setCooldownTo] = useCountdown();
  const isCoolingDown = cooldown !== 0;
  const balances = useScaffoldContractRead({
    contractName: "TheForgeTokens",
    functionName: "balanceOfBatch",
    args: [Array(tokenIds.length).fill(address), [0, 1, 2, 3, 4, 5].map(BigInt)],
  });

  const mint = useScaffoldContractWrite({
    contractName: "TheForgeTokens",
    functionName: "mint",
    onBlockConfirmation: async tx => {
      const block = await client.getBlock({
        blockNumber: tx.blockNumber,
      });

      setCooldownTo(block.timestamp + BigInt(60));
      await balances.refetch();
    },
    args: [BigInt(0)],
  });

  const mintResource = useCallback(
    (id: number) => async () => {
      const result = await mint.writeAsync({ args: [BigInt(id)] });
      if (result) {
        await balances.refetch();
      }
    },
    [balances, mint],
  );

  const forge = useScaffoldContractWrite({
    contractName: "TheForge",
    functionName: "forge",
    onBlockConfirmation: async () => {
      await balances.refetch();
    },
    args: [BigInt(0)],
  });

  const forgeItem = useCallback(
    (id: number) => async () => forge.writeAsync({ args: [BigInt(id)] }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [forge],
  );

  return metadatas === undefined || balances.isLoading ? (
    "Loading collection..."
  ) : (
    <>
      <div className="text-right py-5">
        <a
          rel="noopener"
          href="https://testnets.opensea.io/collection/the-ethereal-forge"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          See collection on Opensea.io!
        </a>
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        {metadatas.map((metadata, i: number) => (
          <div className="bg-slate-200 rounded-lg p-5" key={metadata.name}>
            <div className="flex flex-wrap items-center gap-3">
              <img alt="Resource image" className="w-[5rem]" src={ipfsToHttps(metadata.image)} />
              <h2 className="text-xl font-bold">{metadata.name}</h2>
            </div>
            <p className="italic">{metadata.description}</p>
            <p>Balance: {balances.data?.[i].toString()}</p>
            {metadata.category === "Resource" && (
              <button
                disabled={isCoolingDown || mint.isLoading || mint.isMining}
                onClick={mintResource(i)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {isCoolingDown
                  ? `Cooldown ${cooldown}`
                  : mint.isLoading
                  ? "Minting..."
                  : mint.isMining
                  ? "Mining..."
                  : "Mint"}
              </button>
            )}
            {metadata.category === "Craftable" && (
              <>
                <p>Cost: {metadata.cost}</p>
                <button
                  onClick={forgeItem(i)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Forge
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ForgeCollection;
