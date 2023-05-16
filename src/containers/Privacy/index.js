import React from 'react';
import './style.scss';

const Privacy = () => (
  <div className="privacy-page">
    <div className="privacy-content">
      <img src="/images/privacy-avatar.png" alt="avatar" className="privacy-avatar" />
      <p className="title">Welcome to the BULLZ Creator Economy</p>
      <p className="description">
      BULLZ is a totally new kind of Challenge Launchpad where creators, artists and communities can come together
          and collaborate over amazing experiences, like Duets on TikTok, music collaborations, and real-life meet
          and greets.
      </p>
      <p className="description">
          Are you a successful TikTok creator looking to monetize your skills and help other
          creators make better videos? Or perhaps you are just starting out making videos and
          looking to invest in a little coaching to improve your production and grow your reach?
          BULLZ can hook you up with other members of the community looking to trade TikTok
          Duet collaborations.
      </p>
      <p className="description">
          If you're an artist looking to monetize your music, or an influencer looking for music to
          use in your videos, BULLZ can connect you too. And if you want better ways to built
          relationships with fans then you can also trade meet and greets or any other kind of in person
          or online event you'd like to host.
      </p>
      <p className="description">
          The BULLZ creator economy is brought to you by the WOM Protocol and fuelled by the WOM Token,
          which rewards creators for authentic word-of-mouth recommendations.
          Every WOM recommendation gets rated by other users before its creator and raters start
          earning WOM Tokens based on content engagement.
      </p>

      <div className="d-flex justify-content-center mb-4 pb-2">
        <a className="yellow-btn " href="http://womprotocol.io" target="_blank">About WOM Token</a>
      </div>

      {/* <div className="balance-wrapper d-flex justify-content-between align-items-center">
        <div className="balance d-flex flex-column">
          <p>Your balance</p>
          <p><span>0 WOM</span></p>
        </div>

        <div className="actions d-flex align-items-center">
          <button>Get Started</button>
          <p>?</p>
        </div>
      </div> */}

      <p className="title">
        Where Can I Get WOM Tokens?
      </p>
      <p className="description">
        You can buy WOM Tokens directly from https://womprotocol.io/or by visiting one
        of the following exchanges:
      </p>

      <div className="links">
        <a href="https://www.gate.io/trade/WOM_ETH" className="link">
          https://www.gate.io/trade/WOM_ETH
        </a>
        <a href="https://www.gate.io/trade/WOM_USDT" className="link">
          https://www.gate.io/trade/WOM_USDT
        </a>
        <a href="https://en.bithumb.com/trade/order/WOM_KRW" className="link">
          https://en.bithumb.com/trade/order/WOM_KRW
        </a>
        <a href="https://trade.kucoin.com/spot/WOM-USDT" className="link">
          https://trade.kucoin.com/spot/WOM-USDT
        </a>
        <a href="https://app.liquid.com/exchange/WOMBTC" className="link">
          https://app.liquid.com/exchange/WOMBTC
        </a>
      </div>

      <p className="title">
        How Can I Use WOM Tokens?
      </p>
      <ul className="descriptions">
        <li>Buy and sell NFTs on the BULLZ marketplace</li>
        <li>
          Exchange for gift cards from more thatn 2500 retailers,
          including iTunes, as well as for disigital Visa/Mastercards which make
          possible to buy products online and in-store-like your daily Starbucks.
        </li>
        <li>WOM Tokens can currently be earned and converted into gift cards via both the YEAY app and the WOM Authenticator app:</li>
      </ul>

      <div className="links">
        <a href="https://app.apple.com/us/app/yeay/id1070699048" className="link">
          https://app.apple.com/us/app/yeay/id1070699048
        </a>
        <a href="https://play.google.com/store/apps/details?id=yeay.tv.yeay" className="link">
          https://play.google.com/store/apps/details?id=yeay.tv.yeay
        </a>
        <a href="https://apps.apple.com/app/wom-authenticator/id1501404475?!" className="link">
          https://apps.apple.com/app/wom-authenticator/id1501404475?!
        </a>
        <a href="https://play.google.com/store/apps/details?id=io.womprotocol.authenticator&hl=en_US" className="link">
          https://play.google.com/store/apps/details?id=io.womprotocol.authenticator&hl=en_US
        </a>
      </div>
    </div>
  </div>
);

export default Privacy;
