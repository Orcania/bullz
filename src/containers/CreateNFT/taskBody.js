import React, { useState } from "react";
import { FormControlLabel, Checkbox } from "@material-ui/core";
import "./style.scss";
import { SocialAccountService } from "services/social-account.service";
import { useSelector } from "react-redux";
import { printLog } from "utils/printLog";
const TaskBody = ({ task, addTask, showNotification, canGoStep4}) => {
  const network = useSelector((state) => state.web3.network);
  const socialAccountService = new SocialAccountService(network.backendUrl);
  const [showTemplate, setShowTemplate] = useState(task.is_template);
  const [isPrivateTelegram, setPrivateTelegram] = useState(false);
  const [invalidUrl, setTaskInvalidUrl] = useState(false);
  
  const [taskValue, setTaskValue] = useState({
    id: task.id,
    is_template_checked: task.is_template,
  });

  const setInvalidUrl = (value) => {
    setTaskInvalidUrl(value);
    canGoStep4(value);
  }

  const templateClicked = () => {
    const _showTemplate = !showTemplate;
    setShowTemplate(_showTemplate);
    handleInputChange("is_template_checked", _showTemplate);
  };

  const privateClicked = () => {
    const _isPrivateTelegram = !isPrivateTelegram;
    setPrivateTelegram(_isPrivateTelegram);
    handleInputChange("is_private", _isPrivateTelegram);
  };

  const getLastElement = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const isValidWebsite = (url) => {
    if (!url) return true;
    const urlRegex =
        /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,10}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
    return urlRegex.test(url);
  };

  const isValidYoutube = (url) => {
    if (!url) return true;
    const youtubeRegex =
      /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;

    return youtubeRegex.test(url);
  };

  const isValidTelegram = (url) => {
    if (!url) return true;
    const telegramRegex =
      /(https?:\/\/)?(www[.])?(telegram|t)\.me\/([a-zA-Z0-9_-]*)\/?$/;
    return telegramRegex.test(url);
  };

  const isValidTweet = (url) => {
    if (!url) return true;
    const twitterRegex =
      /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)$/;
    return twitterRegex.test(url);
  };

  const isValidDiscord = (url) => {
    if (!url) return true;
    const discordRegex =
      /(https:\/\/)?(www\.)?(((discord(app)?)?\.com\/invite)|((discord(app)?)?\.gg))\/(?<invite>.+)/gm;
    return discordRegex.test(url);
  };

  const checkDiscordLink = async (code) => {
    printLog(["checkDiscordLink", code], 'success');
    if (!code) return true;
    const valid = await fetch(`https://discordapp.com/api/invite/${code}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.message === "Unknown Invite") {
          return false;
        } else {
          return true;
        }
      });
    printLog(["valid", valid], 'success');
    return valid;
  };

  const handleInputBlur = async (name, value) => {
    if (
      task.identifier == "twitter_like" ||
      task.identifier == "twitter_retweet" ||
      task.identifier == "twitter_quote"
    ) {
      setInvalidUrl(!isValidTweet(value));
    } else if (task.identifier == "discord_join") {
      if (!isValidDiscord(value)) {
        setInvalidUrl(true);
      } else {
        const valid = await checkDiscordLink(getLastElement(value));
        setInvalidUrl(!valid);
      }
    } else if (task.identifier == "telegram_join") {
      const valid = isValidTelegram(value)
      printLog(['valid', valid], 'success');
      // setInvalidUrl(!valid);
      if (valid) {
        if (value) {
          const isBotConnected = await socialAccountService.isBotConnected({url: value})
          printLog(['isBotConnected', isBotConnected.isBotConnected], 'success');
          if (isBotConnected?.isBotConnected) {
            setInvalidUrl(false);
          } else {
            if (isBotConnected?.message) {
              showNotification(isBotConnected?.message);
            } else {
              showNotification(`Please add @${process.env.REACT_APP_TELEGRAM_BOT_NAME} as your
              channel admin first.`);
            }
            setInvalidUrl(true);
          }
        } else {
          setInvalidUrl(false);
        }
      } else{
        setInvalidUrl(true);
      }   
    } else if (
      task.identifier == "youtube_visit_channel" ||
      task.identifier == "youtube_watch_video"
    ) {
      setInvalidUrl(!isValidYoutube(value));
    } else if (task.identifier == 'visit_website') {
      setInvalidUrl(!isValidWebsite(value));
    }
  };

  const handleInputChange = (name, value) => {
    if (name == 'description' && value.length > 300) return;
    if (name == 'template_text' && value.length > 240) return;
    const _taskValue = {
      ...taskValue,
      [name]: value,
    };
    setTaskValue(_taskValue);
    addTask(_taskValue);
  };

  return (
    <div className="w-100 task-body">
      {task.identifier == "telegram_join" && (
        <p style={{ color: "#4353FF" }}>
          You must add @{process.env.REACT_APP_TELEGRAM_BOT_NAME} as your
          channel admin to verify user join.
        </p>
      )}
      {task.is_private_public && (
        <div className="form-group mb-0">
          <FormControlLabel
            control={
              <Checkbox
                checkedIcon={<img src="/images/stepper-checked.png" />}
                checked={!isPrivateTelegram}
                onChange={privateClicked}
                name="Public"
              />
            }
            label="Public"
          />
          <FormControlLabel
            control={
              <Checkbox
                checkedIcon={<img src="/images/stepper-checked.png" />}
                checked={isPrivateTelegram}
                onChange={privateClicked}
                name="Private"
              />
            }
            label="Private"
          />
        </div>
      )}
      {task.is_url && (
        <>
          <div className="form-group">
            <label>{task.url_header}</label>
            <input
              type="text"
              className={`form-control ${invalidUrl ? "invalid-input" : ""}`}
              value={taskValue?.url_text}
              onBlur={(e) => {
                handleInputBlur("url_text", e.target.value);
              }}
              onChange={(e) => handleInputChange("url_text", e.target.value)}
              placeholder={task.url_placeholder}
            />
          </div>
          {((task.social_name == "Telegram" &&
            task.task_name == "Join a Channel" &&
            isPrivateTelegram) ||
            (task.social_name == "Question & Answer" &&
              task.task_name == "Q&A with specified answer")) && (
            <div className="form-group">
              <label>{task.second_url_header}</label>
              <input
                type="text"
                className="form-control"
                value={taskValue?.second_text}
                onChange={(e) =>
                  handleInputChange("second_text", e.target.value)
                }
                placeholder={task.second_url_placeholder}
              />
            </div>
          )}
        </>
      )}
      {task.is_description && (
        <div className="form-group">
          <label>{task.description_header}</label>
          <div className="ck-content" style={{ position: "relative" }}>
            <textarea
              style={{minHeight: 130, fontSize: 15}}
              onChange={(e)=> {
                e.target.style.height = '130px';
                e.target.style.height = `${e.target.scrollHeight}px`;
                handleInputChange(
                  "description",
                  e.target.value
                );
              }}
              placeholder={task.description_placeholder} 
              name="" 
              id=""
              value={taskValue.description}
            />
            <p className="counter">{`${
              taskValue.description ? taskValue.description.length : "0"
            }/300`}</p>
          </div>
        </div>
      )}
      {task.is_template && (
        <div className="w-100 d-flex">
          <div className="form-group w-100 ml-2">
            <FormControlLabel
              control={
                <Checkbox
                  checkedIcon={<img src="/images/stepper-checked.png" />}
                  checked={showTemplate}
                  onChange={templateClicked}
                  name={task.template_header}
                />
              }
              label={task.template_header}
            />
            {showTemplate && (
              <div className="ck-content ml-4" style={{ position: "relative" }}>
                <textarea
                  style={{minHeight: 130, fontSize: 15}}
                  onChange={(e)=> {
                    e.target.style.height = '130px';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                    handleInputChange(
                      "template_text",
                      e.target.value
                    );
                  }}
                  placeholder={task.template_placeholder} 
                  name="" 
                  id=""
                  value={taskValue.template_text}
                />
                <p className="counter">{`${
                  taskValue.template_text ? taskValue.template_text.length : "0"
                }/240`}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default React.memo(TaskBody);
