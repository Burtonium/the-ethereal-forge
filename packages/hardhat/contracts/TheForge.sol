// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

interface IMyERC1155Token {
    function forgeMint(address account, uint256 id, uint256 amount) external;
    function forgeBurn(address account, uint256 id, uint256 amount) external;
}

contract TheForge {
    IMyERC1155Token public tokenContract;
    error NonForgeableTokenId(uint256 tokenId);

    constructor(address tokensContract) {
        tokenContract = IMyERC1155Token(tokensContract);
    }

    function forge(uint256 tokenId) public {
        if (tokenId < 3 || tokenId > 6) {
            revert NonForgeableTokenId(tokenId);
        }

        if (tokenId == 3) {
            tokenContract.forgeBurn(msg.sender, 0, 1);
            tokenContract.forgeBurn(msg.sender, 1, 1);
        } else if (tokenId == 4) {
            tokenContract.forgeBurn(msg.sender, 1, 1);
            tokenContract.forgeBurn(msg.sender, 2, 1);
        } else if (tokenId == 5) {
            tokenContract.forgeBurn(msg.sender, 0, 1);
            tokenContract.forgeBurn(msg.sender, 2, 1);
        } else if (tokenId == 6) {
            tokenContract.forgeBurn(msg.sender, 0, 1);
            tokenContract.forgeBurn(msg.sender, 1, 1);
            tokenContract.forgeBurn(msg.sender, 2, 1);
        }

        tokenContract.forgeMint(msg.sender, tokenId, 1);
    }
}
