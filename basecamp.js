const clientId = '';
const clientSecret = '';
const redirectUri = 'https://';
const refreshToken = '';

function bulkArchiveTickets() {

  chrome.runtime.sendMessage({
    type: 'auth_api',
    refreshToken: refreshToken,
    clientId: clientId,
    clientSecret: clientSecret,
    redirectUri: redirectUri
  }, function(response) {
    if (response.status === 'success') {
      apiToken = (response.data.access_token);
    }
    else {
      console.error('Error while connecting...');
    }
  });

  const bucketIdMeta = document.querySelector('meta[name="current-bucket-id"]');
  const bucketId = bucketIdMeta ? bucketIdMeta.content : '';
  
  const currentAccountSlugMeta = document.querySelector('meta[name="current-account-slug-path"]');
  const currentAccountSlug = currentAccountSlugMeta.content;

  const bulkButton = document.createElement('button');
  bulkButton.innerText = 'Bulk Archive';
  bulkButton.className = 'btn btn--small';

  const validateButton = document.createElement('button');
  validateButton.innerText = 'Archive selected messages';
  validateButton.className = 'btn btn--small btn--primary';

  const messageBoard = document.querySelector('.message-board__content');
  messageBoard ? messageBoard.insertAdjacentElement('beforebegin', bulkButton) : null;

  bulkButton.addEventListener('click', () => {
    const ticketElements = document.querySelectorAll('.messages-table__what');

    ticketElements.forEach((ticketElement) => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'ywd-checkbox';

    ticketElement.insertBefore(checkbox, ticketElement.firstChild);
  });
    
  messageBoard.insertAdjacentElement('beforebegin', validateButton);
  bulkButton.remove();

});

  validateButton.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.ywd-checkbox');

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        let messageId = checkbox.getAttribute('data-message-id');
        const linkElement = checkbox.parentElement.querySelector('a');

        const urlObject = new URL(linkElement.href);
        const path = urlObject.pathname;
        const segments = path.split('/');
        let lastSegment = segments[segments.length - 1];

        messageId = lastSegment;

        chrome.runtime.sendMessage({
          type: 'archive_message',
          bucketId: bucketId,
          currentAccountSlug: currentAccountSlug,
          messageId: messageId,
          apiToken: apiToken
        }, function(response) {
          if (response.status === 'success') {
            console.log('Messages archived successfully!');
            location.reload();
          }
          else {
            console.error('Error while archiving...');
          }
        });
      }
    });
  });
}

bulkArchiveTickets();