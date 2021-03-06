import React, { useReducer } from "react";
import { createRoot } from "react-dom/client";
import { submitRoll, advanceTurn, advanceFrame } from "./lib";
import type * as TenPin from "./types";

// is the input a valid roll string?
const isRoll = (str: string): str is TenPin.Roll => {
  return /^[x\/\d]$/i.test(str);
};

// does the roll make sense given current roll in the frame?
const isRollValid = (roll: TenPin.Roll, currentRoll: TenPin.Index): boolean => {
  if (
    (roll === "/" && currentRoll === 0) ||
    (/^x$/i.test(roll) && currentRoll === 1)
  )
    return false;
  return true;
};

const reducer = (state: TenPin.State, action: TenPin.Action): TenPin.State => {
  switch (action.type) {
    case "INPUT_ROLL":
      if (!isRoll(action.payload))
        return {
          ...state,
          rollInput: action.payload,
          validationMsg: "Pleae input a valid bowling roll",
        };
      if (!isRollValid(action.payload, state.currentRoll))
        return {
          ...state,
          rollInput: action.payload,
          validationMsg: "Invalid spare or strike specified",
        };

      return { ...state, rollInput: action.payload, validationMsg: "" };

    case "SUBMIT_ROLL": {
      const { rollInput } = state;
      if (!isRoll(rollInput)) return { ...state };

      const newPlayers = submitRoll(state, rollInput);

      // If we're at the last roll of the frame, move to the next frame and player (if needed)
      const newFrame = advanceFrame(state);
      const newTurn = advanceTurn(state);
      const newRoll = state.currentRoll === 0 ? 1 : 0;

      return {
        ...state,
        players: newPlayers,
        currentTurn: newTurn,
        currentFrame: newFrame,
        currentRoll: newRoll,
      };
    }

    default:
      return { ...state };
  }
};

const getFrames = (): Array<TenPin.Frame> => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_) => ({
    open: true,
    score: 0,
    rolls: [],
  }));
};

const initialState: TenPin.State = {
  players: [1, 2, 3, 4, 5].map((i) => ({
    id: i,
    frames: getFrames(),
    score: 0,
  })),
  phase: "ACTIVE",
  currentFrame: 0,
  currentRoll: 0,
  currentTurn: 0,
  winner: null,
  rollInput: "",
  validationMsg: "Please input a valid bowling roll",
};

const Frame = ({
  active,
  f,
  i,
}: {
  active: boolean;
  f: TenPin.Frame;
  i: number;
}) => {
  // potential third bonus roll allowed during the last frame
  const rolls = i === 9 ? [1, 2, 3] : [1, 2];

  return (
    <div className={`frame${active ? " active" : ""}`}>
      <h3>Frame {i + 1}</h3>
      <div className="frame-rolls">
        {rolls.map((_, rollIdx) => (
          <div key={rollIdx} className="roll">
            <div>{f.rolls[rollIdx] ?? "-"}</div>
          </div>
        ))}
      </div>
      <div className="frame-score">Score: {f.open ? "-" : f.score}</div>
    </div>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log("state", state);

  if (state.phase === "COMPLETE") return <div>IsOver!</div>;

  return (
    <div className="app-container">
      {state.players.map((p, i) => (
        <div
          key={i}
          className={`player${i === state.currentTurn ? " active" : ""}`}
        >
          <div className="player-frames">
            <h2>Player: {i + 1}</h2>
            {p.frames.map((f, frameIdx) => (
              <Frame
                key={frameIdx}
                active={state.currentFrame === frameIdx}
                f={f}
                i={frameIdx}
              />
            ))}
          </div>
        </div>
      ))}
      <input
        type="text"
        onChange={(e) =>
          dispatch({
            type: "INPUT_ROLL",
            payload: e.target.value,
          })
        }
      />
      <button
        disabled={state.validationMsg !== ""}
        onClick={() => dispatch({ type: "SUBMIT_ROLL" })}
      >
        Submit
      </button>
      <p className="validation-msg">{state.validationMsg}</p>
    </div>
  );
};

const root = createRoot(document.querySelector("main")!);
root.render(<App />);
