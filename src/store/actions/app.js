import Types from "../types"

export const setInitialStep = (payload) => {
    return {
        type: Types.Set_App_Initial_Steps,
        payload
    }
}