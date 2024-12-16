// Spiel erstellen - QR-Code und Spiel-Code anzeigen
document.getElementById("create-game").addEventListener("click", function () {
    const gameCode = generateGameCode();  // Generiert einen zufälligen Spiel-Code
    document.getElementById("code").textContent = gameCode;
    document.getElementById("game-code").style.display = "block";
    
    // QR-Code generieren
    QRCode.toCanvas(document.getElementById("qr-code"), gameCode, function (error) {
        if (error) console.error(error);
        console.log("QR Code generiert!");
    });

    alert("Spiel gestartet! Spieler können sich mit dem QR-Code eintragen.");
});

// Funktion zum Generieren eines zufälligen Spiel-Codes
function generateGameCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let gameCode = '';
    for (let i = 0; i < 6; i++) {
        gameCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return gameCode;
}

// Spieler geben ihren Hinweis ein
document.getElementById("submit-clue").addEventListener("click", function () {
    const clue = document.getElementById("player-clue").value.trim();
    if (clue) {
        // Hinweis speichern und Textfeld leeren
        alert("Hinweis erfolgreich abgegeben!");
        document.getElementById("player-clue").value = "";
    }
});

// Ratender gibt seine Antwort ein
document.getElementById("submit-guess").addEventListener("click", function () {
    const guess = document.getElementById("guess").value.trim();
    if (guess) {
        alert("Antwort abgegeben: " + guess);
        // Hier könnte die Logik für richtige/wrong Antwort und Punkte eingefügt werden
    }
});

// Beispiel: Wechseln zwischen Spielansichten
function switchToPlayerView() {
    document.getElementById("host-dashboard").style.display = "none";
    document.getElementById("player-interface").style.display = "block";
}

function switchToGuessingView() {
    document.getElementById("player-interface").style.display = "none";
    document.getElementById("guessing-interface").style.display = "block";
    
    // Zeige die Hinweise an
    document.getElementById("clue-list").innerHTML = "<li>Hinweis 1</li><li>Hinweis 2</li>";
}
