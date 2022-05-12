import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { CreateDiaryRequest } from '../../requests/CreateDiaryRequest'
import { getUserId } from '../utils';
import { createDiary } from '../../businessLogic/diaries'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createDiary')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Handler - Processing createDiary event', { event })

    const newDiary: CreateDiaryRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    const item = await createDiary(userId, newDiary)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item
      })
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
