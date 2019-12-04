import { Idle } from "idlejs/dist";
import router from "@/router";
import api from "@/api";
import { UPDATE_PROJECT, RESET } from "@/store/mutation-types";

let idle = null;

export default function startIdleTracking(store) {
  const minutesUntilLogout = +store.state.settings.values.auto_sign_out;

  if (!minutesUntilLogout || minutesUntilLogout < 1) return;

  idle = new Idle()
    .whenNotInteractive()
    .within(minutesUntilLogout)
    .do(async () => {
      await api.logout();
      store.commit(UPDATE_PROJECT, {
        key: store.state.currentProjectKey,
        data: {
          authenticated: false
        }
      });

      store.commit(RESET);
      await store.dispatch("getProjects");
      router.push("/login");
      idle.stop();
    })
    .start();
}
