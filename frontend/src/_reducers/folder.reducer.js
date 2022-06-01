import { folderConstants } from '../_constants';

export function folder(state={
    value:'first'}, action) {
    if (action.type === 'CHANGE_FOLDER') {
        return {
            ...state,
            value: action.payload
        }
    }
    return state
}
