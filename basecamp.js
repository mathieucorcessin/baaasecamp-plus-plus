class UserSettings {
	constructor() {
		this.loadData();
	}

	loadData() {
		return new Promise((resolve, reject) => {
			chrome.storage.sync.get(['clientId', 'clientSecret', 'redirectUri', 'refreshToken'], (items) => {
				if (chrome.runtime.lastError) {
					return reject(chrome.runtime.lastError);
				}
				this.clientId = items.clientId;
				this.clientSecret = items.clientSecret;
				this.redirectUri = items.redirectUri;
				this.refreshToken = items.refreshToken;
				resolve();
			});
		});
	}

	getClientId() {
		return this.clientId;
	}

	getClientSecret() {
		return this.clientSecret;
	}

	getRedirectUri() {
		return this.redirectUri;
	}

	getRefreshToken() {
		return this.refreshToken;
	}
}
class DOMManipulator {
	constructor() {
		this.messageBoard = document.querySelector('.message-board__content');
		this.newMessageButton = this.messageBoard ? document.querySelector('.perma__new a') : '';
		this.messages = this.messageBoard ? document.querySelectorAll('.messages-table__what') : [];
		this.checkboxes = [];
		this.bucketIdMeta = document.querySelector('meta[name="current-bucket-id"]');
		this.bucketId = this.bucketIdMeta ? this.bucketIdMeta.content : '';
		this.currentAccountSlugMeta = document.querySelector('meta[name="current-account-slug-path"]');
		this.currentAccountSlug = this.currentAccountSlugMeta.content;
	}

	getMessageBoard() {
		return this.messageBoard;
	}

	getNewMessageButton() {
		return this.newMessageButton;
	}

	getMessages() {
		return this.messages;
	}

	getAllCheckboxes() {
		this.checkboxes = document.querySelectorAll('.bsc-plus-plus--checkbox');
		return this.checkboxes;
	}

	getBucketId() {
		return this.bucketId
	}

	getCurrentAccountSlug() {
		return this.currentAccountSlug;
	}

	static createButton(label, classNames) {
		const button = document.createElement('button');
		button.innerText = label;
		button.className = classNames;

		return button;
	}

	static insertAdjacentElement(referenceNode, newElement, position = 'afterend') {
		referenceNode.insertAdjacentElement(position, newElement);
	}

	static setStyle(element, property, value) {
		element.style[property] = value;
		return element;
	}

	static insertCheckboxesAndCreateSelectAllButton(domManipulatorInstance, ticketElements) {
		if (ticketElements) {
			ticketElements.forEach((ticketElement) => {
				const checkbox = document.createElement('input');
				checkbox.type = 'checkbox';
				checkbox.className = 'bsc-plus-plus--checkbox';
				ticketElement.insertBefore(checkbox, ticketElement.firstChild);
			});
		}

		const bulkButtons = document.querySelectorAll('.bsc-plus-plus--bulk');

		if (bulkButtons) {
			bulkButtons.forEach((button) => {
				button.remove();
			});
		}

		const selectAllButton = this.setStyle(
			this.createButton('Select All', 'btn btn--small'),
			'marginRight', '10px'
		);

		const messageBoard = domManipulatorInstance.getMessageBoard();

		if (messageBoard) {
			messageBoard.insertAdjacentElement('beforebegin', selectAllButton);
			selectAllButton.addEventListener('click', () => {
				BulkAction.toggleCheckboxes(selectAllButton);
			});
		}
	}

	getKanbanCards() {
        return document.querySelectorAll('.kanban-card');
    }

    insertQuickEditIcon(card, onClickHandler) {
        const editIcon = document.createElement('span');
        editIcon.innerText = '✎';
        editIcon.className = 'quick-edit-icon';
        editIcon.onclick = onClickHandler;
        card.insertBefore(editIcon, card.firstChild);
		DOMManipulator.setStyle(editIcon, 'marginRight', '10px');

		return editIcon;
    }

	insertQuickEditInput(originalTitle) {
		const inputElement = document.createElement('input');
		inputElement.type = 'text';
		DOMManipulator.setStyle(inputElement, 'width', '100%');
		inputElement.value = originalTitle;

		return inputElement;
	}

