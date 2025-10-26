let timerId = null;
let lastRefresh = Date.now();

export const startAutoRefresh = async (handleRefresh, setLastRefresh) => {
  if (timerId) return;

  const refreshInterval = 60 * 60 * 1000; // 1 hour

  // Update state once at the start
  if (setLastRefresh) setLastRefresh(new Date());

  console.log("Starting lastRefresh :", lastRefresh);

  const scheduleNext = async () => {
    const now = Date.now();
    const elapsed = now - lastRefresh;
    console.log("Elapsed time since last refresh (ms):", elapsed);
    const delay = Math.max(refreshInterval - elapsed, 0);
    console.log("Scheduling next refresh in (ms):", delay);

    timerId = setTimeout(async () => {
      await handleRefresh();
      
      setLastRefresh(new Date());

      console.log("Starting lastRefresh :", lastRefresh);

      scheduleNext(); // schedule the next refresh
    }, delay);
  };

  scheduleNext();
};

export const stopAutoRefresh = () => {
  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
  }
};
