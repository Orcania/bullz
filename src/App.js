import React from "react";

import { Route, Switch, useHistory, withRouter } from "react-router-dom";

import { SnackbarProvider } from "notistack";

import PublicRoute from "routes/PublicRoute";

import Header from "components/Header";

import Home from "containers/Home";
// import NotFound from "containers/NotFound";
import ErrorPage from "containers/ErrorPage";
import Discover from "containers/Discover";

import Footer from "./components/Footer";
import TokenChallenge from "./containers/TokenChallenge";
import CardDetail from "./containers/CardDetail";
import Challenges from "./containers/Challenges";
import Collection from "./containers/Collection";
import Create from "./containers/CreateNFT";
import EditProfile from "./containers/EditProfile";
import Following from "./containers/Following";
import HowItWorks from "./containers/HowItWorks";
import Message from "./containers/Message";
import MyChallenge from "./containers/MyChallenge";
// import Privacy from "./containers/Privacy";
import TermsAndConditions from "./containers/TermsAndConditions";
import Profile from "./containers/Profile";
import ExporeArt from "./containers/SubExplore";
import ScrollToTop from "./components/Common/scrollToTop";
import Explore2 from "./containers/Explore2/explore2";
import TopBuyers from "./containers/Home/topBuyers";
import ChallengeDetail from "./containers/MyChallenge/ChallengeDetail";
import SellNFT from "./containers/SellNFT/putOnSell";
import NftDetails from "containers/Message/NftDetails/NftDetails";
import ManageWallet from 'containers/ManageWallet';
import TopCollections from "containers/Discover/topCollection";
import SocialConnect from "components/SocialConnectPage";
import SubmitSocialConnect from "containers/Art/SubmitSocialConnect";
import Privacy from "containers/TermsAndConditions/Privacy";


const pagesWithNoFooter = ["/create", "/art", "/duet", "/collab", "/promo", "/exclusive", "/merchandise", "/event", "/nft_challenge", "/messaging" , "/token-challenge"]

const App = (props) => {
  const history = useHistory();

  const isFooterVisible = () => {
    for (let i = 0; i <= pagesWithNoFooter.length; i++) {
      if (history.location.pathname.includes(pagesWithNoFooter[i])) {
        return false;
      }
    }
    return true;
  }
  return <SnackbarProvider maxSnack={3}>
  <Header />

  <div className="app-container">
    <ScrollToTop />

    <Switch>
      <Route exact path="/" component={withRouter(Home)} />
      <Route exact path="/top_buyers" component={withRouter(TopBuyers)} />
      <Route exact path="/creators" component={withRouter(TopBuyers)} />
      <Route exact path="/collections" component={withRouter(TopCollections)} />
      <Route exact path="/create" component={Create} />

      <PublicRoute
        exact
        path="/sellnft/:nftId"
        component={SellNFT}
        props={props}
      />
      <PublicRoute
        exact
        path="/cancelsell/:nftId"
        component={SellNFT}
        props={props}
      />
      <PublicRoute
        exact
        path="/updateoffer/:nftId"
        component={SellNFT}
        props={props}
      />


      <PublicRoute
        exact
        path="/mychallenge"
        component={MyChallenge}
        props={props}
      />
      <PublicRoute
        exact
        path="/challenges"
        component={Challenges}
        props={props}
      />
      <PublicRoute
        exact
        path="/mychallenge/:id"
        component={ChallengeDetail}
        props={props}
      />


      <Route exact path="/art/:nftId" component={withRouter(NftDetails)} />      
      <Route exact path="/token-challenge/:challengeId" component={withRouter(TokenChallenge)} />
      <Route exact path="/explore" component={Explore2} />
      <Route exact path="/discover" component={Discover} />
      <Route exact path="/explorer/:nftType" component={ExporeArt} />

      <Route exact path="/messaging/:chatId?" component={withRouter(Message)} />
      <Route exact path="/messaging/art/:nftId" component={withRouter(NftDetails)} />      
      <Route exact path="/messaging/event/:nftId" component={withRouter(NftDetails)} />
      <Route exact path="/messaging/nft-challenge/:nftId" component={withRouter(NftDetails)} />

      <Route exact path="/edit-profile" component={EditProfile} />

      <Route exact path="/profile/:id" component={withRouter(Profile)} />

      <Route exact path="/manage-wallet" component={withRouter(ManageWallet)} />

      <PublicRoute
        exact
        path="/profile/details/:status?"
        component={CardDetail}
        props={props}
      />

      <Route exact path="/following/:id" component={Following} />
      <Route exact path="/follower/:id" component={Following} />
      <Route exact path="/social-connect/" component={SocialConnect} />
      <Route exact path="/submit-social-connect/" component={SubmitSocialConnect} props={props}/>

      


      <PublicRoute
        exact
        path="/collection/:id"
        component={Collection}
        props={props}
      />
      <PublicRoute exact path="/privacy" component={Privacy} props={props} />
      <PublicRoute exact path="/terms-and-conditions" component={TermsAndConditions} props={props} />
      <PublicRoute
        exact
        path="/how-it-works"
        component={HowItWorks}
        props={props}
      />

      <Route component={ErrorPage} />
    </Switch>
  </div>

{
  isFooterVisible() && <Footer />
}
</SnackbarProvider>
};

export default withRouter(App);