	static copyAttributesAndChildren(sourceElement, targetElement) {
        for (const attribute of sourceElement.attributes) {
            targetElement.setAttribute(attribute.name, attribute.value);
        }

        while (sourceElement.firstChild) {
            targetElement.appendChild(sourceElement.firstChild);
        }
    }
}
class BulkAction {
	static createAndSetupBulkActionsButton() {
        const bulkActionsButton = DOMManipulator.setStyle(
            DOMManipulator.createButton('🛠 Bulk Actions', 'btn btn--small'),
            'marginLeft', '10px'
        );
    
        const domManipulator = new DOMManipulator();
        const newMessageButton = domManipulator.getNewMessageButton();
    
        if (newMessageButton) {
            newMessageButton.insertAdjacentElement('afterend', bulkActionsButton);
        }
    
        bulkActionsButton.addEventListener('click', () => {
            DOMManipulator.setStyle(bulkActionsButton, 'display', 'none');
            
            const bulkCancelButton = this.createAndSetupBulkCancelButton();
            DOMManipulator.setStyle(bulkCancelButton, 'display', 'initial');
            DOMManipulator.setStyle(bulkCancelButton, 'marginLeft', '10px');
    
            if (newMessageButton) {
                newMessageButton.insertAdjacentElement('afterend', bulkCancelButton);
            }
    
            const messageBoard = domManipulator.getMessageBoard();
    
            if (messageBoard) {
                const bulkArchiveButton = this.createAndSetupBulkArchiveButton();
                const bulkPinButton = this.createAndSetupBulkPinButton();
                messageBoard.insertAdjacentElement('beforebegin', bulkArchiveButton);
                messageBoard.insertAdjacentElement('beforebegin', bulkPinButton);
            }
        });
    }

	static createAndSetupBulkArchiveButton() {
		const bulkArchiveButton = DOMManipulator.setStyle(
			DOMManipulator.createButton('📁 Bulk Archive', 'btn btn--small bsc-plus-plus--bulk'),
			'marginRight', '10px'
		);
	
		bulkArchiveButton.addEventListener('click', () => {
			const domManipulator = new DOMManipulator();
			DOMManipulator.insertCheckboxesAndCreateSelectAllButton(domManipulator, domManipulator.getMessages());
	
			const messageBoard = domManipulator.getMessageBoard();
	
			if (messageBoard) {
				const submitButton = DOMManipulator.createButton('Archive selected messages', 'btn btn--small btn--primary');
				messageBoard.insertAdjacentElement('beforebegin', submitButton);
	
				submitButton.addEventListener('click', () => {
					BulkAction.performBulkAction('archive');
				});
			}
		});
	
		return bulkArchiveButton;
	}

	static createAndSetupBulkPinButton() {
		const bulkPinButton = DOMManipulator.setStyle(
			DOMManipulator.createButton('📌 Bulk Pin', 'btn btn--small bsc-plus-plus--bulk'),
			'marginRight', '10px'
		);
	
		bulkPinButton.addEventListener('click', () => {
			const domManipulator = new DOMManipulator();
			DOMManipulator.insertCheckboxesAndCreateSelectAllButton(domManipulator, domManipulator.getMessages());
	
			const messageBoard = domManipulator.getMessageBoard();
	
			if (messageBoard) {
				const submitButton = DOMManipulator.createButton('Pin selected messages', 'btn btn--small btn--primary');
				messageBoard.insertAdjacentElement('beforebegin', submitButton);
	
				submitButton.addEventListener('click', () => {
					BulkAction.performBulkAction('pin');
				});
			}
		});
	
		return bulkPinButton;
	}	
	
	static createAndSetupBulkCancelButton() {
		const bulkCancelButton = DOMManipulator.setStyle(
			DOMManipulator.createButton('Cancel', 'btn btn--small'),
			'display', 'none'
		);
	
		bulkCancelButton.addEventListener('click', () => {
			location.reload();
		});
	
		return bulkCancelButton;
	}	

	static toggleCheckboxes(selectAllButton) {
		const domManipulator = new DOMManipulator();
		let checkboxes = domManipulator.getAllCheckboxes();

		checkboxes = [...checkboxes];
		const checkAll = checkboxes.some(checkbox => !checkbox.checked);

		checkboxes.forEach((checkbox) => {
			checkbox.checked = checkAll;
		});

		selectAllButton.textContent = checkAll ? 'Unselect All' : 'Select All';
	}

	static getMessageId(checkbox) {
		const messageIdAttr = checkbox.getAttribute('data-message-id');
		const linkElement = checkbox.parentElement.querySelector('a');
		const urlObject = new URL(linkElement.href);
		const path = urlObject.pathname;
		const segments = path.split('/');
		return segments[segments.length - 1] || messageIdAttr;
	}

	static getSelectedMessageIds() {
		const domManipulator = new DOMManipulator();
		const checkboxes = domManipulator.getAllCheckboxes();
		const selectedMessageIds = [];

		checkboxes.forEach((checkbox) => {
			if (checkbox.checked) {
				const messageId = this.getMessageId(checkbox);
				selectedMessageIds.push(messageId);
			}
		});

		return selectedMessageIds;
	}

