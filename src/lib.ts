import type * as TenPin from "./types";

export const getTurn = (state: TenPin.State): TenPin.PlayerId => {
  return (state.phase.status === "ACTIVE" && state.phase.turn) || 0;
};

// TODO: handle game end
export const advanceTurn = (state: TenPin.State): TenPin.GamePhase => {
  if (state.phase.status !== "ACTIVE") return state.phase;
  const currentTurn = state.phase.turn;
  return { status: "ACTIVE", turn: currentTurn + 1 };
};

export const submitRoll = (
  state: TenPin.State,
  rollValue: TenPin.Roll
): Array<TenPin.Player> => {
  const { players, currentFrame, currentRoll } = state;
  const currentTurn = getTurn(state);

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
