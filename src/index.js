import Discord from "discord.js";

import { token, prefix } from "./config.js";
import * as commands from "./commands/index.js";
import loadModels from "./faceapi.js";

const client = new Discord.Client();
client.login(token).catch(err => {
  console.error(token + err);
});

client.commands = new Discord.Collection();

Object.values(commands).forEach(command => {
  console.log(`Registering command: ${command.name}`);
  client.commands.set(command.name, command);
});

client.on("ready", async () => {
  await loadModels;
  console.log(`Logged in as ${client.user.username}!`);
});

client.on("message", message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  console.log(`${message.author}(${command}): ${message.content}`);
  if (!client.commands.has(command)) return;
  let com = client.commands.get(command);
  com.minArgs > args.length
    ? message.channel.send(`Too few arguments.
Usage:
\`\`\`
${com.usage}
\`\`\``)
    : com.execute(message, args);
});
