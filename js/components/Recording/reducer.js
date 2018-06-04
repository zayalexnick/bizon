import { GET_RECORD, RECORD_REQUESTED, RECORD_RECEIVED } from './actions';

const initialState = {
    loading: false,
    record: {
        id: null,
        date: null,
        comment: null
    },
    auto: {
        id: null,
        vin: null,
        model: null,
        make: null
    },
    services: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case RECORD_REQUESTED:
            return { ...state, loading: true };
        case RECORD_RECEIVED:
            return { ...state, loading: false };
        case GET_RECORD:
            return {...state, loading: false, ...action.payload };
        default:
            return state;
    }
}