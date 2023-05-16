import React, { useState, useEffect } from "react";

import "./style.scss";



const LoadingCard = ({ }) => {
  const [opacity, setOpacity] = useState(false);

  const MINUTE_MS = 1000;

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(false);
      setTimeout(() => {
        setOpacity(true);
      }, 1000);
    }, MINUTE_MS);

    return () => clearInterval(interval);
  }, [])


  return (
    <div className={`loading-card ${opacity ? "show" : "hide"}`}>
      <img src="/images/loading.png" alt="" />
    </div>
  );
};

export default React.memo(LoadingCard);