	static performBulkAction(actionType) {
		const selectedMessageIds = this.getSelectedMessageIds();

		if (!selectedMessageIds.length) {
			console.warn('No messages selected for bulk action.');
			return;
		}

		switch (actionType) {
			case 'archive':
				this.executeBulkAction('archive_message', selectedMessageIds, 'Messages archived successfully!', 'Error while archiving...');
				break;
			case 'pin':
				this.executeBulkAction('pin_message', selectedMessageIds, 'Messages pinned successfully!', 'Error while pinning...');
				break;
			default:
				console.warn('Invalid action type specified for bulk action.');
		}
	}

	static executeBulkAction(actionType, selectedMessageIds, successMessage, errorMessage) {
		const userSettings = new UserSettings();
		const domManipulator = new DOMManipulator();

		userSettings.loadData().then(() => {
			chrome.runtime.sendMessage({
				type: 'auth_api',
				refreshToken: userSettings.getRefreshToken(),
				clientId: userSettings.getClientId(),
				clientSecret: userSettings.getClientSecret(),
				redirectUri: userSettings.getRedirectUri()
			}, function(response) {
				if (response.status === 'success') {
					const apiToken = response.data.access_token;

					chrome.runtime.sendMessage({
						type: actionType,
						bucketId: domManipulator.getBucketId(),
						currentAccountSlug: domManipulator.getCurrentAccountSlug(),
						allMessagesId: selectedMessageIds,
						apiToken: apiToken
					}, function(response) {
						if (response.status === 'success') {
							console.log(successMessage);
							location.reload();
						} else {
							console.error(errorMessage + response.error);
						}
					});
				} else {
					console.error('Error while connecting to Basecamp API...');
				}
			});
		}).catch(error => {
			console.error(error);
		});
	}
}

class CardTable {
	static setupQuickEditIcons() {
        const domManipulator = new DOMManipulator();
        const kanbanCards = domManipulator.getKanbanCards();

        kanbanCards.forEach(card => {
            domManipulator.insertQuickEditIcon(card, this.handleQuickEditClick);
        });
    }

	static handleQuickEditClick(event) {
		event.preventDefault();
		const domManipulator = new DOMManipulator();
		
		let cardElement = event.target;
		while (!cardElement.classList.contains('kanban-card')) {
			cardElement = cardElement.parentElement;
		}

		const linkElement = cardElement.querySelector('.kanban-card__link');

		const divElement = document.createElement('div');
		DOMManipulator.copyAttributesAndChildren(linkElement, divElement);
		linkElement.replaceWith(divElement);
	
		const titleElement = cardElement.querySelector('.kanban-card__title');
		const originalTitle = titleElement.innerText;
	
		const inputElement = domManipulator.insertQuickEditInput(originalTitle);

		inputElement.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				const newLinkElement = document.createElement('a');
				DOMManipulator.copyAttributesAndChildren(divElement, newLinkElement);
				divElement.replaceWith(newLinkElement);
				const linkElement = cardElement.querySelector('.kanban-card__link');
				const cardId = CardTable.getCardId(linkElement);
				
				CardTable.updateCardTitle(inputElement, titleElement, originalTitle, cardId);
			}
		});

		titleElement.replaceWith(inputElement);
		inputElement.focus();
	}

	static getCardId(linkElement) {
		const urlObject = new URL(linkElement.href);
		const path = urlObject.pathname;
		const segments = path.split('/');
		return segments[segments.length - 1];
	}	
	
	static updateCardTitle(inputElement, titleElement, originalTitle, cardId) {
		const newTitle = inputElement.value;
	
		const userSettings = new UserSettings();
		userSettings.loadData().then(() => {
			chrome.runtime.sendMessage({
				type: 'auth_api',
				refreshToken: userSettings.getRefreshToken(),
				clientId: userSettings.getClientId(),
				clientSecret: userSettings.getClientSecret(),
				redirectUri: userSettings.getRedirectUri()
			}, function(response) {
				if (response.status === 'success') {
					const apiToken = response.data.access_token;
					const domManipulator = new DOMManipulator;

					chrome.runtime.sendMessage({
						type: 'update_card_title',
						bucketId: domManipulator.getBucketId(),
						currentAccountSlug: domManipulator.getCurrentAccountSlug(),
						cardId: cardId,
						newTitle: newTitle,
						apiToken: apiToken
					}, function(response) {
						if (response.status === 'success') {
							console.log('Card title updated successfully!');
							titleElement.innerText = newTitle;
							inputElement.replaceWith(titleElement);
						} else {
							console.error('Error while updating card title: ' + response.error);
							titleElement.innerText = originalTitle;
							inputElement.replaceWith(titleElement);
						}
					});
				} else {
					console.error('Error while connecting to Basecamp API...');
				}
			});
		}).catch(error => {
			console.error(error);
		});
	}	
}

BulkAction.createAndSetupBulkActionsButton();
CardTable.setupQuickEditIcons();