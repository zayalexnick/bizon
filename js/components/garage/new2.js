import React, { Component } from "react";
import { Image, View, StatusBar } from "react-native";
import { StyleSheet, Text, ToolbarAndroid,  Alert, TouchableHighlight, Platform, ScrollView } from 'react-native';
import {Form, Container, Button, Icon, Item, Label, Input} from 'native-base'  ;
import Swiper from 'react-native-swiper';
import styles from "./styles";


class GarageNewAutoParticularly extends Component {
	// eslint-disable-line

	render() {
		return (
			<ScrollView>
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
        <View style={{marginBottom: 8, backgroundColor: 'lightgray'}}>
          <Text style={{ textAlign: 'center'}}>Гараж</Text>
        </View>
        <View style={{}}>
					<Form>

						<Item style={{}} floatingLabel>
							<Label> VIN или номер кузова</Label>
							<Input />
						</Item>

          	<Item style={{}} floatingLabel>
            	<Label> Марка</Label>
            	<Input />
          	</Item>

						<Item style={{}} floatingLabel>
            	<Label> Модель</Label>
            	<Input />
          	</Item>

						<Item style={{}} floatingLabel>
            	<Label> Тип кузова</Label>
            	<Input />
          	</Item>

						<Item style={{}} floatingLabel>
            	<Label> Год выпуска</Label>
            	<Input />
          	</Item>

						<Item style={{ }} floatingLabel>
            	<Label> Пробег</Label>
            	<Input />
          	</Item>




					</Form>



          <Button style={{ marginTop: 8, backgroundColor: "#6FAF98", alignSelf: "center" }}  onPress={() => Alert.alert( 'Внимание', 'Автомобиль не найден' )}>
              <Text>   Далее   </Text>
          </Button>
        </View>



			</ScrollView>
		);
	}
}

export default GarageNewAutoParticularly;



{/*<Swiper style={styles.wrapper} showsButtons={true}>
	<View style={styles.slide1}>
		<Text style={styles.text}>Hello Swiper</Text>
	</View>
	<View style={styles.slide2}>
		<Text style={styles.text}>Beautiful</Text>
	</View>
	<View style={styles.slide3}>
		<Text style={styles.text}>And simple</Text>
	</View>
</Swiper>*/}
