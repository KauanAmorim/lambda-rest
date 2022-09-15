'use strict';

const patients = [
  { id: 1, name: 'Maria', birthdate: '1984-11-01' },
  { id: 2, name: 'John', birthdate: '1987-11-01' },
  { id: 3, name: 'Jose', birthdate: '1987-11-01' },
]

const AWS = require('aws-sdk')
const { v4: uuidv4} = require('uuid')

const dynamoDb = new AWS.DynamoDB.DocumentClient()
const params = {
  TableName: "employee"
}

module.exports.getEmployees = async (event) => {
  try { 
    let data = await dynamoDb.scan(params).promise()
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };
  } catch (err) {
    console.log("Error", err)
    const statusCode = err.statusCode ? err.statusCode : 500
    const error = err.name ? err.name : 'Exception'
    const message = err.message ? err.message : 'Unknown error'

    return {
      statusCode: statusCode,
      body: JSON.stringify({
        error: error,
        message: message
      })
    };
  }
};

module.exports.getEmployee = async (event) => {
  try {
    const { employee_id } = event.pathParameters
    const data = await dynamoDb.get({
      ...params,
      Key: { employee_id: employee_id }
    }).promise()

    if(!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Employee not found' }, null, 2)
      }
    }

    const employee = data.Item

    return {
      statusCode: 200,
      body: JSON.stringify(employee, null, 2),
    }

  } catch (err) {
    console.log("Error", err)
    const statusCode = err.statusCode ? err.statusCode : 500
    const error = err.name ? err.name : 'Exception'
    const message = err.message ? err.message : 'Unknown error'

    return {
      statusCode: statusCode,
      body: JSON.stringify({
        error: error,
        message: message
      })
    };
  }
};

module.exports.createEmployee = async (event) => {
  try {
    const timestamp = new Date().getTime();

    const data = JSON.parse(event.body);
    const { em_name, em_age, em_role } = data

    const employee = {
      employee_id: uuidv4(), 
      em_name,
      em_age, 
      em_role,
      created_at: timestamp,
      update_at: timestamp,
    };

    const create_data = { TableName: "employee", Item: employee };
    await dynamoDb.put(create_data).promise()

    return { statusCode: 201 };
  } catch (err) {
    console.log("Error", err)
    const statusCode = err.statusCode ? err.statusCode : 500
    const error = err.name ? err.name : 'Exception'
    const message = err.message ? err.message : 'Unknown error'

    return {
      statusCode: statusCode,
      body: JSON.stringify({
        error: error,
        message: message
      })
    };
  }
};

module.exports.updateEmployee = async (event) => {
  const { employee_id } = event.pathParameters

  try {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);
    const { em_name, em_age, em_role } = data;

    await dynamoDb.update({
      ...params,
      Key: { employee_id: employee_id },
      UpdateExpression: 'SET em_name = :name, em_age = :age, em_role = :role, update_at = :update_at',
      ConditionExpression: 'attribute_exists(employee_id)',
      ExpressionAttributeValues: { ':name': em_name, ':age': em_age, ':role': em_role, ':update_at': timestamp }
    }).promise()

    return { statusCode: 204 };

  } catch (err) {
    console.log("Error", err)
    const statusCode = err.statusCode ? err.statusCode : 500
    const error = err.name ? err.name : 'Exception'
    const message = err.message ? err.message : 'Unknown error'

    if(error == 'ConditionalCheckFailedException') {
      error = 'Employee not found'
      message = `Employee with ID ${employee_id} was not found to update`
      statusCode = 404
    }

    return {
      statusCode: statusCode,
      body: JSON.stringify({
        error: error,
        message: message
      })
    };
  }
};

module.exports.deleteEmployee = async (event) => {
  const { employee_id } = event.pathParameters

  try {
    await dynamoDb.delete({
      ...params,
      Key: { employee_id: employee_id },
      ConditionExpression: 'attribute_exists(employee_id)'
    }).promise()

    return { statusCode: 204 }
  } catch (err) {
    console.log("Error", err)
    const statusCode = err.statusCode ? err.statusCode : 500
    const error = err.name ? err.name : 'Exception'
    const message = err.message ? err.message : 'Unknown error'

    if(error == 'ConditionalCheckFailedException') {
      error = 'Employee not found'
      message = `Employee with ID ${employee_id} was not found to update`
      statusCode = 404
    }

    return {
      statusCode: statusCode,
      body: JSON.stringify({
        error: error,
        message: message
      })
    };
  }
};

