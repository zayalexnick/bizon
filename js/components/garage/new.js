import React, { Component } from "react";
import { Image, View, StatusBar } from "react-native";

import { StyleSheet, Text, ToolbarAndroid,  Alert, TouchableHighlight, Platform } from 'react-native';
import {Container, Button, Icon, Item, Label, Input} from 'native-base'  ;

import styles from "./styles";


class GarageNewAuto extends Component {
	// eslint-disable-line

	render() {
		return (
			<Container>
				<StatusBar hidden= { true } />
        <View style={{ backgroundColor: 'green', flexDirection: 'row'}}>
          {/*<Text style={styles.top_polosa}> </Text>*/}

          <Button style={{width: 56}} transparent onPress={() => this.props.navigation.navigate('Главная')}>
              <Icon name='md-arrow-back' style={styles.headerMenuButton}/>
          </Button>
          <Image
          style={styles.stretch}
          source={require('../../../img/logo.png')}
          />
        </View>
        <View style={{marginBottom: 40 ,backgroundColor: 'lightgray'}}>
          <Text style={{ textAlign: 'center'}}>Гараж</Text>
        </View>
        <View style={{}}>

          <Item style={{marginBottom: 8}} floatingLabel last>
            <Label> VIN или номер кузова</Label>
            <Input />
          </Item>

          <Button style={{ backgroundColor: "#6FAF98", alignSelf: "center" }}  onPress={() => Alert.alert( 'Внимание', 'Автомобиль не найден' )}>
              <Text>   Далее   </Text>
          </Button>
        </View>



			</Container>
		);
	}
}

export default GarageNewAuto;
