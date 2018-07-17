import React, { Component } from "react";
import { Image, View, StatusBar, TouchableOpacity, Keyboard } from "react-native";
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { ActivityIndicator, AsyncStorage, TextInput, StyleSheet, Text, ToolbarAndroid,  Alert, TouchableHighlight, Platform } from 'react-native';
import {Input, Label, Item, Container, Button, Icon} from 'native-base'  ;
import {TextInputMask} from 'react-native-masked-text';
import styles from "./styles";
//import RestartAndroid from 'react-native-restart-android';
var CryptoJS = require("crypto-js");





class Registration1 extends Component {
  
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
    var url_checkcaptcha = `http://auto-club42.ru/android/user.php?action=registercheck&phone=${userphone}&code=${code}&sid=${sid}`;
    const response = await fetch(url_checkcaptcha);
    const json = await response.json();
    if (json.status == 'success') {
      this.setReg1InStorage({
        phonereg: userphone,
        codereg: code,
        sidreg: sid,
        userid: json.userid,
      }).done();
      return true;
    } else if (json.status === 'failed'){
      Alert.alert('Ошибка',json.message);
      this.setState({kaptchaCode:''});
      this.getCaptcha().done();
      return false;
    } else {
      Alert.alert('Ошибка','неверная капча');
      this.setState({kaptchaCode:''});
      this.getCaptcha().done();
      return false;

    }
  }

  async setReg1InStorage(reg1) {
    await AsyncStorage.setItem('reg1', JSON.stringify(reg1));
  }

  clear () {
    this.setState({ loginNumber: '+7-'});
  }


  register1() {
    if (this.state.loginNumber.length !== 15) {
        Alert.alert('Неверный телефон','Введите корректный номер телефона');
        this.getCaptcha().done();
        return;
    }

    if (this.state.loginNumber[3] !== "9") {
        Alert.alert('Неверный телефон','Введите корректный номер телефона');
        this.getCaptcha().done();
        return;
    }    


   this.setState({ready: false});

   this.checkCaptcha().then(v => {
    if (v) {
      Keyboard.dismiss();
      this.props.navigation.navigate('Registration2');
    } else {
      this.setState({ready: true});
    }

   })
       .catch(err => console.warn(err));

    
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
              <Text style={{ textAlign: 'center'}}>Регистрация</Text>
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

class Registration2 extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      codeSMS:'',
      userid:'',
      phonereg:'',
      ready:false,
      };

  }

  async getReg1FromStorage() {
    const result = await AsyncStorage.getItem('reg1');
    const temp = await JSON.parse(result);
    if (temp != null) {
      this.setState({userid: temp.userid, phonereg:temp.phonereg});

    }

  }

  async checkSms() {
    var url_checksms = "http://auto-club42.ru/android/user.php?action=registersmscheck&userid=" 
    + this.state.userid + "&smscode=" + this.state.codeSMS;
    const response = await fetch(url_checksms);
    const json = await response.json();
    if (json.status == 'success') {
      //
      var pass = this.state.codeSMS;
      var userphone = this.state.phonereg;
      var addcount = 0;
      var blocksize = 8;
      if ((pass.length % blocksize) != 0) {
        addcount = (blocksize - (pass.length % blocksize));
      } else {
        addcount = 8;
      }


      var dataString = pass;
      var addchar = "\0";
      if (addcount != 0) {
        for (var i = 0; i < addcount; i++) {
          dataString += addchar;
        }
      }
      var sitelogin = "8-" + userphone.substr(0, 3) + "-" + userphone.substr(3, 3) + "-" + userphone.substr(6, 4);
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
      var hexEncrypted = String(encrypted.ciphertext);
    //JSON.stringify(hexEncrypted)


      AsyncStorage.setItem('sitelogin', JSON.stringify(sitelogin), () => {
      });
      AsyncStorage.setItem('hexEncrypted', JSON.stringify(hexEncrypted), () => {
      });
      AsyncStorage.setItem('pass', JSON.stringify(this.state.codeSMS), () => {
      });      











      return true;
    } else {
      Alert.alert('Ошибка',json.message);
    
      return false;
    }
  }  

  componentWillMount() {
    this.getReg1FromStorage().done(this.setState({ready:true}));
  }

  register2() {
    this.setState({ready:false})
    this.checkSms().then(v => {
      if (v) {
      Keyboard.dismiss();
      this.props.navigation.navigate('Registration3');
      } else {
        this.setState({ready:true})
      }
    });


    

    
  }

  render() {
    if (this.state.ready) {
      return (
        <Container>
            <StatusBar hidden= { true } />
            <View style={{ backgroundColor: '#dbdbdb', flexDirection: 'row'}}>

              <Button style={{width: 56}} transparent onPress={() => this.props.navigation.navigate('Registration1')}>
                  <Icon name='md-arrow-back' style={{color: '#5f5f5f'}}/>
              </Button>
              <Image
              style={styles.stretch}
              source={require('../../../img/logo.png')}
              />
            </View>
            <View style={{marginBottom: 20 ,backgroundColor: 'lightgray'}}>
              <Text style={{ textAlign: 'center'}}>Регистрация</Text>
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
                <Button style={{  height: 40, shadowColor: 'black',paddingLeft: 20, paddingRight: 20, marginRight: 10, paddingBottom: 5, backgroundColor: "white", }}  onPress={() => this.register2()}>
                    <Text style={{fontWeight:'bold', fontSize:16,}}>ОК</Text>
                </Button>
                <Button style={{  height: 40, shadowColor: 'black',paddingLeft: 20, paddingRight: 20, paddingBottom: 5, backgroundColor: "white", }}  onPress={() => this.props.navigation.navigate('Registration1')}>
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


class Registration3 extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      name:'',
      email:'',
      sitelogin:'',
      hexEncrypted:null,
      phpsessid:'',
      loggedIn: false,

      };

  }

  async getReg2FromStorage() {

   

    const result = await AsyncStorage.getItem('sitelogin');
    const temp = await JSON.parse(result);
    const result2 = await AsyncStorage.getItem('hexEncrypted');
    const temp2 = await JSON.parse(result2);
    if (temp != null && temp2 !=null) {
      this.setState({sitelogin: temp, hexEncrypted:temp2});
      

    }

  }

  
  componentWillMount() {
    this.getReg2FromStorage().done(()=>{
      console.log(this.state.sitelogin);
      console.log(this.state.hexEncrypted);
      this.getAuthFromSite(this.state.sitelogin,this.state.hexEncrypted);
    });
  }

  getAuthFromSite (trylogin, trypassword) {
      var bReturn = false;
      var url_auth = "http://auto-club42.ru/android/user.php?action=auth&login=";
      var par = "&uidh=";
      var ur = url_auth + trylogin + par + trypassword;
      console.log(ur);
      fetch(ur).then((response) => response.json())
       .then((responseJson) => {
         if (responseJson.status === 'success') {
           console.log(responseJson);
           this.setState({ phpsessid: responseJson.phpsessid});
           console.log('phpsessid');
           console.log(responseJson.phpsessid);

           AsyncStorage.setItem('phpsessid', JSON.stringify(responseJson.phpsessid), () => {
             console.log('111успешное сохранение в хранилище сессии')
             console.log(responseJson.phpsessid);
             this.setState({ phpsessid: responseJson.phpsessid});
           });

           var url_userinfo = "http://auto-club42.ru/android/user.php?action=profile&phpsessid=" + responseJson.phpsessid;
           console.log(url_userinfo);
           fetch(url_userinfo).then((response) => response.json())
            .then((responseJson) => {
             if (responseJson.status === 'success') {
               console.log(responseJson);
               this.setState({ loginData: true});

               AsyncStorage.setItem('loginData', JSON.stringify(responseJson), () => {

               });
               console.log(responseJson);


             } else {
               console.log(responseJson);
             }

            })
            .catch((error) => {
             console.error(error);
            });


            var url_makes = "http://auto-club42.ru/android/user.php?action=makesmodels&phpsessid=" + responseJson.phpsessid;
            console.log(url_makes);
            fetch(url_makes).then((response) => response.json())
            .then(async (responseJson) => {
             if (responseJson.status === 'success') {
               console.log(responseJson);
               await AsyncStorage.setItem('makes', JSON.stringify(responseJson.makes), () => {
               });

             } else {
               console.log(responseJson);
             }

            })
            .catch((error) => {
             //this.setState({ fieldText: url});
             //Alert.alert( 'Ошибка', 'Нет соединения с сервером' );
             console.error(error);
            });



           //Alert.alert( 'Вызов эвакуатора', 'Заявка успешно отправлена' );
           //this.props.navigation.navigate('Главная');
         } else {
           //this.setState({ fieldText: url});
           //Alert.alert( 'Ошибка', 'Ошибка при отправке заявки' );
           console.log(responseJson);
         }

       })
       .catch((error) => {
         //this.setState({ fieldText: url});
         //Alert.alert( 'Ошибка', 'Нет соединения с сервером' );
         console.error(error);
       });


  }

  async registerdopinfo() {
    var url_registerdopinfo = "http://auto-club42.ru/android/user.php?action=registerdopinfo&fio=" 
      + this.state.name + "&emailreg=" + this.state.email + "&phpsessid=" + this.state.phpsessid;
    console.log(url_registerdopinfo);
    await AsyncStorage.setItem('phpsessid', JSON.stringify({phpsessid: this.state.phpsessid}));

    const response = await fetch(url_registerdopinfo);
    const json = await response.json();
    if (json.status == 'success') {

        
           var url_userinfo = "http://auto-club42.ru/android/user.php?action=profile&phpsessid=" + this.state.phpsessid;
          const response2 = await fetch(url_userinfo);
          const json2 = await response2.json();
          if (json2.status == 'success') {

          console.log(json2);
            await AsyncStorage.setItem('loginData', JSON.stringify(json2));
            
          }






      return true;
    } else {
      Alert.alert('Ошибка',json.message);
    
      return false;
    }
  }



  register3() {
    
    this.registerdopinfo().then(v => {
      if (v) {
      Keyboard.dismiss();
      
      AsyncStorage.setItem('firstLaunch', JSON.stringify({test: '1'}), () => {


        
        
        this.props.navigation.navigate('LoginScreen');

      });

      

      }
    });

  }

  render() {
      return (
        <Container>
            <StatusBar hidden= { true } />
            <View style={{ backgroundColor: '#dbdbdb', flexDirection: 'row'}}>

              <Button style={{width: 56}} transparent onPress={() => this.props.navigation.navigate('Registration2')}>
                  <Icon name='md-arrow-back' style={{color: '#5f5f5f'}}/>
              </Button>
              <Image
              style={styles.stretch}
              source={require('../../../img/logo.png')}
              />
            </View>
            <View style={{marginBottom: 20 ,backgroundColor: 'lightgray'}}>
              <Text style={{ textAlign: 'center'}}>Регистрация</Text>
            </View>

            <View style={{paddingHorizontal: 10}}>
              <View style={{marginBottom: 10, flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{flex:5, fontWeight: 'bold',fontSize:16,}}>Имя: </Text>
                <TextInput style={{height: 40,flex:13,fontSize:16,}}
                  value = {this.state.name}
                  onChangeText={name => this.setState({ name })}
                  underlineColorAndroid={'lightblue'}
                  
                />
              </View>
              <View style={{marginBottom: 15, flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{flex:5, fontWeight: 'bold',fontSize:16,}}>email: </Text>
                <TextInput style={{height: 40,flex:13,fontSize:16,}}
                  value = {this.state.email}
                  onChangeText={email => this.setState({ email })}
                  underlineColorAndroid={'lightblue'}
                  
                />
              </View>
              
              <View style={{marginBottom: 10, flexDirection: 'row', alignItems: 'center'}}>
                <Button style={{  height: 40, shadowColor: 'black',paddingLeft: 20, paddingRight: 20, marginRight: 10, paddingBottom: 5, backgroundColor: "white", }}  onPress={() => this.register3()}>
                    <Text style={{fontSize:16,fontWeight:'bold'}}>ОК</Text>
                </Button>
                <Button style={{  height: 40, shadowColor: 'black',paddingLeft: 20, paddingRight: 20, paddingBottom: 5, backgroundColor: "white", }}  onPress={() => this.props.navigation.navigate('Registration2')}>
                    <Text style={{fontSize:16,fontWeight:'bold'}} >Отмена</Text>
                </Button>
              </View>

            </View>




          </Container>
        );  }
}


const Registration = StackNavigator({
  Registration1: {
    screen: Registration1,
  },
  Registration2: {
    screen: Registration2,
  },
  Registration3: {
    screen: Registration3,
  },
  
  
},{headerMode: 'none'});




export default Registration;