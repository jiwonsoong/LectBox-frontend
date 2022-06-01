import { folderConstants } from '../_constants';

export const folderActions = {
    read,
    change
};
function change(id, name) {
    return {
        type: 'CHANGE_FOLDER',
        payload: {
            f_id: id,
            f_name: name
        }
    }
}

function read(f_id) {
    return dispatch => {
        dispatch(request({f_id}));

        folderService.read(f_id)
        .then(
            f_data => {
                dispatch(success(f_data));
            }
        )
        .catch(
            error => {
                dispatch(failure(error.toString()));
                dispatch(alertActions.error(error.toString()));
            }
        )
    }

    function request(f_id) { return { type: folderConstants.READ_REQUEST, f_id}}
    function success(f_data) { return { type: folderConstants.READ_SUCCESS, f_data } }
    function failure(error) { return { type: folderConstants.READ_FAILURE, error } }
}