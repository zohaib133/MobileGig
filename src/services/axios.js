import Axios from "axios";
import Config from "../common/config";
import { store } from "../store";
// import { clearAuth } from "../store/actions/auth";
import { showErrorMsg } from "../utilites/flashMessage.utils";

const printLogs = (response) => {
  console.log(
    "\n\n******* API CALL *******",
    "\nAPI: " +
    response.request._method +
    " - " +
    response.request._url +
    " - " +
    response.status,
    "\nbody: " + (response.headers['Content-Type'] == "multipart/form-data" ? JSON.stringify(response.config.data) : response.config.data),
    "\ntoken: " + (response.config.headers.Authorization ? "Bearer..." : null),
    "\nresponse: " + JSON.stringify(response.data),
    "\n******** END *******\n"
  );
};

const instance = Axios.create({
  baseURL: Config.BASE_URL,
  timeout: 1000000,
});

instance.interceptors.request.use(
  async (config) => {
    const { token: accessToken } = store.getState().auth;
    if (accessToken) {
      config.headers["Authorization"] = "Bearer " + accessToken;
    }
    return config;
  },
  (err) => {
    Promise.reject(err);
  }
);

instance.interceptors.response.use(
  (response) =>
    new Promise(async (resolve, reject) => {
      if (!response) {
        showErrorMsg("No response from server. Please contact to support.")
        reject("No response from server. Please contact to support.")
      }
      printLogs(response);
      resolve(response.data);
    }),
  (error) =>
    new Promise(async (resolve, reject) => {
      if (error.message == "Network Error") {
        showErrorMsg(error.message)
        reject(error)
      }
      else if (!error.response) {
        reject(error)
      } else {
        printLogs(error.response);
        const resMessage = error.response.data?.message
        const resErrors = error.response.data?.errors
        const resData = error.response.data
        const resStatus = error.response.status

        if (resStatus == 500) {
          showErrorMsg("Internal server error. Please contact to support.");
        }
        else if (resErrors) {
          showErrorMsg(JSON.stringify(resErrors));
        }
        else if (typeof (resMessage) == 'string') {
          if (!resMessage.length) {
            showErrorMsg("Internal Server Error. Please contact to support. Thanks.");
          }
          else if (resMessage === "Unauthenticated.") {
            // store.dispatch(clearAuth())
            showErrorMsg("Please login first.");
          }
          else {
            showErrorMsg(resMessage);
          }
        }
        else if (resData) {
          showErrorMsg(JSON.stringify(resData));
        }
        reject({
          status:resStatus,
          response:resData
        });
      }
    })
);

export default instance;
