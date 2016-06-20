<?php

    // usage = http://www.gcpdesigns.com/sava/gameInfo.php?gameID=1234

    // Create connection
    $conn = new mysqli("db393178709.db.1and1.com", "dbo393178709", "terces1", "db393178709");
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 
	
    //echo $_GET["gameID"];

    // Create SQL query to retrieve current commands queued by remote device(s) 
    $selectQuery = "SELECT * FROM game WHERE gameID = " . $_GET["gameID"];
    
    //echo $selectQuery;
    
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
            $eventId = $row["eventId"];
            $team1Id = $row["team1"];
            $team2Id = $row["team2"];
            $refTeam = $row["ref"];
            $score1  = $row["score1"];
            $score2  = $row["score2"];
            $gameTo  = $row["gameTo"];
            $capAt   = $row["capAt"];
        }

        // THESE COULD OBVIOUSLY BE INTEGRATED INTO THE ABOVE QUERY WITH A JOIN
        // Create SQL query to retrieve the name of team1 
        $team1Query = "SELECT * FROM team WHERE eventId = " . $eventId . " AND teamID = " . $team1Id;
        $team1Result = $conn->query($team1Query);
        while($row = $team1Result->fetch_assoc()) {
            $team1Name = $row["teamName"];
        }

        // Create SQL query to retrieve the name of team2
        $team2Query = "SELECT * FROM team WHERE eventId = " . $eventId . " AND teamID = " . $team2Id;
        $team2Result = $conn->query($team2Query);
        while($row = $team2Result->fetch_assoc()) {
            $team2Name = $row["teamName"];
        }
    
    
        echo '{ "match" : {' .
        '    "gameType" : "dukduk",' .
        '    "team1GamesWon" : 0,' .
        '    "team2GamesWon" : 0,' .
        '    "team1TOsAvail" : 2,' .
        '    "team1TOsRemain" : 2,' .
        '    "team2TOsAvail" : 2,' .
        '    "team2TOsRemain" : 2,' .
        '    "team1Score" : ' . $score1 . ',' .
        '    "team2Score" : ' . $score2 . ',' .

        '    "t1p1" : "' . $team1Name . '",' .
        '    "t1p2" : "",' .
        '    "t2p1" : "' . $team2Name . '",' .
        '    "t2p2" : "",' .
        
        '    "rules" : {' .
        '        "gameTo" : 21,' .
        '        "winBy" : 2,' .
        '        "capAt" : 27,' .
        '        "switchEvery" : 7,' .
        '        "best" : 2,' .
        '        "outOf" : 3' .
        '    }}' .
        '}';
    }

?>