import type * as TenPin from "./types";

const NUM_PLAYERS = 5;
const NUM_FRAMES = 10;

const endOfFrame = (state: TenPin.State): boolean =>
  state.currentTurn === NUM_PLAYERS - 1 && state.currentRoll === 1;

// should handle end of frame, reaching final player
export const advanceTurn = (state: TenPin.State): TenPin.Index => {
  if (endOfFrame(state)) return 0;
  return state.currentRoll === 0 ? state.currentTurn : state.currentTurn + 1;
};

export const advanceFrame = (state: TenPin.State): TenPin.Index =>
  endOfFrame(state)
    ? Math.min(NUM_FRAMES - 1, state.currentFrame + 1)
    : state.currentFrame;

export const submitRoll = (
  state: TenPin.State,
  rollValue: TenPin.Roll
): Array<TenPin.Player> => {
  const { players, currentFrame, currentTurn, currentRoll } = state;

  const player = state.players[currentTurn];
  const frame = player?.frames[currentFrame];
  const rolls = frame?.rolls;

  const newRolls = [...rolls, rollValue];

  const newFrames: Array<TenPin.Frame> = player?.frames.map((f, i) =>
    i === currentFrame ? { ...f, rolls: newRolls, open: currentRoll != 1 } : f
  );

  return players.map((p, i) =>
    i === currentTurn
      ? { ...p, score: p.score + parseInt(rollValue), frames: newFrames }
      : p
  );
};
