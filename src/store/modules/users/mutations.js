import Vue from "vue";
import { SET_USERS } from "../../mutation-types";

export default {
  [SET_USERS](state, users) {
    Object.values(users).forEach(user => {
      Vue.set(state, user.id, user);
    });
  }
};
