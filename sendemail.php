<?php

// Define some constants
define( "RECIPIENT_NAME", "Prashanti Forex Desk" );
define( "RECIPIENT_EMAIL", "rajatprasad@prashantiforex.com" );

// Read the form values
$success = false;
$userName = isset( $_POST['username'] ) ? preg_replace( "/[^\s\S\.\-\_\@a-zA-Z0-9]/", "", $_POST['username'] ) : "";
$senderEmail = isset( $_POST['email'] ) ? preg_replace( "/[^\.\-\_\@a-zA-Z0-9]/", "", $_POST['email'] ) : "";
$senderPhone = isset( $_POST['phone'] ) ? preg_replace( "/[^\.\-\_\@a-zA-Z0-9]/", "", $_POST['phone'] ) : "";
$company = isset( $_POST['company'] ) ? preg_replace( "/[^\s\S\.\-\_\@a-zA-Z0-9]/", "", $_POST['company'] ) : "";
$designation = isset( $_POST['designation'] ) ? preg_replace( "/[^\s\S\.\-\_\@a-zA-Z0-9]/", "", $_POST['designation'] ) : "";
$turnover = isset( $_POST['turnover'] ) ? preg_replace( "/[^\s\S\.\-\_\@a-zA-Z0-9]/", "", $_POST['turnover'] ) : "";
$userSubject = isset( $_POST['subject'] ) ? preg_replace( "/[^\s\S\.\-\_\@a-zA-Z0-9]/", "", $_POST['subject'] ) : "Treasury Consultation Request";
$message = isset( $_POST['message'] ) ? preg_replace( "/(From:|To:|BCC:|CC:|Subject:|Content-Type:)/", "", $_POST['message'] ) : "";

// If all core values exist, send the email
if ( $userName && $senderEmail && $senderPhone ) {
  $recipient = RECIPIENT_NAME . " <" . RECIPIENT_EMAIL . ">";
  $headers = "From: " . $userName . " <" . $senderEmail . ">\r\n" .
             "Reply-To: " . $senderEmail . "\r\n" .
             "X-Mailer: PHP/" . phpversion();
  $msgBody = "Name: " . $userName . "\n" .
             "Email: " . $senderEmail . "\n" .
             "Phone: " . $senderPhone . "\n" .
             ($company ? "Company: " . $company . "\n" : "") .
             ($designation ? "Designation / Role: " . $designation . "\n" : "") .
             ($turnover ? "Turnover: " . $turnover . "\n" : "") .
             "Subject: " . $userSubject . "\n\n" .
             ($message ? "Message:\n" . $message . "\n" : "");
  $success = mail( $recipient, "Website Consultation: " . $userSubject, $msgBody, $headers );

  //Set Location After Successful Submission
  header('Location: contact.html?message=Successful');
}

else{
	//Set Location After Unsuccesssfull Submission
  	header('Location: contact.html?message=Failed');	
}

?>