const React = require("react-native");

const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const sliderWidth = deviceWidth;
const sliderMarginLeft = 0;
const sliderHeight = 200;
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
  flatHeight: {
    flex:1,
    paddingTop:10,
    // height:deviceHeight - 150

  },
  avatar: {
    position:'absolute',
    width: sliderWidth-2,
    height: sliderHeight-2,
    //resizeMode: 'contain',

  },
  avatarEmpty: {
    position:'absolute',
    width: sliderWidth-2,
    height: sliderHeight-2,
    resizeMode: 'contain',

  },
  imageContainer: {
    resizeMode:'cover',
    width: deviceWidth,
    height: deviceHeight,
    position:'absolute',
  },
  imageContainer2: {
    resizeMode:'cover',
    width: deviceWidth,
    height: 200,
    position:'absolute',
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
     borderWidth:1,
     borderColor:'#333',
     marginLeft: sliderMarginLeft,
     justifyContent:'center',
     alignItems:'center',
     width: sliderWidth,
     flex: 5,
     backgroundColor: '#fff',
   },
   text: {
     color: '#000',
     paddingLeft:7,
     fontSize: 20,
     fontWeight: 'bold',
   },
   textw: {
     color: '#fff',
     paddingLeft:7,
     fontSize: 20,
     fontWeight: 'bold',
   },
   text2: {
     color: '#000',
     fontSize: 32,
     fontWeight: 'bold',
   },
   text22: {
     color: 'crimson',
     fontSize: 32,
     fontWeight: 'bold',
   },
   text3: {
     color: '#fff',
     fontSize: 32,
     fontWeight: 'bold',
   },
   textVin: {
     color: '#000',
     paddingLeft:7,
     fontSize: 16,
     fontWeight: 'bold',
   },
   textVin2: {
     color: '#fff',
     paddingLeft:7,
     fontSize: 16,
     fontWeight: 'bold',
   },
   slider: {
     borderColor: 'green',
     height: sliderHeight,
     alignItems: 'center',
   },
};
