// helpful semantic reminder
export type Index = number;

export type GamePhase = "ACTIVE" | "COMPLETE";

export interface State {
  players: Array<Player>;
  phase: GamePhase;
  currentFrame: Index;
  currentRoll: Index;
  rollInput: string;
  currentTurn: Index;
  winner: Index | null;
  validationMsg: string;
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
  score: number;
}

export interface Player {
  frames: Array<Frame>;
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
