import { combineReducers } from 'redux';
import app from './reducers/app';
import auth from "./reducers/auth"
import user from "./reducers/user"

export default combineReducers({
  app,
  auth,
  user,
});
