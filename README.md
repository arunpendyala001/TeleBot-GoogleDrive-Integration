# TeleBot-GoogleDrive-Integration
- Integration of a Telegram bot with Google Drive using Google Apps Script.
- Create folders in a specified parent folder by sending messages starting with '@'.
- Handle image uploads and automatically save them into the corresponding folder in a numbered order.
- Leverage the Telegram Bot API and Google Drive API for seamless communication and file management.
- Code includes comments for better understanding and serves as a starting point for similar integrations.

# Required changes to be made in main.js
- "YOUR_TELEGRAM_BOT_TOKEN":
  - Create a new bot using BotFather on telegram.
  - It will provide you with a token which needs to be entered in the code.
- "YOUR_GOOGLE_DOCS_ID":
  - Open a new Google document in the same google account being used on APPS SCRIPTS.
  - The ID can be found the url tab, when the document is open.
- "YOUR_PARENT_FOLDER_ID":
  - Create a new folder in Google Drive using the same google account.
  - The ID can be found the url tab, when the folder is open.

# Things to do before running the code for the first time
- After copying the code, you need to run the setWebhook() functon before deploying the code.
- In line 8 the value of webAppUrl needs to be replaced with the what the system gives you after deploying it for the first time.

# Things to remember
- Uploading a photo to the bot before creating a folder will not result in saving the photo to the drive.
- When a new folder is created, the destination for uploading subsequent photos is automatically updated to the newly created folder.
