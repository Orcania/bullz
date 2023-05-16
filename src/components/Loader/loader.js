import React from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function LoaderComponent() {
  return (
    <>
      <Loader
        type="Puff"
        color="white"
        height={70}
        width={70}
        timeout={300000} //3 secs
        style={{ alignItems: 'center', justifyContent:'center'}}
      />
    </>
  );
}

export default LoaderComponent;
