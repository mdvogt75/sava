<?php

    // usage = http://www.gcpdesigns.com/sava/gameInfo.php?matchId=1234

    $numGames = 0;

    // Create connection
    $conn = new mysqli("db393178709.db.1and1.com", "dbo393178709", "terces1", "db393178709");
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 
	
    //echo $_GET["gameID"];

    // Create SQL query to retrieve current commands queued by remote device(s) 
    $selectQuery = "SELECT * FROM game WHERE game.matchId = " . $_GET["matchId"];
    
    //echo $selectQuery;
    
    // Execute query
    $resultList = $conn->query($selectQuery);
    
    // If more than one game record is found 
    if ($resultList->num_rows == 0) {
        // Use an INSERT query to create a game record
        //$success = insertQuery($conn, "eventId, gameStat", "g", "'" . $gameId . "',''");
        //$gameStat = "";						
    } else {
        echo '{ "match" : {' .
             '"games" : [';
        // return resultant row
        while($row = $resultList->fetch_assoc()) {
            $score1         = $row["score1"];
            $score2         = $row["score2"];
            $TOsTaken1      = $row["TOsTaken1"];
            $TOsTaken2      = $row["TOsTaken2"];
            $teamServing    = $row["teamServing"];
            $playerServing  = $row["playerServing"];
            $teamOnLeft     = $row["teamOnLeft"];
            $winner         = $row["winner"];

            if($numGames > 0) echo ',';
            $numGames = $numGames + 1;

            echo '{"team1Score" : ' . $score1 . ',' .
                  '"team2Score" : ' . $score2 . ',' .
                  '"team1TOsTaken" : ' . $TOsTaken1 . ',' .
                  '"team2TOsTaken" : ' . $TOsTaken2 . ',' .
                  '"teamServing" : ' . $teamServing . ',' .
                  '"playerServing" : ' . $playerServing . ',' .
                  '"teamOnLeft" : ' . $teamOnLeft . ',' .
                  '"winner" : ' . $winner . '}';
        }
        echo ']' .
             '}}';
    }
?>