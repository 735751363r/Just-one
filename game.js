class JustOneGame {
    constructor() {
        this.gameState = {
            roomCode: '',
            players: [],
            activePlayer: null,
            currentWord: '',
            hints: [],
            phase: 'waiting' // waiting, giving-hints, guessing
        };
    }

    createGame() {
        this.gameState.roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        this.saveState();
        return this.gameState.roomCode;
    }

    joinGame(roomCode, playerName) {
        if (this.loadState(roomCode)) {
            const newPlayer = {
                id: Date.now().toString(),
                name: playerName,
                isHost: this.gameState.players.length === 0
            };
            this.gameState.players.push(newPlayer);
            this.saveState();
            return true;
        }
        return false;
    }

    saveState() {
        localStorage.setItem(this.gameState.roomCode, JSON.stringify(this.gameState));
    }

    loadState(roomCode) {
        const savedState = localStorage.getItem(roomCode);
        if (savedState) {
            this.gameState = JSON.parse(savedState);
            return true;
        }
        return false;
    }
}

// Globale Spielinstanz
const game = new JustOneGame();

// UI Funktionen
function createGame() {
    const roomCode = game.createGame();
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    document.getElementById('room-code').textContent = roomCode;
    
    // QR Code generieren
    const qrcode = new QRCode(document.getElementById("qrcode"), {
        text: window.location.href + '?room=' + roomCode,
        width: 128,
        height: 128
    });
    
    updatePlayersList();
}

function showJoinGame() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('join-screen').classList.remove('hidden');
}

function joinGame() {
    const roomCode = document.getElementById('game-code').value.toUpperCase();
    const playerName = document.getElementById('player-name').value;
    
    if (game.joinGame(roomCode, playerName)) {
        document.getElementById('join-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        document.getElementById('room-code').textContent = roomCode;
        updatePlayersList();
    } else {
        alert('Spielraum nicht gefunden!');
    }
}

function updatePlayersList() {
    const playersList = document.getElementById('players-list');
    playersList.innerHTML = '<h3>Spieler:</h3>';
    game.gameState.players.forEach(player => {
        const playerElement = document.createElement('div');
        playerElement.classList.add('player-item');
        playerElement.textContent = `${player.name} ${player.isHost ? '(Host)' : ''}`;
        playersList.appendChild(playerElement);
    });
}

// URL Parameter beim Laden prüfen
window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomCode = urlParams.get('room');
    if (roomCode) {
        document.getElementById('game-code').value = roomCode;
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('join-screen').classList.remove('hidden');
    }
};
