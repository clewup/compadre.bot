import "dotenv/config";

const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  discordClientToken: process.env.DISCORD_CLIENT_TOKEN,
  discordApplicationId: process.env.DISCORD_APPLICATION_ID,
  discordPublicKey: process.env.DISCORD_PUBLIC_KEY,
  databaseUrl: process.env.DATABASE_URL,
  // Wipes the database
  forceDatabaseReset: process.env.FORCE_DATABASE_RESET === "true",
};

export default config;
