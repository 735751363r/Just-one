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

    // Add this method to the JustOneGame class
setupAutoRefresh() {
    setInterval(() => {
        if (this.gameState.roomCode) {
            this.loadState(this.gameState.roomCode);
            this.updateGameArea();
            this.updatePlayersList();
        }
    }, 2000); // Refresh every 2 seconds
}

// Modify the constructor
constructor() {
    this.gameState = {
        roomCode: '',
        players: [],
        activePlayer: null,
        currentWord: '',
        hints: {},
        phase: 'waiting',
        score: 0
    };
    this.setupEventListeners();
    this.setupAutoRefresh(); // Add this line
}
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
        
        if (!playerName.trim()) {
            alert('Bitte gib einen Namen ein!');
            return;
        }

        if (this.loadState(roomCode)) {
            if (this.gameState.players.some(p => p.name === playerName)) {
                alert('Dieser Name ist bereits vergeben!');
                return;
            }

            const newPlayer = {
                id: Date.now().toString(),
                name: playerName,
                isHost: this.gameState.players.length === 0
            };

            localStorage.setItem('currentPlayerId', newPlayer.id);
            
            this.gameState.players.push(newPlayer);
            this.saveState();
            this.showGameScreen();
            return true;
        }
        alert('Spielraum nicht gefunden!');
        return false;
    }
loadState(roomCode) {
    const savedState = localStorage.getItem(roomCode);
    if (savedState) {
        this.gameState = JSON.parse(savedState);
        console.log('Loaded state:', this.gameState); // Debug output
        this.updateGameArea();
        this.updatePlayersList();
        return true;
    }
    return false;
}

startNewRound() {
    if (this.gameState.players.length < 3) {
        alert('Mindestens 3 Spieler werden benötigt!');
        return;
    }

    // Force word selection and save
    this.gameState.currentWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    const randomPlayerIndex = Math.floor(Math.random() * this.gameState.players.length);
    this.gameState.activePlayer = this.gameState.players[randomPlayerIndex];
    this.gameState.phase = 'giving-hints';
    this.gameState.hints = {};
    
    console.log('Starting round with word:', this.gameState.currentWord); // Debug output
    
    this.saveState();
    this.updateGameArea();
}
    startNewRound() {
            startNewRound() {
        console.log('Starting new round');
        if (this.gameState.players.length < 3) {
            alert('Mindestens 3 Spieler werden benötigt!');
            return;
        }
        if (this.gameState.players.length < 3) {
            alert('Mindestens 3 Spieler werden benötigt!');
            return;
        }

        this.gameState.currentWord = WORDS[Math.floor(Math.random() * WORDS.length)];
        const randomPlayerIndex = Math.floor(Math.random() * this.gameState.players.length);
        this.gameState.activePlayer = this.gameState.players[randomPlayerIndex];
        this.gameState.phase = 'giving-hints';
        this.gameState.hints = {};
        
        document.getElementById('hint-input').value = '';
        document.getElementById('guess-input').value = '';
        
        this.saveState();
        this.updateGameArea();
        
        console.log('New round started. Word:', this.gameState.currentWord);
    }

submitHint() {
    const currentPlayer = this.getCurrentPlayer();
    if (!currentPlayer) {
        console.log('No current player found');
        return;
    }
    
    if (currentPlayer.id === this.gameState.activePlayer?.id) return;

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
            updateGameArea() {
        console.log('Current game state:', this.gameState);
        console.log('Current player:', this.getCurrentPlayer());
        const wordDisplay = document.getElementById('word-display');
        const wordDisplay = document.getElementById('word-display');
        const hintArea = document.getElementById('hint-input-area');
        const guessArea = document.getElementById('guess-area');
        const startRoundBtn = document.getElementById('start-round-btn');

        [wordDisplay, hintArea, guessArea, startRoundBtn].forEach(el => el.classList.add('hidden'));

        const currentPlayer = this.getCurrentPlayer();
        
        if (!currentPlayer) return;

        switch (this.gameState.phase) {
            case 'waiting':
                startRoundBtn.classList.remove('hidden');
                wordDisplay.textContent = 'Warte auf Spielstart...';
                wordDisplay.classList.remove('hidden');
                break;
                
            case 'giving-hints':
                if (currentPlayer.id === this.gameState.activePlayer.id) {
                    wordDisplay.textContent = 'Die anderen Spieler schreiben ihre Hinweise...';
                } else {
                    wordDisplay.textContent = `Das Wort lautet: ${this.gameState.currentWord}`;
                    hintArea.classList.remove('hidden');
                }
                wordDisplay.classList.remove('hidden');
                break;
                
            case 'guessing':
                if (currentPlayer.id === this.gameState.activePlayer.id) {
                    const hints = Object.values(this.gameState.hints);
                    wordDisplay.textContent = `Die Hinweise sind: ${hints.join(', ')}`;
                    guessArea.classList.remove('hidden');
                } else {
                    wordDisplay.textContent = 'Warte auf die Antwort des ratenden Spielers...';
                }
                wordDisplay.classList.remove('hidden');
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

const game = new JustOneGame();

window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomCode = urlParams.get('room');
    if (roomCode) {
        document.getElementById('game-code').value = roomCode;
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('join-screen').classList.remove('hidden');
    }
};
