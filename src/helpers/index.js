import Vue from "vue";
import convertRange from "convert-range";
import formatTitle from "@directus/format-title";
import micromustache from "micromustache";
import shortid from "shortid";
import prefixes from "./prefixes";
import date from "./date";

const helpers = {
  formatTitle,
  prefixes,
  date,
  convertRange,
  micromustache,
  shortid
};

const helpersPlugin = {
  install(Vue) {
    // eslint-disable-line no-shadow
    Vue.prototype.$helpers = helpers;
  }
};

Vue.use(helpersPlugin);

export default helpers;
