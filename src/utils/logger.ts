const prefix = (level: string) => `[${level}]`;

const debug = (...args: unknown[]) => console.debug(prefix('DEBUG'), ...args);
const info = (...args: unknown[]) => console.info(prefix('INFO'), ...args);
const error = (...args: unknown[]) => console.error(prefix('ERROR'), ...args);

export default { debug, info, error };
