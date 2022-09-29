const state = {
  navTabList: [],
  visibleComponent: '',
}

const getters = {
  getNavTab: state => state.navTabList
}

const mutations = {
  SET_NAVTAB: (state, arr) => {
    state.navTabList = arr;
  },
  PUSH_NAVTAB: (state, obj) => {
    state.navTabList.push(obj);
  },
  DELETE_NAVTAB: (state, index) => {
    state.navTabList.splice(index, 1);
  },
  SET_VISIBLECOMPONENT: (state, val) => {
    state.visibleComponent = val;
  },
}

const actions = {
  setNavTab: ({ commit }, arr) => {
    commit('SET_NAVTAB', arr);
  },
  pushNavTab: ({ commit }, obj) => {
    commit('PUSH_NAVTAB', obj);
  },
  deleteNavTab: ({ commit }, index) => {
    commit('DELETE_NAVTAB', index);
  },
  setVisibleComponent: ({ commit }, val) => {
    commit('SET_VISIBLECOMPONENT', val);
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}