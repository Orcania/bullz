export const collectibleTypes = [
  {
    name: "All",
    image: "artwork",
    active: false,
    type: "all",
    forFilter: true,
    forTypeList: false,
    addMultiple:false,
    addSingle:true,
    questions: [],
  },

  {
    name: "Artwork",
    image: "artwork",
    active: false,
    type: "art",
    forFilter: true,
    forTypeList: true,
    addMultiple:true,
    addSingle:true,
    questions: [
      {
        que: "What is an Art work?",
        ans: "“Artworks” can be any creative works you would like to sell as NFTs. From visual pieces, to audio pieces or audio-visual. You can get creative!",
      },

      {
        que: "How does it work?",
        ans: "Simply follow the 5 steps to create your NFT. Upload your assets, include detailed information and define the sale price and timeline. You can do it! Let’s go…",
      },
    ],
  },
  {
    name: "Tiktok Duets",
    image: "duets",
    active: false,
    type: "tiktok_duet",
    forFilter: true,
    forTypeList: true,
    addMultiple:false,
    addSingle:true,
    questions: [
      {
        que: "What is a Tiktok Duet?",
        ans: "A “Duet” on TikTok is a feature that allows people to record a video that follows along with another person’s video. ",
      },

      {
        que: "How does it work?",
        ans: "On BULLZ you can sell a TikTok Duet, meaning you will “duet” the video of a buyer who purchases your NFT. You can help someone get more exposure by duetting their video. It’s a new way to collaborate! Let’s go…",
      },
    ],
  },
  {
    name: "Social Collab",
    image: "collab",
    active: false,
    type: "tiktok_collab",
    forFilter: false,
    forTypeList: true,
    addMultiple:false,
    addSingle:true,
    questions: [
      {
        que: "What is a Social Collaboration?",
        ans: "A “Social Collaboration” can be any type of collaboration you decide, such as “stiching” a video, helping out with video ideas, or giving someone a shoutout by video. ",
      },

      {
        que: "How does it work?",
        ans: "On BULLZ you can sell a Social Collaboration, defining what exactly it is you can offer a potential buyer. You can help someone get ideas, receive more exposure or general support. It’s a new way to connect! Let’s go…",
      },
    ],
  },
  {
    name: "Music Promo",
    image: "music",
    active: false,
    type: "music_promo",
    forFilter: true,
    forTypeList: true,
    addMultiple:false,
    addSingle:true,
    questions: [
      {
        que: "What is an Music Promo?",
        ans: "A “Music Promo” is a great way to collaborate as a creator yourself with music artists. Buyer’s can purchase the service to get their music behind your video.",
      },

      {
        que: "How does it work?",
        ans: "On BULLZ you can sell a Music Promo, meaning that you will use a sound or music behind your video/content to give a music artists more exposure and support. It’s a new way to collaborate! Let’s go…",
      },
    ],
  },
  {
    name: "Exclusive Content",
    image: "clock",
    active: false,
    type: "exclusive_content",
    forFilter: true,
    forTypeList: true,
    addMultiple:true,
    addSingle:true,
    questions: [
      {
        que: "What is Exclusive Content?",
        ans: "“Exclusive Content” is a great way to sell collectibles for online access NFTs, allowing controlled access to hidden online resources such as band forums, exclusive e-commerce stores or other online properties.",
      },

      {
        que: "How does it work?",
        ans: "On BULLZ you can sell NFTs that provide access to exclusive content. Simply fill out details about what access your NFT will give a potential buyer. Pssst….Let’s go…",
      },
    ],
  },
  {
    name: "Event Tickets",
    image: "tickets",
    active: false,
    type: "event_tickets",
    forFilter: true,
    forTypeList: true,
    addMultiple:true,
    addSingle:true,
    questions: [
      {
        que: "What are Event Tickets?",
        ans: "“Event Tickets” are a great way to sell NFTs for special concerts/meet-n- greets/launch events/backstage passes and any other type of events.",
      },

      {
        que: "How does it work?",
        ans: "On BULLZ you can sell NFTs for your next event. Simply fill out the event details and what access your NFT will give a potential buyer. It’s a new way to connect! Let’s go…",
      },
    ],
  },
  {
    name: "Merchandise",
    image: "merchandise",
    active: false,
    type: "merchandise",
    forFilter: true,
    forTypeList: true,
    addMultiple:true,
    addSingle:true,
    questions: [
      {
        que: "What is an Merchandise?",
        ans: "“Merchandise” can be any physical or digital wear collectible. You can sell exclusive merchandise to your community! What are you waiting for?",
      },

      {
        que: "How does it work?",
        ans: "On BULLZ you can sell NFTs that provide access to exclusive merchandise. Simply fill out details about your merchandise and what access your NFT will give a potential buyer. Ready? Let’s go…",
      },
    ],
  },
  {
    name: "NFT Challenge",
    image: "challenge",
    active: false,
    type: "nft_challenge",
    forFilter: true,
    forTypeList: true,
    addMultiple:true,
    addSingle:true,
    questions: [
      {
        que: "What is an NFT Challenge?",
        ans: "An “NFT Challenge” is a new way to airdrop your NFTs in exchange for certain actions that you define. You can giveaway your NFTs in exchange for promotional services or other actions you define. ",
      },

      {
        que: "How does it work?",
        ans: "On BULLZ you can airdrop your NFTs for an action you define. Simply fill out details about your NFT giveaway and the steps a user need to follow in order to submit to your “NFT Challenge”. You can then select which submissions will pass the NFT Challenge and airdrop your NFT straight into the users wallet. Let’s go!",
      },
    ],
  },
];

export const collectibles = [
  {
    name: "Single",
    image: "single",
    key: "single",
  },
  {
    name: "Multiple",
    image: "multiple",
    key: "multiple",
  },
  {
    name: "Own NFT/s",
    image: "existing",
    key: "existing",
  },
];

export const assetTypes = [
  {
    name: "NFTs",
    image: "nfts",
    value: 1,
    creationStep: 4
  },
  {
    name: "Tokens",
    image: "tokens",
    value: 2,
    creationStep: 3
  }
];

export const collectibleTexts = {
  tiktok_duet: `Please enter the Tiktok video URL of the video you want the seller to duet. Note: If seller finds video to be inaapropriate or against Tiktok Terms, seller can choose which video to duet.`,
  tiktok_collab: `Please enter the social media profile URL of the profile you want the seller to collaborate with.`,
  music_promo: `Please enter the song/sound OR add a URL to the sound you want the seller to use in their content.`
}