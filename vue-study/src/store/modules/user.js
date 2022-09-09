const state = {
  nowNavKey: '01',
  userinfo: {},
  menuList: [],
}

const getters = {
  getUserinfo: (state) => state.userinfo,
  getMenu: (state) => state.menuList,
}

const mutations = {
  SET_NavKey: (state, key) => {
    state.nowNavKey = key;
  },
  SET_USERINFO: (state, info) => {
    state.userinfo = info;
  },
  SET_MENU: (state, menu) => {
    state.menuList = menu;
  }
}

const actions = {
  setNavKey: ({ commit }, key) => {
    commit('SET_NavKey', key);
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