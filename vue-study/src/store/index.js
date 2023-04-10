import { createStore } from "vuex";
import user from "./modules/user";
import navTag from "./modules/navTag";

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    navTag,
  },
});
