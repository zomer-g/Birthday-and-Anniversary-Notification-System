/**
 * This script converts the Gregorian birth date in column K to the Hebrew birth date
 * using the Hebcal API and writes the Hebrew birth date in column N of the same row.
 */

function convertToHebrewDate() {
  // Get the active spreadsheet and the "DATA" sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('DATA');
  
  // Get the last row with data in the sheet
  var lastRow = sheet.getLastRow();
  
  // Loop through each row to convert the date
  for (var i = 2; i <= lastRow; i++) { // Assuming the first row is the header
    var birthDate = sheet.getRange(i, 11).getValue(); // Column K (11th column)
    
    if (birthDate) {
      try {
        // Convert Gregorian date to Hebrew date using the Hebcal API
        var hebrewDate = fetchHebrewDate(birthDate);
        
        // Write the Hebrew date to column N (14th column)
        sheet.getRange(i, 14).setValue(hebrewDate);
        
        Logger.log('Converted date for row ' + i + ': ' + hebrewDate);
      } catch (e) {
        Logger.log('Error converting date for row ' + i + ': ' + e.message);
      }
    }
  }
}

/**
 * Fetches the Hebrew date from the Hebcal API.
 * 
 * @param {Date} date - The Gregorian date to convert.
 * @return {String} - The Hebrew date as a string in Hebrew.
 */
function fetchHebrewDate(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1; // JavaScript months are 0-based
  var day = date.getDate();
  
  // Construct the API URL
  var url = `https://www.hebcal.com/converter?cfg=json&gy=${year}&gm=${month}&gd=${day}&g2h=1`;
  
  // Fetch the Hebrew date from the API
  var response = UrlFetchApp.fetch(url);
  var json = JSON.parse(response.getContentText());
  
  // Construct the Hebrew date string
  var hebrewDate = `${json.hebrew}`;
  
  return hebrewDate;
}
