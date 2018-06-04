const React = require("react-native");

const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const sliderWidth = deviceWidth;
// const sliderMarginLeft = deviceWidth*0.07;
const sliderMarginLeft = 0;
const sliderHeight = 200;
export default {
  modalView: {
    width:250,
    height:300,
    backgroundColor:'white',
    borderRadius:10,
    justifyContent: 'center',
  },
  top_polosa_text: {
    textAlign: 'center',
    color:'black',
    fontWeight:'bold',
    fontSize:22,

  },
  top_polosa: {
    // marginBottom: 20 ,
    height:30,
    justifyContent:'center',
    // backgroundColor: 'gray',
  },
  mainView: {
    flex:1,
    backgroundColor:'#fff'
  },
  flatHeight: {
    height:deviceHeight - 100

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
  imageContainer: {
    resizeMode:'cover',
    width: deviceWidth,
    height: deviceHeight,
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
    // backgroundColor:'white',
    // width: deviceWidth,
   },
   slide: {
     borderWidth:2,
     borderColor:'#333',
     marginLeft: sliderMarginLeft,
     justifyContent:'center',
     alignItems:'center',
     width: sliderWidth,
     flex: 5,
     backgroundColor: '#fff',
   },
   text2: {
     color: '#000',
     fontSize: 32,
     fontWeight: 'bold',
   },
   serviceBook: {
     color: 'white',
     fontSize: 30,
     fontWeight: 'bold',
   },
   cog: {
     color: '#000',
     fontSize: 28,
     fontWeight: 'bold',
   },
   circle: {
     position: 'absolute',
     marginTop: -25,
     width: 50,
     height: 50,
     borderRadius: 50,
     borderWidth: 2,
     backgroundColor: 'white',
     justifyContent:'center',
     alignItems:'center',
   },
   circleServiceBook: {
     width: 70,
     height: 70,
     borderRadius: 70,
     borderWidth: 2,
     borderColor:'white',

     justifyContent:'center',
     alignItems:'center',
   },
   circleZapis: {
     width: 90,
     height: 90,
     borderRadius: 90,
     borderWidth: 2,
     borderColor:'white',

     justifyContent:'center',
     alignItems:'center',
   },


   wrapperCircle: {
     alignItems: 'flex-end',
     marginLeft: 0,
     width: sliderWidth-16,
   },

   text3: {
     color: '#fff',
     fontSize: 32,
     fontWeight: 'bold',
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
     marginTop:10,
     borderColor: 'green',
     height: sliderHeight,
     alignItems: 'center',
   },
   avatar: {
     position:'absolute',
     width: sliderWidth-4,
     height: sliderHeight-4,
     //resizeMode: 'contain',

   },
   avatarEmpty: {
     position:'absolute',
     width: sliderWidth-4,
     height: sliderHeight-4,
     resizeMode: 'contain',

   },
};
