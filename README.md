# 🎮 Ultimate Rock Paper Scissors - Advanced Edition

The most advanced rock-paper-scissors game ever created! Featuring AI opponents, advanced animations, multiple game modes, and cutting-edge web technologies.

## ✨ Features

### 🧠 Advanced AI Opponent
- **5 Different AI Strategies**: Random, Pattern Recognition, Counter Strategy, Adaptive Learning, and Psychological Warfare
- **Dynamic Difficulty**: Adjustable AI difficulty from 1-10
- **Pattern Analysis**: AI learns from your playing patterns
- **Adaptive Behavior**: AI adjusts strategy based on your win rate
- **Psychological Warfare**: Advanced AI that predicts your next move

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Theme**: Beautiful dark mode with gradient accents
- **Smooth Animations**: CSS3 animations and transitions throughout
- **Glass Morphism**: Modern glassmorphism design elements
- **Custom Fonts**: Orbitron and Exo 2 fonts for futuristic feel

### 🎮 Game Modes
- **Classic Mode**: Traditional rock-paper-scissors
- **Advanced Mode**: Enhanced features and special moves
- **Tournament Mode**: Multi-round competitions
- **Multiplayer Mode**: Local player vs player battles
- **Lizard Spock Mode**: Extended 5-choice variant with Lizard and Spock

### 📊 Statistics & Analytics
- **Real-time Stats**: Wins, losses, ties, and win rate
- **Game History**: Track your last 20 games with timestamps
- **Pattern Analysis**: View your playing patterns
- **AI Performance**: Monitor AI strategy and confidence levels

### 🎵 Audio & Visual Effects
- **Sound Effects**: Choice sounds, win/lose audio
- **Visual Feedback**: Color-coded results and animations
- **Haptic Feedback**: Enhanced user experience
- **Loading Animations**: Smooth loading transitions

### ⌨️ Keyboard Shortcuts
- **R**: Choose Rock
- **P**: Choose Paper  
- **S**: Choose Scissors
- **L**: Choose Lizard (in Lizard Spock mode)
- **V**: Choose Spock (in Lizard Spock mode)
- **Enter**: Play Again (when available)
- **Escape**: Close modals

### 🔧 Advanced Features
- **Local Storage**: Game state persistence
- **Accessibility**: ARIA labels and keyboard navigation
- **PWA Ready**: Service worker support
- **Easter Eggs**: Konami code and hidden features
- **Mobile Optimized**: Touch-friendly interface
- **Achievements System**: Unlock badges and trophies
- **Power-ups**: Special abilities and bonuses
- **Leaderboards**: Track high scores and statistics
- **Multiple Themes**: Neon, Retro, Minimal, and Default themes
- **Multiplayer Support**: Local 2-player battles

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software required!

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. Start playing immediately!

### File Structure
```
ultimate-rock-paper-scissors/
├── index.html          # Main HTML file
├── styles.css          # Advanced CSS styling
├── script.js           # JavaScript game logic
└── README.md          # This documentation
```

## 🎯 How to Play

### Basic Gameplay
1. **Choose Your Weapon**: Click on Rock 🪨, Paper 📄, or Scissors ✂️
2. **Watch the Battle**: AI makes its choice with dramatic timing
3. **See the Result**: Victory, defeat, or tie with detailed explanations
4. **Play Again**: Click "Play Again" to continue

### Advanced Features
- **Adjust AI Difficulty**: Use the slider in the Advanced Features panel
- **Toggle Animations**: Enable/disable visual effects
- **Sound Controls**: Turn audio on/off
- **Game Modes**: Switch between Classic, Advanced, Tournament, Multiplayer, and Lizard Spock modes
- **Themes**: Choose from Default, Neon, Retro, or Minimal themes
- **Statistics**: Monitor your performance and win rate
- **Achievements**: Track your progress and unlock badges
- **Power-ups**: Earn and use special abilities

### Lizard Spock Rules

The extended 5-choice variant adds Lizard 🦎 and Spock 🖖:

- **Rock** crushes Scissors and Lizard
- **Paper** covers Rock and disproves Spock
- **Scissors** cuts Paper and decapitates Lizard
- **Lizard** eats Paper and poisons Spock
- **Spock** vaporizes Rock and smashes Scissors

