const express = require('express');
const { MessagingResponse } = require('twilio').twiml;
// const { addToCalendar } = require('calendar');

const app = express();
app.use(express.json());

require('dotenv').config();

const axios = require("axios");

const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute:"numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getStartDate = () => {
    let todaysDate = new Date();
    let dateString =
        todaysDate.getUTCFullYear() + "-" +
        ("0" + (todaysDate.getUTCMonth()+1)).slice(-2) + "-" +
        ("0" + todaysDate.getUTCDate()).slice(-2) + "T" +
        ("0" + (todaysDate.getUTCHours()+2)).slice(-2) + ":" +
        ("0" + todaysDate.getUTCMinutes()).slice(-2) + ":" +
        ("0" + todaysDate.getUTCSeconds()).slice(-2)+ ".000000Z";
    return dateString;
}

const getEndDate = () => {
    let todaysDate = new Date();
    let dateString =
    todaysDate.getUTCFullYear() + "-" +
        ("0" + (todaysDate.getUTCMonth()+1)).slice(-2) + "-" +
        ("0" + (todaysDate.getUTCDate()+6)).slice(-2) + "T" +
        ("0" + todaysDate.getUTCHours()).slice(-2) + ":" +
        ("0" + todaysDate.getUTCMinutes()).slice(-2) + ":" +
        ("0" + todaysDate.getUTCSeconds()).slice(-2)+ ".000000Z";
    return dateString;
}

const getSchedule = async () =>{
    const startTime = getStartDate();
    const endTime = getEndDate();
    let options = {
        method: 'GET',
        url: 'https://api.calendly.com/event_type_available_times',
        
        params: {
            event_type: 'https://api.calendly.com/event_types/535a00c7-7422-4d10-98fe-e3dd50fc1197',
            start_time: startTime,
            end_time: endTime
        },
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + process.env.CALENDLY_TOKEN
        }
    };  
    return await axios.request(options).then((res) => {
        return res.data.collection;
    }).catch(function (error) {
    console.error("error from Calendly", error);
    });
}

app.post('/sms', async (req, res) => {
  const twiml = new MessagingResponse();
  const time = await getSchedule();
  const time0 = formatDate(time[0].start_time);
  const time1 = formatDate(time[1].start_time);
  const time2 = formatDate(time[2].start_time);
  if (!time) return null;
  if (req.body.Body ==="1") { 
        console.log("post option 1 to calendar")
        twiml.message(`Confirming ${time0}. Talk soon!`);
        res.type('text/xml').send(twiml.toString());
    } else if (req.body.Body ==="2") {
        console.log("post option 2 to calendar")
        twiml.message(`Confirming ${time1}. Talk soon!`);
        res.type('text/xml').send(twiml.toString());
    } else if (req.body.Body ==="3") {
        console.log("post option 3 to calendar")
        twiml.message(`Confirming ${time2}. Talk soon!`);
        res.type('text/xml').send(twiml.toString());
    } else { 
        twiml.message(`Here are a few times I'm free. Reply with 1 to schedule ${time0}, 2 to schedule ${time1}, or 3 to schedule ${time2}`);
        res.type('text/xml').send(twiml.toString());
  }
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});