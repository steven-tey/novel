import chalk from "../../lib/chalk";
export const prefixes = {
    wait: "- " + chalk.cyan("wait"),
    error: "- " + chalk.red("error"),
    warn: "- " + chalk.yellow("warn"),
    ready: "- " + chalk.green("ready"),
    info: "- " + chalk.cyan("info"),
    event: "- " + chalk.magenta("event"),
    trace: "- " + chalk.magenta("trace")
};
export function wait(...message) {
    console.log(prefixes.wait, ...message);
}
export function error(...message) {
    console.error(prefixes.error, ...message);
}
export function warn(...message) {
    console.warn(prefixes.warn, ...message);
}
export function ready(...message) {
    console.log(prefixes.ready, ...message);
}
export function info(...message) {
    console.log(prefixes.info, ...message);
}
export function event(...message) {
    console.log(prefixes.event, ...message);
}
export function trace(...message) {
    console.log(prefixes.trace, ...message);
}
const warnOnceMessages = new Set();
export function warnOnce(...message) {
    if (!warnOnceMessages.has(message[0])) {
        warnOnceMessages.add(message.join(" "));
        warn(...message);
    }
}

//# sourceMappingURL=log.js.map