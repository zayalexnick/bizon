import React, { Component } from "react";
import { ScrollView, TextInput, ActivityIndicator, ListView,
  Image, View, StatusBar } from "react-native";
import { AsyncStorage, Request, StyleSheet, Text, ToolbarAndroid,
  Alert, TouchableHighlight, TouchableOpacity,
  Platform } from 'react-native';
import {Icon, Button} from 'native-base'  ;
import Swiper from 'react-native-swiper';
import styles from "./styles";

class ChooseServiceStation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceStations:[
        {id:1, name:'Лермонтова'},
        {id:2, name:'ФПК'},
      ],
      address: this.props.address > 0 ? this.props.address : 1,
      error: null
    }
  }

  selectServiceAddress() {
    this.props.callbackFromParent(this.state.address);

  }

  render() {
    
    if (this.state.address === this.props.address) {
      return(
        <View style={{height:200}}>
          <Swiper 
            style={styles.wrapper} 
            showsButtons={true} 
            showsPagination={false} 
            loop={false} 
            onIndexChanged={(index)=> {
              this.setState({address: index + 1})
            } }          
            index={this.props.address > 0 ? this.props.address - 1 : 0}
          >
            <View style={{flex:1,backgroundColor:'orchid'}}>
              <Image style={styles.imageContainer2} source={require('../../../img/lerm.png')} />
              <Text style={{marginLeft: 10,fontSize: 16, fontWeight:'bold'}}>ул. Лермонтова, 119</Text>
              {this.props.address === 1 ? <View style={{marginLeft: 10}}><Icon name='md-checkmark' style={styles.text22}/></View> : <View/>}

            </View>

            <View style={{flex:1,backgroundColor:'khaki'}}>
              <Image style={styles.imageContainer2} source={require('../../../img/fpk.png')} />
              <Text style={{marginLeft: 10, fontSize: 16, fontWeight:'bold'}}>ФПК, ул. Свободы, 6/1</Text>
              {this.props.address === 2 ? <View style={{marginLeft: 10}}><Icon name='md-checkmark' style={styles.text22}/></View> : <View/>}
            </View>
          </Swiper>
          <View style={{height:60}}>

          </View>


        </View>

      );
    } else {
      return(
        <View style={{height:200}}>
          <Swiper 
            style={styles.wrapper} 
            showsButtons={true} 
            showsPagination={false} 
            loop={false} 
            onIndexChanged={(index)=> {
              console.log('bbb');
              this.setState({address: index + 1})
            } }
            index={this.props.address > 0 ? this.props.address - 1 : 0}
          >
            <View style={{flex:1,backgroundColor:'orchid'}}>
              <Image style={styles.imageContainer2} source={require('../../../img/lerm.png')} />
              <Text style={{marginLeft: 10,fontSize: 16, fontWeight:'bold'}}>ул. Лермонтова, 119</Text>
              {this.props.address === 1 ? <View style={{marginLeft: 10}}><Icon name='md-checkmark' style={styles.text22}/></View> : <View/>}
            </View>

            <View style={{flex:1,backgroundColor:'khaki'}}>
              <Image style={styles.imageContainer2} source={require('../../../img/fpk.png')} />
              <Text style={{marginLeft: 10,fontSize: 16,fontWeight:'bold'}}>ФПК, ул. Свободы, 6/1</Text>
              {this.props.address === 2 ? <View style={{marginLeft: 10}}><Icon name='md-checkmark' style={styles.text22}/></View> : <View/>}
            </View>
          </Swiper>

          {/* <View style={{alignItems:'center', marginVertical:10}}>
                <Button style={{alignItems:'center', height: 40, shadowColor: 'black', backgroundColor: "white", }}  onPress={() => this.selectServiceAddress()}
                  color='crimson'
                  title='Продолжить' />
          </View> */}
          <Button
              style={{ marginTop:10, elevation:4, backgroundColor: "crimson", alignSelf: "center",justifyContent:'center'}}
              onPress={() => this.selectServiceAddress()}
              >
              <Text style={{paddingHorizontal:10, paddingVertical: 5,fontSize:16, fontWeight:'bold',textAlign:'center',color:'white'}}>ПРОДОЛЖИТЬ</Text>
          </Button>



        </View>
      );
    }


  }

}

export default ChooseServiceStation;
