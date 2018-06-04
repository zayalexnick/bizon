export const GET_RECORD = 'GET_RECORD';
export const RECORD_REQUESTED = 'RECORD_REQUESTED';
export const RECORD_RECEIVED = 'RECORD_RECEIVED';

export const getRecord = (id) => {
    return async (dispatch) => {
        dispatch({ type: RECORD_REQUESTED });

        try
        {
            const response = await fetch(`http://auto-club42.ru/android/user.php?action=record&id=${id}`);
            const result = await response.json();

            if (result.status === 'success') {
                dispatch({ type: GET_RECORD, payload: result.data });
            }
        }
        catch (e)
        {
            console.warn(e);
        }

        dispatch({ type: RECORD_RECEIVED });
    }
};