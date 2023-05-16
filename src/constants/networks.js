export const networks = {
  "goerli": {
    backendUrl: `${process.env.REACT_APP_BACKEND_URL_ETH}/api`,
    chatUrl: `${process.env.REACT_APP_BACKEND_URL_ETH_CHAT}`,
    icon: "/networks/eth.png",
    chainName: "ETH",
    chainId: process.env.REACT_APP_CHAIN_ID_ETH,
    rpcUrl: process.env.REACT_APP_NETWORK_ETH_RPCURL,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      token_id:"ethereum"
    },
    smartContracts: {
      BID_UTILITY_TOKENS: [
        {
          name: "WOM TOKEN",
          address: process.env.REACT_APP_NETWORK_ETH_BID_UTILITY_TOKENS_WOM,
          symbol: "WOM",
          logo: "/images/balanceWhite.png",
          token_id:"wom-token"
        },
        {
          name: "USDT",
          address: process.env.REACT_APP_NETWORK_ETH_BID_UTILITY_TOKENS_USDT,
          symbol: "USDT",
          logo: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
          token_id:"tether"
        },
        {
          name: "USDC",
          address: process.env.REACT_APP_NETWORK_ETH_BID_UTILITY_TOKENS_USDC,
          symbol: "USDC",
          logo: "/images/jewelery.png",
          token_id:"usd-coin"
        }
      ],
      CHALLENGE_UTILITY_TOKEN: {
        name: "USDT",
        address: process.env.REACT_APP_NETWORK_ETH_CHALLENGE_UTILITY_TOKEN,
        symbol: "USDT",
        logo: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
        token_id:"tether"
      },
      ERC721_ADDRESS: process.env.REACT_APP_NETWORK_ETH_ERC721_ADDRESS,
      ERC721_EXCHANGER_ADDRESS: process.env.REACT_APP_NETWORK_ETH_ERC721_EXCHANGER_ADDRESS,
      ERC1155_ADDRESS: process.env.REACT_APP_NETWORK_ETH_ERC1155_ADDRESS,
      ERC1155_EXCHANGER_ADDRESS: process.env.REACT_APP_NETWORK_ETH_ERC1155_EXCHANGER_ADDRESS,
      ERC1155_CHALLANGE_ADDRESS: process.env.REACT_APP_NETWORK_ETH_ERC1155_CHALLANGE_ADDRESS
    }
  },
  "bsctestnet": {
    backendUrl: `${process.env.REACT_APP_BACKEND_URL_ETH}/api`,
    chatUrl: `${process.env.REACT_APP_BACKEND_URL_ETH_CHAT}`,
    icon: "/networks/bsc.png",
    chainName: "Binance Smart Chain",
    chainId: process.env.REACT_APP_CHAIN_ID_BSC,
    rpcUrl: process.env.REACT_APP_NETWORK_BSC_RPCURL,
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
      token_id: "binancecoin"
    },
    smartContracts: {
      BID_UTILITY_TOKENS: [
        {
          name: "BUSD",
          address: process.env.REACT_APP_NETWORK_BSC_BID_UTILITY_TOKENS_WBNB,
          symbol: "BUSD",
          logo: "https://w7.pngwing.com/pngs/755/978/png-transparent-dollar-token-graphic-art-coin-money-ico-icon-coin-gold-coin-orange-coins.png",
          token_id:"tether"
        }
        // ,
        // {
        //   name: "BUSD",
        //   address: process.env.REACT_APP_NETWORK_BSC_BID_UTILITY_TOKENS_WOM,
        //   symbol: "BUSD",
        //   logo: "/images/balanceWhite.png",
        //   token_id:"tether"
        // }
      ],
      CHALLENGE_UTILITY_TOKEN: {
        name: "BUSD",
        address: process.env.REACT_APP_NETWORK_BSC_CHALLENGE_UTILITY_TOKEN,
        symbol: "BUSD",
        logo: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
        token_id:"tether"
      },
      ERC721_ADDRESS: process.env.REACT_APP_NETWORK_BSC_ERC721_ADDRESS,
      ERC721_EXCHANGER_ADDRESS: process.env.REACT_APP_NETWORK_BSC_ERC721_EXCHANGER_ADDRESS,
      ERC1155_ADDRESS: process.env.REACT_APP_NETWORK_BSC_ERC1155_ADDRESS,
      ERC1155_EXCHANGER_ADDRESS: process.env.REACT_APP_NETWORK_BSC_ERC1155_EXCHANGER_ADDRESS,
      ERC1155_CHALLANGE_ADDRESS: process.env.REACT_APP_NETWORK_BSC_ERC1155_CHALLANGE_ADDRESS
    }
  },
  "polygon": {
    backendUrl: `${process.env.REACT_APP_BACKEND_URL_ETH}/api`,
    chatUrl: `${process.env.REACT_APP_BACKEND_URL_ETH_CHAT}`,
    icon: "/networks/polygon.png",
    chainName: "Polygon",
    chainId: process.env.REACT_APP_CHAIN_ID_POLY,
    rpcUrl: process.env.REACT_APP_NETWORK_POLYGON_RPCURL,
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
      token_id: "matic-network"
    },
    smartContracts: {
      BID_UTILITY_TOKENS: [
        {
          name: "USDT",
          address: process.env.REACT_APP_NETWORK_POLYGON_BID_UTILITY_TOKENS_USDT,
          symbol: "USDT",
          logo: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
          token_id:"tether"
        }
        // ,
        // {
        //   name: "WOM TOKEN",
        //   address: process.env.REACT_APP_NETWORK_POLYGON_BID_UTILITY_TOKENS_WOM,
        //   symbol: "WOM",
        //   logo: "/images/balanceWhite.png",
        //   token_id:"wom-token"
        // }
      ],
      CHALLENGE_UTILITY_TOKEN: {
        name: "USDT",
        address: process.env.REACT_APP_NETWORK_POLYGON_CHALLENGE_UTILITY_TOKEN,
        symbol: "USDT",
        logo: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
        token_id:"tether"
      },
      ERC721_ADDRESS: process.env.REACT_APP_NETWORK_POLYGON_ERC721_ADDRESS,
      ERC721_EXCHANGER_ADDRESS: process.env.REACT_APP_NETWORK_POLYGON_ERC721_EXCHANGER_ADDRESS,
      ERC1155_ADDRESS: process.env.REACT_APP_NETWORK_POLYGON_ERC1155_ADDRESS,
      ERC1155_EXCHANGER_ADDRESS: process.env.REACT_APP_NETWORK_POLYGON_ERC1155_EXCHANGER_ADDRESS,
      ERC1155_CHALLANGE_ADDRESS: process.env.REACT_APP_NETWORK_POLYGON_ERC1155_CHALLANGE_ADDRESS
    }
  },
  "avalanche": {
    backendUrl: `${process.env.REACT_APP_BACKEND_URL_ETH}/api`,
    chatUrl: `${process.env.REACT_APP_BACKEND_URL_ETH_CHAT}`,
    icon: "/networks/avalanche.png",
    chainName: "Avalanche C-CHAIN",
    chainId: process.env.REACT_APP_CHAIN_ID_AVAL,
    rpcUrl: process.env.REACT_APP_NETWORK_AVAL_RPCURL,
    nativeCurrency: {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18,
      token_id:"avalanche-2"
    },
    smartContracts: {
      BID_UTILITY_TOKENS: [
        // {
        //   name: "WOM TOKEN",
        //   address: process.env.REACT_APP_NETWORK_AVAL_BID_UTILITY_TOKENS_WOM,
        //   symbol: "WOM",
        //   logo: "/images/balanceWhite.png",
        //   token_id:"wom-token"
        // },
        {
          name: "USDT",
          address: process.env.REACT_APP_NETWORK_AVAL_BID_UTILITY_TOKENS_USDT,
          symbol: "USDT",
          logo: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
          token_id:"tether"
        }
      ],
      CHALLENGE_UTILITY_TOKEN: {
        name: "USDT",
        address: process.env.REACT_APP_NETWORK_AVAL_CHALLENGE_UTILITY_TOKEN,
        symbol: "USDT",
        logo: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
        token_id:"tether"
      },
      ERC721_ADDRESS: process.env.REACT_APP_NETWORK_AVAL_ERC721_ADDRESS,
      ERC721_EXCHANGER_ADDRESS: process.env.REACT_APP_NETWORK_AVAL_ERC721_EXCHANGER_ADDRESS,
      ERC1155_ADDRESS: process.env.REACT_APP_NETWORK_AVAL_ERC1155_ADDRESS,
      ERC1155_EXCHANGER_ADDRESS: process.env.REACT_APP_NETWORK_AVAL_ERC1155_EXCHANGER_ADDRESS,
      ERC1155_CHALLANGE_ADDRESS: process.env.REACT_APP_NETWORK_AVAL_ERC1155_CHALLANGE_ADDRESS
    }
  },
  "arbitrum": {
    backendUrl: `${process.env.REACT_APP_BACKEND_URL_ETH}/api`,
    chatUrl: `${process.env.REACT_APP_BACKEND_URL_ETH_CHAT}`,
    icon: "/networks/arbitrum.png",
    chainName: "Arbitrum One",
    chainId: process.env.REACT_APP_CHAIN_ID_ARB,
    rpcUrl: process.env.REACT_APP_NETWORK_ARB_RPCURL,
    nativeCurrency: {
      name: "Arbitrum",
      symbol: "ETH",
      decimals: 18,
      token_id:"ethereum"
    },
    smartContracts: {
      BID_UTILITY_TOKENS: [
        {
          name: "USDT",
          address: process.env.REACT_APP_NETWORK_ARB_BID_UTILITY_TOKENS_USDT,
          symbol: "USDT",
          logo: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
          token_id:"tether"
        }
      ],
      CHALLENGE_UTILITY_TOKEN: {
        name: "USDT",
        address: process.env.REACT_APP_NETWORK_ARB_CHALLENGE_UTILITY_TOKEN,
        symbol: "USDT",
        logo: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
        token_id:"tether"
      },
      ERC721_ADDRESS: process.env.REACT_APP_NETWORK_ARB_ERC721_ADDRESS,
      ERC721_EXCHANGER_ADDRESS: process.env.REACT_APP_NETWORK_ARB_ERC721_EXCHANGER_ADDRESS,
      ERC1155_ADDRESS: process.env.REACT_APP_NETWORK_ARB_ERC1155_ADDRESS,
      ERC1155_EXCHANGER_ADDRESS: process.env.REACT_APP_NETWORK_ARB_ERC1155_EXCHANGER_ADDRESS,
      ERC1155_CHALLANGE_ADDRESS: process.env.REACT_APP_NETWORK_ARB_ERC1155_CHALLANGE_ADDRESS
    }
  },
}