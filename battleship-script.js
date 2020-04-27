//=====================================================WelcoM==========================================
//=====================================================WelcoM==========================================
//=====================================================WelcoM==========================================
//=====================================================WelcoM==========================================
//=====================================================WelcoM==========================================
//=====================================================WelcoM==========================================
//=====================================================WelcoM==========================================
//=====================================================WelcoM==========================================
var welcome = () => {
    let pl1Username = document.getElementById("player1").value;
    let pl2Username = document.getElementById("player2").value;
    //let regex = /^[_0-9a-zA-z1]{3,15}$/;
    let regex = /^\w{3,15}$/;
    if (regex.exec(pl1Username) && regex.exec(pl2Username)) {
        localStorage["pl1Name"] = pl1Username;
        localStorage["pl2Name"] = pl2Username;
        document.location.href = "battleship-setup.html";
    } else {
        alert("Imena korisnika moraju imati 3-15 karaktera, iz skupa (a-z, A-Z, 0-9 i _)");
    }

}

//======================================================Setupp==========================================
//======================================================Setupp==========================================
//======================================================Setupp==========================================
//======================================================Setupp==========================================
//======================================================Setupp==========================================
//======================================================Setupp==========================================
//======================================================Setupp==========================================
//======================================================Setupp==========================================
//======================================================Setupp==========================================

