import user from './user';
import navTag from './navTag';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  user,
  navTag
})

export default rootReducer;