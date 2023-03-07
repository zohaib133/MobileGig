import { Dimensions, StyleSheet } from "react-native";
import Fonts from "../../fonts";

const layout = Dimensions.get("screen");

export const SCREEN_WIDTH = layout.width;
export const SCREEN_HEIGHT = layout.height;

export const Typo = StyleSheet.create({});

export const AppStyles = StyleSheet.create({
  // free camping, nomad jobs
  h1: {
    fontFamily: Fonts.semiBold,
    color: "black",
    fontSize: 19,
    alignSelf: "center",
  },
});

export const MapStyles = {
  Clear: [
    {
      elementType: "geometry.fill",
      stylers: [
        {
          lightness: 5,
        },
      ],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels",
      stylers: [
        {
          lightness: 5,
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#ecf3f4",
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#c4fdcc",
        },
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
  ],
};
