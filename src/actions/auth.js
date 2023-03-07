import * as constants from "../constants";
import Api from "../utilites/config/lib";

storedate = async (response) => {
  try {
    await AsyncStorage.setItem("userData", response);
  } catch (e) {
    //console.log(e)
  }
};

// Login
export const loginRequest = () => {
  return {
    type: constants.LOGIN_REQUEST,
  };
};

export function loginSuccess(data) {
  return {
    type: constants.LOGIN_SUCCESS,
    data,
  };
}

export function loginFailure(data) {
  return {
    type: constants.LOGIN_FAILURE,
    data,
  };
}

export function setData(data) {
  return {
    type: constants.SET_USER_DATA,
    data,
  };
}

export function setUserData(data) {
  return (dispatch) => {
    dispatch(setData(data));
  };
}

export function loginUser(route, formData, additional) {
  return (dispatch) => {
    dispatch(loginRequest());
    return Api.postAxios(route, formData)
      .then(async (response) => {
        if (response.data && response.status === 200 && response.data.user) {
          response.data.user.accessToken = response.data.accessToken;
          if (additional.remember_me) {
            storedate(JSON.stringify(response.data.user));
          }
          dispatch(loginSuccess(response.data.user));
        } else {
          dispatch(loginFailure(response.data.message));
        }
      })
      .catch((error) => {
        dispatch(loginFailure(error.message));
      });
  };
}
