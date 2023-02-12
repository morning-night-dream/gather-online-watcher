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
}

export class MemberRepositoryImpl implements MemberRepository {
  members: Member[];

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

  constructor(members: Member[]) {
    this.members = members;
  }
}

export const CreateMemberRepository = (members: Member[]): MemberRepository => {
  return new MemberRepositoryImpl(members);
};
