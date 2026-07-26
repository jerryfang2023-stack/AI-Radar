import path from "node:path";

function sameExecutable(left, right) {
  const normalize = (value) => {
    const resolved = path.resolve(String(value || ""));
    return process.platform === "win32" ? resolved.toLowerCase() : resolved;
  };
  return normalize(left) === normalize(right);
}

export function formatRecordedCommand(command, args = []) {
  const executable = String(command || "");
  const commandArgs = Array.isArray(args) ? args.map(String) : [];
  const base = path.basename(executable).toLowerCase();

  if (
    ["cmd", "cmd.exe"].includes(base)
    && commandArgs[0]?.toLowerCase() === "/d"
    && commandArgs[1]?.toLowerCase() === "/s"
    && commandArgs[2]?.toLowerCase() === "/c"
  ) {
    return commandArgs.slice(3).join(" ");
  }

  const portableExecutable = sameExecutable(executable, process.execPath) ? "node" : executable;
  return [portableExecutable, ...commandArgs].join(" ");
}
