import React, { Component } from "react";
import { ScrollView, TextInput, ActivityIndicator, ListView,
  Image, View, StatusBar } from "react-native";
import { AsyncStorage, Request, StyleSheet, Text, ToolbarAndroid,
  Alert, TouchableHighlight, TouchableOpacity,
  Platform } from 'react-native';
import {Icon,Button} from 'native-base'  ;
import Swiper from 'react-native-swiper';
import styles from "./styles";

class ChooseAuto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginDataAutos: this.props.loginData.AUTOS,
      avatarSource: this.props.avatarSource,
      makes: this.props.makes,
      sliderIndex:this.props.indexAuto,
      ready: true,
      selected:this.props.selectedIndexAuto,
      error: null
    }

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
      //console.log('Response = ', response);

      if (response.didCancel) {
        //console.log('User cancelled image picker');
      }
      else if (response.error) {
        //console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        //console.log('User tapped custom button: ', response.customButton);
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
    //console.log(JSON.stringify(avatars));
  }

  setSliderIndex(index) {
    this.setState({sliderIndex: index});

  }
  selectAuto() {
    this.setState({selected:this.state.sliderIndex});
    this.props.callbackFromParent({
      indexAuto:this.state.sliderIndex,
      selectedIndexAuto:this.state.sliderIndex
    });

  }

  addAuto() {
    
    this.props.callbackFromParent({
      indexAuto:150,

    });
  }


  render() {
      //console.log('state');
      //console.log(this.state);
      if (this.state.loginDataAutos != "") {
        return(
          <View>
          <View style={styles.slider}>

            <Swiper 
              style={styles.wrapper} 
              showsButtons={this.state.ready} 
              showsPagination={false} 
              loop={false} 
              onIndexChanged={(index)=>this.setSliderIndex(index)}
              index= {this.props.selectedIndexAuto>=0 ? this.props.selectedIndexAuto : 0}
            >

              {this.state.loginDataAutos.map((item, i) =>
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
                          {i === this.state.selected
                            ? <Icon name='md-checkmark' style={styles.text22}/>
                            : <Text/>
                          }
                        </View>
                    </View>
                </View>

                </View>
              )}




            </Swiper>
          </View>
          <TouchableOpacity style={{marginHorizontal:15,marginVertical: 5,flexDirection:'row'  }}  onPress={() => this.addAuto()}>
            <View style={{flex:12,justifyContent: 'center'}}>
              <Text style={{fontSize:16, color:'crimson'}}>Добавить автомобиль</Text>
            </View>
            <View style={{flex:1}}>
              <Text style={{fontSize:28,color:'crimson',textAlign:'right'}}>+</Text>
            </View>
          </TouchableOpacity>

          {this.state.selected === this.state.sliderIndex && this.props.step > 1 
            ? <Text/>
            :<Button
                style={{ marginTop:10, elevation:4, backgroundColor: "crimson", alignSelf: "center",justifyContent:'center'}}
                onPress={() => this.selectAuto()}
                >
                <Text style={{paddingHorizontal:10, paddingVertical: 5,fontSize:16, fontWeight:'bold',textAlign:'center',color:'white'}}>ПРОДОЛЖИТЬ</Text>
              </Button>

          }



        </View>

        );        
      } else {
        return(
        <View>
          <TouchableOpacity style={{marginHorizontal:15,marginVertical: 5,flexDirection:'row'  }}  onPress={() => this.addAuto()}>
            <View style={{flex:12,justifyContent: 'center'}}>
              <Text style={{fontSize:16, color:'crimson'}}>Добавить автомобиль</Text>
            </View>
            <View style={{flex:1}}>
              <Text style={{fontSize:28,color:'crimson',textAlign:'right'}}>+</Text>
            </View>
          </TouchableOpacity>

        </View>
        );

      }






  }


}
export default ChooseAuto;
