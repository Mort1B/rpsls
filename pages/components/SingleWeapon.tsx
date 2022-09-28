import React, { useEffect, useState } from "react";

type SingleWeaponProps = {
  num: number;
  image: string;
  currentWeapon: number;
  setSelectedWeapon: React.Dispatch<React.SetStateAction<number>>;
};
const SingleWeapon = (props: SingleWeaponProps) => {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (props.currentWeapon === props.num) {
      props.setSelectedWeapon(props.num);
      return setSelected(true);
    }
    return setSelected(false);
    // eslint-disable-next-line
  }, [props.currentWeapon]);

  const boxSize = 120;
  const imageSize = 100;
  const lizardSize = Math.floor(imageSize * (100 / 120)).toString();
  const rockSize = Math.floor(imageSize * (80 / 120)).toString();

  return (
    <div
      onClick={() => {
        props.setSelectedWeapon(props.num);
      }}
      className={"singleWeapon"}
      style={{
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        width: `${boxSize.toString()}px`,
        height: `${boxSize.toString()}px`,
        backgroundColor: selected === true ? "#585858" : "",
        marginLeft: "10px",
        marginRight: "10px",
        opacity: props.currentWeapon === 0 ? 1 : selected === true ? 1 : 0.5,
      }}
    >
        <div style={{margin: "auto"}}>{props.image}</div>
      {/* <img
        src={props.image}
        style={{
          transform: props.image === "lizard" ? "rotate(-90deg)" : "",
          position: "relative",
          left:
            props.image === "spock"
              ? "5px"
              : props.image === "paper"
              ? "-5px"
              : "",
          width:
            props.image === "rock"
              ? `${rockSize}px`
              : props.image === "lizard"
              ? `${lizardSize}px`
              : `${imageSize}px`,
          height:
            props.image === "rock"
              ? `${rockSize}px`
              : props.image === "lizard"
              ? `${lizardSize}px`
              : `${imageSize}px`,
          alignSelf: "center",
        }}
      /> */}
    </div>
  );
};

export default SingleWeapon;