// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import { ERC1155 } from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import { Ownable2Step, Ownable } from "@openzeppelin/contracts/access/Ownable2Step.sol";

contract TheForgeTokens is ERC1155, Ownable2Step {
    using Strings for uint256;

    error InvalidTokenId(uint256 tokenId);
    error CooldownNotOver(uint256 remainingTime);
    error UnauthorizedForge(address addr);
    
    mapping(address => uint256) private lastMintTime;
    uint256 private constant COOLDOWN = 1 minutes;
    string private baseURI;
    address public forge;

    constructor()
      ERC1155("ipfs://QmcfhtHVJi1hec3NzuspUWUcvebdro2XTUS4VTTK67UH3W/")
      Ownable(msg.sender)
      {
        baseURI = "ipfs://QmcfhtHVJi1hec3NzuspUWUcvebdro2XTUS4VTTK67UH3W/";
      }

    function setForge(address addr) external onlyOwner {
      forge = addr;
    }

    function setURI(string memory newuri) public onlyOwner {
        baseURI = newuri;
    }

    function uri(uint256 _id) override public view returns (string memory) {
        return string(abi.encodePacked(baseURI, _id.toString()));
    }

    function mint(uint256 id) public {
        if (id > 2) {
            revert InvalidTokenId(id);
        }

        uint256 nextAvailableMint = lastMintTime[msg.sender] + COOLDOWN;
        if (block.timestamp < nextAvailableMint) {
            revert CooldownNotOver(nextAvailableMint - block.timestamp);
        }

        _mint(msg.sender, id, 1, "");
        lastMintTime[msg.sender] = block.timestamp;
    }

    function forgeMint(address account, uint256 id, uint256 amount) public {
        if(msg.sender != forge) {
            revert UnauthorizedForge(msg.sender);
        }
        _mint(account, id, amount, "");
    }

    function forgeBurn(address account, uint256 id, uint256 amount) public {
        if(msg.sender != forge) {
            revert UnauthorizedForge(msg.sender);
        }
        _burn(account, id, amount);
    }
}
