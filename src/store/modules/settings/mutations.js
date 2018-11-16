import _ from "lodash";
import * as types from "./types";

export default {
  [types.SET_SETTINGS](state, settings) {
    const settingsByKey = _.keyBy(settings, "key");
    state.values = _.mapValues(settingsByKey, "value");
    state.primaryKeys = _.mapValues(settingsByKey, "id");
  },

  [types.SET_SETTING](state, { id, key, value }) {
    state.values[key] = value;
    state.primaryKeys[key] = id;
  }
};
