import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteDiary } from '../../businessLogic/diaries'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'


const logger = createLogger('deleteTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Handler - Processing deleteDiary event', { event })
    const diaryId = event.pathParameters.diaryId
    const userId = getUserId(event)
    await deleteDiary(diaryId, userId)

    return {
      statusCode: 200,
      body: ''
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
