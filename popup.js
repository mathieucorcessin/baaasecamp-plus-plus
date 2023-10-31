document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get(['clientId', 'clientSecret', 'redirectUri', 'refreshToken'], function(items) {
        document.getElementById('clientId').value = items.clientId || '';
        document.getElementById('clientSecret').value = items.clientSecret || '';
        document.getElementById('redirectUri').value = items.redirectUri || '';
        document.getElementById('refreshToken').value = items.refreshToken || '';
    });
});

document.getElementById('credentialsForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const clientId = document.getElementById('clientId').value;
    const clientSecret = document.getElementById('clientSecret').value;
    const redirectUri = document.getElementById('redirectUri').value;
    const refreshToken = document.getElementById('refreshToken').value;

    chrome.runtime.sendMessage({
        type: 'auth_api',
        refreshToken: refreshToken,
        clientId: clientId,
        clientSecret: clientSecret,
        redirectUri: redirectUri
    }, function (response) {
        if (response && response.status === 'success') {
            document.getElementById('errorMessage').style.display = 'none';
            
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('successMessage').innerText = 'Connected to Basecamp API ✅';
            
            chrome.storage.sync.set({
                clientId,
                clientSecret,
                redirectUri,
                refreshToken
            });
        } else {
            document.getElementById('successMessage').style.display = 'none';
            document.getElementById('errorMessage').style.display = 'block';
            document.getElementById('errorMessage').innerText = 'Failed to authenticate! Please verify your settings.';
        }
    });     
});
