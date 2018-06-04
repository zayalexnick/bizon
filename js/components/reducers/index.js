import { combineReducers } from 'redux';
import recordReducer from '../Recording/reducer';

const COUNT_PAGE = 'COUNT_PAGE';
const CLOSE_BANNER = 'CLOSE_BANNER';
const OPEN_NEWS_ONE = 'OPEN_NEWS_ONE';
const NEWS_ONE_TO_FALSE = 'NEWS_ONE_TO_FALSE';
const BANNER_TO_STORE = 'BANNER_TO_STORE';
const DEFAULT_AUTO = 'DEFAULT_AUTO';
const ACTION_ZAPIS = 'ACTION_ZAPIS';
const ACTION_ZAPIS_FALSE = 'ACTION_ZAPIS_FALSE';

const initialState = {
  countOpened: 0,
  bannerShowDateTime: new Date(),
  isModalVisible: false,
  newsId: '',
  openNewsOne: false,
  bannerData: false,
  bannerTimeLimit: 86400000,
  oneHour: 3600000,
  bannerInfo: {},
  bannerDateTime: new Date(0),
  serviceId: '',
  actionZapis: false,
  defaultAuto: 0,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case COUNT_PAGE:
      if (state.bannerData && !state.isModalVisible) {
        let TDate = new Date();
        let BSDate = new Date(state.bannerShowDateTime);

        if ((state.countOpened > state.bannerInfo.PROPERTY_COUNTOPENED_VALUE) || (state.countOpened == 0)
          || (TDate - BSDate > state.oneHour * state.bannerInfo.PROPERTY_COUNTHOURS_VALUE)) {

          return {
            ...state,
            countOpened: 1,
            isModalVisible: true,
            bannerShowDateTime: new Date(),

          };
        }
        return {
          ...state,
          countOpened: state.countOpened + 1,
        };

      } else {
        return state;
      }

    case CLOSE_BANNER:

      return {
        ...state,
        isModalVisible: false
      };

    case OPEN_NEWS_ONE:
      return {
        ...state,
        openNewsOne: true,
        newsId: state.bannerInfo.PROPERTY_NEWSID_VALUE,
        serviceId: state.bannerInfo.PROPERTY_SERVICEID_VALUE,


      };

    case NEWS_ONE_TO_FALSE:
      return {
        ...state,
        openNewsOne: false,
      };
    case BANNER_TO_STORE:
      return {
        ...state,
        bannerInfo: action.data,
        bannerData: true,
        bannerDateTime: action.data.bannerDateTime,

      };

    case ACTION_ZAPIS:
      return {
        ...state,
        actionZapis: true,

      };
    case ACTION_ZAPIS_FALSE:
      return {
        ...state,
        actionZapis: false,

      };

    case DEFAULT_AUTO:
      //console.warn (action.data);
      return {
        ...state,
        defaultAuto: action.data,

      };


    default:
      return state;
  }
}

export default combineReducers({
    reducer,
    record: recordReducer
})