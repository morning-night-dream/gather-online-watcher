import { SlackAPI } from "https://deno.land/x/deno_slack_api@0.0.8/mod.ts";

interface SlackRepository {
  addReaction: (
    channelId: string,
    emoji: string,
    messageTimestamp: string,
  ) => void;
  removeReaction: (
    channelId: string,
    emoji: string,
    messageTimestamp: string,
  ) => void;
  listEmoji: () => Promise<string[]>;
}

export class SlackRepositoryImpl implements SlackRepository {
  slackClient: ReturnType<typeof SlackAPI>;

  addReaction = async (
    channelId: string,
    emoji: string,
    messageTimestamp: string,
  ) => {
    await this.slackClient.reactions.add({
      "channel": channelId,
      "name": emoji,
      "timestamp": messageTimestamp,
    });
  };

  removeReaction = async (
    channelId: string,
    emoji: string,
    messageTimestamp: string,
  ) => {
    await this.slackClient.reactions.remove({
      "channel": channelId,
      "name": emoji,
      "timestamp": messageTimestamp,
    });
  };

  async listEmoji() {
    const response = await this.slackClient.emoji.list({});
    return Object.keys(response.emoji).map((key) => key);
  }

  constructor(slackAPIClient: ReturnType<typeof SlackAPI>) {
    this.slackClient = slackAPIClient;
  }
}

export const CreateSlackRepository = (
  slackAPIClient: ReturnType<typeof SlackAPI>,
): SlackRepository => {
  return new SlackRepositoryImpl(slackAPIClient);
};
