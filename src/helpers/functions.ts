import {
  PermissionResolvable,
  PermissionsBitField,
  PermissionsString,
} from "discord.js";

class Functions {
  public randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
export default Functions;
