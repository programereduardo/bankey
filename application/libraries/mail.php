<?php if (!defined('BASEPATH')) exit('No direct script access allowed');


require_once APPPATH . '/libraries/PHPMailer/src/PHPMailer.php';
class mail extends PHPMailer {
  function __construct()
  {
    parent::__construct();
  }
}
