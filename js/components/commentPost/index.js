import React, { Component } from "react";
import { TextInput, ActivityIndicator, ListView, Image, View, StatusBar } from "react-native";

import { AsyncStorage, Request, StyleSheet, Text, ToolbarAndroid,  Alert, TouchableHighlight, Platform } from 'react-native';
import {Input, Label, Item, Container, Button, Icon} from 'native-base'  ;
import {TextInputMask} from 'react-native-masked-text';


import styles from "./styles";





class CommentPost extends Component {
	constructor(props) {
    super(props);
    this.state = {
			fieldText: 'test',
			login:'',
			comment:'',
      name:'',
      email:'',
			positionText: 'GPS Координаты пользователя неизвестны',
			lat: 0,
			lng: 0,
			error: null
			};
	}
	componentDidMount() {
		AsyncStorage.getItem('loginData', (err, result) => {

			this.setState({loginData: JSON.parse(result)});

			if (this.state.loginData != null) {
				this.setState({name: this.state.loginData.NAME, email: this.state.loginData.EMAIL});
				console.log('otziv');
				console.log(this.state);
        console.log(this.state.loginData);

			}



		});

	}


	send () {



		if (this.state.name === "") {
			Alert.alert( 'Имя', 'Введите имя' );
			return;
		}
    if (this.state.email === "") {
			Alert.alert( 'email', 'Введите email' );
			return;
		}
    if (this.state.comment === "") {
      Alert.alert( 'Отзыв', 'Введите отзыв' );
      return;
    }
    var temptel = '';
    if (this.state.loginData != null) {
      temptel = '&tel=' + this.state.loginData.LOGIN + '&id=' + this.state.loginData.ID;
    }
    console.log(temptel);    
    console.log(this.state.name);    
    var url_Feedback = "http://auto-club42.ru/android/index.php?action=feedback" +
                            "&message=" + this.state.comment + 
                            "&name=" + this.state.name +
                            "&email=" + this.state.email + temptel;



		 //add check login here




     console.log(url_Feedback);   
		 //this.setState({ fieldText: 'Отправка заявки' });
 			fetch(url_Feedback).then((response) => response.json())
       .then((responseJson) => {
				 if (responseJson.status === 'success') {
           console.log(responseJson);
					 Alert.alert( 'Отзыв', responseJson.message );
					 this.props.navigation.navigate('Главная');
				 } else {
					 //this.setState({ fieldText: url});
           console.log(responseJson);
					 Alert.alert( 'Ошибка', 'Ошибка при отправке отзыва' );
				 }
         //this.setState({ fieldText: responseJson.movies[0].title });
       })
       .catch((error) => {
				 //this.setState({ fieldText: url});
         console.log(responseJson);
         Alert.alert( 'Ошибка', 'Нет соединения с сервером' );
				 //console.error(error);
       });




		//this.setState({ fieldText: this.state.comment })

	}

	render() {


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
          <Text style={{ textAlign: 'center'}}>Отправить отзыв</Text>
        </View>

				<View style={{paddingHorizontal: 10}}>

					<View style={{marginBottom: 10, flexDirection: 'row', alignItems: 'center'}}>
						<Text style={{ flex: 1, fontWeight: 'bold'}}>Ваше имя: </Text>

            <TextInput style={{flex: 3, height: 40}}
              value = {this.state.name}
              onChangeText={name => this.setState({ name })}
              underlineColorAndroid={'lightgray'}
            />
					</View>
          <View style={{marginBottom: 10, flexDirection: 'row', alignItems: 'center'}}>
						<Text style={{flex: 1, fontWeight: 'bold'}}>Ваш email: </Text>
            <TextInput style={{flex: 3, height: 40}}
              value = {this.state.email}
              onChangeText={email => this.setState({ email })}
              underlineColorAndroid={'lightgray'}
            />

					</View>

					<Text style={{  fontSize: 16,fontWeight: 'bold'}}>Введите текст отзыва: </Text>

					<TextInput style={{fontSize: 16}}
						multiline = {true}
						numberOfLines = {1}
						value = {this.state.comment}
						onChangeText={comment => this.setState({ comment })}
						underlineColorAndroid={'gray'}
					/>
          <Button style={{ marginBottom: 10, height: 40, shadowColor: 'black',paddingLeft: 10, paddingRight: 10, paddingBottom: 5, backgroundColor: "white", }}  onPress={() => this.send()}>
              <Text>Отправить</Text>
          </Button>


        </View>




			</Container>
	);}
}

export default CommentPost;
