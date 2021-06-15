import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonmiddleware from '../../../lib/commonmiddleware';


const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function createNote(event, context) {

  try {
    const payload = event.body;
    if (!event?.requestContext?.authorizer?.name) {
      return {
        statusCode: 400,
        body: JSON.stringify(new createError.NotFound()),
      };
    }
    let isoDate = new Date().toISOString();

    // !Todo Abstract the below into a service file...
    const auctionPayload = {
      id: uuid(),
      status: 'OPEN',
      createdAt: isoDate,
      title: payload?.title || '',
      email: event?.requestContext?.authorizer?.name,
      note: payload?.note || ''
    };

    await dynamoDB.put({
      TableName: process.env.NOTES_TABLE_NAME,
      Item: auctionPayload,
    }).promise();

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      id: uuid,
      body: JSON.stringify({
        message: 'Hello world from Nigeria',
        auction: auctionPayload,
      }),
    };

  }
  catch (error) {
    // retur generic errors and check stack logs to debu futher
    return {
      statusCode: 500,
      body: JSON.stringify(new createError.InternalServerError()),
    };
  }
}

export const handler = commonmiddleware(createNote);
