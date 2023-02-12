import { Game } from "npm:@gathertown/gather-game-client@38.0.1";

export const CreateGatherClient = async (apiKey: string, spaceId: string) => {
  const game = new Game(
    spaceId,
    () => Promise.resolve({ apiKey: apiKey }),
  );

  await game.connect();

  return game;
};
