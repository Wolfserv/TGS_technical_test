/**
 * OfferController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

let opencage = require('opencage-api-client');
let request = require('request');
let baseTGSUrl = 'https://staging.api.external.thegoodseat.fr/';

function checkBody(body) {
  let mandatoryKeys = ['startAddress', 'endAddress'];
  let k = true;

  for (let key of mandatoryKeys) {
    if (!(key in body)) {
      k = false;
    }
  }
  return k;
}

function checkAuthorization(headers) {
  if (!('authorization' in headers)) {
    return false;
  }
  let auth = headers.authorization.split(' ')
  try {
    if (auth[0] === 'Bearer' && auth[1] !== undefined && auth.length == 2) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

async function addressToCoord(address) {
  return opencage.geocode({q: decodeURI(address)}).then(data => {
      if (data.status.code === 200) {
        if (data.results.length > 0) {
          var place = data.results[0];
          return place.geometry;
        }
      } else {
        console.log('error', data.status.message);
      }
    }).catch(error => {
      console.log('error', error.message);
    });
}

module.exports = {
    search: async function (req, res) {
      if (!checkAuthorization(req.headers) || !checkBody(req.body)) {
        res.status(400).send({message: "Bad request."});
        return;
      }
      let sort = ''
      if (req.params.sortBy) {
        let s = req.params.sortBy.split('=')[1]
        sort = (s === 'price' || s === 'arrivalTime') ? {
          key: s,
          by: "asc"
        } : {};
      }
      let userToken = req.headers.authorization.split(' ')[1];
      let url = baseTGSUrl + 'getalloffers';
      await addressToCoord(req.body.startAddress).then(async place1 => {
        let startLatitude = place1.lat;
        let startLongitude = place1.lng;
        await addressToCoord(req.body.endAddress).then(place2 => {
          let endLatitude = place2.lat;
          let endLongitude = place2.lng;
          let data = {
            startLatitude: startLatitude,
            endLatitude: endLatitude,
            startLongitude: startLongitude,
            endLongitude: endLongitude,
            sort: sort
          }
          request(url, {
            method: "POST",
            headers: {
              'x-api-key': sails.config.custom.TGS_KEY,
              usertoken: userToken,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }, function (err, response, body) {
            if (err) {
              sails.log(err);
              res.status(400).send(err);
            } else {
              body = JSON.parse(body);
              res.status(200).send(body);
            }
          })
        });
      });
    }
};
