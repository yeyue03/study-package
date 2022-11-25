import { SET_USERINFO, SET_MENU, SET_HEAD_NAVKEY } from '../actionTypes/user';

const initState = {
  headNavKey: '01',
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
    case SET_HEAD_NAVKEY:
      return {
        ...state,
        headNavKey: action.key
      }
    default:
      return state;
  }
}

export default user;