import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonmiddleware from '../../../lib/commonmiddleware';

import createError from 'http-errors';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function listNotes(event, context) {

  try {
    if (!event?.requestContext?.authorizer?.name) {
      return {
        statusCode: 400,
        body: JSON.stringify(new createError.NotFound()),
      };
    }

    let auctions;

    let response = auctions = await dynamoDB.query({
      TableName: process.env.NOTES_TABLE_NAME,
      // TableName: tableName,
      IndexName: 'emailkey',
      KeyConditionExpression: `email = :hkey`,
      ExpressionAttributeValues: {
        ':hkey': 'test@test.com',
      }
    }).promise();

    if (!response) {
      return {
        statusCode: 400,
        body: JSON.stringify(new createError.NotFound()),
      };
    }

    return {
      statusCode: 200,
      id: uuid,
      body: JSON.stringify({
        message: 'Hello world from Nigeria',
        auctions: auctions?.Items || [],
      }),
    };
  } catch (error) {
    console.log(error)
    // retur generic errors and check stack logs to debug futher
    return {
      statusCode: 500,
      body: JSON.stringify(new createError.InternalServerError(), error),
    };
  }
}

export const handler = commonmiddleware(listNotes);
