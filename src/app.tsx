import * as React from "react";
import * as ReactDOM from "react-dom";

type PlayerId = number;

type Player = {
  id: number;
  score: number;
};

type GamePhase = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE";

interface State {
  players: Array<Player>;
  phase: GamePhase;
  turn: PlayerId;
  winner: PlayerId | null;
}

type Action =
  | {
      type: "START_GAME";
    }
  | { type: "INPUT_ROLL" }
  | { type: "END_GAME" };

const reducer = (state: State, action: Action): State => {
  return state;
};

const initialState: State = {
  players: [1, 2, 3, 4, 5].map((i) => ({ id: i, score: 0 })),
  phase: "NOT_STARTED",
  turn: 1,
  winner: null,
};

const App = ({ state }: { state: State }) => (
  <div>
    <h1>Hello dudes and dudettes!</h1>
    {state.players.map((p) => (
      <h2>
        {p.id}, {p.score}
      </h2>
    ))}
  </div>
);

ReactDOM.render(<App state={initialState} />, document.querySelector("main"));
