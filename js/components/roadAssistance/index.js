import React, { Component } from "react";
import { TouchableOpacity, AsyncStorage, ScrollView, TextInput, ActivityIndicator, ListView, Image, View, StatusBar } from "react-native";

import { Request, StyleSheet, Text, ToolbarAndroid,  Alert, TouchableHighlight, Platform } from 'react-native';
import {ListItem, CheckBox, Body, Input, Label, Item, Container, Button, Icon, CardItem, Content} from 'native-base'  ;
import {TextInputMask} from 'react-native-masked-text';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ChooseAuto from "./../checkInService/chooseAuto";
import styles from "./styles";





class RoadAssistance extends Component {
	constructor(props) {
    super(props);
    this.state = {
    	date: new Date,
    	findPos:false,
			loginData: null,
			phpsessid:'',
			makes:null,
			avatarSource: [],
			indexAuto:0,
			selectedIndexAuto:-1,
			fieldText: 'test',
			loginNumber:'+7-',
			comment:'',
			positionText: 'GPS Координаты пользователя неизвестны',
			lat: 0,
			lng: 0,
			error: null,
      prikurit: false,
      bensin: false,
			ready:false,
      koleso: false,
      step:1,

			};
	}
	componentDidMount() {
		
	  }

	componentWillMount() {
		this.getDateTimeFromSite().done();
		AsyncStorage.getItem('loginData', (err, result) => {

			this.setState({loginData: JSON.parse(result)});

			if (this.state.loginData != null) {
				this.setState({loginNumber: '+7' + this.state.loginData.LOGIN.substring(1)});
				this.getPhpsessid().done( ()=>{
				this.getMakesFromStorage().done(()=> {
					this.getAvatars().done(()=>{
						this.setState({ready: true});
					});




				});	});
			} else {
				this.setState({ready: true});
			}
		});
	}

	getPosition() {
			this.setState({findPos:true,positionText:'Определение местоположения'})
			navigator.geolocation.getCurrentPosition(
	      (position) => {
	        this.setState({
	          latitude: position.coords.latitude,
	          longitude: position.coords.longitude,
	          error: null,
	          findPos:false
	        });

					if (position.coords.latitude > 0) {
						this.setState({
							positionText: 'GPS Координаты получены',
						});
					}

	      },
	      (error) => this.setState({ error: error.message,findPos:false,positionText:'GPS Координаты пользователя неизвестны' }),
	      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
	    );
	}




	clear () {
		this.setState({ loginNumber: '+7-'});
	}

//http://autoclub42/android/user.php?action=zapis_new
//&point=1
//&element_id=-1
//&date=21.11.2017
//&time=9:23:28
//&service_id=227560
//&service_name=%D0%92%D1%8B%D0%B7%D0%BE%D0%B2%20%D0%B0%D0%B2%D1%82%D0%BE%D1%8D%D0%B2%D0%B0%D0%BA%D1%83%D0%B0%D1%82%D0%BE%D1%80%D0%B0
//&comment=%D0%92%D1%8B%D0%B7%D0%BE%D0%B2%20%D1%8D%D0%B2%D0%B0%D0%BA%D1%83%D0%B0%D1%82%D0%BE%D1%80%D0%B0,%20%D0%BA%D0%BE%D0%BE%D1%80%D0%B4%D0%B8%D0%BD%D0%B0%D1%82%D1%8B%20GPS%20=%20%D0%9D%D0%B5%20%D0%B7%D0%B0%D0%B4%D0%B0%D0%BD%D1%8B%20%D0%9A%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D0%B9%20%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8F:13213
//&phonedop=9089568951
//&auto=227560
//&phpsessid=calleva
//&gps=%D0%9D%D0%B5%20%D0%B7%D0%B0%D0%B4%D0%B0%D0%BD%D1%8B

	addZero(i) {
		if (i < 10) {
				i = "0" + i;
		}
		return i;
	}


