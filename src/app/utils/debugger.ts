import fs from "fs";
import path from "path";

const logFile = path.join(__dirname, "../debug.log");

type LogLevel = "log" | "info" | "error";

function getTimestamp(): string {
    return new Date().toISOString();
}

function writeLog(level: LogLevel, message: any): void {
    const logLine = `[${getTimestamp()}] [${level.toUpperCase()}] ${message}\n`;

    // Print to console
    if (level === "error") {
        console.error(logLine.trim());
    } else {
        console.log(logLine.trim());
    }

    // Append into debug.log
    fs.appendFileSync(logFile, logLine, "utf8");
}

export const Debugger = {
    log: (msg: any) => writeLog("log", msg),
    info: (msg: any) => writeLog("info", msg),
    error: (msg: any) => writeLog("error", msg),
};
