import React, {Component} from "react";
import { Image, View, StatusBar, ScrollView } from "react-native";

import {
  ActivityIndicator,
  AsyncStorage,
  StyleSheet,
  Text,
  ToolbarAndroid,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  Platform
} from 'react-native';
import {Container, Button, Icon} from 'native-base'  ;
import styles from "./styles";

import {connect} from "react-redux";
import {countPageAction, closeBannerAction, openNewsOneAction} from './../actions'


//import testless from "../useful/test";
var CryptoJS = require("crypto-js");

import Modal from 'react-native-simple-modal';
import {bannerToStoreAction} from "../actions";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarSource: [],
      phpsessid: '',
      zapises: null,
      loginData: null,
      loggedIn: false,
      welcome: 'Добро пожаловать',
      itemNameLogin: 'Вход',
      ready: false,
      firstLaunch: null,
      isModalVisible: false,
      tempReady: true,
      intervalId:0,
    };

    let ttt = setInterval(() => {
      if (!this.state.ready && this.state.tempReady) {
        this.setState({tempReady: false});
      } else if (!this.state.ready && !this.state.tempReady) {
        this.logout().then(()=>{this.setState({tempReady: true, ready:true});
          Alert.alert('Ошибка','ошибка соединения с сервером');});

      } else if (this.state.ready && !this.state.tempReady) {
        this.setState({tempReady: true});
      }


      // this.setState(previousState => {
      //   return { isShowingText: !previousState.isShowingText };
      // });
    }, 10000);

    this.state.intervalId = ttt;

  }

  componentWillUnmount() {

    clearInterval(this.state.intervalId);
  }

  async getHours() {
    var ur = "http://auto-club42.ru/android/user.php?action=getHours";
    const response = await fetch(ur);
    const json = await response.json();
    if (json.status === "success") {

      await AsyncStorage.setItem('hours', json.hours);

    }
  }

  checkActualData() {


      let TDate = new Date();
      let bannerLoadDate = new Date(this.props.bannerDateTime);

      return ((TDate - bannerLoadDate < this.props.bannerTimeLimit) || (this.props.bannerTimeLimit <= 0));
  }

  async checkBanner() {
    if (this.props.bannerData) {

      if (this.checkActualData()) {
        //ok data is actual

      } else {
        //load from url
        await this.getBannerInfoFromServerAndSave();
      }

    } else {
      let asyncBannerInfo = await this.getAsyncBannerInfo();
      if (asyncBannerInfo) {
        //save to store


        this.props.bannerToStore(asyncBannerInfo);


        if (this.checkActualData()) {
          //ok data is actual

        } else {
          //load from url
            await this.getBannerInfoFromServerAndSave();

        }


      } else {
        //load from url
        await this.getBannerInfoFromServerAndSave();

      }
    }


  }

  async getAsyncBannerInfo() {
    try {
      let result = await AsyncStorage.getItem('bannerInfo');
      let json = await JSON.parse(result);
      return json;
    } catch (error) {
      console.error(error);
      return false;
    }

  }

  async setAsyncBannerInfo(bannerInfo) {
    try {
      await AsyncStorage.setItem('bannerInfo', JSON.stringify(bannerInfo));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getBannerInfoFromServer() {

    try {
      let response = await fetch('http://auto-club42.ru/android/user.php?action=getBannerData')
      const json = await response.json();
      if (json.status == 'success' )  {
        json.banner.bannerDateTime = new Date();
        return json.banner;
      } else {

        throw new Error(json.message);
      }
    } catch (err) {
      console.log(err);
      return false;
    }

  }

  async getBannerInfoFromServerAndSave() {
      let bannerInfo = await this.getBannerInfoFromServer();
      if (bannerInfo) {
          this.props.bannerToStore(bannerInfo);
          //save to asyncStore
          await this.setAsyncBannerInfo(bannerInfo);
      } else {
      }


  }

  async componentWillMount() {
    this.getHours().done();

    await this.checkBanner();
    this.props.countPage();



    const {state} = this.props.navigation;

    try {
      let result = await AsyncStorage.getItem('images');
      await this.setState({images: JSON.parse(result)});
    } catch (error) {
    }


    try {
      let result = await AsyncStorage.getItem('loginData');
      await this.setState({loginData: JSON.parse(result)});
      if (this.state.loginData != null) {
        this.setState({
          welcome: 'Добро пожаловать, ' + this.state.loginData.NAME,
          loggedIn: true,
          itemNameLogin: this.state.loginData.NAME
        });

        AsyncStorage.getItem('firstLaunch', (err, result) => {
          this.setState({firstLaunch: JSON.parse(result)});
          if (this.state.firstLaunch != null) {
            console.log('5');
            this.props.navigation.navigate('Профиль');
            //this.setState({ ready: true});
            console.log('6');
          } else {

            console.log('7');

            this.getNewPphsessid().done(() => {
              console.log('88');

              this.getPhpsessid().done(() => {
                console.log('888');
                //this.getZapis().done(()=>{
                this.getAvatars().done();
                AsyncStorage.getItem('makes', (err, result) => {
                  let ress = JSON.parse(result);
                  if (ress != null) {
                    this.setState({ready: true});
                    //this.props.countPage();
                    console.log('cool');
                  } else {
                    this.logout().done();


                  }

                });

              });


            });

          }

        }).catch((error) => {
          this.setState({ready: true});
          console.error(error);
        });


      } else {
        AsyncStorage.getItem('firstLaunch', (err, result) => {
          this.setState({firstLaunch: JSON.parse(result)});
          if (this.state.firstLaunch != null) {

            AsyncStorage.removeItem('firstLaunch', () => {
              this.setState({ready: true});
            });

          } else {
            this.setState({ready: true});
          }

        }).catch((error) => {
          console.error(error);
        });


      }
    } catch (error) {

    }





  }


  async logout() {
    await AsyncStorage.removeItem('loginData');
    await AsyncStorage.removeItem('sitelogin');
    await AsyncStorage.removeItem('pass');

  }

  async getNewPphsessid() {


    const resultsl = await AsyncStorage.getItem('sitelogin');
    const trylogin = await JSON.parse(resultsl);
    const resultpass = await AsyncStorage.getItem('pass');
    const pass = await JSON.parse(resultpass);
    if (trylogin === null || pass === null) {
      return false;
    }


    var addcount = 0;
    var blocksize = 8;
    if ((pass.length % blocksize) != 0) {
      addcount = (blocksize - (pass.length % blocksize));
    } else {
      addcount = 8;
    }


    var dataString = pass;
    //console.log(pass);
    //console.log(addcount);
    var addchar = "\0";
    if (addcount != 0) {
      for (var i = 0; i < addcount; i++) {
        dataString += addchar;
      }
    }
    let sitelogin = trylogin;
    var key_phrase = "autoclubandbizonkey";
    var keyString = "";
    var j = 0;
    for (j = 0; j < 100; j = j + 1) {
      keyString += key_phrase.charAt(j) + sitelogin.charAt(j);
    }
    var keyWordArray = CryptoJS.enc.Utf8.parse(keyString);
    var iv = '';
    var options = {
      mode: CryptoJS.mode.ECB,
      //padding: CryptoJS.pad.NoPadding,
      padding: CryptoJS.pad.Pkcs7,
      iv: iv
    };
    var encrypted = CryptoJS.TripleDES.encrypt(dataString, keyWordArray, options);
    var hexEncrypted = encrypted.ciphertext;
    var trypassword = hexEncrypted;


    //trylogin, trypassword
    var bReturn = false;
    var url_auth = "http://auto-club42.ru/android/user.php?action=auth&login=";
    var par = "&uidh=";
    var ur = url_auth + trylogin + par + trypassword;


    const response = await fetch(ur);
    const json = await response.json();
    if (json.status === "failed") {
      if (this.state.loginData != null) {

        Alert.alert('Ошибка', 'авторизации');
      }

    }
    if (json.status === "success") {

      await AsyncStorage.setItem('phpsessid', JSON.stringify(json.phpsessid));
    }
  }


  async getAvatars() {
    const result = await AsyncStorage.getItem('avatarSource');
    const res = await JSON.parse(result);
    if (res != null) {
      this.setState({avatarSource: res});
    }
  }

  async getPhpsessid() {
    const result = await AsyncStorage.getItem('phpsessid');
    const phpsessid_temp = await JSON.parse(result);
    if (phpsessid_temp != null) {
      this.setState({phpsessid: phpsessid_temp});
      console.log('phpsessid =' + phpsessid_temp)
    }
    await this.getZapis()
  }

  async getZapis() {
    if (this.state.phpsessid != '') {
      var urlZapis = "http://auto-club42.ru/android/user.php?action=getZapis&phpsessid=" + this.state.phpsessid;
      console.log("11111");
      console.log(urlZapis);

      const response = await fetch(urlZapis);
      const json = await response.json();
      console.log(json);

      if (json.status === "failed") {
        if (this.state.loginData != null) {
          //Alert.alert ('Ошибка', 'ошибка загрузки записей');
        }

      }
      if (json.status === "success") {
        //await AsyncStorage.setItem('services', JSON.stringify(json.services));

        this.setState({zapises: json.zapises});
      }

    }

  }


  /*async componentDidMount() {
      const response = await fetch(`http://auto-club42.ru/android/user.php?action=record&phpsessid=${this.state.phpsessid}&id=01fdae29-5da1-11e8-8253-00155d03af07`);
      const result = await response.json();

      if (result.status === 'success') {
          console.warn(result.data);
      }
      else
      {
          console.warn(result);
      }

    /*this.setState({ zapises: [
        { date: 'Дата', id: 1 },
        { date: 'Дата', id: 1 },
    ] });
  }*/

  rendZapis() {
    if (this.state.zapises === null || this.state.zapises.length === 0) {
      return (
        <View style={{
          height: 100,
          borderWidth: 1,
          backgroundColor: 'white',
          marginVertical: 10,
          justifyContent: 'center'
        }}>
          <Text style={{fontSize: 16, textAlign: 'center'}}>У Вас нет записей на сервис</Text>

        </View>
      );
    } else if (this.state.zapises.length > 0) {
      return (
        <View style={{
          height: 100,
          borderWidth: 1,
          backgroundColor: 'white',
          marginVertical: 10,
          justifyContent: 'center'
        }}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 16, textAlign: 'center'}}>Записи на сервис</Text>
              <View style={{ paddingHorizontal: 15 }}>
                <ScrollView horizontal style={{ flexDirection: 'row', marginTop: 10, flexWrap: 'nowrap' }}>
                    { this.state.zapises.map((item, index) => (
                        <Button
                            onPress={() => this.props.navigation.navigate('Recording', { id: item.id })}
                            title=""
                            key={index}
                            style={(index === this.state.zapises.length - 1) ? recordStyle.last : recordStyle.notLast}>
                            <Text style={{ color: '#fff' }}>{ item.date }</Text>
                        </Button>
                    )) }
                </ScrollView>
              </View>
          </View>
        </View>

      );

    }
  }

  render() {
    //this.getZapis().done();

    if (!this.state.ready) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <StatusBar hidden={true}/>
          <ActivityIndicator size={70}/>
        </View>
      );
    } else {
      return (
        <Container>
          <Image style={styles.imageContainer} source={require('../../../img/backgroundWhite.png')}/>

          <StatusBar hidden={true}/>
          <View style={{backgroundColor: '#dbdbdb', flexDirection: 'row'}}>
            {/*<Text style={styles.top_polosa}> </Text>*/}

            <Button style={{width: 56, height: 50}} transparent
                    onPress={() => this.props.navigation.navigate('DrawerOpen')}>
              <Icon name='md-menu' style={{color: '#5f5f5f'}}/>
            </Button>
            <Image
              style={styles.stretch}
              source={require('../../../img/logo.png')}
            />
          </View>
          <View style={{marginBottom: 20, backgroundColor: 'lightgray'}}>
            <Text style={{fontSize: 16, textAlign: 'center'}}>{this.state.welcome}</Text>
          </View>

          <View style={{flex: 1, justifyContent: 'space-between'}}>
            <View style={{paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
              <Button transparent style={{
                flexDirection: 'column',
                width: 170,
                height: 130,
                marginBottom: 20,
                alignSelf: "center"
              }} onPress={() => this.props.navigation.navigate('Запись на сервис')}>
                <Image
                  style={{height: 60, width: 60}}
                  source={require('../../../img/checkinservice.png')}
                />
                <Text style={styles.titleOnMain}>Запись</Text>
                <Text style={styles.titleOnMain}>на сервис</Text>
              </Button>
              <Button transparent style={{
                flexDirection: 'column',
                width: 170,
                height: 130,
                marginBottom: 20,
                alignSelf: "center"
              }} onPress={() => this.props.navigation.navigate('Вызов эвакуатора')}>
                <Image
                  style={{height: 60, width: 60}}
                  source={require('../../../img/callevacuator.png')}
                />
                <Text style={styles.titleOnMain}>Вызов</Text>
                <Text style={styles.titleOnMain}>эвакуатора</Text>
              </Button>
            </View>

            <View style={{paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
              <Button transparent style={{
                flexDirection: 'column',
                width: 170,
                height: 130,
                marginBottom: 20,
                alignSelf: "center"
              }} onPress={() => this.props.navigation.navigate('Помощь на дороге')}>
                <Image
                  style={{height: 60, width: 60}}
                  source={require('../../../img/roadassist.png')}
                />
                <Text style={styles.titleOnMain}>Помощь</Text>
                <Text style={styles.titleOnMain}>на дороге</Text>
              </Button>
              <Button transparent style={{
                flexDirection: 'column',
                width: 170,
                height: 130,
                marginBottom: 20,
                alignSelf: "center"
              }} onPress={() => this.props.navigation.navigate('Контакты')}>
                <Image
                  style={{height: 60, width: 60}}
                  source={require('../../../img/contacts.png')}
                />
                <Text style={styles.titleOnMain}>Контакты</Text>
                <Text style={styles.titleOnMain}> </Text>
              </Button>
            </View>
            <View style={{paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
              <Button transparent style={{
                flexDirection: 'column',
                width: 170,
                height: 130,
                marginBottom: 20,
                alignSelf: "center"
              }} onPress={() => this.props.navigation.navigate('Отправить отзыв')}>
                <Image
                  style={{height: 60, width: 60}}
                  source={require('../../../img/otziv.png')}
                />
                <Text style={styles.titleOnMain}>Отправить отзыв</Text>
                <Text style={styles.titleOnMain}> </Text>
              </Button>
              <Button transparent style={{
                flexDirection: 'column',
                width: 170,
                height: 130,
                marginBottom: 20,
                alignSelf: "center"
              }} onPress={() => this.props.navigation.navigate('Новости и акции')}>
                <Image
                  style={{height: 60, width: 60}}
                  source={require('../../../img/news.png')}
                />
                <Text style={styles.titleOnMain}>Новости и акции</Text>
                <Text style={styles.titleOnMain}> </Text>
              </Button>

            </View>

          </View>

          {this.rendZapis()}

          {this.props.bannerData ?
              <Modal
                  open={this.props.isModalVisible}
                  modalDidClose={() => this.props.closeBanner()}
                  modalStyle={{
                      borderRadius: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      borderWidth: 0,



                  }}>

                  <View
                      style={{
                          alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0)',
                          justifyContent: 'center'
                      }}>
                      <TouchableOpacity
                          style={styles.modalView}
                          onPress={() => {
                              this.props.closeBanner();
                          }}
                      >
                          <Icon name='md-close' style={{color: 'black',fontSize:20}}/>
                      </TouchableOpacity>



                      <TouchableHighlight
                          onPress={() => {
                              this.props.closeBanner();
                              this.props.openNewsOne();
                              this.props.navigation.navigate('Новости и акции');
                          }}
                      >
                          <Image
                              style={styles.modalImage}
                              source={{uri: this.props.bannerInfo.base64}}

                          />
                      </TouchableHighlight>


                  </View>
              </Modal>
              :
              <View/>

          }



        </Container>
      );
    }

  }
}

const recordStyle = {
    last: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
    },
    notLast: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    }
};

const mapStateToProps = state => {
  return {
    countOpened: state.countOpened,
    isModalVisible: state.isModalVisible,
    newsId: state.newsId,
    bannerData:state.bannerData,
    bannerDateTime: state.bannerDateTime,
    bannerTimeLimit: state.bannerTimeLimit,
    bannerInfo: state.bannerInfo,


  };
};

const mapDispatchToProps = dispatch => {
  return {
    countPage: () => dispatch(countPageAction()),
    closeBanner: () => dispatch(closeBannerAction()),
    openNewsOne: () => dispatch(openNewsOneAction()),
    bannerToStore: (bannerInfo) => dispatch(bannerToStoreAction(bannerInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

