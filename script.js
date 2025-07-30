// Advanced Rock Paper Scissors Game
class RPSArena {
    constructor() {
        this.gameState = {
            playerScore: 0,
            aiScore: 0,
            currentRound: 1,
            gameActive: true,
            playerStreak: 0,
            aiStreak: 0,
            autoPlay: false,
            roundLimit: 10
        };

        this.choices = ['rock', 'paper', 'scissors'];
        this.choiceIcons = {
            rock: 'fas fa-hand-rock',
            paper: 'fas fa-hand-paper',
            scissors: 'fas fa-hand-scissors'
        };

        this.currentMode = 'classic';
        this.settings = this.loadSettings();
        this.statistics = this.loadStatistics();
        this.ai = new AISystem();
        this.particles = new ParticleSystem();
        this.sounds = new SoundSystem();
        this.achievements = new AchievementSystem();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUI();
        this.particles.init();
        this.sounds.init();
        this.applyTheme();
        this.updateStatistics();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchMode(e.target.dataset.mode));
        });

        // Choice buttons
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.makeChoice(e.currentTarget.dataset.choice));
        });

        // Control buttons
        document.getElementById('reset-game').addEventListener('click', () => this.resetGame());
        document.getElementById('auto-play').addEventListener('click', () => this.toggleAutoPlay());
        document.getElementById('ai-difficulty').addEventListener('change', (e) => this.ai.setDifficulty(e.target.value));

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());

        // Tournament
        document.getElementById('start-tournament').addEventListener('click', () => this.startTournament());
        document.getElementById('tournament-size').addEventListener('change', (e) => this.updateTournamentSize(e.target.value));

        // AI Battle
        document.getElementById('start-ai-battle').addEventListener('click', () => this.startAIBattle());

        // Settings
        document.getElementById('particle-effects').addEventListener('change', (e) => this.updateSetting('particles', e.target.checked));
        document.getElementById('sound-effects').addEventListener('change', (e) => this.updateSetting('sounds', e.target.checked));
        document.getElementById('animations').addEventListener('change', (e) => this.updateSetting('animations', e.target.checked));
        document.getElementById('round-limit').addEventListener('change', (e) => this.updateSetting('roundLimit', parseInt(e.target.value)));
        document.getElementById('countdown-timer').addEventListener('change', (e) => this.updateSetting('countdown', parseInt(e.target.value)));
        document.getElementById('export-stats').addEventListener('click', () => this.exportStatistics());
        document.getElementById('clear-stats').addEventListener('click', () => this.clearStatistics());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Auto-play interval
        this.autoPlayInterval = null;
    }

    switchMode(mode) {
        if (mode === this.currentMode) return;

        this.currentMode = mode;
        
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

        // Update game modes
        document.querySelectorAll('.game-mode').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${mode}-mode`).classList.add('active');

        // Mode-specific initialization
        if (mode === 'statistics') {
            this.renderStatistics();
        } else if (mode === 'ai-battle') {
            this.initAIBattle();
        } else if (mode === 'tournament') {
            this.initTournament();
        }
    }

    async makeChoice(playerChoice) {
        if (!this.gameState.gameActive) return;

        this.gameState.gameActive = false;
        
        // Show countdown if enabled
        if (this.settings.countdown > 0) {
            await this.showCountdown();
        }

        // Get AI choice
        const aiChoice = this.ai.makeChoice(playerChoice, this.statistics.playerChoices);
        
        // Update AI name
        document.getElementById('ai-name').textContent = this.ai.getCurrentAIName();

        // Play battle animation
        await this.playBattleAnimation();

        // Determine winner
        const result = this.determineWinner(playerChoice, aiChoice);

        // Update displays
        this.updateChoiceDisplays(playerChoice, aiChoice);
        this.updateResult(result);
        this.updateScores(result);
        this.updateRound();

        // Update statistics
        this.updateGameStatistics(playerChoice, aiChoice, result);

        // Play sounds and effects
        this.sounds.play(result);
        this.particles.burst(result);

        // Check achievements
        this.achievements.check(this.gameState, this.statistics);

        // Check game end
        if (this.checkGameEnd()) {
            this.endGame();
            return;
        }

        // Auto-play next round
        if (this.gameState.autoPlay) {
            setTimeout(() => {
                this.makeChoice(this.getRandomChoice());
            }, 2000);
        } else {
            this.gameState.gameActive = true;
        }
    }

    async showCountdown() {
        const countdownEl = document.getElementById('countdown');
        let count = this.settings.countdown;

        return new Promise(resolve => {
            const interval = setInterval(() => {
                countdownEl.textContent = count;
                countdownEl.style.display = 'block';
                
                if (count <= 0) {
                    countdownEl.style.display = 'none';
                    clearInterval(interval);
                    resolve();
                } else {
                    count--;
                }
            }, 1000);
        });
    }

    async playBattleAnimation() {
        const animationEl = document.getElementById('battle-animation');
        animationEl.classList.add('active');
        
        return new Promise(resolve => {
            setTimeout(() => {
                animationEl.classList.remove('active');
                resolve();
            }, 1000);
        });
    }

    determineWinner(playerChoice, aiChoice) {
        if (playerChoice === aiChoice) return 'draw';
        
        const winConditions = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };

        return winConditions[playerChoice] === aiChoice ? 'win' : 'lose';
    }

    updateChoiceDisplays(playerChoice, aiChoice) {
        const playerDisplay = document.getElementById('player-choice-display');
        const aiDisplay = document.getElementById('ai-choice-display');

        // Update player choice
        playerDisplay.innerHTML = `<i class="${this.choiceIcons[playerChoice]}"></i>`;
        playerDisplay.className = `choice-display ${playerChoice} animate`;

        // Update AI choice
        aiDisplay.innerHTML = `<i class="${this.choiceIcons[aiChoice]}"></i>`;
        aiDisplay.className = `choice-display ${aiChoice} animate`;
    }

    updateResult(result) {
        const resultEl = document.getElementById('result-display');
        const messages = {
            win: 'You Win!',
            lose: 'AI Wins!',
            draw: "It's a Draw!"
        };

        resultEl.textContent = messages[result];
        resultEl.className = `result-display ${result}`;
    }

    updateScores(result) {
        if (result === 'win') {
            this.gameState.playerScore++;
            this.gameState.playerStreak++;
            this.gameState.aiStreak = 0;
        } else if (result === 'lose') {
            this.gameState.aiScore++;
            this.gameState.aiStreak++;
            this.gameState.playerStreak = 0;
        } else {
            this.gameState.playerStreak = 0;
            this.gameState.aiStreak = 0;
        }

        document.getElementById('player-score').textContent = this.gameState.playerScore;
        document.getElementById('ai-score').textContent = this.gameState.aiScore;

        // Update streaks
        this.updateStreaks();
    }

    updateStreaks() {
        const playerStreakEl = document.getElementById('player-streak');
        const aiStreakEl = document.getElementById('ai-streak');

        playerStreakEl.textContent = this.gameState.playerStreak > 1 ? `🔥 ${this.gameState.playerStreak} win streak!` : '';
        aiStreakEl.textContent = this.gameState.aiStreak > 1 ? `🔥 ${this.gameState.aiStreak} win streak!` : '';
    }

    updateRound() {
        this.gameState.currentRound++;
        document.getElementById('current-round').textContent = this.gameState.currentRound;
    }

    checkGameEnd() {
        if (this.settings.roundLimit === 0) return false;
        return this.gameState.currentRound > this.settings.roundLimit;
    }

    endGame() {
        this.gameState.gameActive = false;
        this.gameState.autoPlay = false;
        
        const winner = this.gameState.playerScore > this.gameState.aiScore ? 'Player' : 
                      this.gameState.aiScore > this.gameState.playerScore ? 'AI' : 'Tie';
        
        this.achievements.checkEndGame(winner, this.gameState);
        
        setTimeout(() => {
            if (confirm(`Game Over! ${winner === 'Tie' ? "It's a tie!" : winner + ' wins!'} Play again?`)) {
                this.resetGame();
            }
        }, 1000);
    }

    resetGame() {
        this.gameState = {
            playerScore: 0,
            aiScore: 0,
            currentRound: 1,
            gameActive: true,
            playerStreak: 0,
            aiStreak: 0,
            autoPlay: false,
            roundLimit: this.settings.roundLimit
        };

        this.ai.reset();
        this.updateUI();
    }

    toggleAutoPlay() {
        this.gameState.autoPlay = !this.gameState.autoPlay;
        const btn = document.getElementById('auto-play');
        
        if (this.gameState.autoPlay) {
            btn.innerHTML = '<i class="fas fa-pause"></i> Auto Play';
            btn.classList.add('active');
            if (this.gameState.gameActive) {
                this.makeChoice(this.getRandomChoice());
            }
        } else {
            btn.innerHTML = '<i class="fas fa-play"></i> Auto Play';
            btn.classList.remove('active');
        }
    }

    getRandomChoice() {
        return this.choices[Math.floor(Math.random() * this.choices.length)];
    }

    updateUI() {
        document.getElementById('player-score').textContent = this.gameState.playerScore;
        document.getElementById('ai-score').textContent = this.gameState.aiScore;
        document.getElementById('current-round').textContent = this.gameState.currentRound;
        
        // Reset displays
        document.getElementById('player-choice-display').innerHTML = '<i class="fas fa-question"></i>';
        document.getElementById('ai-choice-display').innerHTML = '<i class="fas fa-question"></i>';
        document.getElementById('result-display').textContent = '';
        document.getElementById('result-display').className = 'result-display';
        
        this.updateStreaks();
    }

    handleKeyboard(e) {
        if (this.currentMode !== 'classic' || !this.gameState.gameActive) return;

        const keyMappings = {
            'KeyR': 'rock',
            'KeyP': 'paper',
            'KeyS': 'scissors',
            'Space': 'random'
        };

        if (keyMappings[e.code]) {
            e.preventDefault();
            const choice = keyMappings[e.code] === 'random' ? this.getRandomChoice() : keyMappings[e.code];
            this.makeChoice(choice);
        }
    }

    // Statistics Methods
    updateGameStatistics(playerChoice, aiChoice, result) {
        this.statistics.totalGames++;
        this.statistics.playerChoices[playerChoice]++;
        this.statistics.aiChoices[aiChoice]++;
        this.statistics.results[result]++;
        
        if (this.gameState.playerStreak > this.statistics.bestStreak) {
            this.statistics.bestStreak = this.gameState.playerStreak;
        }

        this.statistics.gameHistory.push({
            round: this.gameState.currentRound - 1,
            playerChoice,
            aiChoice,
            result,
            timestamp: Date.now()
        });

        // Keep only last 100 games
        if (this.statistics.gameHistory.length > 100) {
            this.statistics.gameHistory = this.statistics.gameHistory.slice(-100);
        }

        this.saveStatistics();
    }

    renderStatistics() {
        const stats = this.statistics;
        
        document.getElementById('total-games').textContent = stats.totalGames;
        document.getElementById('win-rate').textContent = 
            stats.totalGames > 0 ? Math.round((stats.results.win / stats.totalGames) * 100) + '%' : '0%';
        document.getElementById('best-streak').textContent = stats.bestStreak;
        
        // Favorite choice
        const choices = Object.entries(stats.playerChoices);
        const favoriteChoice = choices.reduce((a, b) => stats.playerChoices[a[0]] > stats.playerChoices[b[0]] ? a : b, ['rock', 0]);
        document.getElementById('favorite-choice').textContent = 
            favoriteChoice[1] > 0 ? favoriteChoice[0].charAt(0).toUpperCase() + favoriteChoice[0].slice(1) : '-';

        this.renderCharts();
    }

    renderCharts() {
        this.renderChoiceChart();
        this.renderPerformanceChart();
    }

    renderChoiceChart() {
        const canvas = document.getElementById('choice-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = [
            this.statistics.playerChoices.rock,
            this.statistics.playerChoices.paper,
            this.statistics.playerChoices.scissors
        ];
        
        this.drawPieChart(ctx, data, ['Rock', 'Paper', 'Scissors'], ['#ff6b6b', '#fce38a', '#4ecdc4']);
    }

    renderPerformanceChart() {
        const canvas = document.getElementById('performance-timeline');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const history = this.statistics.gameHistory.slice(-20); // Last 20 games
        
        this.drawLineChart(ctx, history);
    }

    drawPieChart(ctx, data, labels, colors) {
        const canvas = ctx.canvas;
        canvas.width = 300;
        canvas.height = 300;
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        
        const total = data.reduce((sum, value) => sum + value, 0);
        if (total === 0) {
            ctx.fillStyle = '#666';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No data available', centerX, centerY);
            return;
        }
        
        let currentAngle = 0;
        
        data.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[index];
            ctx.fill();
            
            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
            const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
            
            ctx.fillStyle = '#fff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${labels[index]}: ${value}`, labelX, labelY);
            
            currentAngle += sliceAngle;
        });
    }

    drawLineChart(ctx, history) {
        const canvas = ctx.canvas;
        canvas.width = 400;
        canvas.height = 200;
        
        if (history.length === 0) {
            ctx.fillStyle = '#666';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
            return;
        }

        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        
        // Calculate win rate over time
        let wins = 0;
        const winRates = history.map((game, index) => {
            if (game.result === 'win') wins++;
            return wins / (index + 1);
        });
        
        // Draw axes
        ctx.strokeStyle = '#666';
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.stroke();
        
        // Draw line
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        winRates.forEach((rate, index) => {
            const x = padding + (index / (winRates.length - 1)) * chartWidth;
            const y = padding + chartHeight - (rate * chartHeight);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw points
        ctx.fillStyle = '#667eea';
        winRates.forEach((rate, index) => {
            const x = padding + (index / (winRates.length - 1)) * chartWidth;
            const y = padding + chartHeight - (rate * chartHeight);
            
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    // Tournament Methods
    initTournament() {
        // Initialize tournament bracket display
        this.renderTournamentBracket();
    }

    startTournament() {
        const size = parseInt(document.getElementById('tournament-size').value);
        this.runTournament(size);
    }

    updateTournamentSize(size) {
        this.renderTournamentBracket(parseInt(size));
    }

    renderTournamentBracket(size = 8) {
        const container = document.getElementById('bracket-container');
        container.innerHTML = `
            <div class="tournament-info">
                <h3>Tournament Setup</h3>
                <p>Select ${size} players tournament and click "Start Tournament" to begin!</p>
                <div class="tournament-participants">
                    <div class="participant">👤 You</div>
                    ${Array.from({length: size - 1}, (_, i) => 
                        `<div class="participant">🤖 AI ${i + 1}</div>`
                    ).join('')}
                </div>
            </div>
        `;
    }

    async runTournament(size) {
        // Tournament implementation would go here
        // This is a simplified version
        const container = document.getElementById('bracket-container');
        container.innerHTML = '<div class="tournament-progress">Tournament mode coming in future update!</div>';
    }

    // AI Battle Methods
    initAIBattle() {
        this.updateAIStats();
    }

    updateAIStats() {
        const ai1Stats = document.getElementById('ai1-stats');
        const ai2Stats = document.getElementById('ai2-stats');
        
        ai1Stats.innerHTML = `
            <div>Strategy: Pattern Recognition</div>
            <div>Difficulty: Adaptive</div>
            <div>Win Rate: 67%</div>
        `;
        
        ai2Stats.innerHTML = `
            <div>Strategy: Counter Play</div>
            <div>Difficulty: Hard</div>
            <div>Win Rate: 71%</div>
        `;
    }

    startAIBattle() {
        const resultsEl = document.getElementById('ai-battle-results');
        resultsEl.classList.add('active');
        resultsEl.innerHTML = '<div class="battle-progress">AI Battle mode coming in future update!</div>';
    }

    // Settings Methods
    updateSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
        this.applySettings();
    }

    applySettings() {
        this.particles.setEnabled(this.settings.particles);
        this.sounds.setEnabled(this.settings.sounds);
        
        if (this.settings.animations) {
            document.body.classList.remove('no-animations');
        } else {
            document.body.classList.add('no-animations');
        }
        
        this.gameState.roundLimit = this.settings.roundLimit;
    }

    toggleTheme() {
        const body = document.body;
        const icon = document.querySelector('#theme-toggle i');
        
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            icon.className = 'fas fa-moon';
            this.settings.theme = 'dark';
        } else {
            body.classList.add('light-theme');
            icon.className = 'fas fa-sun';
            this.settings.theme = 'light';
        }
        
        this.saveSettings();
    }

    applyTheme() {
        if (this.settings.theme === 'light') {
            document.body.classList.add('light-theme');
            document.querySelector('#theme-toggle i').className = 'fas fa-sun';
        }
    }

    exportStatistics() {
        const data = {
            statistics: this.statistics,
            settings: this.settings,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rps-arena-stats.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    clearStatistics() {
        if (confirm('Are you sure you want to clear all statistics? This cannot be undone.')) {
            this.statistics = this.getDefaultStatistics();
            this.saveStatistics();
            this.renderStatistics();
        }
    }

    // Data Management
    loadSettings() {
        const defaultSettings = {
            particles: true,
            sounds: true,
            animations: true,
            roundLimit: 10,
            countdown: 5,
            theme: 'dark'
        };
        
        try {
            const saved = localStorage.getItem('rps-arena-settings');
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch {
            return defaultSettings;
        }
    }

    saveSettings() {
        localStorage.setItem('rps-arena-settings', JSON.stringify(this.settings));
    }

    loadStatistics() {
        try {
            const saved = localStorage.getItem('rps-arena-statistics');
            return saved ? JSON.parse(saved) : this.getDefaultStatistics();
        } catch {
            return this.getDefaultStatistics();
        }
    }

    saveStatistics() {
        localStorage.setItem('rps-arena-statistics', JSON.stringify(this.statistics));
    }

    getDefaultStatistics() {
        return {
            totalGames: 0,
            playerChoices: { rock: 0, paper: 0, scissors: 0 },
            aiChoices: { rock: 0, paper: 0, scissors: 0 },
            results: { win: 0, lose: 0, draw: 0 },
            bestStreak: 0,
            gameHistory: []
        };
    }

    updateStatistics() {
        // Update settings UI
        document.getElementById('particle-effects').checked = this.settings.particles;
        document.getElementById('sound-effects').checked = this.settings.sounds;
        document.getElementById('animations').checked = this.settings.animations;
        document.getElementById('round-limit').value = this.settings.roundLimit;
        document.getElementById('countdown-timer').value = this.settings.countdown;
    }
}

// AI System
class AISystem {
    constructor() {
        this.difficulty = 'medium';
        this.playerHistory = [];
        this.strategies = {
            easy: () => this.randomChoice(),
            medium: () => this.patternBasedChoice(),
            hard: () => this.counterChoice(),
            expert: () => this.adaptiveChoice(),
            adaptive: () => this.neuralChoice()
        };
        this.aiNames = {
            easy: 'Rookie Bot',
            medium: 'Smart AI',
            hard: 'Expert System',
            expert: 'Master AI',
            adaptive: 'Neural Network'
        };
    }

    makeChoice(playerChoice, playerChoices) {
        this.playerHistory.push(playerChoice);
        
        // Keep only recent history
        if (this.playerHistory.length > 50) {
            this.playerHistory = this.playerHistory.slice(-50);
        }
        
        return this.strategies[this.difficulty]();
    }

    randomChoice() {
        const choices = ['rock', 'paper', 'scissors'];
        return choices[Math.floor(Math.random() * choices.length)];
    }

    patternBasedChoice() {
        if (this.playerHistory.length < 3) return this.randomChoice();
        
        // Look for patterns in last 3 moves
        const recent = this.playerHistory.slice(-3);
        const patterns = this.findPatterns(recent);
        
        if (patterns.length > 0) {
            const predicted = patterns[0];
            return this.getCounterChoice(predicted);
        }
        
        return this.randomChoice();
    }

    counterChoice() {
        if (this.playerHistory.length === 0) return this.randomChoice();
        
        // Counter the most frequent choice
        const frequency = this.playerHistory.reduce((freq, choice) => {
            freq[choice] = (freq[choice] || 0) + 1;
            return freq;
        }, {});
        
        const mostFrequent = Object.keys(frequency).reduce((a, b) => 
            frequency[a] > frequency[b] ? a : b
        );
        
        return this.getCounterChoice(mostFrequent);
    }

    adaptiveChoice() {
        if (this.playerHistory.length < 5) return this.randomChoice();
        
        // Analyze player tendencies and adapt
        const recentMoves = this.playerHistory.slice(-10);
        const rockCount = recentMoves.filter(m => m === 'rock').length;
        const paperCount = recentMoves.filter(m => m === 'paper').length;
        const scissorsCount = recentMoves.filter(m => m === 'scissors').length;
        
        // Predict based on tendency
        if (rockCount > paperCount && rockCount > scissorsCount) {
            return Math.random() > 0.3 ? 'paper' : this.randomChoice();
        } else if (paperCount > scissorsCount) {
            return Math.random() > 0.3 ? 'scissors' : this.randomChoice();
        } else {
            return Math.random() > 0.3 ? 'rock' : this.randomChoice();
        }
    }

    neuralChoice() {
        // Simplified neural network approach
        if (this.playerHistory.length < 2) return this.randomChoice();
        
        const weights = this.calculateWeights();
        const prediction = this.predictNextMove(weights);
        
        return this.getCounterChoice(prediction);
    }

    calculateWeights() {
        const history = this.playerHistory.slice(-20);
        const transitions = {};
        
        for (let i = 0; i < history.length - 1; i++) {
            const current = history[i];
            const next = history[i + 1];
            const key = current;
            
            if (!transitions[key]) transitions[key] = { rock: 0, paper: 0, scissors: 0 };
            transitions[key][next]++;
        }
        
        return transitions;
    }

    predictNextMove(weights) {
        const lastMove = this.playerHistory[this.playerHistory.length - 1];
        const probs = weights[lastMove];
        
        if (!probs) return this.randomChoice();
        
        const total = probs.rock + probs.paper + probs.scissors;
        if (total === 0) return this.randomChoice();
        
        const rand = Math.random() * total;
        if (rand < probs.rock) return 'rock';
        if (rand < probs.rock + probs.paper) return 'paper';
        return 'scissors';
    }

    findPatterns(sequence) {
        // Simple pattern detection
        const patterns = [];
        const str = sequence.join('');
        
        if (str === 'rrr') patterns.push('rock');
        if (str === 'ppp') patterns.push('paper');
        if (str === 'sss') patterns.push('scissors');
        if (str === 'rps' || str === 'psr' || str === 'srp') patterns.push(this.getNextInCycle(sequence[2]));
        
        return patterns;
    }

    getNextInCycle(choice) {
        const cycle = { rock: 'paper', paper: 'scissors', scissors: 'rock' };
        return cycle[choice];
    }

    getCounterChoice(choice) {
        const counters = { rock: 'paper', paper: 'scissors', scissors: 'rock' };
        return counters[choice];
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    getCurrentAIName() {
        return this.aiNames[this.difficulty];
    }

    reset() {
        this.playerHistory = [];
    }
}

// Particle System
class ParticleSystem {
    constructor() {
        this.container = null;
        this.particles = [];
        this.enabled = true;
    }

    init() {
        this.container = document.getElementById('particles-container');
        this.createAmbientParticles();
        this.startAnimation();
    }

    createAmbientParticles() {
        if (!this.enabled) return;
        
        for (let i = 0; i < 20; i++) {
            this.createParticle({
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + Math.random() * 100,
                type: 'ambient'
            });
        }
    }

    createParticle(options) {
        if (!this.container || !this.enabled) return;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = options.x + 'px';
        particle.style.top = options.y + 'px';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (4 + Math.random() * 4) + 's';
        
        this.container.appendChild(particle);
        this.particles.push(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
            this.particles = this.particles.filter(p => p !== particle);
        }, 8000);
    }

    burst(result) {
        if (!this.enabled) return;
        
        const colors = {
            win: '#4ecdc4',
            lose: '#ff6b6b',
            draw: '#fce38a'
        };
        
        const battleCenter = document.querySelector('.battle-center');
        if (!battleCenter) return;
        
        const rect = battleCenter.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle burst';
            particle.style.left = centerX + (Math.random() - 0.5) * 100 + 'px';
            particle.style.top = centerY + (Math.random() - 0.5) * 100 + 'px';
            particle.style.background = colors[result];
            particle.style.animation = `burst 0.8s ease-out forwards`;
            
            this.container.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 800);
        }
    }

    startAnimation() {
        setInterval(() => {
            if (this.enabled && this.particles.length < 30) {
                this.createParticle({
                    x: Math.random() * window.innerWidth,
                    y: window.innerHeight + 10,
                    type: 'ambient'
                });
            }
        }, 2000);
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled) {
            this.particles.forEach(particle => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            });
            this.particles = [];
        }
    }
}

// Sound System
class SoundSystem {
    constructor() {
        this.sounds = {};
        this.enabled = true;
    }

    init() {
        this.sounds.win = document.getElementById('sound-win');
        this.sounds.lose = document.getElementById('sound-lose');
        this.sounds.draw = document.getElementById('sound-draw');
        
        // Generate simple sound data URLs if needed
        this.generateSounds();
    }

    generateSounds() {
        // Generate simple beep sounds using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        this.createBeep = (frequency, duration, volume = 0.1) => {
            if (!this.enabled) return;
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        };
    }

    play(result) {
        if (!this.enabled) return;
        
        try {
            switch (result) {
                case 'win':
                    this.createBeep(523.25, 0.2); // C5
                    setTimeout(() => this.createBeep(659.25, 0.3), 100); // E5
                    break;
                case 'lose':
                    this.createBeep(349.23, 0.2); // F4
                    setTimeout(() => this.createBeep(293.66, 0.3), 100); // D4
                    break;
                case 'draw':
                    this.createBeep(440, 0.2); // A4
                    break;
            }
        } catch (error) {
            console.log('Audio not supported');
        }
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }
}

