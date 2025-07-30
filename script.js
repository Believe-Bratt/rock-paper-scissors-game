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
            particleEffects: true,
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
        this.addAmbientEffects();
    }

    setupEventListeners() {
        // Choice buttons with enhanced interactions
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handlePlayerChoice(e.target.closest('.choice-btn').dataset.choice);
                this.createButtonRipple(e);
            });
            
            // Add hover sound effect
            btn.addEventListener('mouseenter', () => {
                if (this.gameState.soundEnabled) {
                    this.playHoverSound();
                }
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
            this.createSliderParticles(e);
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

        // Add particle effects to various interactions
        this.addParticleListeners();
    }

    addParticleListeners() {
        // Add particles to stat items
        document.querySelectorAll('.stat-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                if (this.gameState.particleEffects) {
                    this.createStatParticles(item);
                }
            });
        });

        // Add particles to title
        const title = document.querySelector('.game-title');
        title.addEventListener('mouseenter', () => {
            if (this.gameState.particleEffects) {
                this.createTitleParticles();
            }
        });
    }

    createButtonRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    createSliderParticles(event) {
        if (!this.gameState.particleEffects) return;
        
        const slider = event.target;
        const rect = slider.getBoundingClientRect();
        const value = (event.target.value - event.target.min) / (event.target.max - event.target.min);
        const x = rect.left + (rect.width * value);
        const y = rect.top + rect.height / 2;

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createParticle(x, y, '#6366f1');
            }, i * 50);
        }
    }

    createStatParticles(element) {
        const rect = element.getBoundingClientRect();
        const colors = ['#10b981', '#f59e0b', '#ef4444', '#6366f1'];
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const x = rect.left + Math.random() * rect.width;
                const y = rect.top + Math.random() * rect.height;
                this.createParticle(x, y, colors[Math.floor(Math.random() * colors.length)]);
            }, i * 100);
        }
    }

    createTitleParticles() {
        const title = document.querySelector('.game-title');
        const rect = title.getBoundingClientRect();
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const x = rect.left + Math.random() * rect.width;
                const y = rect.top + Math.random() * rect.height;
                this.createParticle(x, y, colors[Math.floor(Math.random() * colors.length)]);
            }, i * 50);
        }
    }

    createParticle(x, y, color) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            animation: particleFloat 1s ease-out forwards;
        `;

        document.body.appendChild(particle);

        setTimeout(() => {
            document.body.removeChild(particle);
        }, 1000);
    }

    addAmbientEffects() {
        // Add floating particles in background
        if (this.gameState.particleEffects) {
            this.createAmbientParticles();
        }

        // Add subtle animations to UI elements
        this.addSubtleAnimations();
    }

    createAmbientParticles() {
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                this.createAmbientParticle();
            }, i * 2000);
        }
    }

    createAmbientParticle() {
        const particle = document.createElement('div');
        const size = Math.random() * 3 + 1;
        const x = Math.random() * window.innerWidth;
        const duration = Math.random() * 10 + 10;

        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: -10px;
            width: ${size}px;
            height: ${size}px;
            background: rgba(99, 102, 241, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            animation: ambientFloat ${duration}s linear infinite;
        `;

        document.body.appendChild(particle);

        setTimeout(() => {
            if (document.body.contains(particle)) {
                document.body.removeChild(particle);
            }
        }, duration * 1000);
    }

    addSubtleAnimations() {
        // Add breathing animation to title
        const title = document.querySelector('.game-title');
        title.style.animation = 'breathe 4s ease-in-out infinite';

        // Add subtle glow to choice buttons
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.animation = 'buttonGlow 0.3s ease-out';
            });
        });
    }

    playHoverSound() {
        // Create a subtle hover sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
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
            case ' ':
                // Skip countdown
                const countdown = document.getElementById('countdown');
                if (countdown && countdown.textContent !== '') {
                    document.dispatchEvent(new Event('click'));
                }
                break;
            case 'enter':
                this.resetGame();
                break;
        }
    }

    handlePlayerChoice(choice) {
        // Allow new choices even if game is in progress
        this.gameState.playerChoice = choice;
        this.updatePlayerDisplay();
        this.playSound('choice');
        
        // Create choice particles
        if (this.gameState.particleEffects) {
            this.createChoiceParticles(choice);
        }
        
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

    createChoiceParticles(choice) {
        const button = document.querySelector(`[data-choice="${choice}"]`);
        const rect = button.getBoundingClientRect();
        const colors = {
            rock: ['#ef4444', '#dc2626', '#b91c1c'],
            paper: ['#3b82f6', '#2563eb', '#1d4ed8'],
            scissors: ['#10b981', '#059669', '#047857']
        };

        const choiceColors = colors[choice];
        
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                const x = rect.left + Math.random() * rect.width;
                const y = rect.top + Math.random() * rect.height;
                const color = choiceColors[Math.floor(Math.random() * choiceColors.length)];
                this.createParticle(x, y, color);
            }, i * 50);
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
        
        // Add AI choice particles
        if (this.gameState.particleEffects) {
            this.createAIChoiceParticles(choice);
        }
    }

    createAIChoiceParticles(choice) {
        const aiDisplay = document.getElementById('aiChoice');
        const rect = aiDisplay.getBoundingClientRect();
        const colors = ['#6366f1', '#8b5cf6', '#a855f7'];
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const x = rect.left + Math.random() * rect.width;
                const y = rect.top + Math.random() * rect.height;
                const color = colors[Math.floor(Math.random() * colors.length)];
                this.createParticle(x, y, color);
            }, i * 100);
        }
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
        const playerPattern = this.gameState.playerPattern;
        if (playerPattern.length < 2) return this.getRandomChoice();
        
        // Look for patterns in player's behavior
        const lastChoice = playerPattern[playerPattern.length - 1];
        const secondLastChoice = playerPattern[playerPattern.length - 2];
        
        // If player repeats the same choice, counter it
        if (lastChoice === secondLastChoice) {
            return this.getCounterChoice(lastChoice);
        }
        
        // If player alternates between two choices, predict the next
        if (playerPattern.length >= 4) {
            const recent = playerPattern.slice(-4);
            if (recent[0] === recent[2] && recent[1] === recent[3]) {
                return this.getCounterChoice(recent[1]);
            }
        }
        
        // Default to adaptive strategy
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
        
        // Keep only last 10 choices
        if (this.gameState.playerPattern.length > 10) {
            this.gameState.playerPattern.shift();
        }
        if (this.gameState.aiPattern.length > 10) {
            this.gameState.aiPattern.shift();
        }
    }

    updatePlayerDisplay() {
        const playerChoice = document.getElementById('playerChoice');
        const choice = this.gameState.playerChoice;
        
        playerChoice.innerHTML = `
            <div class="choice-icon">${this.choiceIcons[choice]}</div>
            <div class="choice-text">${choice.charAt(0).toUpperCase() + choice.slice(1)}</div>
        `;
        playerChoice.classList.add('has-choice');
        
        // Add selection animation
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelector(`[data-choice="${choice}"]`).classList.add('selected');
    }

    updateAIDisplay() {
        const aiChoice = document.getElementById('aiChoice');
        const choice = this.gameState.aiChoice;
        
        aiChoice.innerHTML = `
            <div class="choice-icon">${this.choiceIcons[choice]}</div>
            <div class="choice-text">${choice.charAt(0).toUpperCase() + choice.slice(1)}</div>
        `;
        aiChoice.classList.add('has-choice');
    }

    updateAIStats() {
        const strategy = this.getAIStrategy();
        const confidence = Math.floor(Math.random() * 20) + 80; // 80-100%
        
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
                this.createVictoryParticles();
                break;
            case 'loss':
                resultText = 'Defeat! 😔';
                resultSubtext = `AI's ${aiChoice} beats your ${playerChoice}`;
                resultClass = 'loss';
                this.playSound('lose');
                this.createDefeatParticles();
                break;
            case 'tie':
                resultText = 'It\'s a Tie! 🤝';
                resultSubtext = `Both chose ${playerChoice}`;
                resultClass = 'tie';
                this.createTieParticles();
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

    createVictoryParticles() {
        if (!this.gameState.particleEffects) return;
        
        const resultDisplay = document.getElementById('resultDisplay');
        const rect = resultDisplay.getBoundingClientRect();
        const colors = ['#10b981', '#fbbf24', '#f59e0b', '#ef4444'];
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const x = rect.left + Math.random() * rect.width;
                const y = rect.top + Math.random() * rect.height;
                const color = colors[Math.floor(Math.random() * colors.length)];
                this.createParticle(x, y, color);
            }, i * 100);
        }
    }

    createDefeatParticles() {
        if (!this.gameState.particleEffects) return;
        
        const resultDisplay = document.getElementById('resultDisplay');
        const rect = resultDisplay.getBoundingClientRect();
        const colors = ['#6b7280', '#374151', '#1f2937'];
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const x = rect.left + Math.random() * rect.width;
                const y = rect.top + Math.random() * rect.height;
                const color = colors[Math.floor(Math.random() * colors.length)];
                this.createParticle(x, y, color);
            }, i * 150);
        }
    }

    createTieParticles() {
        if (!this.gameState.particleEffects) return;
        
        const resultDisplay = document.getElementById('resultDisplay');
        const rect = resultDisplay.getBoundingClientRect();
        const colors = ['#6366f1', '#8b5cf6', '#a855f7'];
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const x = rect.left + Math.random() * rect.width;
                const y = rect.top + Math.random() * rect.height;
                const color = colors[Math.floor(Math.random() * colors.length)];
                this.createParticle(x, y, color);
            }, i * 120);
        }
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
        
        // Add stat update animation
        if (this.gameState.animationsEnabled) {
            this.animateStatUpdate();
        }
    }

    animateStatUpdate() {
        const statValues = document.querySelectorAll('.stat-value');
        statValues.forEach(value => {
            value.style.animation = 'statPulse 0.5s ease-out';
            setTimeout(() => {
                value.style.animation = '';
            }, 500);
        });
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
                <div class="history-result">${item.result.toUpperCase()}</div>
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
            playerChoice.innerHTML = '<div class="choice-placeholder">Choose your weapon! ⚔️</div>';
            playerChoice.classList.remove('has-choice');
            playerChoice.style.opacity = '1';
            
            // Reset AI display
            aiChoice.innerHTML = '<div class="choice-placeholder">AI is thinking... 🤔</div>';
            aiChoice.classList.remove('has-choice');
            aiChoice.style.opacity = '1';
            
            // Reset result display
            resultDisplay.innerHTML = `
                <div class="result-text">Ready to battle? 🚀</div>
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
            
            // Add reset animation
            if (this.gameState.animationsEnabled) {
                this.createResetParticles();
            }
        }
    }

    createResetParticles() {
        const resetBtn = document.getElementById('resetBtn');
        const rect = resetBtn.getBoundingClientRect();
        const colors = ['#ef4444', '#dc2626', '#b91c1c'];
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const x = rect.left + Math.random() * rect.width;
                const y = rect.top + Math.random() * rect.height;
                const color = colors[Math.floor(Math.random() * colors.length)];
                this.createParticle(x, y, color);
            }, i * 80);
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
        
        // Add mode change particles
        if (this.gameState.particleEffects) {
            this.createModeChangeParticles(mode);
        }
    }

    createModeChangeParticles(mode) {
        const modeBtn = document.querySelector(`[data-mode="${mode}"]`);
        const rect = modeBtn.getBoundingClientRect();
        const colors = {
            classic: ['#6366f1', '#4f46e5'],
            advanced: ['#ec4899', '#db2777'],
            tournament: ['#f59e0b', '#d97706']
        };
        
        const modeColors = colors[mode] || colors.classic;
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const x = rect.left + Math.random() * rect.width;
                const y = rect.top + Math.random() * rect.height;
                const color = modeColors[Math.floor(Math.random() * modeColors.length)];
                this.createParticle(x, y, color);
            }, i * 100);
        }
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
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    updateDisplay() {
        this.updateStatsDisplay();
        this.updateHistoryDisplay();
    }

    initializeAI() {
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

    analyzePlayerPattern() {
        const pattern = this.gameState.playerPattern;
        if (pattern.length < 3) return null;
        
        const counts = {};
        pattern.forEach(choice => {
            counts[choice] = (counts[choice] || 0) + 1;
        });
        
        return counts;
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
    
    @keyframes ripple {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(4); opacity: 0; }
    }
    
    @keyframes particleFloat {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-100px) scale(0); opacity: 0; }
    }
    
    @keyframes ambientFloat {
        0% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
        50% { transform: translateY(-50vh) rotate(180deg); opacity: 0.6; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }
    
    @keyframes breathe {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
    }
    
    @keyframes statPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);