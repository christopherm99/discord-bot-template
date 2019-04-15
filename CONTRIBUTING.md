# Contributing to YeetBot 2.0
## Adding Commands
1. To add a new command, first write the underlying module file:
  src/commands/ping.js
  ```js
  export default function execute(message, args) {
    message.channel.send("Pong!")
  }
  ```
  - `message` will be of type [Discord.Message](https://discord.js.org/#/docs/main/stable/class/Message)
  - `args` will be of type string[]
2. Then enable the new command:
  src/commands/index.js
  ```js
  import ping from "./ping.js";

  export default [
    {
      name: "ping",
      minArgs: 0,
      usage `ping
  Replies Pong!`,
      execute: ping
    },
    ...
  ]
  ```
  - `name` should be a one-word unique string
  - `minArgs` should be the number of arguments your command expects
  - `usage` should be a multi-line string in the following format:
    ```
    COMMAND_NAME [<ARGUMENTS...>]
    SHORT_DESCRIPTION
    ```
  - `execute` should be the function imported from your new module file.

## Style
Please run `npm run lint` before committing, and resolve any errors.