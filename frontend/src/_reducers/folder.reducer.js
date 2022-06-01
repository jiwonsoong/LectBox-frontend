import { folderConstants } from '../_constants';

export function folder(state = {
    // 현재 위치하고 있는 폴더 정보
    folderId: 'test',
    folderName: 'test',
    made_by: 'test',
    max_volume: 'test',
    pres_volume: 'test',
    kinds: 0,
    items_by_name: []
}, action) {
    switch (action.type) {
        case folderConstants.FOLDER_REQUEST:
            return {
                ...state,

            }
        default:
            return
    }
}