import React, { Component } from "react";
import { Image, View, StatusBar, TouchableOpacity, Keyboard } from "react-native";
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { ActivityIndicator, AsyncStorage, TextInput, StyleSheet, Text, ToolbarAndroid,  Alert, TouchableHighlight, Platform } from 'react-native';
import {Input, Label, Item, Container, Button, Icon} from 'native-base'  ;
import {TextInputMask} from 'react-native-masked-text';
import styles from "./styles";

var CryptoJS = require("crypto-js");





class ChangePass1 extends Component {

  
  constructor(props) {
    super(props);
    this.state = {
      ready:false,
      loginNumber:'+7-',
      kaptchaCode:'',
      captcha:'',
      };

  }

  async getCaptcha() {
    var urlServices = "http://auto-club42.ru/android/user.php?action=register";
    const response = await fetch(urlServices);
    const json = await response.json();
    this.setState({captcha:json.captcha});
  }

  async checkCaptcha() {
    temp = this.state.loginNumber;
    var userphone =  temp.substring(2).replace(/[^0-9]/g, '');
    var code = this.state.kaptchaCode;
    var sid = this.state.captcha;
    var url_checkcaptcha = "http://auto-club42.ru/android/user.php?action=changepasscheck&phone=" + 
          userphone + "&code=" + code + "&sid=" + sid;
    console.log(url_checkcaptcha);
    const response = await fetch(url_checkcaptcha);
    const json = await response.json();
    if (json.status == 'success') {
      console.log(json);
      //
      this.setChange1InStorage({
        phonereg: userphone,
        codereg: code,
        sidreg: sid,
        userid: json.userid,
      }).done();
      return true;
    } else {
      Alert.alert('Ошибка','неверная капча');
      this.setState({kaptchaCode:''});
      this.getCaptcha().done();
      return false;
    }
  }

  async setChange1InStorage(reg1) {
    await AsyncStorage.setItem('change1', JSON.stringify(reg1));
  }

  clear () {
    this.setState({ loginNumber: '+7-'});
  }


  register1() {
    if (this.state.loginNumber.length != 15) {
        Alert.alert('телефон','введите полностью номер телефона');
        this.getCaptcha().done();
        return;
    }

    if (this.state.loginNumber[3] != "9") {
        alert("Введите корректный телефон, первая цифра 9");
        this.getCaptcha().done();
        return;
    }    


   this.setState({ready: false});
   this.checkCaptcha().then(v => {
    console.log(v)
    if (v) {
      Keyboard.dismiss();
      this.props.navigation.navigate('ChangePass2');
    } else {
      this.setState({ready: true});
    }

   });

    
  }

  componentWillMount() {
    this.getCaptcha().done(()=>this.setState({ready:true}))

  }

