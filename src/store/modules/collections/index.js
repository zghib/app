import * as actions from "./actions";
import mutations from "./mutations";

/*
 * Collections are nested in a data key. Right now this doesn't serve any purpose yet
 * but we'll be moving to a system where these states can be updated async
 * (eg realtime) by updating the values based on polling
 *
 * This means that the state itself needs to keep track of the when it's loading
 * and when it has loaded last
 *
 * I had to refactor this state either way to tackle another issue, so I figured
 * I might as well prepare it a little bit for the future.
 *
 * This state will eventually look a little something like
 *
 * {
 *   data: {},
 *   error: null,
 *   lastLoaded: Date
 *   loading: false
 * }
 */

export const state = {
  data: {}
};

export default {
  actions,
  mutations,
  state
};
