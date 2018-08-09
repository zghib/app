import api from "../../../api";
import { defaultFull, defaultNone } from "./defaults";
import { mapValues } from "lodash";
import { SET_PERMISSIONS } from "../../mutation-types";

export function getPermissions({ commit, rootState }) {
  const collections = rootState.collections;
  const admin = rootState.currentUser.admin === true;

  const defaultPermissions = mapValues(collections, collection => {
    if (collection.statusMapping) {
      return mapValues(collection.statusMapping, () => {
        if (admin) return defaultFull;
        return defaultNone;
      });
    }

    if (admin) return defaultFull;
    return defaultNone;
  });

  if (admin) {
    commit(SET_PERMISSIONS, defaultPermissions);
    return Promise.resolve();
  }

  return api
    .getMyPermissions()
    .then(res => res.data)
    .then(permissions => {
      permissions.forEach(permission => {
        const { collection, status } = permission;

        if (status) {
          defaultPermissions[collection][status] = permission;
        } else {
          defaultPermissions[collection] = permission;
        }
      });

      commit(SET_PERMISSIONS, defaultPermissions);
    });
}
