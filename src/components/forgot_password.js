import React from 'react';
import { Image, ActivityIndicator, TouchableOpacity, Dimensions, StyleSheet, Text, View, TextInput } from 'react-native';
import { Content, Form, Label, Item, Input, Radio, } from 'native-base';
import { Icon } from 'react-native-elements'
import CountryPicker from 'react-native-country-picker-modal'

import BaseUrl from '../../config/path.js';
import { WP } from './responsive.js';
import { Eighteen, Fourteenteen, Seventeen, Tewelve, Thirteen, Twenty } from './FontSizes.js';

var windowWidth = Dimensions.get('window').width
export default class ForgotPassword extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      phone: '',
      password: '',
      show_error: false,
      error_message: '',
      status: false,
      isLoading: false,
      isEmail: true,
      countryCode: "US",
      country: {
        callingCode: ["1"]
      }
    }
  }

  componentDidMount() {
  }

  show_error_message = () => {
    if (this.state.show_error) {
      // if(this.state.status){
      //   return(
      //     <Text style={{color: 'green'}}>{this.state.error_message}</Text>
      //   )
      // }else{
      return (
        <Text style={{ color: 'red' }}>{this.state.error_message}</Text>
      )
      // }
    }
  }

  reset_password = () => {
    const {
      email,
      phone,
      country
    } = this.state

    this.setState({ isLoading: true, show_error: false })
    var data = new FormData();
    if (this.state.isEmail) {
      data.append("verify_with", "email");
      data.append("email", email);
    } else {
      data.append("verify_with", "number");
      data.append("phone", `+${country.callingCode[0]}${phone}`);
    }

    fetch(BaseUrl + 'forgot-password', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: data,

    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.error) {
          this.setState({ error_message: responseJson.error_msg, show_error: true, isLoading: false })
        }
        else {
          this.props.navigation.navigate('Verify')
        }
      })
      .catch((error) => {
        console.error(error);
      }).finally(() => {
        this.setState({ isLoading: false })
      });
  }

  form_validation = () => {
    var re = /\S+@\S+\.\S+/;
    if (this.state.isEmail) {
      if (this.state.email == '') {
        this.setState({ error_message: 'enter vaild registered email', show_error: true })
        return
      }
      else if (!re.test(this.state.email)) {
        this.setState({ error_message: 'Email is invalid', show_error: true, isLoading: false });
        return
      }
    } else {
      if (this.state.phone == '') {
        this.setState({ error_message: 'enter phone number', show_error: true })
        return
      }
    }
    this.reset_password()
  }

  login = () => {
    this.form_validation()
  }

  forgot_password = () => {
    //console.log("start Contest")
  }

  resetState = (_isEmail) => {
    this.setState({
      isEmail: _isEmail,
      error_message: "",
      show_error: false,
      email: "",
      phone: "",
    })
  }

  render() {
    const { navigate } = this.props.navigation;
    const {
      isEmail,
      countryCode,
      email,
      phone,
    } = this.state
    return (
      <View style={styles.container}>

        <View style={{ marginTop: windowWidth / 8, justifyContent: 'space-between', width: windowWidth, height: windowWidth / 9, paddingHorizontal: windowWidth / 25, flexDirection: 'row', }}>
          <View  >
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
              <Icon
                name='arrow-back'
                // containerStyle={{ justifyContent: 'center', alignItems: 'flex-start' }}
                color='grey'
                size={24}
              />
            </TouchableOpacity>
            <Text style={{ fontSize: WP(Tewelve) }}>Previous</Text>
          </View>
          <View style={{ justifyContent: 'center' }} >
            <Image
              resizeMode='contain'
              style={{
                marginRight: windowWidth / 15,
                height: windowWidth / 3.5,
                width: windowWidth / 3.5
              }}
              source={require('../../assets/splash2.png')}
            />

          </View>
          <View >

          </View>
        </View>

        <View style={{ flex: 0.6, justifyContent: 'flex-start', alignItems: 'center', marginTop: 40 }}>
          <View style={{ width: 105, borderWidth: 1, borderColor: 'lightgrey', justifyContent: 'center', alignItems: 'center' }}></View>
          <View><Text style={{ fontSize: WP(Tewelve) }}>Forgot Password</Text></View>
          <View style={{ marginTop: 2, width: 105, borderWidth: 1, borderColor: 'lightgrey' }}></View>
        </View>

        {/* <View style={styles.heading}>
          <Image
            style={{
              height :60,
              width: 60
            }}
            source={require('../../assets/logo.png')}
          />
        </View>
        <View style={{flex:1,flexDirection:'row',width: windowWidth-70}}>
          <View style={{flex:0.2}}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
              <Icon
                name='arrow-back'
                containerStyle={{justifyContent: 'center',alignItems: 'flex-start'}}
                color= 'grey' />
            </TouchableOpacity>
            <Text style={{fontSize: 10}}>Previous</Text>
          </View>
          <View style={{flex:0.6,justifyContent:'flex-start',alignItems:'center'}}>
            <View style={{width:70,borderWidth:1,borderColor:'lightgrey',justifyContent:'center',alignItems:'center'}}></View>
            <View><Text style={{fontSize: 14}}>Forgot Password</Text></View>
            <View style={{marginTop:2,width:70,borderWidth:1,borderColor:'lightgrey'}}></View>
          </View>
          <View style={{flex:0.2}}></View>
        </View> */}


        <View style={{ flex: 9, justifyContent: 'center', alignItems: 'center' }}>
          <Content enableOnAndroid>
            <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
              <Image
                style={{
                  height: 100,
                  width: 100
                }}
                source={require('../../assets/key.png')}
              />
            </View>
            <View style={{ flex: 1.5, justifyContent: 'flex-start', alignItems: 'center' }}>
              <Text style={{ fontSize: WP(Twenty), marginBottom: 5 }}>Forgot Your Password?</Text>
              <Text style={{ fontSize: WP(Tewelve) }}>Input your Email Address or Mobile Number </Text>
              <Text style={{ fontSize: WP(Tewelve) }}>And we will send you a password</Text>
              <Text style={{ fontSize: WP(Tewelve) }}>reset instructions.</Text>

            </View>
            <View style={{ flex: 6, justifyContent: 'center', alignItems: 'center' }}>
              {this.show_error_message()}
              <View style={{ marginTop: 10, width: windowWidth - 45, justifyContent: 'center', flexDirection: 'row' }}>
                <TouchableOpacity
                  disabled={isEmail}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => this.resetState(true)}>
                  <Radio
                    disabled={isEmail}
                    onPress={() => this.resetState(true)}
                    selected={isEmail}
                    standardStyle={true}
                  />
                  <Text style={{ marginLeft: 10 }}>{"Use Email"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={!isEmail}
                  style={{ marginLeft: 30, flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => this.resetState(false)}>
                  <Radio
                    disabled={!isEmail}
                    onPress={() => this.resetState(false)}
                    selected={!isEmail}
                    standardStyle={true}
                  />
                  <Text style={{ marginLeft: 10 }}>{"Use Mobile"}</Text>
                </TouchableOpacity>
              </View>
              {isEmail ?
                <Form>
                  <Item style={{ width: windowWidth - 45 }} floatingLabel>
                    <Label style={{ fontSize: WP(Thirteen), color: 'grey' }} >Email Address</Label>
                    <Input
                      keyboardType={"email-address"}
                      autoCapitalize={"none"}
                      autoComplete={"email"}
                      textContentType={"emailAddress"}
                      onChangeText={(text) => this.setState({ email: text })}
                      value={email}
                      maxLength={60}
                    />
                  </Item>
                </Form>
                :
                <View style={{
                  marginTop: 25,
                  width: windowWidth - 70,
                  height: 41,
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderBottomColor: "#9a9a9a"
                }}>
                  <CountryPicker
                    theme={{ fontSize: 16 }}
                    containerButtonStyle={{
                      height: '100%',
                      justifyContent: 'center',
                      minWidth: 10,
                      marginRight: 5
                    }}
                    withFilter
                    withCallingCodeButton
                    withFlagButton={false}
                    countryCode={countryCode}
                    onSelect={(_country) => {
                      this.setState({
                        country: _country,
                        countryCode: _country.cca2
                      })
                    }}
                  />
                  <TextInput
                    style={{ flex: 1, fontSize: 16 }}
                    value={phone}
                    autoCapitalize={"none"}
                    keyboardType={"phone-pad"}
                    autoComplete={"tel"}
                    textContentType={"telephoneNumber"}
                    placeholder={"Mobile"}
                    placeholderTextColor="grey"
                    onChangeText={(text) => this.setState({ phone: text })}
                    maxLength={10}
                  />
                </View>
              }
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              </View>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {this.state.isLoading ?
                  <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
                    <ActivityIndicator color={'green'} />
                  </View>
                  :
                  <TouchableOpacity
                    style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40, height: 50, backgroundColor: 'orange', width: windowWidth - 70 }}
                    onPress={() => this.form_validation()}>
                    <Text style={{ color: 'white', fontSize: WP(Seventeen), fontWeight: 'bold' }}>Reset Password</Text>
                  </TouchableOpacity>

                }
                <TouchableOpacity onPress={() => navigate('Login')}>
                  <Text style={{ marginTop: 10, color: 'orange', textDecorationLine: 'underline', fontSize: WP(Fourteenteen) }}>Login</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 3.5, alignItems: 'center', justifyContent: 'center' }}>
              </View>
            </View>
          </Content>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    flex: 2,
    width: windowWidth - 20,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  inputField: {
    height: 50,
    marginHorizontal: 10,
    marginVertical: 5,
    paddingLeft: 10,
    width: windowWidth - 45,
    marginHorizontal: 20,

  },
  contest_button: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00B0F6',
    width: windowWidth - 45,
    marginTop: 15,
    borderRadius: 10
  },
  icon: {
    height: 50,
    width: 50
  }

});
