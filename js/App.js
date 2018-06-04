import React, {Component} from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { StyleSheet, Text, View, Image, ToolbarAndroid,  Alert, TouchableHighlight, Platform, StatusBar } from 'react-native';
import {Input, Label, Item, Container, Button, Icon} from 'native-base';




import Home from "./components/home/";
import Garage from "./components/garage/";
import EvacuationCall from "./components/evacuationCall/";
import RoadAssistance from "./components/roadAssistance/";
import CommentPost from "./components/commentPost/";
import CheckInService from "./components/checkInService/";
import News from "./components/news/";
import Login from "./components/login/";
import Contacts from "./components/contacts/";
import Recording from './components/Recording';

class HomeScreen extends Component {

  render() {
    return (
      <View style={styles.container}>
      <StatusBar hidden= { true } />


      <Text style={styles.welcome}>Добро пожаловать</Text>


      <View style = {{backgroundColor: 'yellow' , flex: 1}} />


      <View style = {{backgroundColor: 'brown', flex: 5, flexDirection: 'column', justifyContent: 'space-between' }}>
      <Button style = {{backgroundColor: "#6FAF98", alignSelf: "center", width: 150, height: 90}}  title="Press Me" onPress={() => this.props.navigation.navigate('Details')}  />
        <View style = {{backgroundColor: 'green', flex: 1, alignItems: 'center',flexDirection: 'row',justifyContent: 'space-between'}} >
        <Button style = {{backgroundColor: "#6FAF98", alignSelf: "center", width: 150, height: 90}}  title="Press Me" onPress={() => this.props.navigation.navigate('Details')}  />
          <ButtonOfMain navigation={this.props.navigation} caption='Запись на сервис'  />
          {/* <ButtonOfMain  caption='Вызов эвакуатора' />  */}
        </View>
        {/*
       <View style = {{backgroundColor: 'green', flex: 1, alignItems: 'center',flexDirection: 'row',justifyContent: 'space-between'}} >
          <ButtonOfMain  caption='Помощь на дороге' />
          <ButtonOfMain caption='Контакты' />
        </View>
        <View style = {{backgroundColor: 'green', flex: 1, alignItems: 'center',flexDirection: 'row',justifyContent: 'space-between'}} >
          <ButtonOfMain  caption='Отправить отзыв' />
          <ButtonOfMain caption='Новости и акции' />
        </View>
        */}
      </View>

      <View style = {{backgroundColor: 'yellow' , flex: 1}} />


      </View>
    );
  }
}





class DetailsScreen extends Component {
  constructor(props) {
  super(props);
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
        source={require('../img/logo.png')}
        />
      </View>
      <View style={{marginBottom: 15 ,backgroundColor: 'lightgray'}}>
        <Text style={{ textAlign: 'center'}}>О программе</Text>
      </View>

      <View style={{flex:1,paddingHorizontal: 10}}>
        <View style={{flex:1,marginBottom: 15,  alignItems: 'center'}}>
          <Text style={{marginBottom:15, fontWeight: 'bold',fontSize:16}}>Мобильное приложение Автоцентр Бизон</Text>
          <Text style={{marginBottom:15, fontWeight: 'bold',fontSize:16}}>Версия 2.0.0.26</Text>
          
        </View>

      </View>
    </Container>
    );

  }
}

class Header extends Component {
  render() {

    return (

      <View style={{flex: 1, flexDirection: 'row'}}>
        {/*<Text style={styles.top_polosa}> </Text>*/}
        <Button style={{width: 56}} transparent onPress={() => Alert.alert( 'Alert Title', 'alertMessage' )}>
            <Icon name='md-menu' style={styles.headerMenuButton}/>
        </Button>
        <Image
        style={styles.stretch}
        source={require('../img/logo.png')}
        />
      </View>
    );
  }
}
class HeaderNotHome extends Component {
  render() {

    return (

      <View style={{flex: 1, flexDirection: 'row'}}>
        {/*<Text style={styles.top_polosa}> </Text>*/}
        <Image
        style={styles.stretch}
        source={require('../img/logo.png')}
        />
      </View>
    );
  }
}

