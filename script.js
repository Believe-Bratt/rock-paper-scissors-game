// Ultimate Rock Paper Scissors - Advanced Edition
// Advanced JavaScript with AI, animations, and modern features

class UltimateRPS {
    constructor() {
        this.gameState = {
            playerChoice: null,
            player2Choice: null,
            aiChoice: null,
            result: null,
            gameMode: 'classic',
            currentTheme: 'default',
            aiDifficulty: 5,
            animationsEnabled: true,
            soundEnabled: true,
            isMultiplayer: false,
            currentPlayer: 1,
            stats: {
                wins: 0,
                losses: 0,
                ties: 0,
                totalGames: 0,
                player2Wins: 0,
                streaks: {
                    current: 0,
                    best: 0
                }
            },
            gameHistory: [],
            aiPattern: [],
            playerPattern: [],
            achievements: [],
            powerups: {
                shield: 0,
                doubleStrike: 0,
                mindRead: 0
            },
            activePowerup: null,
            leaderboard: []
        };

        this.choices = ['rock', 'paper', 'scissors'];
        this.extendedChoices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
        this.choiceIcons = {
            rock: '🪨',
            paper: '📄',
            scissors: '✂️',
            lizard: '🦎',
            spock: '🖖'
        };

        this.aiStrategies = {
            random: 'Random',
            pattern: 'Pattern Recognition',
            counter: 'Counter Strategy',
            adaptive: 'Adaptive Learning',
            psychological: 'Psychological Warfare'
        };

        this.achievementDefinitions = [
            { id: 'first_win', name: 'First Victory', description: 'Win your first game', icon: '🏆', unlocked: false },
            { id: 'win_streak_5', name: 'Hot Streak', description: 'Win 5 games in a row', icon: '🔥', unlocked: false },
            { id: 'win_streak_10', name: 'Unstoppable', description: 'Win 10 games in a row', icon: '⚡', unlocked: false },
            { id: 'total_wins_50', name: 'Veteran', description: 'Win 50 total games', icon: '🎖️', unlocked: false },
            { id: 'perfect_game', name: 'Perfectionist', description: 'Win without losing once in a session', icon: '💎', unlocked: false },
            { id: 'ai_master', name: 'AI Master', description: 'Beat AI on maximum difficulty', icon: '🤖', unlocked: false },
            { id: 'lizard_spock_master', name: 'Spock Logic', description: 'Win 10 games in Lizard Spock mode', icon: '🖖', unlocked: false },
            { id: 'powerup_user', name: 'Power Player', description: 'Use all three power-ups', icon: '⚡', unlocked: false }
        ];

        this.themes = {
            default: { name: 'Default', colors: { primary: '#6366f1', secondary: '#ec4899' } },
            neon: { name: 'Neon', colors: { primary: '#00ff41', secondary: '#ff0080' } },
            retro: { name: 'Retro', colors: { primary: '#ff6b35', secondary: '#f7931e' } },
            minimal: { name: 'Minimal', colors: { primary: '#333333', secondary: '#666666' } }
        };

        this.init();
    }

    init() {
        this.loadGame();
        this.setupEventListeners();
        this.hideLoadingScreen();
        this.updateDisplay();
        this.initializeAI();
        this.initializeNewFeatures();
    }

