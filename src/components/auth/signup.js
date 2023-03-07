import React from "react";
import {
  Modal,
  AsyncStorage,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
  Platform,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import {
  Form,
  Label,
  Item,
  Input,
  Picker,
} from "native-base";
import CountryPicker from 'react-native-country-picker-modal'
import { CheckBox, Icon } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { AdMobBanner } from 'expo-ads-admob'

import BaseUrl from "../../../config/path.js";
import { WP } from '../responsive'
import { Eighteen, Seventeen, Tewelve, Thirteen } from "../FontSizes.js";
import { addsId } from "../../constants.js";

var windowWidth = Dimensions.get("window").width;
let riglist = [{ id: 0, name: "Type of Rig" }];
var email123 = "";

const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export default class Signup extends React.Component {

  emailUpdateRef = null
  phoneUpdateRef = null

  constructor(props) {
    super(props);
    this.state = {
      isNoChecked: true,
      // email: __DEV__ ? "ali402@gmail.com" : "",
      // password: __DEV__ ? "123456" : "",
      // confirm_password: __DEV__ ? "123456" : "",
      // username: __DEV__ ? "ali402" : "",
      // full_name: __DEV__ ? "Ali 402" : "",
      // phone: __DEV__ ? "3026319402" : "",
      email: "",
      password: "",
      confirm_password: "",
      username: "",
      full_name: "",
      phone: "",
      show_error: false,
      error_message: "",
      emailerror: "",
      phone_error: "",
      password_error: '',
      fullNameError: '',
      passwordError: '',
      usernameError: '',
      show_phone_error: "",
      isLoading: false,
      base64_str: null,
      local_image_url: null,
      rig: undefined,
      modalVisible: false,
      modalText: "",
      selected_social: "",
      twitter_url: "",
      facebook_url: "",
      in_url: "",
      youtube_url: "",
      insta_url: "",
      rv: "no",
      rig: 0,
      role: 0,
      passwordVisibility: false,
      passwordCvisibility: false,
      isfacebookurlEnter: false,
      istwitterurlEnter: false,
      isinstagramurlEnter: false,
      islinkedinurlEnter: false,
      isyoutubeurlEnter: false,
      isSocialError: '',
      countryCode: "US",
      country: {
        callingCode: ["1"]
      }
    };
    this.get_rig_types();
    this.rig_list();
  }

  rig_list = () => {
    riglist = [{ id: 0, name: "Type of Rig" }];
  };

  componentDidMount() { }

  show_error_message = () => {
    if (this.state.show_error) {
      return (
        <Text style={{ margin: 10, color: "red", textAlign: "center" }}>
          {this.state.error_message}
        </Text>
      );
    }
  };

  storedate = async (response) => {
    const { navigate } = this.props.navigation;
    try {
      await AsyncStorage.setItem("token", response.token);
      await AsyncStorage.setItem("role", response.role);

      this.props.navigation.push("Stripe");

    } catch (e) {
      console.log(e);
    }
  };

  userConsent = () => {
    Alert.alert(
      "User Consent",
      "MobileGigs needs camera permissions for uploading profile picture",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => { console.log('') }
        },
        { text: "OK", onPress: () => this._pickImage() }
      ],
      { cancelable: false }
    );
  }



  _pickImage = async () => {
    try {
      const { granted } = await ImagePicker.requestCameraRollPermissionsAsync();
      if (granted === false) {
        alert('Permission to access camera roll is required!');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        base64: true,
        quality: 0.3
      });
      if (!result.cancelled) {
        this.setState({ base64_str: result.base64 });
        this.setState({ local_image_url: result.uri, show_image: true });
      }
    } catch (error) {
      console.log('_pickImage-error', error)
    }
  };

  login_request = () => {
    const {
      username,
      email,
      password,
      phone,
      country,
      countryCode,
    } = this.state
    try {
      fetch(BasePath + "signup", {
        method: "POST",
        mode: "same-origin",
        body: JSON.stringify({
          username: this.state.username,
          email: this.state.email,
          password: this.state.password,
          full_name: this.state.full_name,
          phone: `+${country.callingCode[0]}${phone}`,
          calling_code: country.callingCode[0],
          country_code: countryCode,
          rv: this.state.rv,
          rig: this.state.rig,
          facebook: this.state.facebook_url,
          insta: this.state.insta_url,
          youtube: this.state.youtube_url,
          linkedin: this.state.in_url,
          twitter: this.state.twitter_url,
          profileimg: this.state.base64_str,
          imageStr: this.state.base64_str,
          role: 0,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          // console.log(responseJson);
          if (responseJson.status) {
            this.setState({ isLoading: false });
            this.storedate(responseJson);
          } else {
            this.setState({
              isLoading: false,
              error_message: responseJson.result.message,
              show_error: true,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (e) {
      console.log("error", e);
    }
  };

  internet_connection_check = () => {
    this.setState({ isLoading: true, show_phone_error: false, emailerror: '', password_error: '' });
    this.form_validation();
  };

  emailvalidation = async (text) => {
    email123 = text;
    this.setState({ email: text.trim(), emailerror: !re.test(text.trim()) ? "Invalid email!" : "" }, () => {
      if (this.emailUpdateRef) clearTimeout(this.emailUpdateRef)
      this.emailUpdateRef = setTimeout(() => {
        if (re.test(text.trim())) this.emailpassvalidate(text);
      }, 500);
    })
  };


  phone_validate = async () => {
    const {
      username,
      email,
      password,
      phone,
      country
    } = this.state
    var pe_data = new FormData();
    pe_data.append("phone", `+${country.callingCode[0]}${phone}`);
    fetch(BaseUrl + "subscriber_phone_validation", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      body: pe_data,
    })
      .then((response) => {
        console.log("phone_validate-status", response.status);
        return response.json()
      })
      .then((responseJson) => {
        if (responseJson.error == true) {
          console.log("phone_validate-responseJson", responseJson);
          this.setState({
            isLoading: false,
            phone_error: responseJson.error_msg,
            show_phone_error: true,
          });
        } else {
          this.setState({
            isLoading: false,
            phone_error: "",
            show_phone_error: false,
          });
        }
      })
      .catch((error) => {
        console.log("phone_validate-error", error);
      });
  };
  emailpassvalidate = (_email) => {
    console.log("emailpassvalidate-email", email123, this.state.email);
    var pe_data = new FormData();
    pe_data.append("email", _email);

    fetch(BaseUrl + "subscriber_email_validation", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      body: pe_data,
    })
      .then((response) => {
        console.log("emailpassvalidate-response.status", response.status)
        return response.json()
      })
      .then((responseJson) => {
        if (responseJson.error == true) {
          console.log("phone_validate-responseJson", responseJson);
          this.setState({
            isLoading: false,
            emailerror: responseJson.error_msg,
            show_error: true,
          });
        } else {
          this.setState({
            isLoading: false,
            emailerror: "",
            show_error: false,
          });
        }
      })
      .catch((error) => {
        console.error("emailpassvalidate-error", error);
      });
  };

  form_validation = async () => {
    const {
      full_name,
      username,
      phone,
      password,
      confirm_password,
      email,
      isFullChecked,
      isPartChecked,
      rig
    } = this.state
    // console.log("rig id " + this.state.rig);
    // var re = /\S+@\S+\.\S+/;
    await this.set_rv();
    this.setState({ isLoading: false });
    if (full_name == "") {
      this.setState({ fullNameError: "Please provide username" });
    }
    if (username == "") {
      this.setState({ usernameError: "Please provide username" });
    }
    if (email == "") {
      this.setState({ emailerror: "Please provide username" });
    } else if (!re.test(email.trim())) {
      this.setState({ emailerror: "Email is invalid" });
    }
    if (phone.length < 10) {
      this.setState({ phone_error: "phone number must be atleast 10 characters", show_phone_error: true });
    }
    if (password.length < 6) {
      this.setState({ passwordError: "Password must be atleast 6 characters long" });
    } else if (password != confirm_password) {
      this.setState({ password_error: "Password did not match" });
    }
    if (
      (isFullChecked == true || isPartChecked == true) && rig == 0) {
      this.setState({
        isLoading: false,
        error_message: "Please select Type of rig",
        show_error: true,
      });
    }
    if (
      full_name === "" ||
      email === "" ||
      username === "" ||
      phone === "" ||
      password === ""
    ) {
      this.setState({
        isLoading: false,
        error_message: "All Fields are required",
        show_error: true,
      });
    } else if (this.state.isNoChecked == true) {
      this.setState({ isLoading: true, show_error: false });
      this.check_phone_email_validation();
    }
  };

  check_phone_email_validation = () => {
    var pe_data = new FormData();
    pe_data.append("email", this.state.email);
    pe_data.append("phone", this.state.phone);

    fetch(BaseUrl + "check_email_phone", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      body: pe_data,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.error == true) {
          if (responseJson.error_msg?.includes("email")) {
            this.setState({
              isLoading: false,
              error_message: responseJson.error_msg,
              emailerror: responseJson.error_msg,
              show_error: true,
            });
          } else if (responseJson.error_msg?.includes("phone")) {
            this.setState({
              isLoading: false,
              error_message: responseJson.error_msg,
              phone_error: responseJson.error_msg,
              show_phone_error: true,
              show_error: true,
            });
          }
        } else {
          this.signup();
          this.setState({ isLoading: false, show_error: false });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  signup = async () => {
    const {
      username,
      email,
      password,
      phone,
      country,
      countryCode,
    } = this.state
    var formData = JSON.stringify({
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      full_name: this.state.full_name,
      phone: `+${country.callingCode[0]}${phone}`,
      calling_code: country.callingCode[0],
      country_code: countryCode,
      rv: this.state.rv,
      rig: this.state.rig,
      facebook: this.state.facebook_url,
      insta: this.state.insta_url,
      youtube: this.state.youtube_url,
      linkedin: this.state.in_url,
      twitter: this.state.twitter_url,
      profileimg: this.state.base64_str,
      role: 0,
    });

    this.props.navigation.push("Stripe", { data: formData });

    this.setState({ isLoading: false });
  };

  set_rv = () => {
    if (this.state.isNoChecked) {
      this.setState({ rv: "no" });
    }
    if (this.state.isFullChecked) {
      this.setState({ rv: "full" });
    }
    if (this.state.isPartChecked) {
      this.setState({ rv: "part" });
    }
  };

  forgot_password = () => {
    // console.log("start Contest");
  };
  show_url_input = () => {
    if (this.state.selected_social === "facebook") {
      return (
        <>
          <Item style={{ width: windowWidth - 90 }} floatingLabel>
            <Label style={{ fontSize: WP(Tewelve), color: "grey" }}>Paste Url</Label>
            <Input
              onChangeText={(text) => {

                let match = 'https://www.facebook.com/'
                let entertext = text.substring(0, 25)
                if (match.toLowerCase() == entertext.toLowerCase() && text.length > 24) {
                  this.setState({ facebook_url: text, isfacebookurlEnter: true, isSocialError: '' })
                } else if (text.length < 25) {
                  this.setState({ facebook_url: '', isSocialError: '' })
                } else {

                  this.setState({ facebook_url: '', isfacebookurlEnter: false, isSocialError: 'Invalid Url Entered' })
                }

              }}
            />

          </Item>

          <Text style={{ textAlign: 'center', marginTop: 10, color: 'red' }}>{this.state.isSocialError}</Text>
        </>
      );
    }

    if (this.state.selected_social === "twitter") {
      return (
        <>
          <Item style={{ width: windowWidth - 90 }} floatingLabel>
            <Label style={{ fontSize: WP(Tewelve), color: "grey" }}>Paste Url</Label>
            <Input
              onChangeText={(text) => {

                let match = 'https://twitter.com/'
                let entertext = text.substring(0, 20)
                if (match.toLowerCase() == entertext.toLowerCase() && text.length > 19) {
                  this.setState({ twitter_url: text, istwitterurlEnter: true, isSocialError: '' })
                } else if (text.length < 20) {
                  this.setState({ twitter_url: '', isSocialError: '' })
                } else {

                  this.setState({ twitter_url: '', istwitterurlEnter: false, isSocialError: 'Invalid Url Entered' })
                }

              }}

            // onChangeText={(text) =>{

            //   let match='https://twitter.com/'

            //   let entertext=text.substring(0,20)
            //   if(match.toLowerCase()==entertext.toLowerCase()){
            //     // this.setState({ facebook_url: text,isfacebookurlEnter:true })
            //     this.setState({ twitter_url: text,istwitterurlEnter:true })
            //   }else{
            //     // istwitterurlEnter(false)
            //     this.setState({istwitterurlEnter:false})

            //   }

            // }}
            />

          </Item>
          <Text style={{ textAlign: 'center', marginTop: 10, color: 'red' }}>{this.state.isSocialError}</Text>
        </>
      );
    }

    if (this.state.selected_social === "insta") {
      return (
        <>
          <Item style={{ width: windowWidth - 90 }} floatingLabel>
            <Label style={{ fontSize: WP(Tewelve), color: "grey" }}>Paste Url</Label>
            <Input
              onChangeText={(text) => {

                let match = 'https://www.instagram.com/'
                let entertext = text.substring(0, 26)
                if (match.toLowerCase() == entertext.toLowerCase() && text.length > 25) {
                  this.setState({ insta_url: text, isinstagramurlEnter: true, isSocialError: '' })
                } else if (text.length < 26) {
                  this.setState({ insta_url: '', isSocialError: '' })
                } else {

                  this.setState({ insta_url: '', isinstagramurlEnter: false, isSocialError: 'Invalid Url Entered' })
                }

              }}

            // onChangeText={(text) =>{

            //   let match='https://www.instagram.com/'

            //   let entertext=text.substring(0,26)
            //   if(match.toLowerCase()==entertext.toLowerCase()){
            //     // this.setState({ facebook_url: text,isfacebookurlEnter:true })
            //     this.setState({ insta_url: text,isinstagramurlEnter:true })
            //   }else{
            //     // istwitterurlEnter(false)
            //     this.setState({isinstagramurlEnter:false})

            //   }

            // }}

            />
          </Item>
          <Text style={{ textAlign: 'center', marginTop: 10, color: 'red' }}>{this.state.isSocialError}</Text>
        </>
      );
    }

    if (this.state.selected_social === "in") {
      return (
        <>
          <Item style={{ width: windowWidth - 90 }} floatingLabel>
            <Label style={{ fontSize: WP(Tewelve), color: "grey" }}>Paste Url</Label>
            <Input

              onChangeText={(text) => {

                let match = 'https://www.linkedin.com/'
                let entertext = text.substring(0, 25)
                if (match.toLowerCase() == entertext.toLowerCase() && text.length > 24) {
                  this.setState({ in_url: text, islinkedinurlEnter: true, isSocialError: '' })
                } else if (text.length < 25) {
                  this.setState({ in_url: '', isSocialError: '' })
                } else {

                  this.setState({ in_url: '', islinkedinurlEnter: false, isSocialError: 'Invalid Url Entered' })
                }

              }}
            //  onChangeText={(text) =>{

            //   let match='https://www.linkedin.com/'


            //   let entertext=text.substring(0,25)
            //   if(match.toLowerCase()==entertext.toLowerCase()){
            //     // this.setState({ facebook_url: text,isfacebookurlEnter:true })
            //     this.setState({ in_url: text,islinkedinurlEnter:true })
            //   }else{
            //     // istwitterurlEnter(false)
            //     this.setState({islinkedinurlEnter:false})

            //   }

            // }}


            />
          </Item>
          <Text style={{ textAlign: 'center', marginTop: 10, color: 'red' }}>{this.state.isSocialError}</Text>
        </>
      );
    }

    if (this.state.selected_social === "youtube") {
      return (
        <>
          <Item style={{ width: windowWidth - 90 }} floatingLabel>
            <Label style={{ fontSize: 14, color: "grey" }}>Paste Url</Label>
            <Input
              onChangeText={(text) => {

                let match = 'https://www.youtube.com/'
                let entertext = text.substring(0, 24)
                if (match.toLowerCase() == entertext.toLowerCase() && text.length > 23) {
                  this.setState({ youtube_url: text, isyoutubeurlEnter: true, isSocialError: '' })
                } else if (text.length < 25) {
                  this.setState({ youtube_url: '', isSocialError: '' })
                } else {

                  this.setState({ youtube_url: '', isyoutubeurlEnter: false, isSocialError: 'Invalid Url Entered' })
                }

              }}
            // onChangeText={(text) =>{

            //   let match='https://www.youtube.com/'

            // alert(match.length)
            //   let entertext=text.substring(0,24)
            //   if(match.toLowerCase()==entertext.toLowerCase()){
            //     // this.setState({ facebook_url: text,isfacebookurlEnter:true })
            //     this.setState({ youtube_url: text,isyoutubeurlEnter:true })
            //   }else{
            //     // istwitterurlEnter(false)
            //     this.setState({isyoutubeurlEnter:false})

            //   }

            // }}


            // onChangeText={(text) => this.setState({ youtube_url: text })}
            />
          </Item>
        </>
      );
    }
  };

  facebook_social = () => {
    if (this.state.facebook_url == "") {
      return (
        <TouchableOpacity
          style={styles.other_btn}
          onPress={() =>
            this.setState({
              selected_social: "facebook",
              modalText: "Facebook Handle",
              modalVisible: true,
            })
          }
        >
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              type="font-awesome"
              name="facebook"
              iconStyle={{ color: "white" }}
            />
          </View>
          <View
            style={{
              flex: 0.4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: WP(Tewelve), fontWeight: "bold" }}>
              Facebook
            </Text>
          </View>
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{
                height: 25,
                width: 25,
              }}
              source={require("../../../assets/cross.png")}
            />
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={styles.otherdis_btn}>
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon type="font-awesome" name="facebook" />
          </View>
          <View
            style={{
              flex: 0.4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: WP(Tewelve), fontWeight: "bold" }}>
              Facebook
            </Text>
          </View>
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >

            <TouchableOpacity onPress={() => this.setState({ facebook_url: "" })}>

              <Image
                style={{
                  height: 25,
                  width: 25,
                }}
                source={require("../../../assets/cross.png")}
              />
            </TouchableOpacity>

          </View>
        </View>
      );
    }
  };

  twitter_social = () => {
    if (this.state.twitter_url == "") {
      return (
        <TouchableOpacity
          style={styles.other_btn}
          onPress={() =>
            this.setState({
              selected_social: "twitter",
              modalText: "Twitter Handle",
              modalVisible: true,
            })
          }
        >
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              type="font-awesome"
              iconStyle={{ color: "white" }}
              name="twitter"
            />
          </View>
          <View
            style={{
              flex: 0.4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: WP(Tewelve), fontWeight: "bold" }}>
              Twitter
            </Text>
          </View>
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{
                height: 25,
                width: 25,
              }}
              source={require("../../../assets/cross.png")}
            />
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={styles.otherdis_btn}>
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon type="font-awesome" name="twitter" />
          </View>
          <View
            style={{
              flex: 0.4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: WP(Tewelve), fontWeight: "bold" }}>
              Twitter
            </Text>
          </View>
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity onPress={() => this.setState({ twitter_url: "" })}>

              <Image
                style={{
                  height: 25,
                  width: 25,
                }}
                source={require("../../../assets/cross.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  insta_social = () => {
    if (this.state.insta_url == "") {
      return (
        <TouchableOpacity
          style={styles.other_btn}
          onPress={() =>
            this.setState({
              selected_social: "insta",
              modalText: "Instagram Handle",
              modalVisible: true,
            })
          }
        >
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              type="font-awesome"
              iconStyle={{ color: "white" }}
              name="instagram"
            />
          </View>
          <View
            style={{
              flex: 0.4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: WP(Tewelve), fontWeight: "bold" }}>
              Instagram
            </Text>
          </View>
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{
                height: 25,
                width: 25,
              }}
              source={require("../../../assets/cross.png")}
            />
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={styles.otherdis_btn}>
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon type="font-awesome" name="instagram" />
          </View>
          <View
            style={{
              flex: 0.4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: WP(Tewelve), fontWeight: "bold" }}>
              Instagram
            </Text>
          </View>
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity onPress={() => this.setState({ insta_url: "" })}>

              <Image
                style={{
                  height: 25,
                  width: 25,
                }}
                source={require("../../../assets/cross.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  in_social = () => {
    if (this.state.in_url == "") {
      return (
        <TouchableOpacity
          style={styles.other_btn}
          onPress={() =>
            this.setState({
              selected_social: "in",
              modalText: "Linked In Profile",
              modalVisible: true,
            })
          }
        >
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              type="font-awesome"
              iconStyle={{ color: "white" }}
              name="linkedin"
            />
          </View>
          <View
            style={{
              flex: 0.4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: WP(Tewelve), fontWeight: "bold" }}>
              Linkedin
            </Text>
          </View>
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{
                height: 25,
                width: 25,
              }}
              source={require("../../../assets/cross.png")}
            />
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={styles.otherdis_btn}>
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon type="font-awesome" name="linkedin" />
          </View>
          <View
            style={{
              flex: 0.4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: WP(Tewelve), fontWeight: "bold" }}>
              Linkedin
            </Text>
          </View>
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity onPress={() => this.setState({ in_url: "" })}>
              <Image
                style={{
                  height: 25,
                  width: 25,
                }}
                source={require("../../../assets/cross.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  youtube_social = () => {
    if (this.state.youtube_url == "") {
      return (
        <TouchableOpacity
          style={styles.other_btn}
          onPress={() =>
            this.setState({
              selected_social: "youtube",
              modalText: "Youtube Channel",
              modalVisible: true,
            })
          }
        >
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              type="font-awesome"
              iconStyle={{ color: "white" }}
              name="youtube"
            />
          </View>
          <View
            style={{
              flex: 0.4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: WP(Tewelve), fontWeight: "bold" }}>
              Youtube
            </Text>
          </View>
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{
                height: 25,
                width: 25,
              }}
              source={require("../../../assets/cross.png")}
            />
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={styles.otherdis_btn}>
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon type="font-awesome" name="youtube" />
          </View>
          <View
            style={{
              flex: 0.4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: WP(Tewelve), fontWeight: "bold" }}>
              Youtube
            </Text>
          </View>
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity onPress={() => this.setState({ youtube_url: "" })}>

              <Image
                style={{
                  height: 25,
                  width: 25,
                }}
                source={require("../../../assets/cross.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };


  show_modal_data = () => {
    return (
      <View style={styles.modal_container}>
        <View style={styles.modal}>
          <View
            style={{
              marginRight: 10,
              flex: 1,
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => this.setState({ modalVisible: false })}
            >
              <Icon
                name="highlight-off"
                containerStyle={{
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
                color="grey"
              />
            </TouchableOpacity>
          </View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontWeight: "bold", fontSize: WP(Eighteen) }}>
              {this.state.modalText}
            </Text>
          </View>
          <View
            style={{
              flex: 1.5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Form>{this.show_url_input()}</Form>
          </View>
          <View
            style={{
              flex: 1.5,
              justifyContent: "center",
              alignItems: "center",
            }}
          ></View>
        </View>
      </View>
    );
  };

  onValueChange(value) {
    this.setState({
      rig: value,
    });
  }

  showrigs = () => {
    if (this.state.show_rig_types) {
      return this.state.rig_temp_list.map((item, key) => {
        return <Picker.Item key={item.id} label={item.name} value={item.id} />;
      });
    } else {
      return null;
    }
  };

  get_rig_types = () => {
    // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

    try {
      fetch(BaseUrl + "rigs", {
        method: "GET",
        mode: "same-origin",
      })
        .then((response) => response.json())
        .then((responseJson) => {
          responseJson.rigs.map((item, key) => {
            riglist.push({ id: item.id, name: item.name });
          });

          this.setState({ rig_temp_list: riglist });
          // console.log("rig List " + this.state.rig_temp_list[0].name);

          // console.log(responseJson);
          this.setState({ rigdata: responseJson.rigs, show_rig_types: true });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (e) {
      console.log("error", e);
    }
  };

  phone_format = async (value) => {
    var v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    var matches = v.match(/\d{4,12}/g);
    var match = (matches && matches[0]) || "";
    var parts = [];
    for (var i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      var vv = parts.join("");
      // console.log(vv);
      await this.setState({ phone: vv });
      this.phone_validate()

      // alert('a')

      return vv;
    } else {
      var vv = value;
      // console.log(vv);
      await this.setState({ phone: vv });
      // this.phone_validate()
      // alert('z')

      return vv;
    }
  };

  bannerError(e) {
    // console.log(e);
  }

  rigs_drop_down = () => {
    if (this.state.isFullChecked == true || this.state.isPartChecked == true) {
      return (
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "lightgrey",
            width: windowWidth - 30,
            height: 40,
          }}
        >
          <Picker
            mode="dropdown"
            iosIcon={<Icon active name="arrow-drop-down" color="orange" />}
            placeholder="Type of Rig"
            placeholderStyle={{ color: "grey", fontSize: WP(Tewelve) }}
            placeholderTextColor="grey"
            selectedValue={this.state.rig}
            onValueChange={this.onValueChange.bind(this)}
          >
            {this.showrigs()}
          </Picker>
        </View>
      );
    } else {
      return (
        <View
          style={{
            borderBottomWidth: 0,
            borderBottomColor: "white",
            height: 0,
          }}
        ></View>
      );
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    const {
      countryCode
    } = this.state
    return (
      <ScrollView style={{ width: windowWidth }}>
        {/* <Content enableOnAndroid> */}
        <Form>
          <Modal
            animationType="none"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => this.setState({ modalVisible: false })}
          >
            {this.show_modal_data()}
          </Modal>
          <View style={styles.container}>
            <View style={{ flex: 2, flexDirection: "row", height: 120 }}>
              <View
                style={{
                  flex: 1.2,
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
              >

                <Image
                  resizeMode='contain'
                  style={{
                    height: 80,
                    width: 100,
                  }}
                  source={require("../../../assets/splash2.png")}
                />
              </View>

              <View
                style={{
                  flex: 0.8,
                  width: windowWidth,
                  marginRight: 15,
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("Login")}
                >
                  <Icon name="highlight-off" color="grey" />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flex: 0.8,
                height: 40,
                width: windowWidth - 45,
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* <Text style={{ color: 'white', fontSize: 22 }}>Banner</Text> */}
              <View style={{ borderWidth: 2, borderColor: 'orange' }}>
                <AdMobBanner
                  bannerSize="banner"
                  servePersonalizedAds={false}
                  adUnitID={addsId}
                  onDidFailToReceiveAdWithError={(e) => console.log(e)}
                />
              </View>
            </View>
            <View
              style={{
                flex: 1,
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Text style={{ fontSize: WP(Tewelve) }}>
                Already subscribed? Click here to{" "}
              </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Login")}
              >
                <Text
                  style={{
                    textDecorationLine: "underline",
                    color: "orange",
                    fontSize: WP(Tewelve),
                    textAlign: "center",
                  }}
                >
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 0.6,
                marginTop: 10,
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 150,
                  borderWidth: 1,
                  borderColor: "lightgrey",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></View>
              <View>
                <Text style={{ fontSize: WP(Tewelve), fontWeight: "bold" }}>
                  Subscriber Profile
                </Text>
              </View>
              <View
                style={{
                  marginTop: 3,
                  width: 150,
                  borderWidth: 1,
                  borderColor: "lightgrey",
                }}
              ></View>
            </View>
            <View
              style={{
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={() => this.userConsent()}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 80,
                  height: 80,
                  borderRadius: 80 / 2,
                  backgroundColor: "#F0F0F0",
                  overflow: "hidden",
                }}
              >
                <View>
                  {!this.state.show_image ? (
                    <Image
                      style={{ height: 40, width: 40 }}
                      source={require("../../../assets/icon.png")}
                    />
                  ) : (
                    <Image
                      source={{ uri: this.state.local_image_url }}
                      style={{ width: 40, height: 40 }}
                    />
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.userConsent()}>
                <Icon
                  active
                  name="add-circle"
                  iconStyle={{
                    position: "relative",
                    left: 30,
                    top: -30,
                    color: "orange",
                  }}
                />
              </TouchableOpacity>
              <Text
                style={{
                  position: "relative",
                  top: -20,

                  textAlign: "center",
                  fontSize: WP(Tewelve)
                }}
              >
                Upload Profile Picture
              </Text>
            </View>
            <View
              style={{
                position: "relative",
                top: -30,
                flex: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Item style={{ width: windowWidth - 45 }} floatingLabel>
                <Label style={{ fontSize: WP(Thirteen), color: "grey" }}>
                  Full Name
                </Label>
                <Input
                  style={{ fontSize: WP(Thirteen), }}
                  value={this.state.full_name}
                  onChangeText={(text) => this.setState({ full_name: text, fullNameError: "" })}
                  maxLength={30}
                />
              </Item>
              {this.state.fullNameError == "" ? null :
                <Text style={{ color: "red", alignSelf: 'center', marginTop: 5 }}>
                  {this.state.fullNameError}
                </Text>
              }
              <Item style={{ width: windowWidth - 45 }} floatingLabel>
                <Label style={{ fontSize: WP(Thirteen), color: "grey" }}>
                  Username
                </Label>
                <Input
                  style={{ fontSize: WP(Thirteen), }}
                  value={this.state.username}
                  onChangeText={(text) => this.setState({ username: text, usernameError: "" })}
                  maxLength={30}
                />
              </Item>
              {this.state.usernameError == "" ? null :
                <Text style={{ color: "red", alignSelf: 'center', marginTop: 5 }}>
                  {this.state.usernameError}
                </Text>
              }
              {/* <Item style={{ width: windowWidth - 45 }} floatingLabel>
                <Label style={{ fontSize: WP(Tewelve), color: "grey" }}>
                  Mobile Number
                </Label>
                <Input
                  value={this.state.phone}
                  keyboardType="numeric"
                  onChangeText={(text) => this.phone_format(text)}
                  maxLength={30}
                />
              </Item> */}
              <Item style={{ width: windowWidth - 45 }} floatingLabel>
                <Label style={{ fontSize: WP(Thirteen), color: "grey" }}>Email</Label>
                <Input
                  style={{ fontSize: WP(Thirteen), }}
                  value={this.state.email}
                  keyboardType={"email-address"}
                  autoCapitalize={"none"}
                  autoComplete={"email"}
                  textContentType={"emailAddress"}
                  onChangeText={(text) => this.emailvalidation(text)}
                />
              </Item>
              {this.state.emailerror == "" ? null :
                <Text style={{ color: "red", alignSelf: 'center', marginTop: 5 }}>
                  {this.state.emailerror}
                </Text>
              }
              <View style={{
                marginTop: 20,
                width: windowWidth - 55,
                height: 41,
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderBottomColor: "#dcdcdc"
              }}>
                <CountryPicker
                  theme={{ fontSize: WP(Thirteen) }}
                  containerButtonStyle={[{
                    height: '100%',
                    justifyContent: 'center',
                    minWidth: 10,
                    marginRight: 5
                  }, Platform.OS === "android" ? {
                    paddingBottom: 3
                  } : {}]}
                  withFilter
                  withCallingCodeButton
                  withFlagButton={false}
                  countryCode={countryCode}
                  onSelect={(_country) => {
                    console.log("onSelect-_country", _country)
                    this.setState({
                      country: _country,
                      countryCode: _country.cca2
                    })
                  }}
                />
                <TextInput
                  style={{ flex: 1, fontSize: WP(Thirteen) }}
                  value={this.state.phone}
                  autoCapitalize={"none"}
                  keyboardType={"phone-pad"}
                  autoComplete={"tel"}
                  textContentType={"telephoneNumber"}
                  placeholder={"Mobile"}
                  placeholderTextColor="grey"
                  onChangeText={(text) => {
                    this.setState({ phone: text, show_phone_error: text.length < 10, phone_error: "phone number must be atleast 10 characters" }, () => {
                      if (this.phoneUpdateRef) clearTimeout(this.phoneUpdateRef)
                      this.phoneUpdateRef = setTimeout(() => {
                        this.phone_validate()
                      }, 500);
                    })
                  }}
                  maxLength={10}
                />
              </View>
              {this.state.show_phone_error == true ?
                <Text style={{ color: "red" }}>{this.state.phone_error}</Text>
                : null
              }
              <View
                style={{
                  width: windowWidth - 45,
                  flexDirection: "row",
                  marginLeft: -15,
                }}
              >
                <Item style={{ width: windowWidth - 80 }} floatingLabel>
                  <Label style={{ fontSize: WP(Thirteen), color: "grey" }}>
                    Password
                  </Label>
                  <Input
                    style={{ fontSize: WP(Thirteen), }}
                    value={this.state.password}
                    secureTextEntry={!this.state.passwordVisibility}
                    onChangeText={(password) =>
                      this.setState({ password: password, passwordError: "" })
                    }
                    maxLength={30}
                  />
                </Item>
                <TouchableOpacity
                  style={{ alignSelf: "flex-end", marginLeft: 5 }}
                  onPress={() =>
                    this.setState({
                      passwordVisibility: !this.state.passwordVisibility,
                    })
                  }
                >
                  <Entypo
                    name={
                      this.state.passwordVisibility ? "eye" : "eye-with-line"
                    }
                    size={24}
                    color="grey"
                    style={{ zIndex: 100, alignSelf: "flex-end" }}
                  />
                </TouchableOpacity>
              </View>
              {this.state.passwordError == "" ? null :
                <Text style={{ color: "red", alignSelf: 'center', marginTop: 5 }}>
                  {this.state.passwordError}
                </Text>
              }
              <View
                style={{
                  width: windowWidth - 45,
                  flexDirection: "row",
                  marginLeft: -15,
                }}
              >
                <Item style={{ width: windowWidth - 80 }} floatingLabel>
                  <Label style={{ fontSize: WP(Thirteen), color: "grey" }}>
                    Confirm Password
                  </Label>
                  <Input
                    style={{ fontSize: WP(Thirteen), }}
                    value={this.state.confirm_password}
                    secureTextEntry={!this.state.passwordCvisibility}
                    onChangeText={(password) => {
                      if (this.state.password.includes(password)) {
                        this.setState({ confirm_password: password, password_error: '' })
                      }
                      else {
                        this.setState({ password_error: 'password does not match' })
                        // alert('password is incorrect')
                      }

                    }}
                    maxLength={30}
                  />
                </Item>
                <TouchableOpacity
                  style={{ alignSelf: "flex-end", marginLeft: 5 }}
                  onPress={() =>
                    this.setState({
                      passwordCvisibility: !this.state.passwordCvisibility,
                    })
                  }
                >
                  <Entypo
                    name={
                      this.state.passwordCvisibility ? "eye" : "eye-with-line"
                    }
                    size={24}
                    color="grey"
                    style={{ zIndex: 100, alignSelf: "flex-end" }}
                  />
                </TouchableOpacity>
              </View>
              {this.state.password_error == '' ? null
                :
                <Text style={{ color: 'red', textAlign: 'center' }}>{this.state.password_error}</Text>
              }

              <View style={{ marginLeft: 10, marginTop: 5, flex: 1 }}>
                <Text style={{ fontSize: WP(Thirteen), fontWeight: "bold" }}>
                  RV Nomad?
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  width: windowWidth - 10,
                  flexDirection: "row",
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                }}>
                <CheckBox
                  checked={this.state.isNoChecked}
                  checkedColor="orange"
                  uncheckedColor="orange"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  title="No"
                  textStyle={{ fontSize: WP(Thirteen), color: "grey" }}
                  onPress={() =>
                    this.setState({
                      isNoChecked: !this.state.isNoChecked,
                      isFullChecked: false,
                      isPartChecked: false,
                    })
                  }
                  containerStyle={{
                    backgroundColor: "white",
                    borderColor: "white",
                    paddingHorizontal: 0,
                  }}
                />
                <CheckBox
                  checked={this.state.isFullChecked}
                  checkedColor="orange"
                  uncheckedColor="orange"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  title="Full Time"
                  textStyle={{ fontSize: WP(Thirteen), color: "grey" }}
                  onPress={() =>
                    this.setState({
                      isFullChecked: !this.state.isFullChecked,
                      isNoChecked: false,
                      isPartChecked: false,
                    })
                  }
                  containerStyle={{
                    backgroundColor: "white",
                    borderColor: "white",
                    paddingHorizontal: 0,
                  }}
                />
                <CheckBox
                  checked={this.state.isPartChecked}
                  checkedColor="orange"
                  uncheckedColor="orange"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  title="Part Time"
                  textStyle={{ fontSize: WP(Thirteen), color: "grey" }}
                  onPress={() =>
                    this.setState({
                      isPartChecked: !this.state.isPartChecked,
                      isNoChecked: false,
                      isFullChecked: false,
                    })
                  }
                  containerStyle={{
                    backgroundColor: "white",
                    borderColor: "white",
                    paddingHorizontal: 0,
                  }}
                />
              </View>
              <View style={{ width: windowWidth - 30 }}>
                {this.rigs_drop_down()}
              </View>
              <View style={{ marginLeft: 10, marginTop: 15, flex: 1 }}>
                <Text style={{ fontSize: WP(Tewelve), fontWeight: "bold" }}>
                  Share Media Links
                </Text>
              </View>
              <View
                style={{
                  flex: 1.5,
                  marginTop: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                {this.facebook_social()}
                <View style={{ width: 5 }}></View>
                {this.twitter_social()}
              </View>
              <View
                style={{
                  flex: 1.5,
                  marginTop: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                {this.insta_social()}
                <View style={{ width: 5 }}></View>
                {this.in_social()}
              </View>
              <View
                style={{
                  flex: 1.5,
                  marginTop: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                {this.youtube_social()}
                <View style={{ flex: 1, width: 40 }}></View>
              </View>

              {this.show_error_message()}
            </View>
            <View
              style={{
                flex: 1.5,
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {this.state.isLoading ? (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <ActivityIndicator color={"green"} />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.login_btn}
                  onPress={this.internet_connection_check}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "white",
                      fontSize: WP(Seventeen),
                    }}
                  >
                    Next
                  </Text>
                </TouchableOpacity>
              )}
              <View style={{ flex: 0.5, height: 20 }}></View>
            </View>
          </View>
        </Form>
        {/* </Content> */}
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
  other_btn: {
    flex: 1,
    width: 40,
    backgroundColor: "orange",
    height: 50,
    flexDirection: "row",
  },
  otherdis_btn: {
    flex: 1,
    width: 40,
    backgroundColor: "lightgrey",
    height: 50,
    flexDirection: "row",
  },
  signup_btn: {
    flex: 1,
    width: windowWidth - 80,
    backgroundColor: "navy",
    alignItems: "center",
    justifyContent: "center",
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
  modal: {
    height: 300,
    width: windowWidth - 40,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modal_container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000040",
  },
  icon: {
    height: 50,
    width: 50,
  },
});
