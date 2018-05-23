import store from "./store/";
import router from "./router";

let fastInterval = null;

export function startPolling() {
  fastInterval = setInterval(() => {
    store.dispatch("latency");
    store.dispatch("track", { page: router.currentRoute.path });
  }, 10000);
}

export function stopPolling() {
  clearInterval(fastInterval);
}
