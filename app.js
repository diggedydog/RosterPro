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
    return "<li>" + playerName + "  <button id=\"" + playerName
        + "\">edit</button></li>";
}
var displayRoster = function(nameOfRoster) {
    updatePlayers(getRosters()[nameOfRoster]);
}

$(document).ready(function() {
    showPage("home");
    myApp.rosters=getRosters();
    $("#playerName").val("");
    $("#addPlayerbtn").click(function(){
        if (myApp.fromEdit) {
            playerNumer = getRosters()[myApp.currentRoster].length;
        }
        if ($("#playerName").val() != "") {
            myApp.players.push(makeNameHtml($("#playerName").val(), myApp.playerNumber));
            $("#rosterList").on("click","#" + $("#playerName").val(), function(){
                
});
            myApp.playerNumber++;
        }
        
        
        updatePlayers(myApp.players);
        
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
            console.log(myApp.players);
            replaceRoster(myApp.currentRoster, myApp.players);
            displayRoster(myApp.currentRoster);
            myApp.currentRoster = "";
            myApp.rosters = getRosters();
            updateRosterEdit(myApp.rosters);
            
            showPage("editRosterSelect");
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!FIXMEEEEE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//    
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
            showPage("editRosterSelect");
        }
    })
    $("#newRosterFromEdit").click(function() {
        showPage("rosterCreation");
        myApp.fromEdit = false;
        
    })
    
    
})