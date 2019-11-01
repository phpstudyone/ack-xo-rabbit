'use strict';
const uuidv4 = require('uuid/v4');

class Plugin {
    constructor(table,rabbit) {
        this.table = table;
        this.rabbit = rabbit;
        this.insertTableArr = []
    }

    generateIdentifyID = () => {
        return uuidv4();
    }

    insert = async () => {
        const result = await this.table.insert(this.insertTableArr);

        return result;
    }

    formatInsertData = (messageData, routeKey) => ({
        message_id  : messageData.identifyId,
        message_body: messageData,
        route_key   : routeKey,
        send_count  : 0,
        status      : 0,
    })

    emit = async (data,routeKey)=>{
        const messageData = {
            ...data,
            identifyId: this.generateIdentifyID(),
        };
        this.insertTableArr.push(this.formatInsertData(messageData, routeKey));
        await this.rabbit.emit(messageData, { routeKey: routeKey });
    }

    ack = async (messageId) => {
        const result = await this.table.where({ message_id: messageId }).update({ status: 1 });

        return result;
    }

}
module.exports = Plugin;