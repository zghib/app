import SDK from "@directus/sdk-js";
import store from "./store";
import { LOGIN_SUCCESS } from "./store/mutation-types";

const client = new SDK({
  storage: window.sessionStorage
});

client.onAutoRefreshError = function logout(error) {
  store.dispatch("logout", error);
};

if (client.loggedIn) {
  store.commit(LOGIN_SUCCESS, {
    project: client.project,
    token: client.token,
    url: client.url
  });
}

export default client;
