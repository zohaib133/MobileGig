import Types from "../types";

const INITIAL_STATE = {
    user: null,
    location: {
        latitude: 37.78825,
        longitude: -122.4324,
    },
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case Types.Set_User:
            return { ...state, user: action.payload };
        case Types.Set_Location:
            return { ...state, location: action.payload };
        case Types.Clear_Auth:
            return { ...INITIAL_STATE }

        default:
            return state;
    }
}