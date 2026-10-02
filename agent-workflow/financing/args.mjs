export function parseArgs(argv = process.argv.slice(2)) {
  return new Map(argv.map(arg => {
    const [key, ...value] = arg.replace(/^--/u, '').split('=');
    return [key, value.join('=')];
  }));
}
