import * as CONST from '../constants';
import User from '../players/user';
import Opponent from '../players/opponent';
import { sprite, clapHigh, clapLow } from '../assets';
import { Game } from '../game';

class Scoreboard {
  constructor(position, firstServer, { playerName, bestOfGames }, endFn) {
    this.position = position;
    this.firstServer = firstServer;
    this.state = {
      'serveChange': 2,
      'server': this.firstServer,
      'driver': this.firstServer,
      'deuce': false
    }
    this.scores = {
      'current': {
        'player': 0,
        'opponent': 0
      },
      'games': {
        'player': 0,
        'opponent': 0
      }
    }
    this.bestOfGames = bestOfGames;
    this.playerName = playerName;
    this.endFn = endFn;
  }

  // Draw scoreboard sprite to canvas
  drawCard = (ctx) => {

    if (this.state.server instanceof User) {
      ctx.drawImage(sprite,
        Scoreboard.sprite.player.sx,
        Scoreboard.sprite.player.sy,
        Scoreboard.sprite.player.sw,
        Scoreboard.sprite.player.sh,
        this.position.x,
        this.position.y,
        Scoreboard.sprite.player.sw,
        Scoreboard.sprite.player.sh
      );
    } else if (this.state.server instanceof Opponent) {
      ctx.drawImage(sprite,
        Scoreboard.sprite.opponent.sx,
        Scoreboard.sprite.opponent.sy,
        Scoreboard.sprite.opponent.sw,
        Scoreboard.sprite.opponent.sh,
        this.position.x,
        this.position.y,
        Scoreboard.sprite.opponent.sw,
        Scoreboard.sprite.opponent.sh
      );
    }
  }

  // Draw scoreboard text to canvas
  drawScore = (ctx) => {
    ctx.beginPath();
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = CONST.WHITE;
    ctx.fillText(this.playerName, 70, 52);
    ctx.fillText('COMPUTER', 54, 52 * 2);
    ctx.fillText('COMPUTER', 54, 52 * 2);
    ctx.fillText(this.scores.games.player, 304, 52);
    ctx.fillText(this.scores.games.opponent, 288, 52 * 2);
    ctx.fillStyle = CONST.BLACK_A;
    ctx.fillText(this.scores.current.player, 364, 52);
    ctx.fillText(this.scores.current.opponent, 348, 52 * 2);
    ctx.closePath();
  }

  // Draw scoreboard to canvas
  draw = (ctx) => {
    this.drawCard(ctx);
    this.drawScore(ctx);
  }

  // Increase game scores of players on scoreboard
  updateScore = (player, opponent) => {

    const bounce = `${player.bounce}${opponent.bounce}`;

    if (Game.state.serveSuccess) {
      if (this.state.driver === player) {
        if (bounce === '01') {
          this.scores.current.player++;
          clapHigh.play();
        } else {
          this.scores.current.opponent++;
          clapLow.play();
        }
      } else if (this.state.driver === opponent) {
        if (bounce === '10') {
          this.scores.current.opponent++;
          clapLow.play();
        } else {
          this.scores.current.player++;
          clapHigh.play();
        }
      }
    } else {
      if (this.state.server === player) {
        if (bounce === '11') {
          this.scores.current.player++;
          clapHigh.play();
        } else {
          this.scores.current.opponent++;
          clapLow.play();
        }
      } else if (this.state.server === opponent) {
        if (bounce === '11') {
          this.scores.current.opponent++;
          clapLow.play();
        } else {
          this.scores.current.player++;
          clapHigh.play();
        }
      }
    }

    // Condition for deuce game
    if (this.scores.current.player === 10 && this.scores.current.opponent === 10) {
      this.state.deuce = true;
      this.state.serveChange = 1;
    }
  }

  /**
   * Check for winning conditions
   * @param {function} gameOver - game over callback function
   */
  checkWin = (gameOver) => {

    if (!this.state.deuce) {

      if (this.scores.current.player === 11) {
        this.scores.games.player++;
        gameOver();
        return;
      }

      if (this.scores.current.opponent === 11) {
        this.scores.games.opponent++;
        gameOver();
        return;
      }

    } else {

      const dPoints = this.scores.current.player - this.scores.current.opponent;

      if (Math.abs(dPoints) === 2) {
        const winner = dPoints > 0 ? 'player' : 'opponent';
        this.scores.games[winner]++;
        gameOver();
      }
    }
  }

  // Check for Best of Games completion
  allOver = () => {

    const playerWins = this.scores.games.player;
    const opponentWins = this.scores.games.opponent;
    const requiredWins = Math.ceil(this.bestOfGames / 2);

    if (playerWins === requiredWins) {
      Game.state.isOver = true;
      this.endFn(this.playerName);
      return true;
    }

    if (opponentWins === requiredWins) {
      Game.state.isOver = true;
      this.endFn('COMPUTER');
      return true;
    }

    return false;
  }

  // Set server for game
  server = (player, opponent) => {
    const points = this.scores.current.player + this.scores.current.opponent;

    if (points % this.state.serveChange === 0) {
      const side = this.state.server === player ? opponent : player;
      this.state.server = side;
      this.state.driver = side;
    }
  }

  // Set scoreboard to initial state
  resetState = () => {
    this.state = {
      'serveChange': 2,
      'server': this.firstServer,
      'driver': this.firstServer
    }
    this.scores.current.player = 0;
    this.scores.current.opponent = 0;
  }

}

Scoreboard.sprite = {
  'player': {
    'sx': 0,
    'sy': 316,
    'sw': 390,
    'sh': 100
  },
  'opponent': {
    'sx': 0,
    'sy': 417,
    'sw': 390,
    'sh': 100
  }
}

export default Scoreboard;