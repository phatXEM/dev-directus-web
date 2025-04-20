/**
 * Utility function to wait for a variable to become available in the global scope
 * Used for third-party scripts that need to load before accessing their APIs
 */
export const waitForVar = async <T>(
  name: string,
  {
    pollFrequency = 1000,
    retries: inRetries = 100,
    parent = window,
  }: {
    pollFrequency?: number | ((params: { retries: number }) => number);
    retries?: number;
    parent?: Record<string, any>;
  } = {}
): Promise<T | undefined> => {
  if (parent && Object.prototype.hasOwnProperty.call(parent, name)) {
    return Promise.resolve(parent[name] as T);
  }
  if (!inRetries) {
    return Promise.resolve(undefined);
  }
  const retries = inRetries - 1;
  return new Promise<void>((resolve) =>
    setTimeout(
      resolve,
      typeof pollFrequency === "function"
        ? pollFrequency({ retries })
        : pollFrequency
    )
  ).then(() => waitForVar<T>(name, { pollFrequency, parent, retries }));
};
