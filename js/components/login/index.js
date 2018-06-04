import React, { Component } from "react";
import { Keyboard, Image, View, StatusBar } from "react-native";
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { ActivityIndicator, AsyncStorage, TextInput, StyleSheet, Text, ToolbarAndroid,  Alert, TouchableHighlight, Platform } from 'react-native';
import {Input, Label, Item, Container, Button, Icon} from 'native-base'  ;
import {TextInputMask} from 'react-native-masked-text';
import styles from "./styles";
import Registration from "./registration";
import ChangePass from "./changePass";
var CryptoJS = require("crypto-js");
class LoginScreen extends Component {

	static navigationOptions = ({ navigation }) => ({

	    title: typeof(navigation.state.params)==='undefined' || typeof(navigation.state.params.title) === 'undefined' ? 'Вход': navigation.state.params.title,
	    reload: '',


	});

	constructor(props) {
    super(props);
		this.state = {
			firstLaunch: '',
			fieldText: 'test',
			phpsessid:'',
			loginData:{},
			loginNumber:'+7-',
			password:'',
			comment:'',
			positionText: 'GPS Координаты пользователя неизвестны',
			lat: 0,
			lng: 0,
			loggedIn: false,
			ready: false,
			visible: true,
			parent: 'Главная',
			error: null,
			loggedIn:false,
			};

	}

	componentWillMount() {

		const {state} = this.props.navigation;
		console.log('111');
		console.log(state);
		
		if (typeof(state.params) != 'undefined' && typeof(state.params.loggedIn) != 'undefined') {
			console.log(state.params.loggedIn);
			console.log(state.params.parent);
			this.setState({parent: state.params.parent});
		}



		AsyncStorage.getItem('loginData', (err, result) => {
			let ld = JSON.parse(result);
			
			if (ld != null) {

				this.props.navigation.setParams({ title: ld.NAME })
				this.forceUpdate();
				console.log('ld.NAME');
				console.log(ld.NAME);
				this.setState({loginData: ld,loggedIn: true});
				//this.props.navigation.setParams({ title: ld.NAME })

				console.log('7');
				AsyncStorage.getItem('firstLaunch', (err, result) => {
									let tempFL = JSON.parse(result);
									this.setState({firstLaunch: tempFL});
									if (tempFL != null) {
										console.log('8');

										AsyncStorage.removeItem('firstLaunch', (err, result) => {
												this.setState({visible: false, ready: true});
												this.props.navigation.navigate('Главная');
										});

									} else {
										this.setState({ ready: true});
									}

								}).catch((error) => {
								 //this.setState({ fieldText: url});
								 //Alert.alert( 'Ошибка', 'Нет соединения с сервером' );
								 console.error(error);
								});


			} else {
				this.setState({loggedIn: false});
				AsyncStorage.getItem('firstLaunch', (err, result) => {
					this.setState({firstLaunch: JSON.parse(result)});
					if (this.state.firstLaunch != null) {

						AsyncStorage.removeItem('firstLaunch', (err, result) => {
								this.setState({visible: false, ready: true});
								this.props.navigation.navigate('Главная');
						});

					} else {
						this.setState({ ready: true});
					}

				}).catch((error) => {
				 //this.setState({ fieldText: url});
				 //Alert.alert( 'Ошибка', 'Нет соединения с сервером' );
				 console.error(error);
				});
			}

		}).catch((error) => {
		 //this.setState({ fieldText: url});
		 //Alert.alert( 'Ошибка', 'Нет соединения с сервером' );
		 console.error(error);
		});
	}

	componentDidMount() {

	}
	


	clear () {
		this.setState({ loginNumber: '+7-'});
	}

