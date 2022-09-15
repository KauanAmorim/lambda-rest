const configDynamoDb = require("./config.dynamodb");

class deleteService {
  static async deleteEmployee(event) {
    const dynamoDb = configDynamoDb.getDynamoDb()
    const params = configDynamoDb.getParams()
    const { employee_id } = event.pathParameters;

    await dynamoDb
      .delete({
        ...params,
        Key: { employee_id: employee_id },
        ConditionExpression: "attribute_exists(employee_id)",
      })
      .promise();
  }
}

module.exports = deleteService;
