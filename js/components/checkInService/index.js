import React, { Component } from "react";
import { TouchableOpacity, ScrollView, TextInput, ActivityIndicator, ListView,
	Image, View, StatusBar, FlatList } from "react-native";
import { AsyncStorage, Request, StyleSheet, Text, ToolbarAndroid,
	Alert, TouchableWithoutFeedback, TouchableHighlight, Platform } from 'react-native';
import {Input, Label, Item, Container, Button, Icon} from 'native-base'  ;
import {TextInputMask} from 'react-native-masked-text';
import Swiper from 'react-native-swiper';
import ChooseAuto from "./chooseAuto";
import ChooseServices from "./chooseServices";
import ChooseServiceStation from "./chooseServiceStation";
import ChooseDateTime from "./chooseDateTime";
import styles from "./styles";
import {newsOneToFalseAction,setActionZapisToFalseAction} from "../actions";

import {connect} from "react-redux";


class Checkbox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			checked:this.props.checked
		}


	}

	checkItem() {
		this.props.callbackFromParent(this.props.id);
		this.setState({checked:true})
	}


	render() {
		if (this.state.checked ) {
			return(
				<View>
					<Icon style={{fontSize: 28,color: 'crimson'}}
						name='md-radio-button-on'/>
				</View>
			);
		} else {
			return(
				<View  >
					<Icon style={{fontSize: 28,color: 'crimson'}}
						name='md-radio-button-off'/>
				</View>
			);

		}
	}
}

class CheckInService extends Component {
	constructor(props) {
    super(props);
    //let tStep =1;
    //let tSelectedIndexAuto = -1;



    let tStep = 2;
    let tSelectedIndexAuto = this.props.defaultAuto;

    this.state = {
			services: [],
			comment:'',
			indexAuto:0,
			selectedIndexAuto:tSelectedIndexAuto,
			loginData: null,
			phpsessid:'',
			makes:null,
			avatarSource: [],
			selectService:0,
			selectedGroup:null,
			selectedServices:[],
			address:0,
			ready:false,
			step:tStep,
			ss:-1,
			checked:'',
			selectedDate:'',
			selectedTime:'',
			error: null

			};
	}