// Achievement System
class AchievementSystem {
    constructor() {
        this.achievements = [
            { id: 'first_win', name: 'First Victory!', description: 'Win your first game', unlocked: false },
            { id: 'streak_5', name: 'On Fire!', description: 'Win 5 games in a row', unlocked: false },
            { id: 'streak_10', name: 'Unstoppable!', description: 'Win 10 games in a row', unlocked: false },
            { id: 'games_50', name: 'Veteran Player', description: 'Play 50 games', unlocked: false },
            { id: 'games_100', name: 'Master Player', description: 'Play 100 games', unlocked: false },
            { id: 'perfect_game', name: 'Flawless Victory', description: 'Win a perfect game', unlocked: false }
        ];
        
        this.loadAchievements();
    }

    check(gameState, statistics) {
        const toUnlock = [];
        
        // First win
        if (!this.achievements[0].unlocked && statistics.results.win > 0) {
            toUnlock.push(this.achievements[0]);
        }
        
        // Streak achievements
        if (!this.achievements[1].unlocked && gameState.playerStreak >= 5) {
            toUnlock.push(this.achievements[1]);
        }
        
        if (!this.achievements[2].unlocked && gameState.playerStreak >= 10) {
            toUnlock.push(this.achievements[2]);
        }
        
        // Game count achievements
        if (!this.achievements[3].unlocked && statistics.totalGames >= 50) {
            toUnlock.push(this.achievements[3]);
        }
        
        if (!this.achievements[4].unlocked && statistics.totalGames >= 100) {
            toUnlock.push(this.achievements[4]);
        }
        
        toUnlock.forEach(achievement => {
            this.unlock(achievement);
        });
    }

