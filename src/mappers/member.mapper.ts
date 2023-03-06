import { Member } from "@prisma/client";

export default class MemberMapper {
  map(member: Member) {
    return {
      id: member.id,
      bot: member.bot,
      username: member.username,
      discriminator: member.discriminator,
      guildAdmin: member.guildAdmin,
      clientAdmin: member.clientAdmin,
      guildId: member.guildId,
    };
  }
}
