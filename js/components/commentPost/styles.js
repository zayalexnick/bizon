const React = require("react-native");

const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const sliderWidth = deviceWidth*0.8;
const sliderMarginLeft = deviceWidth*0.1;

export default {
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
  imageContainer: {
    flex: 1,
    width: null,
    height: null
  },
  logoContainer: {
    flex: 1,
    marginTop: deviceHeight / 8,
    marginBottom: 30
  },
  logo: {
    position: "absolute",
    left: Platform.OS === "android" ? 40 : 50,
    top: Platform.OS === "android" ? 35 : 60,
    width: 280,
    height: 100
  },
  wrapper: {
    width:deviceWidth,
    // width: deviceWidth,
   },
   slide: {
     marginLeft: sliderMarginLeft,
     width: sliderWidth,
     flex: 1,
     backgroundColor: '#9DD6EB',
     borderColor:'#000',
     borderWidth: 1,
   },
   text: {
     color: '#fff',
     fontSize: 20,
     fontWeight: 'bold',
   },
   slider: {
     height: 300,
     alignItems: 'center',
   },
};
