// src/utils/refreshTimer.js

let refreshInterval = null;
const HOUR_MS = 60 * 60 * 1000;

/**
 * Starts a global auto-refresh that calls `handleRefresh` every hour
 * and updates React state via `setLastRefresh`.
 */
export function startAutoRefresh(handleRefresh, setLastRefresh) {
  // Clear any old timer (prevents duplicates if component remounts)
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }

  // Set up hourly refresh
  refreshInterval = setInterval(async () => {
    console.log("⏰ Auto refresh triggered at", new Date().toLocaleTimeString());

    try {
      // Call your refresh logic (fetch data, reload, etc.)
      await handleRefresh();

      // Update the React state with the new time
      setLastRefresh(new Date());
      console.log("✅ lastRefresh updated:", new Date().toLocaleTimeString());
    } catch (err) {
      console.error("❌ Error in auto refresh:", err);
    }
  }, HOUR_MS); 
}

/**
 * Stops the global auto-refresh timer.
 */
export function stopAutoRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
    console.log("🛑 Auto refresh stopped.");
  }
}