	send () {


		var userphone = this.state.loginNumber.replace(/-/g, '').substring(2);
		if ((userphone === "") || (userphone.length != 10)) {
			Alert.alert( 'Телефон', 'Введите телефон для обратной связи' );
			return;
		}
		if (userphone[0] != "9") {
			Alert.alert( 'Телефон', 'Введите корректный телефон, первая цифра 9' );
			return;
		}


		var strGPS = "";
		if (this.state.lat === 0) {
				strGPS = "Не заданы";
		} else {
				strGPS = "lat:" + this.state.lat + ",lng:" + this.state.lng;
		}
		var url_checkInService = "http://autoclub42/android/user.php?action=zapis_new";
		var point = "&point=1";
		var element_id = "&element_id=-1";
		var date = "&date=";
		var time = "&time=";
		var service_id = "&service_id=";
		var service_name = "&service_name=";
		var comment = "&comment=";
		var phonedop = "&phonedop=";
		var auto = "&auto=";
		var phpsessid = "&phpsessid=";
		var gps = "&gps=" + strGPS;

		var datem = new Date();
		var day = this.addZero(datem.getDate());
		var month = this.addZero(datem.getMonth() + 1);
		var year=datem.getFullYear();
		var dateStr = day + "." + month+"." + year;
		var timeStr = this.addZero(datem.getHours()) + ":" + this.addZero(datem.getMinutes()) + ":" + this.addZero(datem.getSeconds());
		 date += dateStr;
		 time += timeStr;

     var soder =""
     var s0 = 0, s1 = 0, s2 = 0;
     var dopusl = 0;
     if (this.state.prikurit) { s0 = 1; dopusl += 1; soder += " Прикурить; "; } else s0 = 0;
     if (this.state.bensin) { s1 = 1; dopusl += 2; soder += " Подвоз бензина; "; } else s1 = 0;
     if (this.state.koleso) { s2 = 1; dopusl += 4; soder += " Замена колеса; "; } else s2 = 0;
     if (dopusl == 0) {
         dopusl = 8;
     }




		 //другую
		 service_id += "22756" + dopusl;
		 service_name += "Помощь на дороге";
		 comment += "Помощь в дороге, " + soder + "координаты GPS = " + strGPS + " Комментарий пользователя:" + this.state.comment;
		 phonedop += userphone;
		 auto += "22756" + dopusl;



		 //add check login here
		 phpsessid += "calleva";

     var url = url_checkInService + point + element_id + date + time + service_id + service_name + comment + phonedop + auto + phpsessid + gps;

		 //this.setState({ fieldText: 'Отправка заявки' });
 			fetch(url).then((response) => response.json())
       .then((responseJson) => {
				 if (responseJson.status === 'success') {
					 Alert.alert( 'Помощь на дороге', 'Заявка успешно отправлена' );
					 this.props.navigation.navigate('Главная');
				 } else {
					 
					 Alert.alert( 'Ошибка', 'Ошибка при отправке заявки' );
				 }
         //this.setState({ fieldText: responseJson.movies[0].title });
       })
       .catch((error) => {
				 //this.setState({ fieldText: url});
				 // Alert.alert( 'Ошибка', 'Нет соединения с сервером' );
				 Alert.alert( 'Помощь на дороге', 'Заявка успешно отправлена' );
				 this.props.navigation.navigate('Главная');
				 
       });




		//this.setState({ fieldText: this.state.comment })

	}

	async getPhpsessid() {
		const result = await AsyncStorage.getItem('phpsessid');
		const phpsessid_temp = await JSON.parse(result);
		if (phpsessid_temp != null) {
			this.setState({phpsessid: phpsessid_temp});
			
		}

	}


	async getMakesFromStorage() {
		result = await AsyncStorage.getItem('makes')
			let makes_temp = await JSON.parse(result);
			if (makes_temp != null) {
				this.setState({makes: makes_temp});
			}

	}
	async getAvatars() {
		const result = await AsyncStorage.getItem('avatarSource');
		const res = await JSON.parse(result);
		if (res != null) {
			this.setState({avatarSource: res});
		}
	}

	callbackIndexAuto = (dataFromChild) => {
		if (dataFromChild.indexAuto == 150) {

			this.props.navigation.navigate('Гараж',{addAuto: 'Помощь на дороге'})
		} else {
			this.setState({
				indexAuto: dataFromChild.indexAuto,
				selectedIndexAuto: dataFromChild.selectedIndexAuto,
				step:2
			});

		}

  }

