import mutations from "./mutations";
import * as actions from "./actions";

const state = {
  apiVersion: null,
  phpVersion: null,
  maxUploadSize: null,
  databaseVendor: null
};

export default {
  state,
  mutations,
  actions
};
