const state = {
  headNavKey: '',
  siderNavKey: '',
  siderOpenKeys: '',
  userinfo: {},
  menuList: [], 
}

const getters = {
  getHeadNavKey: (state) => state.headNavKey,
  getSiderNavKey: (state) => state.siderNavKey,
  getSiderOpenKey: (state) => state.siderOpenKeys,
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
  SET_SIDER_OPEN_KEY: (state, key) => {
    state.siderOpenKeys = key;
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
  setSiderOpenKey: ({ commit }, key) => {
    commit('SET_SIDER_OPEN_KEY', key);
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