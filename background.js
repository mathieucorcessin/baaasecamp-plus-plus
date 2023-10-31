chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'auth_api':
            handleAuthApi(message, sendResponse);
        break;
        case 'archive_message':
            handleBulkAction(message, sendResponse, 'archive');
        break;
        case 'pin_message':
            handleBulkAction(message, sendResponse, 'pin');
        break;
        case 'update_card_title':
            handleUpdateCardTitle(message, sendResponse);
        break;
    }
    return true;
});

function handleAuthApi(message, sendResponse) {
    const { clientId, clientSecret, redirectUri, refreshToken } = message;
    const url = `https://launchpad.37signals.com/authorization/token?type=refresh&refresh_token=${refreshToken}&client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}`;
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(handleFetchResponse)
    .then(data => sendResponse({ status: 'success', data }))
    .catch(error => handleError(error, sendResponse));
}

function handleBulkAction(message, sendResponse, action) {
    const { bucketId, currentAccountSlug, allMessagesId, apiToken } = message;
    let urlPart, method;
    
    switch (action) {
        case 'archive':
        urlPart = 'status/archived.json';
        method = 'PUT';
        break;
        case 'pin':
        urlPart = 'pin.json';
        method = 'POST';
        break;
        default:
        return handleError(new Error('Invalid action'), sendResponse);
    }
    
    const requests = allMessagesId.map((messageId) => {
        const url = `https://3.basecampapi.com${currentAccountSlug}/buckets/${bucketId}/recordings/${messageId}/${urlPart}`;
        
        return fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiToken}`
            }
        })
        .then(handleFetchResponse)
        .catch(error => handleError(error, sendResponse));
    });
    
    Promise.all(requests)
    .then(() => sendResponse({ status: 'success' }))
    .catch(error => handleError(error, sendResponse));
    
    return true;
}

function handleUpdateCardTitle(message, sendResponse) {
    const { cardId, newTitle, apiToken, bucketId, currentAccountSlug } = message;
    const url = `https://3.basecampapi.com${currentAccountSlug}/buckets/${bucketId}/card_tables/cards/${cardId}.json`;
    
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiToken}`
        },
        body: JSON.stringify({
            title: newTitle
        })
    })
    .then(handleFetchResponse)
    .then(data => sendResponse({ status: 'success', data }))
    .catch(error => handleError(error, sendResponse));
}

function handleFetchResponse(response) {
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    return response.text().then(text => text ? JSON.parse(text) : {});
}

function handleError(error, sendResponse) {
    console.error(error);
    sendResponse({ status: 'error', error: error.message });
}
