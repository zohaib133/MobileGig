import Types from "../types"

export const setAccessToken = (payload) => {
    return {
        type: Types.Set_Access_Token,
        payload
    }
}

export const clearAuth = () => {
    return {
        type: Types.Clear_Auth,
    }
}