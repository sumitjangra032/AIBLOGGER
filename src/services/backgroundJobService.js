// services/backgroundJobService.ts
import { blogService } from "./blogService";

class BackgroundJobService {
   constructor() {
    this.intervalId = null; // To store setInterval ID
    this.isRunning = false; // Track if the job is running
   }

  start() {
    if (this.isRunning) return;

    console.log("Starting background blog generation service...");
    this.isRunning = true;

    // Run immediately
    this.generateBlogs();

    // Then run every hour
    this.intervalId = setInterval(
      () => {
        this.generateBlogs();
      },
      60 * 60 * 1000,
    ); // 1 hour in milliseconds
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log("Background blog generation service stopped.");
  }

   async generateBlogs() {
    try {
      console.log("Generating new blogs...");

      // Generate 10 new blogs
      await blogService.generateBlogs(1);

      // Clean up old blogs (keep latest 100)
      await blogService.cleanupOldBlogs();

      console.log("Blog generation completed successfully.");
    } catch (error) {
      console.error("Error in background blog generation:", error);
    }
  }

  // Manual trigger for testing
  async triggerGeneration() {
    if (this.isRunning) {
      await this.generateBlogs();
    }
  }
}

export const backgroundJobService = new BackgroundJobService();

// Auto-start when the module is loaded (in production)
if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  backgroundJobService.start();
}

// For development, you can manually start it
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // Uncomment the line below to enable background jobs in development
  backgroundJobService.start();
}
