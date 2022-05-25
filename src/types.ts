// just a number, but semantics are helpful
export type PlayerId = number;

export type GamePhase =
  | { status: "ACTIVE"; turn: PlayerId }
  | { status: "COMPLETE"; winner: PlayerId };

export interface State {
  players: Array<Player>;
  phase: GamePhase;
  currentFrame: number;
  currentRoll: number;
  rollInput: string;
}

export type Roll =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "X"
  | "/";

export interface Frame {
  open: boolean;
  rolls: Array<Roll>;
}

export interface Player {
  frames: Array<Frame>;
  score: number;
}

export type Action =
  | {
      type: "START_GAME";
    }
  | {
      type: "INPUT_ROLL";
      payload: string;
    }
  | { type: "END_GAME" }
  | { type: "SUBMIT_ROLL" };
