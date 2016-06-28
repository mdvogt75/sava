var matchID;
var gameSummary;

var gamesTo;
var winBy;
var capAt;
var switchEvery;
var best;
var outOf;

var subscribeToRemoteCommands;
//var applyTouches;
var updateDB;

var checkEvery = 1000;  // milliseconds
var t1p1; 
var t1p2;
var t2p1;
var t2p2;

var staticGameObj, dynamicGameObj;

var gameRecapString = "";
var timeLeft;
var timeoutCompleteAt;
var timeOutInterval;
var lengthOfTOs;
var numPlayers;
var teamNumRequestingTO;
var team1TOsRemain, team2TOsRemain;
var team1TOsAvail, team2TOsAvail;
var team1Side;


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


/********************************************************************************
* Function to determine opposite of current side 
********************************************************************************/
function opposite(side) {
	return (side == "left" ? "right" : "left");
}


/********************************************************************************
* Function to display and enable inputs
********************************************************************************/
function updateSettings() {
	document.querySelector("#detailsDiv").className = "visible";
	document.querySelector("#detailsDiv").style.display = "block";
	document.querySelector("[name='done']").focus();
}


/********************************************************************************
* Function to  
********************************************************************************/
function saveSettings() {
	console.log('saving values in case user udpated them');
	// Assign input values to variables
	gamesTo      = parseInt(document.querySelector("#gamesTo").value);
	winBy        = parseInt(document.querySelector("#winBy").value);
	capAt        = parseInt(document.querySelector("#capAt").value);
	switchEvery  = parseInt(document.querySelector("#switchEvery").value);
	best         = parseInt(document.querySelector("#best").value);
	outOf        = parseInt(document.querySelector("#outOf").value);

	numPlayers   = 2;
	lengthOfTOs  = 60;
	
	t1p1 = document.querySelector("#t1p1").value;
	t1p2 = document.querySelector("#t1p2").value;
	t2p1 = document.querySelector("#t2p1").value;
	t2p2 = document.querySelector("#t2p2").value;

	document.querySelector("#team1Name1").innerHTML = t1p1;
	document.querySelector("#team1Name2").innerHTML = t1p2;
	document.querySelector("#team2Name1").innerHTML = t2p1;
	document.querySelector("#team2Name2").innerHTML = t2p2;

	updateDB = document.querySelector("#controller").getAttribute("selected") == "yes";
	subscribeToRemoteCommands = document.querySelector("#display").getAttribute("selected") == "yes";
	//applyTouches = !subscribeToRemoteCommands;

	if(subscribeToRemoteCommands) {
		window.setInterval(updateDynamicGameInfo(matchId), checkEvery);
	}

	// Hide the settings inputs
	document.querySelector("#detailsDiv").className = "hidden";
	document.querySelector("#detailsDiv").style.display = "none";
}
		

