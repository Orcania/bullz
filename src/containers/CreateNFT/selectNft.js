import React, { useEffect, useState } from "react";
import { collectibles } from "../../data/tokenTypes";
import "./style.scss";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { useMediaQuery } from "@material-ui/core";
import { scrollToTop } from "common/utils";
import { useSelector } from "react-redux";
import { NftService } from "../../services/nft.service";
import { UserService } from "../../services/user.service";
import { CollectionService } from "../../services/collection.service";
import { Spinner } from "react-bootstrap";
import NftCard from "./nftCard";
import { Select, Menu, MenuItem } from "@material-ui/core";
import { useHistory } from "react-router";
import ReactPaginate from "react-paginate";
import { NftScannerService } from "services/nft-scanner.service";
import CustomAlert from "components/CustomAlert";
import { printLog } from "utils/printLog";

const SelectNFT = ({
  collectibleType,
  step,
  goPreviousStep,
  selectedNft,
  onClickNft,
  showNotification,
  selectedNetwork
}) => {
  const history = useHistory();
  const network = useSelector((state) => state.web3.network);
  const userData = useSelector((state) => state.auth.userData);
  const isMobile = useMediaQuery("(min-width:350px) and (max-width:1023px)");

  const nftService = new NftService(network.backendUrl);
  const userService = new UserService(network.backendUrl);
  const collectionService = new CollectionService(network.backendUrl);
  const nftScannerService = new NftScannerService(network.backendUrl);

  const [nfts, setNfts] = useState([]);
  const [nftsLoading, setNftsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [recordsFrom, setRecordsFrom] = useState(0);
  const [recordsTo, setRecordsTo] = useState(0);
  const [selectedPage, setSelectedPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [lastScanned, setLastScanned] = useState("");

  // notification states
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationBtnText, setNotificationBtnText] = useState("");

  const handleChangeLimit = (e) => {
    setSelectedPage(0);
    setLimit(e.target.value);
    setTotalCount(0);
    setTimeout(() => {
      setSelectedPage(1);
    }, 20);
  };

  const handlePageClick = (page) => {
    setSelectedPage(page.selected + 1);
  };

  const startScanning = async () => {
    setNftsLoading(true);
    const scan = await nftScannerService.startScanning({
      user: userData.address,
      chain_id: parseInt(selectedNetwork.chainId, 16),
    });
    setNftsLoading(false);
    printLog(["scan", scan], 'success');
    if (scan) {
      setTotalCount(0);
      setSelectedPage(1);
      getUserNFT();

      // Setting notification
      // setNotificationType('scan');
      // setNotificationMessage(`Please wait a moment while we connect to your wallet to find your existing NFTs`);
      // setNotificationTitle('Scanning...');
      // setNotificationOpen(true);
      // setNotificationBtnText('Ok, Got it');

      // showNotification('Scanning started, it will take few minutes.', 'success');
    } else {
      // Setting notification
      setNotificationType('error');
      setNotificationMessage(`Something went wrong, please try again later.`);
      setNotificationTitle('Scanning...');
      setNotificationOpen(true);
      setNotificationBtnText('Ok, Got it');
    }
  };

  const getScanningData = async () => {
    setNftsLoading(true);
    const scanningData = await nftScannerService.getScanningStatus(
      userData.address,
      parseInt(selectedNetwork.chainId, 16),
      1
    );
    printLog(["scanningData", scanningData], 'success');
    setNftsLoading(false);
    if (scanningData) {
      setLastScanned(scanningData.last_updated);
      getUserNFT();
    } else {
      startScanning();
    }
  };

  async function getUserNFT() {
    setNftsLoading(true);
    const response = await nftService.getNftsForChallenge(
      limit,
      selectedPage,
      userData.address.toLowerCase(),
      parseInt(selectedNetwork.chainId, 16)
    );
    let arr = [];
    if (response) {
      let nftss = response.data;
      setTotalCount(response.totalCount);
      setRecordsFrom((selectedPage - 1) * limit + 1);
      setRecordsTo((selectedPage - 1) * limit + response.data.length);

      for (let i = 0; i < nftss.length; i++) {
        let item = nftss[i];
        let hash = item.uri.split("/ipfs/")[1];
        const holderData = await userService.getUser(item.holder);
        const collectionType = await collectionService.getCollectionsByAddress(
          item.collectionType
        );
        item.holderData = holderData;
        // item.challenges = [nftss[i]];
        item.collectionType = collectionType ? collectionType : "";
        arr.push(item);
      }

      setNfts(arr.length > 0 ? arr : []);
      setNftsLoading(false);
    } else {
      setNfts([]);
      setNftsLoading(false);
    }
  }

  useEffect(() => {
    if (userData?.address) {
      getScanningData();
    }
    scrollToTop();
  }, [userData]);

  useEffect(() => {
    if (selectedPage > 0) {
      getUserNFT();
    }
  }, [selectedPage]);

  const customDialogAlertClose = () => {
    setNotificationTitle('');
    setNotificationMessage('');
    setNotificationType('');
    setNotificationBtnText('');
    setNotificationOpen(false);
  }

  return (
    <>
      <div className="create-step2 select-nft select-item">
        <div className="d-flex align-items-center justify-content-between mb-4">

          <div className="d-flex align-items-center">
            <KeyboardBackspaceIcon
              onClick={goPreviousStep}
              style={{ color: "#FFFFFF", cursor: "pointer" }}
            />
            {(printLog(["collectibleType.type", collectibleType?.type], 'success') &&
              collectibleType &&
              collectibleType.type === "tiktok_duet") ||
              (collectibleType && collectibleType.type === "tiktok_collab") ||
              (collectibleType && collectibleType.type === "nft_challenge") ? (
              <span className="step-lead">
                Step {step === 1 ? step : step - 1} of 4
              </span>
            ) : (
              <span className="step-lead">Step {step} of 7</span>
            )}
          </div>

          <p className="refresh-btn" onClick={startScanning}>
            <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.2685 9.2835C7.36122 10.0697 6.20051 10.5017 5 10.5C2.2385 10.5 0 8.2615 0 5.5C0 2.7385 2.2385 0.5 5 0.5C7.7615 0.5 10 2.7385 10 5.5C10 6.568 9.665 7.558 9.095 8.37L7.5 5.5H9C8.99992 4.5781 8.68141 3.68453 8.09834 2.97045C7.51526 2.25636 6.70343 1.7656 5.80017 1.58118C4.8969 1.39676 3.95767 1.53001 3.14134 1.95838C2.32501 2.38676 1.68171 3.08396 1.32026 3.93204C0.958812 4.78013 0.901403 5.72703 1.15775 6.61257C1.41409 7.49811 1.96845 8.26792 2.72704 8.79178C3.48564 9.31564 4.4019 9.56138 5.32082 9.48744C6.23975 9.4135 7.10493 9.02441 7.77 8.386L8.2685 9.2835Z" fill="white" />
            </svg>
            <span>Refresh</span>
          </p>
        </div>
        <p className="collectible-title">Start creating your NFT Challenge</p>
        <p className="collectible-lead">
          Below you can find your owned NFTs. Select one to airdrop in
          your challenge.
        </p>


        <div className="d-flex flex-column align-items-center mt-4">
          <div className="collectible-group">
            <div className="w-100">
              {nftsLoading ? (
                // {true ? (
                <div className="spinnerStyle">
                  <Spinner animation="border" />
                  <p>
                    This process might take a few minutes to gather all NFTs you
                    own ...
                  </p>
                </div>
              ) : nfts && nfts.length > 0 ? (
                <>
                  <div className="row items-row position-relative w-100 select-item">
                    {nfts.map((nft, index) => (
                      <div key={index} className="explore-item">
                        <NftCard
                          item={nft}
                          key={index}
                          selectedNft={selectedNft}
                          onClickNft={onClickNft}
                        />
                      </div>
                    ))}

                  </div>
                  <p className="collectible-lead mt-4">
                    Please select exactly which NFTs you would like to airdrop.
                  </p>

                  {!nftsLoading && totalCount > 8 && (
                    <div className="pagination-wrapper">
                      <span className="result-info">
                        {`Results: ${recordsFrom} - ${recordsTo} of ${totalCount}`}
                      </span>
                      {totalCount > limit && (
                        <ReactPaginate
                          previousLabel={<svg style={{height: 25, width: 25}} width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15 17.5L10.5 13L15 8.5" stroke="white" stroke-linecap="round"/>
                          </svg>}
                          nextLabel={<svg style={{height: 25, width: 25}} width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 17.5L14.5 13L10 8.5" stroke="white" stroke-linecap="round"/>
                          </svg>      }
                          breakLabel={"..."}
                          breakClassName={"break-me"}
                          pageCount={totalCount / limit}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={5}
                          onPageChange={handlePageClick}
                          containerClassName={"pagination"}
                          forcePage={selectedPage - 1}
                          activeClassName={"active"}
                        />
                      )}
                      <Select value={limit} onChange={handleChangeLimit}>
                        <MenuItem value={8}>8</MenuItem>
                        <MenuItem value={12}>12</MenuItem>
                        <MenuItem value={16}>16</MenuItem>
                      </Select>
                    </div>
                  )}
                </>
              ) : (
                <div
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    // height: "100vh",
                    display: "flex",
                  }}
                >
                  <div className="no-items">
                    <p className="no-items-title">No Items Found</p>
                    <p className="no-items-lead">
                      Browse our marketplace to discover <br /> Challenges or
                      create your own Challenge!
                    </p>
                    <button
                      className="btn-continue"
                      onClick={() => history.push("/discover")}
                    >
                      Browse
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <CustomAlert
        isDialogOpen={notificationOpen}
        customDialogAlertClose={customDialogAlertClose}
        title={notificationTitle}
        message={notificationMessage}
        type={notificationType}
        btnText={notificationBtnText}
      />
    </>
  );
};

export default React.memo(SelectNFT);
