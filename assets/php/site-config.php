<?php
class debugPHP{
	public $SQL = false;
	public $display = true;
}
class sqlParms{
	public $dbType = 'mysql';
	public $dbHost = '127.0.0.1';
	public $dbName = 'keeperit_sgr02';
	public $userName = 'keeperit_bootbiz';
	public $password = 'B00tb1z';
}
class logParms{
	public $appName = 'unknown';
	public $appLog = '/var/www/nutra/dialer/files/applog.txt';
	public $errorLog = '/var/www/nutra/dialer/files/dialererrorlog.txt';
	public $dbLogging = false;
}
date_default_timezone_set('America/Denver');

?>