/********************************************************************************
* Function that uses JSON to retrieve detailed info about specified game  
********************************************************************************/
function displayStaticGameInfo() {
	if (xmlHttp.readyState == 4 || xmlHttp.readyState == "complete") {
		var jsonText = xmlHttp.responseText;
		
		if(jsonText) {
			//console.log("found " + jsonText);
			staticGameObj = JSON.parse(jsonText);

			// Use the new JavaScript object in your page to populate static game details 
			// First assign to global variables
			console.log(staticGameObj.match);
			gamesTo       = staticGameObj.match.rules.gameTo;      // Sand = 21  Other = 25  3rdGame = 15  FastPlayoffs=?      Defined at event/match/game level because of 3rdGameTo15     Known at time of schedule generation 
			winBy         = staticGameObj.match.rules.winBy;       // 99.9% of the time = 2                                    Defined at match level (can be overridden each game)         Known at time of schedule generation
			capAt         = staticGameObj.match.rules.capAt;       // NoCap = 0  Cap = gamesTo+?2?                             Defined at game level since 3rd game can sometimes be diff   Known at time of schedule generation
			switchEvery   = staticGameObj.match.rules.switchEvery; // Sand = 7  Sometimes = 5,10  3rdGame = 8  Indoor = 0      Defined at game level                                                              
			best          = staticGameObj.match.rules.best;        // FastPlayoffs = 1  Usually 2
			outOf         = staticGameObj.match.rules.outOf;       // FastPlayoffs = 1  Usually 3
			numPlayers    = staticGameObj.match.rules.numPlayers;  //                                                           Defined at Division level or higher
			//lengthOfTOs   = staticGameObj.match.rules.lengthOfTOs; // 60 ???

			t1p1          = staticGameObj.match.t1p1;              // Match + Player
			t1p2          = staticGameObj.match.t1p2;
			t2p1          = staticGameObj.match.t2p1;
			t2p2          = staticGameObj.match.t2p2;

			//gameType      = staticGameObj.match.gameType;
			//team1TOsAvail = staticGameObj.match.team1TOsAvail;
			//team2TOsAvail = staticGameObj.match.team2TOsAvail;

			// Then populate appropriate UI elements with gathered details 
			document.body.className = gameType;
			document.querySelector("#gamesTo").value = gamesTo;
			document.querySelector("#winBy").value = winBy;
			document.querySelector("#capAt").value = capAt;
			document.querySelector("#switchEvery").value = switchEvery;
			document.querySelector("#best").value = best;
			document.querySelector("#outOf").value = outOf;

			document.querySelector("#t1p1").value = t1p1;
			document.querySelector("#t1p2").value = t1p2;
			document.querySelector("#t2p1").value = t2p1;
			document.querySelector("#t2p2").value = t2p2;

			// load details and proceed
			document.querySelector("#team1Name1").innerHTML = t1p1;
			document.querySelector("#team1Name2").innerHTML = t1p2;	
			document.querySelector("#team2Name1").innerHTML = t2p1;
			document.querySelector("#team2Name2").innerHTML = t2p2;
		}
	} else {

	}
}


/********************************************************************************
* Function that uses JSON to retrieve detailed info about specified game  
********************************************************************************/
function displayDynamicGameInfo() {
	if (xmlHttp.readyState == 4 || xmlHttp.readyState == "complete") {
		var jsonText = xmlHttp.responseText;
		//console.log("found " + jsonText);
		dynamicGameObj = JSON.parse(jsonText);

		// Use the new JavaScript object in your page to populate static game details
		// Populate appropriate UI elements with gathered details 
		console.log(dynamicGameObj.match);

		gamesWonByTeam1 = 0;
		gamesWonByTeam2 = 0;
		
		// Loop through array of games 
		for(var i in dynamicGameObj.match.games) {
			if(dynamicGameObj.match.games[i].winner == 1) {
				gamesWonByTeam1++;
			} else if(dynamicGameObj.match.games[i].winner == 2) {
				gamesWonByTeam2++;
			} else {
				currentScoreTeam1    = dynamicGameObj.match.games[i].team1Score;
				currentScoreTeam2    = dynamicGameObj.match.games[i].team2Score;
				team1TOsTaken        = dynamicGameObj.match.games[i].TOsTaken1;
				team2TOstaken        = dynamicGameObj.match.games[i].TOsTaken2;
				currentTeamServing   = dynamicGameObj.match.games[i].teamServing;
				currentPlayerServing = dynamicGameObj.match.games[i].playerServing;
         		team1Side            = (dynamicGameObj.match.games[i].teamOnLeft == 1 ? "left" : "right");
				break;
			}
		}
	
		document.querySelector("#team1Games").innerHTML =  gamesWonByTeam1;
		document.querySelector("#team2Games").innerHTML =  gamesWonByTeam2;

		document.querySelector("#team1Score").innerHTML =  currentScoreTeam1;
		document.querySelector("#team2Score").innerHTML =  currentScoreTeam2;

		document.querySelector("#team1TO1").setAttribute("taken", team1TOsTaken);
		document.querySelector("#team1TO2").setAttribute("taken", team2TOsTaken);
		
		document.querySelector("#team1").setAttribute("side", team1Side);
		document.querySelector("#team2").setAttribute("side", opposite(team1Side));

		document.querySelector("body").setAttribute("teamServing",   currentTeamServing);
		document.querySelector("body").setAttribute("playerServing", currentPlayerServing);
    }
}


/********************************************************************************
* Function to gather rules and team information
********************************************************************************/
function updateStaticGameInfo(matchId) {
	console.log("updating static match info");
	loadFile("staticGameInfo.php?matchId=" + matchId,"VAR", displayStaticGameInfo);
	//loadFile("staticGameInfo.txt","VAR", displayStaticGameInfo);
}


