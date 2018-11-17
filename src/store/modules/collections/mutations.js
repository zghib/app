import Vue from "vue";
import _ from "lodash";

import {
  SET_COLLECTIONS,
  ADD_COLLECTION,
  DELETE_COLLECTION,
  UPDATE_COLLECTION,
  ADD_FIELD,
  UPDATE_FIELD,
  UPDATE_FIELDS,
  REMOVE_FIELD
} from "../../mutation-types";

const mutations = {
  [SET_COLLECTIONS](state, data) {
    const collections = _.mapValues(_.keyBy(data, "collection"), info => {
      const statusField = _.find(info.fields, { interface: "status" });
      let status_mapping =
        statusField &&
        statusField.options &&
        statusField.options.status_mapping;

      if (status_mapping && typeof status_mapping === "string") {
        status_mapping = JSON.parse(status_mapping);
      }

      return {
        ...info,
        status_mapping
      };
    });

    _.forEach(collections, (value, key) => {
      state[key] = value;
    });
  },

  [ADD_COLLECTION](state, collection) {
    Vue.set(state, collection.collection, collection);
  },

  [DELETE_COLLECTION](state, collection) {
    Vue.delete(state, collection);
  },

  [UPDATE_COLLECTION](state, { collection, edits }) {
    _.forEach(edits, (value, key) => {
      Vue.set(state[collection], key, value);
    });
  },

  [ADD_FIELD](state, { collection, field }) {
    Vue.set(state[collection], "fields", {
      ...state[collection].fields,
      [field.field]: field
    });
  },

  [UPDATE_FIELD](state, { collection, field }) {
    Vue.set(state[collection], "fields", {
      ...state[collection].fields,
      [field.field]: field
    });
  },

  [UPDATE_FIELDS](state, { collection, updates }) {
    updates.forEach(update => {
      Vue.set(state[collection].fields, update.field, {
        ...state[collection].fields[update.field],
        ...update
      });
    });
  },

  [REMOVE_FIELD](state, { collection, field }) {
    const clone = Object.assign({}, state[collection].fields);
    delete clone[field];
    Vue.set(state[collection], "fields", clone);
  }
};

export default mutations;