var letter = ["#", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
var selecting = false;
var firstPosition = null;
var lastPosition = null;
var currPlayer = "Player 1"

var player1Mat = {
    four: [],
    three: [],
    two: [],
    one: []
};

var player2Mat = {
    four: [],
    three: [],
    two: [],
    one: []
};

var loadTableSetup = () => {
    var myTable = document.getElementById("tableSetup");
    myTable.innerText += "<tbody>"
    for (let i = 0; i < 11; i++) {
        myTable.innerText += "<tr>"
        for (let j = 0; j < 11; j++) {
            if (i == 10 || j == 0) {
                myTable.innerText += "<td width=75px height=80px>"

                if (j == 0 && i !== 10) {
                    myTable.innerText += `${i}`;
                }
                if (i == 10) {
                    myTable.innerText += letter[j];
                }

            } else {
                myTable.innerText += `<td onmouseover="setPicture(id)" id="${i}${letter[j]}" onmouseout="unsetPicture(id)" onmousedown="strartSelecting(id)" onmouseup="finishSelecting(id)" width=75px height=80px>`
            }
            myTable.innerText += "</td>"
        }
        myTable.innerText += "</tr>"
    }
    myTable.innerText += "</tbody>"
    myTable.innerHTML = myTable.innerText;
    document.getElementById("playerName").innerText = localStorage["pl1Name"];
}

var restoreTable = () => {

    for (let i = 0; i < 10; i++) {
        for (let j = 1; j < 11; j++) {
            let id = i + letter[j];
            document.getElementById(id).classList.remove("pogodak");
            document.getElementById(id).classList.remove("pogodak2");
        }
    }

}


var setPicture = id => {
    document.getElementById(id).classList.add("pogodak");
    if (selecting) {
        document.getElementById(id).classList.add("pogodak2");
    }
}

var unsetPicture = id => {
    if (!selecting) {
        document.getElementById(id).classList.remove("pogodak");
    }
}

var strartSelecting = id => {
    selecting = true;
    firstPosition = id;
    document.getElementById(id).classList.add("pogodak2");
}

var finishSelecting = id => {
    selecting = false;
    lastPosition = id;
    let size = 0;
    with (Math) {
        if (firstPosition[0] == lastPosition[0]) { //ista vrsta
            let p1 = firstPosition[1];
            let p2 = lastPosition[1];
            size = abs(letter.indexOf(p1) - letter.indexOf(p2)) + 1;
        } else if (firstPosition[1] == lastPosition[1]) {  //ista kolona
            let p1 = firstPosition[0];
            let p2 = lastPosition[0];
            size = abs(p1 - p2) + 1;
        } else {
            youDidThisForWhat();
            return;
        }
        if (size > 0 && size <= 4) {
            //console.log(`ships${size}`);
            let mesta = parseInt(document.getElementById(`ship${size}`).innerText);
            if (mesta > 0) {
                if (checkCollision()) {
                    storeShip();
                    mesta = mesta - 1;
                    document.getElementById(`ship${size}`).innerText = mesta;
                    if (allDone()) {
                        nextPlayer();
                        restoreTable();
                    }
                } else {
                    cancelFinishing();
                }
            } else {
                cancelFinishing();
            }
        } else {
            cancelFinishing();
        }
    }
}

var youDidThisForWhat = () => {
    let currId;
    for (let i = 0; i < 10; i++) {
        for (let j = 1; j < 11; j++) {
            currId = i + letter[j];
            if (currPlayer == "Player 1" && !(typeof player1Mat[currId] !== 'undefined')) {
                if (document.getElementById(currId).classList.contains("pogodak")) {
                    document.getElementById(currId).classList.remove("pogodak")
                }
                if (document.getElementById(currId).classList.contains("pogodak2")) {
                    document.getElementById(currId).classList.remove("pogodak2")
                }
            }
            if (currPlayer == "Player 2" && !(typeof player2Mat[currId] !== 'undefined')) {
                if (document.getElementById(currId).classList.contains("pogodak")) {
                    document.getElementById(currId).classList.remove("pogodak")
                }
                if (document.getElementById(currId).classList.contains("pogodak2")) {
                    document.getElementById(currId).classList.remove("pogodak2")
                }
            }
        }
    }
}

var checkCollision = () => {
    let p1 = '';
    let p2 = '';
    if (firstPosition[0] == lastPosition[0]) {
        p1 = firstPosition[1];
        p2 = lastPosition[1];
        if (parseInt(letter.indexOf(p1)) > parseInt(letter.indexOf(p2))) {
            p2 = firstPosition;
            p1 = lastPosition;
        } else {
            p1 = firstPosition;
            p2 = lastPosition;
        }
    } else {
        p1 = firstPosition[0];
        p2 = lastPosition[0];
        if (parseInt(p1) > parseInt(p2)) {
            p2 = firstPosition;
            p1 = lastPosition;
        } else {
            p1 = firstPosition;
            p2 = lastPosition;
        }
    }
    //let fp = p1;
    //let lp = p2;
    let fp1 = p1[0];
    let fp2 = letter.indexOf(p1[1]);
    let lp1 = p2[0];
    let lp2 = letter.indexOf(p2[1]);
    //let fake1, fake2;
    let a = '';
    let b = '';
    let c = '';
    let d = '';

    if (checkCollision2()) {
        if (parseInt(fp1) > 0) {
            a = (parseInt(fp1) - 1);
            b = (parseInt(fp1) - 1);
        } else {
            a = 0;
            b = 0;
        }

        if (parseInt(lp1) < 9) {
            c = (parseInt(lp1) + 1);
            d = (parseInt(lp1) + 1);
        } else {
            c = 9;
            d = 9;
        }

        if (parseInt(fp2) > 1) {
            a += letter[parseInt(fp2) - 1];
            c += letter[parseInt(fp2) - 1];
        } else {
            a += letter[1];
            c += letter[1];
        }

        if (parseInt(lp2) < 10) {
            b += letter[parseInt(lp2) + 1];
            d += letter[parseInt(lp2) + 1];
        } else {
            b += letter[10];
            d += letter[10];
        }
        console.log("a = " + a);
        console.log("b = " + b);
        console.log("c = " + c);
        console.log("d = " + d);


        firstPosition = a;
        lastPosition = b;

        if (checkCollision2()) {
            lastPosition = c;
            if (checkCollision2()) {
                firstPosition = c;
                lastPosition = d;
                if (checkCollision2()) {
                    firstPosition = b;
                    if (checkCollision2()) {
                        firstPosition = p1;
                        lastPosition = p2;
                        return true;
                    }
                }
            }

        }
    }
    firstPosition = p1;
    lastPosition = p2;
    return false;
}

var checkCollision2 = () => {
    with (Math) {
        if (firstPosition[0] == lastPosition[0]) {
            let p1 = firstPosition[1];
            let p2 = lastPosition[1];
            if (parseInt(letter.indexOf(p1)) > parseInt(letter.indexOf(p2))) {
                let temp = p1;
                p1 = p2;
                p2 = temp;
            }
            size = abs(letter.indexOf(p1) - letter.indexOf(p2)) + 1;
            for (let i = 0; i < size; i++) {
                currId = firstPosition[0] + letter[parseInt(letter.indexOf(p1) + i)];
                if (currPlayer == "Player 1" && (typeof player1Mat[currId] !== 'undefined')) {
                    console.log("Colision on " + currId);
                    return false;
                }
                if (currPlayer == "Player 2" && (typeof player2Mat[currId] !== 'undefined')) {
                    console.log("Colision on " + currId);
                    return false;
                }
            }


        } else {
            let p1 = firstPosition[0];
            let p2 = lastPosition[0];

            if (parseInt(p1) > parseInt(p2)) {
                let temp = p1;
                p1 = p2;
                p2 = temp;
            }

            size = abs(p1 - p2) + 1;
            for (let i = 0; i < size; i++) {
                currId = (parseInt(p1) + parseInt(i)) + firstPosition[1];
                if (currPlayer == "Player 1" && (typeof player1Mat[currId] !== 'undefined')) {
                    console.log("Colision on " + currId);
                    return false;
                }
                if (currPlayer == "Player 2" && (typeof player2Mat[currId] !== 'undefined')) {
                    console.log("Colision on " + currId);
                    return false;
                }

            }
        }
        return true;
    }
}

var storeShip = () => {
    with (Math) {
        if (firstPosition[0] == lastPosition[0]) {
            let p1 = firstPosition[1];
            let p2 = lastPosition[1];
            if (parseInt(letter.indexOf(p1)) > parseInt(letter.indexOf(p2))) {
                let temp = p1;
                p1 = p2;
                p2 = temp;
            }
            size = abs(letter.indexOf(p1) - letter.indexOf(p2)) + 1;
            for (let i = 0; i < size; i++) {
                currId = firstPosition[0] + letter[parseInt(letter.indexOf(p1) + i)];
                if (currPlayer == "Player 1") {
                    player1Mat[currId] = 1;
                    switch (size) {
                        case 1:
                            player1Mat.one.push(currId);
                            break;
                        case 2:
                            player1Mat.two.push(currId);
                            break;
                        case 3:
                            player1Mat.three.push(currId);
                            break;
                        case 4:
                            player1Mat.four.push(currId);
                            break;
                    }
                }
                if (currPlayer == "Player 2") {
                    player2Mat[currId] = 1;
                    switch (size) {
                        case 1:
                            player2Mat.one.push(currId);
                            break;
                        case 2:
                            player2Mat.two.push(currId);
                            break;
                        case 3:
                            player2Mat.three.push(currId);
                            break;
                        case 4:
                            player2Mat.four.push(currId);
                            break;
                    }
                }
            }


        } else {
            let p1 = firstPosition[0];
            let p2 = lastPosition[0];

            if (parseInt(p1) > parseInt(p2)) {
                let temp = p1;
                p1 = p2;
                p2 = temp;
            }

            size = abs(p1 - p2) + 1;
            for (let i = 0; i < size; i++) {
                currId = (parseInt(p1) + parseInt(i)) + firstPosition[1];
                if (currPlayer == "Player 1") {
                    player1Mat[currId] = 1;
                    switch (size) {
                        case 1:
                            player1Mat.one.push(currId);
                            break;
                        case 2:
                            player1Mat.two.push(currId);
                            break;
                        case 3:
                            player1Mat.three.push(currId);
                            break;
                        case 4:
                            player1Mat.four.push(currId);
                            break;
                    }
                }
                if (currPlayer == "Player 2") {
                    player2Mat[currId] = 1;
                    switch (size) {
                        case 1:
                            player2Mat.one.push(currId);
                            break;
                        case 2:
                            player2Mat.two.push(currId);
                            break;
                        case 3:
                            player2Mat.three.push(currId);
                            break;
                        case 4:
                            player2Mat.four.push(currId);
                            break;
                    }
                }

            }
        }
    }
}

var cancelFinishing = () => {
    with (Math) {
        if (firstPosition[0] == lastPosition[0]) { //ista vrsta
            let p1 = firstPosition[1];
            let p2 = lastPosition[1];

            if (parseInt(letter.indexOf(p1)) > parseInt(letter.indexOf(p2))) {
                let temp = p1;
                p1 = p2;
                p2 = temp;
            }

            size = abs(letter.indexOf(p1) - letter.indexOf(p2)) + 1;
            for (let i = 0; i < size; i++) {
                currId = firstPosition[0] + letter[parseInt(letter.indexOf(p1) + i)];
                if (currPlayer == "Player 1" && (typeof player1Mat[currId] === 'undefined')) {
                    document.getElementById(currId).classList.remove("pogodak2");
                    document.getElementById(currId).classList.remove("pogodak");
                }
                if (currPlayer == "Player 2" && (typeof player2Mat[currId] === 'undefined')) {
                    document.getElementById(currId).classList.remove("pogodak2");
                    document.getElementById(currId).classList.remove("pogodak");
                }
            }
        } else {  //ista kolona
            let p1 = firstPosition[0];
            let p2 = lastPosition[0];

            if (parseInt(p1) > parseInt(p2)) {
                let temp = p1;
                p1 = p2;
                p2 = temp;
            }

            size = abs(p1 - p2) + 1;
            for (let i = 0; i < size; i++) {
                currId = (parseInt(p1) + parseInt(i)) + firstPosition[1];
                //console.log(currId);
                if (currPlayer == "Player 1" && (typeof player1Mat[currId] === 'undefined')) {
                    document.getElementById(currId).classList.remove("pogodak2");
                    document.getElementById(currId).classList.remove("pogodak");
                }
                if (currPlayer == "Player 2" && (typeof player2Mat[currId] === 'undefined')) {
                    document.getElementById(currId).classList.remove("pogodak2");
                    document.getElementById(currId).classList.remove("pogodak");
                }

            }
        }
    }
}


var allDone = () => {
    let mesta1 = parseInt(document.getElementById(`ship1`).innerText);
    let mesta2 = parseInt(document.getElementById(`ship2`).innerText);
    let mesta3 = parseInt(document.getElementById(`ship3`).innerText);
    let mesta4 = parseInt(document.getElementById(`ship4`).innerText);
    if (mesta1 == 0 && mesta2 == 0 && mesta3 == 0 && mesta4 == 0) {
        return true;
    }
    return false;
}

nextPlayer = () => {

    if (currPlayer === "Player 1") {
        document.getElementById(`ship1`).innerText = 4;
        document.getElementById(`ship2`).innerText = 3;
        document.getElementById(`ship3`).innerText = 2;
        document.getElementById(`ship4`).innerText = 1;
        document.getElementById("playerName").innerText = localStorage["pl2Name"];
        currPlayer = "Player 2"
    } else {
        localStorage["pl1"] = JSON.stringify(player1Mat);
        localStorage["pl2"] = JSON.stringify(player2Mat);
        //sessionStorage["pl1"] = player1Mat;
        //sessionStorage["pl2"] = player2Mat;
        document.location.href = "battleship-game.html";
    }
}

//====================================================================Game===========================
//====================================================================Game===========================
//====================================================================Game===========================
//====================================================================Game===========================
//====================================================================Game===========================
//====================================================================Game===========================
//====================================================================Game===========================
//====================================================================Game===========================
//====================================================================Game===========================
//====================================================================Game===========================
//====================================================================Game===========================

var playingPlayer = 1;
var play1 = 0;
var play2 = 0;
var matPlayer1 = {

};

var matPlayer2 = {

};


var loadGame = () => {
    document.getElementById("player1NameGame").innerText = localStorage["pl1Name"];
    document.getElementById("player2NameGame").innerText = localStorage["pl2Name"];
    var myTable = document.getElementById("pl1orig");
    //myTable.innerText += "<tbody>"
    for (let i = 0; i < 11; i++) {
        myTable.innerText += "<tr>"
        for (let j = 0; j < 11; j++) {
            if (i == 10 || j == 0) {
                myTable.innerText += "<td width=75px height=80px>"

                if (j == 0 && i !== 10) {
                    myTable.innerText += `${i}`;
                }
                if (i == 10) {
                    myTable.innerText += letter[j];
                }

            } else {
                myTable.innerText += `<td id="${i}${letter[j]}pl1orig" width=75px height=80px>`
            }
            myTable.innerText += "</td>"
        }
        myTable.innerText += "</tr>"
    }
    //myTable.innerText += "</tbody>"
    myTable.innerHTML = myTable.innerText;
    //===============================================
    myTable = document.getElementById("pl2exposed");
    myTable.innerText = "<tbody>"
    for (let i = 0; i < 11; i++) {
        myTable.innerText += "<tr>"
        for (let j = 0; j < 11; j++) {
            if (i == 10 || j == 0) {
                myTable.innerText += "<td width=75px height=80px>"

                if (j == 0 && i !== 10) {
                    myTable.innerText += `${i}`;
                }
                if (i == 10) {
                    myTable.innerText += letter[j];
                }

            } else {
                myTable.innerText += `<td onmouseover="setDarkPicture(id)" id="${i}${letter[j]}2" onmouseout="unsetDarkPicture(id)" onclick="attack(id)" width=75px height=80px>`
            }
            myTable.innerText += "</td>"
        }
        myTable.innerText += "</tr>"
    }
    myTable.innerText += "</tbody>"
    myTable.innerHTML = myTable.innerText;
    //===========================================
    myTable = document.getElementById("pl1exposed");
    myTable.innerText = "<tbody>"
    for (let i = 0; i < 11; i++) {
        myTable.innerText += "<tr>"
        for (let j = 0; j < 11; j++) {
            if (i == 10 || j == 0) {
                myTable.innerText += "<td width=75px height=80px>"

                if (j == 0 && i !== 10) {
                    myTable.innerText += `${i}`;
                }
                if (i == 10) {
                    myTable.innerText += letter[j];
                }

            } else {
                myTable.innerText += `<td onmouseover="setDarkPicture(id)" id="${i}${letter[j]}1" onmouseout="unsetDarkPicture(id)" onclick="attack(id)" width=75px height=80px>`
            }
            myTable.innerText += "</td>"
        }
        myTable.innerText += "</tr>"
    }
    myTable.innerText += "</tbody>"
    myTable.innerHTML = myTable.innerText;

    //================================================
    myTable = document.getElementById("pl2orig");
    myTable.innerText = "<tbody>"
    for (let i = 0; i < 11; i++) {
        myTable.innerText += "<tr>"
        for (let j = 0; j < 11; j++) {
            if (i == 10 || j == 0) {
                myTable.innerText += "<td width=75px height=80px>"

                if (j == 0 && i !== 10) {
                    myTable.innerText += `${i}`;
                }
                if (i == 10) {
                    myTable.innerText += letter[j];
                }

            } else {
                myTable.innerText += `<td id="${i}${letter[j]}pl2orig" width=75px height=80px>`
            }
            myTable.innerText += "</td>"
        }
        myTable.innerText += "</tr>"
    }
    myTable.innerText += "</tbody>"
    myTable.innerHTML = myTable.innerText;

    $("#pl2orig").hide();
    $("#pl1exposed").hide();
    matPlayer1 = JSON.parse(localStorage["pl1"]);
    matPlayer2 = JSON.parse(localStorage["pl2"]);
    loadpl1Orig();
    loadpl2Orig();
}
/*
$(document).ready(function () {
    let regex = /.*battleship-game.html$/;
    let ret = regex.test(document.location.href);
    if (ret) {
        loadGame();
        $("#pl2orig").hide();
        $("#pl1exposed").hide();
        matPlayer1 = JSON.parse(localStorage["pl1"]);
        matPlayer2 = JSON.parse(localStorage["pl2"]);
        loadpl1Orig();
        loadpl2Orig();
    }

});*/


var setDarkPicture = id => {
    document.getElementById(id).classList.add("darkPicture");
}

var unsetDarkPicture = id => {
    document.getElementById(id).classList.remove("darkPicture");
}

//IT WAS AT THIS MOMENT ADRIAN SAID WE CAN HAVE SEPARE .JS FILES
//https://www.youtube.com/watch?v=MxJ28psqNKw
//IT IS TO LATE NOW


var loadpl1Orig = () => {
    for (let i = 0; i < 10; i++) {
        for (let j = 1; j < 11; j++) {
            let currId = i + letter[j];
            if (typeof matPlayer1[currId] !== 'undefined') {
                document.getElementById(currId + "pl1orig").classList.add("pogodak");
                console.log("OK")
            } else {
                console.log("SHAME");
            }
        }
    }
}

var loadpl2Orig = () => {
    for (let i = 0; i < 10; i++) {
        for (let j = 1; j < 11; j++) {
            let currId = i + letter[j];
            if (typeof matPlayer2[currId] !== 'undefined') {
                document.getElementById(currId + "pl2orig").classList.add("pogodak");
            }
        }
    }
}

//Nek je sa srecom
var attack = id => {
    let oldId = id[0] + id[1];
    if (id[2] == 2) { // PLAYER 1 ATTACKING PLAYER 2
        if (typeof matPlayer2[oldId] !== 'undefined') {
            if (!(document.getElementById(id).classList.contains("pogodak2")) && !(document.getElementById(id).classList.contains("pogodak3"))) {
                document.getElementById(id).classList.add("pogodak2");

                document.getElementById(oldId + "pl2orig").classList.remove("pogodak");
                document.getElementById(oldId + "pl2orig").classList.add("potop");

                ++play1;
                checkWholeShipSunk(1, oldId, id);
            }


        } else {
            if (!(document.getElementById(id).classList.contains("promasaj"))) {
                document.getElementById(id).classList.add("promasaj");
                document.getElementById(oldId + "pl2orig").classList.add("promasaj");
                $("#pl1orig").hide();
                $("#pl2exposed").hide();
                $("#pl1exposed").show();
                $("#pl2orig").show();
                playingPlayer = 2;
            }
        }
    } else {
        if (typeof matPlayer1[oldId] !== 'undefined') {
            if (!(document.getElementById(id).classList.contains("pogodak2")) && !(document.getElementById(id).classList.contains("pogodak3"))) {
                document.getElementById(id).classList.add("pogodak2");

                document.getElementById(oldId + "pl1orig").classList.remove("pogodak");
                document.getElementById(oldId + "pl1orig").classList.add("potop");

                checkWholeShipSunk(2, oldId, id);
                ++play2;
            }
        } else {
            if (!(document.getElementById(id).classList.contains("promasaj"))) {
                document.getElementById(id).classList.add("promasaj");
                document.getElementById(oldId + "pl1orig").classList.add("promasaj");
                $("#pl2orig").hide();
                $("#pl1exposed").hide();
                $("#pl1orig").show();
                $("#pl2exposed").show();
                playingPlayer = 1;
            }
        }
    }
    if (play1 == 20 || play2 == 20) {

        alertWhoWon();
        $("#pl2orig").hide();
        $("#pl1exposed").hide();
        $("#pl1orig").hide();
        $("#pl2exposed").hide();
        let tekstic = ''
        if (play1 == 20) {
            tekstic = localStorage.pl1Name + " WON";
        } else {
            tekstic = localStorage.pl2Name + " WON";
        }
        tekstic += `<br>
        <img src="battleship-assets/ezgif-4-53ff131eab6d.gif" alt="" class="firework"></img>
        <img src="battleship-assets/end2.gif" alt="" class="firework"></img>`
        document.getElementById("winner").innerHTML = tekstic;
    }

}


var checkWholeShipSunk = (pl, oldId, id) => {
    let group = 0;
    let position = -1;
    let otherId;
    let otherId2;
    let otherId3;
    let bool1 = false;
    let bool2 = false;
    let bool3 = false;
    if (pl == 2) {
        if (matPlayer1.one.indexOf(oldId) !== -1) {
            group = 1;
            position = matPlayer1.one.indexOf(oldId);
            document.getElementById(id).classList.remove("pogodak2");
            document.getElementById(id).classList.add("pogodak3");
            document.getElementById(oldId + "pl1orig").classList.remove("potop");
            document.getElementById(oldId + "pl1orig").classList.add("potop2");

        }
        if (matPlayer1.two.indexOf(oldId) !== -1) {
            group = 2;
            position = matPlayer1.two.indexOf(oldId);
            switch (position % 2) {
                case 0:
                    //BOZE SACUVAJ
                    otherId = matPlayer1.two[position + 1];

                    break;
                case 1:
                    otherId = matPlayer1.two[position - 1];
                    break;
            }
            bool1 = document.getElementById(otherId + 1).classList.contains('pogodak2');
            if (bool1) {

                document.getElementById(id).classList.remove("pogodak2");
                document.getElementById(id).classList.add("pogodak3");

                document.getElementById(oldId + "pl1orig").classList.remove("potop");
                document.getElementById(oldId + "pl1orig").classList.add("potop2");

                document.getElementById(otherId + 1).classList.remove("pogodak2");
                document.getElementById(otherId + 1).classList.add("pogodak3");

                document.getElementById(otherId + "pl1orig").classList.remove("potop");
                document.getElementById(otherId + "pl1orig").classList.add("potop2");

            }
        }
        if (matPlayer1.three.indexOf(oldId) !== -1) {
            group = 3;
            position = matPlayer1.three.indexOf(oldId);
            switch (position % 3) {
                case 0:
                    otherId = matPlayer1.three[position + 1];
                    otherId2 = matPlayer1.three[position + 2];
                    break;
                case 1:
                    otherId = matPlayer1.three[position - 1];
                    otherId2 = matPlayer1.three[position + 1];
                    break;
                case 2:
                    otherId = matPlayer1.three[position - 1];
                    otherId2 = matPlayer1.three[position - 2];
                    break;

            }

            bool1 = document.getElementById(otherId + 1).classList.contains('pogodak2');
            bool2 = document.getElementById(otherId2 + 1).classList.contains('pogodak2');
            if (bool1 && bool2) {

                document.getElementById(id).classList.remove("pogodak2");
                document.getElementById(id).classList.add("pogodak3");

                document.getElementById(oldId + "pl1orig").classList.remove("potop");
                document.getElementById(oldId + "pl1orig").classList.add("potop2");


                document.getElementById(otherId + 1).classList.remove("pogodak2");
                document.getElementById(otherId + 1).classList.add("pogodak3");

                document.getElementById(otherId + "pl1orig").classList.remove("potop");
                document.getElementById(otherId + "pl1orig").classList.add("potop2");

                document.getElementById(otherId2 + 1).classList.remove("pogodak2");
                document.getElementById(otherId2 + 1).classList.add("pogodak3");

                document.getElementById(otherId2 + "pl1orig").classList.remove("potop");
                document.getElementById(otherId2 + "pl1orig").classList.add("potop2");
            }

        }
        if (matPlayer1.four.indexOf(oldId) !== -1) {
            group = 4;
            position = matPlayer1.four.indexOf(oldId);
            switch (position % 4) {
                case 0:
                    otherId = matPlayer1.four[position + 1];
                    otherId2 = matPlayer1.four[position + 2];
                    otherId3 = matPlayer1.four[position + 3];
                    break;
                case 1:
                    otherId = matPlayer1.four[position - 1];
                    otherId2 = matPlayer1.four[position + 1];
                    otherId3 = matPlayer1.four[position + 2];
                    break;
                case 2:
                    otherId = matPlayer1.four[position - 1];
                    otherId2 = matPlayer1.four[position - 2];
                    otherId3 = matPlayer1.four[position + 1];
                    break;
                case 3:
                    otherId = matPlayer1.four[position - 1];
                    otherId2 = matPlayer1.four[position - 2];
                    otherId3 = matPlayer1.four[position - 3];
                    break;

            }
            bool1 = document.getElementById(otherId + 1).classList.contains('pogodak2');
            bool2 = document.getElementById(otherId2 + 1).classList.contains('pogodak2');
            bool3 = document.getElementById(otherId3 + 1).classList.contains('pogodak2');
            if (bool1 && bool2 && bool3) {
                document.getElementById(id).classList.remove("pogodak2");
                document.getElementById(id).classList.add("pogodak3");

                document.getElementById(oldId + "pl1orig").classList.remove("potop");
                document.getElementById(oldId + "pl1orig").classList.add("potop2");

                document.getElementById(otherId + 1).classList.remove("pogodak2");
                document.getElementById(otherId + 1).classList.add("pogodak3");

                document.getElementById(otherId + "pl1orig").classList.remove("potop");
                document.getElementById(otherId + "pl1orig").classList.add("potop2");

                document.getElementById(otherId2 + 1).classList.remove("pogodak2");
                document.getElementById(otherId2 + 1).classList.add("pogodak3");

                document.getElementById(otherId2 + "pl1orig").classList.remove("potop");
                document.getElementById(otherId2 + "pl1orig").classList.add("potop2");

                document.getElementById(otherId3 + 1).classList.remove("pogodak2");
                document.getElementById(otherId3 + 1).classList.add("pogodak3");

                document.getElementById(otherId3 + "pl1orig").classList.remove("potop");
                document.getElementById(otherId3 + "pl1orig").classList.add("potop2");
            }
        }
    }
    if (pl == 1) {
        if (matPlayer2.one.indexOf(oldId) !== -1) {
            group = 1;
            position = matPlayer2.one.indexOf(oldId);
            document.getElementById(id).classList.remove("pogodak2");
            document.getElementById(id).classList.add("pogodak3");

            document.getElementById(oldId + "pl2orig").classList.remove("potop");
            document.getElementById(oldId + "pl2orig").classList.add("potop2");
        }
        if (matPlayer2.two.indexOf(oldId) !== -1) {
            group = 2;
            position = matPlayer2.two.indexOf(oldId);
            switch (position % 2) {
                case 0:
                    //BOZE SACUVAJ
                    otherId = matPlayer2.two[position + 1];

                    break;
                case 1:
                    otherId = matPlayer2.two[position - 1];
                    break;
            }
            bool1 = document.getElementById(otherId + 2).classList.contains('pogodak2');
            if (bool1) {

                document.getElementById(id).classList.remove("pogodak2");
                document.getElementById(id).classList.add("pogodak3");

                document.getElementById(oldId + "pl2orig").classList.remove("potop");
                document.getElementById(oldId + "pl2orig").classList.add("potop2");

                document.getElementById(otherId + 2).classList.remove("pogodak2");
                document.getElementById(otherId + 2).classList.add("pogodak3");

                document.getElementById(otherId + "pl2orig").classList.remove("potop");
                document.getElementById(otherId + "pl2orig").classList.add("potop2");
            }
        }
        if (matPlayer2.three.indexOf(oldId) !== -1) {
            group = 3;
            position = matPlayer2.three.indexOf(oldId);
            switch (position % 3) {
                case 0:
                    otherId = matPlayer2.three[position + 1];
                    otherId2 = matPlayer2.three[position + 2];
                    break;
                case 1:
                    otherId = matPlayer2.three[position - 1];
                    otherId2 = matPlayer2.three[position + 1];
                    break;
                case 2:
                    otherId = matPlayer2.three[position - 1];
                    otherId2 = matPlayer2.three[position - 2];
                    break;

            }

            bool1 = document.getElementById(otherId + 2).classList.contains('pogodak2');
            bool2 = document.getElementById(otherId2 + 2).classList.contains('pogodak2');
            if (bool1 && bool2) {

                document.getElementById(id).classList.remove("pogodak2");
                document.getElementById(id).classList.add("pogodak3");

                document.getElementById(oldId + "pl2orig").classList.remove("potop");
                document.getElementById(oldId + "pl2orig").classList.add("potop2");

                document.getElementById(otherId + 2).classList.remove("pogodak2");
                document.getElementById(otherId + 2).classList.add("pogodak3");

                document.getElementById(otherId + "pl2orig").classList.remove("potop");
                document.getElementById(otherId + "pl2orig").classList.add("potop2");

                document.getElementById(otherId2 + 2).classList.remove("pogodak2");
                document.getElementById(otherId2 + 2).classList.add("pogodak3");

                document.getElementById(otherId2 + "pl2orig").classList.remove("potop");
                document.getElementById(otherId2 + "pl2orig").classList.add("potop2");
            }

        }
        if (matPlayer2.four.indexOf(oldId) !== -1) {
            group = 4;
            position = matPlayer2.four.indexOf(oldId);
            switch (position % 4) {
                case 0:
                    otherId = matPlayer2.four[position + 1];
                    otherId2 = matPlayer2.four[position + 2];
                    otherId3 = matPlayer2.four[position + 3];
                    break;
                case 1:
                    otherId = matPlayer2.four[position - 1];
                    otherId2 = matPlayer2.four[position + 1];
                    otherId3 = matPlayer2.four[position + 2];
                    break;
                case 2:
                    otherId = matPlayer2.four[position - 1];
                    otherId2 = matPlayer2.four[position - 2];
                    otherId3 = matPlayer2.four[position + 1];
                    break;
                case 3:
                    otherId = matPlayer2.four[position - 1];
                    otherId2 = matPlayer2.four[position - 2];
                    otherId3 = matPlayer2.four[position - 3];
                    break;

            }
            bool1 = document.getElementById(otherId + 2).classList.contains('pogodak2');
            bool2 = document.getElementById(otherId2 + 2).classList.contains('pogodak2');
            bool3 = document.getElementById(otherId3 + 2).classList.contains('pogodak2');
            if (bool1 && bool2 && bool3) {
                document.getElementById(id).classList.remove("pogodak2");
                document.getElementById(id).classList.add("pogodak3");

                document.getElementById(oldId + "pl2orig").classList.remove("potop");
                document.getElementById(oldId + "pl2orig").classList.add("potop2");

                document.getElementById(otherId + 2).classList.remove("pogodak2");
                document.getElementById(otherId + 2).classList.add("pogodak3");

                document.getElementById(otherId + "pl2orig").classList.remove("potop");
                document.getElementById(otherId + "pl2orig").classList.add("potop2");

                document.getElementById(otherId2 + 2).classList.remove("pogodak2");
                document.getElementById(otherId2 + 2).classList.add("pogodak3");

                document.getElementById(otherId2 + "pl2orig").classList.remove("potop");
                document.getElementById(otherId2 + "pl2orig").classList.add("potop2");

                document.getElementById(otherId3 + 2).classList.remove("pogodak2");
                document.getElementById(otherId3 + 2).classList.add("pogodak3");

                document.getElementById(otherId3 + "pl2orig").classList.remove("potop");
                document.getElementById(otherId3 + "pl2orig").classList.add("potop2");
            }
        }
    }
}


var alertWhoWon = () => {
    let brNepotopljenih = 0;
    if (play1 == 20) {
        //JEDNO POLJE
        matPlayer1.one.forEach(ship => {
            if (!document.getElementById(ship + 1).classList.contains("pogodak3")) {
                brNepotopljenih++;
            }
        });

        //DVA PLJA
        if (!document.getElementById(matPlayer1.two[0] + 1).classList.contains("pogodak3")) {
            brNepotopljenih++;

        }
        if (!document.getElementById(matPlayer1.two[2] + 1).classList.contains("pogodak3")) {
            brNepotopljenih++;

        }
        if (!document.getElementById(matPlayer1.two[4] + 1).classList.contains("pogodak3")) {
            brNepotopljenih++;

        }

        //TRI POLJA
        if (!document.getElementById(matPlayer1.three[0] + 1).classList.contains("pogodak3")) {
            brNepotopljenih++;
        }

        if (!document.getElementById(matPlayer1.three[3] + 1).classList.contains("pogodak3")) {
            brNepotopljenih++;

        }

        //CETRI POLJA

        if (!document.getElementById(matPlayer1.four[0] + 1).classList.contains("pogodak3")) {
            brNepotopljenih++;
        }
        alert("Pobedio/la je " + localStorage.pl1Name + ". Njemu nije potopljeno " + brNepotopljenih + " brodova!");

    } else {
        matPlayer2.one.forEach(ship => {
            if (!document.getElementById(ship + 2).classList.contains("pogodak3")) {
                brNepotopljenih++;
            }
        });

        //DVA PLJA
        if (!document.getElementById(matPlayer2.two[0] + 2).classList.contains("pogodak3")) {
            brNepotopljenih++;

        }
        if (!document.getElementById(matPlayer2.two[2] + 2).classList.contains("pogodak3")) {
            brNepotopljenih++;

        }
        if (!document.getElementById(matPlayer2.two[4] + 2).classList.contains("pogodak3")) {
            brNepotopljenih++;

        }

        //TRI POLJA
        if (!document.getElementById(matPlayer2.three[0] + 2).classList.contains("pogodak3")) {
            brNepotopljenih++;
        }

        if (!document.getElementById(matPlayer2.three[3] + 2).classList.contains("pogodak3")) {
            brNepotopljenih++;

        }

        //CETRI POLJA

        if (!document.getElementById(matPlayer2.four[0] + 2).classList.contains("pogodak3")) {
            brNepotopljenih++;
        }

        alert("Pobedio/la je " + localStorage.pl2Name + ". Njemu nije potopljeno " + brNepotopljenih + " brodova!");
    }



}