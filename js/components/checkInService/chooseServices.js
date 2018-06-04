import React, { Component } from "react";
import { ScrollView, TextInput, ActivityIndicator, ListView,
  Image, View, StatusBar } from "react-native";
import { AsyncStorage, Request, StyleSheet, Text, ToolbarAndroid,
  Alert, TouchableHighlight, TouchableOpacity,
  Platform } from 'react-native';
import styles from "./styles";
import { Icon,Button} from 'native-base'  ;
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import {connect} from "react-redux";
import {newsOneToFalseAction} from "../actions";

class ChooseServices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      services: this.props.services,
      selectedServices: this.props.selectedServices,
      step: this.props.step,
      error: null
    }
  }

  componentWillMount() {
    // console.warn('111');
    // console.warn(this.state.selectedServices);
    // console.warn(this.props.selectedServices);


  }

  getAction() {
    recomServices=[];
    // for (var i = 0; i < this.state.services.length; i++) {
    //   let recomServ= this.state.services[i].filter((item)=>item.action === 'NO');
    //   recomServices = recomServices.concat(recomServ);
    // }


    //let recomServices= this.state.services.filter((item)=>item.action === 'NO');

    return recomServices;
  }

  sumOfSelectedServices() {
    sum=0;
    for (var i = 0; i < this.state.selectedServices.length; i++) {
      if(this.state.selectedServices[i].price == 'нет цены') {

      } else {
        //sum= sum + Number(this.state.selectedServices[i].show_sale === 'YES' ? this.state.selectedServices[i].sale_price : this.state.selectedServices[i].price);
        sum = sum + Number(this.state.selectedServices[i].price);
      };

    }

    return sum;

  }

  selectService(selectService,step) {
    this.props.callbackFromParent({selectService: selectService, step: step,ds:-1});
    this.setState({step:step});
  }

  deleteService(i) {
    this.props.callbackFromParent({selectService: null, step: 2,ds:i});
    let ttt = this.state.selectedServices
    ttt.splice(i,1)
    this.setState({selectedServices:ttt});
  }

  render() {

    if ((this.state.selectedServices.length > 0 || this.props.comment.length > 0) && this.props.step === 2) {
      return(
        <View>
          <View style={{marginHorizontal:10}}>
            {/* <Text style={{margin:5,fontSize:20,color:'black'}}>Добавленные услуги</Text> */}
            {this.state.selectedServices.map((item, i) =>
              <View key={item.id} style={{flexDirection:'row',margin:5}}>
                <View style={{flex:9}}>
                  <Text style={{fontSize:16,color:'black'}} key={item.id}>
                    {item.name}
                  </Text>
                </View>

                <View style={{flex:4,alignItems:'flex-end'}}>
                  <TouchableOpacity  onPress={() => this.deleteService(i)}>
                    <Icon name='md-close' style={{color:'crimson'}}/>
                  </TouchableOpacity>
                  <Text style={{fontSize: 16,textAlign:'right'}}>
                    {/*item.show_sale === 'YES' ? item.sale_price : */item.price} руб.
                  </Text>
                </View>

              </View>
            )}
            {this.props.comment.length>0 
              ?
              <View style={{flexDirection:'row',margin:5}}>
                <View style={{flex:9}}>
                  <Text style={{fontSize:16,color:'black'}}> 
                    Другие услуги: {this.props.comment}
                  </Text>
                </View>

                <View style={{flex:4,alignItems:'flex-end'}}>
                  <TouchableOpacity  onPress={() => this.deleteService(i)}>
                    <Icon name='md-close' style={{color:'crimson'}}/>
                  </TouchableOpacity>
                  <Text style={{fontSize: 16,textAlign:'right'}}>
                    
                  </Text>
                </View>

              </View>

              :
              <View/>
            }
            <TouchableOpacity style={{margin:5,flexDirection:'row'  }}  onPress={() => this.selectService(1,2)}>
              <View style={{flex:12,justifyContent: 'center'}}>
                <Text style={{fontSize:16, color:'crimson'}}>Добавить услугу</Text>
              </View>
              <View style={{flex:1}}>
                <Text style={{fontSize:28,color:'crimson',textAlign:'right'}}>+</Text>
              </View>
            </TouchableOpacity>

            <View style={{height:1,margin:5,backgroundColor: 'gray'}}>
            </View>
            <View style={{flexDirection:'row',margin:5}}>
              <View style={{flex:9}}>
                <Text style={{fontSize: 16,color:'black'}}>Итого</Text>
              </View>
              <View style={{flex:4,alignItems: 'flex-end'}}>
                <Text style={{fontSize: 16}}>
                  {this.sumOfSelectedServices()} руб.
                </Text>
              </View>
            </View>


          </View>
          <View style={{}}>


            {this.getAction().length>0 ?

              <View>

              </View>
              :
              <View/>

            }

          </View>

          <Button
              style={{ marginTop:10, elevation:4, backgroundColor: "crimson", alignSelf: "center",justifyContent:'center'}}
              onPress={() => this.selectService(0,3)}
              >
              <Text style={{paddingHorizontal:10, paddingVertical: 5,fontSize:16, fontWeight:'bold',textAlign:'center',color:'white'}}>ПРОДОЛЖИТЬ</Text>
          </Button>

        </View>
      );
    } else {
      return(
        <View>
          {this.state.selectedServices.length > 0 ?
          <View style={{backgroundColor:'white',marginHorizontal:10}}>
            {this.state.selectedServices.map((item, i) =>
              <View key={item.id} style={{flexDirection:'row',margin:5}}>
                <View style={{flex:9}}>
                  <Text style={{fontSize:16,color:'black'}} key={item.id}>
                    {item.name}
                  </Text>
                </View>

                <View style={{flex:4,alignItems:'flex-end'}}>
                  <TouchableOpacity  onPress={() => this.deleteService(i)}>
                    <Icon name='md-close' style={{color:'crimson'}}/>
                  </TouchableOpacity>
                  <Text style={{fontSize: 16,textAlign:'right'}}>
                    {/*item.show_sale === 'YES' ? item.sale_price : */item.price} руб.
                  </Text>
                </View>

              </View>
            )}

            {this.props.comment.length>0 
              ?
              <View style={{flexDirection:'row',margin:5}}>
                <View style={{flex:9}}>
                  <Text style={{fontSize:16,color:'black'}}> 
                    Другие услуги: {this.props.comment}
                  </Text>
                </View>

                <View style={{flex:4,alignItems:'flex-end'}}>
                  <TouchableOpacity  onPress={() => this.deleteService(i)}>
                    <Icon name='md-close' style={{color:'crimson'}}/>
                  </TouchableOpacity>
                  <Text style={{fontSize: 16,textAlign:'right'}}>
                    
                  </Text>
                </View>

              </View>

              :
              <View/>
            }
            
            <TouchableOpacity style={{margin:5,flexDirection:'row'  }}  onPress={() => this.selectService(1,2)}>
              <View style={{flex:12,justifyContent: 'center'}}>
                <Text style={{fontSize:16, color:'crimson'}}>Добавить услугу</Text>
              </View>
              <View style={{flex:1}}>
                <Text style={{fontSize:28,color:'crimson',textAlign:'right'}}>+</Text>
              </View>
            </TouchableOpacity>

            <View style={{height:1,margin:5,backgroundColor: 'gray'}}>
            </View>
            <View style={{flexDirection:'row',margin:5}}>
              <View style={{flex:9}}>
                <Text style={{fontSize: 16,color:'black'}}>Итого</Text>
              </View>
              <View style={{flex:4,alignItems: 'flex-end'}}>
                <Text style={{fontSize: 16}}>
                  {this.sumOfSelectedServices()} руб.
                </Text>
              </View>
            </View>

          </View>
          :
          <View style={{marginHorizontal: 10}}>


            {this.props.comment.length>0 
              ?
              <View style={{flexDirection:'row',margin:5}}>
                <View style={{flex:9}}>
                  <Text style={{fontSize:16,color:'black'}}> 
                    Другие услуги: {this.props.comment}
                  </Text>
                </View>

                <View style={{flex:4,alignItems:'flex-end'}}>
                  <TouchableOpacity  onPress={() => this.deleteService(i)}>
                    <Icon name='md-close' style={{color:'crimson'}}/>
                  </TouchableOpacity>
                  <Text style={{fontSize: 16,textAlign:'right'}}>
                    
                  </Text>
                </View>

              </View>

              :
              <View/>
            }
          
            <TouchableOpacity style={{margin:5,flexDirection:'row'  }}  onPress={() => this.selectService(1,2)}>
              <View style={{flex:12,justifyContent: 'center'}}>
                <Text style={{fontSize:16, color:'crimson'}}>Добавить услугу</Text>
              </View>
              <View style={{flex:1}}>
                <Text style={{fontSize:28,color:'crimson',textAlign:'right'}}>+</Text>
              </View>
            </TouchableOpacity>

          </View> }
          <View style={{}}>
            {this.getAction().length>0 ?

              <View>


              </View>
              :
              <View/>

            }

          </View>

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
    };
};



export default connect (mapStateToProps, mapDispatchToProps)(ChooseServices);
