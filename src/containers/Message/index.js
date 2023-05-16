import { Backdrop, CircularProgress, DialogActions, useMediaQuery } from '@material-ui/core';

import React, { useState, useEffect } from 'react';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import socketIOClient from "socket.io-client";

import 'react-tabs/style/react-tabs.css';

import { useSelector } from 'react-redux';

import { useParams } from "react-router-dom";

import { useLayoutEffect } from 'react';

import Loader from "react-loader-spinner";

import { Spinner } from "react-bootstrap";

import { useHistory } from "react-router";

import * as Scroll from 'react-scroll';

import { nft_url_contract_type } from '../../config';
import { ChallengeService } from "../../services/challenge.service";
import { ChatService } from '../../services/chat.service';
import { NftService } from '../../services/nft.service';
import { UserService } from "../../services/user.service";
import MessageUserCard from '../../components/Common/MessageUserCard';

import Scenario1 from './Scenario1';
import './style.scss';
import { useSnackbar } from 'notistack';
import { Picker } from 'emoji-mart';
import ReactEmoji from "react-emoji";
import { useRef } from 'react';
import { S3Config } from './../../config';
import S3 from 'react-aws-s3';
import ReactPlayer from 'react-player/lazy';
import ReactAudioPlayer from "react-audio-player";
import moment from 'moment';
import Lightbox from 'react-image-lightbox';
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import index from './../ErrorPage/index';
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";

