var gameID;
var gameSummary;

var gamesTo;
var winBy;
var capAt;
var switchEvery;
var best;
var outOf;
var displayOnly;
var applyTouches;
var updateDB;
var checkEvery = 1000;  // milliseconds
var t1p1; 
var t1p2;
var t2p1;
var t2p2;

var gameObj;
/**/ 
var gameRecapString = "";
var timeLeft;
var timeoutCompleteAt;
var timeOutInterval;
var lengthOfTimeouts;
var teamNumRequestingTO;
var team1TOsRemain;
var team2TOsRemain;
var team1TOsAvail;
var team2TOsAvail;
/**/

/********************************************************************************
* Function to assign side attribute of team divs appropriately 
********************************************************************************/
function switchSides() {
	if(document.getElementById("team1").getAttribute("side") == "left") {
		document.geatElementById("team1").setAttribute("side","right");
		document.getElementById("team2").setAttribute("side","left");
	} else {
		document.getElementById("team1").setAttribute("side","left");
		document.getElementById("team2").setAttribute("side","right");
	}
	// Display related message
	document.getElementById("switchMsgDiv").style.display="block";
	// Play sound
	document.getElementById("ding").play();
}


/********************************************************************************
* Function to handle touch according to settings
********************************************************************************/
function touch(teamNum) {
	//console.log("touch " + teamNum);
    if(applyTouches) {
		point(teamNum);	
	}
	
	/*
	if(publishRemoteCommands == "true") {
		console.log("publishing point team" + teamNum);
		loadFile("http://gcpdesigns.com/sava/pushDBcmd.php?cmd=" + teamNum,"VAR");
	}
	*/
}

/********************************************************************************
* Function to handle touch according to settings
********************************************************************************/
function touchTO(teamNum) {
	console.log("touch " + teamNum);
    if(applyTouches) {
	    timeOut(teamNum);	
	}

	/*
	if(publishRemoteCommands == "true") {
		console.log("publishing timeout team" + teamNum);
		if(teamNum==1) {
			loadFile("http://gcpdesigns.com/sava/pushDBcmd.php?cmd=T","VAR");
		} else {
			loadFile("http://gcpdesigns.com/sava/pushDBcmd.php?cmd=O","VAR");
		}
	}
	*/
}
		

/********************************************************************************
* Function to clear side switch dialog 
********************************************************************************/
function confirmSwitch() {
	console.log("confirm switch");

    document.getElementById("switchMsgDiv").style.display = "none";	
	
	/*
	if(publishRemoteCommands == "true") {
		loadFile("http://gcpdesigns.com/sava/pushDBcmd.php?cmd=S","VAR");
	}
	*/
	// Update the database
	//if(updateDB) {
	//	loadFile("updateGame.php?gameID=" + gameID + "&team=" + teamNum + "&change=setScore&value=" + newScore, "VAR", myHandler);    
	//}
}


/********************************************************************************
* Function that   
********************************************************************************/
/*
function myHandler() {
	if (xmlHttp.readyState == 4 || xmlHttp.readyState == "complete") {
		var results = xmlHttp.responseText;
	}
}
*/		

