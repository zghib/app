import SDK from "@directus/sdk-js";
import store from "./store";

const client = new SDK({
  storage: window.sessionStorage
});

client.onAutoRefreshError = function logout(error) {
  store.dispatch("logout", error);
};

export default client;
