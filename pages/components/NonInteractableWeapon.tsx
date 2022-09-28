import React from "react";

type SingleWeaponProps = {
  weapon: number;
};

const NonInteractableWeapon = (props: SingleWeaponProps) => {
  const CHOICE = [
    "",
    "rock",
    "paper",
    "scissors",
    "spock",
    "lizard",
  ];

  return (
    <div
      className="square"
      style={{
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        width: "120px",
        height: "120px",
        backgroundColor: "#585858",
        marginLeft: "10px",
        marginRight: "10px",
      }}
    >
      {<div style={{margin: "auto"}}>{CHOICE[props.weapon]}</div>}
    </div>
  );
};

export default NonInteractableWeapon;