import Vue from "vue";
import { forEach } from "lodash";
import { SET_PERMISSIONS } from "../../mutation-types";

const mutations = {
  [SET_PERMISSIONS](state, permissions) {
    forEach(permissions, (permission, collection) => {
      Vue.set(state, collection, permission);
    });
  }
};

export default mutations;