/********************************************************************************
* Function to increment the score of the appropriate team 
********************************************************************************/
function point(teamNum) {
	// Add a point
	var newScore = parseInt(document.getElementById("team" + teamNum + "Score").innerHTML) + 1;

    //gameRecapString += teamNum;
	//console.log(gameRecapString);
	
	// Update the UI
	document.getElementById("team" + teamNum + "Score").innerHTML = newScore;
    
	// Use variables to enhance readability of the code below
	var team1Score   = parseInt(document.getElementById("team1Score").innerHTML);
	var team2Score   = parseInt(document.getElementById("team2Score").innerHTML);
	
	// If team one scored 
	/*
	if(teamNum == 1) {
		console.log("point " + teamNum);
		// set the service flag and indicator
		document.body.setAttribute("teamServing","team1");
		
		// If team one reaches the cap OR reaches winning score and is ahead by specified points
		if((team1Score == capAt) || (team1Score >= gamesTo && team1Score - team2Score >= winBy)) {
			// Team one wins (increment match score and reset game score)
			game(1);
		} else {
			// Otherwise check for and apply side switching
			if(((team1Score + team2Score) % switchEvery) == 0) {
				switchSides();
			}
		}
		
	// Otherwise team two scored
	} else {
		console.log("point " + teamNum);
		// set the service flag and indicator
		document.body.setAttribute("teamServing","team2");
		
		// If team two reaches the cap OR reaches winning score and is ahead by specified points
		if((team2Score == capAt) || (team2Score >= gamesTo && team2Score - team1Score >= winBy)) {
			// Team two wins (increment match score and reset game score)
			game(2);
		} else {
			// Otherwise check for and apply side switching
			if(((team2Score + team1Score) % switchEvery) == 0) {  
				switchSides();
			}
		}
	}
	*/

	console.log("point " + teamNum);
	// set the service flag and indicator
	document.body.setAttribute("teamServing","team" + teamNum);
	
	// If team reaches the cap OR reaches winning score and is ahead by specified points
	if((newScore >= capAt) || (newScore >= gamesTo && abs(team2Score - team1Score) >= winBy)) {
		// Team two wins (increment match score and reset game score)
		game(teamNum);
	} else {
		// Otherwise check for and apply side switching
		if(((team2Score + team1Score) % switchEvery) == 0) {  
			switchSides();
		}
	}

	// Update the database
	//if(updateDB) {
	//	loadFile("updateGame.php?gameID=" + gameID + "&team=" + teamNum + "&change=setScore&value=" + newScore, "VAR", myHandler);    
	//}
}

/********************************************************************************
* Function to increase the match score of the appropriate team 
********************************************************************************/
function game(teamNum) {
	
	//alert(gameRecapString);
	
	// Add a game
	document.getElementById("team" + teamNum + "Games").innerHTML = parseInt(document.getElementById("team" + teamNum + "Games").innerHTML) + 1;
	
	// Submit/commit final game score to database 
	// Submit(gameRecapString);
	//gameRecapString = "";
	
	// Reset score and determine side and serve
	document.getElementById("team1Score").innerHTML = "0";
	document.getElementById("team2Score").innerHTML = "0";
	
	// Rest timeout flags
	document.getElementById("team1TO1").setAttribute("taken", "false");
	document.getElementById("team1TO2").setAttribute("taken", "false");
	document.getElementById("team2TO1").setAttribute("taken", "false");
	document.getElementById("team2TO2").setAttribute("taken", "false");
	
	// FIX - set values appropriately/logically
	document.body.setAttribute("leftSide","team1");
	document.body.setAttribute("teamServing","team1");

	// Update the database
	//if(updateDB) {
	//	loadFile("updateGame.php?gameID=" + gameID + "&team=" + teamNum + "&change=setScore&value=" + newScore, "VAR", myHandler);    
	//}
}

/********************************************************************************
* Function to update timeout 
********************************************************************************/
function refreshTOdialog() {
	var currentTime = new Date().getTime() / 1000; 
	timeLeft = timeoutCompleteAt - currentTime;
	//timeLeft--;
	document.getElementById("TOCountDownDiv").innerHTML = "0:" + (timeLeft <= 9 ? "0" + timeLeft : timeLeft);
	
	// When allotted time is over, clear the interval, hide the dialog and disable a timeout icon/marker
	if(timeLeft <= 0) {
		window.clearInterval(timeOutInterval);
		document.getElementById("TOCountDownDiv").className = "hidden";
		
		if(document.getElementById("team" + teamNumRequestingTO + "TO1").getAttribute("taken") == "true") {
			document.getElementById("team" + teamNumRequestingTO + "TO2").setAttribute("taken", "true");
		} else {
			document.getElementById("team" + teamNumRequestingTO + "TO1").setAttribute("taken", "true");
		}
	}
}		

