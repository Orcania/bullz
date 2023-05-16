import React from 'react'
import Loader from "react-loader-spinner";

function ButtonLoader(props)
{
    return (
        <Loader
        color={props.color==="black" ? "black": "#4353FF"}
        height={22}
        width={22}
        type={"TailSpin"}
      />
    )
}

export default ButtonLoader