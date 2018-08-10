import api from "../api";
import { forEach, isEmpty } from "lodash";
import formatTitle from "@directus/format-title";
import { i18n, availableLanguages } from "../lang/";
import {
  ADD_FIELD,
  UPDATE_FIELD,
  REMOVE_FIELD,
  LATENCY,
  SET_SETTINGS,
  SET_CURRENT_USER,
  UPDATE_CURRENT_USER,
  SET_COLLECTIONS,
  ADD_COLLECTION,
  DELETE_COLLECTION,
  UPDATE_COLLECTION,
  SET_BOOKMARKS,
  ADD_BOOKMARK,
  DELETE_BOOKMARK,
  LOADING_START,
  LOADING_FINISHED
} from "./mutation-types";

export function latency({ commit }) {
  const start = performance.now();
  const now = Date.now();

  api
    .request("get", "/server/ping", {}, {}, true)
    .then(() => {
      const end = performance.now();
      const delta = end - start;
      commit(LATENCY, {
        date: now,
        latency: delta
      });
    })
    .catch(error => {
      const end = performance.now();
      const delta = end - start;

      if (error.code === -2) {
        return commit(LATENCY, {
          date: now,
          latency: delta
        });
      }

      return commit(LATENCY, {
        date: now,
        latency: -1
      });
    });
}

export function getSettings({ commit }) {
  return api
    .getSettings()
    .then(res => res.data)
    .then(data => commit(SET_SETTINGS, data));
}

export function addField({ commit }, { collection, field }) {
  commit(ADD_FIELD, { collection, field });
}

export function updateField({ commit }, { collection, field }) {
  commit(UPDATE_FIELD, { collection, field });
}

export function removeField({ commit }, { collection, field }) {
  commit(REMOVE_FIELD, { collection, field });
}

export function getCurrentUser({ commit }) {
  return api
    .getMe({
      fields: [
        "id",
        "avatar.*",
        "email",
        "first_name",
        "last_name",
        "locale",
        "roles.*"
      ]
    })
    .then(res => res.data)
    .then(userInfo => {
      return {
        ...userInfo,
        roles: userInfo.roles.map(obj => obj.role),
        admin: userInfo.roles.map(obj => obj.role).includes(1)
      };
    })
    .then(data => commit(SET_CURRENT_USER, data));
}

export function track({ commit, state }, { page }) {
  const currentUserID = state.currentUser.id;

  const data = {
    last_page: page
  };

  commit(UPDATE_CURRENT_USER, data);
  return api.request(
    "PATCH",
    `/users/${currentUserID}/tracking/page`,
    {},
    data
  );
}

export function getCollections({ commit }) {
  return api
    .getCollections()
    .then(res => res.data)
    .then(data => {
      forEach(data, collection => {
        if (!isEmpty(collection.translation)) {
          forEach(collection.translation, (value, locale) => {
            i18n.mergeLocaleMessage(locale, {
              [`collections-${collection.collection}`]: value
            });
          });
        } else {
          forEach(availableLanguages, locale => {
            i18n.mergeLocaleMessage(locale, {
              [`collections-${collection.collection}`]: formatTitle(
                collection.collection
              )
            });
          });
        }
      });

      commit(SET_COLLECTIONS, data);
    });
}

export function addCollection({ commit }, collection) {
  if (!isEmpty(collection.translation)) {
    forEach(collection.translation, (value, locale) => {
      i18n.mergeLocaleMessage(locale, {
        [`collections-${collection.collection}`]: value
      });
    });
  } else {
    forEach(availableLanguages, locale => {
      i18n.mergeLocaleMessage(locale, {
        [`collections-${collection.collection}`]: formatTitle(
          collection.collection
        )
      });
    });
  }
  commit(ADD_COLLECTION, collection);
}

export function removeCollection({ commit }, collection) {
  commit(DELETE_COLLECTION, collection);
}

export function updateCollection({ commit }, { collection, edits }) {
  commit(UPDATE_COLLECTION, { collection, edits });
}

export function getBookmarks({ commit }) {
  return api.getMyBookmarks().then(bookmarks => {
    commit(SET_BOOKMARKS, bookmarks);
    return bookmarks;
  });
}

export function saveBookmark({ commit }, bookmark) {
  return api.createCollectionPreset(bookmark).then(res => {
    const savedBookmark = res.data;
    commit(ADD_BOOKMARK, savedBookmark);
    return savedBookmark;
  });
}

export function deleteBookmark({ commit }, bookmarkID) {
  commit(DELETE_BOOKMARK, bookmarkID);
  return api.deleteCollectionPreset(bookmarkID).catch(error => {
    this.$events.emit("error", {
      notify: this.$t("something_went_wrong_body"),
      error
    });
  });
}

export function loadingStart({ commit }, { id, desc }) {
  commit(LOADING_START, { id, desc });
}

export function loadingFinished({ commit }, id) {
  commit(LOADING_FINISHED, id);
}
