# Baaasecamp++

At Yes We Dev, we use Basecamp with our clients. I developed this extension to add more functionality to Basecamp and save time.

⚠ I'm Product Manager, not developer, code could propably be improved.

## Features

### Bulk Archive

You can select multiple messages to archive at once.

https://user-images.githubusercontent.com/110381337/206746947-15b21def-ee29-4ec1-82f0-a7ef8d4c0a03.mov

### Bulk Pin

You can select multiple messages to pin at once.

https://user-images.githubusercontent.com/110381337/206746975-f11188e6-d1ee-420a-b294-8f879586261f.mov

### Kanban Cards - Quick edit

You can quick edit the title of Kanban Cards. Click, edit and press Enter ✨

https://github.com/mathieucorcessin/baaasecamp-plus-plus/assets/110381337/de86d0e8-3388-4287-88df-9376a1b7a7a0

## How to install

1. Download the latest release of the extension from the [releases page](https://github.com/mathieucorcessin/baaasecamp-plus-plus/releases) on GitHub.
2. In Google Chrome (or Brave), open the Extensions page (chrome://extensions/).
3. Enable Developer mode by clicking the toggle switch in the top right corner of the page.
4. Click the Load unpacked button and select the directory where you unzipped the extension files.
5. Click the extension icon to display the settings form.
    1. Add your `clientId`, `clientSecret`, `redirectUri` and `refreshToken`. You can get this informations by following [this link](https://github.com/basecamp/api/blob/master/sections/authentication.md#oauth-2-from-scratch).
    2. Save.

![settings-form](https://github.com/mathieucorcessin/baaasecamp-plus-plus/assets/110381337/79b508eb-ee24-4854-b2b4-e0e9a7e93fef)

Baaasecamp++ should now be installed and active on Basecamp.

## Help

- If the Bulk Archive button isn't displayed, refresh the page.
- If the Bulk Archive button doesn't create a checkbox before each message, refresh the page, scroll down to load all the messages and try again.
- If nothing happened after submitting the bulk actions, open the developer console (F12 or Ctrl + Shift + I), and if there is an error, go back to "How to install" and check that you did everything correctly.

## Roadmap & Ideas

- [ ] Bulk edit on message categories.
- [ ] Export messages.

## Changelog

Go to the [releases page](https://github.com/mathieucorcessin/baaasecamp-plus-plus/releases).
