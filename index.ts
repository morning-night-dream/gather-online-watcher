import { CreateGatherClient } from "./gather.ts";
import { CreateMemberRepository, initMembers, Member } from "./member.ts";
import { SlackAPI } from "https://deno.land/x/deno_slack_api@0.0.8/mod.ts";
import Logger from "https://deno.land/x/logger@v1.0.2/logger.ts";
import { randomNumber } from "https://deno.land/x/random_number@2.0.0/mod.ts";
import { getConfig } from "./config.ts";
import { CreateSlackRepository } from "./slack.ts";
import { postgresClient } from "./postgres.ts";

const logger = new Logger();

const config = getConfig();

const gatherClient = await CreateGatherClient(
  config.gather.API_KEY,
  config.gather.SPACE_ID,
);

const members = await initMembers();

const memberRepository = CreateMemberRepository(members, postgresClient);

const slackClient = SlackAPI(config.slack.API_TOKEN);

const slackRepository = CreateSlackRepository(slackClient);

const emojis = await slackRepository.listEmoji();

const unusedEmojis = emojis.filter((v) => {
  !members.map((v) => v.icon).includes(v)
});

// @ts-ignore
gatherClient.subscribeToEvent("playerJoins", async (_data, context) => {
  if (!context.playerId) {
    return;
  }

  const playerId = context.playerId;
  let member = memberRepository.findByGatherId(playerId);

  if (!member) {
    const gatherPlayer = await gatherClient.getPlayer(context.playerId!);
    
    const emojiIndex = randomNumber({ min: 0, max: unusedEmojis.length -1 })

    const newMember : Member = {
      name: gatherPlayer.name,
      gatherId: playerId,
      icon: unusedEmojis[emojiIndex],
      isOnline: false,
    };

    unusedEmojis.splice(emojiIndex, 1);
    
    memberRepository.createMember(newMember);

    member = newMember;
  }

  if (member.isOnline) {
    logger.info(`member ${member.name} is already online`);
    return;
  }

  logger.info(`${member.name} join`);
  memberRepository.updateStatusByGatherId(member.gatherId, true);

  await slackRepository.addReaction(
    config.slack.CHANNEL_ID,
    member.icon,
    config.slack.SLACK_MESSAGE_TIMESTAMP,
  );
});

gatherClient.subscribeToEvent("playerExits", async (_data, context) => {
  if (!context.playerId) {
    return;
  }

  const playerId = context.playerId;
  const member = memberRepository.findByGatherId(playerId as string);
  if (!member) {
    logger.info(`unknown player ${playerId} left`)

    return;
  }

  if (!member.isOnline) {
    logger.info(`member ${member.gatherId} is already offline`);
    return;
  }

  logger.info(`${member.name} exit`);
  memberRepository.updateStatusByGatherId(member.gatherId, false);

  await slackRepository.removeReaction(
    config.slack.CHANNEL_ID,
    member.icon,
    config.slack.SLACK_MESSAGE_TIMESTAMP,
  );
});
