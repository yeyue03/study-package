import { SET_USERINFO, SET_MENU } from '../actionTypes/user';

export function setUserinfo(userinfo) {
  return {
    type: SET_USERINFO,
    userinfo
  }
}

export function setMenu(menuList) {
  return {
    type: SET_MENU,
    menuList
  }
}