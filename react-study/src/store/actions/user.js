import { SET_USERINFO } from '../actionTypes/user';

export function setUserinfo(userinfo) {
  return {
    type: SET_USERINFO,
    userinfo
  }
}