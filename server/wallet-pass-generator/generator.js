const pass = require('./pass');
const balance = require('./balance');
const auth = require('./auth');

module.exports.handler = async (event) => {
  console.log('Event: ', event);

  if (validateInput(event.queryStringParameters).length > 0) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Required parameters ${validateInput(event.queryStringParameters).join(';')} not provided`,
      }),
    }
  }
  
  const wallet = event.queryStringParameters['wallet'];
  const signature = event.queryStringParameters['nonce'];
  const token = event.queryStringParameters['token'];
  const decimals = parseInt(event.queryStringParameters['decimals']);
  return balance.getBalance(token, wallet, decimals).then((balance) => {
    console.log(`${wallet}'s balance of ${token} is '${balance}'`);
    return auth.isOwner(signature, wallet, token, balance).then((isOwner) => {
      console.log('is owner', isOwner);
      if (!isOwner) {
        console.log("You're not an owner", isOwner);
        return {
          statusCode: 403,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Sorry you don't own ${wallet}`,
          }),
        };
      }

      return pass.getPass(wallet).then((buffer) => {
        console.log("Created Pass");
        try {
          return {
            statusCode: 200,
            headers: {
              'Content-Disposition': 'attachment;filename=angelsgate.pkpass',
              'Content-Type': 'application/vnd.apple.pkpass',
            },
            body: buffer.toString('base64'),
            isBase64Encoded: true
          }
        } catch (err) {
          console.log("Failed with error", err);
          return {
            statusCode: 500,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: err.message,
            }),
          }
        }
      }).catch((err) => {
        console.log("Failed with error", err);
        return {
          statusCode: 500,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: err.message,
          }),
        }
      });
    });
  
  }).catch((err) => {
    console.log("Failed with error", err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: err.message,
      }),
    }
  });
}

const validateInput = (queryStringParameters) => {
  const requiredParams = ['wallet', 'nonce', 'token', 'decimals'];
  if (!queryStringParameters) return requiredParams;

  const missingParams = [];

  requiredParams.forEach((param) => {
    if (!queryStringParameters[param]) {
      missingParams.push(param);
    }
  });

  return missingParams;
};
