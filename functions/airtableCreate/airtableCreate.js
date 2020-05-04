// IMPORT THE AIRTABLE.JS PACKAGE
const Airtable = require('airtable');

/** THIS IS YOUR SERVERLESS FUNCTION */
exports.handler = function(event, context, callback) {
  //pull the required information from your environment variables, which can be set in the Netlify UI
  const {API_URL, API_CLIENT_ID, API_KEY } = process.env;

  // THIS FUNCTION FORMATS AND SENDS YOUR RESPONSE BACK TO YOUR FRONT-END
  const send = body => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(body)
    });
  }

  // CONFIGURE YOUR AIRTABLE BASE CONNECTION
  Airtable.configure({
    endpointUrl: API_URL,
    apiKey: API_KEY
  });
  var base = Airtable.base(API_CLIENT_ID);
  
  /**
    AIRTABLE REQUEST LOGIC GOES HERE, APPENDING TO DATA
    REFERENCE YOUR BASE-SPECIFIC API
  */
  const data = JSON.parse(event.body);

  base('Table 1').create({
    "Name": data.name,
    "Notes": data.notes
  }, function(err, record) {
    if (err) {
      console.error(err);
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(err)
      })
    }
    console.log(record.getId());
    send(record.getId());
  });

}
