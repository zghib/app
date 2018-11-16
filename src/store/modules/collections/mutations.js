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
    state.data = _.mapValues(_.keyBy(data, "collection"), info => {
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
  },

  [ADD_COLLECTION](state, collection) {
    state.data = {
      ...state.data,
      [collection.collection]: collection
    };
  },

  [DELETE_COLLECTION](state, collection) {
    const copy = { ...state.data };
    delete copy[collection];

    state.data = copy;
  },

  [UPDATE_COLLECTION](state, { collection, edits }) {
    state.data = {
      ...state.data,
      [collection]: {
        ...state.data[collection],
        ...edits
      }
    };
  },

  [ADD_FIELD](state, { collection, field }) {
    Vue.set(state.data[collection], "fields", {
      ...state.data[collection].fields,
      [field.field]: field
    });
  },

  [UPDATE_FIELD](state, { collection, field }) {
    Vue.set(state.data[collection], "fields", {
      ...state.data[collection].fields,
      [field.field]: field
    });
  },

  [UPDATE_FIELDS](state, { collection, updates }) {
    updates.forEach(update => {
      Vue.set(state.data[collection].fields, update.field, {
        ...state.data[collection].fields[update.field],
        ...update
      });
    });
  },

  [REMOVE_FIELD](state, { collection, field }) {
    const clone = Object.assign({}, state.data[collection].fields);
    delete clone[field];
    Vue.set(state.data[collection], "fields", clone);
  }
};

export default mutations;