/********************************************************************************
* Function to start timeout timer and mark timeout as taken 
********************************************************************************/
function timeOut(teamNum) {
	// If two time-outs have already been taken
	if(document.getElementById("team" + teamNum + "TO2").getAttribute("taken") == "true") {
		// ERROR
		alert("Throw time-outs taken error");				
	// Otherwise set timer, create interval to decrement the timer
	} else {
		var currentTime = new Date().getTime() / 1000;

		timeoutCompleteAt = currentTime + lengthOfTimeouts;
		//timeLeft = 60;
		document.getElementById("TOCountDownDiv").className = "visible";
		teamNumRequestingTO = teamNum;
		timeOutInterval = window.setInterval(refreshTOdialog, 1000);
	}
}


/********************************************************************************
* Function to 
********************************************************************************/
function choose() {
	//var choices = document.querySelector(".radioset").firstChild.childNodes;
	document.querySelector("#standalone").setAttribute("selected","no");
	document.querySelector("#controller").setAttribute("selected","no");
	document.querySelector("#display").setAttribute("selected","no");

	/*
	var choices = event.srcElement.sib
	for(var i in choices) {
		choices[i].firstChild.setAttribute("selected","no");
	}
	*/
	event.srcElement.setAttribute("selected","yes");
	
}


/********************************************************************************
* Function that uses JSON to retrieve detailed info about specified game  
********************************************************************************/
function createJSONobjects() {
	if (xmlHttp.readyState == 4 || xmlHttp.readyState == "complete") {
		var jsonText = xmlHttp.responseText;
		//console.log("found " + jsonText);
		gameObj = JSON.parse(jsonText);

		// Use the new JavaScript object in your page to populate static game details
		gamesTo       = gameObj.match.rules.gameTo;
		winBy         = gameObj.match.rules.winBy;
		capAt         = gameObj.match.rules.capAt;
		switchEvery   = gameObj.match.rules.switchEvery;
		best          = gameObj.match.rules.best;
		outOf         = gameObj.match.rules.outOf;    
		t1p1          = gameObj.match.t1p1;
		t1p2          = gameObj.match.t1p2;
		t2p1          = gameObj.match.t2p1;
		t2p2          = gameObj.match.t2p2;
		gameType      = gameObj.match.gameType;
		team1TOsAvail = gameObj.match.team1TOsAvail;
		team2TOsAvail = gameObj.match.team2TOsAvail;

        // Populate appropriate UI elements with gathered details 
		document.body.className = gameType;
		document.getElementById("gamesTo").value = gamesTo;
		document.getElementById("winBy").value = winBy;
		document.getElementById("capAt").value = capAt;
		document.getElementById("switchEvery").value = switchEvery;
		document.getElementById("best").value = best;
		document.getElementById("outOf").value = outOf;

		document.getElementById("t1p1").value = t1p1;
		document.getElementById("t1p2").value = t1p2;
		document.getElementById("t2p1").value = t2p1;
		document.getElementById("t2p2").value = t2p2;
		
	
		// If game is in process 
		if(gamesWonByTeam1 != 0 || gamesWonByTeam2 != 0 || currentScoreTeam1 != 0 || currentScoreTeam2 != 0) {

			// load details and proceed
			document.querySelector("#team1Name1").innerHTML = t1p1;
			document.querySelector("#team1Name2").innerHTML = t1p2;	
			document.querySelector("#team2Name1").innerHTML = t2p1;
			document.querySelector("#team2Name2").innerHTML = t2p2;

	//document.querySelector("#team1").setAttribute("side", team1Side);

	//document.querySelector("#team1Serve").innerHTML = ?;

	//document.querySelector(body).setAttribute("teamServing", "");
	//document.querySelector(body).setAttribute("playerServing", "");

			gamesWonByTeam1   = gameObj.match.team1GamesWon;
			gamesWonByTeam2   = gameObj.match.team2GamesWon;
			team1TOsRemain    = gameObj.match.team1TOsRemain;
			team2TOsRemain    = gameObj.match.team2TOsRemain;
			currentScoreTeam1 = gameObj.match.team1Score;
			currentScoreTeam2 = gameObj.match.team2Score;
		
			document.querySelector("#team1Games").innerHTML =  gamesWonByTeam1;
			document.querySelector("#team1Score").innerHTML =  currentScoreTeam1;
			document.querySelector("#team1TO1").setAttribute("taken", team1TOsAvail - team1TOsRemain);
			document.querySelector("#team1TO2").setAttribute("taken", team2TOsAvail - team2TOsRemain);
			document.querySelector("#team2Games").innerHTML =  gamesWonByTeam2;
			document.querySelector("#team2Score").innerHTML =  currentScoreTeam2;


		}
    }
}


