import { AbstractView } from "./AbstractView.js";
import { currentUser } from "../controller/firebase_auth.js";
import { GameState } from "../model/HomeModel.js";
export class HomeView extends AbstractView {
    controller = null;

    constructor(controller) {
        super();
        this.controller = controller;
    }

    async onMount() {
        if (!currentUser) {
            this.parentElement.innerHTML = '<h1> Access Denied </h1>';
            return;
        }
        console.log('HomeView.onMount() is called');
    
        // Restore Odd/Even selection
        const savedOddEven = localStorage.getItem("selectedOddEven");
        if (savedOddEven) {
            document.querySelector(`input[name="OE"][value="${savedOddEven}"]`).checked = true;
        }
    
        // Restore Odd/Even bet amount
        const savedOddEvenBet = localStorage.getItem("selectedOddEvenBet");
        if (savedOddEvenBet) {
            document.getElementById("odd_even_bet").value = savedOddEvenBet;
        }
    
        // Restore Range selection
        const savedRange = localStorage.getItem("selectedRange");
        if (savedRange) {
            document.querySelector(`input[name="Range"][value="${savedRange}"]`).checked = true;
        }
    
        // Restore Range bet amount
        const savedRangeBet = localStorage.getItem("selectedRangeBet");
        if (savedRangeBet) {
            document.getElementById("range_bet").value = savedRangeBet;
        }
    }

    async updateView() {
        console.log('HomeView.updateView() is called');
        const viewWrapper = document.createElement('div');
        const response = await fetch('/view/templates/home.html', { cache: 'no-store' });
        viewWrapper.innerHTML = await response.text();
        const model = this.controller.model;
      
        // Update dice image
        const imageElement = viewWrapper.querySelector('#image_dice');
        if (imageElement) {
            imageElement.src = model.image;
        }
      
        // Update balance
        const balanceElement = viewWrapper.querySelector('#Balance');
        if (balanceElement) {
            balanceElement.textContent = `$${model.balance}`;
        }
    
        // Ensure results are in the DOM
        const resultsElement = viewWrapper.querySelector('#Results');
        if (resultsElement) {
            resultsElement.innerHTML = model.message;
        }

        const playButton = viewWrapper.querySelector('#play');
        const newGameButton = viewWrapper.querySelector('#new_game');
        const radioButtons = viewWrapper.querySelectorAll('input[type="radio"]');
        const betSelects = viewWrapper.querySelectorAll('.form-select');
        const bet1Element = viewWrapper.querySelector('#odd_even_bet').value;
        const bet2Element = viewWrapper.querySelector('#range_bet').value;

        // Game state logic
        switch (model.gameState) {
            case GameState.INIT:
                newGameButton.disabled = true;
                playButton.disabled = bet1Element === '0' && bet2Element === '0'; // Disable Play if no valid bet
                radioButtons.forEach(radio => { radio.disabled = false; });
                betSelects.forEach(select => { select.disabled = false; });
                break;

            case GameState.PLAYING:
                newGameButton.disabled = true; // Disable New Game while playing
                playButton.disabled = true; // Disable Play during the game
                radioButtons.forEach(radio => { radio.disabled = true; });
                betSelects.forEach(select => { select.disabled = true; });
                break;

            case GameState.DONE:
                newGameButton.disabled = false; // Enable New Game after the game ends
                playButton.disabled = true; // Disable Play after the game ends
                radioButtons.forEach(radio => { radio.disabled = true; });
                betSelects.forEach(select => { select.disabled = true; });
                break;
        }

        this.restoreSelections(viewWrapper);

        return viewWrapper;
    }

    attachEvents() {
        console.log('HomeView.attachEvents() is called');

        // Attach checkbox event for showing/hiding rolled number
        const checkeyCheckbox = document.getElementById('checkey');
        if (checkeyCheckbox) {
            checkeyCheckbox.addEventListener('change', () => {
                this.controller.oncheckey(checkeyCheckbox.checked);
            });
        }

        // Attach event to Play button
        const playButton = document.getElementById('play');
        if (playButton) {
            playButton.addEventListener('click', () => {
                console.log('play button clicked');
                this.controller.onClickPlayButton();
            });
        }

        // Attach event to New Game button
        const newGameButton = document.getElementById('new_game');
        if (newGameButton) {
            newGameButton.addEventListener('click', () => {
                console.log('new game button clicked');
                this.controller.onClickNewGameButton();
            });
        }

        // Attach event listeners to dropdown menus
        const oddEvenBet = document.getElementById('odd_even_bet');
        const rangeBet = document.getElementById('range_bet');
        
        if (oddEvenBet && rangeBet) {
            oddEvenBet.addEventListener('change', this.togglePlayButton.bind(this));
            rangeBet.addEventListener('change', this.togglePlayButton.bind(this));
        }
    }

    // Function to toggle the Play button state based on dropdown selection
    togglePlayButton() {
        const playButton = document.getElementById('play');
        const bet1Element = document.getElementById('odd_even_bet').value;
        const bet2Element = document.getElementById('range_bet').value;
        const model = this.controller.model;

        // Enable or disable the play button based on game state and dropdown values
        switch (model.gameState) {
            case GameState.INIT:
                playButton.disabled = bet1Element === '0' && bet2Element === '0'; // Only enabled if a valid bet is selected
                
                break;
            case GameState.PLAYING:
                playButton.disabled = true; // Disable during gameplay
                break;
            case GameState.ENDED:
                playButton.disabled = true; // Disable after the game ends
                break;
        }
    }

    async onLeave() {
        if (!currentUser) {
            this.parentElement.innerHTML = '<h1> Access Denied </h1>';
            return;
        }
        console.log('HomeView.onLeave() is called');
    }
    restoreSelections(viewWrapper) {
        // Restore Odd/Even selection
        const savedOddEven = localStorage.getItem("selectedOddEven");
        if (savedOddEven) {
            const radio = viewWrapper.querySelector(`input[name="OE"][value="${savedOddEven}"]`);
            if (radio) radio.checked = true;
        }
    
        // Restore Odd/Even bet amount
        const savedOddEvenBet = localStorage.getItem("selectedOddEvenBet");
        if (savedOddEvenBet) {
            const betSelect = viewWrapper.querySelector("#odd_even_bet");
            if (betSelect) betSelect.value = savedOddEvenBet;
        }
    
        // Restore Range selection
        const savedRange = localStorage.getItem("selectedRange");
        if (savedRange) {
            const radio = viewWrapper.querySelector(`input[name="Range"][value="${savedRange}"]`);
            if (radio) radio.checked = true;
        }
    
        // Restore Range bet amount
        const savedRangeBet = localStorage.getItem("selectedRangeBet");
        if (savedRangeBet) {
            const betSelect = viewWrapper.querySelector("#range_bet");
            if (betSelect) betSelect.value = savedRangeBet;
        }
    }
    
}

