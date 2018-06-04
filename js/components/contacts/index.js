import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  AsyncStorage,
  StatusBar,
  Image

} from 'react-native';
import Modal from 'react-native-modal'
import {Button, Icon} from 'native-base'  ;
import ChooseDateTime from "./../checkInService/chooseDateTime";
import MapView from 'react-native-maps';
import styles from "./styles";





class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      koordsLermontova:{ latitude: 55.348108, longitude: 86.052976 },
      koordsFPK:{ latitude: 55.329609, longitude: 86.124195 },


    }

  }

  myCallback = (dataFromChild) => {

  }


  render() {


    return (
      <View style={{flex:1}}>
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
          <Text style={{ textAlign: 'center'}}>Контакты</Text>
        </View>

        <View style={{flex:2,paddingHorizontal:10}}>
          <View style={{marginVertical:10}}>
            <Text style={{fontSize:16,marginBottom:5}}>
              Кемерово, Лермонтова, 119
            </Text>
            <Text style={{fontSize:16}}>
              8 (3842) 65-70-70
            </Text>

          </View>
          <View style={{marginVertical:10}}>
            <Text style={{fontSize:16,marginBottom:5}}>
              Кемерово, Свободы, 6/1 к1
            </Text>
            <Text style={{fontSize:16}}>
              8 (3842) 65-70-72
            </Text>

          </View>

        </View>

        <MapView style={{flex:5}}
          initialRegion={{
            latitude:  55.348753,
            longitude: 86.084232,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,

        }}>

          <MapView.Marker
                coordinate={this.state.koordsLermontova}
                title={'Автоцентр Бизон'}
                description={'ул. Лермонтова, 119'}
              />
              <MapView.Marker
                    coordinate={this.state.koordsFPK}
                    title={'Автоцентр Бизон'}
                    description={'ФПК, ул.Свободы, 6/1'}
                  />



        </MapView>


      </View>
    );
  }


}



export default Contacts;
