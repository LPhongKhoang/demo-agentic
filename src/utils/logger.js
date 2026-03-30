import chalk from "chalk";
import { Roles } from "./constant.js";

class MyLogger {
  constructor() {
    // Initialize markedTerminal
    // marked.use(markedTerminal());
  }

  logResponse(message, role = Roles.assistant) {
    // console.log(chalk.gray(new Date().toLocaleTimeString()));
    // console.log(chalk.green(`[${role}]: ${message}`));

    console.log(
      chalk.green(`\n[${role.toUpperCase()}]`) +
        " " +
        chalk.gray(new Date().toLocaleTimeString())
    );
    // console.log(marked(message));
    console.log(message);

    // console.log(chalk.blue(`[${Roles.user.toUpperCase()}]: `));
  }

  logRole(role, {latestFnCall} = {}) {
    console.log(chalk.blue(`[${role.toUpperCase()}]: ${latestFnCall??''}`));
  }

  streamChunk(chunk) {
    process.stdout.write(chunk);
  }

  logSystemMessage(message) {
    console.log(chalk.blue(`[${Roles.system.toUpperCase()}]: `));
    console.log(message);
  }

  debug(...messages) {
    console.log(chalk.yellow("\t\t[DEBUG]"));
    console.debug(chalk.gray(...messages));
  }

  clear() {
    console.clear();
  }
}

export const logger = new MyLogger();