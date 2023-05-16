import Big from "big.js";
import { networks } from "constants/networks";
import { printLog } from "utils/printLog";

export function creators(list) {
  const value = 10000 / list.length;
  return list.map((account) => ({ account, value }));
}
export function parseAbi(abi) {
  let parsed = JSON.parse(JSON.stringify(abi));
  return parsed.abi;
}

export function parseByteCode(abi) {
  let parsed = JSON.parse(JSON.stringify(abi));
  return parsed.bytecode;
}

export function capitalize(s) {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function validateInput(input) {
  if (input === "" || parseFloat(input) <= 0) {
    return false;
  }

  if (input.includes(".")) {
    let afterDecimal = input.split(".")[1];
    let beforeDecimal = input.split(".")[0];

    if (afterDecimal.length > 18) {
      return false;
    }

    let nonZeroInput = true;
    for (let i = 0; i < afterDecimal.length; i++) {
      if (parseInt(afterDecimal[i]) >= 1 && parseInt(afterDecimal[i]) <= 9) {
        nonZeroInput = false;
      }
    }

    let nonZeroInputBeforDecimal = true;
    for (let i = 0; i < beforeDecimal.length; i++) {
      if (parseInt(beforeDecimal[i]) >= 1 && parseInt(beforeDecimal[i]) <= 9) {
        nonZeroInputBeforDecimal = false;
      }
    }

    if (nonZeroInput && nonZeroInputBeforDecimal) {
      return false;
    }
  }

  if (input.includes(".") && (!input.split(".")[1] || !input.split(".")[0])) {
    return false;
  }

  let nonZeroInput = true;
  for (let i = 0; i < input.length; i++) {
    if (parseInt(input[i]) >= 1 && parseInt(input[i]) <= 9) {
      nonZeroInput = false;
    }
  }

  if (nonZeroInput) {
    return false;
  }

  return true;
}

export const divideNo = (res, decimals) => {
  if (typeof decimals === "string") {
    decimals = parseInt(decimals);
  }

  if (typeof res === "string" && res === "") {
    res = "0";
  }
  let bigNo = new Big(res);
  let bigNo1 = new Big(Math.pow(10, decimals));
  let number = bigNo.div(bigNo1).toFixed(decimals);
  return number;
};

export const multipliedBy = (value, decimals) => {

  printLog(['multipliedBy', value, decimals], 'success')
  if (typeof value === "string" && value === "") {
    value = "0";
  }
  if (typeof decimals === "string") {
    decimals = parseInt(decimals);
  }

  let bigNo = new Big(value);
  let bigNo1 = new Big(Math.pow(10, decimals));
  let number = bigNo.mul(bigNo1).round();
  return number.toString();
}

export const handleError = (e) => {
  printLog(["handleError", e])
  return undefined;
};

export const isLess = (firstNo, secondNo) => {
  let fNo = new Big(firstNo);
  let sNo = new Big(secondNo);
  if (fNo.lt(sNo)) {
    return true;
  }
  return false;
};

export const isLessOrEqual = (firstNo, secondNo) => {
  let fNo = new Big(firstNo);
  let sNo = new Big(secondNo);
  if (fNo.lte(sNo)) {
    return true;
  }
  return false;
};

export const isGreater = (firstNo, secondNo) => {
  let fNo = new Big(firstNo);
  let sNo = new Big(secondNo);
  if (fNo.gt(sNo)) {
    return true;
  }
  return false;
};

export const isGreaterOrEqual = (firstNo, secondNo) => {
  let fNo = new Big(firstNo);
  let sNo = new Big(secondNo);
  if (fNo.gte(sNo)) {
    return true;
  }
  return false;
};

export const parseDate = (d) => {
  let date = new Date(d);
  var month = [];
  month[0] = "Jan";
  month[1] = "Feb";
  month[2] = "Mar";
  month[3] = "Apr";
  month[4] = "May";
  month[5] = "Jun";
  month[6] = "Jul";
  month[7] = "Aug";
  month[8] = "Sep";
  month[9] = "Oct";
  month[10] = "Nov";
  month[11] = "Dec";
  var m = month[date.getMonth()];
  let dateStr = date.getDate() + " " + m + " " + date.getFullYear() + " ";
  let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  let minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  return dateStr + " " + hours + ":" + minutes;
};

export const scrollToTop = () => {
  try {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  } catch (error) {
    // just a fallback for older browsers
    window.scrollTo(0, 0);
  }
}

export const getLatestOffer = (offers) => {
  if(offers && offers.length){
    offers.forEach((element, index) => {
      let time = new Date(element.createdAt).getTime();
      if (!time) {
        time = Number(element.createdAt);
      }
      printLog([index, time], 'success');
      element.createdAt = time;      
    });
    offers = offers.sort((a, b) => b.createdAt-a.createdAt); 
    return offers[0];
  } else {
    return {};
  } 
}

export const getUrl = (url) => {
  if (url.startsWith("https://") || url.startsWith("http://")) {
    return url;
  }
  return `https://${url}`;
};

export const isInstagramLinked = (instagram_url) => {
  return (instagram_url?.includes('https://www.instagram.com/') || instagram_url?.includes('https://instagram.com/') ) && instagram_url !== 'https://www.instagram.com/' && instagram_url !== 'https://instagram.com/';
}

export const isYoutubeLinked = (youtube_url) => {
  return (youtube_url?.includes('https://www.youtube.com/') || youtube_url?.includes('https://youtube.com/')) && youtube_url !== 'https://www.youtube.com/' && youtube_url !== 'https://youtube.com/';
}

export const isTwitchLinked = (twitch_url) => {
  return (twitch_url?.includes('https://twitch.tv/') || twitch_url?.includes('https://www.twitch.tv/')) && twitch_url !== 'https://twitch.tv/' && twitch_url !== 'https://www.twitch.tv/';
}

export const isTiktokLinked = (tiktok_url) => {
  return (tiktok_url?.includes('https://www.tiktok.com/') || tiktok_url?.includes('https://vm.tiktok.com/')) && tiktok_url !== 'https://www.tiktok.com/' && tiktok_url !== 'https://vm.tiktok.com/';
}

export const isTwitterLinked = (twitter_url) => {
  return twitter_url?.includes('https://twitter.com/') && twitter_url !== 'https://twitter.com/';
}
export const isDiscordLinked = (discord_url) => {
  return !!discord_url && discord_url?.includes('https://discord.com/users/') && discord_url !== 'https://discord.com/users/';
}

export const isTelegramLinked = (telegram_url) => {
  return !!telegram_url && telegram_url?.includes('https://t.me/') && telegram_url !== 'https://t.me/';
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


export const verifyTransaction = async (tempStorageService, eventId, timeToEnd) => {
  try {
    printLog(['timeToEnd', timeToEnd]);
    const tempstorage = await tempStorageService.getByEventId(eventId);

    if (tempstorage.status == 2) {
      return true;
    } else {
      await sleep(2000);
      if (Date.now() > timeToEnd) {
          return false;
      }
      return verifyTransaction(tempStorageService, eventId, timeToEnd);
    }
  } catch (error) {
      printLog(['error ', error]);
      await sleep(2000);
      if (Date.now() > timeToEnd) {
          return false;
      }
      return verifyTransaction(tempStorageService, eventId, timeToEnd);
  }
};

export const getNetworkByChainId = (chainId) => {
  const networkName = Object.keys(networks).filter(key => {      
    if (parseInt(networks[key].chainId, 16) == chainId) {
      return networks[key];
    }
  });
  const nftNetwork = networks[networkName[0]];
  return nftNetwork;
}