/********************************************************************************
* Function that uses JSON to retrieve detailed info about specified game  
********************************************************************************/
function retrieveSettings(gameID) {
	console.log("retrieving status for gameID " + gameID);
	
	// Use the JavaScript built-in function JSON.parse() to convert the string into a JavaScript object
    loadFile("gameInfo.php?gameID=" + gameID, "VAR", createJSONobjects);
    //loadFile("gameInfo.txt", "VAR", createJSONobjects);
	
}


/********************************************************************************
* Function to  
********************************************************************************/
function saveSettings() {
	/*
	gamesTo = window.prompt("Games to(Winner is the first team to this many points)", gamesTo);
	document.getElementById("gamesTo").value = gamesTo;
	winBy = window.prompt("Win by(Must be ahead by this many points to win)", winBy);
	document.getElementById("winBy").value = winBy;
	
	capAt = window.prompt("Cap at(Win by is no longer in effect once a team scores this many points)", capAt);
	document.getElementById("capAt").value = capAt;
	switchEvery = window.prompt("Switch every(Every time this many points are scored teams must switch sides)", switchEvery);
	document.getElementById("switchEvery").value = switchEvery;
	
	best  = window.prompt("Best(Winner is first team to this many games)", best);
	document.getElementById("best").value = best;
	outOf = window.prompt("Out of(Maximum number of games to play)", (best * 2) - 1);
	document.getElementById("outOf").value = outOf;

	t1p1 = window.prompt("Name of first player", t1p1);
	document.getElementById("team1Name1").value = t1p1;
	t1p2 = window.prompt("Name of second player", t1p2);
	document.getElementById("team1Name2").value = t1p2;
	
	t2p1 = window.prompt("Name of first player", t2p1);
	document.getElementById("team2Name1").value = t2p1;
	t2p2 = window.prompt("Name of second player", t2p2);
	document.getElementById("team2Name2").value = t2p2;
	*/
	
	// Assign input values to variables
	gamesTo      = parseInt(document.getElementById("gamesTo").value);
	winBy        = parseInt(document.getElementById("winBy").value);
	capAt        = parseInt(document.getElementById("capAt").value);
	switchEvery  = parseInt(document.getElementById("switchEvery").value);
	best         = parseInt(document.getElementById("best").value);
	outOf        = parseInt(document.getElementById("outOf").value);
	
	/*
	if(document.getElementById("publish").checked) {publishRemoteCommands = "true";} else {publishRemoteCommands = "false";}  
	if(document.getElementById("subscribe").checked) {subscribeToRemoteCommands = "true";} else {subscribeToRemoteCommands = "false";}  
	*/
	/*
	publishRemoteCommands = document.querySelector("#controller").getAttribute("selected") == "yes";
	subscribeToRemoteCommands = document.querySelector("#display").getAttribute("selected") == "yes";
    */

	t1p1 = document.getElementById("t1p1").value;
	t1p2 = document.getElementById("t1p2").value;
	t2p1 = document.getElementById("t2p1").value;
	t2p2 = document.getElementById("t2p2").value;

	// Hide the settings inputs
	document.getElementById("detailsDiv").className = "hidden";
	document.getElementById("detailsDiv").style.display = "none";
	
	// Apply settings
	document.getElementById("team1Name1").innerHTML = t1p1;
	document.getElementById("team1Name2").innerHTML = t1p2;
	document.getElementById("team2Name1").innerHTML = t2p1;
	document.getElementById("team2Name2").innerHTML = t2p2;
	
	// Send game settings to score display device
	/*
	if(publishRemoteCommands == "true") {
		loadFile("http://gcpdesigns.com/sava/saveSettings.php?gamesTo=" + gamesTo +
															"&winBy=" + winBy +
															"&capAt=" + capAt + 
															"&switchEvery=" + switchEvery + 
															"&best=" + best + 
															"&outOf=" + outOf + 
															"&publish=" + publishRemoteCommands + 
															"&subscribe=" + subscribeToRemoteCommands + 
															"&t1p1=" + t1p1 + 
															"&t2p1=" + t2p1 + 
															"&t1p2=" + t1p2 + 
															"&t2p2=" + t2p2,"VAR");
	}
	*/
	
	if(subscribeToRemoteCommands == "true") {
		//window.setInterval(checkRemoteCommandQueue, checkEvery);
		window.setInterval(gatherDynamicGameInfo(gameID), checkEvery);
	}
}

