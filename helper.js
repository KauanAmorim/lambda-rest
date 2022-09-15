module.exports.handleError = (err) => {
  console.log("Error", err);
  const statusCode = err.statusCode ? err.statusCode : 500;
  const error = err.name ? err.name : "Exception";
  const message = err.message ? err.message : "Unknown error";

  if (error == "ConditionalCheckFailedException") {
    error = "Employee not found";
    message = `Employee with ID ${employee_id} was not found to update`;
    statusCode = 404;
  }

  return {
    statusCode: statusCode,
    body: JSON.stringify({
      error: error,
      message: message,
    }),
  };
};
