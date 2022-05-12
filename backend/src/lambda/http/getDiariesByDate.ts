import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getDiariesForUserByDate } from '../../businessLogic/diaries'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'

const logger = createLogger('getDiariesByDate')

function isDate(dateStr) {
  return !isNaN(new Date(dateStr).getDate());
}
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info('Handler - Processing getDiariesByDate event', { event })

    const date = event.pathParameters.date
    const userId = getUserId(event)

    if (!isDate(date)) {
      throw new Error("Invalid date passed")
    }

    const diaries = await getDiariesForUserByDate(userId, new Date(date));

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
