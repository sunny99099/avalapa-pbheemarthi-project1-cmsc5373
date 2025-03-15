export class historyModel {
    #history = null;
    set history(records) {
        this.#history = records;
    }
    get history() {
        return this.#history;
    }

    clear() {
        this.#history = null;
    }
}