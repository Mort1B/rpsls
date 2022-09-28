import React, { useEffect, useState } from "react";
import SingleWeapon from "./SingleWeapon";

type CircleProps = {
  initialWeapon: number;
  setWeapon: React.Dispatch<React.SetStateAction<number>>;
};
const WeaponSelector = (props: CircleProps) => {
  const CHOICE = [
    "",
    "rock",
    "paper",
    "scissor",
    "spock",
    "lizard",
  ];

  const [selectedWeapon, setSelectedWeapon] = useState<number>(
    props.initialWeapon
  );

  useEffect(() => {
    console.log("Changing weapon to", selectedWeapon, CHOICE[selectedWeapon]);
    props.setWeapon(selectedWeapon);
  }, [selectedWeapon]);

  return (
    <div className={"flex-1 flex flex-row justify-around"}>
      {CHOICE.map((choice, index) => {
        if (index === 0) return;
        return (
          <SingleWeapon
            key={index}
            currentWeapon={selectedWeapon}
            setSelectedWeapon={setSelectedWeapon}
            num={index}
            choice={choice}
          />
        );
      })}
    </div>
  );
};

export default WeaponSelector;