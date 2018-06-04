import React, { Component } from "react";
import {FlatList, Image, View, StatusBar, TextInput } from "react-native";
import { ActivityIndicator,AsyncStorage, StyleSheet,
				Text, ToolbarAndroid,  Alert, TouchableHighlight,
				TouchableOpacity, Platform, ScrollView,  } from 'react-native';
import {Form, Container, Button, Icon, Item, Label, Input} from 'native-base'  ;
import Swiper from 'react-native-swiper';
import styles from "./styles";
import Modal from 'react-native-modal'
import {defaultAutoAction} from "../actions";
import {connect} from "react-redux";



class DiffImage extends Component {
	constructor(props) {
		super(props);




	}

	render() {
		if (this.props.num === 1) {
			return (
				<Image style={styles.imageContainer} source={require('../../../img/backgroundGarage0.png')} />
			);
		}
		if (this.props.num ===2) {
			return (
				<Image style={styles.imageContainer} source={require('../../../img/backgroundWhite.png')} />
			);
		}
		if (this.props.num === 3) {
			return (
				<Image style={styles.imageContainer} source={require('../../../img/backgroundGarage1.png')} />
			);
		}
		if (this.props.num === 4) {
			return (
				<Image style={styles.imageContainer} source={require('../../../img/backgroundGarage2.png')} />
			);
		}
		if (this.props.num === 5) {
			return (
				<Image style={styles.imageContainer} source={require('../../../img/backgroundGarage4.png')} />
			);
		}


	}

}


class Garage extends Component {
	// eslint-disable-line
	constructor(props) {
    super(props);


    this.state = {
			kuzov_ar:[
				{id: 1, name:'Легковой'},
				{id: 2, name:'Кроссовер'},
				{id: 3, name:'Минивэн'},
				{id: 4, name:'Внедорожник'},
				{id: 5, name:'Микроавтобус'},
				{id: 6, name:'Мелкокоммерческий'},
				{id: 7, name:'Крупнокоммерчемкий'},
			],
			tempAvatarSource: [],
			avatarSource: [],
			makes: null,
			phpsessid: "",
			vin: '',
			make:'',
			make_id:'',
			make_item:null,
			model:'',
			model_id:'',
			type_kuzov:'',
			year_pr:'',
			probeg:'',
			fieldText: 'test',
			loginNumber:'+7-',
			comment:'',
      name:'',
      email:'',
			positionText: 'GPS Координаты пользователя неизвестны',
			lat: 0,
			lng: 0,
      ready: false,
			screen: 'garage',
			loginData: null,
			edit_id_site:"",
			screenBack:"",
			isModalVisible:false,
			modal_id_site:'',
			sliderIndex:0,
			di:1,
			parent:'garage',
			error: null
			};
	}

	diffImageChange() {
		var tt = this.state.di
		if ( tt < 4) {
			tt = tt + 1;
		} else {
			tt= 1;
		}
		this.setState({di:tt});

	}


		makemodel_text(id_make,id_model) {
			let make_text = "";
			let model_text = "";
			for (var i = 0; i < this.state.makes.length; i++) {
				if (id_make === this.state.makes[i].id) {
					make_text = this.state.makes[i].name;
					for (var ii = 0; ii < this.state.makes[i].models.length; ii++) {
						let bbb = this.state.makes[i].models[ii].id;

						if (id_model === this.state.makes[i].models[ii].id) {
							model_text = this.state.makes[i].models[ii].name;
						}
					}

				}
			}
			return make_text + ' ' + model_text;
		}

		avatar(id) {
			// Alert.alert( 'Alert Title', id );
			var ImagePicker = require('react-native-image-picker');
			var options = {
			  title: 'Выберите фото авто',
				takePhotoButtonTitle: 'Сделать фото...',
				chooseFromLibraryButtonTitle: 'Выбрать из галереи...',
				cancelButtonTitle: 'Отмена',

			  // customButtons: [
			  //   {name: 'fb', title: 'Choose Photo from Facebook'},
			  // ],
			  storageOptions: {
			    skipBackup: true,
			    path: 'images'
			  }
			};

			ImagePicker.showImagePicker(options, (response) => {
			  console.log('Response = ', response);

			  if (response.didCancel) {
			    console.log('User cancelled image picker');
			  }
			  else if (response.error) {
			    console.log('ImagePicker Error: ', response.error);
			  }
			  else if (response.customButton) {
			    console.log('User tapped custom button: ', response.customButton);
			  }
			  else {
			    let source = { uri: response.uri };

			    // You can also display the image using data:
			    //let source = { uri: 'data:image/jpeg;base64,' + response.data };

					let avatars = this.state.avatarSource;
					//let avatars2 = this.state.tempAvatarSource;
					//avatars.push({'id':id,'source':source}) ;  //new value

					avatars[id] = source;
					//avatars2.push({id:id, source:source});
					this.setState({ avatarSource:  avatars});


					this.saveAvatars(avatars).done();
					//console.log(JSON.stringify(avatars));

			  }
			});

		}



		async saveAvatars(avatars ) {

			await AsyncStorage.setItem('avatarSource', JSON.stringify(avatars));
			console.log(JSON.stringify(avatars));
		}

		async getAvatars() {
			const result = await AsyncStorage.getItem('avatarSource');
			const res = await JSON.parse(result);
			if (res != null) {
				this.setState({avatarSource: res});
			}
		}


