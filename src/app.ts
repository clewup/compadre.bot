import express from 'express';
import {Client, IntentsBitField as Intents } from 'discord.js'

require('dotenv').config();

const app = express();
const port = 3000;
const client = new Client({intents: [Intents.Flags.Guilds, Intents.Flags.GuildMessages]});

/*app.get('/', (req, res) => {
    res.send('Hello World!');
});*/

client.on("ready", () => {
    console.log(`Logged in as ${client?.user?.tag}!`);
})

client.login(process.env.CLIENT_TOKEN);

client.on('messageCreate', msg => {
    console.log(msg);
    if (msg.content === 'Hello') {
        msg.reply(`Hello ${msg.author.username}`);
    }
});

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});