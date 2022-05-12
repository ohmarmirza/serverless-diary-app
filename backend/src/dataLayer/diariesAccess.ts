import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { DiaryItem } from "../models/DiaryItem"
import { DiaryUpdate } from '../models/DiaryUpdate'
import { Types } from 'aws-sdk/clients/s3'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('diariesAccess')

export class DiariesAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly s3Client: Types = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly diariesTable = process.env.DIARIES_TABLE,
        private readonly diariesCreatedAtIndex = process.env.DIARIES_CREATED_AT_INDEX,
        private readonly s3BucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION || 3000) {
    }

    async getDiariesForUser(userId: string): Promise<DiaryItem[]> {
        logger.info(`DiariesAccess - Getting all diaries for user ${userId}`)

        const result = await this.docClient.query({
            TableName: this.diariesTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items
        return items as DiaryItem[]
    }
    async getDiariesForUserByDate(userId: string, date: Date): Promise<DiaryItem[]> {
        logger.info(`DiariesAccess - Getting all diaries for user ${userId} on date ${date.toISOString()}`)

        const result = await this.docClient.query({
            TableName: this.diariesTable,
            IndexName: this.diariesCreatedAtIndex,
            KeyConditionExpression: 'userId = :userId and createdAt = :createdAt',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':createdAt': date.toISOString().split('T')[0]
            }
        }).promise()

        const items = result.Items
        return items as DiaryItem[]
    }

    async getDiary(diaryId: string, userId: string): Promise<Boolean> {
        logger.info(`DiariesAccess - Getting diary ${diaryId} for user ${userId}`)

        const result = await this.docClient.get({
            TableName: this.diariesTable,
            Key: {
                "userId": userId,
                "diaryId": diaryId
            }
        }).promise()

        return !!result.Item
    }

    async createDiary(diaryItem: DiaryItem): Promise<DiaryItem> {

        logger.info('DiariesAccess - Creating a new diary ', diaryItem)

        await this.docClient.put({
            TableName: this.diariesTable,
            Item: diaryItem
        }).promise()

        return diaryItem
    }

    async updateDiary(diaryId: string, userId: string, diaryUpdate: DiaryUpdate) {

        logger.info(`DiariesAccess - Updating diary ${diaryId} for user ${userId}`, diaryUpdate)

        const result = await this.docClient.update({
            TableName: this.diariesTable,
            Key: {
                "userId": userId,
                "diaryId": diaryId
            },
            UpdateExpression: "set #title = :title, #description = :description",
            ExpressionAttributeNames: {
                '#title': 'title',
                '#description': 'description'
            },
            ExpressionAttributeValues: {
                ':title': diaryUpdate.title,
                ':description': diaryUpdate.description
            },
            ReturnValues: 'ALL_NEW'
        }).promise()

        logger.info(`DiariesAccess - Result of updating diary ${diaryId} for user ${userId}`, result);
    }
    async deleteDiary(diaryId: string, userId: string) {

        logger.info(`DiariesAccess - Deleting diary ${diaryId} for user ${userId}`)

        const result = await this.docClient.delete({
            TableName: this.diariesTable,
            Key: {
                "userId": userId,
                "diaryId": diaryId
            },
        }).promise()

        logger.info(`DiariesAccess - Result of deleting diary ${diaryId} for user ${userId}`, result)
    }
    createAttachmentPresignedUrl(diaryId: string): string {

        logger.info(`DiariesAccess - Creating Attachment PresignedUrl for diary ${diaryId}`)

        return this.s3Client.getSignedUrl('putObject', {
            Bucket: this.s3BucketName,
            Key: diaryId,
            Expires: Number(this.urlExpiration)
        })

    }
}