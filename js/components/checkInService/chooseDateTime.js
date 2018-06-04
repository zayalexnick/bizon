import React, { Component } from 'react';
import { Alert, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, ListView,
	Image, View, StatusBar, FlatList, Text, AsyncStorage } from "react-native";
// import DatePicker from 'react-native-datepicker';
import Swiper from 'react-native-swiper';
import styles from "./styles";

class ChooseDateTime extends Component {

	constructor(props){
		super(props)
		this.state = {
			selectedDate:"",
			date:new Date,
			date2:new Date,
			hours:0,
			timeB:0,
			table1:[],
			table2:[],
			months :[
			"январь",
			"февраль",
			"март",
			"апрель",
			"май",
			"июнь",
			"июль",
			"август",
			"сентябрь",
			"октябрь",
			"ноябрь",
			"декабрь"
			],
			times:[
			[{time:"09:00",id:1},
			{time:"10:00",id:2},
			{time:"11:00",id:3},
			{time:"12:00",id:4},
			{time:"13:00",id:5}],

			[{time:"14:00",id:6},
			{time:"15:00",id:7},
			{time:"16:00",id:8},
			{time:"17:00",id:9},
			{time:"18:00",id:10}],
			[{time:"19:00",id:11},
			{time:"20:00",id:12}],
			],
			selectedIdTime:0,
			selectedTime:'',
			selectedNum:0,
			ready:false,


		}
	}

	dayInMonth(dd) {
		return 32 - new Date(dd.getFullYear(), dd.getMonth(), 32).getDate();
	}

	async getDateTimeFromSite() {
		let hoursst = await AsyncStorage.getItem('hours');
		let hours = Number(hoursst);

		var url = "http://auto-club42.ru/android/user.php?action=getDateTime";
		const response = await fetch(url);
		const json = await response.json();
		if (json.status === "success") {
			let tempDate2 = new Date(json.date);
			

			
			let tempDate = new Date(json.date);
			tempH = Number(json.time.substring(0,2)) + 5 + hours;
			let hoursNew = tempH;
			
			while (hoursNew > 24) {
				tempDate.setDate(tempDate.getDate() + 1);
				hoursNew = hoursNew - 24;
			}
			if (hoursNew > 20) {
				tempDate.setDate(tempDate.getDate() + 1);
				hoursNew = 0;
				tempDate.setHours(0);
			} else if (hoursNew < 9) {
				tempDate.setHours(0);
				hoursNew = 0;
			}
			this.setState({date:tempDate,hours:hoursNew});
			
		}
	}
			



