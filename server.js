const express = require('express');
const path = require('path');
const Player = require('./src/Player');
const Enemy = require('./src/Enemy');
const Game = require('./src/Game');

// Store active games (in production, use a database)
const games = new Map();

const app = express();
const PORT = 3000;

// Always serve static files on port 3000
app.use(express.json());
app.use(express.static('public'));

// Serve the main index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint - always accessible
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    port: PORT,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API endpoint for game initialization
app.post('/api/start', (req, res) => {
  const { classType, environment } = req.body;
  
  // Create new player
  const player = new Player(classType || 'warrior', environment || 'forest');
  
  // Create game instance
  const game = new Game(player, []);
  
  // Start the game
  const result = game.start();
  
  // Store game session (use client ID or generate one)
  const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  games.set(gameId, { game, player });
  
  res.json({
    success: true,
    gameId: gameId,
    ...result
  });
});

// API endpoint for game attack action
app.post('/api/attack', (req, res) => {
  const { gameId, skillIndex, enemyId } = req.body;
  
  if (!gameId || !games.has(gameId)) {
    return res.status(404).json({ success: false, error: 'Game not found' });
  }
  
  const { game, player } = games.get(gameId);
  
  // Check cooldowns
  const now = Date.now();
  const lastAttack = player.lastAttackTime || 0;
  const skillCooldowns = [0, 1000]; // skill 0 = instant, skill 1 = 1s cooldown
  
  if (now - lastAttack < skillCooldowns[skillIndex] && skillCooldowns[skillIndex] > 0) {
    return res.json({
      success: false,
      error: `Skill on cooldown (${Math.ceil((skillCooldowns[skillIndex] - (now - lastAttack)) / 1000)}s)`,
      cooldownRemaining: skillCooldowns[skillIndex] - (now - lastAttack)
    });
  }
  
  // Calculate player damage
  const skillNames = ['Swift Strike', 'Magic Bolt', 'Quick Shot', 'Fire Slash', 'Power Slash', 'Fireball', 'Arrow Barrage', 'Explosion'];
  const isSpecial = skillIndex === 1;
  let damage = player.atk * (isSpecial ? 1.5 : 1);
  
  // Critical hit chance (15%)
  const crit = Math.random() < 0.15;
  if (crit) damage = Math.floor(damage * 1.5);
  
  // Apply enemy defense
  const enemy = game.getEnemy();
  let defense = enemy.defense || 0;
  damage = Math.max(1, Math.floor(damage - defense));
  
  // Update player cooldown
  player.lastAttackTime = now;
  
  // Enemy counter-attack
  let enemyDamage = 0;
  let enemyName = '';
  if (enemy.hp > 0) {
    enemy.hp -= damage;
    enemyDamage = Math.floor(enemy.atk * (0.8 + Math.random() * 0.4));
    enemyDamage = Math.max(1, enemyDamage);
    player.hp -= enemyDamage;
    enemyName = enemy.name;
  }
  
  // Check death
  const playerDead = player.hp <= 0;
  const enemyDead = enemy.hp <= 0;
  
  if (enemyDead) {
    // Spawn new enemy
    const newEnemy = game.spawnNewEnemy();
    // Give rewards
    const reward = { gold: 10 + Math.floor(Math.random() * 20), xp: 5 + Math.floor(Math.random() * 10) };
    return res.json({
      success: true,
      playerDamage: damage,
      enemyDamage: enemyDamage,
      crit: crit,
      enemyDead: true,
      newEnemy: newEnemy,
      reward: reward,
      player: { hp: player.hp, maxHp: player.maxHp },
      cooldownRemaining: 0
    });
  }
  
  if (playerDead) {
    return res.json({
      success: false,
      error: 'Player died',
      playerDamage: damage,
      enemyDamage: enemyDamage,
      crit: crit,
      playerDead: true,
      cooldownRemaining: 0
    });
  }
  
  res.json({
    success: true,
    playerDamage: damage,
    enemyDamage: enemyDamage,
    crit: crit,
    enemyDead: false,
    cooldownRemaining: 0,
    player: { hp: player.hp, maxHp: player.maxHp },
    enemy: { hp: enemy.hp, maxHp: enemy.maxHp, name: enemy.name, level: enemy.level }
  });
});

// API endpoint to get current game status
app.get('/api/status/:gameId', (req, res) => {
  const { gameId } = req.params;
  
  if (!games.has(gameId)) {
    return res.status(404).json({ success: false, error: 'Game not found' });
  }
  
  const { game } = games.get(gameId);
  
  res.json({
    success: true,
    game: game.getPlayerStatus(),
    enemy: game.getEnemyStatus(),
    turn: game.turn
  });
});

// API endpoint for game status
app.get('/api/status', (req, res) => {
  res.json({
    server: 'running',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║  🎮 N-RPG SERVER - RUNNING                            ║');
  console.log('║  ════════════════════════════════════════════════════ ║');
  console.log('║                                                        ║');
  console.log('║  🌐 Server:      http://localhost:' + PORT + '             ║');
  console.log('║  🎮 Port:        ' + PORT + ' (always accessible)          ║');
  console.log('║  ✅ Status:      Online & Ready                        ║');
  console.log('║  📁 Static:      public/                               ║');
  console.log('║  📡 API:         /api/start, /api/status, /api/health  ║');
  console.log('║  ⚙️  Framework:   Express.js                            ║');
  console.log('║                                                        ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('✅ Server running non-stop on port ' + PORT);
});

// NO shutdown - server runs forever
// Ignore SIGINT and SIGTERM to keep server running
process.on('SIGINT', () => {
  // Ignore shutdown signal - keep running
});

process.on('SIGTERM', () => {
  // Ignore shutdown signal - keep running
});

module.exports = { app, server };
