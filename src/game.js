class Game {
    //запущена игра
    startGame = false;
    //очки
    score = 0;
    //очки для смены уровня
    levelScore = 0;
    //количество очков для окончания игры
    scoreToWin = 75;
    //смерть
    death = false;
    //победа
    win = false;

    constructor() {
    }

    isStartGame() {
        return this.startGame;
    }

    setStartGame(value) {
        this.startGame = value;
    }

    getScore() {
        return this.score;
    }

    setScore(value) {
        this.score = value;
    }

    getLevelScore() {
        return this.levelScore;
    }

    setLevelScore(value) {
        this.levelScore = value;
    }

    getScoreToWin() {
        return this.scoreToWin;
    }

    setScoreToWin(value) {
        this.scoreToWin = value;
    }

    isDeath() {
        return this.death;
    }

    setDeath(value) {
        this.death = value;
    }

    isWin() {
        return this.win;
    }

    setWin(value) {
        this.win = value;
    }
}