import axios from "./axios";
import Config from "../common/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../store";

// businesses related to sub-categories
export const getBusinesses = async (payload) => {
  const user = store.getState().user.user;
  payload.subscriber_id = user.id;
  return await axios.post(`/services`, payload);
};

export const getReviews = async (business_id) => {
  return await axios.get(`/provider/${business_id}/reviews`);
};

export const searchBusinesses = async (payload) => {
  const user = store.getState().user.user;
  payload.subscriber_id = user.id;
  return await axios.post(`/search`, payload);
};

export const toggleFavourite = async (payload) => {
  const user = store.getState().user.user;
  payload.subscriber_id = user.id;
  return await axios.post(`/add-to-favorites`, payload);
};

export const getFavourites = async () => {
  const user = store.getState().user.user;
  return await axios.post(`/favs`, {
    email: user.email,
  });
};

// using in some specific sub-categories
export const getYelpBusinesses = async (payload) => {
  return await axios.get(`/businesses/search`, {
    params: payload,
    baseURL: Config.YELP_BASE_URL,
    headers: {
      Authorization: `Bearer ${Config.YELP_API_KEY}`,
    },
  });
};

export const getYelpReviews = async (business_id) => {
  return await axios.get(`/businesses/${business_id}/reviews`, {
    baseURL: Config.YELP_BASE_URL,
    headers: {
      Authorization: `Bearer ${Config.YELP_API_KEY}`,
    },
  });
};

export const getSubCategories = async (category_id) => {
  return await axios.get(`/category/${category_id}/services`);
};

export const getHelpingHandReviews = async (helping_hand_id) => {
  return await axios.get(`helping/${helping_hand_id}/reviews`);
};
