import "dotenv/config";

const clientAdmins = ["1034517161726713857"];

const config = {
  // Environment Variables
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  discordClientToken: process.env.DISCORD_CLIENT_TOKEN,
  discordApplicationId: process.env.DISCORD_APPLICATION_ID,
  discordPublicKey: process.env.DISCORD_PUBLIC_KEY,
  databaseUrl: process.env.DATABASE_URL,
  clientName: process.env.CLIENT_NAME,
  clientInviteUrl: process.env.CLIENT_INVITE_URL,
  openAiKey: process.env.OPENAI_KEY,
  jwtKey: process.env.JWT_KEY,

  // Configuration
  clientAdmins: clientAdmins,
};

export default config;
