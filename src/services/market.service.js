import axios from "axios";
import { printLog } from "utils/printLog";

class MarketService{
  constructor() {}
  baseURL="https://api.coingecko.com/api/v3/coins/markets";

    async handleMarket(vs_currency, token_id) {
        let url = `${this.baseURL}?vs_currency=${vs_currency}&ids=${token_id}`
        const result  = await axios.get(url);
        return result.data;
    }
}

export const getETHRate = async () => {
  const rate = (
    await axios.get(
      `https://min-api.cryptocompare.com/data/price?fsym=${process.env.REACT_APP_NATIVE_CURRENCY}&tsyms=USD`
    )
  ).data["USD"];
  printLog(['ETH rate', rate], 'success');
  return rate;
}
export default new MarketService();