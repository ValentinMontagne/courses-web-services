const soap = require("soap");

// Create the SOAP client
const url = "http://localhost:8000/products?wsdl";

soap.createClient(url, { returnFault: true }, function (err, client) {
  if (err) {
    console.error("Error creating SOAP client:", err);
    return;
  }

  // Make a SOAP request
  const args = { name: "My game", about: "Awesome !", price: 75.5 };
  client.CreateProduct(args, function (err, result) {
    if (err) {
      console.error(
        "Error making SOAP request:",
        err.response.status,
        err.response.statusText,
        err.body
      );
      return;
    }

    // Handle the SOAP response
    console.log("Result:", result);
  });

  client.GetProducts({}, function (err, result) {
    if (err) {
      console.error(
        "Error making SOAP request:",
        err.response.status,
        err.response.statusText,
        err.body
      );
      return;
    }

    // Handle the SOAP response
    console.log("Result:", result);
  });
});
