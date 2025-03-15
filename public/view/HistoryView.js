import { AbstractView } from "./AbstractView.js";
import { startspinner, stopspinner } from './util.js';
import { currentUser } from '../controller/firebase_auth.js';

export class HistoryView extends AbstractView {
    controller = null;
    
    constructor(controller) {
        super();
        this.controller = controller;
    }

    async onMount() {
        if (!currentUser) {
            this.parentElement.innerHTML = '<h1>Access Denied</h1>';
            return;
        }
        console.log('HistoryView.onMount() called');
    }

    async updateView() {
        startspinner();

        try {
            const allHistory = await this.controller.loadHistory();
            stopspinner();
            this.controller.model.history = allHistory;
        }
        catch (e) {
            stopspinner();
            console.error('Error loading history:', e);
            alert('Error loading history');
            this.controller.model.history = null;
        }
        
        // Fetch the template from the server
        const viewWrapper = document.createElement('div');
        const response = await fetch('/view/templates/history.html', { cache: 'no-store' });
        viewWrapper.innerHTML = await response.text();

        // Use querySelector to get the tbody element from the fetched template
        const tbody = viewWrapper.querySelector('#historyTableBody');
        if (!tbody) {
            console.error("Error: 'historyTableBody' element not found in the template.");
            return viewWrapper;
        }
        
        // Clear previous content
        tbody.innerHTML = '';
        
        const history = this.controller.model.history;
        if (history === null) {
            tbody.innerHTML = '<tr><td colspan="5">Error loading history</td></tr>';
        }
        else if (history.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">No history</td></tr>';
        }
        else {
            history.forEach((record, index) => {
                const trow = this.buildHistoryRow(record, index + 1);
                tbody.appendChild(trow);
            });
        }
        
        return viewWrapper;
    }

    buildHistoryRow(record, index) {
        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.textContent = index;

        const tdBet = document.createElement('td');
        tdBet.textContent = `$${record.bet}`;

        const tdWin = document.createElement('td');
        tdWin.textContent = `$${record.win}`;

        const tdBalance = document.createElement('td');
        tdBalance.textContent = `$${record.balance}`;

        const tdTimestamp = document.createElement('td');
        tdTimestamp.textContent = new Date(record.timestamp).toLocaleString();

        tr.appendChild(tdIndex);
        tr.appendChild(tdBet);
        tr.appendChild(tdWin);
        tr.appendChild(tdBalance);
        tr.appendChild(tdTimestamp);

        return tr;
    }

    attachEvents() {
        console.log('HistoryView.attachEvents() called');
    
        const clearButton = document.getElementById('clearHistory');
        if (clearButton) {
            clearButton.addEventListener('click', async () => {
                if (confirm("Are you sure you want to clear history?")) {
                    try {
                        await this.controller.clearHistory();
                        alert('History cleared successfully');
                        window.location.reload();  // Reload the page after clearing history
                    } catch (e) {
                        console.error('Error clearing history:', e);
                        alert('Failed to clear history');
                    }
                }
            });
        }
    }
    
    async onLeave() {
        if (!currentUser) {
            this.parentElement.innerHTML = '<h1>Access Denied</h1>';
            return;
        }
        console.log('HistoryView.onLeave() called');
    }
}
