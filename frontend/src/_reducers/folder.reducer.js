import { folderConstants } from '../_constants';

export function folder(state={
    f_id: 'user123',
    f_name:'손지원'

}, action) {
    if (action.type === 'CHANGE_FOLDER') {
        return {
            ...state,
            f_id: action.payload.f_id,
            f_name: action.payload.f_name
        }
    }
    return state
}
