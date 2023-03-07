import { Platform } from "react-native";
// Auth
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const SET_USER_DATA = "SET_USER_DATA";

const stripeKyes = {
  development:
    "pk_test_51HEHwhFYLzcI2ccZDFF1gdq6JQWDsRrWju4APWFFmraupKAurm2hZCnUQMALsWzZ5kSmHS1v4ikLseYhioOh1AhV00VYydy57B",
  production:
    "pk_live_51HEHwhFYLzcI2ccZwya66uNSxoZMTQU5ISSL40JnnXAlmqk6lknV7cBO1g3jPlN6BXageBZuUSbk5qtXkJoIFM6700OHalkORP",
};

const adMobsIds = {
  development: Platform.select({
    ios: "ca-app-pub-1085296140950638/2102193239",
    android: "ca-app-pub-3940256099942544/6300978111",
  }),
  production: Platform.select({
    ios: "ca-app-pub-1085296140950638/2102193239",
    android: "ca-app-pub-1085296140950638/6588727993",
  }),
};

export const addsId = __DEV__ ? adMobsIds.development : adMobsIds.production;

export const STRIPE_KEY = __DEV__
  ? stripeKyes.development
  : stripeKyes.production;
