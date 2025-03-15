export const Images = {
    one: '/images/1.jpg',
    two: '/images/2.jpg',
    three: '/images/3.jpg',
    four: '/images/4.jpg',
    five: '/images/5.jpg',
    six: '/images/6.jpg',
    X: '/images/X.jpg'
};

export const Bet = {
    ten: 10,
    twenty: 20,
    thirty: 30
};


export const EO = {
    correct: 'even',
    wrong: 'odd'
};

export const Range = {
    oneToTwo: '1-2',
    threeToFour: '3-4',
    fiveToSix: '5-6'
};

export const GameState = {
    INIT: 0,
    PLAYING: 1,
    DONE: 2
};

export class HomeModel {
    RolledNumber;
    gameState = GameState.INIT;
    image;
    balance = 100;
    win = 0;
    bet = 0;
    eo = null;
    range = null;
    message = 'Choose bet(s) and press [PLAY]';

    constructor() {
        this.RolledNumber = this.randomRoll();
        this.image = Images.X;
    }

    updateImage() {
        switch (this.RolledNumber) {
            case 1:
                this.image = Images.one;
                break;
            case 2:
                this.image = Images.two;
                break;
            case 3:
                this.image = Images.three;
                break;
            case 4:
                this.image = Images.four;
                break;
            case 5:
                this.image = Images.five;
                break;
            case 6:
                this.image = Images.six;
                break;
            default:
                this.image = Images.X;
                break;
        }
    }

    resetImage() {
        this.image = Images.X;
    }

    randomRoll() {
        this.RolledNumber = Math.floor(Math.random() * 6) + 1;
        return this.RolledNumber;
    }

    gameResult(bet1, bet2) {
        this.updateImage();
        this.gameState = GameState.DONE;
        let win = 0;
        this.message = '';

        console.log(`Rolled Number: ${this.RolledNumber}`);
        console.log(`Bet Information - EO: ${this.eo}, Range: ${this.range}, Bet1: ${bet1}, Bet2: ${bet2}`);

        // Odd/Even bet (only process if selected)
        if (bet1 === 0) {
            this.message = 'No bet placed on odd/even <br>';
        } else {
            if (this.eo !== null) {
                if (this.eo === 'even') {
                    if (this.RolledNumber % 2 === 0) {
                        win = win + 2 * bet1; // Double the bet for Even
                        this.message = this.message + 'you won $' + 2 * bet1 + ' for Even' + '<br>';
                    } else {
                        win = win - bet1; // Lose the bet for Even
                        this.message = this.message + 'you lost $' + bet1 + ' for Even' + '<br>';
                    }
                } else if (this.eo === 'odd') {
                    if (this.RolledNumber % 2 !== 0) {
                        win = win + 2 * bet1; // Double the bet for Odd
                        this.message = this.message + 'you won $' + 2 * bet1 + ' for Odd' + '<br>';
                    } else {
                        win = win - bet1; // Lose the bet for Odd
                        this.message = this.message + 'you lost $' + bet1 + ' for Odd' + '<br>';
                    }
                }
            }
        }

        if (bet2 === 0) {
            this.message =this.message + 'No bet placed on range';
        } else {
            // Range bet (only process if selected)
            if (this.range !== null) {
                if (this.range === Range.oneToTwo && (this.RolledNumber === 1 || this.RolledNumber === 2)) {
                    win = win + 3 * bet2; // Triple the bet for Range 1-2
                    this.message = this.message + 'you won $' + 3 * bet2 + ' for Range 1-2' + '<br>';
                } else if (this.range === Range.threeToFour && (this.RolledNumber === 3 || this.RolledNumber === 4)) {
                    win = win + 3 * bet2; // Triple the bet for Range 3-4
                    this.message = this.message + 'you won $' + 3 * bet2 + ' for Range 3-4' + '<br>';
                } else if (this.range === Range.fiveToSix && (this.RolledNumber === 5 || this.RolledNumber === 6)) {
                    win = win + 3 * bet2; // Triple the bet for Range 5-6
                    this.message = this.message + 'you won $' + 3 * bet2 + ' for Range 5-6' + '<br>';
                } else {
                    win = win - bet2; // Lose the bet for Range
                    this.message = this.message + 'you lost $' + bet2 + ' for Range' + '<br>';
                }
            }
        }

        console.log(`Win/Loss Amount: ${win}`);
        this.balance += win;
        this.win = win;
        this.bet = bet1 + bet2;
        console.log(`Updated Bet: ${this.bet}`);

        console.log(`Updated Balance: ${this.balance}`);

        return win;
    }


    newGame() {
        this.gameState = GameState.INIT;
        this.image = Images.X;
        this.randomRoll();
        this.message = "Choose bet(s) and press [PLAY]";
    }

    toFirestoreObject(email) {
        return {
            balance: this.balance,
            bet: this.bet,
            email: email,
            timestamp: new Date(),
            win: this.win,
        }
    }

    reset(){
        this.newGame();
    }
}