*"Scissors cuts paper, paper covers rock, rock crushes lizard, lizard poisons Spock, Spock smashes scissors, scissors decapitates lizard, lizard eats paper, paper disproves Spock, Spock vaporizes rock, and as it always has, rock crushes scissors."* - Sheldon Cooper

### AI Strategies Explained

#### 🎲 Random (Difficulty 1-3)
- Completely random choices
- Good for beginners

#### 🔍 Pattern Recognition (Difficulty 4-5)
- Analyzes your recent choices
- Counters your most frequent moves

#### ⚔️ Counter Strategy (Difficulty 6-7)
- Always tries to counter your last move
- Predictable but effective

#### 🧠 Adaptive Learning (Difficulty 8-9)
- Adjusts strategy based on your win rate
- Balances between random and pattern-based play

#### 🎭 Psychological Warfare (Difficulty 10)
- Advanced psychological analysis
- Predicts your next move based on previous outcomes
- Most challenging opponent

### 🏆 Achievements System

Unlock achievements by completing various challenges:

#### 🎯 Available Achievements
- **🏆 First Victory**: Win your first game
- **🔥 Hot Streak**: Win 5 games in a row
- **⚡ Unstoppable**: Win 10 games in a row
- **🎖️ Veteran**: Win 50 total games
- **💎 Perfectionist**: Win without losing once in a session
- **🤖 AI Master**: Beat AI on maximum difficulty
- **🖖 Spock Logic**: Win 10 games in Lizard Spock mode
- **⚡ Power Player**: Use all three power-ups

### ⚡ Power-ups System

Earn and use special abilities:

#### 🛡️ Available Power-ups
- **🛡️ Shield**: Protects against one loss
- **⚡ Double Strike**: Win counts as two victories
- **🧠 Mind Read**: See AI's next move in advance

Power-ups are earned randomly when you win games (30% chance).

### 🎨 Themes

Choose from multiple visual themes:
- **Default**: Classic dark theme with purple/pink gradients
- **Neon**: Bright green and pink cyberpunk style
- **Retro**: Orange and yellow vintage gaming theme
- **Minimal**: Clean light theme for distraction-free play

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic markup and modern elements
- **CSS3**: Advanced styling with CSS Grid, Flexbox, and animations
- **JavaScript ES6+**: Modern JavaScript with classes and modules
- **Local Storage**: Data persistence
- **Service Workers**: PWA capabilities

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Performance Features
- **Optimized Animations**: Hardware-accelerated CSS animations
- **Efficient Rendering**: Minimal DOM manipulation
- **Memory Management**: Proper cleanup and garbage collection
- **Responsive Images**: Optimized for all screen sizes

## 🎨 Customization

### Themes
The game uses CSS custom properties for easy theming. Modify the `:root` variables in `styles.css` to create custom themes.

### Adding New Features
The modular JavaScript architecture makes it easy to add new features:
- New AI strategies in the `aiStrategies` object
- Additional game modes in the `applyGameMode` method
- Custom animations in the CSS file

## 🐛 Troubleshooting

### Common Issues
1. **Game not loading**: Check browser console for errors
2. **Animations not working**: Ensure CSS animations are enabled
3. **Sound not playing**: Check browser autoplay policies
4. **Mobile issues**: Ensure viewport meta tag is present

### Debug Mode
Open browser console and type `window.ultimateRPS` to access the game instance for debugging.

## 🤝 Contributing

Feel free to contribute to this project! Some ideas:
- Add new AI strategies
- Create additional game modes
- Improve animations and effects
- Add multiplayer functionality
- Enhance accessibility features

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Fonts**: Google Fonts (Orbitron, Exo 2)
- **Icons**: Unicode emoji characters
- **Inspiration**: Classic rock-paper-scissors game
- **Community**: All contributors and testers

## 🎉 Easter Eggs

### Konami Code
Enter the Konami code (↑↑↓↓←→←→BA) to activate rainbow mode!

### Keyboard Shortcuts
Try pressing different keys during gameplay for hidden features.

---

**Enjoy the most advanced rock-paper-scissors game ever created! 🎮✨**