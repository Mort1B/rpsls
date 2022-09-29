import { ContractFactory, ethers } from "ethers";
import { arrayify, solidityKeccak256 } from "ethers/lib/utils";
import * as Peer from "peerjs";
import React, { useEffect, useState } from "react";
import { RPS, RPS__factory } from "../../public/utils";
import initPeer from "../../utils/initPeer";
import WeaponSelector from "./WeaponSelector";
import NonInteractableWeapon from "./NonInteractableWeapon";
import { nanoid } from "nanoid";
import { useInterval } from "../../utils/useInterval";

const BASE_URL = process.env.NEXT_PUBLIC_BASEURL || "http://localhost:3000"; // hardcoded

type PeerMsg =
  | { _type: "ContractAddress"; address: string }
  | { _type: "Winner"; player: Winner }
  | { _type: "Player2Address"; address: string }
  | { _type: "Player1Address"; address: string }
  | { _type: "Player1Weapon"; weapon: number }
  | { _type: "Connected" };

type Winner = "P1" | "P2" | "no one, a draw" | "idle";

type Mining = {
  status: "mining" | "idle";
  reset: () => void;
};

enum Selection {
  "Null",
  "Rock",
  "Paper",
  "Scissors",
  "Spock",
  "Lizard",
}

type ScreenToDisplay =
  | "WaitingForP2Connection"
  | "Player2Connected"
  | "Player2Decided";


type BlockchainInfo = {
  p1Moved: boolean;
  p2Moved: boolean;
  p2BlockchainMove: number;
};

