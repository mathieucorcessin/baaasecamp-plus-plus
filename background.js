chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'auth_api') {
    var clientId = message.clientId;
    var clientSecret = message.clientSecret;
    var redirectUri = message.redirectUri;
    var refreshToken = message.refreshToken;

    var url = 'https://launchpad.37signals.com/authorization/token?type=refresh&refresh_token=' + refreshToken + '&client_id=' + clientId + '&redirect_uri=' + redirectUri + '&client_secret=' + clientSecret;
    
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      statusIsOk = response.ok;
      return response.json();
    })
    .then(data => {
      if (statusIsOk) {
        sendResponse({ 
          status: 'success',
          data: data,
        });
      }
      else {
        sendResponse({ status: 'error' });
      }
    })
    .catch(error => {
      console.error(error);
      sendResponse({ status: 'error' });
    });

    return true;

  }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'archive_message') {
    var bucketId = message.bucketId;
    var currentAccountSlug = message.currentAccountSlug;
    var messageId = message.messageId;
    var apiToken = message.apiToken;

    var url = 'https://3.basecampapi.com' + currentAccountSlug + '/buckets/' + bucketId + '/recordings/' + messageId + '/status/archived.json';
    
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiToken
      }
    })
    .then(response => {
      if (response.ok) {
        sendResponse({ status: 'success' });
      }
      else {
        sendResponse({ status: 'error' });
      }
    })
    .catch(error => {
      console.error(error);
      sendResponse({ status: 'error' });
    });

    return true;

  }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'pin_message') {
    var bucketId = message.bucketId;
    var currentAccountSlug = message.currentAccountSlug;
    var messageId = message.messageId;
    var apiToken = message.apiToken;

    var url = 'https://3.basecampapi.com' + currentAccountSlug + '/buckets/' + bucketId + '/recordings/' + messageId + '/pin.json';
    
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiToken
      }
    })
    .then(response => {
      if (response.ok) {
        sendResponse({ status: 'success' });
      }
      else {
        sendResponse({ status: 'error' });
      }
    })
    .catch(error => {
      console.error(error);
      sendResponse({ status: 'error' });
    });

    return true;

  }
});