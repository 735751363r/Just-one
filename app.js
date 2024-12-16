// Einfaches Beispiel zur Handhabung von Spieler*innen-Interaktionen

let players = [];
let clues = [];
let currentPlayer = 0;

// Spiel erstellen - QR-Code und Spiel-Code anzeigen
document.getElementById("create-game").addEventListener("click", function () {
    document.getElementById("qr-code").innerHTML = "<img src='https://via.placeholder.com/150' alt='QR-Code'>"; // Hier könnte ein echter QR-Code sein.
    document.getElementById("game-code").style.display = "block";
    players.push("Lehrer");  // Beispiel: Lehrer als Teilnehmer
    alert("Spiel gestartet! Spieler können sich mit dem QR-Code eintragen.");
});

// Spieler geben ihren Hinweis ein
document.getElementById("submit-clue").addEventListener("click", function () {
    const clue = document.getElementById("player-clue").value.trim();
    if (clue) {
        clues.push(clue);
        document.getElementById("player-clue").value = "";  // Textfeld leeren
        alert("Hinweis erfolgreich abgegeben!");
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
    document.getElementById("clue-list").innerHTML = clues.map(clue => `<li>${clue}</li>`).join('');
}