const Player1UI = (props: { accountAddress: string }) => {
  const INITIAL_STAKE = "0.001";
  const [salt, setSalt] = useState<Uint8Array | null>();
  const [peerId, setPeerId] = useState<string>("");
  const [connState, setConnState] = useState<Peer.DataConnection>();
  const [weapon, setWeapon] = useState<number>(0);
  const [stake, setStake] = useState<string>(INITIAL_STAKE);
  const [player2Address, setPlayer2Address] = useState<string>("");
  const [player2Response, setPlayer2Response] = useState<number>(0);
  const [contractAddress, setContractAddress] = useState<string>("");
  const [mining, setMining] = useState<Mining>({
    status: "idle",
    reset: () => {
      setMining({ ...mining, status: "idle" });
    },
  });
  const [winner, setWinner] = useState<Winner>("idle");
  const [screenToDisplay, setScreenToDisplay] = useState<ScreenToDisplay>(
    "WaitingForP2Connection" 
  );

  const [blockchainInfo, setBlockchainInfo] = useState<BlockchainInfo>({
    p1Moved: false,
    p2Moved: false,
    p2BlockchainMove: 0,
  });

  const win = (_c1: Selection, _c2: Selection) => {
    if (_c1 == _c2) return "draw";
    // They played the same so no winner.
    else if (_c1 % 2 == _c2 % 2) return _c1 < _c2;
    else return _c1 > _c2;
  };

  const createMatch = async (
    stake: string,
    weapon: number,
    player2Address: string
  ) => {
    // @ts-ignore
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const factory = new ContractFactory(
        RPS__factory.abi,
        RPS__factory.bytecode,
        signer
      ) as RPS__factory;

      // Setup salt
      const saltVar = getRand();
      setSalt(saltVar);

      const p1Hash = solidityKeccak256(["uint8", "uint256"], [weapon, saltVar]);

      setMining({ ...mining, status: "mining" });

      factory
        .deploy(p1Hash, player2Address, {
          value: ethers.utils.parseEther(stake),
        })
        .then(async (RPSDeployed) => {
          await RPSDeployed.deployed();

          setContractAddress(RPSDeployed.address);

          // Send the contract address to peer
          let msg: PeerMsg = {
            _type: "ContractAddress",
            address: RPSDeployed.address,
          };
          connState?.send(msg);

          mining.reset();
        })
        .catch((err) => {
          if (err.code === 4001) alert("You cancelled the transaction");
          console.log("createMatchErr", err);
          mining.reset();
        });
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  };

  const pollBlockchainInfo = async (contractAddress: string) => {
    try {
      // @ts-ignore
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);

        const RPSContract = RPS__factory.connect(contractAddress, provider);

        const c1 = await RPSContract.c1Hash();
        const c2 = await RPSContract.c2();

        if (c1 !== "") {
          setBlockchainInfo({ ...blockchainInfo, p1Moved: true });
        }

        if (c2 !== 0) {
          setBlockchainInfo({
            ...blockchainInfo,
            p2Moved: true,
            p2BlockchainMove: c2,
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Check if player 2 plays
  useEffect(() => {
    if (
      blockchainInfo.p2Moved === true &&
      screenToDisplay !== "Player2Decided"
    ) {
      setScreenToDisplay("Player2Decided");
      return setPlayer2Response(blockchainInfo.p2BlockchainMove);
    }
  }, [blockchainInfo]);


  const checkWhoWon = async () => {
    setMining({ ...mining, status: "mining" });
    // @ts-ignore
    const { ethereum } = window;

    if (ethereum && salt) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const RPSContract = await RPS__factory.connect(contractAddress, signer);

      RPSContract.solve(weapon, salt, {
        gasLimit: 100_000,
      })
        .then(async (tx) => {
          await tx.wait();
          const actualWinner = decideWinnerLocally(weapon, player2Response);
          setWinner(actualWinner);
          if (actualWinner !== "idle") {
            let msg: PeerMsg = { _type: "Winner", player: actualWinner };
            connState?.send(msg);
            msg = { _type: "Player1Weapon", weapon: weapon };
            connState?.send(msg);
            mining.reset();
          }
        })
        .catch((err) => {
          if (err.code === 4001) alert("You cancelled the transaction");
          console.log("checkWhoWon", err);
          mining.reset();
        });
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  };

  const decideWinnerLocally = (
    weapon: Selection,
    player2Response: Selection
  ): Winner => {
    if (win(weapon, player2Response) === "draw") {
      return "no one, a draw";
    } else if (win(weapon, player2Response)) return "P1";
    else return "P2";
  };

  // Peer js setup, dynamically as to please NextJS
  useEffect(() => {
    const asyncFn = async () => {
      const id = `advancedRPS-${nanoid()}`;
      const peer = await initPeer(id);

      // Save own peer id
      setPeerId(peer.id);

      peer.on("open", () => {});

      peer.on("error", (e) => console.log("ERROR", e));

      peer.on("connection", (conn) => {
        conn.on("error", (e) => console.log("ConnERROR", e));

        conn.on("open", () => {
          conn.send("Linked with Peer 1!");
          const msg: PeerMsg = {
            _type: "Player1Address",
            address: props.accountAddress,
          };
          conn.send(msg);
        });

        // Save connection for future use
        setConnState(conn);

        // Set event listeners for Peer communication
        conn.on("data", (data: any): data is PeerMsg => {
          switch (data._type) {
            case "Connected":
              setScreenToDisplay("Player2Connected");
              return true;

            case "Player2Address":
              setPlayer2Address(data.address);
              return true;

            default:
              console.log("Default");
              return true;
          }
        });
      });
    };
    asyncFn();
    // eslint-disable-next-line
  }, []);

  // Decide who is the winner
  useEffect(() => {
    if (player2Response !== 0 && winner === "idle")
      (async () => {
        // Fix loading
        await checkWhoWon();
      })();
    // eslint-disable-next-line
  }, [player2Response]);

  // Finicky code to focus the stakeInput on load
  useEffect(() => {
    if (screenToDisplay === "Player2Connected") {
      const input: HTMLSpanElement | null =
        document.getElementById("stakeInput");
      setTimeout(() => {
        input?.focus();
        if (input) {
          input.innerText = INITIAL_STAKE;
        }
      }, 0);
    }
  }, [screenToDisplay]);

  // Scheduled information update with blockchain
  useInterval(async () => {
    if (contractAddress !== "") {
    //   console.log(salt, "salt");
      pollBlockchainInfo(contractAddress);
    }
  }, 1000);

  switch (screenToDisplay) {
    default:
      return <div></div>;
    case "WaitingForP2Connection":
      return (
        <div
          className={"relative flex-1 flex flex-col flex-nowrap items-center"}
          style={{
            paddingTop: "4rem",
          }}
        >
          {/* This div displays status info */}
          <div
            className={"flex-1 flex flex-col w-full   max-w-lg"}
            style={{textAlign: "center", flexGrow: 0.5 }}
          >
            <span className={"text-4xl "}>Play RPSLS</span>
            <br />
            {peerId === "" ? (
              <span className={"text-4xl "}>
                Pinging the P2P router.
              </span>
            ) : (
              <div className="flex-1 flex justify-center items-center">
                <button
                  onClick={() =>
                    copyToClipBoard(`https://test-8fle.vercel.app/?peerId=${peerId}`)
                  }
                  style={{
                    backgroundColor: "#585858",
                    width: "fit-content",
                  }}
                  className="rounded-md text-xl flex flex-row px-4 py-3"
                >
                  <div style={{ width: "1.5rem", height: "1.5rem" }}>
                  </div>
                  <span style={{  marginLeft: "5px" }}>
                    Click and share to connect with another player!
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      );
    case "Player2Connected":
      return (
        <div
          className={"relative flex-1 flex flex-col flex-nowrap items-center"}
          style={{
            paddingTop: "4rem",
          }}
        >
          {/* This div displays status info */}
          <div
            className={"flex-1 flex flex-col w-full max-w-lg"}
            style={{ flexGrow: 0.5 }}
          >
            <br />
            {mining.status === "mining" ? (
              <>
                <span className={"text-4xl"}>Please check your wallet.</span>
                <span className={"text-4xl"}>
                  Deploy the contract to the blockchain!
                </span>
                <br />
              </>
            ) : contractAddress === "" ? (
              <>
                <span className={"text-4xl"}>Player 2 has joined.</span>
                <br />
                <span className={"text-4xl"}>
                  How much ETH do you want to bet? Bet{" "}
                  <span
                    id="stakeInput"
                    contentEditable
                    style={{
                      minWidth: "2ch",
                      width: "2ch",
                      paddingLeft: "1px",
                      textDecoration: "underline",
                      border: "none",
                    }}
                    className={"focus:outline-none"}
                    onInput={(e) => setStake(e.currentTarget.innerText)}
                  ></span>{" "}
                  ETH.
                </span>
                <br />
                <span className={"text-4xl"}>Then, pick your weapon.</span>
              </>
            ) : (
              <>
                <span className={"text-4xl"}>
                  Waiting for Player 2&apos;s choice.
                </span>
                <br />
              </>
            )}
          </div>
          {/* This div displays buttons */}
          <div
            className={"flex-1 flex flex-col w-full items-center"}
            style={{ flexGrow: 0.5 }}
          >
            {contractAddress === "" && mining.status === "idle" ? (
              <>
                <WeaponSelector setWeapon={setWeapon} initialWeapon={weapon} />
                <div className="flex-1 flex justify-center items-center">
                  {weapon !== 0 && stake !== "" && parseFloat(stake) > 0 ? (
                    <button
                      onClick={() => {
                        createMatch(stake, weapon, player2Address);
                      }}
                      style={{  backgroundColor: "#585858" }}
                      className="w-96 h-14 rounded-md text-xl"
                    >
                      Click here to place your bets!
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </>
            ) : (
              <div
                className={
                  "flex-1 flex flex-row w-full justify-center max-w-2xl"
                }
                style={{ flexGrow: 0.5 }}
              >
                <div className={"flex flex-col justify-center items-center "}>
                  <NonInteractableWeapon weapon={weapon} />
                  <br />
                  <div>Your choice</div>
                </div>
                <br />
                <div className={"flex items-center mx-4 mt-36"}>
                  <span>vs</span>
                </div>
                <br />
                <div className={"flex flex-col justify-center items-center "}>
                  <div>Waiting for Player 2s response</div>
                </div>
              </div>
            )}
          </div>
          {/* This div displays additional info */}
          <div
            className={"flex-1 flex flex-row w-full pl-10 "}
            style={{ flexGrow: 0.2, maxHeight: "100px" }}
          >
            <div
              style={{ flexGrow: 0.8 }}
              className={"flex-1 flex flex-col flex-nowrap justify-center"}
            >
              {player2Address === "" ? (
                ""
              ) : (
                <a
                  rel="noreferrer"
                  target="_blank"
                  href={`https://ropsten.etherscan.io/address/${player2Address}`}
                  className={" px-2 flex flex-row text-xs"}
                  style={{ maxWidth: "fit-content", textAlign: "center" }}
                >
                  <span style={{ width: "370px", textAlign: "center" }}>
                    OPPONENT: {player2Address}
                  </span>
                </a>
              )}
              <br />
              {contractAddress === "" ? (
                ""
              ) : (
                <a
                  rel="noreferrer"
                  target="_blank"
                  href={`https://ropsten.etherscan.io/address/${contractAddress}`}
                  className={" px-2 flex flex-row text-xs"}
                  style={{ maxWidth: "fit-content", textAlign: "center" }}
                >
                  <span style={{ width: "370px", textAlign: "center" }}>
                    MATCH: {contractAddress}
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      );
    case "Player2Decided":
      return (
        <div
          className={"relative flex-1 flex flex-col flex-nowrap items-center"}
          style={{
            paddingTop: "4rem",
          }}
        >
          {/* This div displays status info */}
          <div
            className={"flex-1 flex flex-col w-full max-w-lg"}
            style={{ flexGrow: 0.5 }}
          >
            {mining.status === "mining" ? (
              <>
                {/* FIX */}
                <span className={"text-4xl"}>Please check your wallet.</span>
                <br />
                <span className={"text-4xl"}>
                  Confirm pinging the blockchain to decide winner.
                </span>
              </>
            ) : winner === "idle" ? (
              <>
                <span className={"text-4xl"}>Player 2 has decided!</span>
                <br />
                <span className={"text-4xl"}>
                  Please check your wallet to confirm the end of the match.
                </span>
              </>
            ) : (
              <>
                <span className={"text-4xl"}>
                  The match has ended, thanks for playing!
                </span>
                <br />
                <span className={"text-4xl"}>
                  {winner === "P1"
                    ? "You won! Nice job, and thanks for playing!"
                    : winner === "P2"
                    ? "You lost, better luck next time and thanks for playing!"
                    : "No one won. Get those spirits up, thanks for playing!"}
                </span>
              </>
            )}
          </div>
          {/* This div displays buttons */}
          <div
            className={"flex-1 flex flex-row w-full justify-center max-w-2xl"}
            style={{ flexGrow: 0.5 }}
          >
            <div className={"flex flex-col justify-center items-center"}>
              <NonInteractableWeapon weapon={weapon} />
              <br />
              <div>Your choice</div>
            </div>
            <br />
            <div className={"flex items-center mx-4 mt-36"}>
              <span>vs</span>
            </div>
            <br />
            {mining.status === "mining" ? (
              <div className={"flex flex-col justify-center items-center"}>
                <div>Waiting for the blockchain</div>
              </div>
            ) : player2Response === 0 ? (
              <div className={"flex flex-col justify-center items-center"}>
                <div>Waiting for Player 2&apos;s response</div>
              </div>
            ) : winner === "idle" ? (
              <div className={"flex flex-col justify-center items-center"}>
                <div>Waiting for wallet confirmation</div>
              </div>
            ) : (
              <div className={"flex flex-col justify-center items-center"}>
                <NonInteractableWeapon weapon={player2Response} />
                <br />
                <div>Player 2&apos;s choice</div>
              </div>
            )}
          </div>
          <div
            className={"flex-1 flex flex-row w-full pl-10 "}
            style={{ flexGrow: 0.2, maxHeight: "100px" }}
          >
            <div
              style={{ flexGrow: 0.8 }}
              className={"flex-1 flex flex-col flex-nowrap justify-center"}
            >
              {player2Address === "" ? (
                ""
              ) : (
                <a
                  rel="noreferrer"
                  target="_blank"
                  href={`https://ropsten.etherscan.io/address/${player2Address}`}
                  className={"px-2 flex flex-row text-xs"}
                  style={{ maxWidth: "fit-content", textAlign: "center" }}
                >
                  <span style={{ width: "370px", textAlign: "center" }}>
                    OPPONENT: {player2Address}
                  </span>
                </a>
              )}
              <br />
              {contractAddress === "" ? (
                ""
              ) : (
                <a
                  rel="noreferrer"
                  target="_blank"
                  href={`https://ropsten.etherscan.io/address/${contractAddress}`}
                  className={"px-2 flex flex-row text-xs"}
                  style={{ maxWidth: "fit-content", textAlign: "center" }}
                >
                  <span style={{ width: "370px", textAlign: "center" }}>
                    MATCH: {contractAddress}
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      );
  }
};

export default Player1UI;

// --------- UTILS -----------

const copyToClipBoard = (text: string) => {
  /* Copy the text inside the text field */
  navigator.clipboard.writeText(text);

  /* Alert the copied text */
  alert("Copied the text: " + text);
};

const getRand = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return arrayify(array);
};