    initializeNewFeatures() {
        // Apply saved theme
        this.applyTheme(this.gameState.currentTheme);
        
        // Initialize displays
        this.updateAchievementsDisplay();
        this.updateLeaderboardDisplay();
        this.updatePowerupDisplay();
        
        // Set theme button active state
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-theme="${this.gameState.currentTheme}"]`)?.classList.add('active');
    }

    setupEventListeners() {
        // Choice buttons
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const button = e.target.closest('.choice-btn');
                const choice = button.dataset.choice;
                const player = button.dataset.player || '1';
                this.handlePlayerChoice(choice, parseInt(player));
            });
        });

        // Game controls
        document.getElementById('playAgainBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetStats());

        // Panel toggle
        document.getElementById('panelToggle').addEventListener('click', () => this.togglePanel());

        // Game mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeGameMode(e.target.dataset.mode));
        });

        // AI difficulty slider
        document.getElementById('aiDifficulty').addEventListener('input', (e) => {
            this.gameState.aiDifficulty = parseInt(e.target.value);
            this.updateAIDisplay();
        });

        // Animation controls
        document.getElementById('enableAnimations').addEventListener('change', (e) => {
            this.gameState.animationsEnabled = e.target.checked;
        });

        document.getElementById('enableSound').addEventListener('change', (e) => {
            this.gameState.soundEnabled = e.target.checked;
        });

        // Theme buttons
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeTheme(e.target.dataset.theme));
        });

        // Modal close
        document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'modalOverlay') this.closeModal();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleKeyboard(e) {
        if (e.target.tagName === 'INPUT') return;
        
        switch(e.key.toLowerCase()) {
            case 'r':
                this.handlePlayerChoice('rock', 1);
                break;
            case 'p':
                this.handlePlayerChoice('paper', 1);
                break;
            case 's':
                this.handlePlayerChoice('scissors', 1);
                break;
            case 'l':
                if (this.gameState.gameMode === 'lizard-spock') {
                    this.handlePlayerChoice('lizard', 1);
                }
                break;
            case 'v':
                if (this.gameState.gameMode === 'lizard-spock') {
                    this.handlePlayerChoice('spock', 1);
                }
                break;
            case 'enter':
                if (this.gameState.result) this.resetGame();
                break;
            case 'escape':
                this.closeModal();
                break;
        }
    }

    handlePlayerChoice(choice, player = 1) {
        if (this.gameState.isMultiplayer) {
            if (player === 1 && this.gameState.playerChoice) return;
            if (player === 2 && this.gameState.player2Choice) return;
            
            if (player === 1) {
                this.gameState.playerChoice = choice;
                this.updatePlayerDisplay();
            } else {
                this.gameState.player2Choice = choice;
                this.updatePlayer2Display();
            }
            
            this.playSound('choice');
            
            // Check if both players have made their choices
            if (this.gameState.playerChoice && this.gameState.player2Choice) {
                setTimeout(() => {
                    this.determineWinner();
                    this.updateGameHistory();
                    this.updateStats();
                    this.updateDisplay();
                    this.showResult();
                    this.checkAchievements();
                }, 1000);
            }
        } else {
            if (this.gameState.playerChoice) return; // Prevent multiple selections

            this.gameState.playerChoice = choice;
            this.updatePlayerDisplay();
            this.playSound('choice');
            
            // Add delay for dramatic effect
            setTimeout(() => {
                this.makeAIChoice();
                this.determineWinner();
                this.updateGameHistory();
                this.updateStats();
                this.updateDisplay();
                this.showResult();
                this.checkAchievements();
            }, 1000);
        }
    }

    makeAIChoice() {
        const strategy = this.getAIStrategy();
        let choice;

        switch(strategy) {
            case 'random':
                choice = this.getRandomChoice();
                break;
            case 'pattern':
                choice = this.getPatternBasedChoice();
                break;
            case 'counter':
                choice = this.getCounterChoice();
                break;
            case 'adaptive':
                choice = this.getAdaptiveChoice();
                break;
            case 'psychological':
                choice = this.getPsychologicalChoice();
                break;
            default:
                choice = this.getRandomChoice();
        }

        this.gameState.aiChoice = choice;
        this.updateAIDisplay();
        this.updateAIStats();
    }

    getAIStrategy() {
        const difficulty = this.gameState.aiDifficulty;
        const strategies = Object.keys(this.aiStrategies);
        
        if (difficulty <= 3) return 'random';
        if (difficulty <= 5) return 'pattern';
        if (difficulty <= 7) return 'counter';
        if (difficulty <= 9) return 'adaptive';
        return 'psychological';
    }

    getRandomChoice() {
        const choices = this.gameState.gameMode === 'lizard-spock' ? this.extendedChoices : this.choices;
        return choices[Math.floor(Math.random() * choices.length)];
    }

    getPatternBasedChoice() {
        if (this.gameState.playerPattern.length < 3) return this.getRandomChoice();
        
        // Analyze player's pattern
        const recentChoices = this.gameState.playerPattern.slice(-3);
        const mostFrequent = this.getMostFrequent(recentChoices);
        
        // Counter the most frequent choice
        return this.getCounterChoice(mostFrequent);
    }

    getCounterChoice(targetChoice = null) {
        const choice = targetChoice || this.gameState.playerChoice;
        
        if (this.gameState.gameMode === 'lizard-spock') {
            // Rock Paper Scissors Lizard Spock rules
            const counterMap = {
                rock: ['paper', 'spock'],
                paper: ['scissors', 'lizard'],
                scissors: ['rock', 'spock'],
                lizard: ['rock', 'scissors'],
                spock: ['paper', 'lizard']
            };
            const counters = counterMap[choice] || ['rock'];
            return counters[Math.floor(Math.random() * counters.length)];
        } else {
            const counterMap = {
                rock: 'paper',
                paper: 'scissors',
                scissors: 'rock'
            };
            return counterMap[choice];
        }
    }

    getAdaptiveChoice() {
        const playerWinRate = this.gameState.stats.wins / Math.max(this.gameState.stats.totalGames, 1);
        
        if (playerWinRate > 0.6) {
            // Player is winning too much, be more aggressive
            return this.getCounterChoice();
        } else if (playerWinRate < 0.4) {
            // Player is losing too much, be more random
            return this.getRandomChoice();
        } else {
            // Balanced, use pattern recognition
            return this.getPatternBasedChoice();
        }
    }

    getPsychologicalChoice() {
        // Advanced psychological warfare
        const lastPlayerChoice = this.gameState.playerPattern[this.gameState.playerPattern.length - 1];
        const lastAIChoice = this.gameState.aiPattern[this.gameState.aiPattern.length - 1];
        
        if (lastPlayerChoice && lastAIChoice) {
            // If AI won last time, player might try to counter AI's last choice
            const expectedPlayerChoice = this.getCounterChoice(lastAIChoice);
            return this.getCounterChoice(expectedPlayerChoice);
        }
        
        return this.getAdaptiveChoice();
    }

    getMostFrequent(array) {
        const counts = {};
        array.forEach(item => {
            counts[item] = (counts[item] || 0) + 1;
        });
        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    }

    determineWinner() {
        if (this.gameState.isMultiplayer) {
            const { playerChoice, player2Choice } = this.gameState;
            
            if (playerChoice === player2Choice) {
                this.gameState.result = 'tie';
            } else if (this.isWinningChoice(playerChoice, player2Choice)) {
                this.gameState.result = 'win'; // Player 1 wins
            } else {
                this.gameState.result = 'player2win'; // Player 2 wins
            }
        } else {
            const { playerChoice, aiChoice } = this.gameState;
            
            if (playerChoice === aiChoice) {
                this.gameState.result = 'tie';
            } else if (this.isWinningChoice(playerChoice, aiChoice)) {
                this.gameState.result = 'win';
            } else {
                this.gameState.result = 'loss';
            }

            // Update patterns for AI learning
            this.gameState.playerPattern.push(playerChoice);
            this.gameState.aiPattern.push(aiChoice);
            
            // Keep only last 10 choices for pattern analysis
            if (this.gameState.playerPattern.length > 10) {
                this.gameState.playerPattern.shift();
                this.gameState.aiPattern.shift();
            }
        }
    }

    isWinningChoice(choice1, choice2) {
        if (this.gameState.gameMode === 'lizard-spock') {
            const winMap = {
                rock: ['scissors', 'lizard'],
                paper: ['rock', 'spock'],
                scissors: ['paper', 'lizard'],
                lizard: ['spock', 'paper'],
                spock: ['scissors', 'rock']
            };
            return winMap[choice1] && winMap[choice1].includes(choice2);
        } else {
            return (
                (choice1 === 'rock' && choice2 === 'scissors') ||
                (choice1 === 'paper' && choice2 === 'rock') ||
                (choice1 === 'scissors' && choice2 === 'paper')
            );
        }
    }

    updatePlayerDisplay() {
        const display = document.getElementById('playerChoice');
        const choice = this.gameState.playerChoice;
        
        display.innerHTML = `
            <div class="choice-icon">${this.choiceIcons[choice]}</div>
            <div class="choice-text">${choice.charAt(0).toUpperCase() + choice.slice(1)}</div>
        `;
        display.classList.add('has-choice');
        
        // Add selection animation
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelector(`[data-choice="${choice}"]`).classList.add('selected');
    }

    updateAIDisplay() {
        const display = document.getElementById('aiChoice');
        const choice = this.gameState.aiChoice;
        
        if (choice) {
            display.innerHTML = `
                <div class="choice-icon">${this.choiceIcons[choice]}</div>
                <div class="choice-text">${choice.charAt(0).toUpperCase() + choice.slice(1)}</div>
            `;
            display.classList.add('has-choice');
        }
    }

    updatePlayer2Display() {
        const display = document.getElementById('player2Choice');
        const choice = this.gameState.player2Choice;
        
        if (choice) {
            display.innerHTML = `
                <div class="choice-icon">${this.choiceIcons[choice]}</div>
                <div class="choice-text">${choice.charAt(0).toUpperCase() + choice.slice(1)}</div>
            `;
            display.classList.add('has-choice');
        }
        
        // Add selection animation
        document.querySelectorAll('#player2Buttons .choice-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelector(`#player2Buttons [data-choice="${choice}"]`).classList.add('selected');
    }

    updateAIStats() {
        const strategy = this.getAIStrategy();
        const confidence = Math.min(85 + (this.gameState.aiDifficulty * 2), 95);
        
        document.getElementById('aiStrategy').textContent = this.aiStrategies[strategy];
        document.getElementById('aiConfidence').textContent = `${confidence}%`;
    }

    showResult() {
        const { result, playerChoice, aiChoice } = this.gameState;
        const resultDisplay = document.getElementById('resultDisplay');
        const playAgainBtn = document.getElementById('playAgainBtn');
        
        let resultText, resultSubtext, resultClass;
        
        switch(result) {
            case 'win':
                resultText = 'Victory! 🎉';
                resultSubtext = `Your ${playerChoice} beats AI's ${aiChoice}`;
                resultClass = 'win';
                this.playSound('win');
                break;
            case 'loss':
                resultText = 'Defeat! 😔';
                resultSubtext = `AI's ${aiChoice} beats your ${playerChoice}`;
                resultClass = 'loss';
                this.playSound('lose');
                break;
            case 'tie':
                resultText = 'It\'s a Tie! 🤝';
                resultSubtext = `Both chose ${playerChoice}`;
                resultClass = 'tie';
                break;
        }
        
        resultDisplay.innerHTML = `
            <div class="result-text ${resultClass}">${resultText}</div>
            <div class="result-subtext">${resultSubtext}</div>
        `;
        
        playAgainBtn.style.display = 'inline-flex';
        
        // Add result animation
        if (this.gameState.animationsEnabled) {
            resultDisplay.classList.add('fade-in');
        }
    }

    updateStats() {
        const { stats } = this.gameState;
        stats.totalGames++;
        
        switch(this.gameState.result) {
            case 'win':
                stats.wins++;
                // Award power-up occasionally on wins
                if (Math.random() < 0.3) {
                    this.awardRandomPowerup();
                }
                break;
            case 'player2win':
                stats.player2Wins++;
                break;
            case 'loss':
                stats.losses++;
                break;
            case 'tie':
                stats.ties++;
                break;
        }
        
        this.updateStatsDisplay();
        this.updateLeaderboard();
        this.saveGame();
    }

    updateStatsDisplay() {
        const { stats } = this.gameState;
        const winRate = stats.totalGames > 0 ? Math.round((stats.wins / stats.totalGames) * 100) : 0;
        
        document.getElementById('wins').textContent = stats.wins;
        document.getElementById('losses').textContent = stats.losses;
        document.getElementById('ties').textContent = stats.ties;
        document.getElementById('winRate').textContent = `${winRate}%`;
    }

    updateGameHistory() {
        const { playerChoice, aiChoice, result } = this.gameState;
        const timestamp = new Date().toLocaleTimeString();
        
        const historyItem = {
            timestamp,
            playerChoice,
            aiChoice,
            result
        };
        
        this.gameState.gameHistory.unshift(historyItem);
        
        // Keep only last 20 games
        if (this.gameState.gameHistory.length > 20) {
            this.gameState.gameHistory.pop();
        }
        
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const container = document.getElementById('gameHistory');
        
        if (this.gameState.gameHistory.length === 0) {
            container.innerHTML = '<div class="history-placeholder">No games played yet</div>';
            return;
        }
        
        container.innerHTML = this.gameState.gameHistory.map(item => `
            <div class="history-item ${item.result}">
                <div class="history-time">${item.timestamp}</div>
                <div class="history-choices">
                    <span class="history-choice">${this.choiceIcons[item.playerChoice]}</span>
                    <span class="history-vs">vs</span>
                    <span class="history-choice">${this.choiceIcons[item.aiChoice]}</span>
                </div>
                <div class="history-result ${item.result}">
                    ${item.result === 'win' ? '🎉' : item.result === 'loss' ? '😔' : '🤝'}
                </div>
            </div>
        `).join('');
    }

    resetGame() {
        this.gameState.playerChoice = null;
        this.gameState.player2Choice = null;
        this.gameState.aiChoice = null;
        this.gameState.result = null;
        this.gameState.activePowerup = null;
        
        // Reset displays
        document.getElementById('playerChoice').innerHTML = '<div class="choice-placeholder">Choose your weapon!</div>';
        document.getElementById('playerChoice').classList.remove('has-choice');
        
        if (this.gameState.isMultiplayer) {
            document.getElementById('player2Choice').innerHTML = '<div class="choice-placeholder">Waiting for choice...</div>';
            document.getElementById('player2Choice').classList.remove('has-choice');
        } else {
            document.getElementById('aiChoice').innerHTML = '<div class="choice-placeholder">AI is thinking...</div>';
            document.getElementById('aiChoice').classList.remove('has-choice');
        }
        
        // Reset result display
        const resultText = this.gameState.isMultiplayer ? 'Ready for battle?' : 'Ready to battle?';
        const subText = this.gameState.isMultiplayer ? 'Both players choose your weapons!' : 'Choose your weapon to begin!';
        
        document.getElementById('resultDisplay').innerHTML = `
            <div class="result-text">${resultText}</div>
            <div class="result-subtext">${subText}</div>
        `;
        
        // Hide play again button
        document.getElementById('playAgainBtn').style.display = 'none';
        
        // Remove selection from buttons
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        this.updateDisplay();
    }

    resetStats() {
        if (confirm('Are you sure you want to reset all statistics?')) {
            this.gameState.stats = { wins: 0, losses: 0, ties: 0, totalGames: 0 };
            this.gameState.gameHistory = [];
            this.gameState.playerPattern = [];
            this.gameState.aiPattern = [];
            this.updateStatsDisplay();
            this.updateHistoryDisplay();
            this.saveGame();
        }
    }

    changeGameMode(mode) {
        this.gameState.gameMode = mode;
        
        // Update active button
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
        
        // Apply mode-specific changes
        this.applyGameMode(mode);
    }

    applyGameMode(mode) {
        // Reset game state
        this.resetGame();
        
        // Hide/show appropriate sections
        const aiSection = document.getElementById('aiSection');
        const player2Section = document.getElementById('player2Section');
        const extendedChoices = document.querySelectorAll('.extended-choice');
        
        switch(mode) {
            case 'multiplayer':
                this.gameState.isMultiplayer = true;
                aiSection.style.display = 'none';
                player2Section.style.display = 'block';
                extendedChoices.forEach(btn => btn.style.display = 'none');
                break;
            case 'lizard-spock':
                this.gameState.isMultiplayer = false;
                aiSection.style.display = 'block';
                player2Section.style.display = 'none';
                extendedChoices.forEach(btn => btn.style.display = 'flex');
                // Also show extended choices for player 2 if in multiplayer
                const player2Extended = document.querySelectorAll('#player2Buttons .extended-choice');
                player2Extended.forEach(btn => btn.style.display = 'flex');
                break;
            case 'advanced':
                this.gameState.isMultiplayer = false;
                aiSection.style.display = 'block';
                player2Section.style.display = 'none';
                extendedChoices.forEach(btn => btn.style.display = 'none');
                this.enableAdvancedFeatures();
                break;
            case 'tournament':
                this.gameState.isMultiplayer = false;
                aiSection.style.display = 'block';
                player2Section.style.display = 'none';
                extendedChoices.forEach(btn => btn.style.display = 'none');
                this.enableTournamentMode();
                break;
            default:
                // Classic mode
                this.gameState.isMultiplayer = false;
                aiSection.style.display = 'block';
                player2Section.style.display = 'none';
                extendedChoices.forEach(btn => btn.style.display = 'none');
                this.disableAdvancedFeatures();
                break;
        }
    }

    enableAdvancedFeatures() {
        // Add advanced features like special moves, power-ups, etc.
        console.log('Advanced mode enabled');
    }

    enableTournamentMode() {
        // Add tournament features
        console.log('Tournament mode enabled');
    }

    disableAdvancedFeatures() {
        // Disable advanced features
        console.log('Classic mode enabled');
    }

    togglePanel() {
        const panel = document.getElementById('panelContent');
        const toggle = document.getElementById('panelToggle');
        
        if (panel.style.display === 'none') {
            panel.style.display = 'grid';
            toggle.innerHTML = '<span class="toggle-icon">⚙️</span>';
        } else {
            panel.style.display = 'none';
            toggle.innerHTML = '<span class="toggle-icon">⚙️</span>';
        }
    }

    playSound(type) {
        if (!this.gameState.soundEnabled) return;
        
        const audio = document.getElementById(`${type}Sound`);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    showModal(title, content) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalContent').innerHTML = content;
        document.getElementById('modalOverlay').classList.add('active');
    }

    closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
    }

    updateDisplay() {
        this.updateStatsDisplay();
        this.updateHistoryDisplay();
        this.updateAIStats();
    }

    initializeAI() {
        // Initialize AI with random strategy
        this.updateAIStats();
    }

    saveGame() {
        try {
            localStorage.setItem('ultimateRPS', JSON.stringify(this.gameState));
        } catch (e) {
            console.log('Failed to save game state:', e);
        }
    }

    loadGame() {
        try {
            const saved = localStorage.getItem('ultimateRPS');
            if (saved) {
                const savedState = JSON.parse(saved);
                this.gameState = { ...this.gameState, ...savedState };
            }
        } catch (e) {
            console.log('Failed to load game state:', e);
        }
    }

    // Advanced AI Methods
    analyzePlayerPattern() {
        if (this.gameState.playerPattern.length < 3) return null;
        
        const patterns = {
            rock: 0,
            paper: 0,
            scissors: 0
        };
        
        this.gameState.playerPattern.forEach(choice => {
            patterns[choice]++;
        });
        
        return patterns;
    }

    predictNextMove() {
        const patterns = this.analyzePlayerPattern();
        if (!patterns) return null;
        
        // Simple prediction based on frequency
        const total = Object.values(patterns).reduce((a, b) => a + b, 0);
        const probabilities = {};
        
        Object.keys(patterns).forEach(choice => {
            probabilities[choice] = patterns[choice] / total;
        });
        
        return probabilities;
    }

    // Utility Methods
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // New Methods for Enhanced Features

    changeTheme(theme) {
        this.gameState.currentTheme = theme;
        
        // Update active button
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
        
        // Apply theme
        this.applyTheme(theme);
        this.saveGame();
    }

    applyTheme(theme) {
        const root = document.documentElement;
        const themeColors = this.themes[theme].colors;
        
        root.style.setProperty('--primary-color', themeColors.primary);
        root.style.setProperty('--secondary-color', themeColors.secondary);
        
        // Add theme-specific classes
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${theme}`);
    }

    checkAchievements() {
        const achievements = [];
        
        // First win
        if (this.gameState.result === 'win' && this.gameState.stats.wins === 1) {
            achievements.push('first_win');
        }
        
        // Win streaks
        if (this.gameState.result === 'win') {
            this.gameState.stats.streaks.current++;
            if (this.gameState.stats.streaks.current > this.gameState.stats.streaks.best) {
                this.gameState.stats.streaks.best = this.gameState.stats.streaks.current;
            }
            
            if (this.gameState.stats.streaks.current === 5) {
                achievements.push('win_streak_5');
            }
            if (this.gameState.stats.streaks.current === 10) {
                achievements.push('win_streak_10');
            }
        } else if (this.gameState.result !== 'tie') {
            this.gameState.stats.streaks.current = 0;
        }
        
        // Total wins milestone
        if (this.gameState.stats.wins === 50) {
            achievements.push('total_wins_50');
        }
        
        // AI Master (beat AI on max difficulty)
        if (this.gameState.result === 'win' && this.gameState.aiDifficulty === 10) {
            achievements.push('ai_master');
        }
        
        // Lizard Spock master
        if (this.gameState.result === 'win' && this.gameState.gameMode === 'lizard-spock') {
            const lizardSpockWins = this.gameState.gameHistory.filter(game => 
                game.mode === 'lizard-spock' && game.result === 'win'
            ).length;
            if (lizardSpockWins === 10) {
                achievements.push('lizard_spock_master');
            }
        }
        
        // Unlock achievements
        achievements.forEach(achievementId => {
            this.unlockAchievement(achievementId);
        });
    }

    unlockAchievement(achievementId) {
        if (this.gameState.achievements.includes(achievementId)) return;
        
        this.gameState.achievements.push(achievementId);
        const achievement = this.achievementDefinitions.find(a => a.id === achievementId);
        
        if (achievement) {
            this.showAchievementNotification(achievement);
            this.updateAchievementsDisplay();
            this.saveGame();
        }
    }

    showAchievementNotification(achievement) {
        // Create achievement notification
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-text">
                <div class="achievement-title">Achievement Unlocked!</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    updateAchievementsDisplay() {
        const container = document.getElementById('achievementsContainer');
        
        if (this.gameState.achievements.length === 0) {
            container.innerHTML = '<div class="achievement-placeholder">Play games to unlock achievements!</div>';
            return;
        }
        
        const achievementElements = this.gameState.achievements.map(achievementId => {
            const achievement = this.achievementDefinitions.find(a => a.id === achievementId);
            return `
                <div class="achievement-item unlocked">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-info">
                        <div class="achievement-name">${achievement.name}</div>
                        <div class="achievement-desc">${achievement.description}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = achievementElements;
    }

    updateLeaderboard() {
        const score = this.calculateScore();
        const entry = {
            date: new Date().toLocaleDateString(),
            score: score,
            wins: this.gameState.stats.wins,
            winRate: Math.round((this.gameState.stats.wins / Math.max(this.gameState.stats.totalGames, 1)) * 100),
            bestStreak: this.gameState.stats.streaks.best
        };
        
        this.gameState.leaderboard.push(entry);
        this.gameState.leaderboard.sort((a, b) => b.score - a.score);
        this.gameState.leaderboard = this.gameState.leaderboard.slice(0, 10); // Keep top 10
        
        this.updateLeaderboardDisplay();
        this.saveGame();
    }

    calculateScore() {
        const { wins, totalGames, streaks } = this.gameState.stats;
        const winRate = wins / Math.max(totalGames, 1);
        return Math.round((wins * 10) + (winRate * 100) + (streaks.best * 5));
    }

    updateLeaderboardDisplay() {
        const container = document.getElementById('leaderboardContainer');
        
        if (this.gameState.leaderboard.length === 0) {
            container.innerHTML = '<div class="leaderboard-placeholder">No scores recorded yet</div>';
            return;
        }
        
        const leaderboardElements = this.gameState.leaderboard.map((entry, index) => `
            <div class="leaderboard-item ${index === 0 ? 'first-place' : ''}">
                <div class="leaderboard-rank">${index + 1}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-score">${entry.score} pts</div>
                    <div class="leaderboard-stats">${entry.wins}W | ${entry.winRate}% | ${entry.bestStreak} streak</div>
                    <div class="leaderboard-date">${entry.date}</div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = leaderboardElements;
    }

    // Power-up system
    usePowerup(type) {
        if (this.gameState.powerups[type] <= 0) return false;
        
        this.gameState.powerups[type]--;
        this.gameState.activePowerup = type;
        this.updatePowerupDisplay();
        
        return true;
    }

    updatePowerupDisplay() {
        document.getElementById('shieldCount').textContent = this.gameState.powerups.shield;
        document.getElementById('doubleStrikeCount').textContent = this.gameState.powerups.doubleStrike;
        document.getElementById('mindReadCount').textContent = this.gameState.powerups.mindRead;
    }

    awardRandomPowerup() {
        const powerupTypes = Object.keys(this.gameState.powerups);
        const randomType = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
        this.gameState.powerups[randomType]++;
        this.updatePowerupDisplay();
        
        // Show notification
        const powerupNames = { shield: 'Shield', doubleStrike: 'Double Strike', mindRead: 'Mind Read' };
        this.showNotification(`Power-up earned: ${powerupNames[randomType]}!`);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'game-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ultimateRPS = new UltimateRPS();
});

// Service Worker for PWA features (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Add some Easter eggs and fun features
document.addEventListener('DOMContentLoaded', () => {
    // Konami code easter egg
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            // Activate easter egg
            document.body.style.animation = 'rainbow 2s infinite';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 5000);
        }
    });
});

// Add rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);