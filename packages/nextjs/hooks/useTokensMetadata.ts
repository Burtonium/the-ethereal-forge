import { useEffect, useState } from "react";
import { useScaffoldContractRead } from "./scaffold-eth";
import { ipfsToHttps } from "~~/utils/ipfs";
import parseMetadata, { NFTMetadata } from "~~/utils/parseNFTMetadata";

const tokenIds = [0, 1, 2, 3, 4, 5];

const useTokensMetadata = () => {
  const [metadatas, setMetadatas] = useState<NFTMetadata[]>([]);
  const uriRead = useScaffoldContractRead({
    contractName: "TheForgeTokens",
    functionName: "uri",
    args: [BigInt(0)],
  });

  useEffect(() => {
    if (uriRead.isSuccess && uriRead.data !== undefined) {
      const url = uriRead.data as string;
      const urls = tokenIds.map(id => ipfsToHttps(url.replace("0", id.toString())));

      Promise.all(urls.map(async url => (await fetch(url)).json())).then(metas => {
        setMetadatas(metas.map(parseMetadata));
      });
    }
  }, [uriRead.data, uriRead.isSuccess]);

  return metadatas;
};

export default useTokensMetadata;
