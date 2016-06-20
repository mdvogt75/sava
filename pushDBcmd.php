<?php

  // usage = http://www.gcpdesigns.com/sava/addDBcmd.php?cmd=X
  // where X is 1,2,T or O 
  // 1 = point for team1
  // 2 = point for team2
  // T = timeout taken by team1
  // O = timeout taken by team2

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
      $commandToAdd = htmlspecialchars($_GET["cmd"]);
      $newCmdQueue = $cmdQueue . $commandToAdd;
		}
  }  
  
  // Create SQL query to update the cmd queue with new queue value
  $updateQuery = "UPDATE `remoteCmdQueue` SET `cmdQueue`='" . $newCmdQueue . "' WHERE gameID = 'currentGame'";
  
  // Execute query
  $resultList = $conn->query($updateQuery);

?>
