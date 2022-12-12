const clientId = '';
const clientSecret = '';
const redirectUri = 'https://';
const refreshToken = '';

const messageBoard = document.querySelector('.message-board__content');
const newMessageLink = messageBoard ? document.querySelector('.perma__new a') : '';

function getAccountInformations() {
  bucketIdMeta = document.querySelector('meta[name="current-bucket-id"]');
  bucketId = bucketIdMeta ? bucketIdMeta.content : '';
  
  currentAccountSlugMeta = document.querySelector('meta[name="current-account-slug-path"]');
  currentAccountSlug = currentAccountSlugMeta.content;

  accountInformations = [bucketId, currentAccountSlug];

  return accountInformations;
}

function createPrimaryButton(label) {
  button = document.createElement('button');
  button.innerText = label;
  button.className = 'btn btn--small btn--primary';

  return button;
}

function createSecondaryButton(label) {
  button = document.createElement('button');
  button.innerText = label;
  button.className = 'btn btn--small';

  return button;
}

function createCheckboxesBeforeMessages() {
  const ticketElements = document.querySelectorAll('.messages-table__what');

    ticketElements.forEach((ticketElement) => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'ywd-checkbox';

    ticketElement.insertBefore(checkbox, ticketElement.firstChild);
  })
}

function getAllCheckboxes() {
  checkboxes = document.querySelectorAll('.ywd-checkbox');

  return checkboxes;
}

function getMessageId(checkbox) {
  messageId = checkbox.getAttribute('data-message-id');
  linkElement = checkbox.parentElement.querySelector('a');

  urlObject = new URL(linkElement.href);
  path = urlObject.pathname;
  segments = path.split('/');
  lastSegment = segments[segments.length - 1];

  messageId = lastSegment;

  return messageId;
}

function bulkActions() {
  const bulkActionsButton = createSecondaryButton('🛠 Bulk Actions');
  bulkActionsButton.style.marginLeft = '10px';
  newMessageLink ? newMessageLink.insertAdjacentElement('afterend', bulkActionsButton) : null;

  const bulkArchiveButton = createSecondaryButton('📁 Bulk Archive');
  bulkArchiveButton.style.marginRight = '10px';

  const bulkPinButton = createSecondaryButton('📌 Bulk Pin');
  
  const bulkActionsCancelButton = createSecondaryButton('Cancel');
  bulkActionsCancelButton.style.marginLeft = '10px';
  bulkActionsCancelButton.style.display = 'none';
  newMessageLink ? newMessageLink.insertAdjacentElement('afterend', bulkActionsCancelButton) : null;

  const selectAllButton = createSecondaryButton('Select All');
  selectAllButton.style.marginRight = '10px';

  const validateBulkArchiveButton = createPrimaryButton('Archive selected messages');
  const validateBulkPinButton = createPrimaryButton('Pin selected messages');
  
  bulkActionsButton.addEventListener('click', () => {
    messageBoard ? messageBoard.insertAdjacentElement('beforebegin', bulkArchiveButton) : null;
    messageBoard ? messageBoard.insertAdjacentElement('beforebegin', bulkPinButton) : null;
    bulkActionsButton.style.display = 'none';
    bulkActionsCancelButton.style.display = 'initial';
  });

  bulkActionsCancelButton.addEventListener('click', () => {
    location.reload();
  });

  bulkArchiveButton.addEventListener('click', () => {
    createCheckboxesBeforeMessages();

    messageBoard.insertAdjacentElement('beforebegin', selectAllButton);
    messageBoard.insertAdjacentElement('beforebegin', validateBulkArchiveButton);
    bulkPinButton.remove();
    bulkArchiveButton.remove();
  });

  bulkPinButton.addEventListener('click', () => {
    createCheckboxesBeforeMessages();

    messageBoard.insertAdjacentElement('beforebegin', selectAllButton);
    messageBoard.insertAdjacentElement('beforebegin', validateBulkPinButton);
    bulkPinButton.remove();
    bulkArchiveButton.remove();
  });

  selectAllButton.addEventListener('click', () => {
    checkboxes = getAllCheckboxes();

    checkboxes.forEach((checkbox) => {
      checkbox.checked = true;
    });
  });

  validateBulkArchiveButton.addEventListener('click', () => {
    allMessagesId = [];
    checkboxes = getAllCheckboxes();
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        messageId = getMessageId(checkbox);
        allMessagesId.push(messageId);
      }
    });

    chrome.runtime.sendMessage({
      type: 'auth_api',
      refreshToken: refreshToken,
      clientId: clientId,
      clientSecret: clientSecret,
      redirectUri: redirectUri
    }, function(response) {
      if (response.status === 'success') {
        apiToken = (response.data.access_token);

        chrome.runtime.sendMessage({
          type: 'archive_message',
          bucketId: getAccountInformations()[0],
          currentAccountSlug: getAccountInformations()[1],
          allMessagesId: allMessagesId,
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
      else {
        console.error('Error while connecting to Basecamp API...');
      }
    });
  });

  validateBulkPinButton.addEventListener('click', () => {
    allMessagesId = [];
    checkboxes = getAllCheckboxes();
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        messageId = getMessageId(checkbox);
        allMessagesId.push(messageId);
      }
    });
      chrome.runtime.sendMessage({
        type: 'auth_api',
        refreshToken: refreshToken,
        clientId: clientId,
        clientSecret: clientSecret,
        redirectUri: redirectUri
      }, function(response) {
        if (response.status === 'success') {
          apiToken = (response.data.access_token);

          chrome.runtime.sendMessage({
            type: 'pin_message',
            bucketId: getAccountInformations()[0],
            currentAccountSlug: getAccountInformations()[1],
            allMessagesId: allMessagesId,
            apiToken: apiToken
          }, function(response) {
            if (response.status === 'success') {
              console.log('Messages pinned successfully!');
              location.reload();
            }
            else {
              console.error('Error while pinning...');
            }
          });
        }
        else {
          console.error('Error while connecting to Basecamp API...');
        }
      });
  });
}

bulkActions();