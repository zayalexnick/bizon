import React, { Component } from "react";
import { TouchableOpacity, TextInput, ActivityIndicator, ListView,
	Image, View, StatusBar, ScrollView } from "react-native";

import {AsyncStorage, Request, StyleSheet, Text, ToolbarAndroid,  Alert, TouchableHighlight, Platform } from 'react-native';
import {Input, Label, Item, Container, Button, Icon} from 'native-base'  ;
import {TextInputMask} from 'react-native-masked-text';
import ChooseAuto from "./../checkInService/chooseAuto";

import styles from "./styles";





class EvacuationCall extends Component {
	constructor(props) {
    super(props);
    this.state = {
    	step: 1,
    	date:new Date,
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
			autoFocus: false,
			ready:false,
			error: null
			};
	}
	componentWillMount() {
		this.getDateTimeFromSite().done();

		AsyncStorage.getItem('loginData', (err, result) => {

			this.setState({loginData: JSON.parse(result)});

			if (this.state.loginData != null) {

				this.setState({loginNumber: '+7' + this.state.loginData.LOGIN.substring(1), autoFocus: false});
				this.getPhpsessid().done( ()=>{
				this.getMakesFromStorage().done(()=> {
					this.getAvatars().done(()=>{
						this.setState({ready: true});
					});




				});	});

			} else {
				 this.setState({ready: true,autoFocus: true});
			}
		});
	}

	async getPhpsessid() {
		const result = await AsyncStorage.getItem('phpsessid');
		const phpsessid_temp = await JSON.parse(result);
		if (phpsessid_temp != null) {
			this.setState({phpsessid: phpsessid_temp});
			//console.log('phpsessid =' + phpsessid_temp)
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

	componentDidMount() {


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


		 //другую
		 service_id += "227560";
		 service_name += "Вызов автоэвакуатора";
		 comment += "Вызов эвакуатора, координаты GPS = " + strGPS + " Комментарий пользователя:" + this.state.comment;
		 phonedop += userphone;
		 auto += "227560";



		 //add check login here
		 phpsessid += "calleva";

		 var url = url_checkInService + point + element_id + date + time + service_id + service_name + comment + phonedop + auto + phpsessid + gps;

		 //this.setState({ fieldText: 'Отправка заявки' });
 			fetch(url).then((response) => response.json())
       .then((responseJson) => {
				 if (responseJson.status === 'success') {
					 Alert.alert( 'Вызов эвакуатора', 'Заявка успешно отправлена' );
					 this.props.navigation.navigate('Главная');
				 } else {
					 //this.setState({ fieldText: url});
					 Alert.alert( 'Ошибка', 'Ошибка при отправке заявки' );
				 }
         //this.setState({ fieldText: responseJson.movies[0].title });
       })
       .catch((error) => {
				 //this.setState({ fieldText: url});
				 Alert.alert( 'Вызов эвакуатора', 'Заявка успешно отправлена' );
				 this.props.navigation.navigate('Главная');
				 // Alert.alert( 'Ошибка', 'Нет соединения с сервером' );
				 //console.error(error);
       });




		//this.setState({ fieldText: this.state.comment })

	}

	callbackIndexAuto = (dataFromChild) => {
		if (dataFromChild.indexAuto == 150) {

			this.props.navigation.navigate('Гараж',{addAuto: 'Вызов эвакуатора'})
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
		}

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
		let selServices = "227560";
		const zapis = {
			auto: autoT,
			services: selServices,
			datetime: datetime,
			address: service_addr,
			comment: "Вызов эвакуатора, телефон: "+ userphone + " координаты GPS = " + strGPS + " комментарий: " +this.state.comment,
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
		
		console.log('step= '+this.state.step);
		console.log('indexAuto= '+this.state.indexAuto);
		console.log('selectedIndexAuto= '+this.state.selectedIndexAuto);

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
					<Text style={{color:'white',textAlign:'center', fontWeight:'bold', fontSize:20}}>ВЫЗОВ ЭВАКУАТОРА</Text>
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


					<View style={{paddingHorizontal: 10}}>
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

						<View sty6le={{marginBottom: 10,  }}>
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
								onPress={() => this.zapisOchered().done()}
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

export default EvacuationCall;
