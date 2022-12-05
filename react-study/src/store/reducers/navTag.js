import { SET_NAV_TAB, PUSH_NAV_TAB, DELETE_NAV_TAB } from "../actionTypes/navTag";

const initState = {
  navTabList: []
}

const navTag = (state = initState, action) => {
  switch(action.type) {
    case SET_NAV_TAB: 
      return {
        ...state,
        navTabList: action.navTabList
      }
    case PUSH_NAV_TAB: 
      state.navTabList.push(action.obj);
      return state;
    case DELETE_NAV_TAB: 
      state.navTabList.splice(action.index, 1);
      return state;
    default:
      return state
  }
}

export default navTag;