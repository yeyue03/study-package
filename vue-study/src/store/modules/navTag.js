const state = {
  navTabList: [],
  visibleComponent: "",
};

const getters = {
  getNavTab: (state) => state.navTabList,
};

const mutations = {
  SET_NAV_TAB: (state, arr) => {
    state.navTabList = arr;
  },
  PUSH_NAV_TAB: (state, obj) => {
    state.navTabList.push(obj);
  },
  DELETE_NAV_TAB: (state, index) => {
    state.navTabList.splice(index, 1);
  },
  SET_VISIBLE_COMPONENT: (state, val) => {
    state.visibleComponent = val;
  },
};

const actions = {
  setNavTab: ({ commit }, arr) => {
    commit("SET_NAV_TAB", arr);
  },
  pushNavTab: ({ commit }, obj) => {
    commit("PUSH_NAV_TAB", obj);
  },
  deleteNavTab: ({ commit }, index) => {
    commit("DELETE_NAV_TAB", index);
  },
  setVisibleComponent: ({ commit }, val) => {
    commit("SET_VISIBLE_COMPONENT", val);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
