const state = {
  headNavKey: '',
  siderNavKey: '',
  userinfo: {},
  menuList: [], 
}

const getters = {
  getHeadNavKey: (state) => state.headNavKey,
  getSiderNavKey: (state) => state.siderNavKey,
  getUserinfo: (state) => state.userinfo,
  getMenu: (state) => state.menuList,
}

const mutations = {
  SET_HEAD_NAVKEY: (state, key) => {
    state.headNavKey = key;
  },
  SET_SIDER_NAVKEY: (state, key) => {
    state.siderNavKey = key;
  },
  SET_USERINFO: (state, info) => {
    state.userinfo = info;
  },
  SET_MENU: (state, menu) => {
    state.menuList = menu;
  }
}

const actions = {
  setHeadNavKey: ({ commit }, key) => {
    commit('SET_HEAD_NAVKEY', key);
  },
  setSiderNavKey: ({ commit }, key) => {
    commit('SET_SIDER_NAVKEY', key);
  },
  setMenu: ({ commit }, menu) => {
    commit('SET_MENU', menu);
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}