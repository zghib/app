import SDK from "@directus/sdk-js";
import formatTitle from "@directus/format-title";
import _ from "lodash";
import store from "./store";
import { LOGIN_SUCCESS } from "./store/mutation-types";

const client = new SDK({
  storage: window.sessionStorage
});

client.onAutoRefreshError = function logout(error) {
  store.dispatch("logout", error);
};

if (client.loggedIn) {
  const config = window.__DirectusConfig__; // eslint-disable-line
  const urls = config
    ? _.mapKeys(config.api, (val, key) => (key.endsWith("/") ? key : key + "/"))
    : null;

  store.commit(LOGIN_SUCCESS, {
    project: client.project,
    token: client.token,
    url: client.url,
    projectName:
      urls[client] ||
      urls[client.url + "/" + client.project + "/"] ||
      formatTitle(extractHostname(client.url))
  });
}

export default client;

function extractHostname(url) {
  let hostname;

  if (url.indexOf("://") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }
  hostname = hostname.split(":")[0];
  hostname = hostname.split("?")[0];

  return hostname;
}
