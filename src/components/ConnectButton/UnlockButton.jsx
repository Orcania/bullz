import React, { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { useWeb3React } from "@web3-react/core";
import WalletSelectDialog from "./walletSelectDialog";
import SocialConnect from "components/SocialConnect";
import { SnoozeSharp } from "@material-ui/icons";
import { useSnackbar } from 'notistack';
import { useMediaQuery } from '@material-ui/core';
import { printLog } from "utils/printLog";


const notificationConfig = {
  preventDuplicate: true,
  vertical: "bottom",
  horizontal: "right",
};

const UnlockButton = (props) => {
  const { login, provider, chainId, connected } = useAuth();
    // const {
    //   library,
    //   chainId,
    //   account,
    //   active
    // } = useWeb3React();
  
  
  const { enqueueSnackbar } = useSnackbar();
  // const userConnected = localStorage.getItem("userConnected");

  // const [showWalletConnectDialog, setShowWalletConnectDialog] = useState(disconnect ? false : true);
  const [showWalletConnectDialog, setShowWalletConnectDialog] = useState(false);
  const isMobile = useMediaQuery('(min-width:350px) and (max-width:1023px)');

  useEffect(() => {    
    if (connected && provider) {
      printLog(['connected', connected, provider], 'success')
      props.connectWithWalletConnect(provider);
    }
  }, [connected, provider]);

  async function connectWithWallet(calledFor) {
    if (calledFor === "walletConnect") {
      printLog(["connected?", connected], 'success');
      if (!connected) {
        localStorage.removeItem('walletconnect')
        await login();
        setShowWalletConnectDialog(false);        
      } else {
        setShowWalletConnectDialog(false);
        printLog(["provider", provider], 'success');
        props.connectWithWalletConnect(provider);
      }
      return;
    } else if (calledFor === "fortmatic") {
      enqueueSnackbar('Coming soon', {
        ...notificationConfig,
        variant: "error",
      });

    } else if (calledFor === "metamask"){
      props.connectWithWallet(calledFor);
      setShowWalletConnectDialog(false);
    } else {
      enqueueSnackbar('Please select wallet type.', {
        ...notificationConfig,
        variant: "error",
      });
    }  
  }

  useEffect(() => {
    if (
      localStorage.getItem("userConnected") === "true" &&
      localStorage.getItem("connectedWith") === "walletConnect" &&
      !connected
    ) {
      login();
    }
  }, [login]);

  return (
    <>
      <button
        className="btn-continue"
        onClick={() => setShowWalletConnectDialog(true)}
        id="connectButton"
      >
        {
          isMobile ? "Connect" : "Connect Wallet"
        }
      </button>

      {showWalletConnectDialog ? (
        <WalletSelectDialog
          show={showWalletConnectDialog}
          hideShow={() => setShowWalletConnectDialog(false)}
          connectWithWallet={connectWithWallet}
        />
        // <SocialConnect
        //   show={showWalletConnectDialog}
        //   hideShow={() => setShowWalletConnectDialog(false)}
        //   connectWithWallet={connectWithWallet}
        // />
      ) : undefined}
    </>
  );
};

export default React.memo(UnlockButton);
