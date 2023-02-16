import {PermissionResolvable, PermissionsBitField, PermissionsString} from "discord.js";

class Functions {
    public randomNumber(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    public missingPerms(memberPerms: unknown, requiredPerms: unknown): PermissionsString[] {
        return new PermissionsBitField(memberPerms as PermissionResolvable).missing(new PermissionsBitField(requiredPerms as PermissionResolvable));
    }
}
export default Functions;