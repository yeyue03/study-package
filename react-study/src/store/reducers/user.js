import { SET_USERINFO } from '../actionTypes/user';

const setUserinfo = (state = {}, action) => {
  switch(action.type) {
    case SET_USERINFO: 
      return {
        ...state,
        userinfo: action.userinfo
      }
    default:
      return state;
  }
}

export default setUserinfo;