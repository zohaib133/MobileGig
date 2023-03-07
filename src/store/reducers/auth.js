import Types from "../types";

const INITIAL_STATE = {
    accessToken:null
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case Types.Set_Access_Token:
            return { ...state, accessToken: action.payload };
        case Types.Clear_Auth:
            return { ...INITIAL_STATE }

        default:
            return state;
    }
}