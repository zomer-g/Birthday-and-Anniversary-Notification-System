// Purpose: This script checks the "DATA" Google Sheet for today's birthdays and past anniversaries (X years ago), calculates the age or years since the event, and sends notifications to multiple recipients.

function checkBirthdaysAndAnniversaries() {
  // Get the active spreadsheet and the "DATA" sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DATA");
  var data = sheet.getDataRange().getValues();
  
  // Get today's date (MM-DD format)
  var today = new Date();
  var todayMonthDay = (today.getMonth() + 1) + '-' + today.getDate(); // Month is 0-based, so we add 1

  // Loop through the rows of the sheet
  for (var i = 1; i < data.length; i++) { // Start at 1 to skip headers
    var name = data[i][0];  // Column A - Name
    var birthdate = new Date(data[i][10]); // Column K - Birthdate
    var anniversaryDate = new Date(data[i][11]); // Column L - Past Event Date
    var emailList = data[i][14]; // Column O - Email List
    var birthMonthDay = (birthdate.getMonth() + 1) + '-' + birthdate.getDate();
    var anniversaryMonthDay = (anniversaryDate.getMonth() + 1) + '-' + anniversaryDate.getDate();

    // Check if today is the person's birthday
    if (todayMonthDay == birthMonthDay) {
      var age = calculateAge(birthdate, today);
      sendBirthdayNotification(name, age, emailList);
    }

    // Check if today is the anniversary of the past event (X years ago)
    if (todayMonthDay == anniversaryMonthDay) {
      var yearsSince = calculateYearsSince(anniversaryDate, today);
      if (yearsSince > 0) {
        sendAnniversaryNotification(name, yearsSince, emailList);
      }
    }
  }
}

// Function to calculate age based on the birthdate and today's date
function calculateAge(birthdate, today) {
  var age = today.getFullYear() - birthdate.getFullYear();
  var monthDifference = today.getMonth() - birthdate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }

  return age;
}

// Function to calculate years since a given date
function calculateYearsSince(pastDate, today) {
  var yearsSince = today.getFullYear() - pastDate.getFullYear();
  var monthDifference = today.getMonth() - pastDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < pastDate.getDate())) {
    yearsSince--;
  }

  return yearsSince;
}

// Function to send the birthday notification via email to multiple recipients
function sendBirthdayNotification(name, age, emailList) {
  var recipient = "zomerg@gmail.com"; // Your email
  var recipients = recipient + "," + emailList; // Combine your email with the email list from column O
  var subject = "יום הולדת לחייל";
  var message = "היום יום ההולדת של " + name + " הוא בן " + age + "\n\n" +
                "ההודעה נשלחה אלייך ממערך צל\"ע. לצערך הרב לא תוכל להסיר את עצמך אלא אם תתחנן ממש לזומר";
  
  MailApp.sendEmail(recipients, subject, message);
}

// Function to send the anniversary notification via email to multiple recipients
function sendAnniversaryNotification(name, yearsSince, emailList) {
  var recipient = "zomerg@gmail.com"; // Your email
  var recipients = recipient + "," + emailList; // Combine your email with the email list from column O
  var subject = "עופיון עשה סיבוב על הגריל";
  var message = "העופיון " + name + " סיים " + yearsSince + " סיבובים על הגריל מאז שהשתחרר\n\n" +
                "ההודעה נשלחה אלייך ממערך צל\"ע. לצערך הרב לא תוכל להסיר את עצמך אלא אם תתחנן ממש לזומר";
  
  MailApp.sendEmail(recipients, subject, message);
}

// Set up a daily trigger to run this function
function createTrigger() {
  // Remove all existing triggers
  deleteTriggers();
  
  // Create a new time-based trigger
  ScriptApp.newTrigger("checkBirthdaysAndAnniversaries")
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
