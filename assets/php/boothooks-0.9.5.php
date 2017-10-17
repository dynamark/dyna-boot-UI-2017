
<?php
// todo: implement fetchall, give meaningful error message for HY093 number of bound parameters	, 	$prepStmt->closeCursor() if type = 'storedproc'			
	class DBO{
		public $success = false;
		public $errorMsg = '';
		public $resultSet = array();
		public $handle;
		public $debugSQL;
	
		public function __construct($dbType=null, $dbHost=null, $dbName=null, $userName=null, $password=null) {
				if (!isset($dbType)){
					$sqlParms = new sqlParms;
					$dbType = $sqlParms->dbType;
					$dbHost = $sqlParms->dbHost;
					$dbName = $sqlParms->dbName;
					$userName = $sqlParms->userName;
					$password = $sqlParms->password;
				}
//				$dbType . ':host=' . $dbHost . ';dbname=' . $dbName, $userName, $password); 
/*todo*/
//				require_once("assets/php/site-config.php");
				$debugPHP = new debugPHP;
				$this->debugSQL = $debugPHP->SQL;
				$this->handle = new PDO($dbType . ':host=' . $dbHost . ';dbname=' . $dbName, $userName, $password); 
		}

		function dbExec($sqlstmt, $mode = '', $stmtBindParam=array()) {
			$prepStmt = $this->handle->prepare($sqlstmt);
			if (!$prepStmt) { 
				$this->success = false;
				$this->errorMsg = $handle->errorInfo();
				$this->errorCode = $handle->errorCode();
		    	return;
			} 
			if ($this->debugSQL) { //defined(DEBUG_SQL)
				print "<br>Parameters<br>";
				var_dump($stmtBindParam);
				print "<br>SQL statement<br>$sqlstmt<br>";
				$int = $this->interpolateQuery($sqlstmt, $stmtBindParam);
				print "Interpolated statement<br>" . $int . '<br>';
			}
			foreach ($stmtBindParam as $key => $value) {
				//if ($value==='') {print "binding null"; $prepStmt->bindValue(":".$key, $value, PDO::PARAM_NULL); }
			    //else 
			    $prepStmt->bindValue(":".$key, $value);
		    }
			$prepStmt->execute();
			$errArr = $prepStmt->errorInfo();
			$this->PDO = $prepStmt;
			if ($errArr[0] > '0') {
				$this->success = false;
				$this->errorMsg = $errArr; 
				$this->errorCode = $prepStmt->errorCode();
				$msg = "Error code : ".$prepStmt->errorCode() . '<br>Message :<br>"'; 
				foreach($errArr as $item) {
					$msg = $msg . '<br>' . $item;
				}
				$this->displayError = $msg;
			} else {
				$this->success = true;
				$this->rowCount = $prepStmt->rowCount();
				$this->lastInsertId = $this->handle->lastInsertId();
				$resultSet = array();
				if ($mode == 'assoc') { 
					while ($row = $prepStmt->fetch(PDO::FETCH_ASSOC)) {	
						$resultSet[] = $row;
					}
					$this->resultSet = $resultSet;
				} 	
			}
			return;
		}
	
		/** stackoverflow.com/questions/210564/getting-raw-sql-query-string-from-pdo-prepared-statements
		 * Replaces any parameter placeholders in a query with the value of that
		 * parameter. Useful for debugging. Assumes anonymous parameters from 
		 * $params are are in the same order as specified in $query
		 *
		 * @param string $query The sql query with parameter placeholders
		 * @param array $params The array of substitution parameters
		 * @query string The interpolated query
		 */
		function interpolateQuery($query, $params) {
		    $keys = array();
		    # build a regular expression for each parameter
		    foreach ($params as $key => $value) {
		        if (is_string($key)) {
		            $keys[] = '/:'.$key.'/';
		        } else {
		            $keys[] = '/[?]/';
		        }
		    }
		    $query = preg_replace($keys, $params, $query, 1, $count);
		    return $query;
		}
		function errResult($msg, $errorCode, $errorMsg) {
			$appResult = array();
			$appResult['result'] = $msg . "<br>Error code : ". $errorCode . '<br>Message :<br>"'; 
			foreach($errorMsg as $item) {
				$appResult['result'] = $appResult['result'] . '<br>' . $item;
			}
			$appResult['success'] = false;
			return $appResult;
		}
	}

	function timezone_diff($tz_from, $tz_to, $time_str = 'now') {
		/* returns difference in seconds */
	    $dt = new DateTime($time_str, new DateTimeZone($tz_from));
	    $offset_from = $dt->getOffset();
	    $timestamp = $dt->getTimestamp();
	    $offset_to = $dt->setTimezone(new DateTimezone($tz_to))->setTimestamp($timestamp)->getOffset();
	    return $offset_to - $offset_from;
	};
	
	function time_translate($tz_from, $tz_to, $time_str = 'now', $format = 'Y-m-d H:i:s') {
	    $dt = new DateTime($time_str, new DateTimezone($tz_from));
	    $timestamp = $dt->getTimestamp();
	    return $dt->setTimezone(new DateTimezone($tz_to))->setTimestamp($timestamp)->format($format);
	};
	
	function now() {
		return date("Y-m-d H:i:s");
	}
	
	
/*todo*/	function logEntry($logEntry, $logFile=LOG_FILE) {
		file_put_contents($logFile, $logEntry."\n", FILE_APPEND);
	}

	function appLogEntry($logEntry/*, $appName=$logParms->appName, $logFile=$logParms->appLog, $dbLogging=$logParms->dbLogging*/) {
		file_put_contents($logFile, now().' : '.$appName.' : '. $logEntry."\n", FILE_APPEND);
		/*
		if ($dbLogging){
			if isset($logParms->dbObject) {
				$sql="insert nu_app_log (
					event_datetime,
					app_name,
					log_entry
				)
				values (
					now(),
					$appName,
					$logEntry
				);";
				$logParms->dbObject
			}
			
		}
		*/	
	}

	function errLogEntry($logEntry /*, $logFile=$logparms->app:log*/) {
		file_put_contents($logFile, $logEntry."\n", FILE_APPEND);
	}

    function curl($method, $parameters, $url)
    {
        ob_start();
        $curl_request = curl_init();

        curl_setopt($curl_request, CURLOPT_URL, $url);
        curl_setopt($curl_request, CURLOPT_POST, 1);
        curl_setopt($curl_request, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_0);
        curl_setopt($curl_request, CURLOPT_HEADER, 1);
        curl_setopt($curl_request, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($curl_request, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl_request, CURLOPT_FOLLOWLOCATION, 0);
		curl_setopt($curl_request, CURLOPT_FAILONERROR, 1);

        $jsonEncodedData = json_encode($parameters);

        $post = array(
             "method" => $method,
             "input_type" => "JSON",
             "response_type" => "JSON",
             "rest_data" => $jsonEncodedData
        );

        curl_setopt($curl_request, CURLOPT_POSTFIELDS, $post);
        $result = curl_exec($curl_request);
        if ($result===false) {
        	$response = 'CURL error: '.curl_error($curl_request);
        } else {
	        $result = explode("\r\n\r\n", $result, 2);
	        $response = json_decode($result[1]);
	    }
        curl_close($curl_request);
        ob_end_flush();

        return $response;
    }

	
?>