/**
 * Panda Casino
 * Asaf Gilboa.
 */


/* Word Objects */
var word1 = {
    word: "APPLE",
    category: "Fruit",
    cells: ["r3c4", "r3c5", "r3c6", "r3c7", "r3c8"],
}

var word2 = {
    word: "WATERMELON",
    category: "Fruit",
    cells: ["r3c2", "r3c3", "r3c4", "r3c5", "r3c6", "r3c7", "r3c8", "r3c9", "r3c10", "r3c11"],
}

var word3 = {
    word: "GIRAFFE",
    category: "Animal",
    cells: ["r3c3", "r3c4", "r3c5", "r3c6", "r3c7", "r3c8", "r3c9"],
}

var word4 = {
    word: "MONKEY",
    category: "Animal",
    cells: ["r3c4", "r3c5", "r3c6", "r3c7", "r3c8", "r3c9"],
}

var word5 = {
    word: "FINLAND",
    category: "Countries",
    cells: ["r3c3", "r3c4", "r3c5", "r3c6", "r3c7", "r3c8", "r3c9"],
}

var word6 = {
    word: "NEW ZEALAND",
    category: "Countries",
    cells: ["r2c2", "r2c3", "r2c4", "r2c6", "r4c2", "r4c3", "r4c4", "r4c5", "r4c6", "r4c7", "r4c8"],
}

var word7 = {
    word: "BRAZIL",
    category: "Countries",
    cells: ["r3c4", "r3c5", "r3c6", "r3c7", "r3c8", "r3c9"],
}

var word8 = {
    word: "COCONUT",
    category: "Fruit",
    cells: ["r3c3", "r3c4", "r3c5", "r3c6", "r3c7", "r3c8", "r3c9"],
}

var word9 = {
    word: "POLAR BEAR",
    category: "Animal",
    cells: ["r2c4", "r2c5", "r2c6", "r2c7", "r2c8", "r2c10", "r4c4", "r4c5", "r4c6", "r4c7"],
}

var word10 = {
    word: "PURPLE",
    category: "Colors",
    cells: ["r3c4", "r3c5", "r3c6", "r3c7", "r3c8", "r3c9"],
}

// under construction
// get a word and assemble fitting cells array
function fitWord(word) {
    const rowsLimit = 5;
    const columnsLimit = 12;
    const words = word.split(" ");
    const cells = [];
    let rows = 2;
    let currentCell = 1;
    words.forEach(word => {
        if (word.length > columnsLimit) {
            console.error("Word too long");
            return -1;
        }
        if (currentCell + word.length + 1 <= columnsLimit) {
            currentCell += word.length + 1;
        } else { 
            rows++;
            currentCell = word.length + 1;
            if (rows > rowsLimit) {
                console.error("Word too long");
                return -1;
            }
        }
        for (let i = 0; i < word.length; i++) {
            cells.push(`r${rows}c${currentCell-word.length+i}`);
        }
    });
    console.log("fitWord ", cells);
    return cells;
}



var words = [word1, word2, word3, word4, word5, word6, word7, word8, word9, word10];
var score; // current user score
var wordex; // index for current word
var found; // letters found in word so far 
var slice; // point value of that was rolled a wheel spin



/** Initialize board with new word **/
function setBoard() {
    found = 0;
    score = 0;
    wordex = getRandom(words.length) - 1;
    console.log("word is " + words[wordex].word);
    // const ncells = [...fitWord(words[wordex].word)];

    for (var i = 0; i < words[wordex].word.length; i++) {
        if (words[wordex].word[i] == " ") {
            found++;
            continue;
        }
        // console.log(`words[wordex].cells[i]=${words[wordex].cells[i]} | ncells[i]=${ncells[i]}`);
        // var c = '#' + ncells[i];
        var c = '#' + words[wordex].cells[i];
        var str = '<span class="letter">' + words[wordex].word[i] + '</span>';
        $(c)[0].innerHTML = str;
        $(c).css({
            "background": 'url("images/tile.png")',
            "background-size": 'cover',
            "box-shadow": '0px 0px 5px 3px ghostwhite inset',
            "text-shadow": '0px 0px 6px steelblue',
            "transform-style": 'preserve-3d'
        });
    }
}


/** "Spin wheel" click handler **/
$("#spinBtn").click(function () {

    $("#spinBtn").fadeOut(1000);

    $("#message")[0].style.backgroundImage =
        `linear-gradient(to bottom right,
            rgb(159, 174, 45), rgb(189, 204, 218),
            rgb(159, 174, 45), rgb(189, 204, 218))`;
    $("#message")[0].style.backgroundSize = "cover";
    $("#message")[0].innerHTML = "<br/><br/>Spinning!<br/>Get ready";

    var spin = getRandom(10);
    slice = spin * 100;

    var img = document.getElementById("wheelImg");
    var dgr = -1 * (spin * 36 + 3582); // 3582 = 10 spins less half a "slice"
    var str = "rotate(" + dgr + "deg)";
    img.style.transform = str;

    setTimeout(function () {
        $("#spinDiv")[0].innerHTML = slice;
    }, 3000);
    setTimeout(function () {
        document.getElementById("host").style.transform = "rotateY(180deg)";
        $("#category")[0].innerHTML = words[wordex].category;
        boardUp();
    }, 5000);
})


