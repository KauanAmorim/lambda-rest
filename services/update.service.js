const configDynamoDb = require("./config.dynamodb")

class updateService {
    static async updateEmployee(event) {
        const { employee_id } = event.pathParameters
        const dynamoDb = configDynamoDb.getDynamoDb()
        const params = configDynamoDb.getParams()
        const timestamp = new Date().getTime()

        const data = JSON.parse(event.body)
        const { em_name, em_age, em_role } = data;
    
        await dynamoDb.update({
          ...params,
          Key: { employee_id: employee_id },
          UpdateExpression: 'SET em_name = :name, em_age = :age, em_role = :role, update_at = :update_at',
          ConditionExpression: 'attribute_exists(employee_id)',
          ExpressionAttributeValues: { ':name': em_name, ':age': em_age, ':role': em_role, ':update_at': timestamp }
        }).promise()
    }
}

module.exports = updateService;