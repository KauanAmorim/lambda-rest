const configDynamoDb = require("./config.dynamodb");

class readService {

  static async getEmployees() {
    const dynamoDb = configDynamoDb.getDynamoDb()
    const params = configDynamoDb.getParams()
    const data = await dynamoDb.scan(params).promise();
    const employees = JSON.stringify(data.Items);
    return employees;
  }

  static async getEmployee(event) {
    const { employee_id } = event.pathParameters;
    const dynamoDb = configDynamoDb.getDynamoDb()
    const params = configDynamoDb.getParams()

    const data = await dynamoDb
      .get({
        ...params,
        Key: { employee_id: employee_id },
      })
      .promise();

    return data
  }
}

module.exports = readService;
