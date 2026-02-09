export const CommonFunctions = {
  getBaseUrl(): string {
    return process.env.BASE_URL || 'https://parabank.parasoft.com/';
  },

  getUserName(): string {
    return process.env.PARABANK_USER || 'john';
  },

  getPassword(): string {
    return process.env.PARABANK_PASS || 'demo';
  },

  takeScreenshots(): boolean {
    const flag = process.env.TAKE_SCREENSHOTS;
    if (!flag) return true;
    return flag.toLowerCase() !== 'false';
  },

  safeFileName(input: string): string {
    return input.replace(/[^a-zA-Z0-9_-]+/g, '_').slice(0, 120);
  },

  humanizeMethodName(methodName: string): string {
    return methodName
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/_/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/^./, (c) => c.toUpperCase());
  },
};
