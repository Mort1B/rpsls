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
      }}
    >
        <div style={{margin: "auto"}}>{props.image}</div>
    </div>
  );
};

export default SingleWeapon;