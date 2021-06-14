import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonmiddleware from '../../../lib/commonmiddleware';

import createError from 'http-errors';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {

  let auctions;

  try {
    auctions = await dynamoDB.scan({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      // Item: auctionPayload,
    }).promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    id: uuid,
    body: JSON.stringify({
      message: 'Hello world from Nigeria',
      auctions: auctions?.Items || [],
    }),
  };
}

export const handler = commonmiddleware(getAuction);
// export const handler = middy(getAuction)
//   .use(httpJsonBodyParser())
//   .use(httpEventNormalizer())
//   .use(httpErrorHandler());