/** Virtual keyboard click handler **/
$(".myBtn").click(function () {
    if (this.dataUsed) {
        return;
    }

    this.dataUsed = true;
    $(".myBtn").addClass("disabledbutton");
    this.style.background = "darkslategray";
    var c = this.innerText;
    var n = checkLetter(words[wordex], c);
    found += n;

    if (n == 0) {
        score -= slice / 2;
        $("#message")[0].innerHTML =
            "<br/><br/>Found no '" + c + "'s.<br/><br> Lost<br/>" + (slice / 2) + "!";
    } else {
        score += n * slice;
        $("#message")[0].innerHTML =
            "<br/><br/>Found " + n + " '" + c + "'s.<br><br/> Scored<br/>" + (n * slice) + "!";
    }

    $("#message")[0].style.background =
        `linear-gradient(to bottom right,
            rgb(19, 110, 27), rgb(189, 204, 218),
            rgb(19, 110, 27), rgb(189, 204, 218))`;
    $("#message")[0].style.backgroundSize = "cover";
    $("#score")[0].innerText = score;

    if (found == words[wordex].word.length) {
        setTimeout(function () {
            boardWin();
        }, 1000);
        setTimeout(function () {
            win();
        }, 5000);
    } else {
        setTimeout(function () {
            document.getElementById("host").style.transform = "rotateY(0deg)";
            wheelUp();
        }, 3000);
    }
})


/** Transition form wheel spin to letter choice mode **/
function boardUp() {
    $("#wheelCont").fadeOut(1000);
    $(".myBtn").fadeIn(1100);
    $(".deadBtn").fadeIn(1100);

    $("#wheelImg")[0].style.transform = "none";
    $("#boardCont")[0].style.opacity = 1;
    $("#bottomCont")[0].style.opacity = 1;
    $(".myBtn").removeClass("disabledbutton");

    $("#message")[0].style.backgroundImage =
        `linear-gradient(to bottom right,
            rgb(36, 105, 145), rgb(189, 204, 218),
            rgb(36, 105, 145), rgb(189, 204, 218))`;
    $("#message")[0].style.backgroundSize = "cover";
    $("#message")[0].innerHTML = "<br/><br/>Choose </br/>a letter.";
}


/** Check if a letter is in a word **/
function checkLetter(thisWord, letter) {
    var c = thisWord.word.indexOf(letter);
    var n = 0;
    while (c != -1) {
        reveal(thisWord.cells[c]);
        c = thisWord.word.indexOf(letter, (c + 1));
        n++;
    }
    return n;
}


/** Reveal a letter tile **/
function reveal(cell) {
    var str = '#' + cell + ' .letter';
    $(str)[0].style.color = 'black';
    str = '#' + cell;
    $(str).css({
        "background": 'lemonchiffon',
        "transition": '1s',
        "transform": 'rotateY(360deg)'
    });
}


/** Transition form letter choice to wheel spin mode **/
function wheelUp() {
    $("#boardCont")[0].style.opacity = 0.3;
    $("#bottomCont")[0].style.opacity = 0.3;
    $(".myBtn").fadeOut(1500);
    $(".deadBtn").fadeOut(1500);
    $("#wheelCont").fadeIn(1500);
    $("#spinBtn").fadeIn(1500);
    $("#spinDiv")[0].innerHTML = "? ? ?";
    $("#message")[0].style.backgroundImage =
        `linear-gradient(to bottom right,
            rgb(111, 69, 169), rgb(189, 204, 218),
            rgb(111, 69, 169), rgb(189, 204, 218))`;
    $("#message")[0].style.backgroundSize = "cover";
    $("#message")[0].innerHTML = "<br/>Click the<br/>'Spin' button<br/>to spin the wheel."
}


/** Game successfully finished **/
function win() {

    $("#message")[0].style.backgroundImage =
        `linear-gradient(to bottom right,
            rgb(107, 15, 123), rgb(189, 204, 218),
            rgb(107, 15, 123), rgb(189, 204, 218))`;
    $("#message")[0].style.backgroundSize = "cover";
    $("#message")[0].innerHTML = '<br/><br/>YOU WIN!<br/><font size="85"><b>☻</b></font>';

    $("#winModal span")[0].innerHTML = "Victory!<br/>Final Score = " + score;
    $("#winModal").fadeIn(1234);

    $("#boardCont")[0].style.opacity = 0.2;
    $("#bottomCont")[0].style.opacity = 0.2;

}


/** Victory special effects **/
function boardWin() {
    var r, g, b, clr, shad, brdr, r, c, now;
    for (var i = 0; i <= 1000; i++) {
        setTimeout(function () {
            r = getRandom(256) - 1;
            g = getRandom(256) - 1;
            b = getRandom(256) - 1;
            clr = "rgb(" + r + "," + g + "," + b + ")";

            r = getRandom(256) - 1;
            g = getRandom(256) - 1;
            b = getRandom(256) - 1;
            shad = "0px 0px 15px 5.5px rgb(" + r + "," + g + "," + b + ") inset";

            r = getRandom(256) - 1;
            g = getRandom(256) - 1;
            b = getRandom(256) - 1;
            brdr = "3px groove rgb(" + r + "," + g + "," + b + ")";

            r = getRandom(5);
            c = getRandom(12);
            now = "r" + r + "c" + c;

            if (words[wordex].cells.indexOf(now) == -1) {
                now = "#" + now;
                $(now)[0].style.background = clr;
                $(now)[0].style.boxShadow = shad;
                $(now)[0].style.border = brdr;
            }
        }, (i * 25));
    }
}

/** Start a new game **/
$("#play").click(function () {
    location.reload();
})

function getRandom(max) {
    var r = Math.random() * max + 1;
    r = Math.floor(r);
    return r;
}

setBoard();
wheelUp();
