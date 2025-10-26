let timerId = null;
let lastRefresh = Date.now();

let REFRESH_BLOG_INTERVAL_MINUTES = 60;


if (isNaN(REFRESH_BLOG_INTERVAL_MINUTES) || REFRESH_BLOG_INTERVAL_MINUTES <= 0) {
  REFRESH_BLOG_INTERVAL_MINUTES = 60; // default to 60 minutes
  console.log("inside if REFRESH_BLOG_INTERVAL_MINUTES:", REFRESH_BLOG_INTERVAL_MINUTES);

}

export const startAutoRefresh = async (handleRefresh, setLastRefresh) => {
  if (timerId) return;

  const refreshInterval = REFRESH_BLOG_INTERVAL_MINUTES * 60 * 1000; // 1 hour

  console.log("Auto-refresh interval (ms):", refreshInterval);

  // Update state once at the start
  if (setLastRefresh) setLastRefresh(new Date());

  const scheduleNext = async () => {
    
    const elapsed = Date.now() - lastRefresh;
    console.log("Elapsed time since last refresh (ms):", elapsed);
    const delay = Math.max(refreshInterval - elapsed, 0);
    console.log("Scheduling next refresh in (ms):", delay);

    timerId = setTimeout(async () => {
      await handleRefresh();
      
      setLastRefresh(new Date());
      lastRefresh = Date.now();

      console.log("Starting lastRefresh in timer:",  Date.now());

      scheduleNext(); 
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
