import React from "react";
import {
  AsyncStorage,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  Alert,
  Modal,
  TextInput,
  Platform,
  Linking,
} from "react-native";
import { Entypo, Fontisto } from "@expo/vector-icons";
import { Form, Radio } from "native-base";
import { CheckBox, Icon, Input } from "react-native-elements";
import { connect } from "react-redux";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import CountryPicker from "react-native-country-picker-modal";
import { loginUser } from "../../actions/auth";
import BaseUrl from "../../../config/path.js";
import { WP } from "../responsive";
// var eyeicon1=false
import {
  Ten,
  Eleven,
  Tewelve,
  Twenty,
  Sixteenteen,
  Seventeen,
  Eighteen,
  Nineteen,
  Fourteenteen,
  Twentyone,
  Fifteen,
} from "../FontSizes";
import Fonts from "../../../fonts";
import theme from "../../common/theme";
import { store } from "../../store";
import { setUser } from "../../store/actions/user";
import {
  AccessToken,
  AppEventsLogger,
  LoginManager,
  Profile,
} from "react-native-fbsdk-next";
import { showErrorMsg } from "../../utilites/flashMessage.utils";
import { FbAppEvents } from "../../common/constants";

GoogleSignin.configure({
  webClientId:
    "715367300348-od7vdbe8ks6835mu8ser098gat9kfuf3.apps.googleusercontent.com",
  iosClientId:
    "715367300348-mu4dm3lsgrlrnm1aope6r3mcht89dr09.apps.googleusercontent.com",
});

