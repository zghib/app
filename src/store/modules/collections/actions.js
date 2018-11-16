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
import { i18n, availableLanguages } from "../../../lang/";
import formatTitle from "@directus/format-title";
import { forEach, isEmpty } from "lodash";
import api from "../../../api";

export function addField({ commit }, { collection, field }) {
  commit(ADD_FIELD, { collection, field });
}

export function updateField({ commit }, { collection, field }) {
  commit(UPDATE_FIELD, { collection, field });
}

export function updateFields({ commit }, { collection, updates }) {
  commit(UPDATE_FIELDS, { collection, updates });
}

export function removeField({ commit }, { collection, field }) {
  commit(REMOVE_FIELD, { collection, field });
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