  render() {
    if (this.state.ready) {

    

      return (
        <Container>
            <StatusBar hidden= { true } />
            <View style={{ backgroundColor: '#dbdbdb', flexDirection: 'row'}}>

              <Button style={{width: 56}} transparent onPress={() => this.props.navigation.navigate('LoginScreen')}>
                  <Icon name='md-arrow-back' style={{color: '#5f5f5f'}}/>
              </Button>
              <Image
              style={styles.stretch}
              source={require('../../../img/logo.png')}
              />
            </View>
            <View style={{marginBottom: 20 ,backgroundColor: 'lightgray'}}>
              <Text style={{ textAlign: 'center'}}>Восстановление пароля</Text>
            </View>

            <View style={{paddingHorizontal: 10}}>
              <View style={{marginBottom: 15, flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{flex:5, fontWeight: 'bold', fontSize:16,}}>Телефон: </Text>
                <TextInputMask
                style={{height: 40,flex:10,fontSize:16,}}
                //age > 14 ? true : false;
                value = {this.state.loginNumber === '' ? '+7-': this.state.loginNumber}
                onChangeText={loginNumber => this.setState({ loginNumber })}
                
                keyboardType={'numeric'}
                underlineColorAndroid={'lightblue'}
                
                maxLength={15}
                ref={'myDateText'}
                type={'custom'}
                ref={'loginNumber'}
                placeholder="Телефон"
                options={{
                  mask: '+7-999-999-9999'
                }}/>
                <Button style={{flex:3,height: 40,}} transparent onPress={() => this.clear()}>
                    <Icon name='md-close-circle' style={{color: '#E31E25'}}/>
                </Button>

              </View>
              <View style={{marginBottom: 25, flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{flex:5, fontWeight: 'bold', fontSize:16}}>Код с картинки: </Text>
                <TextInput style={{height: 40,flex:13, fontSize:16}}
                  value = {this.state.kaptchaCode}
                  onChangeText={kaptchaCode => this.setState({ kaptchaCode })}
                  keyboardType={'numeric'}
                  underlineColorAndroid={'lightblue'}
                  
                />
              </View>
              <TouchableOpacity
                style={{marginBottom: 25, flexDirection: 'row', alignItems: 'center'}}
                onPress={() => this.getCaptcha().done()}
              >
                
                <Icon style={styles.iconMenu} name='md-refresh' />
                {this.state.ready ?
                <Image
                  style={{width: 200, height: 40}}
                  source={{uri: 'http://auto-club42.ru/bitrix/tools/captcha.php?captcha_sid='+this.state.captcha}}
                />
                :
                <View
                style={{width: 200, height: 40}}
                />

                }

              </TouchableOpacity>
              
              <View style={{marginBottom: 15, flexDirection: 'row', alignItems: 'center'}}>
                <Button style={{  height: 40, shadowColor: 'black',paddingLeft: 20, paddingRight: 20, marginRight: 10, paddingBottom: 5, backgroundColor: "white", }}  onPress={() => this.register1()}>
                    <Text style={{fontWeight:'bold',fontSize:16,}}>ОК</Text>
                </Button>
                <Button style={{  height: 40, shadowColor: 'black',paddingLeft: 20, paddingRight: 20, paddingBottom: 5, backgroundColor: "white", }}  onPress={() => this.props.navigation.navigate('LoginScreen')}>
                    <Text style={{fontWeight:'bold',fontSize:16,}}>Отмена</Text>
                </Button>
              </View>

            </View>




          </Container>
        );  




    } else {
      return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <StatusBar hidden= { true } />
        <ActivityIndicator size={70} />
      </View>
      );


    }
  }




}

class ChangePass2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codeSMS:'',
      userid:'',
      phonereg:'',
      ready:false,
      newPass:'',
      };

  }

  async getChange1FromStorage() {
    console.log('ChangePass2!!!');
    console.log(this.state);
    const result = await AsyncStorage.getItem('change1');
    const temp = await JSON.parse(result);
    if (temp != null) {
      this.setState({userid: temp.userid, phonereg:temp.phonereg});
        console.log(this.state);
    }

  }


  componentWillMount() {
    this.getChange1FromStorage().done(()=>this.setState({ready:true}))

  }


    async changePass2() {

        var url_checksms = "http://auto-club42.ru/android/user.php?action=changepasssmscheck&userid=" +
            this.state.userid + "&smscode=" + this.state.codeSMS + "&pass=" + this.state.newPass;
        console.log(url_checksms);
        const response = await fetch(url_checksms);
        const json = await response.json();
        if (json.status == 'success') {
            console.log(json);
            //
            this.props.navigation.navigate('Главная')

            return true;
        } else {
            Alert.alert('Ошибка','неверный код смс');
            //this.setState({kaptchaCode:''});
            //this.getCaptcha().done();
            return false;
        }
    }

  render() {
    if (this.state.ready) {

    

      return (
        <Container>
            <StatusBar hidden= { true } />
            <View style={{ backgroundColor: '#dbdbdb', flexDirection: 'row'}}>

              <Button style={{width: 56}} transparent onPress={() => this.props.navigation.navigate('ChangePass1')}>
                  <Icon name='md-arrow-back' style={{color: '#5f5f5f'}}/>
              </Button>
              <Image
              style={styles.stretch}
              source={require('../../../img/logo.png')}
              />
            </View>
            <View style={{marginBottom: 20 ,backgroundColor: 'lightgray'}}>
              <Text style={{ textAlign: 'center'}}>Восстановление пароля</Text>
            </View>

            <View style={{paddingHorizontal: 10}}>
              <View style={{marginBottom: 15, flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{flex:5, fontWeight: 'bold',fontSize:16,}}>Код СМС: </Text>
                <TextInput style={{height: 40,flex:13,fontSize:16,}}
                  value = {this.state.codeSMS}
                  onChangeText={codeSMS => this.setState({ codeSMS })}
                  keyboardType={'numeric'}
                  underlineColorAndroid={'lightblue'}
                />
              </View>

              <View style={{marginBottom: 15, flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{flex:5, fontWeight: 'bold',fontSize:16,}}>Новый пароль: </Text>
                <TextInput style={{height: 40,flex:13,fontSize:16,}}
                  value = {this.state.newPass}
                  onChangeText={newPass => this.setState({ newPass })}
                  underlineColorAndroid={'lightblue'}
                />
              </View>

              
              <View style={{marginBottom: 15, flexDirection: 'row', alignItems: 'center'}}>
                <Button style={{  height: 40, shadowColor: 'black',paddingLeft: 20, paddingRight: 20, marginRight: 10, paddingBottom: 5, backgroundColor: "white", }}  onPress={() => this.changePass2()}>
                    <Text style={{fontWeight:'bold', fontSize:16,}}>ОК</Text>
                </Button>
                <Button style={{  height: 40, shadowColor: 'black',paddingLeft: 20, paddingRight: 20, paddingBottom: 5, backgroundColor: "white", }}  onPress={() => this.props.navigation.navigate('ChangePass1')}>
                    <Text style={{fontWeight:'bold', fontSize:16,}}>Отмена</Text>
                </Button>
              </View>

            </View>


          </Container>
        );  




    } else {
      return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <StatusBar hidden= { true } />
        <ActivityIndicator size={70} />
      </View>
      );


    }
  }
}


const ChangePass = StackNavigator({
  ChangePass1: {
    screen: ChangePass1,
  },
  ChangePass2: {
    screen: ChangePass2,
  },
  
},{headerMode: 'none'});


export default ChangePass;