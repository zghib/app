import api from "../../../api";
import { SET_USERS } from "../../mutation-types";

export function getUsers({ commit }) {
  return api
    .getUsers({
      fields: [
        "id",
        "first_name",
        "last_name",
        "title",
        "status",
        "timezone",
        "roles.*",
        "avatar.*",
        "company"
      ]
    })
    .then(res => res.data)
    .then(users =>
      users.map(user => ({
        ...user,
        roles: user.roles.map(({ role }) => role)
      }))
    )
    .then(users => {
      commit(SET_USERS, users);
    });
}
