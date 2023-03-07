
import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, AsyncStorage } from 'react-native';
import { SplashAnimatedIcon } from '../../assets';

const { width: screenWidth } = Dimensions.get("window")

const logoDimension = screenWidth * 0.90

export default class App extends Component {
  constructor() {
    super()

    this.navigate12()
  }

  navigate12 = async () => {
    // await AsyncStorage.clear()
    const proprofile = await AsyncStorage.getItem("proprofile")
    const home = await AsyncStorage.getItem("home")
    const profile = await AsyncStorage.getItem("profile")
    const helpinghand = await AsyncStorage.getItem("helpinghand")
    setTimeout(() => {

      if (proprofile == "protrue") {
        //console.log("proprofile")
        this.props.navigation.replace('ProProfile');

      }
      else if (home == "hometrue") {
        //console.log("home")
        this.props.navigation.replace('Home');

      }
      else if (profile == "profiletrue") {
        //console.log("profiletrue")
        this.props.navigation.replace('Profile');

      }
      else if (helpinghand == "helpinghandtrue") {
        //console.log("helping")
        this.props.navigation.replace('HelpingHandDash');

      }
      else {
        //console.log("login")
        this.props.navigation.replace('Login');
      }


    }, 5000);
  }


  // componentDidMount=async()=>{
  //   const loading  =  await AsyncStorage.getItem("loading")
  //   if (loading == 'true'){
  //     this.props.navigation.navigate("drawer")
  //   }
  //   else {
  //     const loading  =  await AsyncStorage.getItem("loading")
  //       //console.log("asyncstoarge is",loading)
  //       this.props.navigation.navigate("login")

  //   }
  // }
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{ height: logoDimension / 2, width: logoDimension }}
          source={SplashAnimatedIcon}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4d5b4',
    alignItems: 'center',
    justifyContent: 'center',
  },
});