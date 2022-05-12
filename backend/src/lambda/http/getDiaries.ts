import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getDiariesForUser, getDiariesForUserByDate } from '../../businessLogic/diaries'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'

const logger = createLogger('getDiaries')

function isDate(dateStr) {
  return !isNaN(new Date(dateStr).getDate());
}

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info('Handler - Processing getDiaries event', { event })

    const userId = getUserId(event)
    let diaries = []
    const date = event.queryStringParameters?.date

    if (date && isDate(date)) {
      diaries = await getDiariesForUserByDate(userId, new Date(date));
    }
    else {
      diaries = await getDiariesForUser(userId);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: diaries
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
