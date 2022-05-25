import React, { useReducer } from "react";
import { createRoot } from "react-dom/client";
import { submitRoll, advanceTurn, getTurn } from "./lib";
import type * as TenPin from "./types";

const NUM_PLAYERS = 5;

const isRoll = (str: string): str is TenPin.Roll => {
  return ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "X", "/"].includes(
    str
  );
};

const reducer = (state: TenPin.State, action: TenPin.Action): TenPin.State => {
  switch (action.type) {
    case "INPUT_ROLL":
      return { ...state, rollInput: action.payload };

    case "SUBMIT_ROLL": {
      const { rollInput } = state;
      if (!isRoll(rollInput)) return { ...state }; // TODO: isValidRoll (further validation that roll makes sense given turn)

      const newPlayers = submitRoll(state, rollInput);
      const turn = getTurn(state);
      // If we're at the last roll of the frame, move to the next frame and player
      const endOfFrame = turn === NUM_PLAYERS - 1 && state.currentRoll === 1;
      const newFrame = endOfFrame ? state.currentFrame + 1 : state.currentFrame;
      const newPhase: TenPin.GamePhase = endOfFrame
        ? { status: "ACTIVE", turn: 0 }
        : state.currentRoll === 0
        ? state.phase
        : advanceTurn(state);

      const newRoll = state.currentRoll === 0 ? 1 : 0;

      return {
        ...state,
        players: newPlayers,
        phase: newPhase,
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
    rolls: [],
  }));
};

const initialState: TenPin.State = {
  players: [1, 2, 3, 4, 5].map((i) => ({
    id: i,
    frames: getFrames(),
    score: 0,
  })),
  phase: { status: "ACTIVE", turn: 0 },
  currentFrame: 0,
  currentRoll: 0,
  rollInput: "",
};

const Frame = ({
  active,
  f,
  i,
  score,
}: {
  active: boolean;
  f: TenPin.Frame;
  i: number;
  score: number;
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
      <div className="frame-score">Score: {f.open ? "-" : score}</div>
    </div>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log("state", state);

  if (state.phase.status === "COMPLETE") return <div>IsOver!</div>;

  return (
    <div className="app-container">
      {state.players.map((p, i) => (
        <div
          key={i}
          className={`player${
            state.phase.status === "ACTIVE" && i === state.phase.turn
              ? " active"
              : ""
          }`}
        >
          <div className="player-frames">
            <h2>Player: {i + 1}</h2>
            {p.frames.map((f, frameIdx) => (
              <Frame
                key={frameIdx}
                active={state.currentFrame === frameIdx}
                score={p.score}
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
      <button onClick={() => dispatch({ type: "SUBMIT_ROLL" })}>Submit</button>
    </div>
  );
};

const root = createRoot(document.querySelector("main")!);
root.render(<App />);