/********************************************************************************
* Function to gather score, timeout, service and side switching status  
********************************************************************************/
function updateDynamicGameInfo(matchId) {
	console.log("updating dynamic game info");
	loadFile("dynamicGameInfo.php?matchId=" + matchId,"VAR", displayDynamicGameInfo);
	//loadFile("dynamicGameInfo.txt","VAR", displayDynamicGameInfo);
}


/********************************************************************************
* Function to 
********************************************************************************/
function choose() {
	//var choices = document.querySelector(".radioset").firstChild.childNodes;
	document.querySelector("#standalone").setAttribute("selected","no");
	document.querySelector("#controller").setAttribute("selected","no");
	document.querySelector("#display").setAttribute("selected","no");
	event.srcElement.setAttribute("selected","yes");
}


/********************************************************************************
* Upon load, gather scoring rules and perform other initialization
********************************************************************************/
document.addEventListener("DOMContentLoaded", function(event) { 
  	// Check to see if we're scoring a defined match (the match has an ID)
	matchId = getParameterByName('matchId', document.location);

	// If the matchId was passed in, gather game deatils from database (such as gameType, scoreing rules, latest scores, timeouts taken, team names, etc) 
	if(matchId) {
		console.log('game specified - ' + matchId);
		// Attempt to gather game settings/rules (one-time )
		//gameSummary = retrieveSettings(matchId);
		updateStaticGameInfo(matchId);

		// Attempt to gather game status
		updateDynamicGameInfo(matchId);

	// Otherwise default values 
	} else {
		document.body.className = "waupacaSand";
		document.querySelector("#gamesTo").value = 21;
		document.querySelector("#winBy").value = 2;
		document.querySelector("#capAt").value = "";
		document.querySelector("#switchEvery").value = 7;
		document.querySelector("#best").value = 1;
		document.querySelector("#outOf").value = 1;

		document.querySelector("#t1p1").value = "TEAM";
		document.querySelector("#t1p2").value = "NAME";
		document.querySelector("#t2p1").value = "TEAM";
		document.querySelector("#t2p2").value = "NAME";

		// load details and proceed
		document.querySelector("#team1Name1").innerHTML = "TEAM";
		document.querySelector("#team1Name2").innerHTML = "NAME";	
		document.querySelector("#team2Name1").innerHTML = "TEAM";
		document.querySelector("#team2Name2").innerHTML = "NAME";
	}

	// Pre-load audio files
	/*
	var saveVolume = document.querySelector("#whistle").volume;
	document.querySelector("#whistle").volume = 0;
	document.querySelector("#whistle").play();	
	document.querySelector("#whistle").volume = saveVolume;
	*/

	// show settings 
	//document.querySelector("#detailsDiv").className = "visible";
	
	//gameRecapString = getQueryString('gameRecapString');
	//alert(gameRecapString);

});


/********************************************************************************
* Function to update timeout 
********************************************************************************/
function refreshTOdialog() {
	var currentTime = new Date().getTime() / 1000; 
	timeLeft = parseInt(timeoutCompleteAt - currentTime);

	document.querySelector("#timeLeft").innerHTML = "0:" + (timeLeft <= 9 ? "0" + timeLeft : timeLeft);
	
	// When allotted time is over, clear the interval, hide the dialog and disable a timeout icon/marker
	if(timeLeft <= 0) {
		window.clearInterval(timeOutInterval);
		document.querySelector("#TOCountDownDiv").className = "hidden";
		document.querySelector("#timeLeft").innerHTML = "0:" + lengthOfTOs;
		
		if(document.querySelector("#team" + teamNumRequestingTO + "TO1").getAttribute("taken") == "true") {
			document.querySelector("#team" + teamNumRequestingTO + "TO2").setAttribute("taken", "true");
		} else {
			document.querySelector("#team" + teamNumRequestingTO + "TO1").setAttribute("taken", "true");
		}
		document.querySelector("#whistle").play();
	}
}		

