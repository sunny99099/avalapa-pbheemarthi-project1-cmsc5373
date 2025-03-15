import { HomeModel, GameState, EO, Range } from '../model/HomeModel.js';
import { saveHistory } from './firestone_controller.js';
import { currentUser } from './firebase_auth.js';
import { startspinner, stopspinner } from "../view/util.js";

export const glHomeModel = new HomeModel();

export class HomeController {
    model = null;
    view = null;

    constructor() {
        this.model = glHomeModel;
        this.oncheckey = this.oncheckey.bind(this);
        this.onClickNewGameButton = this.onClickNewGameButton.bind(this);
        this.onClickPlayButton = this.onClickPlayButton.bind(this);
    }

    setView(view) {
        this.view = view;
    }

    onClickNewGameButton() {
        this.model.newGame();
        this.view.render();
    }

    async onClickPlayButton() {
        const selectedOddEven = document.querySelector('input[name="OE"]:checked');
        const selectedRange = document.querySelector('input[name="Range"]:checked');
        const selectedBetAmountOddEven = document.querySelector('#odd_even_bet').value; // Bet amount for Odd/Even
        const selectedBetAmountRange = document.querySelector('#range_bet').value; // Bet amount for Range
    
    
        let bet1 = 0;
        let bet2 = 0;
    
        // Assign bet1 for Odd/Even bet
        if (selectedOddEven) {
            this.model.eo = selectedOddEven.value === "odd" ? 'odd' : 'even';
            bet1 = parseInt(selectedBetAmountOddEven); // Assign bet1 for Odd/Even
        }
    
        // Assign bet2 for Range bet
        if (selectedRange) {
            this.model.range = selectedRange.value === "1-2" ? Range.oneToTwo :
                               selectedRange.value === "3-4" ? Range.threeToFour : Range.fiveToSix;
            bet2 = parseInt(selectedBetAmountRange); // Assign bet2 for Range
        }
        
        if(bet1+bet2 > this.model.balance){
            alert('Insufficient balance');
            return;
        }

        // Calculate winnings for both bets
        const winnings = this.model.gameResult(bet1, bet2);
    
        // Debugging output
        console.log(`Winnings: ${winnings}`);

        if (winnings !== 0) {
            this.model.win = winnings;
        }

        this.model.gameState = GameState.DONE;
        // Update UI
        this.view.render();

        startspinner();

        try{
            const record = this.model.toFirestoreObject(currentUser.email);
            await saveHistory(record);
            stopspinner();
        } catch (e) {
            stopspinner();
            console.error('Error saving history', e);
            alert('Error saving history: ' + e);
        }

    }
    

    oncheckey(isChecked) {
        const rolledNumber = this.model.RolledNumber;
        const rolledNumberElement = document.getElementById("game_key");

        if (rolledNumberElement) {
            rolledNumberElement.innerHTML = isChecked ? `Rolled Number: ${rolledNumber}` : '';
        }
    }
}
