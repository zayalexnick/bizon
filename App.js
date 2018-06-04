import React from "react";
import App from "./js/App";
import { AsyncStorage } from 'react-native';

export default class App1 extends React.Component {

componentDidMount() {
  AsyncStorage.setItem('firstLaunch', JSON.stringify({test: '1'}), () => {

    //this.setState({ loggedIn: true, phpsessid: responseJson.phpsessid});
  });
}
  render() {
    return <App />;
  }
}
