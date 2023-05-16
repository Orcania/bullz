export const finalSteps = [
    {
      title: "Approve",
      description: "Approve performing transaction with your wallet",
      status: false,
    },
    {
      title: "Upload files & Mint Token",
      description: "Call contract method",
      status: false,
    },
    {
      title: "Sign sell order",
      description: "Sign sell order using your wallet",
      status: false,
    },
  ];

  export const existingNftSteps = [
    {
      title: "Approve",
      description: "Approve performing transaction with your wallet",
      status: false,
    },
    {
      title: "Sign sell order",
      description: "Sign sell order using your wallet",
      status: false,
    },
  ];
  

  export const resaleConfig = {
    "art": {
      heading: "Allow re-sale of NFT",
      description: `Please select % for Royalties. Suggested: 0%, 1%, 2%. Maximum is ${process.env.REACT_APP_MAX_RESALE_PERCENT}%`,
      resale: true,
    },
    "tiktok_duet": {
      heading: "Allow re-sale before Collaboration",
      description:
        `Please select % for Royalties. Suggested: 0%, 1%, 2%. Maximum is ${process.env.REACT_APP_MAX_RESALE_PERCENT}%`,
      resale: true,
    },
    "tiktok_collab": {
      heading: "Allow re-sale before Collaboration",
      description:
        `Please select % for Royalties. Suggested: 0%, 1%, 2%. Maximum is ${process.env.REACT_APP_MAX_RESALE_PERCENT}%`,
      resale: true,
    },
    "music_promo": {
      heading: "Allow re-sale before actual music promo",
      description:
        `Please select % for Royalties. Suggested: 0%, 1%, 2%. Maximum is ${process.env.REACT_APP_MAX_RESALE_PERCENT}%`,
      resale: true,
    },
  
    "exclusive_content": {
      heading: "Allow re-sale of NFT",
      description: `Please select % for Royalties. Suggested: 0%, 1%, 2%. Maximum is ${process.env.REACT_APP_MAX_RESALE_PERCENT}%`,
      resale: true,
    },
  
    "event_tickets": {
      heading: "Allow re-sale before actual Event",
      description:
        `Please select % for Royalties. Suggested: 0%, 1%, 2%. Maximum is ${process.env.REACT_APP_MAX_RESALE_PERCENT}%`,
      resale: true,
    },
    merchandise: {
      heading: "Allow re-sale",
      description: `Please select % for Royalties. Suggested: 0%, 1%, 2%. Maximum is ${process.env.REACT_APP_MAX_RESALE_PERCENT}%`,
      resale: true,
    },
    nft_challenge: {
      heading: "Allow re-sale of token after token is received by challenge winner (optional)",
      description: `Please select % for Royalties. Suggested: 0%, 1%, 2%. Maximum is ${process.env.REACT_APP_MAX_RESALE_PERCENT}%`,
      resale: true,
    },
  };