	getDateTime() {
		let table1 = [
		];
		
		const dd = this.state.date;
		const dateBeginMonth = new Date(dd.getFullYear(), dd.getMonth(), 1);
		const

		dayNedeliN = dateBeginMonth.getDay()===0 ? 6 : dateBeginMonth.getDay()-1;

		let ii = dayNedeliN;
		let tt = [];
		let ttt = [];
		let kk = 0;
		let jj =0;
		for (var i = 0; i < this.dayInMonth(dd); i++) {
			let active = false;
			if (ii>0) {
				for (var it = 0; it < ii; it++) {
					ttt[it] = {num:"",active:active}
				}
			}
			if (i+1 >= dd.getDate() && i+1 < dd.getDate() +21) {
				active = true;
			}
			if (ii+kk<7) {
				ttt[ii+kk] = {num: i+1, active:active};
				kk = kk + 1;
				if (this.dayInMonth(dd)-1 === i) {
					while (ttt.length<7) {
						ttt.push("");
					}
					tt[jj] = ttt;
				}
			} else {

				tt[jj] = ttt;
				ttt = [];
				ii=0;
				kk=0;
				jj =jj+1;
				ttt[ii+kk] = {num: i+1, active:active};
				kk=kk+1
			}



		}
		this.setState({table1: tt});

		if (dd.getDate()+21 > this.dayInMonth(dd)) {
			const dateBeginMonth2 = new Date(dd.getFullYear(), dd.getMonth()+1, 1);
			this.setState({date2:dateBeginMonth2})
			
			dayNedeliN2 = dateBeginMonth2.getDay()===0 ? 6 : dateBeginMonth2.getDay()-1;

			let ii = dayNedeliN2;
			let tt = [];
			let ttt = [];
			let kk = 0;
			let jj =0;
			for (var i = 0; i < this.dayInMonth(dateBeginMonth2); i++) {
				let active = false;
				if (ii>0) {
					for (var it = 0; it < ii; it++) {
						ttt[it] = {num:"",active:active};
					}
				}
				if (i+1+ this.dayInMonth(dd) >= dd.getDate() && i+1+ this.dayInMonth(dd) < dd.getDate() +21) {
					active = true;
				}
				if (ii+kk<7) {
					ttt[ii+kk] = {num: i+1, active:active};
					kk = kk + 1;
					if (this.dayInMonth(dateBeginMonth2)-1 === i) {
						while (ttt.length<7) {
							ttt.push("");
						}

						tt[jj] = ttt;
					}
				} else {

					tt[jj] = ttt;
					ttt = [];
					ii=0;
					kk=0;
					jj =jj+1;
					ttt[ii+kk] = {num: i+1, active:active};
					kk=kk+1
				}



			}
			this.setState({table2: tt});


		}

	}

	async componentWillMount() {
		await this.getDateTimeFromSite();
		this.getDateTime();
		this.setState({ready:true})
		this.props.callbackFromParent({ready:1});
	}

	selectDate(num,numMonth) {

		let tempDate = new Date(this.state.date);
		if (numMonth == 2) {
			tempDate = new Date(this.state.date2);
		}
		let tekDate = false;
		if (tempDate.getDate() == num) {
			tekDate = true;
			console.log(148);
		}	
		tempDate.setDate(num);
		
		let selectedDateT = tempDate;


		var timesN = [
		[{time:"09:00",id:1},
		{time:"10:00",id:2},
		{time:"11:00",id:3},
		{time:"12:00",id:4},
		{time:"13:00",id:5}],

		[{time:"14:00",id:6},
		{time:"15:00",id:7},
		{time:"16:00",id:8},
		{time:"17:00",id:9},
		{time:"18:00",id:10}],
		[{time:"19:00",id:11},
		{time:"20:00",id:12}],
		];
		
		if (tekDate) {
			if (this.state.hours > 9 &&  this.state.hours < 21) {
				let hh = this.state.hours;

				if (hh == 10) {
					timesN = [
					[{time:"10:00",id:2},
					{time:"11:00",id:3},
					{time:"12:00",id:4},
					{time:"13:00",id:5},
					{time:"14:00",id:6}],

					[{time:"15:00",id:7},
					{time:"16:00",id:8},
					{time:"17:00",id:9},
					{time:"18:00",id:10},
					{time:"19:00",id:11}],
					[{time:"20:00",id:12},
					],
					];
				}
			if (hh == 11) {
					timesN = [
					[{time:"11:00",id:3},
					{time:"12:00",id:4},
					{time:"13:00",id:5},
					{time:"14:00",id:6},
					{time:"15:00",id:7}],

					[{time:"16:00",id:8},
					{time:"17:00",id:9},
					{time:"18:00",id:10},
					{time:"19:00",id:11},
					{time:"20:00",id:12}],
					];
				}

			if (hh == 12) {
					timesN = [
					[{time:"12:00",id:4},
					{time:"13:00",id:5},
					{time:"14:00",id:6},
					{time:"15:00",id:7},
					{time:"16:00",id:8}],

					[{time:"17:00",id:9},
					{time:"18:00",id:10},
					{time:"19:00",id:11},
					{time:"20:00",id:12},
					],
					];
				}
			if (hh == 13) {
					timesN = [
					[{time:"13:00",id:5},
					{time:"14:00",id:6},
					{time:"15:00",id:7},
					{time:"16:00",id:8},
					{time:"17:00",id:9}],


					[{time:"18:00",id:10},
					{time:"19:00",id:11},
					{time:"20:00",id:12},
					],
					];
				}
			if (hh == 14) {
					timesN = [
					[{time:"14:00",id:6},
					{time:"15:00",id:7},
					{time:"16:00",id:8},
					{time:"17:00",id:9},
					{time:"18:00",id:10}],


					[{time:"19:00",id:11},
					{time:"20:00",id:12},
					],
					];
				}

			if (hh == 15) {
					timesN = [
					[{time:"15:00",id:7},
					{time:"16:00",id:8},
					{time:"17:00",id:9},
					{time:"18:00",id:10},
					{time:"19:00",id:11},],


					[{time:"20:00",id:12},
					],
					];
				}
			if (hh == 16) {
					timesN = [
					[{time:"16:00",id:8},
					{time:"17:00",id:9},
					{time:"18:00",id:10},
					{time:"19:00",id:11},
					{time:"20:00",id:12}],

					];
				}
			if (hh == 17) {
					timesN = [
					[{time:"17:00",id:9},
					{time:"18:00",id:10},
					{time:"19:00",id:11},
					{time:"20:00",id:12}],

					];
				}
			if (hh == 18) {
					timesN = [
					[{time:"18:00",id:10},
					{time:"19:00",id:11},
					{time:"20:00",id:12}],

					];
				}
			if (hh == 19) {
					timesN = [
					[{time:"19:00",id:11},
					{time:"20:00",id:12}],

					];

				}

			if (hh == 20) {
					timesN = [
					[{time:"20:00",id:12}],

					];
				}




			}


		}
		






		this.setState({selectedDate:selectedDateT,selectedNum:num,times:timesN});
		this.props.callbackFromParent({date:selectedDateT,step:4,time:''});
		

	}

