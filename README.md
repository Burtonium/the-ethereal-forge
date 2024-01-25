# ERC1155 Token Minting and Forging WebApp

This web application allows users to mint ERC1155 tokens and 'forge' new ones by burning existing tokens. It integrates with MetaMask and operates on the Polygon network for cost efficiency. Users can mint, burn, and trade tokens according to predefined rules.

## Features

- **Minting Tokens:** Users can mint tokens [0-2] with a cooldown period of 1 minute. Tokens [3-6] can be minted by burning specific combinations of other tokens.
- **Forging Tokens:** Specific tokens can be 'forged' into new ones by burning the required token combinations.
- **Token Limitations:** The collection consists of 7 unique tokens (id [0-6]). Tokens [3-6] cannot be forged into other tokens and can be burned without any return.
- **Trading Tokens:** Any token can be traded for tokens [0-2] through a dedicated trade button.
- **Network Management:** The app prompts the user to switch to the Polygon network if they are not already on it, auto-filling the required fields.
- **Balance Information:** Users can view their MATIC balance and the quantity of each token they own.
- **OpenSea Integration:** A link to view tokens on OpenSea is provided.
- **Styling:** The front-end is styled with modern CSS frameworks for a professional look.
