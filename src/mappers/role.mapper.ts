import { Role } from "@prisma/client";

export default class RoleMapper {
  map(role: Role) {
    return {
      id: role.id,
      name: role.name,
      guildId: role.guildId,
    };
  }
}
