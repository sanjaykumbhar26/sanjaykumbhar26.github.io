<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

if($_POST)
{
//require('constant.php');
    
    $user_name      = filter_var($_POST["name"], FILTER_SANITIZE_STRING);
    $user_email     = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
    $user_phone     = filter_var($_POST["phone"], FILTER_SANITIZE_STRING);
    $content   = filter_var($_POST["content"], FILTER_SANITIZE_STRING);
    
    if(empty($user_name)) {
		$empty[] = "<b>First Name</b>";		
	}
	if(empty($user_email)) {
		$empty[] = "<b>Email</b>";
	}
	if(empty($user_phone)) {
		$empty[] = "<b>Phone Number</b>";
	}	
	if(empty($content)) {
		$empty[] = "<b>Comments</b>";
	}
	
	if(!empty($empty)) {
		$output = json_encode(array('type'=>'error', 'text' => implode(", ",$empty) . ' Required!'));
        die($output);
	}
	
	if(!filter_var($user_email, FILTER_VALIDATE_EMAIL)){ //email validation
	    $output = json_encode(array('type'=>'error', 'text' => '<b>'.$user_email.'</b> is an invalid Email, please correct it.'));
		die($output);
	}
	
	//reCAPTCHA validation
	if (isset($_POST['g-recaptcha-response'])) {
		
		require('component/recaptcha/src/autoload.php');		
		
		$recaptcha = new \ReCaptcha\ReCaptcha('6LfWqLsfAAAAAAi_ekeztK0lCPfknkSYXuvTmGaZ');

		$resp = $recaptcha->verify($_POST['g-recaptcha-response'], $_SERVER['REMOTE_ADDR']);

		  if (!$resp->isSuccess()) {
				$output = json_encode(array('type'=>'error', 'text' => '<b>Captcha</b> Validation Required!'));
				die($output);				
		  }	
	}


	$mailBody = "Name: " . $user_name . "\n";
	$mailBody .= "User Email: " . $user_email . "\n";
	$mailBody .= "Phone: " . $user_phone . "\n";
	$mailBody .= "Content: " . $content . "\n";


	$mail = new PHPMailer(true);

	try {
		//Server settings
		// $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
		$mail->isSMTP();                                            //Send using SMTP
		$mail->Host       = 'mail.smtp2go.com';                     //Set the SMTP server to send through
		$mail->SMTPAuth   = true;                                   //Enable SMTP authentication
		$mail->Username   = 'codeintel';                     //SMTP username
		$mail->Password   = '3MXgbq0SZ7dV';                               //SMTP password
		$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
		$mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

		//Recipients
		$mail->setFrom('noreply@mortgagebigger.co', 'No Reply');
		$mail->addAddress('hguarino@planethomelending.com'); 
		$mail->addAddress('ccartano@planethomelending.com');              
		$mail->addBCC('matthew@codeintel.com');

		//Content
		$mail->isHTML(true);                                  //Set email format to HTML
		$mail->Subject = 'Land at Planet Contact Request';
		$mail->Body    = $mailBody;

		$mail->send();
		$output = json_encode(array('type'=>'message', 'text' => 'Thank you '.$user_name .', We will get back to you shortly.'));
	    die($output);
	} catch (Exception $e) {
		$output = json_encode(array('type'=>'error', 'text' => 'Unable to send email, please contact'.$mail->ErrorInfo));
	    die($output);
	}


}
?>