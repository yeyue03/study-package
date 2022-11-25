import { SET_USERINFO, SET_MENU, SET_HEAD_NAVKEY } from '../actionTypes/user';

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

export function setHeadNavKey(key) {
  return {
    type: SET_HEAD_NAVKEY,
    key
  }
}