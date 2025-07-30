// Ultimate Rock Paper Scissors - Advanced Edition
// Advanced JavaScript with AI, animations, and modern features

class UltimateRPS {
    constructor() {
        this.gameState = {
            playerChoice: null,
            aiChoice: null,
            result: null,
            gameMode: 'classic',
            aiDifficulty: 5,
            animationsEnabled: true,
            soundEnabled: true,
            quickPlayMode: false,
            stats: {
                wins: 0,
                losses: 0,
                ties: 0,
                totalGames: 0
            },
            gameHistory: [],
            aiPattern: [],
            playerPattern: []
        };

        this.choices = ['rock', 'paper', 'scissors'];
        this.choiceIcons = {
            rock: '🪨',
            paper: '📄',
            scissors: '✂️'
        };

        this.aiStrategies = {
            random: 'Random',
            pattern: 'Pattern Recognition',
            counter: 'Counter Strategy',
            adaptive: 'Adaptive Learning',
            psychological: 'Psychological Warfare'
        };

        this.init();
    }

    init() {
        this.loadGame();
        this.setupEventListeners();
        this.hideLoadingScreen();
        this.updateDisplay();
        this.initializeAI();
        this.initializePWA();
    }

    setupEventListeners() {
        // Choice buttons
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handlePlayerChoice(e.target.closest('.choice-btn').dataset.choice));
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

        // Quick play mode
        document.getElementById('enableQuickPlay').addEventListener('change', (e) => {
            this.gameState.quickPlayMode = e.target.checked;
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
                this.handlePlayerChoice('rock');
                break;
            case 'p':
                this.handlePlayerChoice('paper');
                break;
            case 's':
                this.handlePlayerChoice('scissors');
                break;
            case 'enter':
                if (this.gameState.result) this.resetGame();
                break;
            case 'escape':
                this.closeModal();
                break;
        }
    }

