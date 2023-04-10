import { SET_NAV_TAB, PUSH_NAV_TAB, DELETE_NAV_TAB } from "../actionTypes/navTag";

export function setNavTab(navTabList) {
  return {
    type: SET_NAV_TAB,
    navTabList
  }
}

export function pushNavTab(obj) {
  return {
    type: PUSH_NAV_TAB,
    obj
  }
}

export function deleteNavTab(index) {
  return {
    type: DELETE_NAV_TAB,
    index
  }
}