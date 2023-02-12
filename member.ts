import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { postgresClient } from "./postgres.ts";

export interface Member {
  name: string;
  gatherId: string;
  icon: string;
  isOnline: boolean;
}

export const initMembers = async (): Promise<Member[]> => {
  const members: Member[] = [];
  const result = await postgresClient.queryArray(
    "SELECT name, gather_id, icon FROM members",
  );
  for (const row of result.rows) {
    members.push({
      name: row[0] as string,
      gatherId: row[1] as string,
      icon: row[2] as string,
      isOnline: false,
    });
  }

  return members;
};

interface MemberRepository {
  findByGatherId: (gatherId: string) => Member | undefined;
  updateStatusByGatherId: (gatherId: string, isOnline: boolean) => void;
  createMember: (member: Member) => void;
}

export class MemberRepositoryImpl implements MemberRepository {
  members: Member[];
  postgresClient: Client;

  findByGatherId = (gatherId: string): Member | undefined => {
    return this.members.find((v) => v.gatherId === gatherId);
  };

  updateStatusByGatherId = (gatherId: string, isOnline: boolean) => {
    this.members.forEach((v) => {
      if (v.gatherId === gatherId) {
        v.isOnline = isOnline;
      }
    });
  };

  createMember = (member: Member) => {
    this.postgresClient.queryObject(
      `INSERT INTO members(name, gather_id, icon) VALUES('${member.name}','${member.gatherId}','${member.icon}')`,
    );
    this.members.push(member);
  };

  constructor(members: Member[], postgresClient: Client) {
    this.members = members;
    this.postgresClient = postgresClient;
  }
}

export const CreateMemberRepository = (
  members: Member[],
  postgresClient: Client,
): MemberRepository => {
  return new MemberRepositoryImpl(members, postgresClient);
};