	async getDateTimeFromSite() {
		var url = "http://auto-club42.ru/android/user.php?action=getDateTime";
		const response = await fetch(url);
		const json = await response.json();
		if (json.status === "success") {
			let tempDate = new Date(json.date);
			tempDate.setDate(tempDate.getDate() + 1);
			this.setState({date:tempDate});
		} else {
			let tempDate = new Date();
			tempDate.setDate(tempDate.getDate() + 1);
			this.setState({date:tempDate});
		}

	}

	async zapisOcheredExt() {
		await this.getDateTimeFromSite();
		await this.zapisOchered();
	}

	async zapisOchered() {

		var userphone = this.state.loginNumber.replace(/-/g, '').substring(2);
		if ((userphone === "") || (userphone.length != 10)) {
			Alert.alert( 'Телефон', 'Введите телефон для обратной связи' );
			return;
		}
		if (userphone[0] != "9") {
			Alert.alert( 'Телефон', 'Введите корректный телефон, первая цифра 9' );
			return;
		}


		let autoIndex = 0;
		if (this.state.selectedIndexAuto >= 0) {
			autoIndex = this.state.selectedIndexAuto;
			}

		let yeartt = String(this.state.date.getFullYear());
		let monthtt = ("0" + String(this.state.date.getMonth()+1)).slice(-2);
		let datett = ("0" + String(this.state.date.getDate())).slice(-2);

		var autoT = "";
		if (autoIndex>=0 && this.state.phpsessid.length > 0) {
			autoT = this.state.loginData.AUTOS[autoIndex].id_site;	
		} 
		

		//const datetime = '14.12.2017 19:00';



		const datetime = datett +"."+monthtt+ "."+yeartt + " " + "09:00";

		const service_addr = "1";
		var strGPS = "";
		if (this.state.lat === 0) {
				strGPS = "Не заданы";
		} else {
				strGPS = "lat:" + this.state.lat + ",lng:" + this.state.lng;
		}

     var soder =""
     var s0 = 0, s1 = 0, s2 = 0;
     var dopusl = 0;
     if (this.state.prikurit) { s0 = 1; dopusl += 1; soder += " Прикурить; "; } else s0 = 0;
     if (this.state.bensin) { s1 = 1; dopusl += 2; soder += " Подвоз бензина; "; } else s1 = 0;
     if (this.state.koleso) { s2 = 1; dopusl += 4; soder += " Замена колеса; "; } else s2 = 0;
     if (dopusl == 0) {
         dopusl = 8;
     }




		 //другую
		 let selServices = "22756" + dopusl;
		 


		const zapis = {
			auto: autoT,
			services: selServices,
			datetime: datetime,
			address: service_addr,
			comment: "Помощь в дороге, телефон: "+ userphone + " " + soder + "координаты GPS = " + strGPS + " Комментарий пользователя: " + this.state.comment,
		}

		const response = await fetch ('http://auto-club42.ru/android/user.php?action=zapisochered_ec&phpsessid=' + this.state.phpsessid, {
		  method: 'POST',
		  headers: {
		    Accept: 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(zapis),
		});
		const json = await response.json();
		if (json.status==='success') {
			Alert.alert('Успешно','заявка успешно создана');
			this.props.navigation.navigate('Главная');
		} else {

			Alert.alert('Ошибка','ошибка создания заявки');

		}		
	}  




	render() {

		if (!this.state.ready) {
			return (
			<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
				<StatusBar hidden= { true } />
				<ActivityIndicator size={70} />
			</View>
			);
		} else {

			return (
			<ScrollView>
				<StatusBar hidden= { true } />
			<View style={{elevation:4,backgroundColor:'crimson', height:60,flexDirection: 'row'}}>
				<TouchableOpacity
					style={{width:60,alignItems: 'center',justifyContent:'center',height:60,}}
					onPress={() => this.props.navigation.navigate('Главная')}
					>
					<Icon name='md-arrow-back' style={{color: 'white'}}/>
				</TouchableOpacity>

				<View style={{flex:1,justifyContent:'center'}}>
					<Text style={{color:'white',textAlign:'center', fontWeight:'bold', fontSize:20}}>ПОМОЩЬ НА ДОРОГЕ</Text>
				</View>
				<View style={{width: 60}}>

				</View>
			</View>
					{(this.state.loginData != null) && (this.state.makes != null)

						?
						<ChooseAuto
							callbackFromParent={this.callbackIndexAuto}
							selectedIndexAuto={this.state.selectedIndexAuto}
							indexAuto={this.state.indexAuto}
							loginData={this.state.loginData}
							avatarSource={this.state.avatarSource}
							makes={this.state.makes}
							step={this.state.step}
						/>

						:
						<View/>
					}

					<View style={{paddingHorizontal: 20}}>
						<Text style={{fontSize:16,marginVertical: 10}}>Укажите ваши данные для обратной связи:</Text>

						<View >

							<Button
									style={{ marginVertical:10, elevation:4, backgroundColor: "white", alignSelf: "center",justifyContent:'center'}}
									onPress={() => this.getPosition()}
							>
									{this.state.findPos ? 
										<Text style={{paddingHorizontal:10, paddingVertical: 5,fontSize:16, fontWeight:'bold',textAlign:'center'}}>Определение местоположения ...</Text>
										:
										<Text style={{paddingHorizontal:10, paddingVertical: 5,fontSize:16, fontWeight:'bold',textAlign:'center'}}>Определить местоположение</Text>
									}
									
							</Button>
							{this.state.findPos ? 
								<ActivityIndicator  />
								:
								<View/> 
							}
						</View>

						<Text style={{fontSize:16,marginVertical: 10}}>{this.state.positionText}</Text>
						<View style={{marginBottom: 10, flexDirection: 'row', alignItems: 'center'}}>
							<Text style={{fontSize:16,fontWeight: 'bold'}}>Телефон: </Text>
							<TextInputMask
							style={{fontSize:16,height: 40,flex:5,}}
							//age > 14 ? true : false;
							value = {this.state.loginNumber === '' ? '+7-': this.state.loginNumber}
							onChangeText={loginNumber => this.setState({ loginNumber })}
							//value={this.state.loginNumber}
							keyboardType={'numeric'}
							autoFocus={this.state.autoFocus}
							maxLength={15}
							ref={'myDateText'}
							type={'custom'}
							ref={'loginNumber'}
							placeholder="Телефон"
							options={{
								mask: '+7-999-999-9999'
							}}/>
							<Button style={{height: 40,width: 56,}} transparent onPress={() => this.clear()}>
									<Icon name='md-close-circle' style={{color: '#E31E25'}}/>
							</Button>

						</View>
	          <View style= {{ marginTop: 20, paddingRight: 30, flexDirection: 'row', justifyContent: 'space-between' }} >
	            <Text style={{fontSize:16}}>Прикурить</Text>
	            <CheckBox color={'crimson'} checked={this.state.prikurit} onPress= {() => this.setState({ prikurit: !this.state.prikurit})} />
	          </View>
	          <View style= {{ marginTop: 20, paddingRight: 30, flexDirection: 'row', justifyContent: 'space-between' }} >
	            <Text style={{fontSize:16}}>Подвоз бензина</Text>
	            <CheckBox color={'crimson'} checked={this.state.bensin} onPress= {() => this.setState({ bensin: !this.state.bensin})} />
	          </View>
	          <View style= {{ marginVertical: 20, paddingRight: 30, flexDirection: 'row', justifyContent: 'space-between' }} >
	            <Text style={{fontSize:16}}>Замена колеса</Text>
	            <CheckBox color={'crimson'} checked={this.state.koleso} onPress= {() => this.setState({ koleso: !this.state.koleso})} />
	          </View>

						<View style={{marginBottom: 10,  }}>
							<Text style={{  fontSize: 16,fontWeight: 'bold'}}>Комментарий: </Text>

							<TextInput style={{fontSize: 16}}
								multiline = {true}
								blurOnSubmit = {true}
         				numberOfLines = {1}
								value = {this.state.comment}
								onChangeText={comment => this.setState({ comment })}
								underlineColorAndroid={'gray'}
							/>
						</View>

						<Button
								style={{ marginTop:10, elevation:4, backgroundColor: "crimson", alignSelf: "center",justifyContent:'center'}}
								onPress={() => this.zapisOcheredExt().done()}
						>
							<Text style={{color:'white', paddingHorizontal:10, paddingVertical: 5,fontSize:16, fontWeight:'bold',textAlign:'center'}}>Отправить заявку</Text>
						</Button>

						{/* <Text>{this.state.fieldText}</Text> */}

	        </View>




				</ScrollView>
		);

		}


}
}

export default RoadAssistance;
