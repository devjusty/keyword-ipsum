export const trackPerformance = (label, operation) => {
  return (...arguments_) => {
    if (import.meta.env.MODE === "development") {
      const startTime = performance.now();
      try {
        const result = operation(...arguments_);
        const endTime = performance.now();
        console.log(`${label} took ${endTime - startTime}ms`);
        return result;
      } catch (error) {
        console.error(`Performance Tracking error in ${label}`, error);
        throw error;
      }
    }
    return operation(...arguments_);
  };
};