		async deleteAuto() {
			this.setState({isModalVisible:false,ready:false});
			var id_site = this.state.modal_id_site;
			console.log(id_site);
			var url_del = "http://auto-club42.ru/android/user.php?action=deleteauto&phpsessid=" + this.state.phpsessid + "&id_site=" + id_site;
			const response = await fetch(url_del);
			const json = await response.json();
			if (json.status === 'success') {
				//this.saveInStorage('loginData', json).done();
				//console.log('proverka');
				//console.log(json);
				//this.setState({loginData:json});
				this.updateLoginData().done(()=>{
					var avs = this.state.avatarSource;
					avs.splice(this.sliderIndex,1);
					this.setState({avatarSource: avs, ready: true});
					this.saveAvatars(avs).done();
				});
				Alert.alert( 'Успешно', 'автомобиль удален' );

			} else {
				Alert.alert( 'Ошибка', json.message );
			}

		}





	async getPhpsessid() {
		const result = await AsyncStorage.getItem('phpsessid');
		const phpsessid_temp = await JSON.parse(result);
		if (phpsessid_temp != null) {
			this.setState({phpsessid: phpsessid_temp});
			console.log('phpsessid =' + phpsessid_temp)
		}

	}
	componentWillMount() {
		const {state} = this.props.navigation;

		if (typeof(state.params) != 'undefined' && typeof(state.params.addAuto) != 'undefined') {
			if (state.params.addAuto != "") {
				this.setState({screen:'newAuto',parent:state.params.addAuto});
				this.props.navigation.setParams({ addAuto: "" })
			}


		}



		
		this.getPhpsessid().done( ()=>{
			this.getLoginDataFromStorage().done(() => {
				this.getMakesFromStorage().done(()=> {
					if (this.state.loginData != null) {
						this.setState({ ready: true});
					} else {
						this.props.navigation.navigate('Профиль');
					}

				});
			});
		});




		if (this.state.loginData != null && this.state.makes != null) {
			if (this.state.loginData.AUTOS != null) {
				this.setState({ ready: true});
			}
		}

		this.getAvatars().done();
	}

	componentDidMount() {

	}

	async getLoginDataFromStorage() {
		result = await AsyncStorage.getItem('loginData')
			let loginData_temp = await JSON.parse(result);
			if (loginData_temp != null) {
				console.log('getLoginDataFromStorage');
				console.log(loginData_temp);
				this.setState({loginData: loginData_temp});
			}

	}

	async getMakesFromStorage() {
		result = await AsyncStorage.getItem('makes')
			let makes_temp = await JSON.parse(result);
			if (makes_temp != null) {
				this.setState({makes: makes_temp});
			}

	}

	editAuto() {
		var id_site = this.state.modal_id_site;
		this.getLoginDataFromStorage().done();

		console.log('this.state.loginData.AUTOS');
		console.log(this.state.loginData.AUTOS);
		for (var i = 0; i < this.state.loginData.AUTOS.length; i++) {
			if (id_site === this.state.loginData.AUTOS[i].id_site) {
				var autoForEdit = this.state.loginData.AUTOS[i];
				console.log('autoForEdit');
				console.log(autoForEdit);
			}
		}

		let make = "";
		let make_item = null;
		let model = "";
		for (var i = 0; i < this.state.makes.length; i++) {
			if (autoForEdit.id_make === this.state.makes[i].id) {

				make = this.state.makes[i].name;
				make_item = this.state.makes[i];

				for (var ii = 0; ii < this.state.makes[i].models.length; ii++) {


					if (autoForEdit.id_model === this.state.makes[i].models[ii].id) {
						model =this.state.makes[i].models[ii].name;
					}
				}

			}
		}
		this.setState({
			isModalVisible:false,
			vin: autoForEdit.vin,
			make: make,
			make_id: autoForEdit.id_make,
			make_item: make_item,
			model: model,
			model_id: autoForEdit.id_model,
			type_kuzov: autoForEdit.type_kuzov,
			year_pr: autoForEdit.year_pr,
			probeg:autoForEdit.probeg,
			edit_id_site:id_site,
			screen:'editAuto',
			edit_id_site:id_site,
		});


	}

	checkAuto(auto)
	{
		if (auto.vin === '')
		{
			Alert.alert('Ошибка', 'Заполните VIN или номер кузова');
			return false;
		}
		else if (auto.vin.search(/[А-Яа-я]/) != -1)
		{
			Alert.alert('VIN или номер кузова не может содержать русские буквы');
			return false;
		}

		if (auto.id_make === '')
		{
			Alert.alert('Ошибка', 'Выберите марку автомобиля');
			return false;
		}

		if (auto.id_model === '')
		{
			Alert.alert('Ошибка', 'Выберите модель автомобиля');
			return false;
		}

		if (auto.type_kuzov === '')
		{
			Alert.alert('Ошибка', 'Выберите тип кузова');
			return false;
		}

		if (auto.year_pr === '')
		{
			Alert.alert('Ошибка', 'Введите год выпуска');
			return false;
		}

		return true;
	}

