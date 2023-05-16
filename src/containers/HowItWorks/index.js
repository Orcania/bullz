import React, { Fragment } from 'react';
import { scroller } from 'react-scroll';
import './style.scss';

const howItWorksContent = [
  {
    id: 1,
    title: "Choose Blockchain",
    content: [
      { para: "The first step in creating your challenge is about choosing on which blockchain you would like to set up your challenge. Depending on the type of blockchain your choose, you might be asked to switch/connect to the appropriate wallet that supports the blockchain. For example, if you had previously connected your Ethereum wallet but decide to create a challenge on Polygon, you will be asked to switch to the Polygon network and therefore connect the appropriate wallet."}
    ]
  },
  {
    id: 2,
    title: "Choose Type",
    content: [
      { para: "The second step in creating your challenge is about defining what type of challenge you would like to set up, do you want to airdrop NFTs or tokens? If you select NFTs, you will be able to choose existing NFTs (in your wallet) or create completely new ones (either a single NFT OR multiple NFTs). Creating a single NFT means you will only have one winner, while creating multiple NFTs means you can airdrop to many winners. If you select “tokens” you will be asked to select which type of tokens you would like to airdrop." }
    ]
  },
  {
    id: 3,
    title: "Define Challenge",
    content: [
      { para: " The third step is about defining your challenge. You will be asked to upload some assets. If you upload a video, you can also add a thumbnail which will be shown in the preview of your challenge." },
      {para: "Next, you can give your challenge a name and add a description about what a person should do to receive your NFT/token. Get creative! This can be anything from posting a tweet about your project/event, creating a video or using your sound on social media."},
      {para: "Finally, you will be asked about the social media platforms related to your challenge. This is an optional security layer to ensure people submitting to your challenge have verified/connected their social media account with BULLZ."}
    ]
  },
  {
    id: 4,
    title: "Choose Collection (for NFT Challenges only)",
    content: [
      { para: "You’re nearly done! This step is only relevant for NFT Challenges. Here you are asked to choose the collection to which your NFT will be added. You can choose the general BULLZ collection or create your own collection." },
      { para: "If you decide to create your own collection, you will be asked to upload a collection profile image, a collection name and a collection token symbol. It’s that easy!" },
    ]
  },
  {
    id: 5,
    title: "Final Details",
    content: [
      { para: "You’ve reached the final step. This step is about customizing your challenge and setting the deadlines for participants." },
      {para: " If you want to limit the number of people who can submit to your challenge (so you won’t have to review to many submissions when airdropping) you can do that here."},
      {para: "BULLZ only takes a fee for airdropping the NFT/token.  The BULLZ fee has nothing to do with the number of submissions. So, don’t worry!"},
      {para: "If you selected “multiple” NFTs in the initial step, this is the time to define exactly how many “copies” of your NFT you would like to airdrop. This affects the BULLZ fee, as it will require more transactions on our end. This will also affect how many people can win your challenge and receive an NFT."},
      {para: "If you selected “tokens” in the initial step, this is the time to define the total number of  winners and the token amount you would like to airdrop per winner. Please make sure you have the available tokens in your wallet to continue."},
      {para: "For NFT Challenges, you will have the option to set royalties."},
      {para: "Finally, you will be asked to provide a timeline for your challenge. Only after the challenge has finished and submissions were received, you will be able to start the airdrop process. This ensures that everyone has a fair chance to submit and get reviewed by you before you airdrop the NFT/tokens.  Make sure to give yourself enough time for the airdrop process, so you can review your submissions fairly."},
    ]
  },
];

const qaContent = [
  {
    id: 1,
    question: "What are challenges?",
    answers: [
      { para: "Challenges are a new fun way to airdrop NFTs/tokens in return for a service defined. You can create your challenge and describe what a person has to do in order to “win” your NFT/tokens. You will then see all submissions and can decide who receives the airdrop." }
    ],
  },
  {
    id: 2,
    question: "How can I submit to a challenge?",
    answers: [
      { para: "Every challenge is unique. You will find out what you need to do in the description of the challenge." },
      { para: "This can be anything the creator defines. For example, sharing a tweet or creating a video." },
      {para: "When you submit, you will have the option to add a link to your work and upload a file (screenshot proof). "},
      {para: "Then its up to the creator to airdrop the NFT/tokens into your wallet. "}
    ],
  },
]

const HowItWorks = () => {
  const hadleClickOnQuestion = (id) => {
    scroller.scrollTo(id, {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
    });
  }

  return (
    <div className="container">
      <div className="how-it-works-page">
        <div className="how-it-works-content">
          <h1 className="header-title">How it works</h1>
          {
            howItWorksContent.map(item => (
              <div>
                <div className="title-container">
                  <p className="count">{item.id}</p>
                  <p className="title">{item.title}</p>
                </div>
                {
                  item.content.map(content => (
                    <p className="info-text">{content.para}</p>
                  ))
                }
              </div>
            ))
          }
        </div>
        <div className="qa-content">
          <h1 className="header-title">{"Q&A"}</h1>
          <div>
            {
              qaContent.map(item => (
                <div>
                  <p className="question">{item.question}</p>
                  {
                    item.answers.map(answer => (
                      <p className="info-text">{answer.para}</p>
                    ))
                  }
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>

  );
};

export default HowItWorks;
