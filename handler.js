'use strict';

const { handleError } = require('./helper');
const createService = require('./services/create.service');
const deleteService = require('./services/delete.service');
const readService = require('./services/read.service');
const updateService = require('./services/update.service');

module.exports.getEmployees = async (event) => {
  try { 
    const data = await readService.getEmployees()
    return { statusCode: 200, body: data };
  } catch (err) {
    handleError(err);
  }
};

module.exports.getEmployee = async (event) => {
  try {
    const data = await readService.getEmployee(event)

    if (Object.keys(data).length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Employee not found' }, null, 2)
      }
    }

    return { statusCode: 200, body: JSON.stringify(data.Item) }
  } catch (err) {
    handleError(err);
  }
};

module.exports.createEmployee = async (event) => {
  try {
    await createService.createEmployee(event)
    return { statusCode: 201 };
  } catch (err) {
    return handleError(err);
  }
};

module.exports.updateEmployee = async (event) => {
  try {
    await updateService.updateEmployee(event)
    return { statusCode: 204 };
  } catch (err) {
    handleError(err);
  }
};

module.exports.deleteEmployee = async (event) => {
  try {
    await deleteService.deleteEmployee(event)
    return { statusCode: 204 }
  } catch (err) {
    handleError(err);
  }
};

