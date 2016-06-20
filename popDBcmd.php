<?php

  // usage = http://www.gcpdesigns.com/sava/popDBcmd.php

  // Create connection
	$conn = new mysqli("db393178709.db.1and1.com", "dbo393178709", "terces1", "db393178709");
	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	} 
	
  // Create SQL query to retrieve current commands queued by remote device(s) 
  $selectQuery = "SELECT cmdQueue FROM remoteCmdQueue WHERE gameID = 'currentGame'";
  
  // Execute query
  $resultList = $conn->query($selectQuery);
  
  // If more than one game record is found 
	if ($resultList->num_rows > 1) {
	  // ERROR
	} else if($resultList->num_rows == 0) {
		// Use an INSERT query to create a game record
		//$success = insertQuery($conn, "eventId, gameStat", "g", "'" . $gameId . "',''");
		//$gameStat = "";						
	} else {
		// return resultant row
		while($row = $resultList->fetch_assoc()) {
			$cmdQueue = $row["cmdQueue"];
      $nextCmd = substr($cmdQueue,0,1);
      echo $nextCmd;
      $newCmdQueue = substr($cmdQueue,1);
		}
    
    // Create SQL query to update the cmd queue with new queue value
    $updateQuery = "UPDATE `remoteCmdQueue` SET `cmdQueue`='" . $newCmdQueue . "' WHERE gameID = 'currentGame'";
    
    // Execute query
    $resultList = $conn->query($updateQuery);
  
	}

?>
