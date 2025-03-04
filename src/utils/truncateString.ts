function truncateString(str: string): string {
  return str.length > 50 ? str.slice(0, 50) + "..." : str;
}

export {
  truncateString
};