/********************************************************************************
* Function to start timeout timer and mark timeout as taken 
********************************************************************************/
function timeOut(teamNum) {
	// If two time-outs have already been taken
	if(document.querySelector("#team" + teamNum + "TO2").getAttribute("taken") == "true") {
		// ERROR
		alert("Throw time-outs taken error");				
	// Otherwise set timer, create interval to decrement the timer
	} else {
		document.querySelector("#timeoutTeamName").innerHTML = document.querySelector("#t" + teamNum + "p1").value;
		if(document.querySelector("#t" + teamNum + "p2").value !== "") {
			document.querySelector("#timeoutTeamName").innerHTML = document.querySelector("#timeoutTeamName").innerHTML + " / " + document.querySelector("#t" + teamNum + "p2").value;
		}
		document.querySelector("#TOCountDownDiv").className = "visible";

		teamNumRequestingTO = teamNum;
		
		document.querySelector("#timeLeft").innerHTML = "0:" + lengthOfTOs;
	
		document.querySelector("#startTimeOut").style.display = "block";
	}
}

/********************************************************************************
* Function to start timeout timer and mark timeout as taken 
********************************************************************************/
function startTimer() {
	var currentTime = new Date().getTime() / 1000;

	timeoutCompleteAt = currentTime + lengthOfTOs;
	
	document.querySelector("#startTimeOut").style.display = "none";

	// Set to refresh every 1/10th of a second
	timeOutInterval = window.setInterval(refreshTOdialog, 100);
}

/********************************************************************************
* Function to cancel timeout timer reset any flags and varaibles 
********************************************************************************/
function cancelTO() {
	timeLeft = 0;
	//timeoutCompleteAt = 0;
	window.clearInterval(timeOutInterval);
	document.querySelector("#TOCountDownDiv").className = "hidden";
	//document.querySelector("#timeLeft").innerHTML = "0:" + lengthOfTOs;
}


/********************************************************************************
* Function to handle touch according to settings
********************************************************************************/
function touchTO(teamNum) {
	if(timeLeft > 0) {
	} else {
		console.log("timeout " + teamNum);
		if(!subscribeToRemoteCommands) {
			timeOut(teamNum);	
		}
	}
}


/********************************************************************************
* Function to clear side switch dialog 
********************************************************************************/
function confirmSwitch() {
	console.log("confirm switch");

    document.querySelector("#switchMsgDiv").style.display = "none";	
	
	/*
	if(publishRemoteCommands == "true") {
		loadFile("http://gcpdesigns.com/sava/pushDBcmd.php?cmd=S","VAR");
	}
	*/
}

/********************************************************************************
* Function to assign side attribute of team divs appropriately 
********************************************************************************/
function switchSides() {
	if(document.querySelector("#team1").getAttribute("side") == "left") {
		document.querySelector("#team1").setAttribute("side","right");
		document.querySelector("#team2").setAttribute("side","left");
	} else {
		document.querySelector("#team2").setAttribute("side","left");
		document.querySelector("#team1").setAttribute("side","right");
	}
	// Display related message
	document.querySelector("#switchMsgDiv").style.display = "block";
	// Play sound
	document.querySelector("#whistle").play();
}


/********************************************************************************
* Function to increase the match score of the appropriate team 
********************************************************************************/
function game(teamNum) {
	
	// Add a game
	document.getElementById("team" + teamNum + "Games").innerHTML = parseInt(document.getElementById("team" + teamNum + "Games").innerHTML) + 1;
	
	// Submit/commit final game score to database 
	// Submit(gameRecapString);
	//gameRecapString = "";
	
	// Reset score and determine side and serve
	document.getElementById("team1Score").innerHTML = "0";
	document.getElementById("team2Score").innerHTML = "0";
	
	// Reset timeout flags
	document.getElementById("team1TO1").setAttribute("taken", "false");
	document.getElementById("team1TO2").setAttribute("taken", "false");
	document.getElementById("team2TO1").setAttribute("taken", "false");
	document.getElementById("team2TO2").setAttribute("taken", "false");
	
	// FIX - set values appropriately/logically
	document.body.setAttribute("leftSide","team1");
	document.body.setAttribute("teamServing","1");

	// Update the database
	//if(updateDB) {
	//	loadFile("updateGame.php?gameID=" + gameID + "&team=" + teamNum + "&change=setScore&value=" + newScore, "VAR", myHandler);    
	//}
}


