// Keep structured discovery diagnostics readable without changing accepted input.
export function sourceDiagnosticMarkdown(diagnostic) {
  if (diagnostic !== null && typeof diagnostic === "object") {
    return `\`\`\`json\n${JSON.stringify(diagnostic, null, 2)}\n\`\`\``;
  }
  return `- ${String(diagnostic ?? "unknown")}`;
}
