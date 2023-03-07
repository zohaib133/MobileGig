import Types from "../types";

const INITIAL_STATE = {
    initialSteps: {
        onBoarding: true
    },
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case Types.Set_App_Initial_Steps:
            return {
                ...state,
                initialSteps: {
                    ...state.initialSteps,
                    ...action.payload
                }
            };
        default:
            return state;
    }
}