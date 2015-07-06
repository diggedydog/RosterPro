//Create function buttonClicked(idOfButton), adds dropdown Menu
//Find out how to switch pages
//Pages left to make: select roster page
//Select terms for roster
//Add counters for terms +increments
//Window.location
var myApp = {};
myApp.players = [];
myApp.rosters = [];
myApp.playerNumber = 0;
myApp.currentRoster = "";
myApp.fromEdit = false;
var updatePlayers = function(players) {
    $("#rosterList").html(players);
}
var showPage = function(pageId) {
    var pageIds = [];
    $(".page").each(function() {
        if (pageId != this.id) {
            pageIds.push(this.id);
        }
    })
    for (var i = 0; i < pageIds.length; i++) {
        $("#" + pageIds[i]).hide();
        
    }
    $("#" + pageId).show();
    
    
}
var updateRosterEdit = function(rosters) {
    $("#finishedRosters").html("");
    var htmlRosters = [];
    keys = Object.keys(rosters);
    
    for(var i = 0; i < keys.length; i++) {
        if (keys[i] != null) {
            
            htmlRosters.push("<li><button class=\"rosterButton\" id=\"" +
                             keys[i] + "\">" + keys[i] + "</button></li>");
            
            $("#finishedRosters").on("click", ".rosterButton", function() {
                showPage("rosterCreation");
                myApp.players = getRosters()[this.id];
                updatePlayers(myApp.players);
                myApp.currentRoster = this.id;
                myApp.fromEdit = true;
            })
        } else {
//            deleteRoster("null");
        }
        
    }
    $("#finishedRosters").html(htmlRosters);
}

    
var clearRosters = function() {
    localStorage.setItem("rosters", JSON.stringify({}));
}

var deleteRoster = function(rosterToDelete) {
    var tempObj = getRosters();
    delete tempObj[rosterToDelete];
    setRosters(tempObj);
    updateRosterEdit(getRosters());
}

var getRosters = function() {

    if (localStorage.getItem("rosters") === "undefined") {
        return undefined
    }
    return JSON.parse(localStorage.getItem("rosters"));
}

var addRoster = function(nameOfRoster, rosterToAdd) {
    if (getRosters() === undefined) {
        localStorage.setItem("rosters", JSON.stringify({nameOfRoster:rosterToAdd}));
    }
    var tempObj = getRosters();
    if (tempObj[nameOfRoster] === undefined) {
        tempObj[nameOfRoster] = rosterToAdd;
        localStorage.setItem("rosters", JSON.stringify(tempObj));
        return true;
    }
    return false;
    
}

var replaceRoster = function(nameOfRoster, rosterToAdd) {
    var tempObj = getRosters();
    tempObj[nameOfRoster] = rosterToAdd;
    localStorage.setItem("rosters", JSON.stringify(tempObj));
}

var setRosters = function(rosterObj) {
    localStorage.setItem("rosters", JSON.stringify(rosterObj));
}

var makeNameHtml = function(playerName, playerNumber) {
    return "<li id=\"player" + playerName + "\"text>" + playerName + " <button id=\"player" + playerName +
        "\">edit</button></li>";
}
var displayRoster = function(nameOfRoster) {
    updatePlayers(getRosters()[nameOfRoster]);
}

var makeNameTextBox = function(playerName) {
    return "<li><input class=\"playerNameEdit\" value=\"" + playerName.substring(6)
        + "\"/> <button id =\"change" + playerName + "\" autofocus=\"true\">Change</button>" +
        "<button id=\"del" + playerName + "\" autofocus=\"true\">Delete</button>";
}

var parsePlayers = function(players) {
    var result = []
    for (var i = 0; i < players.length; i++) {
        if (players[i].substring(4, 5) != "<") {
            result.push(players[i].substring(8, players[i].indexOf("\"text")));
        } else {
            result.push(players[i]);
        }
    }
    return result;
}

