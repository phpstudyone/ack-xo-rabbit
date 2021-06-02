'use strict';
const uuidv4 = require('uuid/v4');

class Plugin {
    constructor(table,rabbit) {
        this.table = table;
        this.rabbit = rabbit;
        this.insertTableArr = []
    }

    generateIdentifyID () {
        return uuidv4();
    }

    async insert () {
        const result = await this.table.insert(this.insertTableArr);

        return result;
    }

    formatInsertData(messageData, routeKey) {
        return {
            message_id  : messageData.identifyId,
            message_body: messageData,
            route_key   : routeKey,
            send_count  : 0,
            status      : 0,
        }
    }

    async emit (data,routeKey) {
        try {
            const messageData = {
                ...data,
                identifyId: this.generateIdentifyID(),
            };
            this.insertTableArr.push(this.formatInsertData(messageData, routeKey));
            await this.rabbit.emit(messageData, { routeKey: routeKey });
        } catch (error) {
            console.log('emit error: ', error);
        }
    }

    async ack (messageId) {
        try {
            const result = await this.table.where({ message_id: messageId }).update({ status: 1 });

            return result;
        } catch (error) {
            console.log('ack error: ', error);
        }
    }

    async reject (messageId, text) {
        try {
            const result = await this.table.where({ message_id: messageId }).update({ reject_error: text, status: 2 });

            return result;
        } catch (error) {
            console.log('reject error: ', error);
        }
    }

}
module.exports = Plugin;