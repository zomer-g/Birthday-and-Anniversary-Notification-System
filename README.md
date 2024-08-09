# Birthday and Anniversary Notification System

This Google Apps Script automates the process of sending birthday and anniversary notifications based on data stored in a Google Sheet named "DATA." The system is designed to send email notifications for birthdays and specific anniversaries to a list of recipients.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Google Sheet Structure](#google-sheet-structure)
- [Script Functions](#script-functions)
  - [checkBirthdaysAndAnniversaries](#checkbirthdaysandanniversaries)
  - [calculateAge](#calculateage)
  - [calculateYearsSince](#calculateyearssince)
  - [sendBirthdayNotification](#sendbirthdaynotification)
  - [sendAnniversaryNotification](#sendanniversarynotification)
  - [createTrigger](#createtrigger)
  - [deleteTriggers](#deletetriggers)
- [Installation and Setup](#installation-and-setup)
- [Customization](#customization)
- [License](#license)

## Overview

The system is designed to automate the sending of birthday and anniversary notifications via email. It checks the "DATA" Google Sheet for today's date and compares it to the birthdates and past event dates stored in the sheet. If there is a match, it sends a notification email to a specified list of recipients.

## Features

- **Birthday Notifications**: Sends an email when today's date matches the birthdate of a person listed in the Google Sheet.
- **Anniversary Notifications**: Sends an email when today's date matches a past event date (X years ago) for a person listed in the Google Sheet.
- **Automated Triggers**: The script is designed to run daily using a time-based trigger.
- **Customizable Messages**: The content of the email notifications can be easily customized.

## Google Sheet Structure

The script assumes the following structure for the "DATA" sheet:

- **Column A**: Name of the person.
- **Column K**: Birthdate of the person (Date format).
- **Column L**: Past event date, such as a discharge date (Date format).
- **Column O**: List of recipient email addresses separated by commas.

google sheet template
https://docs.google.com/spreadsheets/d/1fOt3jrJQq5QgzecFDt-m9KkKY07bnxpLvk83gvf1-q0/edit?gid=1858501632#gid=1858501632

## Script Functions

### `checkBirthdaysAndAnniversaries`
This is the main function that checks the Google Sheet for birthdays and anniversaries. It loops through each row of the sheet, compares the dates in columns K and L with today's date, and triggers the appropriate notification functions.

### `calculateAge`
Calculates the current age of a person based on their birthdate and today's date.

### `calculateYearsSince`
Calculates the number of years since a past event based on the event date and today's date.

### `sendBirthdayNotification`
Sends an email notification for a person's birthday. The email includes the name of the person and their current age. The subject of the email is "יום הולדת לחייל" and the body contains the message "היום יום ההולדת של {name} הוא בן {age}".

### `sendAnniversaryNotification`
Sends an email notification for a past event anniversary. The email includes the name of the person and the number of years since the event. The subject of the email is "עופיון עשה סיבוב על הגריל" and the body contains the message "העופיון {name} סיים {yearsSince} סיבובים על הגריל מאז שהשתחרר". Additionally, a new line is added with the text "ההודעה נשלחה אלייך ממערך צל\"ע. לצערך הרב לא תוכל להסיר את עצמך אלא אם תתחנן ממש לזומר".

### `createTrigger`
Sets up a daily time-based trigger to run the `checkBirthdaysAndAnniversaries` function at a specified hour.

### `deleteTriggers`
Deletes all existing triggers for the project to avoid multiple triggers running the same function.

## Installation and Setup

1. **Create or Open the Google Sheet**: Ensure that you have a Google Sheet named "DATA" with the required structure.
2. **Create a New Google Apps Script Project**: Open the Script Editor from your Google Sheet by navigating to `Extensions > Apps Script`.
3. **Copy and Paste the Script**: Copy the entire script provided in this README and paste it into the Script Editor.
4. **Save and Authorize**: Save the script and authorize it to access your Google Sheet and send emails on your behalf.
5. **Set Up Triggers**: Run the `createTrigger` function manually once to set up the daily trigger.

## Customization

- **Change the Notification Time**: Modify the hour in the `createTrigger` function to adjust when the script runs each day.
- **Customize Email Content**: Modify the text in the `sendBirthdayNotification` and `sendAnniversaryNotification` functions to personalize the messages.
- **Adjust Columns**: If your Google Sheet structure differs, update the column indices in the script accordingly.

## License

This project is licensed under the MIT License. Feel free to use, modify, and distribute this script as needed.