const Drawer = DrawerNavigator ({
  'Главная': { screen: Home,
    navigationOptions: {
      drawerIcon: ({ tintColor }) => (<Image style= {styles.iconMain} source={require('../img/logoIconMain.png')}/>),
      // drawerIcon: ({ tintColor }) => (<Icon style={{ color: '#e31e24' }} name='home' />),

    }
  },
  'Профиль': { screen: Login,
    navigationOptions: {
      drawerIcon: ({ tintColor }) => (<Icon style={styles.iconMenu} name='md-person' />),

    }
  },
  'Гараж': { screen: Garage,
    navigationOptions: {
      drawerIcon: ({ tintColor }) => (<Icon style={styles.iconMenu} name='home' />),

    } , screenProps:{addAuto:'no'},
  },

  'Запись на сервис': { screen: CheckInService,
    navigationOptions: {
      drawerIcon: ({ tintColor }) => (<Icon style={styles.iconMenu} name='md-walk' />),
    }
  },
  'Вызов эвакуатора': { screen: EvacuationCall,
    navigationOptions: {
      drawerIcon: ({ tintColor }) => (<Icon style={styles.iconMenu} name='md-call' />),
    }
  },
  'Помощь на дороге': { screen: RoadAssistance,
    navigationOptions: {
      drawerIcon: ({ tintColor }) => (<Icon style={styles.iconMenu} name='md-car' />),
    }
  },
  'Контакты': { screen: Contacts,
    navigationOptions: {
      drawerIcon: ({ tintColor }) => (<Icon style={styles.iconMenu} name='md-pin' />),
    }
  },
  'Отправить отзыв': { screen: CommentPost,
    navigationOptions: {
      drawerIcon: ({ tintColor }) => (<Icon style={styles.iconMenu} name='md-text' />),
    }
  },
  'Новости и акции': { screen: News,
    navigationOptions: {
      drawerIcon: ({ tintColor }) => (<Icon style={styles.iconMenu} name='md-calendar' />),
    }
  },
  'О программе': { screen: DetailsScreen, 
    navigationOptions: {
      drawerIcon: ({ tintColor }) => (<Icon style={styles.iconMenu} name='md-information' />),
    }

  },
    'Recording': {
        screen: Recording,
        navigationOptions: {
            drawerLabel: () => null
        }
    }
},
{initialRouteName: 'Главная'}

);





class  ButtonOfMain extends Component {
  render() {

    if (this.props.caption === 'Запись на сервис') {
      var pictureName = require('../img/logo.png');
    }

    return (
      <TouchableHighlight style = {{width: 150, height: 90}}   onPress={() => this.props.navigation.navigate('Details')}   >
        <View style = {{backgroundColor: 'steelblue', width: 150, height: 90, alignItems: 'center'}}>
          <Image style={styles.picto} source={pictureName} />
          <Text style={styles.textpicto} >{this.props.caption}</Text>
          </View>
      </TouchableHighlight>
    );
  }
}

{/*HomeScreen.router = ButtonOfMain.router;*/}

export default Drawer;

const styles = StyleSheet.create({
  iconMenu: {
    color: '#e31e24',
    fontSize: 32,
  },
  picto: {
    //justifyContent: 'center',
    width: 60,
    height: 60
  },
  textpicto: {
    width: 130,
    //height: 80,
    textAlign: 'center',
  },
  container: {
    //flex: 1,
    flex: 1,
    backgroundColor: '#0ff',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  stretch: {


    ...Platform.select({
      ios: {
        height: 50,

      },
      android: {
        height: 50,
        flex: 1
      },
    }),
    //height: 200,
    resizeMode: 'contain',
    backgroundColor: '#dbdbdb',
  },
  iconMain: {
    resizeMode: 'contain',
    width: 26,
    height: 30,
  },
  top_polosa: {
    width: 360,
    height: 20,
    ...Platform.select({
      ios: {

      },
      android: {
        backgroundColor: '#000',
      },
    }),





  },
  welcome: {
    width:360,
    height:20,
    backgroundColor: '#d3d3d3',
    textAlign: 'center'
  }
});