var windowWidth = Dimensions.get("window").width;
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // email: __DEV__ ? "ali23@gmail.com" : "",
      // password: __DEV__ ? "123456" : "",
      // email: "ali311@gmail.com",
      // password: "123456",
      email: "",
      password: "",
      show_error: false,
      error_message: "",
      remember_me: true,
      rememberMeState: true,
      isLoading: false,
      visibility: false,
      uselocation: false,
      userid: "",
      loadingFacebookLogin: false,
      loadingGoogleLogin: false,
      isEmail: true,
      countryCode: "US",
      country: {
        callingCode: ["1"],
      },
    };
  }

  componentDidMount = async () => {
    this.handleRememberMeState();
    let user_remember = await AsyncStorage.getItem("remember_me");
    let parsed_user_remember = JSON.parse(user_remember);

    if (parsed_user_remember == true) {
      let userLogindata = await AsyncStorage.getItem("userLoginData");
      let parsedLogin = JSON.parse(userLogindata);

      if (parsedLogin.type == "provider") {
        AsyncStorage.setItem("proprofile", "protrue");
        this.props.navigation.replace("ProProfile");
      } else if (
        parsedLogin.type == "subscriber" &&
        parsedLogin.data.subscription == true
      ) {
        AsyncStorage.setItem("home", "hometrue");
        this.props.navigation.replace("Home");
      } else if (
        parsedLogin.type == "subscriber" &&
        parsedLogin.data.subscription == false
      ) {
        AsyncStorage.setItem("profile", "profiletrue");
        this.props.navigation.replace("Profile");
      } else if (parsedLogin.type == "helping_hand") {
        AsyncStorage.setItem("helpinghand", "helpinghandtrue");
        this.props.navigation.replace("HelpingHandDash");
      }
    }
  };

  handleRememberMeState = async () => {
    const rememberData = await AsyncStorage.getItem("rememberData");
    // console.log("handleRememberMeState-rememberData", rememberData)
    if (rememberData && rememberData?.length > 0) {
      try {
        const _data = JSON.parse(rememberData);
        if (_data?.rememberMeState === true) {
          this.setState(_data);
        }
      } catch (error) {
        console.log("handleRememberMeState-error", error);
      }
    }
  };

  show_error_message = () => {
    if (this.state.show_error) {
      return (
        <Text style={{ margin: 10, color: "red", textAlign: "center" }}>
          {this.state.error_message}
        </Text>
      );
    }
  };

  form_validation = () => {
    var re = /\S+@\S+\.\S+/;

    if (this.state.email === "" || this.state.password === "") {
      this.setState({
        error_message: "All Fields are required",
        show_error: true,
        isLoading: false,
      });
      return false;
    } else if (this.state.email.includes("@") && !re.test(this.state.email)) {
      this.setState({
        error_message: "Email is invalid",
        show_error: true,
        isLoading: false,
      });
      return false;
    } else {
      this.login();
    }
  };

  login = async () => {
    this.setState({ isLoading: true, show_error: false });
    const { isEmail, country, callingCode, email, password, rememberMeState } =
      this.state;
    AsyncStorage.setItem("userPassword", password);
    const formData = new FormData();
    if (isEmail) formData.append("email", email);
    else formData.append("email", `+${country.callingCode[0]}${email}`);
    formData.append("password", password);

    //console.log(formData);
    fetch(BaseUrl + "login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    })
      .then((response) => {
        console.log("login-response.status", response.status);
        return response.json();
      })
      .then(async (responseJson) => {
        store.dispatch(setUser(responseJson.data));

        if (isEmail) {
          AppEventsLogger.logEvent(FbAppEvents.LoginWithEmail);
        } else {
          AppEventsLogger.logEvent(FbAppEvents.LoginWithMobile);
        }

        if (responseJson.error === false) {
          const rememberData = {
            rememberMeState,
            isEmail,
            country,
            callingCode,
            email,
            password,
          };
          await AsyncStorage.setItem(
            "rememberData",
            JSON.stringify(rememberData)
          );
          console.log("rememberData", rememberData);
          // this.setState({ uselocation: true })
          this.storedate(responseJson);
          //// console.log(responseJson.success_msg);
          // ToastAndroid.show(responseJson.success_msg, ToastAndroid.SHORT);

          //   if (Platform.OS != 'android') {
          //     Snackbar.show({
          //         text: responseJson.success_msg,
          //         duration: Snackbar.LENGTH_SHORT,
          //     });
          // } else {
          // }

          // this.props.navigation.navigate('Home')
        } else {
          console.log("responseJson", responseJson.error_msg);
          this.setState({
            isLoading: false,
            remember_me: false,
            error_message: `Aw Shucks. ${
              isEmail ? "Email" : "Mobile number"
            } and password don't match.\nTry again`,
            show_error: true,
          });
          AsyncStorage.setItem(
            "remember_me",
            JSON.stringify(this.state.remember_me)
          );
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  UpdateuserLocation = async (id, lat, lng) => {
    const formData = new FormData();
    formData.append("subscriber_id", id);

    formData.append("latitude", lat);
    formData.append("longitude", lng);

    //console.log(formData);
    fetch(BaseUrl + "get_service_providers_by_location", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson);

        if (responseJson.error === false) {
          this.setState({ isLoading: false });
          // this.storedate(responseJson);
          //// console.log(responseJson.success_msg);
          // ToastAndroid.show(responseJson.success_msg, ToastAndroid.SHORT);
          // this.props.navigation.replace("Home");

          //   if (Platform.OS != 'android') {
          //     Snackbar.show({
          //         text: responseJson.success_msg,
          //         duration: Snackbar.LENGTH_SHORT,
          //     });
          // } else {
          // }

          // this.props.navigation.navigate('Home')
        } else {
          this.setState({ isLoading: false });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  _getLocation = async (id) => {
    this.setState({ isLoading: true });
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);

      if (status !== "granted") {
        //console.log("PERMISSION NOT GRANTED!");
        alert("Please allow Location Permission  from settings again");
        this.setState({
          error_message: "PERMISSION NOT GRANTED",
        });
      }

      const location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });
      // setLocation(location);

      // console.log(location);
      // api for get postal code from lat lng
      const resp1 = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&sensor=true&key=AIzaSyC_LWPOTamnTLKR0IVa5pX_w2Zxo9hE0Sw`
      );
      this.UpdateuserLocation(
        id,
        location.coords.latitude,
        location.coords.longitude
      );

      var postal_from_latlng = await resp1.json();
      var postal =
        postal_from_latlng.results[0].address_components[3].long_name;

      AsyncStorage.setItem("zip_code", JSON.stringify(postal));
      this.props.navigation.replace("Home");
    } catch (e) {
      this.setState({ isLoading: false });
    }
  };

  storedate = async (response, isSocail = "0") => {
    const navigation = this.props.navigation;

    this.setState({ isLoading: false });

    console.log("response" + " " + JSON.stringify(response), isSocail);
    try {
      await AsyncStorage.setItem("userLoginData", JSON.stringify(response));
      await AsyncStorage.setItem("isSocail", isSocail);
      await AsyncStorage.setItem("home_location_view", "1");

      await AsyncStorage.setItem(
        "remember_me",
        JSON.stringify(this.state.remember_me)
      );
      this.setState({ error_message: "" });
      if (response.type == "provider" && this.state.remember_me == true) {
        await AsyncStorage.setItem("proprofile", "protrue");
        this.props.navigation.replace("ProProfile");
      } else if (
        response.type == "provider" &&
        this.state.remember_me == false
      ) {
        await AsyncStorage.setItem("proprofile", "protrue");
        this.props.navigation.replace("ProProfile");
      } else if (
        response.type == "subscriber" &&
        response.data.subscription == true &&
        this.state.remember_me == true
      ) {
        await AsyncStorage.setItem("home", "hometrue");
        this.setState({ userid: response.data.id });
        this._getLocation(response.data.id);
      } else if (
        response.type == "subscriber" &&
        response.data.subscription == true &&
        this.state.remember_me == false
      ) {
        await AsyncStorage.setItem("home", "hometrue");
        this.setState({ userid: response.data.id });
        this._getLocation(response.data.id);
      } else if (
        response.type == "subscriber" &&
        response.data.subscription == false
      ) {
        await AsyncStorage.setItem("profile", "profiletrue");
        this.props.navigation.replace("Profile");
      } else if (response.type == "helping_hand") {
        await AsyncStorage.setItem("helpinghand", "helpinghandtrue");
        this.props.navigation.replace("HelpingHandDash");
      }
    } catch (e) {
      console.log("storedate-e", e);
    }
  };

  internet_connection_check = () => {
    this.form_validation();
  };

  go_to_singUp_form = () => {
    this.setState({ show_error: false });
    this.props.navigation.push("Signup");
  };

  go_to_provider_form = () => {
    this.setState({ show_error: false });
    this.props.navigation.push("ProviderProfile");
  };

  go_to_helping_form = () => {
    this.setState({ show_error: false });
    this.props.navigation.push("HelpingHand");
  };

  //   eyeicon=()=>{
  //   console.log("ccccccccccccc",eyeicon1)
  //   eyeicon1=!eyeicon1
  //   if(eyeicon1===false){

  //   return(
  //   <TouchableOpacity onPress={()=>this.eyeicon()}>
  //   <Entypo name="eye-with-line" size={24} color="grey" style={{zIndex:100}} />
  //           </TouchableOpacity>
  //   )
  //   }
  //            else if(eyeicon1===true){

  //            return(

  // <TouchableOpacity onPress={()=>this.eyeicon()}>
  //            <Entypo name="eye" size={24} color="grey" style={{zIndex:100}} />
  //            </TouchableOpacity>
  //            )
  //            }
  // }

  socialLoginAPI = async (userData) => {
    try {
      const formData = new FormData();
      formData.append("email", userData?.email);
      formData.append("first_name", userData?.first_name);
      formData.append("last_name", userData?.last_name);
      formData.append("user_name", userData?.user_name);
      formData.append("social_token", userData?.social_token);
      formData.append("social_media", userData?.social_media);
      formData.append("profile", userData?.profile);

      const response = await fetch(BaseUrl + "social_login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
      const responseJson = await response.json();

      if (responseJson.error === false) {
        AsyncStorage.setItem("userPassword", `${userData?.email}mobile`);
        this.storedate(responseJson, "1");
        ToastAndroid.show(responseJson.success_msg, ToastAndroid.SHORT);
      } else {
        console.log("error", responseJson);
        this.setState({
          isLoading: false,
          remember_me: false,
          error_message: `Aw Shucks. Something went wrong. Try again`,
          show_error: true,
        });
        AsyncStorage.setItem(
          "remember_me",
          JSON.stringify(this.state.remember_me)
        );
      }
    } catch (error) {
      console.log("socialLoginAPI-error", JSON.stringify(error));
    } finally {
      this.setState({
        loadingGoogleLogin: false,
        loadingFacebookLogin: false,
      });
    }
  };

  // facebookLoginPress = async () => {
  //   try {
  //     this.setState({ loadingFacebookLogin: true })
  //     await Facebook.initializeAsync({ appId: "347837323726059" })
  //     const { type, token } = await Facebook.logInWithReadPermissionsAsync({
  //       permissions: ["email", "public_profile"],
  //     });
  //     if (type === 'success') {
  //       // Get the user's name using Facebook's Graph API
  //       const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,email,name,first_name,last_name,picture.type(large)`);
  //       if (response.status === 200) {
  //         const jsonResponse = await response.json()
  //         console.log('facebookLoginPress-jsonResponse', jsonResponse)
  //         // Alert.alert('Logged in!', `Hi ${jsonResponse.name}!`);
  //         this.socialLoginAPI({
  //           first_name: jsonResponse?.first_name,
  //           last_name: jsonResponse?.last_name,
  //           user_name: jsonResponse?.name,
  //           email: jsonResponse?.email,
  //           social_token: token,
  //           social_media: 'facebook',
  //           profile: jsonResponse?.picture?.data?.url
  //         })
  //       }
  //     }
  //   } catch (error) {

  //   }
  //   finally {
  //     this.setState({ loadingFacebookLogin: false })
  //   }
  // }

  facebookLoginPress = async () => {
    try {
      this.setState({ loadingFacebookLogin: true });
      const permissions = await LoginManager.logInWithPermissions([
        "email",
        "public_profile",
      ]);
      if (permissions.isCancelled) {
        showErrorMsg("Login cancelled.");
        return;
      }
      const fbAccessToken = await AccessToken.getCurrentAccessToken();

      // const fbUser = await new Promise((res) => {
      //   setTimeout(() => {
      //     res(Profile.getCurrentProfile())
      //   }, 5000);
      // })

      let fbUser = await fetch(
        `https://graph.facebook.com/me?access_token=${fbAccessToken.accessToken}&fields=id,email,name,first_name,last_name,picture.type(large)`
      );

      fbUser = await fbUser.json();

      console.log("Facebook Signin Response : ", JSON.stringify(fbUser));

      await this.socialLoginAPI({
        first_name: fbUser.first_name,
        last_name: fbUser.last_name,
        user_name: fbUser.name,
        email: fbUser.email,
        social_token: fbAccessToken.accessToken,
        social_media: "facebook",
        profile: fbUser.picture.data.url,
      });
      AppEventsLogger.logEvent(FbAppEvents.LoginWithFacebook);
    } catch (error) {
      if (error) {
        showErrorMsg(JSON.stringify(error));
        console.log("Facebook Signin Error : ", JSON.stringify(error));
      }
      // Alert.alert('Daggone it. Login Failed. Try again.');
      // console.log('facebookLoginPress-error', error)
      // if (error.code == "ERR_FACEBOOK_LOGIN") {
      //   console.log('facebookLoginPress-error.code', error.code)
      // }
    } finally {
      this.setState({ loadingFacebookLogin: false });
    }
  };

  googleLoginPress = async () => {
    //Prompts a modal to let the user sign in into your application.
    try {
      console.log("googleLoginPress-call");
      await GoogleSignin.hasPlayServices({
        //Check if device has Google Play Services installed.
        //Always resolves to true on iOS.
        showPlayServicesUpdateDialog: true,
      });
      const { user } = await GoogleSignin.signIn();
      console.log("googleLoginPress-user", user);
      let imageUpdate = user.photo;
      imageUpdate = imageUpdate.replace("96", "300");
      this.socialLoginAPI({
        first_name: user?.givenName,
        last_name: user?.familyName,
        user_name: user?.name,
        email: user?.email,
        social_token: user?.auth?.idToken,
        social_media: "google",
        profile: imageUpdate,
      });
      AppEventsLogger.logEvent(FbAppEvents.LoginWithGoogle);
    } catch (error) {
      this.setState({ loadingGoogleLogin: false });
      Alert.alert("Oh Snap! Login failed. Try again.");
      console.log("google SignIn Error: " + error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User Cancelled the Login Flow");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Signing In");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play Services Not Available or Outdated");
      } else {
        console.log("Some Other Error Happened");
      }
    }
  };

  resetState = (_isEmail) => {
    this.setState({
      isEmail: _isEmail,
      error_message: "",
      show_error: false,
      email: "",
    });
  };

  render() {
    const { auth } = this.props;
    const {
      password,
      loadingFacebookLogin,
      loadingGoogleLogin,
      isEmail,
      countryCode,
    } = this.state;
    const navigate = this.props.navigation;
    return (
      <ScrollView
        style={{ width: windowWidth }}
        contentContainerStyle={{ paddingBottom: 30, backgroundColor: "white" }}
      >
        <View style={styles.container}>
          <Form>
            {/* <Content enableOnAndroid> */}
            <View
              style={{
                flex: 3,
                height: 160,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                resizeMode="contain"
                style={{
                  height: windowWidth / 2,
                  width: windowWidth / 2,
                }}
                source={require("../../../assets/splash2.png")}
              />
            </View>
            <View
              style={{
                flex: 1,
                height: 50,
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              {/* <View style={{borderWidth:2,borderColor:'orange'}}>
                <AdMobBanner
                  bannerSize="banner"
                  adUnitID={"ca-app-pub-1085296140950638/2102193239"}

                  // adUnitID={Platform.OS == "ios" ? "ca-app-pub-1085296140950638/2102193239" : "ca-app-pub-1085296140950638/6588727993"}
                  servePersonalizedAds={false}
                  onDidFailToReceiveAdWithError={(e) => {
                    
                    console.log(JSON.stringify( e))
                  }}
                />
                </View> */}
            </View>
            <View
              style={{
                flex: 1,
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: WP(Fifteen),
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Provider/Subscriber Login
              </Text>
            </View>

            <View
              style={{
                flex: 6,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {this.show_error_message()}
              <View
                style={{
                  marginTop: 10,
                  width: windowWidth - 45,
                  justifyContent: "center",
                  flexDirection: "row",
                }}
              >
                <TouchableOpacity
                  disabled={isEmail}
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() => this.resetState(true)}
                >
                  <Radio
                    disabled={isEmail}
                    onPress={() => this.resetState(true)}
                    selected={isEmail}
                    standardStyle={true}
                  />
                  <Text style={{ marginLeft: 10 }}>{"Email Login"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={!isEmail}
                  style={{
                    marginLeft: 30,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  onPress={() => this.resetState(false)}
                >
                  <Radio
                    disabled={!isEmail}
                    onPress={() => this.resetState(false)}
                    selected={!isEmail}
                    standardStyle={true}
                  />
                  <Text style={{ marginLeft: 10 }}>{"Mobile Login"}</Text>
                </TouchableOpacity>
              </View>
              {isEmail ? (
                <View style={{ marginTop: 10, width: windowWidth - 45 }}>
                  <Input
                    value={this.state.email}
                    autoCapitalize={"none"}
                    keyboardType={"email-address"}
                    autoComplete={"email"}
                    textContentType={"emailAddress"}
                    placeholder={"Email"}
                    placeholderTextColor="grey"
                    leftIcon={{
                      type: "font-awesome",
                      name: "user-circle",
                      size: 20,
                      color: "grey",
                      marginRight: 10,
                      // marginLeft: -10,
                    }}
                    onChangeText={(text) => this.setState({ email: text })}
                    maxLength={50}
                  />
                </View>
              ) : (
                <View
                  style={{
                    marginTop: 10,
                    width: windowWidth - 70,
                    height: 55,
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderBottomColor: "#9a9a9a",
                  }}
                >
                  <CountryPicker
                    theme={{ fontSize: 20 }}
                    containerButtonStyle={[
                      {
                        height: "100%",
                        justifyContent: "center",
                        minWidth: 10,
                        marginRight: 5,
                      },
                      Platform.OS === "android"
                        ? {
                            paddingBottom: 2,
                          }
                        : {},
                    ]}
                    withFilter
                    withCallingCodeButton
                    withFlagButton={false}
                    countryCode={countryCode}
                    onSelect={(_country) => {
                      this.setState({
                        country: _country,
                        countryCode: _country.cca2,
                      });
                    }}
                  />
                  <TextInput
                    style={{ flex: 1, fontSize: 20 }}
                    value={this.state.email}
                    autoCapitalize={"none"}
                    keyboardType={"phone-pad"}
                    autoComplete={"tel"}
                    textContentType={"telephoneNumber"}
                    placeholder={"Mobile"}
                    placeholderTextColor="grey"
                    onChangeText={(text) => this.setState({ email: text })}
                    maxLength={10}
                  />
                </View>
              )}
              <View style={{ marginTop: 10, width: windowWidth - 45 }}>
                <Input
                  value={password}
                  placeholder="Password"
                  placeholderTextColor="grey"
                  secureTextEntry={!this.state.visibility}
                  leftIcon={{
                    type: "font-awesome",
                    name: "lock",
                    size: 30,
                    color: "grey",
                    marginRight: 10,
                    // marginLeft: -10,
                  }}
                  maxLength={30}
                  onChangeText={(password) => this.setState({ password })}
                  rightIcon={
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({ visibility: !this.state.visibility })
                      }
                    >
                      <Entypo
                        name={this.state.visibility ? "eye-with-line" : "eye"}
                        size={24}
                        color="grey"
                        style={{ zIndex: 100 }}
                      />
                    </TouchableOpacity>
                  }
                />
              </View>
              <View
                style={{
                  flex: 1,
                  width: windowWidth - 30,
                  flexDirection: "row",
                  marginTop: 20,
                }}
              >
                <View style={{ flex: 0.5 }}>
                  <CheckBox
                    title="Remember Me"
                    checked={this.state.remember_me}
                    onPress={() => {
                      this.setState(
                        {
                          remember_me: !this.state.remember_me,
                          rememberMeState: !this.state.rememberMeState,
                        },
                        () => {
                          AsyncStorage.removeItem("rememberData");
                        }
                      );
                    }}
                    containerStyle={{
                      borderColor: "white",

                      backgroundColor: "white",
                    }}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => navigate.navigate("Forgot")}
                  style={{
                    flex: 0.5,
                    justifyContent: "center",
                    alignItems: "flex-end",
                  }}
                >
                  <Text
                    style={{
                      fontSize: WP(Tewelve),
                      fontWeight: "bold",
                      color: "orange",
                    }}
                  >
                    Forgot Password
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flex: 1.5,
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                disabled={this.state.isLoading}
                style={styles.login_btn}
                // onPress={() => this.internet_connection_check()}
              >
                {this.state.isLoading ? (
                  <ActivityIndicator color={"green"} />
                ) : (
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "white",
                      fontSize: WP(Seventeen),
                    }}
                  >
                    Login
                  </Text>
                )}
              </TouchableOpacity>
              <View style={{ marginTop: 20, flexDirection: "row" }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styles.socialLoginButton, { marginRight: 15 }]}
                  // onPress={() => {
                  //   this.facebookLoginPress()
                  // }}
                >
                  {loadingFacebookLogin ? (
                    <ActivityIndicator
                      color={"white"}
                      animating={true}
                      size={"small"}
                    />
                  ) : (
                    <Fontisto name={"facebook"} size={24} color="white" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles.socialLoginButton,
                    { backgroundColor: "white" },
                  ]}
                  // onPress={() => {
                  //   this.googleLoginPress()
                  // }}
                >
                  {loadingGoogleLogin ? (
                    <ActivityIndicator
                      color={"#166ADA"}
                      animating={true}
                      size={"small"}
                    />
                  ) : (
                    <Image
                      source={require("../../../assets/google_icon.png")}
                      style={{ width: "75%", height: "75%" }}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <View style={{ flex: 0.5, height: 20 }}></View>
            </View>
            <View
              style={{
                width: windowWidth - 45,
                marginTop: 15,
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flex: 0.45,
                  borderColor: "lightgrey",
                  borderWidth: 1,
                }}
              ></View>
              <View
                style={{
                  flex: 0.45,
                  borderColor: "lightgrey",
                  borderWidth: 1,
                }}
              ></View>
            </View>
            <View
              style={{
                flex: 2.5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  flex: 1,
                  marginTop: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              ></View>
              <View
                style={{
                  flex: 1.5,
                  marginTop: 20,
                  marginBottom: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* <PublisherBanner
                  bannerSize="banner"
                  adUnitID={"ca-app-pub-1085296140950638/2102193239"}
                  onDidFailToReceiveAdWithError={(e)=>console.warn('error'+e)}
                  onAdMobDispatchAppEvent={(e)=>console.warn(e)} /> */}

                <View style={{ flexDirection: "row", marginBottom: 10 }}>
                  <Text style={{ color: "grey", fontSize: WP(Tewelve) }}>
                    Not a subscriber?{" "}
                  </Text>
                  <TouchableOpacity onPress={() => this.go_to_singUp_form()}>
                    <Text
                      style={{
                        color: "orange",
                        textDecorationLine: "underline",
                        fontSize: WP(Tewelve),
                      }}
                    >
                      Subscribe Now
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {/* </Content> */}
          </Form>
        </View>
        {this.state.uselocation ? (
          <Modal
            animationType="none"
            transparent={true}
            visible={this.state.uselocation}
            onRequestClose={() => this.setState({ uselocation: false })}
          >
            <View style={styles.modal_container}>
              <View
                style={{
                  width: windowWidth - 50,
                  backgroundColor: "white",
                  borderRadius: 15,
                }}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => this.setState({ uselocation: false })}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginRight: 10,
                      height: windowWidth / 10,
                      alignItems: "flex-end",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        marginLeft: windowWidth / 34,
                      }}
                    >
                      Location Usage
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          uselocation: false,
                        })
                      }
                    >
                      <Icon
                        name="highlight-off"
                        containerStyle={{
                          justifyContent: "center",
                          alignItems: "flex-start",
                        }}
                        size={30}
                        color="grey"
                      />
                    </TouchableOpacity>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 15,
                        marginTop: windowWidth / 50,
                        marginHorizontal: 10,
                        textAlign: "justify",
                      }}
                    >
                      We need your current location so that you only receive
                      search results for service providers in your area. Based
                      on your location, your search results will only show those
                      providers closest to you.
                    </Text>
                    {this.state.viewmore ? (
                      <Text
                        style={{
                          fontSize: 15,
                          marginTop: windowWidth / 50,
                          marginHorizontal: 10,
                          textAlign: "justify",
                        }}
                      >
                        {" "}
                        If you wish to view service providers in another
                        location, indicate the zip code of the desired area in
                        the Change My Location, and service providers in that
                        area will appear. If you wish to view service providers
                        in your current location, click the ALLOW LOCATION
                        ACCESS button below. Otherwise, tap on this popup to
                        close it.
                      </Text>
                    ) : null}
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({ viewmore: !this.state.viewmore })
                      }
                    >
                      {this.state.viewmore ? (
                        <Text
                          style={{
                            alignSelf: "flex-end",
                            marginRight: 10,
                            fontWeight: "bold",
                            marginTop: 10,
                          }}
                        >
                          View less
                        </Text>
                      ) : (
                        <Text
                          style={{
                            alignSelf: "flex-end",
                            marginRight: 10,
                            fontWeight: "bold",
                            marginTop: 10,
                          }}
                        >
                          View more
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={{
                      alignSelf: "flex-end",
                      marginRight: 20,
                      marginVertical: 10,
                      marginBottom: 20,
                    }}
                    onPress={() =>
                      this.setState({ uselocation: false }, () =>
                        this._getLocation(this.state.userid)
                      )
                    }
                  >
                    <Text
                      style={{
                        color: "#008cff",
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      ALLOW LOCATION ACCESS
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        ) : null}
        <Text
          style={{
            textAlign: "center",
            color: "black",
            fontFamily: Fonts.medium,
            fontSize: 12,
            marginTop: 5,
            lineHeight: 21,
          }}
        >
          {"By connecting to this app, you agree to our\n"}
          <Text
            onPress={() => {
              Linking.openURL(
                "http://mobile-gigs.com/admin/privacy_policy.php"
              );
              AppEventsLogger.logEvent(FbAppEvents.PrivacyPolicyClicked);
            }}
            style={{
              textDecorationLine: "underline",
              fontFamily: Fonts.bold,
            }}
          >
            {"Privacy Policy"}
          </Text>
          {" and "}
          <Text
            onPress={() => {
              Linking.openURL("http://mobile-gigs.com/admin/tcs.php");
              AppEventsLogger.logEvent(FbAppEvents.TermsAndConditionsClicked);
            }}
            style={{
              textDecorationLine: "underline",
              fontFamily: Fonts.bold,
            }}
          >
            {"Terms & Conditions"}
          </Text>
        </Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    flexDirection: "row",
  },
  heading: {
    flex: 0.7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  container: {
    flex: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  inputField: {
    height: 50,
    width: windowWidth - 80,
    marginTop: 10,
    backgroundColor: "lightgrey",
  },
  login_btn: {
    flex: 1,
    width: windowWidth - 80,
    backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  signup_btn: {
    flex: 1,
    borderRadius: 5,
    flexDirection: "row",
    width: windowWidth - 80,
    backgroundColor: "#3c5a99",
    height: 50,
  },
  contest_button: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00B0F6",
    width: windowWidth - 45,
    marginTop: 15,
    borderRadius: 10,
    height: 50,
  },
  icon: {
    height: 50,
    width: 50,
  },
  modal: {
    height: 300,
    width: windowWidth - 50,
    backgroundColor: "white",
    borderRadius: 15,
  },
  contest_button: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00B0F6",
    width: windowWidth - 45,
    marginTop: 15,
    borderRadius: 10,
    height: 50,
  },
  modal_container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000040",
  },
  socialLoginButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#166ADA",
    borderColor: "#166ADA",
    borderWidth: 1,
  },
});

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (route, formData, additional) =>
      dispatch(loginUser(route, formData, additional)),
    setUserData: (userLoginData) => dispatch(loginUser(userLoginData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
