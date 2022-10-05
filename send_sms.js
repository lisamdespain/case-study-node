const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'Heya! This is from the node backend',
     from: '+14797773379',
     to: '+19182326155'
   })
  .then(message => console.log(message.sid));