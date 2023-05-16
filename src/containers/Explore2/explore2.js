import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";

import { useSelector } from "react-redux";

import { collectibleTypes } from "../../data/tokenTypes";
import { CollectionService } from "../../services/collection.service";
import { NftService } from "../../services/nft.service";
import { UserService } from "../../services/user.service";
import Carousel from "../../components/Common/Carousel";
import ExploreFilters from "../../components/ExploreFilters/ExploreFilters";
import NftCard from "../../components/Common/ExploreCard/index";
import LoadingCard from "../../components/Common/LoadingCard/index";

import "./explore2.scss";
import ComingSoonCard from "components/Common/ComingSoonCard";

const optionsCommonCard = {
  responsive: {
    0: {
      items: 1,
    },
    450: {
      items: 1.2,
    },
    560: {
      items: 2,
    },
    768: {
      items: 2.5,
    },
    900: {
      items: 2.5,
    },
    1024: {
      items: 3.7,
    },
    1440: {
      items: 5,
    },
  },
};

export default function Explorer2(props) {
  const history = useHistory();


  const userData = useSelector((state) => state.auth.userData);
  const selectedPageReducer = useSelector((state) => state.auth.selectedPage);
 
  const network = useSelector((state) => state.web3.network);

  const nftService = new NftService(network.backendUrl);
  const userService = new UserService(network.backendUrl);
  const collectionService = new CollectionService(network.backendUrl);

  const [categoryNft, setCategoryNft] = useState("");
  const [categoryNftOriginal, setCategoryNftOriginal] = useState("");
  const [selectedPage, setSelectedPage] = useState(
    selectedPageReducer ? selectedPageReducer : 1
  );
  const [limit, setLimit] = useState(8);

  const [isLoading, setIsLoading] = useState(true);
  const [filteringType, setFilteringType] = useState("");

  async function loadNfts() {
    setIsLoading(true);

    const response = await nftService.getAllExploreNft(limit, selectedPage);
    if (response) {
      let tempResponse = {};
      let res = response;
      for (const property in res) {
        let nftss = res[property];
        let arr = [];
        for (let i = 0; i < nftss.length; i++) {
          let item = nftss[i];
          let hash = item.uri.split("/ipfs/")[1];
          if (hash !== "QmNZrXjye9FbbGcowdXXsT3ee1qhC5nvhYfDdR8qFB4xh3") {
            item = await populateNFT(item);
            arr.push(item);
          }
        }
        arr = fillUpArray(arr);
        tempResponse[property] = arr;
        setCategoryNft(tempResponse);
        setCategoryNftOriginal(tempResponse);
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    loadNfts();
  }, []);

  const fillUpArray = (arr) => {
    for (let i = arr.length + 1; i < 8; i++) {
      let item = {};
      item.cover = `/images/image19${i}.png`
      item.name = "Coming Soon"
      arr.push(item);
    }
    return arr;
  }

  const populateNFT = async (item) => {
    const holderData = await userService.getUser(item.holder);
    const collectionType = await collectionService.getCollectionsByAddress(item.collectionType);
    item.holderData = holderData;
    item.collectionType = collectionType ? collectionType : "";
    return item;
  }

  const setSelectedSubFilterFun = async (obj, type) => {
    setFilteringType(type);
    const response = await nftService.getExploreNftWithFilter(
      7,
      1,
      obj.key === "clear" ? 'all' : obj.value.key,
      `&nftType=${type}`
    );
    if (!response) {
      setFilteringType("");
      return;
    }

    let nftss = response.data;
    let arr = [];
    for (let i = 0; i < nftss.length; i++) {
      let item = nftss[i];
      item = await populateNFT(item);
      arr.push(item);
    }
    arr = fillUpArray(arr);

    let temp = JSON.parse(JSON.stringify(categoryNft));

    let data = {
      ...temp,
      [type]: [...arr],
    };
    setFilteringType("");
    setCategoryNft(data);
  };

  return (
    <div className="container position-relative">
      {isLoading ? (
        <>
          {collectibleTypes.map((item, index) => {
            if (item.forTypeList) {
              return (
                <div
                  className="explor2-page"
                  style={{ paddingTop: index === 1 ? 43 : 17 }}
                >
                  <ExploreFilters
                    name={item.name}
                    type={item.type}
                    setSelectedSubFilterFun={setSelectedSubFilterFun}
                  />
                  <div className="no-bg next-hide">
                    <Carousel
                      items={5}
                      option={{ ...optionsCommonCard, margin: 50 }}
                    >
                      <LoadingCard transition="0.8s linear" />
                      <LoadingCard transition="0.8s linear" />
                      <LoadingCard transition="0.8s linear" />
                      <LoadingCard transition="0.8s linear" />
                      <LoadingCard transition="0.8s linear" />
                      <LoadingCard transition="0.8s linear" />
                    </Carousel>
                  </div>

                  <p
                    className="view-all"
                    onClick={() => {
                      item.type === "nft_challenge"
                        ? history.push(`/challenges`)
                        : history.push(`/explorer/${item.type}`);
                    }}
                  >
                    View all {item.name}
                  </p>
                </div>
              );
            }
          })}
        </>
      ) : (
        <>
          {collectibleTypes.map((item, index) => {
            if (item.forTypeList) {
              return (
                <>
                  {
                    filteringType === item.type ? (
                      <div
                        className="explor2-page"
                        style={{ paddingTop: index === 1 ? 43 : 17 }}
                      >
                        <ExploreFilters
                          name={item.name}
                          type={item.type}
                          setSelectedSubFilterFun={setSelectedSubFilterFun}
                        />
                        <div className="no-bg next-hide">
                          <Carousel
                            items={5}
                            option={{ ...optionsCommonCard, margin: 50 }}
                          >
                            <LoadingCard transition="0.8s linear" />
                            <LoadingCard transition="0.8s linear" />
                            <LoadingCard transition="0.8s linear" />
                            <LoadingCard transition="0.8s linear" />
                            <LoadingCard transition="0.8s linear" />
                            <LoadingCard transition="0.8s linear" />
                          </Carousel>
                        </div>

                        <p
                          className="view-all"
                          onClick={() => {
                            item.type === "nft_challenge"
                              ? history.push(`/challenges`)
                              : history.push(`/explorer/${item.type}`);
                          }}
                        >
                          View all {item.name}
                        </p>
                      </div>
                    ) : (
                      <div className="explor2-page" style={{ paddingTop: 17 }}>
                        <ExploreFilters
                          name={item.name}
                          type={item.type}
                          setSelectedSubFilterFun={setSelectedSubFilterFun}
                        />
                        <div className="">
                          <Carousel
                            items={5}
                            option={{ ...optionsCommonCard, margin: 50 }}
                          >
                            {categoryNft &&
                              categoryNft[item.type] &&
                              categoryNft[item.type].map((slider, index) => <>
                                {
                                  slider?.id
                                    ? (
                                      <NftCard
                                        item={slider}
                                        key={index}
                                        user={slider.holderData}
                                        loggedInUser={userData}
                                        showMenu={true}
                                      />
                                    )
                                    : (
                                      <ComingSoonCard item={slider} key={index} />
                                    )
                                }
                              </>
                              )}
                          </Carousel>
                        </div>

                        <p
                          className="view-all"
                          onClick={() => {
                            item.type === "nft_challenge"
                              ? history.push(`/challenges`)
                              : history.push(`/explorer/${item.type}`);
                          }}
                        >
                          View all {item.name}
                        </p>
                      </div>
                    )
                  }
                </>

              );
            }
          })}
        </>
      )}
    </div>
  );
}
