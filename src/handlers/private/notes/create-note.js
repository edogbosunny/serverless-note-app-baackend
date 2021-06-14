import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonmiddleware from '../../../lib/commonmiddleware';


const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function createNote(event, context) {

  try {
    const payload = event.body;
    if (!payload?.email) {
      return {
        statusCode: 400,
        body: JSON.stringify(new createError.NotFound()),
      };
    }
    let isoDate = new Date().toISOString();

    const auctionPayload = {
      id: uuid(),
      status: 'OPEN',
      createdAt: isoDate,
      title: payload?.title || '',
      email: payload?.email,
      note: payload?.note || ''
    };

    await dynamoDB.put({
      TableName: process.env.NOTES_TABLE_NAME,
      Item: auctionPayload,
    }).promise();

    return {
      statusCode: 201,
      headers: {
        /* Required for CORS support to work */
        'Access-Control-Allow-Origin': '*',
        /* Required for cookies, authorization headers with HTTPS */
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