/********************************************************************************
* Function to increment the score of the appropriate team 
********************************************************************************/
function point(teamNum, cmd) {
	var lastServer, nextServer;

    console.log("point " + teamNum);
	
	var oldScore = parseInt(document.querySelector("#team" + teamNum + "Score").innerHTML);
	
	// Determine the new score
	if(cmd == "+") {
		// Add a point
		var newScore = oldScore + 1;
	} else {
		if(oldScore == 0) {return;}

		// Subtract a point
		var newScore = oldScore - 1;
	}
	
    // Update the UI - display the new score
	document.querySelector("#team" + teamNum + "Score").innerHTML = newScore;
    
	// If the team serving has changed
	if(document.body.getAttribute("teamServing") != teamNum) {

		// Set the service flag and indicator
		document.body.setAttribute("teamServing", teamNum);
		
		//lastServer = document.body.getAttribute("playerServing");
		lastServer = parseInt(document.querySelector("#team" + teamNum + "ServerNum").innerHTML);
		
		nextServer = lastServer + 1;
		
		if(nextServer > (numPlayers)) {
			nextServer = 1;
		}
		document.body.setAttribute("playerServing", nextServer);
		document.querySelector("#team" + teamNum + "ServerNum").innerHTML = nextServer; 
	}
	
	
	// Use variables to enhance readability of the code below
	var team1Score = parseInt(document.querySelector("#team1Score").innerHTML);
	var team2Score = parseInt(document.querySelector("#team2Score").innerHTML);
	
	// If team reaches the cap OR reaches winning score and is ahead by specified points
	if((newScore >= capAt) || (newScore >= gamesTo && Math.abs(team2Score - team1Score) >= winBy)) {
		// Team two wins (increment match score and reset game score)
		game(teamNum);
	} else {
		// Only check for switch on regular points, not when correcting the score 
		if(cmd == "+") {
			// Otherwise check for and apply side switching
			if(((team2Score + team1Score) % switchEvery) == 0) {  
				switchSides();
			}
		}
	}

	// Update the database
	//if(updateDB) {
	//	loadFile("updateGame.php?gameID=" + gameID + "&team=" + teamNum + "&change=setScore&value=" + newScore, "VAR", myHandler);    
	//}
}

/********************************************************************************
* 
********************************************************************************/
document.addEventListener("touchstart", function(event) {
	if(!subscribeToRemoteCommands) {
		downX = event.touches[0].clientX; 
		downY = event.touches[0].clientY;
	} 
});


/********************************************************************************
* 
********************************************************************************/
document.addEventListener("touchmove", function(event) {
    var teamOnLeft, teamOnRight;

	if(!subscribeToRemoteCommands) {
		// Ignore movement if current touch has already caused a point
		if(downY !== null) {
			//diffX = downX - event.touches[0].clientX;
			diffY = downY - event.touches[0].clientY;

			// Determine which team is currently on the left
			if(document.querySelector("#team1").getAttribute("side") == "left") {
				teamOnLeft = 1;
				teamOnRight = 2;
			} else {
				teamOnRight = 1;
				teamOnLeft = 2;
			}
			
			// If movement is greather than 80px upward
			if(diffY >= 80) {
				// Once swipe is detected clear variable to avoid detecting multiple swipes
				downY = null;
				
				// If swipe was on left half of the screen
				if(downX < (1920 / 2)) {
					point(teamOnLeft, "+");
				// Otherwise swipe was on right half of the screen
				} else {
					point(teamOnRight, "+");
				}
			// Otherwise check if movement is greather than 80px downward
			} else if(diffY <= -300) {
				downY = null;  

				// If swipe was on left half of the screen
				if(downX < (1920 / 2)) {
					point(teamOnLeft, "-");
				// Otherwise swipe was on right half of the screen
				} else {
					point(teamOnRight, "-");
				}
			}
		}
	}
});

/********************************************************************************
* When focusing on an element display it's help text
********************************************************************************/
document.addEventListener("focus", function(event) {
	document.querySelector("#helpText").innerHTML = event.srcElement.getAttribute("helpText");
}, true);


/********************************************************************************
* Function to display tooltip like text for inputs with a helpText attribute
********************************************************************************/
function showHelp() {
	document.querySelector("#instructionsDiv").style.display = "block";
	document.body.setAttribute("tip",1);
}