    checkEndGame(winner, gameState) {
        // Perfect game achievement
        if (!this.achievements[5].unlocked && winner === 'Player' && gameState.aiScore === 0) {
            this.unlock(this.achievements[5]);
        }
    }

    unlock(achievement) {
        achievement.unlocked = true;
        this.saveAchievements();
        this.showToast(achievement);
    }

    showToast(achievement) {
        const toast = document.getElementById('achievement-toast');
        const text = document.getElementById('achievement-text');
        
        text.textContent = achievement.name;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    loadAchievements() {
        try {
            const saved = localStorage.getItem('rps-arena-achievements');
            if (saved) {
                const savedAchievements = JSON.parse(saved);
                savedAchievements.forEach((saved, index) => {
                    if (this.achievements[index]) {
                        this.achievements[index].unlocked = saved.unlocked;
                    }
                });
            }
        } catch (error) {
            console.log('Could not load achievements');
        }
    }

    saveAchievements() {
        localStorage.setItem('rps-arena-achievements', JSON.stringify(this.achievements));
    }
}

// Add burst animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes burst {
        0% {
            transform: scale(1) translate(0, 0);
            opacity: 1;
        }
        100% {
            transform: scale(0) translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px);
            opacity: 0;
        }
    }
    
    .no-animations * {
        animation: none !important;
        transition: none !important;
    }
`;
document.head.appendChild(style);

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RPSArena();
});

// Handle window resize for particles
window.addEventListener('resize', () => {
    // Recalculate particle positions if needed
});