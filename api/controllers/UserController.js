/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

let baseUrl = 'https://staging.api.external.thegoodseat.fr/';
let request = require('request');

module.exports = {
  register: async function(req, res) {
    let url = baseUrl + 'registeruser';
    request(url,{
      method: "POST",
      headers: {
        'x-api-key': sails.config.custom.TGS_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    }, function (err, response, body) {
      if (err) {
        sails.log(err);
        res.status(400).send(err);
      } else {
        res.status(200).send(body);
      }
    });
  }

};