$(document).ready(function() {
    showPage("home");
    if (getRosters() === null || getRosters() === undefined) {
        myApp.rosters = {};
        setRosters({});
    }
    myApp.rosters=getRosters();
    $("#playerName").val("");
    
    
    $(".addPlayerbtn").click(function(){
        var repeat = false;
        for (var i = 0; i < myApp.players.length; i++) {
            console.log(parsePlayers(myApp.players)[i]);
            console.log($("#playerName").val());
            if (parsePlayers(myApp.players)[i] === "player" + $("#playerName").val()) {
                repeat = true;
                alert("You already have a player of that name");
            }
        }
        if (!repeat) {
            console.log("cool");
        
            if (myApp.fromEdit) {
                playerNumber = getRosters()[myApp.currentRoster].length;
                
            } else {
                playerNumber = myApp.players.length;
            }
            
            if ($("#playerName").val() != "") {
                myApp.players.push(makeNameHtml($("#playerName").val()));
                $("#rosterList").on("click", "#player" + $("#playerName").val(), editButtonClicked = function() {
                console.log(this);
                console.log("function called");
                var playerNames = parsePlayers(myApp.players);
                    
                    var index = playerNames.indexOf(this.id);
                    playerNames[index] =
                                makeNameTextBox(this.id, myApp.playerNumber);
                    $("#rosterList").on("click", "#del" + this.id, function() {
                        console.log(index);
                        myApp.players.splice(index, index + 1);
                        
                        playerNames.splice(index, index + 1);
                        index = -1;
                        updatePlayers(myApp.players);
                        displayRoster(myApp.players);
                    })
                    $("#rosterList").on("click", "#change" + this.id, function() {
                        myApp.players[index] = makeNameHtml($(".playerNameEdit").val());
                        $("#rosterList").on("click", "#player" + $(".playerNameEdit").val(), editButtonClicked());
                        updatePlayers(myApp.players);
                        displayRoster(myApp.players);
                    })
                    console.log(parsePlayers(myApp.players), index);
                    myApp.players[index] = playerNames[index];
                    updatePlayers(myApp.players);
                    displayRoster(myApp.players);
            });
                myApp.playerNumber++;
            }
            
            
            updatePlayers(myApp.players);
        }    
    })
    var clearRoster = function() {
        myApp.players = [];
        updatePlayers(myApp.players);
        $("#playerName").val("");
        myApp.playerNumber = 0;
    }
    $("#clearButton").click(clearRoster);
    $("#editRoster").click(function() {
        updateRosterEdit(myApp.rosters);
        showPage("editRosterSelect")
        
    });
    $("#newRoster").click(function() {
        showPage("rosterCreation")
    });

    $(".back").click(function() {
        clearRoster();
        if (myApp.fromEdit) {
            showPage("editRosterSelect");
            myApp.fromEdit = false;
        } else {
            showPage("home");
        }
    })
    $("#finishRoster").click(function() {
        if (myApp.players.length > 0 && !myApp.fromEdit) {
            var name = prompt("What do you wish to name this roster?");
            var goodName = false;
            while(!goodName) {
                if (addRoster(name, myApp.players)){
                    goodName = true;
                }
                
                if (!goodName) {
                    name = prompt("You have a roster of that name, please select another.");
                    if (name === null) {
                        clearRoster();
                        showPage("home");
                        goodName = true;
                    }
                }
            }
            if (name === null) {
                deleteRoster("null");
            }
            clearRoster();
            showPage("editRosterSelect");
            myApp.rosters = getRosters();
            updateRosterEdit(myApp.rosters);
        } else if (myApp.fromEdit) {
            replaceRoster(myApp.currentRoster, myApp.players);
            displayRoster(myApp.currentRoster);
            myApp.currentRoster = "";
            myApp.rosters = getRosters();
            updateRosterEdit(myApp.rosters);
            
            showPage("editRosterSelect"); 
        } else {
            showPage("home");
        }
        clearRoster();
        myApp.fromEdit = false;
    })
    $("#delRoster").click(function() {
        if (confirm("Do you wish to delete this roster?")) {
            deleteRoster(myApp.currentRoster);
            myApp.currentRoster = "";
            myApp.rosters = getRosters();
            clearRoster();
            updateRosterEdit(getRosters());
            myApp.fromEdit = false;
            showPage("editRosterSelect");
        }
    })
    $("#newRosterFromEdit").click(function() {
        showPage("rosterCreation");
        myApp.fromEdit = false;
        
    })
    
    
})