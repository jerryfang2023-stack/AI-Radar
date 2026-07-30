export function isProductionIncidentFilename(name = "") {
  return /^\d{4}-\d{2}-\d{2}-.+\.md$/u.test(String(name));
}
