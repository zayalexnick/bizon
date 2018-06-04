import React, { Component } from "react";
import { FlatList, ScrollView, TextInput, ActivityIndicator, ListView, Image, View, StatusBar } from "react-native";

import { Request, StyleSheet, Text, ToolbarAndroid,  Alert, TouchableHighlight, Platform } from 'react-native';
import {ListItem, CheckBox, Body, Input, Label, Item, Container, Button, Icon, CardItem, Content} from 'native-base'  ;
import {TextInputMask} from 'react-native-masked-text';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import styles from "./styles";

import {connect} from "react-redux";
import { newsOneToFalseAction, setActionZapisToTrueAction} from './../actions'






class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldText: 'test',
      loginNumber:'+7-',
      comment:'',
      positionText: 'GPS Координаты пользователя неизвестны',
      lat: 0,
      lng: 0,
      error: null,
      prikurit: false,
      bensin: false,
      koleso: false,
      ready: false,
      responseNews:null,
      serviceId:'',
      };
  }
  componentDidMount() {
      if (this.props.openNewsOne) {
        var url = 'http://auto-club42.ru/android/index.php?action=news&id=' + this.props.newsId;

        fetch(url).then((response) => response.json())
         .then((responseJson) => {
           if (responseJson.status === 'success') {
             this.setState({responseNews: [responseJson.news],ready: true});
           } else {
             Alert.alert( 'Ошибка', 'Ошибка' );
           }
         })
         .catch((error) => {
           Alert.alert( 'Ошибка', 'Нет соединения с сервером' );
         });
        
        this.props.newsOneToFalse();
        this.setState({serviceId: this.props.serviceId})

      } else {
        var url = 'http://auto-club42.ru/android/index.php?action=news&count=5';

        fetch(url).then((response) => response.json())
         .then((responseJson) => {
           if (responseJson.status === 'success') {
             this.setState({responseNews: responseJson.news,ready: true});
           } else {
             Alert.alert( 'Ошибка', 'Ошибка' );
           }
         })
         .catch((error) => {
           Alert.alert( 'Ошибка', 'Нет соединения с сервером' );
         });

      }







    }


  renderItem = ({ item }) => {
    item.preview = item.preview.replace(/&nbsp;/g, '');
    console.log(item);
    return (
      <View style={{marginBottom: 20}}>
        <Image source={{uri: 'http://auto-club42.ru' + item.picture}} style={{resizeMode: 'contain', height: 200,marginBottom: 10}}/>
        <Text>{item.date}</Text>
        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>{item.name}</Text>
        <Text>{item.preview}</Text>
      </View>

    );
  }



  render() {
    
      
    if (this.state.ready) {
        return (
          <View>
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
              <Text style={{ textAlign: 'center'}}>Новости и акции</Text>
            </View>



              {!(this.state.serviceId === '') ?

          <View style={{paddingHorizontal: 20}}>
              <FlatList
                style={styles.flatHeight2}
                data={ this.state.responseNews}
                renderItem={this.renderItem}
                keyExtractor={item => item.name}
              />

                  <Button
                      style={{ marginTop:10, elevation:4, backgroundColor: "crimson", alignSelf: "center",justifyContent:'center'}}
                      onPress={() => {this.props.setActionZapisToTrue(); this.props.navigation.navigate('Запись на сервис')}}
                  >
                      <Text style={{color:'white', paddingHorizontal:10, paddingVertical: 5,fontSize:16, fontWeight:'bold',textAlign:'center'}}>Записаться</Text>
                  </Button>


          </View>
          :
          <View style={{paddingHorizontal: 20}}>
            <FlatList
                          style={styles.flatHeight}
                          data={ this.state.responseNews}
                          renderItem={this.renderItem}
                          keyExtractor={item => item.name}
            />
          </View>

           }




          </View>

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
    openNewsOne: state.openNewsOne,
    newsId: state.newsId,
    serviceId: state.serviceId,
    
  };
  };
  
const mapDispatchToProps = dispatch => {
  return {
    newsOneToFalse: () => dispatch(newsOneToFalseAction()),
    setActionZapisToTrue: () => dispatch(setActionZapisToTrueAction()),
  };
  };

  export default connect(mapStateToProps, mapDispatchToProps)(News);
