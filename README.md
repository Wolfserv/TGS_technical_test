# tgs-technical-test


# API Documentation

## POST /api/users/register

**Body:**
```
    {
      firstName: 'string',             *required*
      lastName: 'string',              *required*
      email: 'string',                 *required*
      birthDate: 'string',             *required*
      phoneNumber: 'string',           *required*
      country: 'string',               *required*
      isVerifiedPhoneNumber: 'boolean' *required*
    }
```
**Response:**
```
  {
    message: 'string',
    token: 'string'  // only if user registered a new account
  }
```



## POST /api/users/login

**Body:**
```
  {
    email: 'string',      *required*
    phoneNumber: 'string' *required*
  }
```
**Response:**
```
  {
    message: 'string,
    token: 'string' // only if user logged in
  }
```

## POST /api/offers/search/:sortBy?
*/api/offers/search*
OR
*/api/offers/search/sortBy=*

**Headers:**
```
  {
     Authorization: 'string', *required* // 'Bearer ' + token obtained with login/register endpoint
  }
```

**Params:**
```
  {
    sortBy: 'string' *optional* // 'price' or 'arrivalTime'
  }
```
Use this optional parameter to sort JSON by increasing price or increasing  arrival time.

**Body:**
```
  {
    startAddress: 'string', *required* // number + ' ' + street + ", " + city (example: 47 Quai d'Austerlitz, Paris)
    endAddress: 'string'    *required*
  }
```

**Response:**
```
  {
    statusCode: 'string',
      body: [
        {
          offerId: 'string',
          providerCode: 'string',
          category: 'string',
          price: 'number',
          currency: 'string',
          internalDeepLinkUrl: 'boolean'
        }
      ]
  }
```


### Version info

This app was originally generated on Sat Sep 05 2020 05:37:34 GMT-0400 (Eastern Daylight Time) using Sails v1.3.0.
