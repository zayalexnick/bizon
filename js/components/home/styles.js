const React = require("react-native");

const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

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
  modalImage: {

      width:deviceWidth*0.7,
      height:deviceWidth*0.7,
      backgroundColor:'white',
      marginTop:30,
      marginBottom:30,
      borderRadius:10,
      justifyContent: 'center',

  },
  modalView: {
    elevation:4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    width:30,
    height:30,
    backgroundColor:'white',
    right:0,
    top:0,
    position: 'absolute',


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

  titleOnMain: {
    fontWeight: 'bold',
    color:'black',
    fontSize:16,
    

  },

  };
