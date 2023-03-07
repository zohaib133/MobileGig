import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { Feather, Ionicons } from "../../../../../../../../assets/vectorIcons"
import Fonts from "../../../../../../../../fonts"
import theme from "../../../../../../../common/theme"

const NestedText = ({
    text1,
    text2
}) => {
  return (
    <Text
      style={{
        color: "black",
        fontSize: 15,
        fontFamily: Fonts.semiBold,
        marginHorizontal: 5
      }}>
      {text1 + " "}
      <Text
        style={{
          fontFamily: Fonts.regular,
          fontSize: 10
        }}>
        {text2}
      </Text>
    </Text>
  )
}

const DistanceCard = ({
    distance = {
        text1:"",
        text2:""
    },
    time = {
        text1:'',
        text2:""
    },
    onClosePress
}) => {
  return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 8,
          paddingLeft:15,
          borderWidth:0.5,
          borderColor:"grey"
        }}>
        <View
          style={{
            flexGrow: 1
          }}>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center"
            }}>
            <NestedText
            text1={distance.text1}
            text2={distance.text2}
            />
            <NestedText
            text1={time.text1}
            text2={time.text2}
            />
          </View>
          <View
            style={{
              backgroundColor: theme.primary,
              height: 10,
              borderRadius: 10,
              marginTop: 8,
              justifyContent: "center"
            }}>
            <View
              style={{
                width: 15,
                height: 15,
                backgroundColor: "white",
                borderWidth: 2,
                borderColor: "black",
                borderRadius: 50,
                position: "absolute"
              }}
            />
          </View>
        </View>
        <TouchableOpacity
        onPress={onClosePress}
          style={{
            paddingHorizontal: 13
          }}>
          <Feather name="x" size={24} color="grey" />
        </TouchableOpacity>
      </View>
  )
}

export default DistanceCard