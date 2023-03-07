import React from 'react';
import { TouchableWithoutFeedback, Modal, AsyncStorage, Linking, ToastAndroid, Image, ScrollView, TextInput, ActivityIndicator, TouchableOpacity, Dimensions, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements'
import BaseUrl from '../../config/path.js';
import withPreventDoubleClick from './withPreventDoubleClick.js';
import ListView from "deprecated-react-native-listview";
import { WP } from './responsive.js';
import { Tewelve, } from './FontSizes.js';

var windowWidth = Dimensions.get('window').width
const TouchableOpacityEx = withPreventDoubleClick(TouchableOpacity);
export default class General extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      search: true,
      name: 'Saif Abou Goura',
      membership: 'Free',
      phone_number: '123456789',
      seePrivay: false,
      modalVisible: false,
      subject: '',
      message: '',
      email: '',
      user_type: '',
    }
    this.populateList()
    this.get_data()
  }
  togglePrivacy = () => {
    // this.setState({ seePrivay: !this.state.seePrivay })
    Linking.openURL('http://mobile-gigs.com/admin/privacy_policy.php');
  }

  TCs = () => {
    Linking.openURL('http://mobile-gigs.com/admin/tcs.php');
  }

  componentDidMount() {
  }

  populateList() {
    var dataSource =
      [
        { id: 1, email: 'ahtasham@email.com', show_image: true, duration: 'Now', name: 'Bobs RV Repair', detail: 'They understood what i needed and delivered it quickly, always with an amazing attitude.He Understood what i needed and delivered it quickly 5 stars are not enough' },
        { id: 2, email: 'ahtasham1@email.com', show_image: false, duration: '1 days ago', name: 'OHN RV Repair', detail: 'They understood what i needed and delivered it quickly, always with an amazing attitude.He Understood what i needed and delivered it quickly 5 stars are not enough' },
        { id: 3, email: 'ahtasham2@email.com', show_image: true, duration: '2 days ago', name: 'Bobs RV Solar', detail: 'They understood what i needed and delivered it quickly, always with an amazing attitude.He Understood what i needed and delivered it quickly 5 stars are not enough' },
        { id: 4, email: 'ahtasham3@email.com', show_image: false, duration: '3 days ago', name: 'Ohm RV Solar', detail: 'They understood what i needed and delivered it quickly, always with an amazing attitude.He Understood what i needed and delivered it quickly 5 stars are not enough' }
      ]
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state.dataSource = ds.cloneWithRows(dataSource);
    this.state.db = dataSource
  };

  show_icon = () => {
    if (this.state.search) {
      return (
        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <Icon
            name='person'
            color='orange'
            containerStyle={{ alignItems: 'flex-start' }}
            size={40}
          />
        </View>
      )
    } else {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
          <TouchableOpacity onPress={() => this.props.navigation.push('Home')}>
            <Icon
              name='highlight-off'
              size={30}
              containerStyle={{ alignItems: 'flex-end' }}
              color='grey' />
          </TouchableOpacity>
        </View>
      )
    }
  }

  get_data = async () => {

    try {
      let userLogindata = await AsyncStorage.getItem("userLoginData");
      let parsedLogin = JSON.parse(userLogindata);

      this.setState({ user_type: parsedLogin.type, email: parsedLogin.data.email })
      //console.log("user_type :"+this.state.user_type)
    } catch (error) {
      //console.log(error.message);
    }
  }

  show_error_message = () => {
    if (this.state.show_error) {
      return (
        <Text style={{ color: 'red', textAlign: 'center' }}>{this.state.error_message}</Text>
      )
    }
  }

  show_contact_text = () => {
    if (this.state.search) {
      return (
        <View style={{ flex: 3, justifyContent: 'flex-start', alignItems: 'center', marginTop: 20 }}>
          <View style={{ width: 70, borderWidth: 1, borderColor: 'grey', justifyContent: 'center', alignItems: 'center' }}></View>
          <View><Text style={{ fontSize: WP(Tewelve), fontWeight: 'bold', color: 'orange' }}>Contact Us</Text></View>
          <View style={{ marginTop: 2, width: 70, borderWidth: 1, borderColor: 'grey' }}></View>
        </View>
      );
    } else {
      return null;
    }
  }

  show_text = () => {
    if (this.state.search) {
      return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
          <View style={{ width: 70, borderWidth: 1, borderColor: 'lightgrey', justifyContent: 'center', alignItems: 'center' }}></View>
          <View><Text style={{ fontSize: WP(Tewelve) }}>General</Text></View>
          <View style={{ marginTop: 2, width: 70, borderWidth: 1, borderColor: 'lightgrey' }}></View>
        </View>
      );
    } else {
      return null;
    }
  }

  send_message = () => {

    this.setState({ isLoading: true })
    const formData = new FormData();
    formData.append('from', this.state.email);
    formData.append('subject', this.state.subject);
    formData.append('message', this.state.message);
    fetch(BaseUrl + 'contactus', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData
    })
      .then((response) => response.json())
      .then((responseJson) => {

        //console.log(responseJson)
        if (responseJson.error == false) {

          this.setState({ isLoading: false, modalVisible: false })
          ToastAndroid.show(responseJson.success_msg, ToastAndroid.SHORT);

        }

      })
      .catch((error) => {
        console.error(error);
      });
  }

  on_previous_user = () => {
    if (this.state.user_type == 'subscriber') {
      return (
        <View>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
            <Icon
              name='arrow-back'
              containerStyle={{ justifyContent: 'center', alignItems: 'flex-start' }}
              color='grey' />
          </TouchableOpacity>
          <Text style={{ fontSize: WP(Tewelve) }}>Previous</Text>
        </View>
      )
    }

    else if (this.state.user_type == 'provider') {
      return (
        <View>


          <TouchableOpacity onPress={() => this.props.navigation.navigate('ProProfile')}>
            <Icon
              name='arrow-back'
              containerStyle={{ justifyContent: 'center', alignItems: 'flex-start' }}
              color='grey' />
          </TouchableOpacity>
          <Text style={{ fontSize: WP(Tewelve) }}>Previous</Text>

        </View>
      );
    }
    else if (this.state.user_type == 'helping_hand') {
      return (
        <View>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('HelpingHandDash')}>
            <Icon
              name='arrow-back'
              containerStyle={{ justifyContent: 'center', alignItems: 'flex-start' }}
              color='grey' />
          </TouchableOpacity>
          <Text style={{ fontSize: WP(Tewelve) }}>Previous</Text>
        </View>
      );
    }
  }

  bottom_menu = () => {
    if (this.state.user_type == 'subscriber') {
      return (
        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', }}>
          <TouchableOpacity onPress={() => this.props.navigation.push('Home')} style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
            <View >
              <Icon
                name='home'
                color='grey' />
            </View>
            <Text style={{ fontSize: WP(Tewelve), color: 'grey' }}>HOME</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => this.props.navigation.push('Resources_link')} style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
            <View>     
             <Icon name="computer" color="grey" />
            </View>
           <Text style={{ fontSize: WP(Tewelve), color: "grey" }}>Community</Text>
        </TouchableOpacity> */}
          <TouchableOpacity onPress={() => this.props.navigation.push('Favorite')} style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
            <View >
              <Icon
                name='favorite-border'
                color='grey' />
            </View>
            <Text style={{ fontSize: WP(Tewelve), color: 'grey' }}>FAVORITES</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.push('Profile')} style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
            <View >
              <Icon
                name='account-circle'
                color='orange' />
            </View>
            <Text style={{ fontSize: WP(Tewelve), color: 'orange' }}>PROFILE</Text>
          </TouchableOpacity>
        </View>
      )
    }

    else if (this.state.user_type == 'provider') {
      return (
        <View>

        </View>
      );
    }
    else if (this.state.user_type == 'helping_hand') {
      return (
        <View>

        </View>
      );
    }
  }


  contact_us = () => {
    return (
      <TouchableOpacity onPress={() => this.setState({ modalVisible: true })}>
        <View style={{ flexDirection: 'row', flex: 0.8, width: windowWidth, marginRight: 0, justifyContent: 'center', alignItems: 'center' }}>
          <Text >Contact Us </Text>
          <Icon
            name='email'
            size={20}
            color="orange"
          />
        </View>
      </TouchableOpacity>
    )
  }

  form_validation = () => {

    if (this.state.subject === '' || this.state.message === '') {
      this.setState({ error_message: 'All Fields are required', show_error: true, isContactLoading: false });
      return false;
    }
    else {

      this.send_message()
    }


  };

  show_modal_data = () => {
    return (
      <View style={styles.modal_container}>
        <View style={styles.modal}>
          <View style={{ marginRight: 10, flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => this.setState({ modalVisible: false, isLoading: false })}>
              <Icon
                name='highlight-off'
                containerStyle={{ justifyContent: 'center', alignItems: 'flex-start' }}
                size={30}
                color='grey' />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image
              resizeMode='contain'
              style={{
                height: 100,
                width: 180
              }}
              source={require('../../assets/splash2.png')}
            />
          </View>
          <View style={{ flex: 1 }}>
            {this.show_contact_text()}
          </View>
          <View style={{ flex: 1.6, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
            <Text style={{ fontSize: WP(Tewelve), marginLeft: 8 }}>We are here to be of service and to help make your experience as a nomad that much more enjoyable... wherever you are. Don't hesitate to reach out if we can be of help.</Text>

          </View>
          <View style={{ flex: 2.6, justifyContent: 'center', alignItems: 'center' }}>
            {this.show_error_message()}
            <View style={{ width: '95%', alignSelf: 'center', borderBottomWidth: 0.4 }}>
              <Text style={{ marginLeft: 5, fontWeight: 'bold' }}>Subject </Text>
              <TextInput style={{ width: '100%' }} value={this.state.password}
                onChangeText={(text) => this.setState({ subject: text })} />
            </View>
            <View style={{ width: '95%', alignSelf: 'center', borderBottomWidth: 0.4, marginTop: 10 }}>
              <Text style={{ marginLeft: 5, fontWeight: 'bold' }}>Message</Text>
              <TextInput style={{ width: '100%', }} value={this.state.password}
                onChangeText={(text) => this.setState({ message: text })} />
            </View>
          </View>
          <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
            {this.state.isLoading ?
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color={'green'} />
              </View>
              :
              <TouchableOpacity style={styles.login_btn} onPress={() => this.form_validation()}>
                <Text style={{ fontWeight: 'bold', color: 'white', fontSize: WP(Tewelve) }}>Contact Us</Text>
              </TouchableOpacity>
            }
          </View>
        </View>
      </View>
    );
  }


  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>

        <Modal
          animationType="none"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() =>
            this.setState({ modalVisible: false })
          }
        >
          <TouchableWithoutFeedback onPress={() => this.setState({ modalVisible: false })} >
            {this.show_modal_data()}
          </TouchableWithoutFeedback>
        </Modal>
        <View style={{ marginTop: windowWidth / 8, justifyContent: 'space-between', width: windowWidth, height: windowWidth / 9, paddingHorizontal: windowWidth / 25, flexDirection: 'row', }}>
          <View >
            {this.on_previous_user()}

          </View>
          <View style={{ justifyContent: 'center' }} >
            <Image
              resizeMode='contain'

              style={{

                height: windowWidth / 3.5,
                width: windowWidth / 3.5
              }}
              source={require('../../assets/splash2.png')}
            />

          </View>
          <View style={{ width: windowWidth / 4, justifyContent: 'center', alignItems: 'center' }}>
            {this.contact_us()}
          </View>
        </View>
        <View style={{ flex: 0.8, marginTop: windowWidth / 10 }}>
          {
            this.show_icon()
          }
          {this.show_text()}
        </View>


        {/* <View style={styles.heading}>
          <View style={{ flex: 0.85, justifyContent: 'flex-end' }}>
            <Image
              style={{
                height: 60,
                width: 60
              }}
              source={require('../../assets/logo.png')}
            />
          </View>
          <View style={{ flex: 0.8 }}>
            {
              this.show_icon()
            }
          </View>
          <View style={{ flexDirection: 'row', flex: 0.8, width: windowWidth, marginRight: 15, justifyContent: 'center', alignItems: 'center' }}>
            {this.contact_us()}
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', width: windowWidth - 40 }}>
        <View style={{ flex: 0.2 }}>
        {this.on_previous_user()}  
        </View>
        <View style={{ flex: 0.6 }}>
            {this.show_text()}
          </View>
          <View style={{ flex: 0.2, justifyContent: 'flex-start', alignItems: 'center' }}>
          </View>
        </View> */}


        <View style={{ flex: 8, backgroundColor: '#F0F0F0', width: windowWidth }}>
          <View style={{ flex: 4, width: windowWidth, marginTop: 10 }}>
            <ScrollView style={{ width: windowWidth }}>
              <TouchableOpacityEx onPress={() => this.props.navigation.push('ReferFriend')}>
                <View style={styles.redirectContainer}>
                  <View style={styles.redirectTextContainer}>
                    <Text style={{ fontSize: WP(Tewelve), marginBottom: 10 }}>Refer a Friend</Text>
                  </View>
                  <View style={styles.redirectIconContainer}>
                    <Icon
                      name='keyboard-arrow-right'
                      size={30}
                      color='orange'
                    />
                  </View>
                </View>
              </TouchableOpacityEx>
              <TouchableOpacityEx>
                <TouchableOpacity style={styles.redirectContainer} onPress={this.togglePrivacy}>
                  <View style={styles.redirectTextContainer}>
                    <Text style={{ fontSize: WP(Tewelve), marginBottom: 10 }}>Privacy Policy</Text>
                  </View>
                  <View style={styles.redirectIconContainer}>
                    <Icon
                      name='keyboard-arrow-right'
                      color='orange'
                      size={30}
                    />
                  </View>
                </TouchableOpacity>
              </TouchableOpacityEx>
              <TouchableOpacityEx>
                <TouchableOpacity style={styles.redirectContainer} onPress={this.TCs}>
                  <View style={styles.redirectTextContainer}>
                    <Text style={{ fontSize: WP(Tewelve), marginBottom: 10 }}>Terms and Conditions</Text>
                  </View>
                  <View style={styles.redirectIconContainer}>
                    <Icon
                      name='keyboard-arrow-right'
                      size={30}
                      color='orange'
                    />
                  </View>
                </TouchableOpacity>
              </TouchableOpacityEx>
            </ScrollView>
          </View>
          <View style={{ flex: 4, width: windowWidth }}>
          </View>
        </View>

        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {this.bottom_menu()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 8,
    backgroundColor: "lightgrey",
    width: windowWidth
  },
  container: {
    flex: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    flex: 1.5,
    flexDirection: 'row',
    width: windowWidth - 20,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  iconContainer: {
    borderRadius: 30 / 2,
    height: 30,
    width: 30,
    overflow: 'hidden',
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgrey'
  },
  icon: {
    height: 50,
    width: 50
  },
  sub_container: {
    backgroundColor: 'white', borderBottomWidth: 1, borderColor: 'grey', flex: 1, width: windowWidth, flexDirection: 'row'
  },
  sub_text_container: {
    flex: 0.9, width: windowWidth, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'
  },
  sub_text: {
    fontWeight: 'bold'
  },
  upgrade_button: {
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
    width: 90
  },
  modal: {
    height: 520,
    width: windowWidth - 50,
    backgroundColor: 'white',
    borderRadius: 15
  },
  login_btn: {
    flex: 0.5,
    width: windowWidth - 80,
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50
  },
  modal_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000040'
  },
  sub_btn_text: {
    color: 'white',
    fontWeight: 'bold'
  },
  redirectContainer: {
    backgroundColor: 'white', height: 70, flexDirection: 'row', flex: 1, width: windowWidth, borderColor: 'lightgrey', borderBottomWidth: 1
  },
  redirectTextContainer: {
    marginTop: 15, marginLeft: 10, flex: 0.7, alignItems: 'flex-start', justifyContent: 'center'
  },
  redirectIconContainer: {
    marginTop: 15, marginRight: 10, flex: 0.3, alignItems: 'flex-end', justifyContent: 'flex-start'
  }

});
