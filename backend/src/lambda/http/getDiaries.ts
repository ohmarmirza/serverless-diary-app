import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getDiariesForUser } from '../../businessLogic/diaries'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'

const logger = createLogger('getDiaries')

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info('Handler - Processing getDiaries event', { event })

    const userId = getUserId(event)
    const diaries = await getDiariesForUser(userId);

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
