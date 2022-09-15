const AWS = require('aws-sdk')

class configDynamoDb {
    static getDynamoDb() {
        return new AWS.DynamoDB.DocumentClient()
    }

    static getParams() {
        return { TableName: "employee" }
    }
}

module.exports = configDynamoDb
