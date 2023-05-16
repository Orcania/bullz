import { constant } from "lodash";
import { printLog } from "utils/printLog";
import MarketService  from "../services/market.service";

export async function verifyPrice (currentCurrency, price ,network){
    let result;
    let currency = 'usd';
    let minLetCoinLimit = 0;
    let currentPrice = 0;
    printLog([currentCurrency, price ,network], 'success');

    if(currentCurrency.toLowerCase() === network.nativeCurrency.symbol.toLowerCase()){
        const mainToken = await MarketService.handleMarket(currency, network.nativeCurrency.token_id);
        currentPrice = mainToken[0]?.current_price;
    } else {
        const letToken = await MarketService.handleMarket(currency, getTokenId(network, currentCurrency));
        currentPrice = letToken[0]?.current_price
    }    
    const priceInUSD =  currentPrice * price;    
    result =  priceInUSD >= process.env.REACT_APP_MIN_AMOUNT;
    
    minLetCoinLimit = process.env.REACT_APP_MIN_AMOUNT/currentPrice;    
    minLetCoinLimit = Math.ceil(minLetCoinLimit * 1000) / 1000;
    return {
        verified: result,
        minValue: minLetCoinLimit,
        currentCurrency: currentCurrency
    }
    
}

export async function getBaseCurrencyPrice (network){
    let currency = 'usd';
    const mainToken = await MarketService.handleMarket(currency, network.nativeCurrency.token_id);
    const currentPrice = mainToken[0]?.current_price;
    return currentPrice;
}

export async function getTokenPrice (currentCurrency, network){
    let currency = 'usd';
    const letToken = await MarketService.handleMarket(currency, getTokenId(network, currentCurrency));
    const letTokenPrice = letToken[0]?.current_price
    return letTokenPrice;
}

export async function getConversionRate (currentCurrency, network){
    let currency = 'usd';
    const mainToken = await MarketService.handleMarket(currency, network.nativeCurrency.token_id);
    const mainTokenPrice = mainToken[0]?.current_price;

    const letToken = await MarketService.handleMarket(currency, getTokenId(network, currentCurrency));
    const letTokenPrice = letToken[0]?.current_price

    const conversionRate = letTokenPrice/mainTokenPrice;

    return conversionRate;
}



const getTokenId = (network, currentCurrency) => {
    const  tokens = network.smartContracts.BID_UTILITY_TOKENS
    for (let token of tokens) {
      printLog([token], 'success');
      if (token.symbol.toLowerCase() === currentCurrency.toLowerCase())
        return token.token_id;
    }
}

export async function getTokenAddressByCurrency (network, currentCurrency) {
    const  tokens = network.smartContracts.BID_UTILITY_TOKENS
    if(currentCurrency.toLowerCase() === network.nativeCurrency.symbol.toLowerCase()){
        return tokens[0].address;
    }

    for (let token of tokens) {
      printLog([token], 'success');
      if (token.symbol.toLowerCase() === currentCurrency.toLowerCase())
        return token.address;
    }
}