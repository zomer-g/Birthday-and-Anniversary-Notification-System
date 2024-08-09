/**
 * This script checks the "DATA" Google Sheet for today's Hebrew birthdays and sends notifications to the recipients listed in column O.
 * It also logs all the messages it sends and notes if no matches were found.
 */

function checkHebrewBirthdays() {
  // Get the active spreadsheet and the "DATA" sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DATA");
  var data = sheet.getDataRange().getValues();
  
  // Get today's Hebrew date using the Hebcal API
  var todayHebrewDate = fetchHebrewDate(new Date());
  
  // Log today's Hebrew date for verification
  Logger.log("Today's Hebrew date: " + todayHebrewDate);
  
  // Extract only the day and month (e.g., "ה׳ בְּאָב")
  var todayHebrewDayMonth = todayHebrewDate.split(' ').slice(0, 2).join(' ');
  
  var matchFound = false;

  // Loop through the rows of the sheet
  for (var i = 1; i < data.length; i++) { // Start at 1 to skip headers
    var name = data[i][0];  // Column A - Name
    var hebrewBirthDate = data[i][13]; // Column N - Hebrew Birthdate
    
    // Extract only the day and month from the Hebrew birthdate (e.g., "ה׳ בְּאָב")
    var hebrewBirthDayMonth = hebrewBirthDate.split(' ').slice(0, 2).join(' ');
    
    var emailList = data[i][14]; // Column O - Email List
    var birthdate = new Date(data[i][10]); // Column K - Gregorian Birthdate
    
    // Check if today's Hebrew day and month matches the Hebrew birthdate's day and month
    if (todayHebrewDayMonth === hebrewBirthDayMonth) {
      var age = calculateAge(birthdate, new Date());
      sendHebrewBirthdayNotification(name, age, hebrewBirthDate, emailList);
      matchFound = true;
      Logger.log('Sent birthday message for ' + name + ' to ' + emailList);
    }
  }
  
  // Log if no matches were found
  if (!matchFound) {
    Logger.log("No matches found for today's Hebrew date: " + todayHebrewDate);
  }
}

/**
 * Fetches today's Hebrew date from the Hebcal API.
 * 
 * @param {Date} date - The Gregorian date to convert.
 * @return {String} - The Hebrew date as a string in the format "DD MONTH YYYY".
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
  
  // Construct the Hebrew date string in the format "DD MONTH YYYY"
  var hebrewDate = `${json.hebrew}`;
  
  return hebrewDate;
}

/**
 * Function to calculate age based on the birthdate and today's date.
 * 
 * @param {Date} birthdate - The birthdate.
 * @param {Date} today - Today's date.
 * @return {number} - The calculated age.
 */
function calculateAge(birthdate, today) {
  var age = today.getFullYear() - birthdate.getFullYear();
  var monthDifference = today.getMonth() - birthdate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }

  return age;
}

/**
 * Function to send the Hebrew birthday notification via email to multiple recipients.
 * 
 * @param {String} name - The name of the person.
 * @param {number} age - The age of the person.
 * @param {String} hebrewBirthDate - The Hebrew birthdate.
 * @param {String} emailList - The list of recipients from column O.
 */
function sendHebrewBirthdayNotification(name, age, hebrewBirthDate, emailList) {
  var recipient = "zomerg@gmail.com"; // Your email
  var recipients = recipient + "," + emailList; // Combine your email with the email list from column O
  var subject = "היום יום הולדת לצדיק";
  var message = "היי,\n\n" +
                "היום הזה, ביום " + hebrewBirthDate + ", " + name + " הצדיק בן צדיקים, חוגג " + age + " שנים של צדיקות, יראת השם, " +
                "אהבת תורה, ומעשים טובים. מי ייתן והקדוש ברוך הוא יברך את " + name + " בשפע של ברכה והצלחה בכל מעשה ידיו, " +
                "ושיזכה להמשיך בדרכו הנעלה ובנתיבי השם יתברך עד 120 שנה של בריאות, אושר ושמחה.\n\n" +
                "ההודעה נשלחה אלייך ממערך צל\"ע. לצערך הרב לא תוכל להסיר את עצמך אלא אם תתחנן ממש לזומר.";

  MailApp.sendEmail(recipients, subject, message);
  
  // Log the message that was sent
  Logger.log("Message sent to " + recipients + ": " + message);
}

// Set up a daily trigger to run this function
function createTrigger() {
  // Remove all existing triggers
  deleteTriggers();
  
  // Create a new time-based trigger
  ScriptApp.newTrigger("checkHebrewBirthdays")
           .timeBased()
           .everyDays(1)
           .atHour(9) // Adjust the hour to your preference
           .create();
}

// Clear existing triggers
function deleteTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}
