import config from "../../config";

/**
 *    Bot reasoning/responses.
 */
export const CrudReasons = {
  ADDED: `Added by ${config.clientName}.`,
  REMOVED: `Removed by ${config.clientName}.`,
  UPDATED: `Updated by ${config.clientName}.`,
};

export const ErrorReasons = {
  INVALID_TEXT_CHANNEL: "You are not in a text channel.",
  INVALID_VOICE_CHANNEL: "You are not in a voice channel.",
  INVALID_ROLE: "You must provide a role.",
  INVALID_USER: "You must provide a user.",
  INVALID_PARAMETER: (parameter: string) =>
    `You must provide the ${parameter} parameter.`,
  INVALID_ROLE_HIERARCHY:
    "This can not be performed as the user has a higher role than you.",
  INVALID_USER_SELF: "This cannot be performed on yourself.",
  INVALID_CHANNEL_NONEXISTENT: (channel: string) =>
    `The ${channel} has not been setup/does not exist.`,
  CHANNEL_PROBLEM: (channel: string) =>
    `There was a problem creating the ${channel} channel.`,
  ROLE_PROBLEM: (role: string) =>
    `There was a problem creating the ${role} role.`,
};