/********************************************************************************
* Function to   
********************************************************************************/
function processCommand() {
	if (xmlHttp.readyState == 4 || xmlHttp.readyState == "complete") {
		var remoteCommand = xmlHttp.responseText;
		console.log("found " + remoteCommand);
		
		if(remoteCommand == "1") {
			point(1); 
		} else if(remoteCommand == "2") {
			point(2);					
		} else if(remoteCommand == "T") {
			timeOut(1);					
		} else if(remoteCommand == "O") {
			timeOut(2);					
		} else if(remoteCommand == "S") {
			confirmSwitch();
		}
	}
}

	
/********************************************************************************
* Function to check file for queue of commands from scoring remote device(s)  
********************************************************************************/
function gatherDynamicGameInfo(gameID) {
	console.log("checking for changes");
	loadFile("dynamicgameInfo.php?gameId=" + gameID,"VAR", processCommand);
}
	
/********************************************************************************
* Upon load, gather scoring rules and perform other initialization
********************************************************************************/
document.addEventListener("DOMContentLoaded", function(event) { 
  	// Check to see if we're scoring a defined game (the game has an ID)
	gameID = getParameterByName('gameID', document.location);

	// If the gameID was passed in, gather game deatils from database (such as gameType, scoreing rules, latest scores, timeouts taken, team names, etc) 
	if(gameID) {
		alert('game specified - ' + gameID);
		// Attempt to gather game settings/rules
		//gameSummary = retrieveSettings(gameID);
		gatherStaticGameInfo(gameID);

		

		// Attempt to gather game status
		//retrieveStatusFromSummary(gameID); 	

	// Otherwise
	} else {
		document.body.className = "waupacaSand";
	}
	

  	
	
	// show settings 
	//document.getElementById("detailsDiv").className = "visible";
	
	//gameRecapString = getQueryString('gameRecapString');
	//alert(gameRecapString);

});


/********************************************************************************
* 
********************************************************************************/
document.addEventListener("touchstart", function(event) {
	downX = event.touches[0].clientX; 
	downY = event.touches[0].clientY; 
});


/********************************************************************************
* 
********************************************************************************/
document.addEventListener("touchmove", function(event) {
	// Ignore movement if current touch has already caused a point
	if(downY !== null) {
		//diffX = downX - event.touches[0].clientX;
		diffY = downY - event.touches[0].clientY;

		// If movement is greather than 20px upward
		if(diffY >= 20) {
			// Once swipe is detected clear variable to avoid detecting multiple swipes
			downY = null;

			// If swipe was on left half of the screen
			if(downX < (1920 / 2) {
				point(1);
			// Otherwise swipe was on right half of the screen
			} else {
				point(2);
			}
		// Otherwise check if movement is greather than 20px downward
		} else if(diffY <= -20) {
			downY = null;  

		}
	}
});


/********************************************************************************
* Function to get parameters from the query string 
********************************************************************************/
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}