'use strict';
const uuidv4 = require('uuid/v4');

class Plugin {
    constructor(table,rabbit) {
        this.table = table;
        this.rabbit = rabbit;
    }

    generateIdentifyID() {
        return uuidv4();
    }

    async insert(messageDatas) {
        const result = await this.table.insert(messageDatas);

        return result;
    }

}
module.exports = Plugin;