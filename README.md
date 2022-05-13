# Serverless Diaries

This is a simple diary serverless application where users can create/update/delete their own diaries
and attach images to them.
The code from lesson 4 (serverless todo app) was re-used.

# Functionality of the application

This application will allow creating/removing/updating/fetching Diary items. Each Diary item can optionally have an attachment image. Each user only has access to their own diaries.

# Diary entries

The application should store Diary items, and each Diary item contains the following fields:

* `userId` (string) - the id of the user creating the diary
* `diaryId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `title` (string) - title of the diary entry
* `description` (string) -  description of the diary entry
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a diary entry


## Prerequisites

* <a href="https://manage.auth0.com/" target="_blank">Auth0 account</a>
* <a href="https://github.com" target="_blank">GitHub account</a>
* <a href="https://nodejs.org/en/download/package-manager/" target="_blank">NodeJS</a> version up to 12.xx 
* Serverless 
   * Create a <a href="https://dashboard.serverless.com/" target="_blank">Serverless account</a> user
   * Install the Serverless Framework’s CLI  (up to VERSION=2.21.1). Refer to the <a href="https://www.serverless.com/framework/docs/getting-started/" target="_blank">official documentation</a> for more help.
   ```bash
   npm install -g serverless@2.21.1
   serverless --version
   ```
   * Login and configure serverless to use the AWS credentials 
   ```bash
   # Login to your dashboard from the CLI. It will ask to open your browser and finish the process.
   serverless login
   # Configure serverless to use the AWS credentials to deploy the application
   # You need to have a pair of Access key (YOUR_ACCESS_KEY_ID and YOUR_SECRET_KEY) of an IAM user with Admin access permissions
   sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_KEY --profile serverless
   ```
   
# Service Information

  service: serverless-diary-app. 
  stage: dev. 
  region: us-east-1. 
  stack: serverless-diary-app-dev. 
  
  endpoints:  
    * GET - https://q8k66u2w8f.execute-api.us-east-1.amazonaws.com/dev/diaries. 
    * POST - https://q8k66u2w8f.execute-api.us-east-1.amazonaws.com/dev/diaries. 
    * PATCH - https://q8k66u2w8f.execute-api.us-east-1.amazonaws.com/dev/diaries/{diaryId}. 
    * DELETE - https://q8k66u2w8f.execute-api.us-east-1.amazonaws.com/dev/diaries/{diaryId}. 
    * POST - https://q8k66u2w8f.execute-api.us-east-1.amazonaws.com/dev/diaries/{diaryId}/attachment. 
  
  functions:  
    * Auth: serverless-diary-app-dev-Auth. 
    * GetDiaries: serverless-diary-app-dev-GetDiaries. 
    * CreateDiary: serverless-diary-app-dev-CreateDiary. 
    * UpdateDiary: serverless-diary-app-dev-UpdateDiary. 
    * DeleteDiary: serverless-diary-app-dev-DeleteDiary. 
    * GenerateUploadUrl: serverless-diary-app-dev-GenerateUploadUrl. 

# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.
(this is adapted from lesson 4 of the todo app)

This frontend should work with your serverless application once it is developed, you don't need to make any changes to the code. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was done in the course and contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

## Logging

The starter code comes with a configured [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements. You can use it to write log messages like this:

```ts
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')

// You can provide additional information with every log statement
// This information can then be used to search for log statements in a log storage system
logger.info('User was authorized', {
  // Additional information stored with a log statement
  key: 'value'
})
```

# How to run the application

## Backend

Already deployed under my account. or if you would like to deployt it, do the following: 

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application locally run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless Diary application.

# Postman collection

An alternative way to test your API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project.
