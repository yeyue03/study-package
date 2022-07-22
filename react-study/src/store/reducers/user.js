import { SET_USERINFO, SET_MENU } from '../actionTypes/user';

const initState = {
  userinfo: {},
  menuList: []
}

const user = (state = initState, action) => {
  switch(action.type) {
    case SET_USERINFO: 
      return {
        ...state,
        userinfo: action.userinfo
      }
    case SET_MENU: 
      return {
        ...state,
        menuList: action.menuList
      }
    default:
      return state;
  }
}

export default user;