import { DialogContent, Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import AddIcon from "@material-ui/icons/Add";
import { isInstagramLinked, isTwitterLinked, isYoutubeLinked, isTwitchLinked, isTiktokLinked } from '../../common/utils' 
import { KeyboardArrowLeft, YouTube } from '@material-ui/icons';
import { printLog } from 'utils/printLog';

let Element = Scroll.Element;
let scroller = Scroll.scroller;

const notificationConfig = {
  preventDuplicate: true,
  vertical: "bottom",
  horizontal: "right",
};

//Loader rooms
const Message = (props) => {
  const userData = useSelector((state) => state.auth.userData);
  const chatJWT = useSelector((state) => state.jwt.chatJWT);
  const network = useSelector((state) => state.web3.network);

  const userService = new UserService(network.backendUrl);
  const nftService = new NftService(network.backendUrl);
  const chatService = new ChatService(network.chatUrl);
  const challengeService = new ChallengeService(network.backendUrl);

  const [considerTiktok, setConsiderTiktok] = useState(false);
  const [considerChallenge, setConsiderChallenge] = useState(false);
  const [message, setMessage] = useState('');
  const [currentRightUser, setCurrentRightUser] = useState();
  const [currentRoom, setCurrentRoom] = useState();
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const [submitStatus, setSubmitStatus] = useState(false);
  const [submitLink, setSubmitLink] = useState(false);
  const [clickedIndex, setClickedIndex] = useState();

  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const [socket, setSocket] = useState();


  const [currentView, setCurrentView] = useState(0);
  const isMobile = useMediaQuery('(min-width:350px) and (max-width:1023px)');

  const fileInputRef = useRef();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedFilesBlobs, setUploadedFilesBlobs] = useState([]);
  const [uploadedFileUrls, setUploadedFileUrls] = useState([]);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [lightBoxPhotoIndex, setLightBoxPhotoIndex] = useState(0);
  const [isOpenLightBox, setIsOpenLightBox] = useState(false);
  const [selectedChatFileUrls, setSelectedChatFileUrls] = useState([]);
  const [fileTypes, setFileTypes] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  // for chat request
  const [isChatRequestOpen, setIsChatRequestOpen] = useState(false);
  const [isRequestSubmitted, setIsRequestSubmitted] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatRequestUser, setChatRequestUser] = useState("");
  const [chatRequests, setChatRequests] = useState([]);


  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const { chatId } = useParams();
  // send a message
  const sendMessage = async () => {

    if (!currentRoom || currentRoom === null) {
      showNotification("please select a room")
      return;
    }
    if (!message && !uploadedFiles.length > 0) {
      showNotification("No content to send")
      return;
    }
    scroll.scrollToBottom({ containerId: "message-part" });

    setEmojiPickerOpen(false);
    uploadFiles((file_urls) => {
      let msg = {};

      if (file_urls.length > 0) {
        msg = {
          "sender_id": userData.id,
          "receiver_id": currentRoom.sender_id === userData.id ? currentRoom.receiver_id : currentRoom.sender_id,
          "seen": false,
          "message": message,
          "room_id": currentRoom.id,
          "type": (message && uploadedFiles.length > 0) ? 3 : message ? 1 : uploadedFiles ? 2 : 0,
          "files": file_urls,
        }
      } else {
        msg = {
          "sender_id": userData.id,
          "receiver_id": currentRoom.sender_id === userData.id ? currentRoom.receiver_id : currentRoom.sender_id,
          "seen": false,
          "message": message,
          "room_id": currentRoom.id,
          "type": (message && uploadedFiles.length > 0) ? 3 : message ? 1 : uploadedFiles ? 2 : 0,
          "files": [],
        }
      }
      socket.emit('msgToServer', msg);
      setMessage('');

      setUploadedFileUrls([]);
      setUploadedFiles([]);
      setUploadedFilesBlobs([]);
      setIsFileUploading(false);
    });

  }
  let scroll = Scroll.animateScroll;
  // scroll to nft card
  const scrollToCard = () => {
    scroller.scrollTo('card-chat', {
      duration: 1000,
      delay: 500,
      smooth: true,
      containerId: 'message-part',
      offset: 50
    })
  }
  // submit a link to the buyer
  const submitOwnerLink = (nftLINK, cb = () => { }) => {
    // let link = prompt("Type NFT link below:", "");
    currentRoom.owner_link = nftLINK;
    setCurrentRoom(currentRoom);
    socket.emit('updateRoomToServer', currentRoom);
    cb();
  }
  const submitBuyerLink = (nftLINK, cb = () => { }) => {
    // let link = prompt("Type NFT link below:", "");
    currentRoom.buyer_link = nftLINK;
    setCurrentRoom(currentRoom);
    socket.emit('updateRoomToServer', currentRoom);
    cb();
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  }
  //@param item: room
  const updateViewMessage = async (item, index) => {
    if (chatId !== item.id) {
      window.history.pushState("", "", `/messaging/${item.id}`);
    }

    setCurrentView(1);

    setClickedIndex(index);

    // get current chat receiver
    if (userData.id === item.sender_id) {
      setCurrentRightUser((await userService.getUserById(item.receiver_id)))
    } else {
      setCurrentRightUser((await userService.getUserById(item.sender_id)))
    }

    if (item.accepted) {
      setLoadingChat(true);

      // update unseen status
      if (item.unseen > 0) {
        const updateUnseenPayload = {
          room_id: item.id,
          receiver_id: userData.id
        }
        await chatService.updateSeenByRoom(updateUnseenPayload);
        // refetchRooms();

        const tempRooms = rooms;
        if (tempRooms[index])
          tempRooms[index].unseen = 0;
        setRooms(tempRooms);
      }


      // load room messages
      const messages = await chatService.getMessagesbyRoom(item.id);
      setMessages(messages);

      // load current nft buyer & seller data
      if (!!item && !!item.nft) {
        item.nft.buyer = await userService.getUserById(item.sender_id);//buyer
        item.nft.creator = await userService.getUserById(item.receiver_id);//seller
        // check if nft is a challenge, than get submit status
        if (item.nft.nftType === "nft_challenge") {
          const submit = (await challengeService.getSubmitbyUserAndNFT(item.sender_id, item.nft_uuid));// check sumbit status if challenge
          printLog(['submit', submit], 'success');
          if (submit) {
            setSubmitStatus(submit?.status);
            setSubmitLink(submit?.link);
          }
        }
      }
      setCurrentRoom(item);



      // get selected type to check senarios
      if (item.nft_uuid !== 'direct-chat') {
        const selectedNft = await nftService.getNft(item.nft_uuid);
        if (!!selectedNft) {
          if (nft_url_contract_type.includes(selectedNft.nftType)) {
            setConsiderTiktok(true);
          } else {
            setConsiderTiktok(false);
          }
          if (selectedNft.nftType === "nft_challenge") {
            setConsiderChallenge(true);
          } else {
            setConsiderChallenge(false);
          }
        }
      }
      setLoadingChat(false);

      scroll.scrollToBottom({ containerId: "message-part" });
    } else {
      setCurrentRoom(item);
      const tempMessage = {
        created_at: item.created_at,
        files: [],
        id: "0",
        message: item.start_message,
        receiver_id: item.receiver_id,
        room: item,
        sender_id: item.sender_id,
        updated_at: item.updated_at,

      }
      
      setMessages([tempMessage]);
      //TODO show the message in view
      //TODO set request accepte UI
    }
  }


  // get room details
  const getRoomDetails = async (room) => {

    if (userData.id === room.sender_id)
      room.currentRightUser = await userService.getUserById(room.receiver_id);
    if (userData.id === room.receiver_id)
      room.currentRightUser = await userService.getUserById(room.sender_id);
    if (room.nft_uuid !== 'direct-chat') {
      if (room.challenge_uuid) {
        const challenge = await challengeService.getChallengeById(room.challenge_uuid);
        printLog(['challenge ', challenge], 'success');
        if (challenge?.id) {
          room.challenge = challenge;
        }
      }

      if (room.nft_id) {
        const nft = await nftService.getNft(room.nft_uuid);
        printLog(['NFT ', nft], 'success');
        if (nft) {
          nft.holderData = await userService.getUser(nft.holder);
          room.nft = nft;
        }
      }
      


    } else {
      room.nft = {};
    }
    return room;
  }

  // get all connected user's room
  const getRooms = async () => {
    setLoadingRooms(true);
    const nRooms = await chatService.getRoomsbyUser(userData.id);
    const roomsD = []
    const requests = [];
    for (let room of nRooms) {
      printLog(["got room"], 'success')
      const detailledRoom = await getRoomDetails(room);
      if (room.accepted) {
        printLog(["room accepted"], 'success')
        roomsD.push(detailledRoom);
      } else {
        printLog(["room not accepted"], 'success')
        detailledRoom.unseen = 1;
        requests.push(detailledRoom);
      }
    }
    setRooms(roomsD);
    setChatRequests(requests);
    setLoadingRooms(false);

    // selecting room from url
    const pathUrl = history.location.pathname;
    const pathComponents = pathUrl.split("/");
    let selectedRoomId = "";
    if (pathComponents.length == 3) {
      selectedRoomId = pathComponents[2];
    }

    if (selectedRoomId) {
      let autoSelectRoom = null;
      let autoSelectTab = 0;
      let autoSelectIndex = 0;

      const roomIndex = roomsD.findIndex(room => room.id === selectedRoomId);
      const requestRoomIndex = requests.findIndex(room => room.id === selectedRoomId);

      if (roomIndex !== -1) {
        autoSelectRoom = roomsD[roomIndex];
        autoSelectTab = 0;
        autoSelectIndex = roomIndex;
      }

      if (requestRoomIndex !== -1) {
        autoSelectRoom = requests[requestRoomIndex];
        autoSelectTab = 1;
        autoSelectIndex = requestRoomIndex;
      }

      if (autoSelectRoom) {
        setTabIndex(autoSelectTab);
        updateViewMessage(autoSelectRoom, autoSelectIndex);
      }

    }
  }
  // load rooms
  useEffect(() => {
    if (chatJWT) {
      printLog([chatJWT], 'success')
      const socketIO = socketIOClient(network.chatUrl, {
        transports: ['websocket'],
        auth: {
          token: chatJWT
        }
      });
      setSocket(socketIO);
    }
  }, [chatJWT, network]);

  const getFileTypes = async () => {
    const fileTypes = await chatService.getFileTypes();
    setFileTypes(fileTypes);
  }

  useEffect(() => {
    if (userData && userData?.id) {
      getRooms();
      getFileTypes();
      if (history.location.tabIndex) {
        setTabIndex(history.location.tabIndex);
      }
    }
  }, [userData]);

  // create or update a room
  useEffect(() => {
    if (socket && chatJWT) {
      socket.removeAllListeners();
      // listen on room creation
      socket.on('roomToClient', room => {
        if (room.sender_id === userData.id || room.receiver_id === userData.id)
          getRoomDetails(room).then(roomDetails => {
            printLog(['room ' + JSON.stringify(roomDetails)], 'success');
            setRooms(rooms => [...rooms, roomDetails]);
          }, error => {
            printLog(['room ' + JSON.stringify(error)], 'success');
          })
      });
      // set current room
      socket.on('updateRoomClient', data => {
        if (data?.is_chat_request) {
          setCurrentRoom(null);
          showNotification("Chat request accepted.", "success");
          setTabIndex(0);
          setMessages([]);
          getRooms();
        } else {
          printLog(['room updated', data], 'success');
          setCurrentRoom(data);
        }
      });

      socket.on("msgToClient", async (data) => {
        if (!currentRoom || currentRoom == null) {
          for (let room of rooms) {
            if (room.id === data.room.id)
              setCurrentRoom(room);
          }
        }

        setMessages(messages => {
          if (messages[0]?.room.id === data.room.id) {
            if (data.receiver_id === userData.id) {
              const payload = {
                id: data.id,
                seen: true
              }
              socket.emit("updateMsgToServer", payload);
            }
            return [...messages, data];
          } else {
            if (data.sender_id === userData.id) {
              return [...messages, data];
            } else {
              return messages;
            }
          }
        });

        //scrollToBottom();
        scroll.scrollToBottom({ containerId: "message-part" });

        // refetching the room list
        await updateRoom(data);
      });

      // Making message seen
      socket.on("updateMsgToClient", (data) => {
        if (data.receiver_id === userData.id) {

          setMessages(messages => {
            const tempMessage = messages;
            const tempMessageIndex = messages.findIndex(item => item.id === data.id);
            if (tempMessageIndex !== -1) {
              tempMessage[tempMessageIndex].seen = true;
            }

            return tempMessage;
          });
        }
      });

      return () => socket.disconnect();
    }
  }, [socket, chatJWT, network]);

  const updateRoom = async (data) => {
    setRooms(rooms => {
      const thisRoom = rooms.find(room => room.id === data.room.id);
      const tempRooms = rooms.filter(room => room.id !== data.room.id);
      if (thisRoom) {
        setCurrentRoom(currentRoom => {
          if (data.room.id !== currentRoom?.id) {
            thisRoom.unseen += 1;
          }
          return currentRoom;
        })

        return [thisRoom, ...tempRooms];
      } else {
        return rooms;
      }
    })
  }

  useLayoutEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    }
  }, []);

  useEffect(() => {
    if (rooms && rooms.length > 0 && !loadingRooms) {
      if (currentRoom && chatId === currentRoom.id) {
        return;
      }
      const room = rooms.find(room => room && room.id === chatId);
      const roomIndex = rooms.findIndex(room => room && room.id === chatId);
      if (room && room.length > 0) {
        updateViewMessage(room, roomIndex);
      }
    }
  }, [rooms, loadingRooms])

  const formatChatDate = (date) => {
    let newDate = new Date(date);
    if ((newDate.getTime() - new Date().getTime()) > 86400000) {
      return newDate.toLocaleDateString() + ' ' + newDate.toLocaleTimeString()
    } else {
      return moment(date).fromNow();
    }
  }

  const handleSocialLinks = (type) => {
    printLog([currentRightUser[type], currentRightUser], 'success')
    if (currentRightUser[type]) {

      window.open(currentRightUser[type]);
    }
  };

  const showNotification = (msg, variant = "") => {
    enqueueSnackbar(msg, {
      ...notificationConfig,
      variant: variant ? variant : "error",
    });
  };

  const handleClickUser = (address) => {
    if (address) {
      history.push(`/profile/${address}`);
    } else {
      showNotification("No user found.");
    }
  }

  const onEmojiClick = () => {
    if (currentRoom && !isFileUploading) {
      setEmojiPickerOpen(!isEmojiPickerOpen);
    }
  }

  const onEmojiSelect = (emoji) => {
    const text = `${message}${emoji.native} `;
    setMessage(text);
  }

  const uploadFiles = (cb) => {
    if (uploadedFiles.length > 0) {
      setIsFileUploading(true);
      const ReactS3Client = new S3(S3Config);
      let filesArray = [];

      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        const file_type_id = fileTypes.find(f => file.type.includes(f.type)).id;

        ReactS3Client.uploadFile(file, file.name).then(async (data) => {
          if (data.status === 204) {
            filesArray = [...filesArray, { url: data.location, base64: "", file_type_id: file_type_id }]
            if (uploadedFiles.length === filesArray.length) {
              cb(filesArray)
            }
          }
          else {
            printLog(["fail"])
            cb([])
          };
        })
      }
    } else {
      cb([])
    }
  }

  const handleFileOnChange = (e) => {
    const files = e.target.files;

    for (let file of files) {
      const blobUrl = URL.createObjectURL(file);
      setUploadedFilesBlobs(uploadedFilesBlobs => [...uploadedFilesBlobs, blobUrl]);
      setUploadedFiles(uploadedFiles => [...uploadedFiles, file]);
      URL.revokeObjectURL(file);
    }
  }

  const clickOnImage = (files) => {
    const imageFiles = files.filter(item => !item.url.includes(".mp4") && !item.url.includes(".mp3"));
    const imageFileUrls = imageFiles.map(item => item.url);
    if (imageFiles.length > 0) {
      setSelectedChatFileUrls(imageFileUrls);
      setIsOpenLightBox(true)
    }
  }

  const handlePreviewItemRemove = (index) => {
    setUploadedFiles(uploadedFiles => [...uploadedFiles.slice(0, index), ...uploadedFiles.slice(index + 1)]);
    setUploadedFilesBlobs(uploadedFilesBlob => [...uploadedFilesBlob.slice(0, index), ...uploadedFilesBlob.slice(index + 1)]);
  }

  const handleMessageRequestSubmit = () => {
    setIsRequestSubmitted(true);
    setChatMessage("");
  }

  const acceptChatRequest = async () => {
    const tempCurrentRoom = currentRoom;

    let tempMessage = {
      sender_id: messages[0].sender_id,
      receiver_id: messages[0].receiver_id,
      seen: true,
      message: messages[0].message,
      room_id: messages[0].room.id,
      created_at: new Date(Number(messages[0].created_at)),
      updated_at: new Date(Number(messages[0].updated_at)),
    };

    await socket.emit('msgToServer', tempMessage);

    const payload = {
      id: tempCurrentRoom.id,
      accepted: true,
      sender_id: tempCurrentRoom.sender_id,
      receiver_id: tempCurrentRoom.receiver_id,
      is_chat_request: true
    }
    socket.emit("updateRoomToServer", payload);
  }

  const declineChatRequest = async () => {
    const result = await chatService.deleteUserChatRequest(currentRoom.id);
    if (result.status === 200) {
      showNotification("Chat request declined.", "success");
      setTabIndex(0);
      setMessages([]);
      getRooms();
      setCurrentRoom(null);
    }
  }

  return (
    <div className="container">
      <div className="message-main">
        <div className="row">
          <div className={`conversation-part ${(isMobile && currentView === 1) ? "d-none" : ""}`}>
            <div className="user-lists">
            <span className="chat-arrow-back mobile-show mb-3">
            <p
                                className="d-inline-block"
                                style={{ cursor: "pointer" }}
                                onClick={() => history.goBack()}
                                // onClick={() => handleNftTypeClick(nft.nftType)}
                              >
                                <KeyboardBackspaceIcon
                                // onClick={goPreviousStep}
                                style={{ marginRight: 12 }}
                              />
                                {/* {getNameAndIcon(nft.nftType).name} */}
                                Back
                              </p>
            </span>
              <div className="list-header">
                <span>All Conversations</span>
                {/* <svg style={{cursor: 'pointer'}} onClick={()=>setIsChatRequestOpen(true)} width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.72727 2.26667V3.77778H1.45455V13.8909L2.73673 12.8444H13.0909V7.55556H14.5455V13.6C14.5455 13.8004 14.4688 13.9926 14.3324 
                    14.1343C14.1961 14.276 14.0111 14.3556 13.8182 14.3556H3.24L0 17V3.02222C0 2.82184 0.0766231 2.62966 0.213013 2.48796C0.349403 2.34627 
                    0.534388 2.26667 0.727273 2.26667H8.72727ZM12.3636 2.26667V0H13.8182V2.26667H16V3.77778H13.8182V6.04444H12.3636V3.77778H10.1818V2.26667H12.3636Z"
                    fill="white" />
                </svg> */}
              </div>
              <div className="list-body">
                {loadingRooms && <div className="w-100 mt-5 d-flex justify-content-center align-items-center">
                  <Loader
                    type="Puff"
                    color="#00BFFF"
                    height={30}
                    width={30}
                  />
                </div>
                }
                {!loadingRooms &&
                  <Tabs
                    selectedIndex={tabIndex}
                    onSelect={index => {
                      if (index !== tabIndex) {
                        setCurrentRoom();
                        setMessages([]);
                      }
                      setTabIndex(index)
                    }}
                  >
                    <TabList>
                      <Tab>Primary</Tab>
                      <Tab>Requests</Tab>
                    </TabList>

                    <TabPanel>
                      <div className="conversation-list-container">
                        {
                          rooms.length > 0
                            ? <>
                              {rooms.map((item, index) => (
                                <div className="col-lg-3 col-md-12" onClick={() => updateViewMessage(item, index)}>
                                  <MessageUserCard room={item} currentRoomId={currentRoom?.id} />
                                </div>
                              ))}
                            </>
                            : <h5 style={{fontSize: 15}} className="text-center text-nowrap mt-3 text-white">You have no chats.</h5>
                        }

                      </div>

                    </TabPanel>
                    <TabPanel>
                      <div className="conversation-list-container">
                        {
                          chatRequests.length > 0
                            ? <>
                              {chatRequests.map((item, index) => (
                                <div className="col-lg-3 col-md-12" onClick={() => updateViewMessage(item, index)}>
                                  <MessageUserCard room={item} currentRoomId={currentRoom?.id} />
                                </div>
                              ))}
                            </>
                            : <h5 style={{fontSize: 15}} className="text-center text-nowrap mt-3 text-white">You have no requests.</h5>
                        }
                      </div>
                    </TabPanel>
                  </Tabs>
                }
              </div>
            </div>
          </div>
          <div className={`middle-message-part ${(isMobile && currentView === 0) ? "d-none" : ""}`}>
            <span className="chat-arrow-back mobile-show">
            <p
                                className="d-inline-block"
                                style={{ cursor: "pointer" }}
                                onClick={() => setCurrentView(0)}
                                // onClick={() => handleNftTypeClick(nft.nftType)}
                              >
                                <KeyboardBackspaceIcon
                                // onClick={goPreviousStep}
                                style={{ marginRight: 12 }}
                              />
                                {/* {getNameAndIcon(nft.nftType).name} */}
                                Back
                              </p>
            </span>
            {/* <img onClick={() => setCurrentView(0)} src="/images/arrow-up.png" alt="arrow-up"  /> */}

            <Element className={`message-part ${(uploadedFiles.length > 0) && !isFileUploading ? "short-height" : tabIndex === 1 ? "request-tab-height" : "long-height"}`} id="message-part">
              {loadingChat ?
                <div className="spinnerStyle">
                  <Spinner animation="border" />
                </div>
                :
                <>
                <Element className="text-center congratulation-text" name="card-chat">
                      {/* Congratulations! this is the start of a direct chat. */}
                    </Element>
                  
                    
                    {/* { currentRoom?.nft_uuid !== "direct-chat"
                  ?
                  <>
                    { currentRoom?.nft?.buyer?.id === userData.id &&
                      <span className="text-center text-white"> Here are the NFT & the Creator's details: </span>
                    }
                    { currentRoom?.nft?.buyer?.id !== userData.id &&
                      <span className="text-center text-white"> Here are the details for the buyer of your NFT: </span>
                    }
                  </>
                  :
                  <span className="text-center text-white"> Direct chat </span>
                } */}
                    {currentRoom && currentRoom.nft_uuid !== 'direct-chat' ?
                    <div className="chat-box">
                      <Scenario1
                        considerTiktok={considerTiktok}
                        considerChallenge={considerChallenge}
                        currentUser={userData}
                        submitOwnerLink={submitOwnerLink}
                        submitBuyerLink={submitBuyerLink}
                        room={currentRoom}
                        submitStatus={submitStatus}
                        showNotification={showNotification}
                      />
                      </div> : <div className="pt-4"></div>
                    }
                  
                  <p className="top-date">{(new Date()).toISOString().slice(0, 10)}</p>
                  {
                    isOpenLightBox && <Lightbox
                      mainSrc={selectedChatFileUrls[lightBoxPhotoIndex]}
                      nextSrc={selectedChatFileUrls[(lightBoxPhotoIndex + 1) % selectedChatFileUrls.length]}
                      prevSrc={selectedChatFileUrls[(lightBoxPhotoIndex + selectedChatFileUrls.length - 1) % selectedChatFileUrls.length]}
                      onCloseRequest={() => setIsOpenLightBox(false)}
                      onMovePrevRequest={() =>
                        setLightBoxPhotoIndex((lightBoxPhotoIndex + selectedChatFileUrls.length - 1) % selectedChatFileUrls.length)
                      }
                      onMoveNextRequest={() =>
                        setLightBoxPhotoIndex((lightBoxPhotoIndex + 1) % selectedChatFileUrls.length)
                      }
                    />
                  }

                  {currentRoom && messages.map((item, index) => (
                    <div className="px-3">
                      {item.sender_id !== userData.id &&
                        <div className='chat-left'>
                          <img src={currentRightUser?.avatar_img} alt="Item" className="card-content-image" />
                          <div className="d-flex flex-column" style={{ width: '80%' }}>
                            <div className="message-file-container justify-content-start">
                              {
                                item?.files && item.files.length > 0 && item.files.map((file, index) => (
                                  (file.url.includes(".mov") || file.url.includes(".mp4"))
                                    ? <div className="w-100 d-flex justify-content-start">
                                      <ReactPlayer
                                        width={"100%"}
                                        height={"100%"}
                                        url={file.url}
                                        playing={false}
                                        controls={true}
                                        className="react-player-chat"
                                        config={{ file: { 
                                          attributes: {
                                            controlsList: 'nodownload'
                                          }
                                        }}}
                                      />
                                    </div>
                                    : file.url.includes(".mp3")
                                      ? <div className="w-100 d-flex justify-content-start mb-3">
                                        <ReactAudioPlayer
                                          src={file.url}
                                          autoPlay={false}
                                          controls
                                        />
                                      </div>
                                      : <img onClick={() => clickOnImage(item.files)} src={file.url} alt="Item" className="message-file-image" />
                                ))
                              }
                            </div>
                            {
                              item.message && <div className="left-message">
                                <span>{ReactEmoji.emojify(item.message)}</span>
                              </div>
                            }
                            <p>{formatChatDate(item.created_at)}</p>
                          </div>

                        </div>
                      }
                      {item.sender_id === userData.id &&
                        <div className="chat-right">
                          <div className="d-flex flex-column align-items-end" style={{ maxWidth: '80%' }}>
                            <div className="message-file-container justify-content-end">
                              {
                                item?.files && item.files.length > 0 && item.files.map((file, index) => (
                                  (file.url.includes(".mov") || file.url.includes(".mp4"))
                                    ? <div className="w-100 d-flex justify-content-end">
                                      <ReactPlayer
                                        width={"100%"}
                                        height={"100%"}
                                        url={file.url}
                                        playing={false}
                                        controls={true}
                                        className="react-player-chat"
                                        config={{ file: { 
                                          attributes: {
                                            controlsList: 'nodownload'
                                          }
                                        }}}
                                      />
                                    </div>
                                    : file.url.includes(".mp3")
                                      ? <div className="w-100 d-flex justify-content-end mb-3">
                                        <ReactAudioPlayer
                                          src={file.url}
                                          autoPlay={false}
                                          controls
                                        />
                                      </div>
                                      : <img onClick={() => clickOnImage(item.files)} src={file.url} alt="Item" className="message-file-image" />
                                ))
                              }
                            </div>
                            {
                              item.message && <div className="left-message">
                                <span>{ReactEmoji.emojify(item.message)}</span>
                              </div>
                            }
                            <p>{formatChatDate(item.created_at)}</p>
                          </div>

                          <img src={userData.avatar_img} alt="Item" className="card-content-image" />
                        </div>
                      }
                    </div>
                  ))}

                  {
                    isFileUploading && <div className="chat-right px-3">
                      <div style={{ width: '80%', marginLeft: 'auto' }}>
                        <p className="overlay">Uploading...</p>
                        <div className="file-preview-container uploading">

                          {uploadedFiles.map((item, index) => (
                            <div className="preview-wrapper">
                              <div className="preview-backdrop-container">
                                <Backdrop className="preview-backdrop" open={true}>
                                  <CircularProgress color="inherit" />
                                </Backdrop>
                              </div>

                              {
                                (item.type === "image/png" ||
                                  item.type === "image/gif" ||
                                  item.type === "image/jpeg" ||
                                  item.type === "image/jpg" ||
                                  item.type === "image/webp")
                                  ? <img src={uploadedFilesBlobs[index]} alt="preview" key={index} />
                                  : (item.type === "video/mp4")
                                    ? <div className="preview-title" style={{ border: 'none' }}> <video src={uploadedFilesBlobs[index]} width="120" height="120" controls={false} autoPlay></video></div>
                                    : <div className="preview-title">
                                      {/* <p className="type">{item.name}</p> */}
                                      <p className="name">{item.name}</p>
                                    </div>
                              }
                            </div>
                          ))}
                        </div>
                      </div>
                      <img src={userData.avatar_img} alt="Item" className="card-content-image" />
                    </div>
                  }
                </>
              }
            </Element>

            {/* <img onClick={() => scrollToCard()} src="/images/arrow-up.png" className="chat-arrow-up" /> */}
            {
              tabIndex === 0 ? (
                <div className="input-text">
                  {
                    uploadedFiles && !isFileUploading && <div className="file-preview-container">

                      {uploadedFiles.map((item, index) => (
                        <div className="preview-wrapper" style={{ position: 'sticky' }}>
                          <div>
                            <IconButton
                              aria-label="close"
                              onClick={() => handlePreviewItemRemove(index)}
                              className="close_button"
                            >
                              <CloseIcon />
                            </IconButton>
                          </div>

                          {
                            (item.type === "image/png" ||
                              item.type === "image/gif" ||
                              item.type === "image/jpeg" ||
                              item.type === "image/jpg" ||
                              item.type === "image/webp")
                              ? <img src={uploadedFilesBlobs[index]} alt="preview" key={index} />
                              : (item.type === "video/mp4")
                                ? <div className="preview-title" style={{ border: 'none' }}> <video src={uploadedFilesBlobs[index]} width="120" height="120" controls={false} autoPlay></video></div>
                                : <div className="preview-title">
                                  {/* <p className="type">{item.name}</p> */}
                                  <p className="name">{item.name}</p>
                                </div>
                          }
                        </div>
                      ))}

                    </div>
                  }

                  <div className="input-wrapper">
                    <div className="d-flex">
                      <img src="/images/smily.svg" alt="Item" className="attach-image mr-2" onClick={onEmojiClick} />
                      {/* <img src="/images/key.png" alt="Item" className="attach-image" /> */}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleFileOnChange}
                      multiple
                      disabled={(currentRoom && !isFileUploading) ? false : true}
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, video/mp4, audio/mp3, audio/mpeg"
                    />
                    <input
                      type="text"
                      disabled={(currentRoom && !isFileUploading) ? false : true}
                      value={message}
                      className="bid-input add-message ml-0"
                      onKeyDown={handleKeyDown}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                    />
                    <svg onClick={() => {
                      if (currentRoom) {
                        fileInputRef.current.click()
                      }
                    }} width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path opacity="0.5" d="M15.5 10.55L9.3 16.75C7.6 18.45 4.9 18.45 3.3 16.75C1.6 15.05 1.6 12.35 3.3 10.75L11.3 2.75C12.3 1.85 13.8 1.85 14.8 2.75C15.8 3.75 15.8 5.35 14.8 6.25L7.9 13.15C7.6 13.45 7.1 13.45 6.8 13.15C6.5 12.85 6.5 12.35 6.8 12.05L11.9 6.95C12.3 6.55 12.3 5.95 11.9 5.55C11.5 5.15 10.9 5.15 10.5 5.55L5.4 10.75C4.3 11.85 4.3 13.55 5.4 14.65C6.5 15.65 8.2 15.65 9.3 14.65L16.2 7.75C18 5.95 18 3.15 16.2 1.35C14.4 -0.45 11.6 -0.45 9.8 1.35L1.8 9.35C0.6 10.55 0 12.15 0 13.75C0 17.25 2.8 19.95 6.3 19.95C8 19.95 9.5 19.25 10.7 18.15L16.9 11.95C17.3 11.55 17.3 10.95 16.9 10.55C16.5 10.15 15.9 10.15 15.5 10.55Z" fill="black" />
                    </svg>

                    <button className='submitMsg' onClick={() => sendMessage()} disabled={(currentRoom && !isFileUploading) ? false : true}>
                      {
                        isFileUploading
                          ? <Spinner animation="border" />
                          : <svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity="0.5" d="M1.9498 16.8849L19.3998 9.40488C20.2098 9.05488 20.2098 7.91488 19.3998 7.56488L1.9498 0.0848801C1.2898 -0.20512 0.559805 0.28488 0.559805 0.99488L0.549805 5.60488C0.549805 6.10488 0.919805 6.53488 1.4198 6.59488L15.5498 8.48488L1.4198 10.3649C0.919805 10.4349 0.549805 10.8649 0.549805 11.3649L0.559805 15.9749C0.559805 16.6849 1.2898 17.1749 1.9498 16.8849Z" fill="black" />
                          </svg>

                      }

                    </button>
                  </div>
                  {
                    isEmojiPickerOpen && (
                      <Picker set='google' title='Pick your emoji…' onSelect={onEmojiSelect} theme="dark" emojiTooltip={true} />
                    )
                  }
                </div>
              ) : currentRoom?.accepted === false ? (
                <div className="input-text">
                  {
                    currentRoom?.sender_id !== userData.id ? (
                      <p className="request-message">
                        @{currentRightUser?.username} wants to start a chat with you. Do you want to allow @{currentRightUser?.username} to send you messages from now on? They’ll only know that you’ve seen their request if you accept it.
                      </p>
                    ) : (
                      <p className="request-message">
                        You sent a request to @{currentRightUser?.username} to chat each other. Do you want to delete the request for now? You’ll only know that they've seen your request if they accept it.
                      </p>
                    )
                  }

                  <div className="request-actions">
                    {
                      currentRoom?.sender_id !== userData.id && (
                        <button className="btn-continue" onClick={acceptChatRequest}>Accept</button>
                      )
                    }                      <button className="btn-cancel" onClick={declineChatRequest}>Delete</button>
                  </div>
                </div>
              ) : <></>
            }



          </div>
          <div className="details-part">
            {currentRightUser &&
              <div className="user-detail mobile-view">
                <img onClick={() => handleClickUser(currentRightUser?.address)} src={currentRightUser?.avatar_img} alt="Avatar" className="card-avatar" />
                <p className="username" style={{ cursor: 'pointer' }} onClick={() => handleClickUser(currentRightUser?.address)}>@{currentRightUser?.username}</p>
                <div className="follow-items">
                  <p className="user-follower">{currentRightUser?.follower?.length} <span> Followers</span> </p>
                  <p className="user-following">{currentRightUser?.following?.length} <span>Following</span> </p>
                </div>

                {(isInstagramLinked(currentRightUser?.instagram_url) || isTwitterLinked(currentRightUser?.twitter_url) || isYoutubeLinked(currentRightUser.youtube_url) || isTwitchLinked(currentRightUser.twitch_url) || isTiktokLinked(currentRightUser.tiktok_url)) && 
                <div className="media-box">
                  <p>Social Media</p>
                  <div className="d-flex justify-content-between">
                    {isInstagramLinked(currentRightUser?.instagram_url) && <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => {
                      handleSocialLinks("instagram_url");
                    }} className="img-media">
                      <path d="M10.5 0H3.5C1.567 0 0 1.567 0 3.5V10.5C0 12.433 1.567 14 3.5 14H10.5C12.433 14 14 12.433 14 10.5V3.5C14 1.567 12.433 0 10.5 0Z" fill="white" />
                      <path d="M9.79823 6.55726C9.88462 7.13983 9.78511 7.73481 9.51386 8.25757C9.24261 8.78033 8.81343 9.20425 8.28737 9.46903C7.76131 9.73381 7.16515 9.82597 6.58368 9.73241C6.00222 9.63884 5.46506 9.36431 5.04862 8.94787C4.63217 8.53142 4.35764 7.99427 4.26408 7.41281C4.17051 6.83134 4.26268 6.23518 4.52746 5.70912C4.79224 5.18306 5.21616 4.75388 5.73892 4.48263C6.26168 4.21138 6.85666 4.11187 7.43923 4.19826C8.03348 4.28638 8.58363 4.56328 9.00842 4.98807C9.43321 5.41286 9.71011 5.96301 9.79823 6.55726Z" stroke="black" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M10.8457 3.14453H10.8534" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    }
                    
                    {isTwitterLinked(currentRightUser?.twitter_url) && <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => {
                      handleSocialLinks("twitter_url");
                    }}
                      className="img-media">
                      <path d="M17.06 0.0507665C16.3174 0.574569 15.4952 0.975193 14.6251 1.23721C14.158 0.700218 13.5374 0.31961 12.847 0.146866C12.1566 -0.0258792 11.4298 0.0175736 10.7649 0.271347C10.1 0.525121 9.52913 0.976971 9.12941 1.56579C8.7297 2.1546 8.52046 2.85197 8.53 3.56358V4.33903C7.16724 4.37437 5.8169 4.07213 4.59923 3.45924C3.38156 2.84634 2.33436 1.94182 1.55091 0.826221C1.55091 0.826221 -1.55091 7.80531 5.42818 10.9071C3.83115 11.9912 1.92868 12.5348 0 12.458C6.97909 16.3353 15.5091 12.458 15.5091 3.54031C15.5084 3.32431 15.4876 3.10884 15.4471 2.89668C16.2385 2.11618 16.797 1.13075 17.06 0.0507665Z" fill="white" />
                    </svg>
                    }

                    {isYoutubeLinked(currentRightUser?.youtube_url) &&
                    <svg onClick={() => {
                          handleSocialLinks("youtube_url");
                        }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M20.9966 6.00125C21.2907 6.30452 21.4997 6.68004 21.6023 7.08989C21.8762 8.60869 22.0092 10.1496 21.9995 11.6928C22.005 13.213 21.872 14.7306 21.6023 16.2267C21.4997 16.6365 21.2907 17.0121 20.9966 17.3153C20.7024 17.6186 20.3334 17.8389 19.9269 17.9539C18.4415 18.3511 12.5 18.3511 12.5 18.3511C12.5 18.3511 6.55849 18.3511 5.07311 17.9539C4.67484 17.8449 4.31141 17.635 4.01793 17.3446C3.72445 17.0541 3.51084 16.6929 3.39775 16.2958C3.12379 14.777 2.9908 13.2361 3.00049 11.6928C2.99293 10.1611 3.1259 8.63188 3.39775 7.12443C3.50033 6.71458 3.70926 6.33906 4.00342 6.0358C4.29759 5.73253 4.66658 5.51227 5.07311 5.39725C6.55849 5 12.5 5 12.5 5C12.5 5 18.4415 5 19.9269 5.36271C20.3334 5.47773 20.7024 5.69799 20.9966 6.00125ZM15.5235 11.6922L10.5578 14.5161V8.86822L15.5235 11.6922Z" fill="white"/>
                    </svg> 
                    }

                    {isTwitchLinked(currentRightUser?.twitch_url) && 
                    <svg onClick={() => {
                      handleSocialLinks("twitch_url");
                    }} width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.29995 3.2002L3.69995 6.4002V19.2002H7.69995V21.6002H10.9L13.3 19.2002H16.5L21.3 14.4002V3.2002H5.29995ZM6.89995 4.8002H19.7V13.6002L17.3 16.0002H12.5L10.1 18.4002V16.0002H6.89995V4.8002ZM10.9 7.2002V12.8002H12.5V7.2002H10.9ZM14.1 7.2002V12.8002H15.7V7.2002H14.1Z" fill="white"/>
                    </svg>
                    }
                    {isTiktokLinked(currentRightUser?.tiktok_url) && 
                    <svg onClick={() => {
                      handleSocialLinks("tiktok_url");
                    }} width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M8.84918 1.17129C8.95906 1.06162 9.10797 1.00002 9.26322 1H11.6169C11.7618 1.00008 11.9016 1.05383 12.0092 1.15086C12.1168 1.2479 12.1846 1.38135 12.1997 1.52547C12.3914 3.35173 13.8607 4.78758 15.7039 4.91982C15.8517 4.93054 15.99 4.99684 16.0908 5.10538C16.1917 5.21391 16.2478 5.35663 16.2477 5.50482V8.24205C16.2477 8.38822 16.1931 8.52913 16.0947 8.63714C15.9962 8.74515 15.8609 8.81247 15.7154 8.82591C15.5697 8.83932 15.4175 8.8488 15.2574 8.8488C14.084 8.8488 13.0213 8.41683 12.1687 7.7349V13.0388C12.1687 16.1158 9.66125 18.6232 6.58437 18.6232C3.50741 18.6232 1 16.1158 1 13.0388C1 9.96183 3.50741 7.45443 6.58437 7.45443C6.69166 7.45443 6.78444 7.46119 6.86312 7.46693C6.88671 7.46865 6.90903 7.47027 6.9301 7.4716C7.07892 7.48093 7.21859 7.54662 7.32067 7.6553C7.42276 7.76399 7.4796 7.90749 7.47961 8.05659V10.5191C7.47971 10.602 7.4622 10.684 7.42826 10.7597C7.39432 10.8353 7.34472 10.9029 7.28272 10.958C7.22072 11.0131 7.14774 11.0544 7.0686 11.0792C6.98947 11.1039 6.90597 11.1117 6.82364 11.1018C6.78033 11.0966 6.74312 11.0918 6.71142 11.0876C6.64969 11.0796 6.60882 11.0743 6.58437 11.0743C5.49193 11.0743 4.61988 11.9464 4.61988 13.0388C4.61988 14.1312 5.49193 15.0044 6.58437 15.0044C7.68559 15.0044 8.65189 14.1349 8.65189 13.0709C8.65189 13.014 8.65302 12.3311 8.65533 11.2518C8.65643 10.7338 8.65787 10.1344 8.65941 9.49266C8.66108 8.79699 8.66287 8.05167 8.66449 7.30675C8.67064 4.44256 8.67708 1.585 8.67708 1.585C8.6774 1.42975 8.73929 1.28096 8.84918 1.17129ZM4.8688 9.01728C5.30167 8.8806 5.78024 8.79324 6.30733 8.76929V8.68281C5.79993 8.71579 5.31562 8.83164 4.8688 9.01728Z" fill="white"/>
                    </svg>
                    }
                    
                  </div>
                </div>}
                
                <div className="status-box">
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="details-botto-text">Owned</p>
                    <p className="details-botto-text text-white">{currentRightUser?.ownedNFTCount}</p>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="details-botto-text">Created</p>
                    <p className="details-botto-text text-white">{currentRightUser?.createdNFTCount}</p>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="details-botto-text">Liked</p>
                    <p className="details-botto-text text-white">{currentRightUser?.likes?.length}</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      {/* chat request dialog */}
      <Dialog
        open={isChatRequestOpen}
        onClose={() => [setIsChatRequestOpen(false)]}
        className="chat-request-modal"
      >
        <DialogContent>
          <div className="request-chat">

            {
              !isRequestSubmitted && (
                <>
                  <label className="message-title">Username</label>
                  <input
                    type="text"
                    className="input-user"
                    value={chatRequestUser}
                    onChange={(e) => setChatRequestUser(e.target.value)}
                    placeholder="Search by username"
                    style={{ borderRadius: chatRequestUser.length > 3 ? "8px 8px 0px 0px" : "8px" }}
                  />
                  {
                    chatRequestUser.length > 3 && (
                      <div className='search-result'>
                        <div className="content">
                          <p>Lorem ipsum</p>
                          <p>Lorem ipsum</p>
                          <p>Lorem ipsum</p>
                          <p>Lorem ipsum</p>
                          <p>Lorem ipsum</p>
                        </div>
                        <div className="actions">
                          <button>Clear</button>
                          <button>Apply</button>
                        </div>
                      </div>
                    )
                  }

                  <label className="message-title">Message</label>
                  <textarea
                    rows={8}
                    type="text"
                    value={chatMessage}
                    onChange={(e) => {
                      // if (e.target.value.length <= 250) {
                      setChatMessage(e.target.value);
                      // } else {
                      //   showNotification("You exeeds max limit 250 character.");
                      // }
                    }}
                    className="input-message"
                    placeholder="Type your message here."
                  />
                </>

              )
            }

            {
              isRequestSubmitted ? (
                <button
                  className={`btn-report btn-active`}
                  onClick={() => [setIsChatRequestOpen(false), setIsRequestSubmitted(false)]}
                >
                  Go Back to Messages
                </button>
              ) : (
                <>
                  <button
                    className={`btn-report ${chatMessage === "" ? "" : "btn-active"}`}
                    onClick={handleMessageRequestSubmit}
                  >
                    Request To Chat
                  </button>
                  <p className="btn-cancel" onClick={() => setIsChatRequestOpen(false)}>
                  CANCEL
                  </p>
                </>
              )
            }

          </div>
        </DialogContent>
        <DialogActions>

        </DialogActions>
      </Dialog>
    </div>
  )
};

export default React.memo(Message);
