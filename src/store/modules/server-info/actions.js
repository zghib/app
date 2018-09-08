import api from "../../../api";
import { SET_SERVER_INFO } from "../../mutation-types";

export function getServerInfo({ commit }) {
  api
    .serverInfo()
    .then(res => res.data)
    .then(info => {
      commit(SET_SERVER_INFO, {
        apiVersion: info.api.version,
        phpVersion: info.server.general.php_version,
        maxUploadSize: info.server.max_upload_size
      });
    });
}
