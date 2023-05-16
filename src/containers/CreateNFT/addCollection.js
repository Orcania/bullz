import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import { DialogContent, Typography } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { Select, MenuItem } from "@material-ui/core";
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import React, { useState, useEffect } from "react";

import ReactPaginate from "react-paginate";

import { useDispatch, useSelector } from "react-redux";

import { Spinner } from "react-bootstrap";

import Dropzone from "react-dropzone";

import Web3 from "web3";


import ERC1155_ABI from "../../abis/ERC1155.json";
import { parseAbi, parseByteCode } from "../../common/utils";
import { CollectionService } from "../../services/collection.service";
import Loader from "../../components/Loader/loader";

import PreviewNFT from "./previewNFT";
import "./style.scss";
import { useMediaQuery } from "@material-ui/core"
import { scrollToTop } from 'common/utils';
import CustomLoader from "components/CustomLoader/CustomLoader";
import {Web3TransactionService} from '../../services/web3transaction.service';
import { printLog } from "utils/printLog";


const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(3),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography {...other} className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <svg
          width="9"
          height="9"
          viewBox="0 0 9 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={onClose}
          className="close_button"
        >
          <path
            d="M4.5 3.50016L8.00016 0L9 0.999843L5.49984 4.5L9 8.00016L8.00016 9L4.5 5.49984L0.999843 9L0 8.00016L3.50016 4.5L0 0.999843L0.999843 0L4.5 3.50016Z"
            fill="#D2D2D2"
          />
        </svg>
      ) : null}
    </MuiDialogTitle>
  );
});

