<?php

  // usage = http://www.gcpdesigns.com/sava/updateGame.php?gameID=1&team=1&change=setScore&value=12
  // change(s)
  //    setScore
  //    setTOsRemaining
  //    ?addPoint
  //    ?removePoint
  //    ?takeTO
  //    ?undoTO

  // Create connection
	$conn = new mysqli("db393178709.db.1and1.com", "dbo393178709", "terces1", "db393178709");
	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	} 
	
  /* MODIFY THIS CODE IF YOU WANT TO VALIDATE STATE BEFORE UPDATING

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
  */

  // Build the SQL query that will update the database with the values specified 
  if ($_GET["change"] == "setScore") {
    $updateQuery = "UPDATE `game` SET `score" . $_GET["team"] . "`='" . $_GET["value"] . "' WHERE gameID = " . $_GET["gameID"];
  } else if ($_GET["change"] == "setTOs") {
    // SCHEMA CHANGE NECESSARY TO ENABLE THIS FUNCTIONALITY
    //$updateQuery = "UPDATE `game` SET `tosAvail" . $_GET["team"] . "`='" . $_GET["value"] . "' WHERE gameID = " . $_GET["gameID"];
  }

  // Execute query
  $resultList = $conn->query($updateQuery);

?>
