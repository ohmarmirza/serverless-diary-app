import * as uuid from 'uuid'
import { DiariesAccess } from "../dataLayer/diariesAccess";
import { DiaryItem } from "../models/DiaryItem";
import { DiaryUpdate } from '../models/DiaryUpdate';
import { CreateDiaryRequest } from "../requests/CreateDiaryRequest";
import { UpdateDiaryRequest } from '../requests/UpdateDiaryRequest';
import { createLogger } from "../utils/logger";

const diariesAccess = new DiariesAccess()
const logger = createLogger('diarys')
const bucketName = process.env.ATTACHMENT_S3_BUCKET

export async function getDiariesForUser(userId: string): Promise<DiaryItem[]> {
    logger.info(`Diaries - Retrieving all diaries for user ${userId}`, { userId })
    return await diariesAccess.getDiariesForUser(userId)
}

export async function getDiariesForUserByDate(userId: string, date: Date): Promise<DiaryItem[]> {
    logger.info(`Diaries - Retrieving all diaries for user ${userId} on date ${date.toISOString()}`)
    return await diariesAccess.getDiariesForUserByDate(userId, date)
}

export async function createDiary(userId: string, request: CreateDiaryRequest): Promise<DiaryItem> {

    const diaryId = uuid.v4()

    const diaryItem: DiaryItem = {
        userId: userId,
        diaryId: diaryId,
        createdAt: new Date().toISOString(),
        title: request.title,
        description: request.description,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${diaryId}`
    }

    logger.info(`Diaries - Creating diary ${diaryId} for user ${userId}`, { diaryItem: diaryItem })

    return await diariesAccess.createDiary(diaryItem)
}
export async function updateDiary(diaryId: string, userId: string, request: UpdateDiaryRequest) {

    const diaryUpdate: DiaryUpdate = {
        title: request.title,
        description: request.description
    }

    logger.info(`Diaries - Updating diary ${diaryId} for user ${userId}`, { diaryUpdate: diaryUpdate })

    await diariesAccess.updateDiary(diaryId, userId, diaryUpdate)
}

export async function deleteDiary(diaryId: string, userId: string) {
    logger.info(`Diaries - Deleting diary ${diaryId} for user ${userId}`)

    await diariesAccess.deleteDiary(diaryId, userId)
}
export async function createAttachmentPresignedUrl(diaryId: string, userId: string): Promise<string> {
    logger.info(`Diaries - Creating Attachment PresignedUrl for diary ${diaryId} for user ${userId}`)

    const diaryExists = await diariesAccess.getDiary(diaryId, userId);

    if (!diaryExists) {
        throw new Error(`diary ${diaryId} for user ${userId} does not exist`)
    }

    return diariesAccess.createAttachmentPresignedUrl(diaryId)
}