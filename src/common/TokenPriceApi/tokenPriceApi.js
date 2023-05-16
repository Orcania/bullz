import axios from "axios";
import { printLog } from 'utils/printLog';

export async function getDollarPrice() {
  let urls = [
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=weth&order=market_cap_desc&per_page=100&page=1&sparkline=false",
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=wom-token&order=market_cap_desc&per_page=100&page=1&sparkline=false",
  ];

  // map every url to the promise of the fetch
  let requests = urls.map((url) => axios(url));

  // Promise.all waits until all jobs are resolved
  let response = await Promise.all(requests)
    .then((responses) => {
      return responses;
    })
    .catch((err) => {
      printLog([err]);
      return false;
    });
  return response;
}
