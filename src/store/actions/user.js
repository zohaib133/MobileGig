import Types from "../types"

export const setUser = (payload) => {
    return {
        type: Types.Set_User,
        payload
    }
}

export const setLocation = (payload) => {
    return {
        type: Types.Set_Location,
        payload
    }
}