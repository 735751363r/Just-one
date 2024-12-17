class JustOneGame {
    constructor() {
        this.gameState = {
            roomCode: '',
            players: [],
            activePlayer: null,
            currentWord: '',
            hints: {},
            phase: 'waiting', // waiting, giving-hints, guessing
            score: 0
        };
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('create-game-btn').addEventListener('click', () => this.createGame());
        document.getElementById('show-join-btn').addEventListener('click', () => this.showJoinGame());
        document.getElementById('join-game-btn').addEventListener('click', () => this.joinGame());
        document.getElementById('start-round-btn').addEventListener('click', () => this.startNewRound());
        document.getElementById('submit-hint-btn').addEventListener('click', () => this.submitHint());
        document.getElementById('submit-guess-btn').addEventListener('click', () => this.submitGuess());
    }

    createGame() {
        this.gameState.roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        this.saveState();
        this.showGameScreen();
        return this.gameState.roomCode;
    }

    showGameScreen() {
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        document.getElementById('room-code').textContent = this.gameState.roomCode;
        
        const qrcode = new QRCode(document.getElementById("qrcode"), {
            text: window.location.href + '?room=' + this.gameState.roomCode,
            width: 128,
            height: 128
        });
        
        this.updatePlayersList();
        
        if (this.gameState.players.length >= 3) {
            document.getElementById('start-round-btn').classList.remove('hidden');
        }
    }

    showJoinGame() {
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('join-screen').classList.remove('hidden');
    }

    joinGame() {
        const roomCode = document.getElementById('game-code').value.toUpperCase();
        const playerName = document.getElementById('player-name').value;
        
        if (this.loadState(roomCode)) {
            const newPlayer = {
                id: Date.now().toString(),
                name: playerName,
                isHost: this.gameState.players.length === 0
            };
            this.gameState.players.push(newPlayer);
            this.saveState();
            this.showGameScreen();
            return true;
        }
        alert('Spielraum nicht gefunden!');
        return false;
    }

    startNewRound() {
        if (this.gameState.players.length < 3) {
            alert('Mindestens 3 Spieler werden benötigt!');
            return;
        }

        this.gameState.phase = 'giving-hints';
        this.gameState.hints = {};
        this.gameState.currentWord = WORDS[Math.floor(Math.random() * WORDS.length)];
        this.gameState.activePlayer = this.gameState.players[Math.floor(Math.random() * this.gameState.players.length)];
        
        this.saveState();
        this.updateGameArea();
    }

    submitHint() {
        const currentPlayer = this.getCurrentPlayer();
        if (currentPlayer.id === this.gameState.activePlayer.id) return;

        const hint = document.getElementById('hint-input').value.toUpperCase();
        this.gameState.hints[currentPlayer.id] = hint;
        document.getElementById('hint-input').value = '';
        
        if (Object.keys(this.gameState.hints).length === this.gameState.players.length - 1) {
            this.filterDuplicateHints();
            this.gameState.phase = 'guessing';
        }
        
        this.saveState();
        this.updateGameArea();
    }

    filterDuplicateHints() {
        const hints = Object.values(this.gameState.hints);
        const uniqueHints = {};
        
        Object.entries(this.gameState.hints).forEach(([playerId, hint]) => {
            if (hints.filter(h => h === hint).length === 1) {
                uniqueHints[playerId] = hint;
            }
        });
        
        this.gameState.hints = uniqueHints;
    }

    submitGuess() {
        const guess = document.getElementById('guess-input').value.toUpperCase();
        if (guess === this.gameState.currentWord) {
            this.gameState.score += 1;
            alert('Richtig! Das Wort war: ' + this.gameState.currentWord);
        } else {
            alert('Leider falsch! Das Wort war: ' + this.gameState.currentWord);
        }
        
        this.gameState.phase = 'waiting';
        this.saveState();
        this.updateGameArea();
    }

    getCurrentPlayer() {
        const playerId = localStorage.getItem('currentPlayerId');
        return this.gameState.players.find(p => p.id === playerId);
    }

    updateGameArea() {
        const gameArea = document.getElementById('game-area');
        const wordDisplay = document.getElementById('word-display');
        const hintArea = document.getElementById('hint-input-area');
        const guessArea = document.getElementById('guess-area');
        const startRoundBtn = document.getElementById('start-round-btn');

        wordDisplay.classList.add('hidden');
        hintArea.classList.add('hidden');
        guessArea.classList.add('hidden');
        startRoundBtn.classList.add('hidden');

        switch (this.gameState.phase) {
            case 'waiting':
                startRoundBtn.classList.remove('hidden');
                break;
            case 'giving-hints':
                if (this.getCurrentPlayer().id !== this.gameState.activePlayer.id) {
                    wordDisplay.textContent = `Das Wort ist: ${this.gameState.currentWord}`;
                    wordDisplay.classList.remove('hidden');
                    hintArea.classList.remove('hidden');
                }
                break;
            case 'guessing':
                if (this.getCurrentPlayer().id === this.gameState.activePlayer.id) {
                    guessArea.classList.remove('hidden');
                    const hints = Object.values(this.gameState.hints);
                    wordDisplay.textContent = `Hinweise: ${hints.join(', ')}`;
                    wordDisplay.classList.remove('hidden');
                }
                break;
        }
    }

    updatePlayersList() {
        const playersList = document.getElementById('players-list');
        playersList.innerHTML = `
            <h3>Spieler:</h3>
            <div>Punktestand: ${this.gameState.score}</div>
        `;
        this.gameState.players.forEach(player => {
            const playerElement = document.createElement('div');
            playerElement.classList.add('player-item');
            playerElement.textContent = `${player.name} ${player.isHost ? '(Host)' : ''} ${
                player.id === this.gameState.activePlayer?.id ? '(Rät)' : ''
            }`;
            playersList.appendChild(playerElement);
        });
    }

    saveState() {
        localStorage.setItem(this.gameState.roomCode, JSON.stringify(this.gameState));
        this.updatePlayersList();
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

// Spielinstanz erstellen
const game = new JustOneGame();

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
