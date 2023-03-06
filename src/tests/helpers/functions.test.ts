import { Guild, User } from "discord.js";
import { functions } from "../../helpers";
import { describe } from "node:test";

describe("functions", () => {
  it("randomNumber should return a random number between a set range", () => {
    const result = functions.randomNumber(1, 2);

    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(2);
  });

  it("randomArrayItem should return a random item in an array", () => {
    const mockArray = [1, 2, 3, 4];

    const result = functions.randomArrayItem(mockArray);

    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(4);
  });

  it("getGuildString should return a correctly formatted string", () => {
    const mockGuild = {
      id: "12345",
      name: "GUILD_NAME",
    };

    const result = functions.getGuildString(mockGuild as Guild);

    expect(result).toEqual("GUILD_NAME (12345)");
  });

  it("getUserString should return a correctly formatted string", () => {
    const mockUser = {
      id: "12345",
      username: "USER_USERNAME",
    };

    const result = functions.getUserString(mockUser as User);

    expect(result).toEqual("USER_USERNAME (12345)");
  });

  it("getUserMentionString should return a correctly formatted string", () => {
    const mockUser = {
      id: "12345",
      username: "USER_USERNAME",
    };

    const result = functions.getUserMentionString(mockUser as User);

    expect(result).toEqual(`${mockUser} (12345)`);
  });

  it("formatApiError should return a correctly formatted object", () => {
    const result = functions.formatApiError("ERROR_MESSAGE");

    expect(result).toEqual({
      error: true,
      message: "ERROR_MESSAGE",
    });
  });
});
