import { SET_SERVER_INFO } from "../../mutation-types";

export default {
  [SET_SERVER_INFO](state, info) {
    state.apiVersion = info.apiVersion;
    state.phpVersion = info.phpVersion;
    state.maxUploadSize = info.maxUploadSize;
    state.databaseVendor = info.databaseVendor;
  }
};
