import fs from "node:fs";
export const dailyMonitorPolicy = JSON.parse(fs.readFileSync(new URL("../../financing/config.json", import.meta.url), "utf8"));
