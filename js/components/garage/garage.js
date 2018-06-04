import React, { Component } from "react";
import {Image, View, StatusBar } from "react-native";
import { StyleSheet, Text, ToolbarAndroid,  Alert, TouchableHighlight, Platform, ScrollView } from 'react-native';
import {Form, Container, Button, Icon, Item, Label, Input} from 'native-base'  ;
import Swiper from 'react-native-swiper';
import styles from "./styles";


class GarageList extends Component {
	// eslint-disable-line

	render() {
		return (
      <View>
        <StatusBar hidden= { true } />

        <View style={{marginBottom: 20 ,backgroundColor: 'lightgray'}}>
          <Text style={{ textAlign: 'center'}}>Гараж</Text>
        </View>
        <View style={styles.slider}>
          <Swiper style={styles.wrapper} showsButtons={true} showsPagination={false} >
            <View style={styles.slide}>
              <Text style={styles.text}>Hello Swiper1</Text>
            </View>
            <View style={styles.slide}>
              <Text style={styles.text}>Beautiful</Text>
            </View>
            <View style={styles.slide}>
                <View style={{flex:4,borderWidth: 1}}>
									<Image

									style={{position: 'absolute'}}
									source={require('../../../img/icon.png')}
									/>


								</View>
                <View style={{flex:1,borderWidth: 1, flexDirection: 'row'}}>
                    <View style={{flex:5,borderWidth: 1, justifyContent:'center'}}>
                      <Text style={styles.text}>Honda FIT Shuttle</Text>
                    </View>
                    <View style={{flex:1,borderWidth: 1,justifyContent:'center',alignItems:'center'}}>
                      <Icon name='camera' style={styles.headerMenuButton}/>
                    </View>
                </View>
                <View style={{flex:1,borderWidth: 1, flexDirection: 'row'}}>
                    <View style={{flex:5,borderWidth: 1, justifyContent:'center'}}>
                      <Text style={styles.text}>GP-3205604</Text>
                    </View>
                    <View style={{flex:1,borderWidth: 1,justifyContent:'center',alignItems:'center'}}>
                      <Icon name='md-checkmark' style={styles.headerMenuButton}/>
                    </View>
                </View>
            </View>
          </Swiper>
        </View>




      </View>


		);
	}
}

export default GarageList;
