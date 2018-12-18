import Vue from "vue";
import Vuex from "vuex";

import auth from "./modules/auth/";
import extensions from "./modules/extensions";
import collections from "./modules/collections";
import edits from "./modules/edits";
import permissions from "./modules/permissions";
import settings from "./modules/settings";
import users from "./modules/users";
import relations from "./modules/relations";
import serverInfo from "./modules/server-info";
import notifications from "./modules/notifications";

import state from "./state";
import * as actions from "./actions";
import * as getters from "./getters";
import mutations from "./mutations";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production"; // eslint-disable-line no-undef

const store = new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  strict: debug,
  modules: {
    auth,
    collections,
    extensions,
    edits,
    permissions,
    users,
    relations,
    serverInfo,
    notifications,
    settings
  }
});

export default store;

export function resetState() {
  const initialStateCopy = JSON.parse(JSON.stringify(state));

  // don't reset the last used url:
  initialStateCopy.auth.url = store.state.auth.url;

  store.replaceState(JSON.parse(JSON.stringify(initialStateCopy)));
}
