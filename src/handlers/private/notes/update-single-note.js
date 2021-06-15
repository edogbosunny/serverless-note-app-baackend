import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonmiddleware from '../../../lib/commonmiddleware';

import createError from 'http-errors';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {

  let auction = null;
  const { id } = event.pathParameters;
  const payload = event.body;

  try {
    auction = await dynamoDB.update({
      TableName: process.env.NOTES_TABLE_NAME,
      // Key: { id },
      Key: { id },
      UpdateExpression: `set note = :note`,
      ExpressionAttributeValues: {
          ':note': payload?.note,
      },
      ReturnValues: 'ALL_NEW',
    }).promise();

console.log('ppppp', auction)
    if (!auction?.Attributes) {
      return {
        statusCode: 400,
        body: JSON.stringify(new createError.NotFound()),
      };
    }
    return {
      statusCode: 200,
      id: uuid,
      body: JSON.stringify({
        auctions: auction?.Attributes,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(new createError.InternalServerError(), error),
    };
  }
}

export const handler = commonmiddleware(getAuction);