    handlePlayerChoice(choice) {
        // Allow new choices even if game is in progress
        this.gameState.playerChoice = choice;
        this.updatePlayerDisplay();
        this.playSound('choice');
        
        // Remove ready state from buttons
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.classList.remove('ready');
        });
        
        // Add delay for dramatic effect (shorter in quick play mode)
        const delay = this.gameState.quickPlayMode ? 300 : 1000;
        setTimeout(() => {
            this.makeAIChoice();
            this.determineWinner();
            this.updateGameHistory();
            this.updateStats();
            this.updateDisplay();
            this.showResult();
            
            // Auto-restart after showing result (shorter in quick play mode)
            const restartDelay = this.gameState.quickPlayMode ? 1500 : 3000;
            setTimeout(() => {
                this.resetGame();
            }, restartDelay);
        }, delay);
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
        return this.choices[Math.floor(Math.random() * this.choices.length)];
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
        const counterMap = {
            rock: 'paper',
            paper: 'scissors',
            scissors: 'rock'
        };
        return counterMap[choice];
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
        const { playerChoice, aiChoice } = this.gameState;
        
        if (playerChoice === aiChoice) {
            this.gameState.result = 'tie';
        } else if (
            (playerChoice === 'rock' && aiChoice === 'scissors') ||
            (playerChoice === 'paper' && aiChoice === 'rock') ||
            (playerChoice === 'scissors' && aiChoice === 'paper')
        ) {
            this.gameState.result = 'win';
        } else {
            this.gameState.result = 'loss';
        }

        // Update patterns
        this.gameState.playerPattern.push(playerChoice);
        this.gameState.aiPattern.push(aiChoice);
        
        // Keep only last 10 choices for pattern analysis
        if (this.gameState.playerPattern.length > 10) {
            this.gameState.playerPattern.shift();
            this.gameState.aiPattern.shift();
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
                this.addConfetti();
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
        
        const countdownText = this.gameState.quickPlayMode ? '1' : '3';
        resultDisplay.innerHTML = `
            <div class="result-text ${resultClass}">${resultText}</div>
            <div class="result-subtext">${resultSubtext}</div>
            <div class="auto-restart-countdown">Next round in <span id="countdown">${countdownText}</span>...</div>
        `;
        
        playAgainBtn.style.display = 'inline-flex';
        
        // Add result animation
        if (this.gameState.animationsEnabled) {
            resultDisplay.classList.add('fade-in');
        }
        
        // Start countdown
        this.startCountdown();
    }

    updateStats() {
        const { stats } = this.gameState;
        stats.totalGames++;
        
        switch(this.gameState.result) {
            case 'win':
                stats.wins++;
                break;
            case 'loss':
                stats.losses++;
                break;
            case 'tie':
                stats.ties++;
                break;
        }
        
        this.updateStatsDisplay();
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
        // Clear game state
        this.gameState.playerChoice = null;
        this.gameState.aiChoice = null;
        this.gameState.result = null;
        
        // Reset displays with smooth transitions
        const playerChoice = document.getElementById('playerChoice');
        const aiChoice = document.getElementById('aiChoice');
        const resultDisplay = document.getElementById('resultDisplay');
        
        // Add fade out effect
        playerChoice.style.opacity = '0.5';
        aiChoice.style.opacity = '0.5';
        resultDisplay.style.opacity = '0.5';
        
        setTimeout(() => {
            // Reset player display
            playerChoice.innerHTML = '<div class="choice-placeholder">Choose your weapon!</div>';
            playerChoice.classList.remove('has-choice');
            playerChoice.style.opacity = '1';
            
            // Reset AI display
            aiChoice.innerHTML = '<div class="choice-placeholder">AI is thinking...</div>';
            aiChoice.classList.remove('has-choice');
            aiChoice.style.opacity = '1';
            
            // Reset result display
            resultDisplay.innerHTML = `
                <div class="result-text">Ready to battle?</div>
                <div class="result-subtext">Choose your weapon to begin!</div>
            `;
            resultDisplay.style.opacity = '1';
            
            // Hide play again button
            document.getElementById('playAgainBtn').style.display = 'none';
            
                    // Remove selection from buttons and add ready state
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.classList.remove('selected');
            btn.classList.add('ready');
        });
            
            this.updateDisplay();
        }, 200);
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
        switch(mode) {
            case 'advanced':
                // Enable advanced features
                this.enableAdvancedFeatures();
                break;
            case 'tournament':
                // Enable tournament mode
                this.enableTournamentMode();
                break;
            default:
                // Classic mode
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

    startCountdown() {
        let count = this.gameState.quickPlayMode ? 1 : 3;
        const countdownElement = document.getElementById('countdown');
        let countdownInterval;
        
        // Function to clear countdown and reset game
        const clearCountdown = () => {
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
            this.resetGame();
        };
        
        // Allow skipping countdown with click or key press
        const skipCountdown = () => {
            clearCountdown();
            document.removeEventListener('click', skipCountdown);
            document.removeEventListener('keydown', skipCountdown);
        };
        
        document.addEventListener('click', skipCountdown);
        document.addEventListener('keydown', skipCountdown);
        
        const interval = this.gameState.quickPlayMode ? 1000 : 1000;
        countdownInterval = setInterval(() => {
            count--;
            if (countdownElement) {
                countdownElement.textContent = count;
            }
            
            if (count <= 0) {
                clearCountdown();
            }
        }, interval);
    }

    initializePWA() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                    this.checkForUpdates(registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        }

        // Handle install prompt
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallPrompt();
        });

        // Handle install button click
        document.getElementById('installBtn')?.addEventListener('click', () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    }
                    deferredPrompt = null;
                    this.hideInstallPrompt();
                });
            }
        });

        // Handle install close button
        document.getElementById('installClose')?.addEventListener('click', () => {
            this.hideInstallPrompt();
        });

        // Handle app installed
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.hideInstallPrompt();
        });
    }

    showInstallPrompt() {
        const prompt = document.getElementById('installPrompt');
        if (prompt) {
            prompt.style.display = 'block';
            setTimeout(() => {
                prompt.style.display = 'none';
            }, 10000); // Auto-hide after 10 seconds
        }
    }

    hideInstallPrompt() {
        const prompt = document.getElementById('installPrompt');
        if (prompt) {
            prompt.style.display = 'none';
        }
    }

    checkForUpdates(registration) {
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    this.showUpdateNotification();
                }
            });
        });
    }

    showUpdateNotification() {
        if (confirm('A new version is available! Would you like to update?')) {
            window.location.reload();
        }
    }

    // Enhanced game features
    addConfetti() {
        if (!this.gameState.animationsEnabled) return;
        
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                this.createConfetti(colors[Math.floor(Math.random() * colors.length)]);
            }, i * 10);
        }
    }

    createConfetti(color) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = color;
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.animation = 'confettiFall 3s linear forwards';
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            document.body.removeChild(confetti);
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