/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

let baseUrl = 'https://staging.api.external.thegoodseat.fr/';
let request = require('request');

function checkBody(body, isLogin) {
  let mandatorySignupKeys = ['firstName', 'lastName', 'email', 'birthDate', 'phoneNumber', 'country', 'isPhoneNumberVerified'];
  let mandatoryLoginKeys = ['email', 'phoneNumber'];
  let k = true;
  for (let key of (isLogin? mandatoryLoginKeys : mandatorySignupKeys)) {
    if (!(key in body)) {
      k = false;
    }
  }
  return k;
}

module.exports = {
  register: async function(req, res) {
    if (!checkBody(req.body, false)) {
      res.status(400).send({message: 'Bad request.'});
      return;
    }
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
        body = JSON.parse(body)
        if (body.body.userExists) {
          res.status(409).send({message:"User already registered."});
        } else {
          res.status(200).send({
            message: "Successfully registered.",
            token: body.body.userToken
          });
        }
      }
    });
  },

  login: async function(req, res) {
    if (!checkBody(req.body, true)) {
      res.status(400).send({message: "Bad request."})
      return;
    }
    let url = baseUrl + 'loginuser';
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
        body = JSON.parse(body)
        if (body.statusCode === 500) {
          res.status(401).send({message: "Account not found."});
        } else {
          res.status(200).send(body);
        }
      }
    });
  }
};