	setColorSelected(num) {
		if (this.state.selectedNum === num) {
			return 'crimson'
		} else {
			return 'white'
		}
	}

	setColor2Selected(num) {
		if (this.state.selectedNum === num) {
			return 'white'
		} else {
			return 'black'
		}
	}

	setColorSelectedTime(num) {
		if (this.state.selectedIdTime === num) {
			return 'crimson'
		} else {
			return 'black'
		}
	}

	selectTime(item) {
		this.setState({selectedTime:item.time,selectedIdTime:item.id})
		this.props.callbackFromParent({time:item.time,step:5,date:this.state.selectedDate,ready:0});
	}

	render(){
		
		let monthMinus = '<';
		let monthPlus = '>';
		if (this.state.ready) {
			return (
				<View>
				<Swiper style={{height:250}} showsButtons={false} showsPagination={false} loop={false} >
				<View style={{alignItems:'center'}}>

				<View style={{flexDirection:'row',height:30}}>
				<View style={{flex:1,alignItems:'center', justifyContent:'center'}}>
				<Text style={{fontSize: 16}}>{monthMinus}</Text>
				</View>
				<View style={{flex:5,alignItems:'center', justifyContent:'center'}}>
				<Text style={{fontSize: 16,fontWeight:'bold',color:'black'}}>{this.state.months[this.state.date.getMonth()]} {this.state.date.getFullYear()}</Text>
				</View>
				<View style={{flex:1,alignItems:'center', justifyContent:'center'}}>
				<Text style={{fontSize: 16}}>{monthPlus}</Text>
				</View>
				</View>
				<View style={{flexDirection:'row',height:30}}>
				{['пн','вт','ср','чт','пт','сб','вс'].map((item,i)=>
					<View key={i} style={{flex:1,alignItems:'center', justifyContent:'center'}}>
					<Text style={{fontSize: 16}}>{item}</Text>
					</View>
					)}
				</View>
				{this.state.table1.map((itemt,ii)=>
					<View key={ii} style={{flexDirection:'row',height:30}}>
					{itemt.map((item,i)=>


						item.active ?



						<TouchableOpacity onPress={(()=>this.selectDate(item.num,1))} key={i} style={{flex:1,alignItems:'center', justifyContent:'center'}}>
						<View style={{width:40,borderRadius: 50, backgroundColor: this.setColorSelected(item.num),alignItems: 'center',justifyContent: 'center'}}>
						<Text style={{fontSize: 16,color:this.setColor2Selected(item.num)}}>{item.num}</Text>
						</View>

						</TouchableOpacity>
						:
						<View key={i} style={{flex:1,alignItems:'center', justifyContent:'center'}}>
						<Text style={{fontSize: 16,color:'darkgray'}}>{item.num}</Text>
						</View>

						)}
					</View>
					)}
				</View>
				<View style={{alignItems:'center',backgroundColor:'white'}}>

				<View style={{flexDirection:'row',height:30}}>
				<View style={{flex:1,alignItems:'center', justifyContent:'center'}}>
				<Text>{monthMinus}</Text>
				</View>
				<View style={{flex:5,alignItems:'center', justifyContent:'center'}}>
				<Text style={{fontSize: 16,fontWeight:'bold',color:'black'}}>{this.state.months[this.state.date2.getMonth()]} {this.state.date2.getFullYear()}</Text>
				</View>
				<View style={{flex:1,alignItems:'center', justifyContent:'center'}}>
				<Text>{monthPlus}</Text>
				</View>
				</View>
				<View style={{flexDirection:'row',height:30}}>
				{['пн','вт','ср','чт','пт','сб','вс'].map((item,i)=>
					<View key={i} style={{flex:1,alignItems:'center', justifyContent:'center'}}>
					<Text>{item}</Text>
					</View>
					)}
				</View>
				{this.state.table2.map((itemt,ii)=>
					<View key={ii} style={{flexDirection:'row',height:30}}>
					{itemt.map((item,i)=>

						item.active ?

						<TouchableOpacity onPress={(()=>this.selectDate(item.num,2))} key={i} style={{flex:1,alignItems:'center', justifyContent:'center'}}>
						<View style={{width:40,borderRadius: 50, backgroundColor: this.setColorSelected(item.num),alignItems: 'center',justifyContent: 'center'}}>
						<Text style={{color:this.setColor2Selected(item.num)}}>{item.num}</Text>
						</View>
						</TouchableOpacity>
						:
						<View key={i} style={{flex:1,alignItems:'center', justifyContent:'center'}}>
						<Text style={{color:'grey'}}>{item.num}</Text>
						</View>

						)}
					</View>
					)}
				</View>

				</Swiper>

				{this.state.selectedDate != ""
				?
				<View>
				<View>
				<Text style={{fontSize: 16,textAlign:'center'}}>
				Выберите время
				</Text>
				</View>
				{this.state.times.map((item,ii) =>
					<View key={ii} style={{flexDirection:'row',marginHorizontal:10}}>
					{this.state.times[ii].map((item,i) =>
						<TouchableOpacity
						key={i}
						style={{marginTop:15,height:35}}
						onPress={(()=>this.selectTime(item))}
						>
						<Text style={{fontSize:16,marginHorizontal:14,color:this.setColorSelectedTime(item.id)}}>{item.time}</Text>
						</TouchableOpacity>

						)}


					</View>
					)}

				</View>
				:
				<View/>

			}

			</View>

			)

} else {
	return (
	  <View style={{flex: 1, marginVertical: 10,alignItems: 'center', justifyContent: 'center'}}>
			<StatusBar hidden= { true } />
			<ActivityIndicator size={70} />
		</View>
		);


}
}

}

export default ChooseDateTime;
