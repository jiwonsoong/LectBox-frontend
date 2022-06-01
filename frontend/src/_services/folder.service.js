import { authHeader } from "../_helpers"

export const folderService = {
    read,
}

function read(f_id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch('/users/{f_id}', requestOptions).then(handleResponse)
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.status === 200) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                
                window.location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}