	async saveEditAuto() {
		let auto = {
			vin: this.state.vin,
			id_make: this.state.make_id,
			id_model: this.state.model_id,
			type_kuzov: this.state.type_kuzov,
			year_pr: this.state.year_pr,
			probeg: this.state.probeg,
		};

		if (!this.checkAuto(auto)) return;

		let editAutoUrl = 'http://auto-club42.ru/android/user.php?action=editauto&phpsessid=' + this.state.phpsessid
			+ '&id_site=' + this.state.edit_id_site
			+ '&id_make=' + this.state.make_id
			+ '&id_model=' + this.state.model_id
			+ '&type_kuzov=' + this.state.type_kuzov
			+ '&year_pr=' + this.state.year_pr
			+ '&probeg=' + this.state.probeg;
		console.log(editAutoUrl);
		const response = await fetch(editAutoUrl);
		const json = await response.json();
		console.log('editsave');
		console.log(json);

		if (json.status === "success") {
			this.updateLoginData().done()
			if (this.state.parent === 'garage') {
				this.setState({
					screen:'garage',
					vin: '',
					make:'',
					make_id:'',
					make_item:null,
					model:'',
					model_id:'',
					type_kuzov:'',
					year_pr:'',
					probeg:'',
				});

			} else {
				this.setState({
					vin: '',
					make:'',
					make_id:'',
					make_item:null,
					model:'',
					model_id:'',
					type_kuzov:'',
					year_pr:'',
					probeg:'',
				});

				this.props.navigation.navigate(this.state.parent);
			}

			Alert.alert( 'Успешно', 'автомобиль отредактирован' );


		} else {
			Alert.alert( 'Ошибка', 'автомобиль не создан' );
		}


	}

	async saveNewAuto() {
		// let loginDataT = this.state.loginData;
		// let autosClient = this.state.loginData.AUTOS;
		let auto = {
			vin: this.state.vin,
			id_make: this.state.make_id,
			id_model: this.state.model_id,
			type_kuzov: this.state.type_kuzov,
			year_pr: this.state.year_pr,
			probeg: this.state.probeg,
		};

		if (!this.checkAuto(auto)) return;

		let createAutoUrl = 'http://auto-club42.ru/android/user.php?action=createauto&phpsessid=' + this.state.phpsessid
			+ '&vin=' + this.state.vin
			+ '&id_make=' + this.state.make_id
			+ '&id_model=' + this.state.model_id
			+ '&type_kuzov=' + this.state.type_kuzov
			+ '&year_pr=' + this.state.year_pr
			+ '&probeg=' + this.state.probeg;
		console.log(createAutoUrl);
		const response = await fetch(createAutoUrl);
		const json = await response.json();
		if (json.status === "success") {
			this.updateLoginData().done()
			this.setState({
				screen:'garage',
				vin: '',
				make:'',
				make_id:'',
				make_item:null,
				model:'',
				model_id:'',
				type_kuzov:'',
				year_pr:'',
				probeg:'',
				sliderIndex:0,
			});
			Alert.alert( 'Успешно', 'автомобиль создан' );


		} else {
			Alert.alert( 'Ошибка', 'автомобиль не создан' );
		}
	}

	async saveInStorage(stor, responseJson) {
		await AsyncStorage.setItem(stor, JSON.stringify(responseJson));
	}

	async updateLoginData() {
		var url_userinfo = "http://auto-club42.ru/android/user.php?action=profile&phpsessid=" + this.state.phpsessid;
		const response = await fetch(url_userinfo);
		const json = await response.json();
		if (json.status === 'success') {
			this.saveInStorage('loginData', json).done();
			console.log('proverka');
			console.log(json);
			this.setState({loginData:json});

		}

	}

	async checkVin() {
		if (this.state.vin === "") {
			Alert.alert ('VIN', 'Введите VIN');
			return false;
		}
		var checkUrl = 'http://auto-club42.ru/android/user.php?action=checkauto&phpsessid=' + this.state.phpsessid + '&vin=' + this.state.vin;
		const response = await fetch(checkUrl);
		const json = await response.json();
		if (json.status === "failed") {
			if (json.message === "vin отстутствует") {
				// 1 vin не найден продолжение
				Alert.alert ('VIN', 'VIN не найден');
				this.setState({screen: 'newAutoExt'});
			}  else {
				Alert.alert ('VIN', 'автомобиль с таким VIN уже существует и принадлежит');
			}
		}

		if (json.status === "success") {
			this.updateLoginData().done(()=>{
			console.log('check');
			console.log(this.state.loginData);
			console.log(json.AUTO_ID);
			this.setState({modal_id_site: json.AUTO_ID});
			this.editAuto();
			Alert.alert ('VIN', 'найден VIN ');

			})
			// авто восстановлен из удаленных и владелец поставлен на текущего
			// обновить гараж перейти на экран редактирования
		}



	}

	chooseModel(screenBack) {
		console.log('chooseModel');
		console.log(this.state.make_id);
		if (this.state.make_id==="") {
			Alert.alert ('asd', 'Выберите марку автомобиля ');
		} else {
			this.setState({screen:'model',screenBack:screenBack})
		}

	}

	_keyExtractor = (item, index) => item.id;



	goBack() {
		if (this.state.parent === 'garage') {
			this.setState({screen:'garage'})

		} else {
			this.props.navigation.navigate(this.state.parent);
		}
	}