	getAuthFromSite (trylogin, trypassword) {
			var bReturn = false;
			var url_auth = "http://auto-club42.ru/android/user.php?action=auth&login=";
			var par = "&uidh=";
			var ur = url_auth + trylogin + par + trypassword;
			console.log('ur');
			console.log(ur);
			this.setState({ ready: false});
			fetch(ur).then((response) => response.json())
       .then((responseJson) => {
				 if (responseJson.status === 'success') {
					 console.log(responseJson);

					 AsyncStorage.setItem('phpsessid', JSON.stringify(responseJson.phpsessid), () => {
						 console.log('успешное сохранение в хранилище сессии')
					 });

					 var url_userinfo = "http://auto-club42.ru/android/user.php?action=profile&phpsessid=" + responseJson.phpsessid;
					 console.log(url_userinfo);
					 fetch(url_userinfo).then((response) => response.json())
		        .then((responseJson) => {
		 				 if (responseJson.status === 'success') {
		 					 console.log(responseJson);
		 					 this.setState({ phpsessid: responseJson.phpsessid});

		 					 AsyncStorage.setItem('loginData', JSON.stringify(responseJson), () => {
								 this.props.navigation.setParams({ title: responseJson.NAME })
								 this.setState({ ready:true});
							  });


		 					 //Alert.alert( 'Вызов эвакуатора', 'Заявка успешно отправлена' );
		 					 this.props.navigation.navigate(this.state.parent);
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


						var url_makes = "http://auto-club42.ru/android/user.php?action=makesmodels&phpsessid=" + responseJson.phpsessid;
 					 	fetch(url_makes).then((response) => response.json())
 		        .then((responseJson) => {
 		 				 if (responseJson.status === 'success') {
 		 					 console.log('модели загружены');
 		 					 AsyncStorage.setItem('makes', JSON.stringify(responseJson.makes), () => {
 								 //this.props.navigation.setParams({ title: responseJson.NAME })
 								 //this.setState({ loggedIn: true, phpsessid: responseJson.phpsessid});
 		 					 });
 							 //console.log(responseJson);


 		 					 //Alert.alert( 'Вызов эвакуатора', 'Заявка успешно отправлена' );
 		 					 //this.props.navigation.navigate(this.state.parent);
 		 				 } else {
 		 					 //this.setState({ fieldText: url});
 		 					 Alert.alert( 'Ошибка', 'связи с cервером, попробуйте авторизоваться еще раз' );
 		 					 this.logout(1);
 		 					 console.log(responseJson);
 		 				 }

 		        })
 		        .catch((error) => {
 		 				 //this.setState({ fieldText: url});
 		 				 //Alert.alert( 'Ошибка', 'Нет соединения с сервером' );
 		        });



					 //Alert.alert( 'Вызов эвакуатора', 'Заявка успешно отправлена' );
					 //this.props.navigation.navigate('Главная');
				 } else {
					 this.setState({ ready: true, password: ''});
					 Alert.alert( 'Ошибка', responseJson.message );
					 console.log(responseJson);
				 }

       })
       .catch((error) => {
				 this.setState({ ready: true});
				 Alert.alert( 'Ошибка', 'Нет соединения с сервером' );
				 console.error(error);
       });


	}


	login() {
		var pass = this.state.password;
		if (pass.length === 0) {
				Alert.alert('пароль','введите пароль');
				return;
		}

		if (this.state.loginNumber.length != 15) {
				Alert.alert('телефон','введите полностью номер телефона');
				this.setState({password: ''});
				return;
		}

		if (this.state.loginNumber[3] != "9") {
				alert("Введите корректный телефон, первая цифра 9");
				this.setState({password: ''});
				return;
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
		var sitelogin = "8" + this.state.loginNumber.substring(2);
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
		console.log('sitelogin');
		console.log(sitelogin);
		
		//JSON.stringify(hexEncrypted)


		AsyncStorage.setItem('sitelogin', JSON.stringify(sitelogin), () => {
		});
		AsyncStorage.setItem('hexEncrypted', JSON.stringify(hexEncrypted), () => {
		});
		AsyncStorage.setItem('pass', JSON.stringify(this.state.password), () => {
		});

		this.getAuthFromSite(sitelogin, hexEncrypted);

	}

	async logout(at) {
		await AsyncStorage.removeItem('loginData');
		await AsyncStorage.removeItem('sitelogin');
		await AsyncStorage.removeItem('pass');
		this.props.navigation.setParams({ title: 'Вход' });
		if (at != 1) {
			this.props.navigation.navigate('Главная');	
		} else {
			this.props.navigation.navigate('Профиль');	
		}
		
	}

	registration() {
		Keyboard.dismiss();
		this.props.navigation.navigate('RegistrationScreen')
			
	}

	changePass() {
		Keyboard.dismiss();
		this.props.navigation.navigate('ChangePassScreen')
			
	}

	render() {

			if (this.state.ready && !this.state.loggedIn && this.state.visible) {
				

			return (
				<Container>
						<StatusBar hidden= { true } />
		        <View style={{ backgroundColor: '#dbdbdb', flexDirection: 'row'}}>
		          {/*<Text style={styles.top_polosa}> </Text>*/}

		          <Button style={{width: 56}} transparent onPress={() => this.props.navigation.navigate('Главная')}>
		              <Icon name='md-arrow-back' style={{color: '#5f5f5f'}}/>
		          </Button>
		          <Image
		          style={styles.stretch}
		          source={require('../../../img/logo.png')}
		          />
		        </View>
		        <View style={{marginBottom: 10 ,backgroundColor: 'lightgray'}}>
		          <Text style={{ textAlign: 'center'}}>Авторизация</Text>
		        </View>

						<View style={{paddingHorizontal: 10}}>
							<View style={{marginBottom: 10, flexDirection: 'row', alignItems: 'center'}}>
								<Text style={{flex:5, fontWeight: 'bold',fontSize:16,}}>Телефон: </Text>
								<TextInputMask
								style={{height: 40,flex:10,fontSize:16,}}
								//age > 14 ? true : false;
								value = {this.state.loginNumber === '' ? '+7-': this.state.loginNumber}
								onChangeText={loginNumber => this.setState({ loginNumber })}
								//value={this.state.loginNumber}
								keyboardType={'numeric'}
								underlineColorAndroid={'lightblue'}
								autoFocus={true}
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
							<View style={{marginBottom: 10, flexDirection: 'row', alignItems: 'center'}}>
								<Text style={{flex:5, fontWeight: 'bold',fontSize:16,}}>Пароль: </Text>
								<TextInput style={{height: 40,flex:13,fontSize:16,}}
									value = {this.state.password}
									onChangeText={password => this.setState({ password })}
									underlineColorAndroid={'lightblue'}
									secureTextEntry={true}
								/>
							</View>
							
							<View style={{marginBottom: 30, flexDirection: 'row', alignItems: 'center'}}>
		          	<Button style={{  height: 40, shadowColor: 'black',paddingLeft: 20, paddingRight: 20, marginRight: 10, paddingBottom: 5, backgroundColor: "white", }}  onPress={() => this.login()}>
		              	<Text style={{fontSize:16,fontWeight:'bold'}}>ОК</Text>
		          	</Button>
								<Button style={{  height: 40, shadowColor: 'black',paddingLeft: 20, paddingRight: 20, paddingBottom: 5, backgroundColor: "white", }}  onPress={() => this.props.navigation.navigate('Главная')}>
		              	<Text style={{fontSize:16,fontWeight:'bold'}} >Отмена</Text>
		          	</Button>
							</View>
							

							<View style={{marginBottom: 30, flexDirection: 'row', alignItems: 'center'}}>
		          	<Button style={{  height: 40, shadowColor: 'black',paddingLeft: 15, paddingRight: 15, marginRight: 10, paddingBottom: 5, backgroundColor: "white", }}  onPress={() => this.registration()}>
		              	<Text style={{fontSize:16,fontWeight:'bold'}} >Регистрация</Text>
		          	</Button>
		          	<View style={{marginBottom:30}}/>
		          	<Button style={{  height: 40, shadowColor: 'black',paddingLeft: 15, paddingRight: 15, marginRight: 10, paddingBottom: 5, backgroundColor: "white", }}  onPress={() => this.changePass()}>
		              	<Text style={{fontSize:16,fontWeight:'bold'}} >Восстановить пароль</Text>
		          	</Button>
							</View>

							

							{/* <Text>{this.state.fieldText}</Text> */}

		        </View>




					</Container>
				);
		} else if (this.state.ready && this.state.loggedIn && this.state.visible) {
			
			return (
			<Container>
					<StatusBar hidden= { true } />
					<View style={{ backgroundColor: '#dbdbdb', flexDirection: 'row'}}>
						{/*<Text style={styles.top_polosa}> </Text>*/}

						<Button style={{width: 56}} transparent onPress={() => this.props.navigation.navigate('Главная')}>
								<Icon name='md-arrow-back' style={{color: '#5f5f5f'}}/>
						</Button>
						<Image
						style={styles.stretch}
						source={require('../../../img/logo.png')}
						/>
					</View>
					<View style={{marginBottom: 15 ,backgroundColor: 'lightgray'}}>
						<Text style={{ textAlign: 'center'}}>Профиль</Text>
					</View>

					<View style={{paddingHorizontal: 10}}>
						<View style={{marginBottom: 15, flexDirection: 'row', alignItems: 'center'}}>
							<Text style={{flex:1, fontWeight: 'bold',fontSize:16}}>Имя: </Text>
							<Text style={{flex:2, fontSize:16}}>{this.state.loginData.NAME}</Text>
						</View>
						<View style={{marginBottom: 15, flexDirection: 'row', alignItems: 'center'}}>
							<Text style={{flex:1, fontWeight: 'bold',fontSize:16}}>Телефон: </Text>
							<Text style={{flex:2, fontSize:16,}}>{this.state.loginData.LOGIN}</Text>
						</View>
						<View style={{marginBottom: 25, flexDirection: 'row', alignItems: 'center'}}>
							<Text style={{flex:1, fontWeight: 'bold',fontSize:16,}}>Email: </Text>
							<Text style={{flex:2,fontSize:16, }}>{this.state.loginData.EMAIL}</Text>
						</View>


							<Button style={{ marginVertical:10, elevation:4, backgroundColor: "white", alignSelf: "center",justifyContent:'center'}} onPress={() => this.logout().done()}>
								<Text style={{paddingHorizontal:10, paddingVertical: 5,fontSize:16, fontWeight:'bold',textAlign:'center'}}>Выйти из профиля</Text>
							</Button>



						{/* <Text>{this.state.fieldText}</Text> */}

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






const Login = StackNavigator({
  LoginScreen: {
    screen: LoginScreen,

  },
  RegistrationScreen: {
    screen: Registration,
  },
  ChangePassScreen: {
    screen: ChangePass,
  },
  
},{headerMode: 'none'});

export default Login;