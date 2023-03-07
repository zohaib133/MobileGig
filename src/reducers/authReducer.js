import * as constants from '../constants';
const  initialState = {
    loading : false,
    data: null,
    failed: null,
    message: null,
    token: null,
};

export const authReducer = (state = initialState, action) =>{
    let newState;
    switch (action.type) {
        case constants.LOGIN_REQUEST:
            newState = {
                ...state,
                loading: true,
                failed: false
            };

            return newState;
        case constants.LOGIN_SUCCESS:
            newState = {
                ...state,
                loading: false,
                failed: false,
                data: action.data,
                token: action.data.accessToken
            };
            return newState;
        case constants.LOGIN_FAILURE:
            newState = {
                ...state,
                loading: false,
                failed: true,
                message: action.data
            };
            return newState;
        case constants.SET_USER_DATA:
            newState = {
                ...state,
                data: action.data
            };
            return newState;
        default:
            break;
    }
    return state;
};