	componentWillMount() {

		const {state} = this.props.navigation;
		
		if (typeof(state.params) != 'undefined' && typeof(state.params.indexAuto) != 'undefined') {
			
			if (state.params.indexAuto > 0 ||state.params.indexAuto === 0) {
				this.setState({step:2, selectedIndexAuto:state.params.indexAuto});
			}
			//this.props.navigation.setParams({ title: ld.NAME })
			const {setParams} = this.props.navigation;
			setParams({indexAuto: ''});
		}

		this.getPhpsessid().done( ()=>{
			this.getLoginDataFromStorage().done(() => {
				this.getMakesFromStorage().done(()=> {
					this.getServicesFromSite().done(()=>{
						if (this.state.loginData != null) {
              if (this.props.actionZapis) {
                this.state.services.forEach((item,i) => {

                  item.services.forEach((item2,i2) => {

                    if (item2.id === this.props.serviceId) {

                      let selectedServicesT =[];
                      selectedServicesT.push(item2);
                      this.setState({selectedServices:selectedServicesT});
                    }
                  });
                });
                this.props.actionZapisToFalse();

              }
							this.setState({ ready: true});



						} else {
							this.props.navigation.navigate('Профиль');
						}

					});


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
	async getPhpsessid() {
		const result = await AsyncStorage.getItem('phpsessid');
		const phpsessid_temp = await JSON.parse(result);
		if (phpsessid_temp != null) {
			this.setState({phpsessid: phpsessid_temp});
			
		}

	}
	async getLoginDataFromStorage() {
		result = await AsyncStorage.getItem('loginData')
			let loginData_temp = await JSON.parse(result);
			if (loginData_temp != null) {
				
				
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
	async getAvatars() {
		const result = await AsyncStorage.getItem('avatarSource');
		const res = await JSON.parse(result);
		if (res != null) {
			this.setState({avatarSource: res});
		}
	}

	addService() {
		let selServ = this.state.selectedServices;
		for (var i = 0; i < this.state.selectedGroup.services.length; i++) {
			if (this.state.selectedGroup.services[i].id === this.state.checked) {
				selServ.push(this.state.selectedGroup.services[i]);
			}
		}


		this.setState({selectedServices:selServ,selectService:0,checked:''})
	}

	checkInServ(item) {
		this.setState({ss:item.id})

	}

	checkCheckbox(id) {
		//this.setState({checked:id});
		// let temp = this.state.selectedGroup;
		// temp.services[0].tempId= id;

		this.setState({checked:id})
		
		let ttemp=0
		for (var i = 0; i < this.state.selectedGroup.services.length; i++) {
			if (this.state.selectedGroup.services[i].id === id) {
				ttemp=i;
			}
		}





	}

	async getServicesFromSite() {
		var urlServices = "http://auto-club42.ru/android/user.php?action=services&phpsessid=" + this.state.phpsessid;
		const response = await fetch(urlServices);
		const json = await response.json();
		if (json.status === "failed") {
			if (this.state.loginData != null) {
				//Alert.alert ('Ошибка', 'ошибка загрузки услуг');
			}

		}
		if (json.status === "success") {
			await AsyncStorage.setItem('services', JSON.stringify(json.services));

			let ttserv = json.services;
			ttserv.push({name:'Другие услуги', id:'111',services:[]});
			this.setState({services:ttserv});
		}

	}



	async zapisOchered() {
		let autoIndex = 0;
		if (this.state.selectedIndexAuto >= 0) {
			autoIndex = this.state.selectedIndexAuto;
			}

		let yeartt = String(this.state.selectedDate.getFullYear());
		let monthtt = ("0" + String(this.state.selectedDate.getMonth()+1)).slice(-2);
		let datett = ("0" + String(this.state.selectedDate.getDate())).slice(-2);

		let autoT = null;
		if (this.state.loginData.AUTOS)
		{
			autoT = this.state.loginData.AUTOS[autoIndex].id_site;
		}
		else
		{
			Alert.alert('Ошибка', 'Выберите автомобиль');
			return;
		}		

		//const datetime = '14.12.2017 19:00';
		const datetime = datett +"."+monthtt+ "."+yeartt + " " + this.state.selectedTime;
		
		const service_addr = this.state.address;
		let selServices = this.state.selectedServices.map((item, i) => item.id).join('|');
		const zapis = {
			auto: autoT,
			services: selServices,
			datetime: datetime,
			address: service_addr,
			comment: ' Дополнительная услуга: ' + this.state.comment,
		}

		const response = await fetch ('http://auto-club42.ru/android/user.php?action=zapisochered&phpsessid=' + this.state.phpsessid, {
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
	

	callbackIndexAuto = (dataFromChild) => {

			if (dataFromChild.indexAuto == 150) {

				this.props.navigation.navigate('Гараж',{addAuto: 'Запись на сервис'})
			} else {
				this.setState({
					indexAuto: dataFromChild.indexAuto,
					selectedIndexAuto: dataFromChild.selectedIndexAuto,
					step:2
				});

			}

  }

	callbackSelectService = (dataFromChild) => {
					
			  	
					if (dataFromChild.ds<0) {
						this.setState({
							selectService: dataFromChild.selectService,
							step:dataFromChild.step,
						});

					} else {
						let ttt=this.state.selectedServices;

						ttt.splice(dataFromChild.ds,1);
						this.setState({selectedServices:ttt,step:dataFromChild.step})
					}


	}

	callbackSelectServiceAddress = (dataFromChild) => {

	        this.setState({
						address: dataFromChild,
						step:4 ,
					});
					

	}

	callbackCheckboxx = (dataFromChild) => {
					this.setState({
						checked: dataFromChild,

					});


	}

	callbackSelectDateTime = (dataFromChild) => {
		if (dataFromChild.ready === 0) {
			this.setState({
				selectedDate: dataFromChild.date,
				selectedTime: dataFromChild.time,
				step:dataFromChild.step,

			});

		} else {
			
			setTimeout(() => {
				
	      this.scrollviewRef.scrollToEnd({animated: true});
	    }, 50);

		}
	}

	_keyExtractor = (item, index) => item.id;

	autoIsSelected() {
		
		if (this.state.step > 1) {
			return (
				<View>
					<View style={{height:60, flexDirection: 'row'}}>
						<View style={{margin: 10,width:40,borderRadius: 50, backgroundColor: 'crimson',alignItems: 'center',justifyContent: 'center'}}>
							<Icon style={{fontSize: 20,color: 'white'}} name='md-checkmark'/>

						</View>
						<View style={{justifyContent: 'center'}}>
							<Text style={{fontSize: 20,color: 'black', fontWeight:'bold'}}>Выбор автомобиля</Text>

						</View>
					</View>

					<ChooseAuto
						callbackFromParent={this.callbackIndexAuto}
						selectedIndexAuto={this.state.selectedIndexAuto}
						indexAuto={this.state.indexAuto}
						loginData={this.state.loginData}
						avatarSource={this.state.avatarSource}
						makes={this.state.makes}
						step={this.state.step}
					/>
				</View>
			);
		}
		return (
			<View>
				<View style={{height:60, flexDirection: 'row'}}>
					<View style={{margin: 10,width:40,borderRadius: 50, backgroundColor: 'crimson',alignItems: 'center',justifyContent: 'center'}}>
						<Text style={{fontSize: 20,color: 'white'}} >1</Text>
					</View>
					<View style={{justifyContent: 'center'}}>
						<Text style={{fontSize: 20,color: 'black',fontWeight:'bold'}}>Выбор автомобиля</Text>

					</View>
				</View>
				<ChooseAuto
					callbackFromParent={this.callbackIndexAuto}
					selectedIndexAuto={this.state.selectedIndexAuto}
					indexAuto={this.state.indexAuto}
					loginData={this.state.loginData}
					avatarSource={this.state.avatarSource}
					makes={this.state.makes}
					step={this.state.step}
				/>
			</View>
		);
	}
	servicesAreSelected() {

		if (this.state.step < 2) {
			tcolor = 'gray';
		} else {
			tcolor = 'crimson';
		}

		if (this.state.step > 2) {
			
		return (
			<View>
				<View style={{height:60, flexDirection: 'row'}}>
					<View style={{margin: 10,width:40,borderRadius: 50, backgroundColor: tcolor,alignItems: 'center',justifyContent: 'center'}}>
						<Icon style={{fontSize: 20,color: 'white'}} name='md-checkmark'/>
					</View>
					<View style={{justifyContent: 'center'}}>
						<Text style={{fontSize: 20,color: 'black', fontWeight:'bold'}}>Выбор услуги</Text>

					</View>
				</View>
				<View>
					<ChooseServices
						services={this.state.services}
						selectedServices={this.state.selectedServices}
						step={this.state.step}
						comment={this.state.comment}
						callbackFromParent={this.callbackSelectService}
					/>
				</View>
			</View>


		)} else  if (this.state.step === 2){
			
			return (
				<View>
					<View style={{height:60, flexDirection: 'row'}}>
						<View style={{margin: 10,width:40,borderRadius: 50, backgroundColor: tcolor,alignItems: 'center',justifyContent: 'center'}}>
							<Text style={{fontSize: 20,color: 'white'}} >2</Text>
						</View>
						<View style={{justifyContent: 'center'}}>
							<Text style={{fontSize: 20,color: 'black', fontWeight:'bold'}}>Выбор услуги</Text>

						</View>
					</View>
					<View>
						<ChooseServices
							step={this.state.step}
							comment={this.state.comment}
							services={this.state.services}
							selectedServices={this.state.selectedServices}
							callbackFromParent={this.callbackSelectService}
						/>

					</View>
				</View>


			)} else {
				return (
					<View>
						<View style={{height:60, flexDirection: 'row'}}>
							<View style={{margin: 10,width:40,borderRadius: 50, backgroundColor: tcolor,alignItems: 'center',justifyContent: 'center'}}>
								<Text style={{fontSize: 20,color: 'white'}} >2</Text>
							</View>
							<View style={{justifyContent: 'center'}}>
								<Text style={{fontSize: 20,color: 'gray', fontWeight:'bold'}}>Выбор услуги</Text>

							</View>
						</View>
					</View>
			)};


	}

	serviceAddressIsSelected() {
		if (this.state.step < 3) {
			tcolor = 'gray';
		} else {
			tcolor = 'crimson';
		}

		if (this.state.step > 3) {
		return (
			<View>
				<View style={{height:60, flexDirection: 'row'}}>
					<View style={{margin: 10,width:40,borderRadius: 50, backgroundColor: tcolor, alignItems: 'center',justifyContent: 'center'}}>
						<Icon style={{fontSize: 20,color: 'white'}} name='md-checkmark'/>
					</View>
					<View style={{justifyContent: 'center'}}>
						<Text style={{fontSize: 20,fontWeight: 'bold',color: 'black'}}>Выбор станции автосервиса</Text>

					</View>
				</View>
				<ChooseServiceStation
					step={this.state.step}
					address={this.state.address}
					callbackFromParent={this.callbackSelectServiceAddress}
				/>
			</View>


		)} else if (this.state.step === 3) {
			return (
				<View>
					<View style={{height:60, flexDirection: 'row'}}>
						<View style={{margin: 10,width:40,borderRadius: 50, backgroundColor: tcolor, alignItems: 'center',justifyContent: 'center'}}>
							<Text style={{fontSize: 20,color: 'white'}} >3</Text>
						</View>
						<View style={{justifyContent: 'center'}}>
							<Text style={{fontSize: 20,fontWeight: 'bold',color: 'black'}}>Выбор станции автосервиса</Text>

						</View>
					</View>
					<ChooseServiceStation
						step={this.state.step}
						address={this.state.address}
						callbackFromParent={this.callbackSelectServiceAddress}
					/>
				</View>
		)} else {
			return (
				<View style={{height:60, flexDirection: 'row'}}>
					<View style={{margin: 10,width:40,borderRadius: 50, backgroundColor: tcolor, alignItems: 'center',justifyContent: 'center'}}>
						<Text style={{fontSize: 20,color: 'white'}} >3</Text>
					</View>
					<View style={{justifyContent: 'center'}}>
						<Text style={{fontSize: 20,fontWeight: 'bold',color: 'gray'}}>Выбор станции автосервиса</Text>

					</View>
				</View>
			);
		}
	}

	dateTimeIsSelected() {
		if (this.state.step < 4) {
			tcolor = 'gray';
		} else {
			tcolor = 'crimson';
		}

		if (this.state.step > 4) {
			return (
				<View>
					<View style={{height:60, flexDirection: 'row'}}>
						<View style={{margin: 10,width:40,borderRadius: 50, backgroundColor: tcolor,alignItems: 'center',justifyContent: 'center'}}>
							<Icon style={{fontSize: 20,color: 'white'}} name='md-checkmark'/>
						</View>
						<View style={{justifyContent: 'center'}}>
							<Text style={{fontSize: 20,fontWeight: 'bold',color: 'black'}}>Выбор даты и времени</Text>
						</View>
					</View>
					<ChooseDateTime callbackFromParent={this.callbackSelectDateTime}/>
				</View>

			);

		} else if (this.state.step === 4) {
			return (
				<View>
					<View style={{height:60, flexDirection: 'row'}}>
						<View style={{margin: 10,width:40,borderRadius: 50, backgroundColor: tcolor,alignItems: 'center',justifyContent: 'center'}}>
							<Text style={{fontSize: 20,color: 'white'}} >4</Text>
						</View>
						<View style={{justifyContent: 'center'}}>
							<Text style={{fontSize: 20,fontWeight: 'bold',color: 'black'}}>Выбор даты и времени</Text>
						</View>
					</View>
					<ChooseDateTime callbackFromParent={this.callbackSelectDateTime}/>
				</View>

			);

		} else {
			return (
				<View>
					<View style={{height:60, flexDirection: 'row'}}>
						<View style={{margin: 10,width:40,borderRadius: 50, backgroundColor: tcolor,alignItems: 'center',justifyContent: 'center'}}>
							<Text style={{fontSize: 20,color: 'white'}} >4</Text>
						</View>
						<View style={{justifyContent: 'center'}}>
							<Text style={{fontSize: 20,fontWeight: 'bold',color: 'gray'}}>Выбор даты и времени</Text>

						</View>
					</View>
				</View>

			);

		}
	}


	render() {
	    //console.log(this.state);
        //console.warn(this.state.selectedServices);
        //console.warn(this.state.selectedGroup);

		
		if (this.state.address > 0 && this.state.step === 3) {
			this.setState({step:4});
		}
		

    if (this.state.ready && this.state.selectService===0) {



      return (
			<View style={{flex:1}}>
				<StatusBar hidden= { true } />
			<View style={{elevation:4,backgroundColor:'crimson', height:60,flexDirection: 'row'}}>
				<TouchableOpacity
					style={{width:60,alignItems: 'center',justifyContent:'center',height:60,}}
					onPress={() => this.props.navigation.navigate('Главная')}
					>
					<Icon name='md-arrow-back' style={{color: 'white'}}/>
				</TouchableOpacity>

				<View style={{flex:1,justifyContent:'center'}}>
					<Text style={{color:'white',textAlign:'center', fontWeight:'bold', fontSize:20}}>ЗАПИСЬ НА СЕРВИС</Text>
				</View>
				<View style={{width: 60}}>

				</View>
			</View>
      <ScrollView
				ref={(ref) => { this.scrollviewRef = ref; }}
				style={{flex:1}}
				>
				{/* <Image style={{ height: 960, width: 360, position: 'absolute', left:0 }} source={require('../../../img/backgroundWhite.png')} /> */}
				<View>
					{this.autoIsSelected()}
				</View>

				<View style={{ }}>
					{this.servicesAreSelected()}

				</View>

				<View style={{}}>
					{this.serviceAddressIsSelected()}


				</View>
				<View style={{}}>
					{this.dateTimeIsSelected()}

				</View>
				{this.state.step === 5
					?
					<View style={{}}>
						<Button
							style={{ paddingLeft:2,  marginBottom:3, backgroundColor: "crimson", alignSelf: "center",justifyContent:'center'}}
							onPress={() => this.zapisOchered().done()}
							>
							<Text style={{flex:1,fontSize: 20,textAlign:'center',fontWeight:'bold',color:'white'}}>ЗАПИСАТЬСЯ</Text>
						</Button>

					</View>
					:
					<View/>
				}




      </ScrollView>
			</View>
      );

		} else if (this.state.ready && this.state.selectService===1) {
			return(
				<View style={{flex:1}}>
					<StatusBar hidden= { true } />
					<View style={{elevation:4, backgroundColor:'crimson', height:60,flexDirection: 'row'}}>
						<TouchableOpacity
							style={{width:60,alignItems: 'center',justifyContent:'center',height:60,}}
							onPress={() => this.setState({selectService:0})}
							>
							<Icon name='md-arrow-back' style={{color: 'white'}}/>
						</TouchableOpacity>

						<View style={{flex:1,justifyContent:'center'}}>
							<Text style={{color:'white',textAlign:'center', fontWeight:'bold', fontSize:20}}>Выберите группу услуг</Text>
						</View>
						<View style={{width: 60}}>

						</View>
					</View>

					<View style={{flex:1}}>
						<Image style={styles.imageContainer} source={require('../../../img/backgroundWhite.png')} />
						<FlatList
							style={styles.flatHeight}
						  data={this.state.services}
							keyExtractor={this._keyExtractor}
						  renderItem={({item}) =>

							<TouchableWithoutFeedback onPress={() =>  this.setState({selectService:2,selectedGroup:item})}>
								<View style={{flexDirection:'row',justifyContent:'center',marginHorizontal:5,marginBottom:20}}>
									<View style={{width:50,height:50,borderRadius:50,backgroundColor:'crimson',alignItems:'center',justifyContent:'center'}}>
										<Icon name='md-build' style={{color:'white'}}/>
									</View>
									<View style={{marginLeft:10, flex:1,justifyContent:'center'}}>
										<Text style={{color:'black',fontWeight:'bold',fontSize:20}}>{item.name}</Text>
									</View>
								</View>

							</TouchableWithoutFeedback>




							}
						/>

					</View>

				</View>
				);
		} else if (this.state.ready && this.state.selectService===2) {

			let selServ=[]

			let selGroup = {
				name:this.state.selectedGroup.name,
				id:this.state.selectedGroup.id,
				services:[],
			}
			for (var i = 0; i < this.state.selectedGroup.services.length; i++) {
				let serv1 = {
					name: this.state.selectedGroup.services[i].name,
					id: this.state.selectedGroup.services[i].id,
					service_addr: this.state.selectedGroup.services[i].service_addr,
					action: this.state.selectedGroup.services[i].action,
					dop_info: this.state.selectedGroup.services[i].dop_info,
					price: this.state.selectedGroup.services[i].price,
					sale_price: this.state.selectedGroup.services[i].sale_price,
					show_sale: this.state.selectedGroup.services[i].show_sale,
					sale: this.state.selectedGroup.services[i].sale,
					checked: false
				}
				selServ.push(serv1);


			}
			selGroup.services=selServ;


			
			let tempChecked='';


			if (this.state.selectedGroup.id === '111') {
				return(
					<View style={{flex:1}}>
						<StatusBar hidden= { true } />

						<View style={{elevation:4,backgroundColor:'crimson', height:60,flexDirection: 'row'}}>
							<TouchableOpacity
								style={{width:60,alignItems: 'center',justifyContent:'center',height:60,}}
								onPress={() => this.setState({selectService:1,checked:''})}
								>
								<Icon name='md-arrow-back' style={{color: 'white'}}/>
							</TouchableOpacity>

							<View style={{flex:1,justifyContent:'center'}}>
								<Text style={{color:'white',textAlign:'center', fontWeight:'bold', fontSize:20}}>Другие услуги</Text>
							</View>
							<View style={{width: 60}}>

							</View>
						</View>

						<View style={{flex:1,marginTop: 10,paddingHorizontal: 10}}>
							<Text style={{fontSize: 20, fontWeight: 'bold',textAlign:'center'}}>Причина обращения</Text>
							<TextInput style={{height: 60, fontSize: 18,paddingHorizontal: 20}}
	              value = {this.state.comment}
	              onChangeText={comment => this.setState({ comment })}
	              placeholder = 'Введите текст обращения'
	              underlineColorAndroid = 'transparent'
	              placeholderTextColor = 'black'
								multiline = {true}
								blurOnSubmit = {true}
         				numberOfLines = {1}

	            />							

							

		        </View>
						<Button
							style={{ elevation:4,paddingLeft:2,  marginTop:5, marginBottom:3, backgroundColor: "crimson", alignSelf: "center",justifyContent:'center'}}
							onPress={() => this.addService()}
							>
							<Text style={{flex:1,textAlign:'center',color:'white',fontSize:20,fontWeight:'bold'}}>ПОДТВЕРДИТЬ</Text>
						</Button>



					</View>
				);

			} else {
				return(
					<View style={{flex:1}}>
						<StatusBar hidden= { true } />

						<View style={{elevation:4,backgroundColor:'crimson', height:60,flexDirection: 'row'}}>
							<TouchableOpacity
								style={{width:60,alignItems: 'center',justifyContent:'center',height:60,}}
								onPress={() => this.setState({selectService:1,checked:''})}
								>
								<Icon name='md-arrow-back' style={{color: 'white'}}/>
							</TouchableOpacity>

							<View style={{flex:1,justifyContent:'center'}}>
								<Text style={{color:'white',textAlign:'center', fontWeight:'bold', fontSize:20}}>Выберите услугу</Text>
							</View>
							<View style={{width: 60}}>

							</View>
						</View>

						<View style={{flex:1}}>
							{/* <Image style={{ height: 960, width: 360, position: 'absolute', left:0 }} source={require('../../../img/backgroundWhite.png')} /> */}

							<FlatList
								style={styles.flatHeight}
								ref={(ref) => { this.flatListRef = ref; }}
								data={this.state.selectedGroup.services}
								keyExtractor={this._keyExtractor}
								extraData={this.state}
								renderItem={({item}) =>
									<TouchableOpacity
										onPress={() => this.checkCheckbox(item.id)}
										style={{marginHorizontal:10}}>

									<View
                      style={{flexDirection:'row',justifyContent:'center'}}>
											<Text style={{flex:13,fontSize:18,color:'black',fontWeight: 'bold'}}>{item.name}</Text>
                      {this.priceBlock(item)}

											<View style={{flex:2,alignItems:'center',justifyContent:'center'}}>
												{this.state.checked === item.id
													?
													<View >
														<Icon style={{fontSize: 28,color: 'crimson'}}
															name='md-radio-button-on'/>
													</View>
													:
													<View  >
														<Icon style={{fontSize: 28,color: 'crimson'}}
															name='md-radio-button-off'/>
													</View>
												}
											</View>





									</View>
									{this.state.checked === item.id
										?
										<View>
											<Text>{item.dop_info}</Text>
										</View>
										:
										<View/>
									}
									<View style={{marginVertical:10,height:1,backgroundColor:'grey'}}/>

								</TouchableOpacity>

								}
							/>
							{this.state.checked != ''
								?
								<Button
									style={{ elevation:4,paddingLeft:2,  marginTop:5, marginBottom:3, backgroundColor: "crimson", alignSelf: "center",justifyContent:'center'}}
									onPress={() => this.addService()}
									>
									<Text style={{flex:1,textAlign:'center',color:'white',fontSize:20,fontWeight:'bold'}}>ВЫБРАТЬ УСЛУГУ</Text>
								</Button>

								:
								<Button
									disabled
									style={{ paddingLeft:2,  marginTop:5, marginBottom:3, backgroundColor: "lightgray", alignSelf: "center",justifyContent:'center'}}

									>
									<Text style={{flex:1,textAlign:'center',color:'white',fontSize:20,fontWeight:'bold'}}>ВЫБРАТЬ УСЛУГУ</Text>
								</Button>
							}



						</View>


					</View>
				);
			}


		} else {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
					<StatusBar hidden= { true } />
					<ActivityIndicator size={70} />
				</View>

      );
    }
  }

  priceBlock = (item) => {
	  if (item.show_sale === 'YES') {
	    return (
        <View style={{flex:5, justifyContent: 'center'}}>
			<View style={{ position: 'relative' }}>
		  		<Text style={{flex:1,color:'red',textAlign:'center',fontSize:14,fontWeight: 'bold'}}>{item.price} руб.</Text>
				<View style={{ position: 'absolute', width: 80, height: 3, backgroundColor: '#000', transform: [{ translateX: -40 }, { translateY: -2 }], top: '50%', left: '50%', zIndex: 2 }} />
			</View>
			<Text style={{flex:1,color:'green',textAlign:'center',fontSize:18,fontWeight: 'bold'}}>{item.sale_price} руб.</Text>
			<Text style={{flex:1,color:'black',textAlign:'center',fontSize:12}}>скидка: {item.sale}%</Text>
        </View>
      );
    }
    else {
      return (
        <View style={{flex:5, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{flex:1,color:'green',textAlign:'center',fontSize:18,fontWeight: 'bold'}}>{item.price} руб.</Text>
        </View>
      );
    }
  };

	scrollToChecked() {
		if (this.state.ready && this.state.selectService===2 && this.state.checked !='') {
			


			let ttemp=0
			for (var i = 0; i < this.state.selectedGroup.services.length; i++) {
				if (this.state.selectedGroup.services[i].id === this.state.checked) {
					ttemp=i;
				}
			}

			this.flatListRef.scrollToIndex({animated: true, index: ttemp});

		}
	}



	componentDidUpdate() {
		if (this.state.ready && this.state.selectService===2 && this.state.checked !='') {
			setTimeout(() => {
	      this.scrollToChecked();
	    }, 50);

		}
		if (this.state.ready && this.state.selectService===0) {
			setTimeout(() => {
				
	      if (this.scrollviewRef != null) {
	      	this.scrollviewRef.scrollToEnd({animated: true});
	      }
	    }, 50);

		}



	}


}

const mapStateToProps = state => {
    return {
        openNewsOne: state.openNewsOne,
        newsId: state.newsId,
        serviceId: state.serviceId,
        actionZapis: state.actionZapis,
        defaultAuto:state.defaultAuto,

    };
};

const mapDispatchToProps = dispatch => {
    return {
        newsOneToFalse: () => dispatch(newsOneToFalseAction()),
        actionZapisToFalse: () => dispatch(setActionZapisToFalseAction())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckInService);
