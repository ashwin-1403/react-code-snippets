import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import "./loader.style.scss";

function Loader(props: any) {
  return props.startLoader ? (
    <div className="loader-div">
      <ClipLoader color="#ff2851" size={75} />
    </div>
  ) : (
    <></>
  );
}

export default Loader;
