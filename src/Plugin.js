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

    async insert(messageData, routeKey) {
        const insertData = {
            message_id: messageData.identifyId,
            message_body: messageData,
            route_key: routeKey,
            send_count:0,
            status: 0
        };
        const result = await this.table.insert(insertData);

        return result;
    }

}
module.exports = Plugin;