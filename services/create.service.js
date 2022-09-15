const configDynamoDb = require("./config.dynamodb");
const { v4: uuidv4 } = require("uuid");

class createService {
  static async createEmployee(event) {
    const dynamoDb = configDynamoDb.getDynamoDb()
    const timestamp = new Date().getTime();

    const data = JSON.parse(event.body);
    const { em_name, em_age, em_role } = data;

    const employee = {
      employee_id: uuidv4(),
      em_name,
      em_age,
      em_role,
      created_at: timestamp,
      update_at: timestamp,
    };

    const create_data = { TableName: "employee", Item: employee };
    await dynamoDb.put(create_data).promise();
  }
}

module.exports = createService;