	render() {
		// if (this.state.screen === 'newAutoExt') {
		// 	Alert.alert( 'Alert Title', 'vin не найден' );
		// }






		if (this.state.ready && this.state.screen === 'garage') {
			if (this.state.loginData.AUTOS==="")
			{
				return (

					<View style={styles.mainView} >
						<StatusBar hidden= { true } />




		        <View style={{ backgroundColor: '#dbdbdb', flexDirection: 'row'}}>


		          <Button style={{width: 56}} transparent onPress={() => this.props.navigation.navigate('Главная')}>
		              <Icon name='md-arrow-back' style={{color: '#5f5f5f'}}/>
		          </Button>
		          <Image
		          style={styles.stretch}
		          source={require('../../../img/logo.png')}
		          />
		        </View>
		        <View style={styles.top_polosa}>
		          <Text style={styles.top_polosa_text}>Гараж</Text>
		        </View>




						<View style={{flex:1,alignItems: 'center', justifyContent: 'center'}}>

							<Button style={{width:150, backgroundColor: "#ddd", alignSelf: "center",justifyContent:'center'}}  onPress={() => this.setState({
								isModalVisible: false ,
								screen:'newAuto',
								vin: '',
								make:'',
								make_id:'',
								make_item:null,
								model:'',
								model_id:'',
								type_kuzov:'',
								year_pr:'',
								probeg:'',
							})}>
								<Text style={{color:'black', fontWeight:'bold'}} >Создать новый</Text>
							</Button>

						</View>




					</View>
				);

			}
			else
			{
				return (
					<ScrollView style={styles.mainView} >
						<StatusBar hidden= { true } />




		        {/* <View style={{ backgroundColor: '#dbdbdb', flexDirection: 'row'}}>


		          <Button style={{width: 56}} transparent onPress={() => this.props.navigation.navigate('Главная')}>
		              <Icon name='md-arrow-back' style={{color: '#5f5f5f'}}/>
		          </Button>
		          <Image
		          style={styles.stretch}
		          source={require('../../../img/logo.png')}
		          />
		        </View> */}
		        {/* <View style={styles.top_polosa}>

		        </View> */}

						<View style={{elevation:4,backgroundColor:'crimson', height:60,flexDirection: 'row'}}>
							<TouchableOpacity
								style={{width:60,alignItems: 'center',justifyContent:'center',height:60,}}
								onPress={() => this.props.navigation.navigate('Главная')}
								>
								<Icon name='md-arrow-back' style={{color: 'white'}}/>
							</TouchableOpacity>

							<View style={{flex:1,justifyContent:'center'}}>
								<Text style={{color:'white',textAlign:'center', fontWeight:'bold', fontSize:20}}>ГАРАЖ</Text>
							</View>
							<View style={{width: 60}}>

							</View>
						</View>

						<View>

						<DiffImage num={this.state.di}/>
						{/* <View style={styles.top_polosa}>
							<Text style={styles.top_polosa_text}>ГАРАЖ</Text>
		        </View> */}


						{/* <SliderAutos loginData = {this.state.loginData} makes = {this.state.makes} phpsessid={this.state.phpsessid}/> */}
						<View style={styles.slider}>

							<Swiper style={styles.wrapper} showsButtons={this.state.ready} showsPagination={false} loop={false} onIndexChanged={(index)=>this.setState({sliderIndex: index})}>

								{this.state.loginData.AUTOS.map((item, i) =>
									<View key={item.id_site} style={{flex:1}}>
										<View key={item.id_site} style={styles.slide}>
											<Image

												style={this.state.avatarSource[i] == null ? styles.avatarEmpty : styles.avatar}
												source={this.state.avatarSource[i] == null ? require('../../../img/default_auto.png') : this.state.avatarSource[i]}
												//source={require('../../../img/default_auto.png')}
											/>

											<View style={{flex:4,alignItems:'center'}}>
											</View>
											{/* backgroundColor: 'rgba(200, 200, 200, 0.6)', */}
											<View style={{ flex:1, flexDirection: 'row'}}>
													<View style={{flex:5, justifyContent:'center'}}>
														<Text style={this.state.avatarSource[i] == null ? styles.text: styles.textw}>{this.makemodel_text(item.id_make,item.id_model)}</Text>
													</View>
													<TouchableOpacity
														style={{flex:1,marginLeft:45}}
														onPress={() => this.avatar(i)}  >
														<Icon name='camera'
															style={this.state.avatarSource[i] == null ? styles.text2 : styles.text3}
														/>

													</TouchableOpacity>
											</View>
											<View style={{flex:1, flexDirection: 'row'}}>
													<View style={{flex:5, justifyContent:'center'}}>
														<Text style={this.state.avatarSource[i] == null ? styles.textVin : styles.textVin2}>{item.vin}</Text>
													</View>
													<View style={{flex:1,justifyContent:'center',alignItems:'center'}} >
														{/* <Icon name='md-cog' style={this.state.avatarSource[i] == null ? styles.text2 : styles.text3}/> */}
													</View>
											</View>
									</View>

									</View>
								)}




							</Swiper>
						</View>
						{/* <Icon name='md-cog' style={styles.cog}/> */}
						<View style={styles.wrapperCircle}>

							<View style={styles.circle} >
								<TouchableOpacity onPress={() => this.setState({ isModalVisible: true, modal_id_site: this.state.loginData.AUTOS[this.state.sliderIndex].id_site })}>
									<Icon name='md-cog' style={styles.cog}/>
								</TouchableOpacity>
							</View>
						</View>
						<View style={{height:180,  marginTop: 30, flexDirection:'row'}}>
							<View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
								<TouchableOpacity style={{alignItems:'center',paddingHorizontal:10}} onPress={() => this.diffImageChange()}>
									<View style={styles.circleServiceBook}>
										<Icon name='md-bookmarks' style={styles.serviceBook}/>
									</View>
									<Text style={{textAlign:'center',fontWeight:'bold',fontSize:20,color:'white'}}>Сервисная книжка</Text>

								</TouchableOpacity>


							</View>
							<View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
								<TouchableOpacity style={{alignItems:'center'}} onPress={() => this.props.navigation.navigate('Запись на сервис', {indexAuto:this.state.sliderIndex})}>
									<View style={styles.circleZapis}>
										<Icon name='md-build' style={styles.serviceBook}/>
									</View>
									<Text style={{textAlign:'center',fontWeight:'bold',fontSize:20,color:'white'}}>Записаться</Text>

								</TouchableOpacity>
							</View>

						</View>
						<View style={{height:140, marginTop: 10}}>
							<View style={{flex:2,flexDirection:'row'}}>
								<View style={{flex:10,marginLeft:10}}>
									<Text style={{fontSize:18,fontWeight:'bold',color:'white'}}>Рекомендации</Text>
								</View>
								<View style={{flex:2}}>
									<Text style={{fontSize:18,fontWeight:'bold',color:'white'}} >Все ></Text>
								</View>
							</View>
							<View style={{flex:6,borderWidth:1,backgroundColor:'white',marginVertical:10,justifyContent:'center'}}>
								<Text style={{textAlign:'center'}}>У вас нет невыполненных рекомендаций</Text>

							</View>

						</View>
						<View style={{height:140, marginTop: 30}}>
							<View style={{flex:2,flexDirection:'row'}}>
								<View style={{flex:10,marginLeft:10}}>
									<Text style={{fontSize:18,fontWeight:'bold',color:'white'}}>Напоминания</Text>
								</View>
								<View style={{flex:2}}>
									<Text style={{fontSize:18,fontWeight:'bold',color:'white'}}>Все ></Text>
								</View>
							</View>
							<View style={{flex:6,borderWidth:1,backgroundColor:'white',marginTop:10,justifyContent:'center'}}>
								<Text style={{textAlign:'center'}}>У вас нет напоминаний</Text>

							</View>

						</View>
						</View>



						<Modal style={{alignItems: 'center', justifyContent: 'center'}}
							isVisible={this.state.isModalVisible}
							animationIn= 'slideInRight'
							animationOut = 'slideOutRight'
							onBackButtonPress= {()=> this.setState({ isModalVisible: false })}
							onBackdropPress= {()=> this.setState({ isModalVisible: false })}
							>

							<View style={styles.modalView}>


								<Button style={{width:150, backgroundColor: "#ddd", alignSelf: "center", justifyContent:'center', marginBottom:10 }}  onPress={() => {this.props.defaultAuto(this.state.sliderIndex); this.setState({isModalVisible:false})}}>
									<Text style={{color:'black', fontWeight:'bold'}}>По умолчанию</Text>
								</Button>
								<Button style={{width:150, backgroundColor: "#ddd", alignSelf: "center", justifyContent:'center', marginBottom:10 }}  onPress={() => this.editAuto()}>
									<Text style={{color:'black', fontWeight:'bold'}}>Редактировать</Text>
								</Button>
								<Button style={{width:150, backgroundColor: "#ddd", alignSelf: "center",justifyContent:'center', marginBottom:40 }}  onPress={() => this.deleteAuto().done()}>
									<Text style={{color:'black', fontWeight:'bold'}} >Удалить</Text>
								</Button>
								<Button style={{ marginTop:20,width:150, backgroundColor: "#ddd", alignSelf: "center",justifyContent:'center'}}  onPress={() => this.setState({
									isModalVisible: false ,
									screen:'newAuto',
									vin: '',
									make:'',
									make_id:'',
									make_item:null,
									model:'',
									model_id:'',
									type_kuzov:'',
									year_pr:'',
									probeg:'',
								})}>
									<Text style={{color:'black', fontWeight:'bold'}} >Создать новый</Text>
								</Button>

							</View>
						</Modal>

					</ScrollView>
				);

			}



		} else if (this.state.ready && this.state.screen === 'newAuto'){
			return (
				<View style={styles.mainView} >
					<StatusBar hidden= { true } />

	        <View style={{ backgroundColor: '#dbdbdb', flexDirection: 'row'}}>
	          {/*<Text style={styles.top_polosa}> </Text>*/}

	          <Button style={{width: 56}} transparent onPress={() => this.goBack()}>
	              <Icon name='md-arrow-back' style={{color: '#5f5f5f'}}/>
	          </Button>
	          <Image
	          style={styles.stretch}
	          source={require('../../../img/logo.png')}
	          />
	        </View>
	        <View style={styles.top_polosa}>
	          <Text style={styles.top_polosa_text}>Создать новый</Text>
	        </View>

					<View style={{}}>

	          {/*<Item style={{marginBottom: 8}} floatingLabel last>
	            <Label style={{color:'#000'}}> VIN или номер кузова</Label>
							<Input
								style={{color:'#000',fontWeight:'bold'}}
								value = {this.state.vin}
								onChangeText={vin => this.setState({ vin })}
							/>

	          </Item>*/}
						<Text style={{marginTop: 20,marginLeft:10,fontSize:12}}>VIN или номер кузова</Text>
						<View style={{ marginBottom:30, 
													flexDirection: 'row', alignItems: 'center', 
													borderWidth:1,borderColor:'black',
													marginHorizontal:10
												}}>
							{/*<Text style={{ flex: 2, fontSize:16, fontWeight: 'bold'}}>VIN или номер кузова: </Text>*/}

	            <TextInput style={{flex: 3, height: 40, fontSize: 18,paddingHorizontal: 20}}
	              value = {this.state.vin}
	              onChangeText={vin => this.setState({ vin })}
	              placeholder = 'VIN или номер кузова'
	              underlineColorAndroid = 'transparent'
	              placeholderTextColor = 'black'
	            />
						</View>

          <TouchableOpacity style={{marginHorizontal:15,marginBottom:20,marginVertical: 5,flexDirection:'row'  }}  onPress={() => this.setState({screen: 'newAutoExt'})}>
            <View style={{flex:1,justifyContent: 'center'}}>
              <Text style={{fontSize:16, color:'crimson',textAlign:'center'}}>Пропустить</Text>
            </View>
          </TouchableOpacity>

	          <Button style={{ width:150, backgroundColor: "#ddd", alignSelf: "center",justifyContent:'center'}}  onPress={() => this.checkVin().done()}>
	              <Text style={{color:'black', fontWeight:'bold'}}>Далее</Text>
	          </Button>
	        </View>


					<Modal isVisible={this.state.isModalVisible}>
										<View style={{ flex: 1 }}>
											<Text>Hello!</Text>
										</View>
						</Modal>



				</View>
      );

		} else if (this.state.ready && this.state.screen === 'make'){
			return  (
				<View>
					<StatusBar hidden= { true } />




	        <View style={{ backgroundColor: '#dbdbdb', flexDirection: 'row'}}>
	          {/*<Text style={styles.top_polosa}> </Text>*/}

	          <Button style={{width: 56}} transparent onPress={() => this.setState({screen:this.state.screenBack})}>
	              <Icon name='md-arrow-back' style={{color: '#5f5f5f'}}/>
	          </Button>
	          <Image
	          style={styles.stretch}
	          source={require('../../../img/logo.png')}
	          />
	        </View>
	        <View style={{marginBottom: 20 ,backgroundColor: 'lightgray'}}>
	          <Text style={{ textAlign: 'center'}}>Выберите марку</Text>
	        </View>
					<FlatList
						style={styles.flatHeight}
					  data={this.state.makes}
						keyExtractor={this._keyExtractor}
					  renderItem={({item}) =>
						<Button style={{ paddingLeft:2,  marginBottom:3, backgroundColor: "#fff", alignSelf: "center",justifyContent:'center'}}  onPress={() => this.setState({screen:this.state.screenBack,make:item.name, make_id:item.id, make_item: item})}>
							<Text style={{flex:1,textAlign:'center'}}>{item.name}</Text>
						</Button>
						}
					/>

				</View>

		);

	} else if (this.state.ready && this.state.screen === 'kuzov'){
		return  (
			<View>
				<StatusBar hidden= { true } />




				<View style={{ backgroundColor: '#dbdbdb', flexDirection: 'row'}}>
					{/*<Text style={styles.top_polosa}> </Text>*/}

					<Button style={{width: 56}} transparent onPress={() => this.setState({screen:this.state.screenBack})}>
							<Icon name='md-arrow-back' style={{color: '#5f5f5f'}}/>
					</Button>
					<Image
					style={styles.stretch}
					source={require('../../../img/logo.png')}
					/>
				</View>
				<View style={{marginBottom: 20 ,backgroundColor: 'lightgray'}}>
					<Text style={{ textAlign: 'center'}}>Выберите кузов</Text>
				</View>
				<FlatList
					style={styles.flatHeight}
					data={this.state.kuzov_ar}
					keyExtractor={this._keyExtractor}
					renderItem={({item}) =>
					<Button style={{ paddingLeft:2,  marginBottom:3, backgroundColor: "#fff", alignSelf: "center",justifyContent:'center'}}  onPress={() => this.setState({screen:this.state.screenBack,type_kuzov:item.name})}>
						<Text style={{flex:1,textAlign:'center'}}>{item.name}</Text>
					</Button>
					}
				/>






			</View>

	);


	} else if (this.state.ready && this.state.screen === 'model' && this.state.make_item != null){

			return  (
			<View>
				<StatusBar hidden= { true } />




				<View style={{ backgroundColor: '#dbdbdb', flexDirection: 'row'}}>
					{/*<Text style={styles.top_polosa}> </Text>*/}

					<Button style={{width: 56}} transparent onPress={() => this.setState({screen:this.state.screenBack})}>
							<Icon name='md-arrow-back' style={{color: '#5f5f5f'}}/>
					</Button>
					<Image
					style={styles.stretch}
					source={require('../../../img/logo.png')}
					/>
				</View>
				<View style={{marginBottom: 20 ,backgroundColor: 'lightgray'}}>
					<Text style={{ textAlign: 'center'}}>Выберите модель</Text>
				</View>

				<FlatList
					style={styles.flatHeight}
					data={this.state.make_item.models}
					keyExtractor={this._keyExtractor}
					renderItem={({item}) =>
					<Button style={{ paddingLeft:2,  marginBottom:3, backgroundColor: "#fff", alignSelf: "center",justifyContent:'center'}}  onPress={() => this.setState({screen:this.state.screenBack,model:item.name, model_id:item.id})}>
						<Text style={{flex:1,textAlign:'center'}}>{item.name}</Text>
					</Button>
					}
				/>







			</View>

			);
		} else if (this.state.ready && this.state.screen === 'newAutoExt'){
			return (
				<ScrollView style={styles.mainView}>
					<StatusBar hidden= { true } />

	        <View style={{ backgroundColor: '#dbdbdb', flexDirection: 'row'}}>
	          {/*<Text style={styles.top_polosa}> </Text>*/}

	          <Button style={{width: 56}} transparent onPress={() => this.setState({screen:'newAuto'})}>
	              <Icon name='md-arrow-back' style={{color: '#5f5f5f'}}/>
	          </Button>
	          <Image
	          style={styles.stretch}
	          source={require('../../../img/logo.png')}
	          />
	        </View>
	        <View style={styles.top_polosa}>
	          <Text style={styles.top_polosa_text}>Создать новый</Text>
	        </View>

					<View style={{}}>
						<Form>

							{/*<Item style={{marginBottom: 8}} floatingLabel last>
		            <Label style={{color:'#000'}}> VIN или номер кузова</Label>
								<Input
									style={{color:'#000'}}
									value = {this.state.vin}
									onChangeText={vin => this.setState({ vin })}
								/>

		          </Item>*/}
							<Text style={{marginTop: 20,marginLeft:10,fontSize:12}}>VIN или номер кузова</Text>
							<View style={{ marginBottom:15, 
													flexDirection: 'row', alignItems: 'center', 
													borderWidth:1,borderColor:'black',
													marginHorizontal:10
												}}>


								{/*<Text style={{ flex: 2, fontSize:16, fontWeight: 'bold'}}>VIN или номер кузова: </Text>*/}

		            <TextInput style={{flex: 3, height: 40, fontSize: 18,paddingHorizontal:20}}
		              value = {this.state.vin}
		              onChangeText={vin => this.setState({ vin })}
		              underlineColorAndroid= 'transparent'
		              placeholder = 'VIN или номер кузова'
		              placeholderTextColor = 'black'
		            />
							</View>





							<Text style={{marginTop: 10,marginLeft:10,fontSize:12}}>Марка автомобиля</Text>
							<TouchableOpacity
								style={{borderWidth:1,borderColor:'black',
													marginHorizontal:10,flex:1,height:40,
													justifyContent:'center',
													}}
								onPress={() => this.setState({screen:'make',model:'',screenBack:'newAutoExt'})}  >
								<Text style={{fontSize:18, color:'black',paddingLeft:20}}>{this.state.make===''? 'Марка автомобиля' : this.state.make}</Text>
							</TouchableOpacity>
							<View
							  style={{
									marginTop: 10,
							    borderBottomColor: 'white',
							    borderBottomWidth: 0.7,
							  }}
							/>
							
							<Text style={{marginTop: 10,marginLeft:10,fontSize:12}}>Модель автомобиля</Text>
							<TouchableOpacity
								style={{borderWidth:1,borderColor:'black',
													marginHorizontal:10,flex:1,height:40,
													justifyContent:'center',}}
								onPress={() => this.chooseModel('newAutoExt')}  >
								<Text style={{fontSize:18, color:'black',paddingLeft:20}}>{this.state.model===''? 'Модель автомобиля' : this.state.model}</Text>
							</TouchableOpacity>
							

							<Text style={{marginTop: 25,marginLeft:10,fontSize:12}}>Тип кузова</Text>
							<TouchableOpacity
								style={{borderWidth:1,borderColor:'black',
													marginHorizontal:10,flex:1,height:40,
													justifyContent:'center',}}
								onPress={() => this.setState({screen:'kuzov',screenBack:'newAutoExt'})}  >
								<Text style={{fontSize:18, color:'black',paddingLeft:20}}>{this.state.type_kuzov===''? 'Тип кузова' : this.state.type_kuzov}</Text>
							</TouchableOpacity>
							<View
							  style={{
									marginTop: 10,
							    borderBottomColor: 'white',
							    borderBottomWidth: 0.7,
							  }}
							/>


							<Text style={{marginTop: 15,marginLeft:10,fontSize:12}}>Год выпуска</Text>

							<View style={{marginBottom: 15, flexDirection: 'row', alignItems: 'center',
													borderWidth:1,borderColor:'black',
													marginHorizontal:10}}>

		            <TextInput style={{flex: 3, height: 40, fontSize: 18,paddingHorizontal:20}}
		              value = {this.state.year_pr}
		              onChangeText={year_pr => this.setState({ year_pr })}
		              underlineColorAndroid= 'transparent'
		              placeholder = 'Год выпуска'
		              placeholderTextColor = 'black'
		            />
							</View>
							


							{/*<Item style={{}} floatingLabel last>
	            	<Label style={{color:'#000'}}> Год выпуска</Label>
								<Input style={{color:'#000'}}
									keyboardType = {'numeric'}
									maxLength = {4}
									value = {this.state.year_pr}
									onChangeText={year_pr => this.setState({ year_pr })}
								/>
	          	</Item>*/}

							{/*<Item style={{marginTop:10 }} floatingLabel last>
	            	<Label style={{color:'#000'}}> Пробег</Label>
								<Input style={{color:'#000'}}
									keyboardType = {'numeric'}
									maxLength = {7}
									value = {this.state.probeg}
									onChangeText={probeg => this.setState({ probeg })}
								/>
	          	</Item>*/}




						</Form>

						<Button style={{ marginTop:15, width:150, backgroundColor: "#ddd", alignSelf: "center",justifyContent:'center'}}  onPress={() => this.saveNewAuto().done()}>
								<Text style={{color:'black', fontWeight:'bold'}}>Сохранить</Text>
						</Button>


	        </View>






				</ScrollView>
      );

		} else if (this.state.ready && this.state.screen === 'editAuto'){
			return (
				<ScrollView style={styles.mainView}>
					<StatusBar hidden= { true } />

	        <View style={{ backgroundColor: '#dbdbdb', flexDirection: 'row'}}>
	          {/*<Text style={styles.top_polosa}> </Text>*/}

	          <Button style={{width: 56}} transparent onPress={() => this.setState({screen:'garage'})}>
	              <Icon name='md-arrow-back' style={{color: '#5f5f5f'}}/>
	          </Button>
	          <Image
	          style={styles.stretch}
	          source={require('../../../img/logo.png')}
	          />
	        </View>
	        <View style={styles.top_polosa}>
	          <Text style={styles.top_polosa_text}>Редактирование</Text>
	        </View>
	        
					<View style={{}}>
						
						<Form>

							<Text style={{marginTop: 20,marginLeft:10,fontSize:12}}>VIN или номер кузова</Text>
							<View style={{ flexDirection: 'row', alignItems: 'center',
													borderWidth:1,borderColor:'black',
													marginHorizontal:10}}>
								{/*<Text style={{ flex: 2, fontSize:16, fontWeight: 'bold'}}>VIN или номер кузова: </Text>*/}

		            <TextInput style={{flex: 3, height: 40, fontSize: 18,paddingHorizontal:20}}
		              value = {this.state.vin}
		              onChangeText={vin => this.setState({ vin })}
		              underlineColorAndroid= 'transparent'
		              placeholder = 'VIN или номер кузова'
		              placeholderTextColor = 'black'
		            />
							</View>





							<Text style={{marginTop: 20,marginLeft:10,fontSize:12}}>Марка автомобиля</Text>
							<TouchableOpacity
								style={{borderWidth:1,borderColor:'black',
													marginHorizontal:10,flex:1,height:40,
													justifyContent:'center',}}
								onPress={() => this.setState({screen:'make',model:'',screenBack:'editAuto'})}  >
								<Text style={{fontSize:18, color:'black',paddingLeft:20}}>{this.state.make===''? 'Марка автомобиля' : this.state.make}</Text>
							</TouchableOpacity>
							<View
							  style={{
									marginTop: 10,
							    borderBottomColor: 'white',
							    borderBottomWidth: 0.7,
							  }}
							/>
							
							<Text style={{marginTop: 10,marginLeft:10,fontSize:12}}>Модель автомобиля</Text>
							<TouchableOpacity
								style={{borderWidth:1,borderColor:'black',
													marginHorizontal:10,flex:1,height:40,
													justifyContent:'center',}}
								onPress={() => this.chooseModel('editAuto')}  >
								<Text style={{fontSize:18, color:'black',paddingLeft:20}}>{this.state.model===''? 'Модель автомобиля' : this.state.model}</Text>
							</TouchableOpacity>
							
							<Text style={{marginTop: 20,marginLeft:10,fontSize:12}}>Тип кузова</Text>
							<TouchableOpacity
								style={{borderWidth:1,borderColor:'black',
													marginHorizontal:10,flex:1,height:40,
													justifyContent:'center',}}
								onPress={() => this.setState({screen:'kuzov',screenBack:'editAuto'})}  >
								<Text style={{fontSize:18, color:'black',paddingLeft:20}}>{this.state.type_kuzov===''? 'Тип кузова' : this.state.type_kuzov}</Text>
							</TouchableOpacity>
							<View
							  style={{
									marginTop: 10,
							    borderBottomColor: 'white',
							    borderBottomWidth: 0.7,
							  }}
							/>

							<Text style={{marginTop: 10,marginLeft:10,fontSize:12}}>Год выпуска</Text>
							<View style={{marginBottom: 15, flexDirection: 'row', alignItems: 'center',
													borderWidth:1,borderColor:'black',
													marginHorizontal:10}}>
								{/*<Text style={{ flex: 2, fontSize:16, fontWeight: 'bold'}}>Год выпуска: </Text>*/}

		            <TextInput style={{flex: 3, height: 40, fontSize: 18,paddingHorizontal:20}}
		              value = {this.state.year_pr}
		              onChangeText={year_pr => this.setState({ year_pr })}
		              underlineColorAndroid= 'transparent'
		              placeholder = 'Год выпуска'
		              placeholderTextColor = 'black'
		            />
							</View>


						</Form>

						<Button style={{ marginTop:10, width:150, backgroundColor: "#ddd", alignSelf: "center",justifyContent:'center'}}  onPress={() => this.saveEditAuto().done()}>
								<Text style={{color:'black', fontWeight:'bold'}}>Сохранить</Text>
						</Button>


	        </View>



				</ScrollView>
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
const mapStateToProps = state => {
    return {
        countOpened: state.countOpened,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        defaultAuto: (id) => dispatch(defaultAutoAction(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Garage);


