import { showMessage } from "react-native-flash-message"
import theme from "../common/theme"

export const showErrorMsg = message =>
  showMessage({
    message,
    type: "danger",
  })

export const showSuccessMsg = message =>
  showMessage({
    message,
    type: "success",
    backgroundColor:theme.primary,
  })

export const showWarningMsg = message =>
  showMessage({
    message,
    type: "warning",
  })

export const showInfoMsg = message =>
  showMessage({
    message,
    type: "none",
  })