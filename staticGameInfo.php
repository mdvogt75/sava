<?php
    // This is a quick script to gather game details for specified gameId
    // usage = http://www.gcpdesigns.com/sava/gameInfo.php?gameID=1234
    // Add error handling
    //     If more than one game has specified gameID
    //     Validate details don't conflict with rules (i.e. score > gamtTo and > capAt)

    // Create connection
    $conn = new mysqli("db393178709.db.1and1.com", "dbo393178709", "terces1", "db393178709");
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 
	
    // Create SQL query to retrieve current commands queued by remote device(s) 
    $selectQuery = "SELECT * FROM game WHERE gameID = " . $_GET["gameID"];
    
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
            $eventId     = $row["eventId"];
            $team1Id     = $row["team1"];
            $team2Id     = $row["team2"];
            $refTeam     = $row["ref"];
            $gameTo      = $row["gameTo"];
          //$numPlayers  = $row["numPlayers"];
            $numPlayers  = 2;
          //$lengthOfTOs = $row["lengthOfTimeOuts"];
            $lengthOfTOs = 60;
          //$winBy       = $row["winBy"];
            $winBy       = 2;
            $capAt       = $row["capAt"];
          //$switchEvery = $row["switchEvery"];
            $switchEvery = 7;
          //$best        = $row["best"];
            $best          = 2;
          //$outOf       = $row["outOf"];
            $outOf         = 3;
          //$TOsPerGame    = $row["TOsPerGame"];
            $TOsPerGame    = 2;
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
        '    "team1TOsAvail" : 2,' .
        '    "team2TOsAvail" : 2,' .
        
        '    "t1p1" : "' . $team1Name . '",' .
        '    "t1p2" : "",' .
        '    "t2p1" : "' . $team2Name . '",' .
        '    "t2p2" : "",' .
        
        '    "rules" : {' .
        '        "gameTo" : ' . $gameTo . ',' .
        '        "winBy" : ' . $winBy . ',' .
        '        "capAt" : ' . $capAt . ',' .
        '        "switchEvery" : ' . $switchEvery . ',' .
        '        "best" : ' . $best . ',' .
        '        "outOf" : ' . $outOf . ',' .
        '        "numPlayers" : ' . $numPlayers . ',' .
        '        "lengthOfTOs" : ' . $lengthOfTOs . '' .
        '    }}' .
        '}';
    }

?>