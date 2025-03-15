import { historyModel } from "../model/HistoryModel.js";
import { getHistoryList, clearHistory } from "./firestone_controller.js";

export class HistoryController {
    view = null;
    model = null;
    
    constructor() {
        this.model = new historyModel();
    }

    setView(view) {
        this.view = view;
    }

    async loadHistory() {
        try {
            const history = await getHistoryList();
            return history;
        } catch (error) {
            console.error('Error loading history:', error);
            alert('Error loading history');
            return null;
        }
    }
    
    async clearHistory() {
        try {
            await clearHistory();
            alert('History cleared successfully');
        } catch (error) {
            console.error('Error clearing history:', error);
            alert('Failed to clear history');
        }
    }
}
