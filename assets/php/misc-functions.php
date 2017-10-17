<?php

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


function logEntry($logEntry, $logFile=LOG_FILE) {
	file_put_contents($logFile, $logEntry."\n", FILE_APPEND);
}

?>