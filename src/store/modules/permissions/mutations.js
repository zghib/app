import Vue from "vue";
import { forEach } from "lodash";
import { SET_PERMISSIONS, ADD_PERMISSION } from "../../mutation-types";

const mutations = {
  [SET_PERMISSIONS](state, permissions) {
    forEach(permissions, (permission, collection) => {
      Vue.set(state, collection, permission);
    });
  },
  [ADD_PERMISSION](state, { collection, permission }) {
    Vue.set(state, collection, permission);
  }
};

export default mutations;
