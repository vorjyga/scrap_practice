const fs = require('fs');
const url = require('./vars');

export class Store {
    constructor() {
        const rawData = fs.readFileSync('./data.json');
        this.forms =  JSON.parse(rawData);
    }

    isFormExist(id) {
        return this.forms.findIndex(form => form.id === id) > -1;
    }
    
    addForm(form) {
        this.forms.push(form);
        fs.writeFileSync('./data.json', JSON.stringify(results, null, 4));
    }

    updateForm(from) {
        // compare to every field
    }
}