import React from "react";
import "./Navigation.css";

const Navigation = ({ onRouteChange, isSignedIn }) => {
  if (isSignedIn) {
    return (
      <div className="navigation">
        <p className="f3 link dim black pointer pr4 b">Sign In</p>
        <p
          className="f3 link dim black pointer b"
          onClick={() => onRouteChange("signout")}
        >
          Sign Out
        </p>
      </div>
    );
  } else {
    return (
      <div className="navigation">
        <p
          className="f3 link dim black pointer b pr4"
          onClick={() => onRouteChange("signIn")}
        >
          Sign In
        </p>
        <p
          className="f3 link dim black pointer b"
          onClick={() => onRouteChange("register")}
        >
          Register
        </p>
      </div>
    );
  }
};

export default Navigation;
