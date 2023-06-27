// Google Apps Script code for Telegram Bot and Google Drive integration

// Telegram bot token
const telegramToken = "YOUR_TELEGRAM_BOT_TOKEN";
const telegramApiUrl = "https://api.telegram.org/bot" + telegramToken;

// Web App URL
const webAppUrl = "https://script.google.com/macros/s/YOUR_WEB_APP_ID/exec";

// Google Docs ID for error logging
const docsId = "YOUR_GOOGLE_DOCS_ID";

// Parent folder ID where new folders will be created
const parentFolderId = 'YOUR_PARENT_FOLDER_ID';

/**
 * Sets the webhook for the Telegram bot.
 */
function setWebhook() {
  var response = UrlFetchApp.fetch(telegramApiUrl + "/setWebhook?url=" + webAppUrl);
  Logger.log(response.getContentText());
}

/**
 * Handles incoming HTTP POST requests.
 *
 * @param {Object} e The event object containing the request parameters.
 */
function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var messageText = contents.message.text;

    // Check if message starts with '@' to create a new folder
    if (messageText && messageText.startsWith("@")) {
      const folderName = messageText.slice(1).split(" ")[0];
      const folderId = DriveApp.getFolderById(parentFolderId).createFolder(folderName).getId();

      // Store current folder and file counter in script properties
      PropertiesService.getScriptProperties().setProperty("currentFolder", folderId);
      PropertiesService.getScriptProperties().setProperty("fileCounter", 1);
    }
    // Check if message contains a photo to process
    else if (contents.message.photo) {
      processPhoto(contents);
    }
  } catch (err) {
    // Log errors to a Google Docs file
    DocumentApp.openById(docsId).getBody().appendParagraph(err);
  }
}

/**
 * Processes the photo uploaded by the user.
 *
 * @param {Object} contents The contents of the Telegram message.
 */
function processPhoto(contents) {
  var fileCounter = Number(PropertiesService.getScriptProperties().getProperty("fileCounter"));
  var fileId = contents.message.photo[contents.message.photo.length - 1]["file_id"];
  var filePathUrl = telegramApiUrl + '/getFile?file_id=' + fileId;
  var response = UrlFetchApp.fetch(filePathUrl);
  response = JSON.parse(response.getContentText());
  var imageUrl = 'https://api.telegram.org/file/bot' + telegramToken + '/' + response.result["file_path"];
  var imageBlob = UrlFetchApp.fetch(imageUrl).getBlob();
  var currentFolder = DriveApp.getFolderById(PropertiesService.getScriptProperties().getProperty("currentFolder"));

  // Set metadata for the new file
  var meta_data = {
    title: fileCounter,
    mimeType: MimeType.GOOGLE_DOCS,
  };

  // Insert the image as a new file in Drive
  var tmp_file = Drive.Files.insert(meta_data, imageBlob);
  
  // Move the file to the current folder
  DriveApp.getFileById(tmp_file.id).moveTo(currentFolder);
  
  // Increment the file counter
  PropertiesService.getScriptProperties().setProperty("fileCounter", fileCounter + 1);
}
