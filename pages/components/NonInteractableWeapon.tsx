import React from "react";

type SingleWeaponProps = {
  weapon: number;
};

const NonInteractableWeapon = (props: SingleWeaponProps) => {
  const IMAGES = [
    "",
    "ROCK",
    "paper",
    "scissors",
    "spock",
    "lizard",
  ];

  const boxSize = 120;

  return (
    <div
      className="square"
      style={{
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        width: `${boxSize.toString()}px`,
        height: `${boxSize.toString()}px`,
        backgroundColor: "#585858",
        marginLeft: "10px",
        marginRight: "10px",
      }}
    >
      {<div style={{margin: "auto"}}>{IMAGES[props.weapon]}</div>}
    </div>
  );
};

export default NonInteractableWeapon;