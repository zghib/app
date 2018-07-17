import { keyBy } from "lodash";
import { SET_INTERFACES, SET_LISTINGS, SET_PAGES } from "../../mutation-types";

const mutations = {
  [SET_INTERFACES](state, interfaces) {
    state.interfaces = keyBy(interfaces, "id");
  },
  [SET_LISTINGS](state, listings) {
    state.listings = keyBy(listings, "id");
  },
  [SET_PAGES](state, pages) {
    state.pages = keyBy(pages, "id");
  }
};

export default mutations;
