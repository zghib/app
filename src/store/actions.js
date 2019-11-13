import api from "../api";
import axios from "axios";
import router from "@/router";
import hydrateStore from "@/hydrate";
import { loadLanguageAsync } from "@/lang/";

import {
  RESET,
  LATENCY,
  SET_CURRENT_USER,
  UPDATE_CURRENT_USER,
  SET_BOOKMARKS,
  ADD_BOOKMARK,
  DELETE_BOOKMARK,
  LOADING_START,
  LOADING_FINISHED,
  SET_PROJECT_STATUS,
  UPDATE_PROJECT,
  SET_CURRENT_PROJECT,
  INIT_PROJECTS
} from "./mutation-types";

export function latency({ commit }) {
  const start = performance.now();
  const now = Date.now();

  api
    .ping()
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
        "roles.*.*",
        "last_page"
      ]
    })
    .then(res => res.data)
    .then(userInfo => {
      return {
        ...userInfo,
        roles: userInfo.roles.map(obj => obj.role),
        admin: !!userInfo.roles.map(obj => obj.role).find(obj => obj.id === 1)
      };
    })
    .then(data => commit(SET_CURRENT_USER, data));
}

export function track({ commit, state }, { page }) {
  const currentUserID = state.currentUser.id;

  if (!currentUserID) {
    return;
  }

  const data = {
    last_page: page
  };

  commit(UPDATE_CURRENT_USER, data);
  return api.api.request("PATCH", `/users/${currentUserID}/tracking/page`, {}, data);
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

export async function setCurrentProject({ commit, dispatch, state, getters }, key) {
  commit(SET_CURRENT_PROJECT, key);
  const newProject = state.projects.find(p => p.key === key);

  const authenticated = newProject.data?.authenticated || false;
  const privateRoute = router.currentRoute.meta.publicRoute !== true;

  const locale = getters.currentProject.data?.default_locale;

  if (locale) {
    loadLanguageAsync(locale);
  }

  if (privateRoute && authenticated) {
    commit(RESET);
    await dispatch("getProjects");

    if (authenticated) {
      await hydrateStore();

      // Default to /collections as homepage
      let route = `/${key}/collections`;

      // If the last visited page is saved in the current user record, use that
      if (state.currentUser.last_page) {
        route = state.currentUser.last_page;
      }

      router.push(route);
    }
  } else if (privateRoute && authenticated === false) {
    router.push("/login");
  }
}

export async function updateProjectInfo({ commit, state }, key) {
  const apiRootPath = state.apiRootPath;
  const url = apiRootPath + key + "/";
  commit(SET_PROJECT_STATUS, { key: key, status: "loading" });

  try {
    const response = await axios.get(url);
    const {
      project_name,
      project_foreground,
      project_color,
      project_background,
      project_logo,
      telemetry,
      default_locale
    } = response.data.data.api;
    const authenticated = response.data.public === undefined;

    commit(UPDATE_PROJECT, {
      key: key,
      data: {
        project_name,
        project_foreground,
        project_color,
        project_background,
        project_logo,
        telemetry,
        default_locale,
        authenticated
      }
    });
    commit(SET_PROJECT_STATUS, { key: key, status: "successful" });
  } catch (error) {
    commit(UPDATE_PROJECT, { key: key, error });
    commit(SET_PROJECT_STATUS, { key: key, status: "failed" });
  }
}

export async function getProjects({ state, dispatch, commit }) {
  try {
    let projects;

    if (state.projects === null || state.projects === false) {
      const apiRootPath = state.apiRootPath;
      const url = apiRootPath + "server/projects";
      const response = await axios.get(url);
      const projectKeys = response.data.data;

      projects = projectKeys.map(key => ({
        key,
        status: null,
        data: null,
        error: null
      }));

      commit(INIT_PROJECTS, projects);
    }

    if (state.projects.length > 0 && state.currentProjectKey === null) {
      dispatch("setCurrentProject", state.projects[0].key);
    }

    // If the project that the user last logged into no longer exists, reset to the first possible project
    if (
      state.projects.length > 0 &&
      state.projects.map(p => p.key).includes(state.currentProjectKey) === false
    ) {
      dispatch("setCurrentProject", state.projects[0].key);
    }

    return Promise.allSettled(
      state.projects.map(p => p.key).map(key => dispatch("updateProjectInfo", key))
    );
  } catch (error) {
    const errorCode = error.response?.data.error.code;

    if (errorCode === 14) {
      return commit(INIT_PROJECTS, false);
    }

    console.error(error);
  }
}
