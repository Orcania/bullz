import React, { useEffect, useRef, useState } from "react";
import { FormControlLabel, Checkbox } from "@material-ui/core";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CopyIcon from "components/Common/Icons/CopyIcon";
import { Spinner } from "react-bootstrap";
import parse from "html-react-parser";
import { TasksService } from "services/tasks.service";
import AddTaskSubmission from "./addTaskSubmission";
import { PhylloService } from "services/phyllo.service";
import { setUserData } from "redux/actions/authAction";
import {
  isDiscordLinked,
  isTelegramLinked,
  isTwitterLinked,
} from "common/utils";
import { UserService } from "services/user.service";
import { useDispatch } from "react-redux";
import AddQuestionAnswer from "./addQuestionAnswer";
import DiscordLogin from "components/DiscordLogin";
import { SocialAccountService } from "services/social-account.service";
import TelegramLoginButton from "react-telegram-login";
import { printLog } from "utils/printLog";
const TaskBody = ({
  task,
  userData,
  network,
  showCustomAlert,
  isWeb3Connected,
  setIsConnectWalletAlertOpen,
  challenge,
  submissions,
  taskVerified,
}) => {
  const taskService = new TasksService(network.backendUrl);
  const phylloService = new PhylloService(network.backendUrl);
  const userService = new UserService(network.backendUrl);
  const socialAccountService = new SocialAccountService(network.backendUrl);
  const [isLoading, setLoading] = useState(false);
  const [submittedTask, setSubmittedTask] = useState(null);
  const [addSubmission, setAddSumbission] = useState(false);
  const [addQuestionAnswer, setAddQuestionAnswer] = useState(false);
  const [isCopied, setCopied] = useState(false);
  const dispatch = useDispatch();
  const getLastElement = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const openPopup = (url) => {
    const w = 600;
    const h = 400;
    const left = window.screen.width / 2 - w / 2;
    const top = window.screen.height / 2 - h / 2;

    return window.open(
      url,
      "",
      "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
        w +
        ", height=" +
        h +
        ", top=" +
        top +
        ", left=" +
        left
    );
  };
  const startSubmission = async (_submitTask) => {
    const submitTask = {
      ..._submitTask,
      // file_url: string;
      // external_url: string;
      // answer_text: string;
      submitted_by: userData.id,
      challenge_task: task.id,
    };
    const saveData = await taskService.addSubmitTask(submitTask);
    setSubmittedTask(saveData);
    return saveData;
  };

  const checkTwitter = () => {
    if (!isTwitterLinked(userData.twitter_url)) {
      return false;
    } else {
      return true;
    }
  };
  const followOnTwitter = async () => {
    if (checkTwitter()) {
      const submitTask = await startSubmission({});
      if (submitTask) {
        openPopup(
          `https://twitter.com/intent/follow?screen_name=${getLastElement(
            task?.url_text
          )}`
        );
      }
    } else {
      phylloSDKConnect(process.env.REACT_APP_PHYLLO_TWITTER_PLATFORM_ID);
    }
  };
  const likeTweet = async () => {
    if (checkTwitter()) {
      const submitTask = await startSubmission({});
      if (submitTask) {
        openPopup(
          `https://twitter.com/intent/like?tweet_id=${getLastElement(
            task?.url_text
          )}`
        );
      }
    } else {
      phylloSDKConnect(process.env.REACT_APP_PHYLLO_TWITTER_PLATFORM_ID);
    }
  };
  const retweetTweet = async () => {
    if (checkTwitter()) {
      const submitTask = await startSubmission({});
      if (submitTask) {
        openPopup(
          `https://twitter.com/intent/retweet?tweet_id=${getLastElement(
            task?.url_text
          )}`
        );
      }
    } else {
      phylloSDKConnect(process.env.REACT_APP_PHYLLO_TWITTER_PLATFORM_ID);
    }
  };
  const quoteTweet = async () => {
    const isTwitterConnected = checkTwitter();
    printLog(["isTwitterConnected", isTwitterConnected], 'success');
    if (isTwitterConnected) {
      const submitTask = await startSubmission({});
      if (submitTask) {
        openPopup(task?.url_text);
      }
    } else {
      phylloSDKConnect(process.env.REACT_APP_PHYLLO_TWITTER_PLATFORM_ID);
    }
  };

  const bioTweet = async () => {
    if (checkTwitter()) {
      const submitTask = await startSubmission({});
      if (submitTask) {
        openPopup(`https://twitter.com/settings/profile`);
      }
    } else {
      phylloSDKConnect(process.env.REACT_APP_PHYLLO_TWITTER_PLATFORM_ID);
    }
  };

  const joinDiscord = async () => {
    const submitTask = await startSubmission({});
    if (submitTask) {
      window.open(task?.url_text, "_blank");
    }
  };

  const joinTelegram = async () => {
    const submitTask = await startSubmission({});
    if (submitTask) {
      window.open(task?.url_text, "_blank");
    }
  };

  const watchVideoOnYouTube = async () => {
    const submitTask = await startSubmission({});
    if (submitTask) {
      window.open(task?.url_text, "_blank");
    }
  };

  const visitChannelOnYouTube = async () => {
    const submitTask = await startSubmission({});
    if (submitTask) {
      window.open(task?.url_text, "_blank");
    }
  };

  const visitWebsite = async () => {
    const submitTask = await startSubmission({});
    if (submitTask) {
      window.open(task?.url_text, "_blank");
    }
  };

  const questionWithoutAnswer = () => {
  };

  const questionWithAnswer = () => {
    setAddQuestionAnswer(true);
  };

  const handleAddSubmission = () => {
    if (task.task_template.identifier == "question_without_answer") {
      setAddQuestionAnswer(true);
    } else {
      setAddSumbission(true);
    }
  };

  const startTask = () => {
    switch (task.task_template.identifier) {
      case "twitter_follow":
        followOnTwitter();
        break;
      case "twitter_like":
        likeTweet();
        break;
      case "twitter_retweet":
        retweetTweet();
        break;
      case "twitter_quote":
        quoteTweet();
        break;
      case "twitter_bio":
        bioTweet();
        break;
      case "discord_join":
        joinDiscord();
        break;
      case "telegram_join":
        joinTelegram();
        break;
      case "youtube_watch_video":
        watchVideoOnYouTube();
        break;
      case "youtube_visit_channel":
        visitChannelOnYouTube();
        break;
      case "visit_website":
        visitWebsite();
        break;
      default:
        break;
    }
  };

  const verifyTelegramJoin = async () => {
    setLoading(true);
    const verifyTelegram = await socialAccountService.verifyTelegramJoin({
      submit_task_id: submittedTask.id,
    });
    if (verifyTelegram && verifyTelegram.verified) {
      setSubmittedTask({ ...submittedTask, isVerified: true });
      taskVerified(task.id, { ...submittedTask, isVerified: true });
    } else {
      showCustomAlert(
        "Check the requirements",
        "Please make sure to fulfil the requirements in order to verify the task and continue!"
      );
    }
    setLoading(false);
  }
  const verifyTask = async () => {
    if (
      task.task_template.identifier !== "question_with_answer" &&
      !submittedTask?.isStartClicked
    ) {
      showCustomAlert(
        "Verification warning!",
        "You have not started the challenge yet. Please complete the challenge first."
      );
      return;
    }

    switch (task.task_template.identifier) {
      case "telegram_join":
        await verifyTelegramJoin();
        break;
      case "youtube_watch_video":
      case "youtube_visit_channel":
      case "visit_website":
        setLoading(true);
        const obj = {
          id: submittedTask.id,
          isVerified: true,
        };
        await taskService.updateSubmitTask(obj);

        setSubmittedTask({ ...submittedTask, isVerified: true });
        taskVerified(task.id, { ...submittedTask, isVerified: true });
        setLoading(false);
        break;
      case "twitter_follow":
      case "twitter_like":
      case "twitter_retweet":
      case "twitter_quote":
      case "twitter_bio":
        setLoading(true);
        const verifyData = await taskService.verifySubmitTask(submittedTask.id);
        if (verifyData && verifyData.verified) {
          setSubmittedTask({ ...submittedTask, isVerified: true });
          taskVerified(task.id, { ...submittedTask, isVerified: true });
        } else {
          showCustomAlert(
            "Check the requirements",
            "Please make sure to fulfil the requirements in order to verify the task and continue!"
          );
        }
        setLoading(false);
        break;
      case "discord_join":
        setLoading(true);
        const verifydiscorD = await socialAccountService.verifyDiscordJoin({
          submit_task_id: submittedTask.id,
        });
        if (verifydiscorD && verifydiscorD.verified) {
          setSubmittedTask({ ...submittedTask, isVerified: true });
          taskVerified(task.id, { ...submittedTask, isVerified: true });
        } else {
          showCustomAlert(
            "Check the requirements",
            "Please make sure to fulfil the requirements in order to verify the task and continue!"
          );
        }
        setLoading(false);
        break;
      case "question_with_answer":
        questionWithAnswer();
        break;
      default:
        break;
    }
  };
  const submitTask = () => {
    handleAddSubmission();
  };

  const saveSubmit = async (submitData) => {
    const data = await startSubmission({ ...submitData, isVerified: true });
    taskVerified(task.id, data);
    return data;
  };

  const submitAnswer = async (submitData) => {
    if (
      task.task_template.identifier == "question_with_answer" &&
      submitData.answer_text.toLowerCase() !== task.second_text.toLowerCase()
    ) {
      showCustomAlert(
        "Wrong Answer",
        "Unfortunately this is not the specified answer. No worries, you can try again!"
      );
    } else {
      const data = await startSubmission({ ...submitData, isVerified: true });
      taskVerified(task.id, data);
    }
  };

  const performTask = (e) => {
    if (!isWeb3Connected) {
      setIsConnectWalletAlertOpen(true);
      return;
    }
    switch (e.target.name) {
      case "Start":
        startTask();
        break;
      case "Verify":
        verifyTask();
        break;
      case "Submit":
        submitTask();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (task && userData?.id) {
      getSubmitTask();
    }
  }, [task, userData]);

  const getSubmitTask = async () => {
    const _submitTask = await taskService.getSubmitTask(userData.id, task.id);
    setSubmittedTask(_submitTask);
    if (_submitTask.isVerified) {
      taskVerified(task.id, _submitTask);
    }
  };

  const handleCopyAddress = () => {
    var copyText = task.template_text;
    if (task.task_template.identifier == "twitter_bio") {
      copyText = task.url_text;
    }

    try {
      var textArea = document.createElement("textarea");
      textArea.value = copyText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    } catch (e) {
      printLog(["copy error", e]);
    }
  };

  const phylloSDKConnect = async (workPlatformId = null) => {
    printLog(["phylloSDKConnect", workPlatformId], 'success');
    try {
      const phylloData = await phylloService.createToken({
        user_id: userData.id,
        platform_id: workPlatformId,
      });

      printLog(["phylloData", phylloData], 'success');

      if (!phylloData) {
        return;
      }
      const appName = process.env.REACT_APP_PHYLLO_APP_NAME;
      const env = process.env.REACT_APP_PHYLLO_ENVIRONMENT;

      const config = {
        clientDisplayName: appName,
        environment: env,
        userId: phylloData.phyllo_user_id,
        token: phylloData.token,
        redirect: false,
        workPlatformId: phylloData.platform_id,
        // redirectURL : window.location.href
      };

      printLog(["config", config], 'success');

      const phylloConnect = window.PhylloConnect.initialize(config);

      phylloConnect.on(
        "accountConnected",
        (accountId, workplatformId, userId) => {
          printLog(
            [`onAccountConnected: ${accountId}, ${workplatformId}, ${userId}`], 'success'
          );
          getUserProfileData(accountId);
        }
      );
      phylloConnect.on(
        "accountDisconnected",
        (accountId, workplatformId, userId) => {
          printLog(
            [`onAccountDisconnected: ${accountId}, ${workplatformId}, ${userId}`], 'success'
          );
        }
      );
      phylloConnect.on("tokenExpired", (userId) => {
        printLog([`onTokenExpired: ${userId}`]);
      });
      phylloConnect.on("exit", (reason, userId) => {
        printLog([`onExit: ${reason}, ${userId}`]);
        // showNotification(reason);
      });
      phylloConnect.on(
        "connectionFailure",
        (reason, workplatformId, userId) => {
          printLog(
            [`onConnectionFailure: ${reason}, ${workplatformId}, ${userId}`], 'success'
          );
          // showNotification(reason);
        }
      );
      phylloConnect.open();
    } catch (err) {
      printLog([err]);
    }
  };

  const onTwitter = async (tUrl) => {
    if (tUrl) {
      userData.twitter_url = tUrl;
      await userService.updateUser(userData);
      dispatch(setUserData(userData));
    }
  };

  const getUserProfileData = async (account_id) => {
    printLog(["account_id", account_id], 'success');
    const _userData = await phylloService.getUserProfile(account_id);
    printLog(["userData", _userData], 'success');
    if (_userData.length > 0) {
      const user = _userData[0];
      printLog(["loggedInUserData2", user], 'success');
      if (user.work_platform?.name === "Twitter") {
        onTwitter(user.url);
      }
      // else if (user.work_platform?.name === "Instagram") {
      //   onInstagram(user.url);
      // } else if (user.work_platform?.name === "Twitch") {
      //   onTwitch(user.url);
      // } else if (user.work_platform?.name === "YouTube") {
      //   onYoutube(user.url);
      // } else if (user.work_platform?.name === "TikTok") {
      //   onTiktok(user.url);
      // }
    }
  };

  const onDiscordSuccess = async (discord_code) => {
    printLog(["discord_code", discord_code], 'success');
    if (!isWeb3Connected) {
      setIsConnectWalletAlertOpen(true);
      return;
    }

    setLoading(true);
    const regiterUserData = {
      code: discord_code,
      user_id: userData.id,
      redirect_uri: getRedirectUrl(),
    };
    printLog(["regiterUserData", regiterUserData], 'success');
    const register = await socialAccountService.registerDiscordUser(
      regiterUserData
    );
    if (register) {
      printLog([register], 'success');
      userData.discord_url = `https://discord.com/users/${register.social_user_id}`;
      dispatch(setUserData(userData));
    }
    setLoading(false);
  };

  const onDiscordFailed = (error) => {
    showCustomAlert("Auth error", error.message);
  };

  const handleTelegramResponse = async (response) => {
    printLog(["handleTelegramResponse", response], 'success');
    if (!userData.id) {
      showCustomAlert('Authorization error', 'Please try logout and then login again.');
      return;
    }
    setLoading(true);
    const socialData = {
      user_id: userData.id,
      social_user_id: response.id,
      social_user_name: response.username,
      access_token: response.hash
    }

    const register = await socialAccountService.registerTelegramdUser(socialData);

    if(register && register.telegram_url) {
      userData.telegram_url = register.telegram_url;
      await userService.updateUser(userData);
      dispatch(setUserData(userData));
    }
    setLoading(false);
  };
  const getRedirectUrl = () => {
    const pageUrl = window.location.href;
    const parts = pageUrl.split('/');
    const domain = `${parts[0]}//${parts[2]}`;
    printLog(['domain', domain], 'success');
    return domain;
  }

  return (
    <>
      <div className="task-body">
        <p className="label">{task.task_template.button_title_header}</p>
        {task.task_template.is_description && (
          <>
            <p className="description">{task.description}</p>
          </>
        )}
        {(task.task_template.identifier == "question_with_answer" ||
          task.task_template.identifier == "question_without_answer") && (
          <>
            <p className="description">{task.url_text}</p>
          </>
        )}
        {task.is_template_checked && (
          <div className="template-container">
            <p className="template">{task.template_text}</p>
            {isCopied && <p className="copied">Copied</p>}

            <CopyIcon onClick={handleCopyAddress} />
          </div>
        )}
        {task.task_template.identifier == "twitter_bio" && (
          <div className="template-container">
            <p className="template">{task.url_text}</p>
            {isCopied && <p className="copied">Copied</p>}

            <CopyIcon onClick={handleCopyAddress} />
          </div>
        )}

        {challenge?.creator?.id !== userData?.id && (
          <div className="actions">
            {submittedTask && submittedTask.isVerified ? (
              <button className={`action-btn completed`}>
                🥳 Completed 🥳
              </button>
            ) : (
              <>
                {task?.task_template.identifier == "discord_join" &&
                !isDiscordLinked(userData.discord_url) ? (
                  <>
                    <DiscordLogin
                      onFailure={onDiscordFailed}
                      onSuccess={onDiscordSuccess}
                      clientId={process.env.REACT_APP_DISCORD_CLIENT_ID}
                      redirectUri={getRedirectUrl()}
                      // redirectUri={
                      //   window.location.protocol +
                      //   "//" +
                      //   window.location.hostname +
                      //   ":" +
                      //   window.location.port
                      // }
                      className={`action-btn Verify`}
                      serverId={getLastElement(task.url_text)}
                    >
                      Join Discord
                    </DiscordLogin>
                  </>
                ) : task?.task_template.identifier == "telegram_join" &&
                  !isTelegramLinked(userData?.telegram_url) ? (
                  <>
                    <TelegramLoginButton
                      dataOnauth={handleTelegramResponse}
                      botName={process.env.REACT_APP_TELEGRAM_BOT_NAME}
                    />
                  </>
                ) : (
                  <>
                    {task.task_template.button_titles.map((title) => (
                      <button
                        className={`action-btn ${title}`}
                        key={title}
                        name={title}
                        onClick={performTask}
                      >
                        {title}
                      </button>
                    ))}
                  </>
                )}
              </>
            )}

            {isLoading && (
              <Spinner
                animation="border"
                size="md"
                className="task-body-btn-spinner"
              />
            )}
          </div>
        )}
      </div>
      {addSubmission && (
        <AddTaskSubmission
          addSubmission={addSubmission}
          closeSumbission={() => {
            setAddSumbission(false);
          }}
          challenge={challenge}
          submissions={submissions}
          saveSubmit={saveSubmit}
        />
      )}
      {addQuestionAnswer && (
        <AddQuestionAnswer
          addQuestionAnswer={addQuestionAnswer}
          closeSumbission={() => {
            setAddQuestionAnswer(false);
          }}
          challenge={challenge}
          submissions={submissions}
          submitAnswer={submitAnswer}
          buttonText={
            task.task_template.identifier == "question_with_answer"
              ? "Verfy"
              : "Submit"
          }
        />
      )}
    </>
  );
};
export default React.memo(TaskBody);
