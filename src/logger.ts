export function logInfo(message: string) {
  console.log(`ℹ️ ${message}`);
}

export function logError(message: string, error: any) {
  console.error(`❌ ${message}`, error);
}
