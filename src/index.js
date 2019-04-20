import commands from "./commands/index.js";
import Discord from "discord.js";
import loadModels from "./faceapi.js";
import { prefix, token } from "./config.js";

const client = new Discord.Client();

client.login(token).catch(err => {
  console.error(err);
});

client.commands = new Discord.Collection();

commands.forEach(command => {
  console.log(`Registering command: ${command.name}`);
  client.commands.set(command.name, command);
});

client.on("ready", async () => {
  await loadModels;
  console.log(`Logged in as ${client.user.username}!`);
  client.user.setActivity(`${prefix}help for help.`);
});

client.on("message", message => {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  message.attachments.forEach(attachment => {
    console.log(`Attachment: ${attachment.url}`);
    args.push(attachment.url);
  });
  console.log(`${message.author}(${command}): ${message.content}`);
  if (command === "help") {
    let mesg = "```";

    client.commands.forEach(com => {
      mesg += `${com.usage}\n`;
    });
    mesg += "```";
    message.channel.send(mesg);
  } else if (!client.commands.has(command)) {
    return;
  }
  const com = client.commands.get(command);

  if (com.minArgs > args.length) {
    message.channel.send(`Too few arguments.
Usage:
\`\`\`
${com.usage}
\`\`\``);
  } else {
    com.execute(message, args);
  }
});
