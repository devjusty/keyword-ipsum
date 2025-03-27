export const logError = (context, error, additionalInfo = {}) => {
  const timestamp = new Date().toISOString();
  const errorLog = {
    timestamp,
    context,
    message: error.message,
    stack: error.stack,
    ...additionalInfo
  };

  if (import.meta.env.MODE === "development") {
    console.error(JSON.stringify(errorLog, null, 2));
  }
}
