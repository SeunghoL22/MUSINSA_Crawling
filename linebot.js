const request = require("request");

const token = 'your token';
const api_url = 'https://notify-api.line.me/api/notify';

const headers = {
    Authorization: "Bearer " + token,
    "Content-Type": "application/x-www-form-urlencoded",
};

function sendBot(msg)
{

    const options = {
        url: api_url,
        method: 'POST',
        headers: headers,
        body: `message=${encodeURIComponent(msg)}`,
        }
    

    

    request(options,(req,res,body)=>
    {
        console.log(res.body);
    })
}


module.exports = {
    sendBot: sendBot,
};