const Explore = ({
  collectibleType,
  setStep,
  addMultiple,
  collectible,
  form,
  file,
  coverFile,
  onUploadFile,
  selectedCollection,
  setSelectedCollection,
  setIsLoading,
  step,
  goPreviousStep,
  showNotification,
  ...props
}) => {
  const collectionType =
    collectible && collectible.key === "multiple" ? "multiple" : "single";

  const web3Connected = useSelector((state) => {
    return state.web3.web3connected;
  });
  const web3Object = useSelector((state) => {
    return state.web3.web3object;
  });

  const wcProvider = useSelector((state) =>  state.web3.wcProvider);
  const userData = useSelector((state) => state.auth.userData);
  const wcPopupConfig = useSelector((state) => state.web3.wcPopupConfig);

  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [collectionFile, setCollectionFile] = useState(null);
  const [collectionFileCover, setCollectionCoverFile] = useState(null);

  const [collectionPreview, setCollectionPreview] = useState(null);
  const [collectionCoverPreview, setCollectionCoverPreview] = useState(null);

  const network = useSelector((state) => state.web3.network);
  const dispatch = useDispatch();
  const collectionService = new CollectionService(network.backendUrl);

  const [collectionName, setCollectionName] = useState("");
  const [collectionSymbol, setCollectionSymbol] = useState("");

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [fileLoading, setFileLoading] = useState({
    collectionFile: false,
  });

  const [selectedPage, setSelectedPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [totalCount, setTotalCount] = useState(0);
  const [recordsFrom, setRecordsFrom] = useState(0);
  const [recordsTo, setRecordsTo] = useState(0);
  const [isLoading, setIsCollectionLoading] = useState(true);

  const isMobile = useMediaQuery('(min-width:350px) and (max-width:1023px)');

  const handleChangeLimit = (e) => {
    setLimit(e.target.value);
    setSelectedPage(0);
    setTimeout(() => {
      setSelectedPage(1);
    }, 0)
  };

  const handlePageClick = (page) => {
    setSelectedPage(page.selected + 1);
  };

  const fetchAllCollections = async () => {
    let res = await collectionService.getCollectionsByTypePaginate(
      limit,
      selectedPage,
      collectionType,
      userData.id,
      parseInt(network.chainId, 16)
    );
    if (res.data) {
      setTotalCount(res.totalCount);
      setRecordsFrom((selectedPage - 1) * limit + 1);
      setRecordsTo((selectedPage - 1) * limit + res.data.length);
      let filtered = []
      if (selectedPage === 1)
      {
        if(res.yaaas)
        {
          filtered = [res.yaaas, ...res.data]
        } else {
          filtered = [...res.data];
        }
      }
      else {
        filtered = [...res.data]
      }
      setCollections((prevState) => [...filtered]);
    }
    setIsCollectionLoading(false);
  };

  useEffect(() => {
    scrollToTop()
  }, [])

  const createButtonDisabled = () => {
    if (!collectionName || !collectionSymbol || !collectionPreview)  {
      return true;
    }
    return false;
  }

  useEffect(() => {
    if (selectedPage) {
      setIsCollectionLoading(true);
      fetchAllCollections();
    }
  }, [selectedPage]);


  const handleClose = () => {
    setOpen(false);
  };

  const getDropzoneImageRatio = (file, callback=()=>{}) =>{
    const i = new Image()
    i.src = file.preview;

    i.onload = () => {
      const ratio = i.width/i.height;
      callback(ratio)
    };
  }

  const handleCollectionFile = (value, type) =>{
    if(value[0]){
      if(value[0].type === "image/png" ||
      value[0].type === "image/jpeg" ||
      value[0].type === "image/jpg" ||
      value[0].type === "image/webp"){
        if (value[0].size <= 104857600) {
          getDropzoneImageRatio(value[0], (ratio) => {
            if( type === "collectionFileCover" && (ratio <2 || ratio >4)){
              showNotification("Image ratio should be between 2 and 4")
            }else if(type === "collectionFile" && (ratio <.5 || ratio >2)){
              showNotification("Image ratio should be between .5 and 2")
            }else{
              onAddFile(value, type);
            }
          })
        } else {
          showNotification("File size can be max 100MB.")
        }
      }else{
        showNotification("File type not supported");
      }
    }
  }

  const onAddFile = async (value, comingFor = "nftFile") => {
    setFileLoading({ ...fileLoading, [comingFor]: true });
    if (comingFor === "collectionFile") {
      let res = await onUploadFile(value[0], "image", comingFor);
      if (res) {
        setCollectionFile(value[0]);
        setCollectionPreview(res);
      }
    } else if (comingFor === "collectionFileCover") {
      let res = await onUploadFile(value[0], "image", comingFor);
      if (res) {
        setCollectionCoverFile(value[0]);
        setCollectionCoverPreview(res);
      }
    }
    setFileLoading((prevState) => ({ ...prevState, [comingFor]: false }));
  };

  const addCollectionFile = async () => {
    if (createButtonDisabled()) {
      return;
    }

    if (web3Object && web3Connected) {
      setOpen(false);
      setIsLoading(true);
      const web3 = web3Object;
      const accounts = await web3.eth.getAccounts();

      let abi = parseAbi(ERC1155_ABI);          
      let bytecode = parseByteCode(ERC1155_ABI)

      
      if (localStorage.getItem("connectedWith") == "walletConnect") {
        const web3TransactionService = new Web3TransactionService(
          web3Object,
          wcPopupConfig,
          dispatch
        );        

        const transactionCallback = async (success, result) => {
          printLog(['transactionCallback', success, result], 'success');
          if (success) {
            if (true) {
              const file = {
                image: collectionPreview
                  ? collectionPreview
                  : '/images/card_yiki.png',
                name: collectionName,
                symbol: collectionSymbol,
                type: collectionType,
                address: result.contractAddress.toLowerCase(),
                user: userData.id,
                coverImage: collectionCoverPreview
                  ? collectionCoverPreview
                  : '/images/yiki_bg.png',
                coverImageType: collectionCoverPreview
                  ? collectionFileCover.type
                  : 'image/png',
                chain_id: parseInt(network.chainId, 16)
              };
              let added = await collectionService.saveCollecion(file);
              if (added) {
                const newIndex = collections.length;
                setCollections([...collections, file]);
                setOpen(false);
                setCollectionFile(null);
                setCollectionPreview(null);
                setCollectionName('');
                setCollectionSymbol("");
                setCollectionCoverFile('');
                setCollectionCoverPreview(null);
                setSelectedCollection(file);
              }
            }
            setIsLoading(false);
          } else {
            // toast.show('Transaction failed', {type: 'danger'});
            setIsLoading(false);
          }
        };
        web3TransactionService.deployContract(
          abi,
          bytecode,
          collectionName, 
          collectionSymbol,
          accounts[0],
          transactionCallback,
        );

      } else {

        printLog(['web31', web3], 'success');
        printLog(['abi', abi], 'success');
        const contract = new web3.eth.Contract(abi);
        printLog(['contract', contract], 'success');
        printLog(['bytecode', bytecode, 'success']);
        const estimatedGas = await contract
          .deploy({ data: bytecode, arguments: [collectionName, collectionSymbol] })
          .estimateGas({ from: accounts[0] });
        const gasPrice = await web3.eth.getGasPrice();       

        printLog([estimatedGas + " " + gasPrice], 'success');
        printLog([bytecode], 'success');
        const result = await contract
          .deploy({ data: bytecode, arguments: [collectionName, collectionSymbol] })
          .send({
            from: accounts[0],
            gasLimit: estimatedGas,
            gasPrice: gasPrice
          })
          .then((res) => {
            printLog(['res', res], 'success');
            return res;
          })
          .catch((err) => {
            printLog(['err', err]);
            setIsLoading(false);
            return false;
          });
        printLog([result], 'success');
        if (result) {
          if (true) {
            const file = {
              image: collectionPreview
                ? collectionPreview
                : "/images/card_yiki.png",
              name: collectionName,
              symbol: collectionSymbol,
              type: collectionType,
              address: result._address.toLowerCase(),
              user: userData.id,
              coverImage: collectionCoverPreview
                ? collectionCoverPreview
                : "/images/yiki_bg.png",
              coverImageType: collectionCoverPreview
                ? collectionFileCover.type
                : "image/png",
              chain_id: parseInt(network.chainId, 16),
            };
            let added = await collectionService.saveCollecion(file);
            if (added) {
              setCollections([...collections, file]);
              setOpen(false);
              setCollectionFile(null);
              setCollectionPreview(null);
              setCollectionName("");
              setCollectionSymbol("");
              setCollectionCoverFile("");
              setCollectionCoverPreview(null);
              setSelectedCollection(file);
            }
            setIsLoading(false);
          }
        }
      }
    }
  };

  const handleCollectionNameChanged = (value) => {
    setCollectionName(value);
  };

  const handleCollectionSymbolChanged = (value) => {
    setCollectionSymbol(value);
  };

  const removeFile = (removeType) => {
    printLog(['removefile', removeType], 'success');
    setCollectionFile(null);
    setCollectionPreview(null);
  }
  

  printLog(["collections", collections, selectedCollection], 'success');
  return (
    <div className="create-step4">
      {isLoading ? (
        <div className="spinnerStyle">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <div className="d-flex align-items-center mb-4">
            <KeyboardBackspaceIcon
              onClick={goPreviousStep}
              style={{ color: "#FFFFFF", cursor: "pointer" }}
            />
            {(collectibleType && collectibleType.type === "tiktok_duet") ||
              (collectibleType && collectibleType.type === "tiktok_collab") ||
              (collectibleType && collectibleType.type === "nft_challenge")
              ? (
              <span className="step-lead">
                Step {step} of 5
              </span>
            ) : (
              <span className="step-lead">Step {step} of 5</span>
            )}
          </div>
          <div className="">
            <p className="collectible-title mb-2">Choose Collection</p>
           
          </div>
          <div className="upload-section">
            <div className="detail-panel">
              <div className="collection-wrapper">
                <div
                  className="collection-create-card1"
                  onClick={() => setOpen(true)}
                >
                  <img
                    src={"/images/plus-icon-dark-bg.png"}
                    alt="Collection"
                  />

                  <span className="collection-name">Create New</span>
                </div>

                {collections.length>0 &&  collections.map((item, index) => (
                  <div
                    className={`collection-create-card ${selectedCollection && item.id === selectedCollection.id ? "active" : ""
                      }`}
                    name={item.id}  
                    key={item.id}
                    onClick={() => {
                      if (selectedCollection && item.id === selectedCollection.id) {
                        setSelectedCollection("");
                      } else {
                        setSelectedCollection(item);
                      }
                    }}
                  >
                    <img
                      src={item.image ? item.image : "/images/default-profile-cover.png"}
                      alt="Collection"
                    />
                    <p className="collection-name">{item.name ? item.name : "Collection"}</p>
                    <p className="collection-name">({item.symbol})</p>
                  </div>
                ))}
              </div>

              {
                collections.length > 0 && <>
                  {
                    isMobile
                      ? <div className="d-flex flex-column align-items-center justify-content-center">
                        {/* <button
                          className={`btn-continue mt-2 ${selectedCollection ? "" : "disable"}`}
                          onClick={() => setStep(5)}
                          style={{ marginBottom: 16 }}
                        >
                          Continue
                        </button> */}

                        {/* <button
                          className={`btn-preview ${selectedCollection ? "" : "disable"}`}
                          onClick={() => setIsPreviewOpen(true)}
                        >
                          Preview
                        </button> */}
                      </div>
                      : <div>
                        {/* <button
                          className={`btn-continue ${selectedCollection ? "" : "disable"
                            }`}
                          onClick={() => setStep(5)}
                        >
                          Continue
                        </button> */}
                      </div>
                  }
                </>

              }
            </div>
            {
              !isMobile && <PreviewNFT
                file={file}
                coverFile={coverFile}
                form={form}
                collectibleType={collectibleType}
                addMultiple={
                  collectible && collectible.name === "Multiple" ? true : false
                }
                collectible={collectible}
                selectedCollection={selectedCollection}
              />
            }

            {/* Preview modal for mobile views */}
            {
              isMobile && <Dialog
                open={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                className="preview-modal"
              >
                <MuiDialogTitle className="share-modal-header">


                  <IconButton
                    aria-label="close"
                    onClick={() => setIsPreviewOpen(false)}
                    className="close_button"
                  >
                    <CloseIcon />
                  </IconButton>
                </MuiDialogTitle>
                <DialogContent>
                  <PreviewNFT
                    file={file}
                    coverFile={coverFile}
                    form={form}
                    collectibleType={collectibleType}
                    addMultiple={
                      collectible && collectible.name === "Multiple" ? true : false
                    }
                    collectible={collectible}
                  />
                </DialogContent>

              </Dialog>
            }

          </div>

          {totalCount > 4 &&
            <div className="pagination-wrapper">
              <span className="result-info">
                {`Results: ${recordsFrom} - ${recordsTo} of ${totalCount}`}
              </span>
              {!isLoading && totalCount > limit && (
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
                  pageRangeDisplayed={1}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination"}
                  forcePage={selectedPage - 1}
                  activeClassName={"active"}
                />
              )}
              <Select value={limit} onChange={handleChangeLimit}>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={14}>14</MenuItem>
              </Select>
            </div>
          }

          <Dialog
            open={open}
            onClose={handleClose}
            className="create-new-modal"
          >
            <DialogTitle>
              Create New Collection
            </DialogTitle>
            <DialogContent>
              <div className="upload-item">
              <Dropzone
                name="file"
                className="drop-zone"
                multiple={false}
                onDrop={(value)=>handleCollectionFile(value, "collectionFile")}
              >
                
                {collectionFile === null ? (
                  !fileLoading["collectionFile"] ? (
                    <div className="dropify-modal">
                      <img className="icon"  src="/images/upload-icon.svg" alt="" />
                      <p className="title">
                        Upload Collection Cover
                      </p>
                      <p className="subtitle">
                        PNG, JPG, JPEG, WEBP Max 100mb
                      </p>
                    </div>
                  ) : (
                    <div className="dropify-message" style={{ width: '100%' }}>
                      <CustomLoader size={20}/>
                      <p className="title">
                        Uploading...
                      </p>
                      <p className="subtitle">
                        Please wait.  File is being uploaded
                      </p>
                    </div>
                  )
                ) : (
                  <>
                    <img className="upload-icon" src="/images/upload-green.png" alt="" />
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="delete-icon" onClick={(e) => {
                      e.stopPropagation();
                    removeFile('collectionFile');
                  }}>
                      <circle cx="19.5556" cy="19.5556" r="19.5556" fill="#FF4343"/>
                      <path d="M11 13.8008H12.9H28.1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M26.2004 13.8V27.1C26.2004 27.6039 26.0002 28.0872 25.6439 28.4435C25.2876 28.7998 24.8043 29 24.3004 29H14.8004C14.2965 29 13.8132 28.7998 13.4569 28.4435C13.1006 28.0872 12.9004 27.6039 12.9004 27.1V13.8M15.7504 13.8V11.9C15.7504 11.3961 15.9506 10.9128 16.3069 10.5565C16.6632 10.2002 17.1465 10 17.6504 10H21.4504C21.9543 10 22.4376 10.2002 22.7939 10.5565C23.1502 10.9128 23.3504 11.3961 23.3504 11.9V13.8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M17.6504 18.5508V24.2508" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M21.4502 18.5508V24.2508" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg >

                    <div className="d-flex justify-content-center">
                      {collectionFile !== null &&
                        (collectionFile.type === "video/mp4" ||
                        collectionFile.type === "video/mov") ? (
                        <div className="d-flex justify-content-center align-items-center h-100">
                          <p className="m-0 text-white">
                            {collectionFile.name}
                          </p>
                        </div>
                      ) : (
                        <img
                          src={collectionFile.preview}
                          className="banner-image"
                          alt="File"
                        />
                      )}
                    </div>
                  </>
                )}
               
              </Dropzone>
              </div>
              {/* <div className="bannerAvatar">
                <Dropzone
                  name="file"
                  className="avatar-drop-zone"
                  multiple={false}
                  onDrop={(value)=>handleCollectionFile(value, "collectionFile")}
                >
                  {collectionFile === null ? (
                    !fileLoading["collectionFile"] ? (
                      <img
                        src={
                          collectionPreview
                            ? collectionPreview
                            : "/images/yiki.png"
                        }
                        className
                        alt="avatar"
                      />
                    ) : (
                      <Loader />
                    )
                  ) : (
                    <img
                      src={
                        collectionPreview
                          ? collectionPreview
                          : "/images/yiki.png"
                      }
                      className
                      alt="avatar"
                    />
                  )}

                  <button className="btn-choose">Choose</button>
                  <p>Choose collection image</p>
                </Dropzone>
              </div> */}

              <div className="form-group" style={{ marginTop: 20 }}>
                <span className="drop-title">NAME COLLECTION</span>
                <input
                  type="text"
                  value={collectionName}
                  onChange={(e) => handleCollectionNameChanged(e.target.value)}
                  placeholder="e.g. “XYZ Collection” "
                />
              </div>
              <div className="form-group">
                <span className="drop-title">SYMBOL</span>
                <input
                  type="text"
                  value={collectionSymbol}
                  onChange={(e) => handleCollectionSymbolChanged(e.target.value)}
                  placeholder="Enter token symbol eg. “BULLZ”"
                />
              </div>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <button className={`btn-continue mb-3 mt-4 ${createButtonDisabled() ? 'btn-disabled' : ''}`} onClick={addCollectionFile}>
                  Create
                </button>

                <button className="btn-cancel" onClick={handleClose}>
                CANCEL
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default React.memo(Explore);
