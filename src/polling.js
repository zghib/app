/* global process */

import store from "./store/";
import router from "./router";

let fastInterval = null;

export function startPolling() {
  fastInterval = setInterval(() => {
    // Only track user position / latency in production environments
    if (process.env.NODE_ENV === "production") {
      store.dispatch("latency");
      store.dispatch("track", { page: router.currentRoute.path });
    }
  }, 10000);
}

export function stopPolling() {
  clearInterval(fastInterval);
}
