import api from "../api";
import { forEach, isEmpty } from "lodash";
import formatTitle from "@directus/format-title";
import { i18n, availableLanguages } from "../lang/";
import {
  LATENCY,
  SET_SETTINGS,
  SET_CURRENT_USER,
  UPDATE_CURRENT_USER,
  SET_FIELDS,
  SET_COLLECTIONS,
  ADD_COLLECTION,
  DELETE_COLLECTION,
  UPDATE_COLLECTION,
  SET_BOOKMARKS,
  ADD_BOOKMARK,
  DELETE_BOOKMARK
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
    .catch(() => {
      commit(LATENCY, {
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

export function getCurrentUser({ commit }) {
  return api
    .getMe()
    .then(res => res.data)
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

export function getFields({ commit }, collection) {
  return api
    .getFields(collection)
    .then(res => res.data)
    .then(data => {
      commit(SET_FIELDS, { data, collection });

      forEach(data, field => {
        // TODO: Move this to a function of the /lang/index.js file
        if (!isEmpty(field.translation)) {
          forEach(field.translation, (value, locale) => {
            i18n.mergeLocaleMessage(locale, {
              [`fields-${collection}-${field.field}`]: value
            });
          });
        } else {
          forEach(availableLanguages, locale => {
            i18n.mergeLocaleMessage(locale, {
              [`fields-${collection}-${field.field}`]: formatTitle(field.field)
            });
          });
        }
      });
    });
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
