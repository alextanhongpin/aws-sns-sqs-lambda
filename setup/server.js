const AWS = require('aws-sdk')
const fs = require('fs')

const config = {
  TopicArn: '',
  QueueUrl: '',
  DeadLetterQueueUrl: '',
  QueueArn: ''
}

// Environment Variables
const SNS_TOPIC = 'Email' // Format (Capitalized)
const QUEUE_NAME = 'email' // SQS Queue Name
const AWS_REGION = 'ap-southeast-1'
const AWS_PROFILE = 'poc-delivery'
const OUTPUT_FILE = `${SNS_TOPIC}-config.json`

// Configure AWS
AWS.config.update({
  region: AWS_REGION,
  credentials: new AWS.SharedIniFileCredentials({ profile: AWS_PROFILE })
})
const sns = new AWS.SNS({
  region: AWS_REGION
})

const sqs = new AWS.SQS({
  region: AWS_REGION
})

function createTopic (config) {
  return new Promise((resolve, reject) => {
    console.log('createTopic', config)
    sns.createTopic({
      Name: SNS_TOPIC
    }, (err, result) => {
      if (err) {
        reject(err)
      } else {
        console.log('Created topic successfully:\n')
        config.TopicArn = result.TopicArn
        resolve(config)
      }
    })
  })
}

function createQueue (config) {
  return new Promise((resolve, reject) => {
    sqs.createQueue({
      QueueName: QUEUE_NAME
    }, (err, result) => {
      if (err) {
        reject(err)
      } else {
        console.log('Created queue successfully:\n')
        config.QueueUrl = result.QueueUrl
        resolve(config)
      }
    })
  })
}

function createDeadLetterQueue (config) {
  return new Promise((resolve, reject) => {
    sqs.createQueue({
      QueueName: `${QUEUE_NAME}-dead-letter-queue`,
      Attributes: {
        MessageRetentionPeriod: '1209600',
        ReceiveMessageWaitTimeSeconds: '0'
      }
    }, (err, result) => {
      if (err) {
        reject(err)
      } else {
        console.log('Created dead-letter-queue successfully:\n')
        config.DeadLetterQueueUrl = result.QueueUrl
        resolve(config)
      }
    })
  })
}

function getQueueAttr (config) {
  return new Promise((resolve, reject) => {
    sqs.getQueueAttributes({
      QueueUrl: config.QueueUrl,
      AttributeNames: ['QueueArn']
    }, (err, result) => {
      if (err) {
        reject(err)
      } else {
        console.log('Got queue arn:\n')
        config.QueueArn = result.Attributes.QueueArn
        resolve(config)
      }
    })
  })
}

function getDeadLetterQueueAttr (config) {
  return new Promise((resolve, reject) => {
    sqs.getQueueAttributes({
      QueueUrl: config.DeadLetterQueueUrl,
      AttributeNames: ['QueueArn']
    }, (err, result) => {
      if (err) {
        reject(err)
      } else {
        console.log('Got queue arn:\n')
        config.DeadLetterQueueArn = result.Attributes.QueueArn
        resolve(config)
      }
    })
  })
}

function snsSubscribe (config) {
  return new Promise((resolve, reject) => {
    sns.subscribe({
      TopicArn: config.TopicArn,
      Protocol: 'sqs',
      Endpoint: config.QueueArn
    }, (err, result) => {
      if (err) {
        reject(err)
      } else {
        console.log('Subscribed to queue arn:\n')
        resolve(config)
      }
    })
  })
}

function setQueueAttr (config) {
  const queueUrl = config.QueueUrl
  const topicArn = config.TopicArn
  const sqsArn = config.QueueArn

  const attributes = {
    Version: '2008-10-17',
    Id: sqsArn + '/SQSDefaultPolicy',
    Statement: [{
      Sid: 'Sid' + new Date().getTime(),
      Effect: 'Allow',
      Principal: {
        AWS: '*'
      },
      // Must have both send and receive message
      Action: [
        'SQS:ReceiveMessage',
        'SQS:SendMessage'
      ],
      Resource: sqsArn,
      Condition: {
        ArnEquals: {
          'aws:SourceArn': topicArn
        }
      }
    }
    ]
  }

  return new Promise((resolve, reject) => {
    sqs.setQueueAttributes({
      QueueUrl: queueUrl,
      Attributes: {
        Policy: JSON.stringify(attributes),
        MessageRetentionPeriod: '1209600', // 14 days, defaults to  345600 (4 days).
        VisibilityTimeout: '60', // Defaults to 30
        RedrivePolicy: JSON.stringify({
          deadLetterTargetArn: config.DeadLetterQueueArn,
          // Is this the right amount?
          maxReceiveCount: 10
        }),
        ReceiveMessageWaitTimeSeconds: '20'
      }
    }, (err, result) => {
      if (err) {
        reject(err)
      } else {
        console.log('Set queue attributes:\n')
        resolve(config)
      }
    })
  })
}

function writeConfigFile (config) {
  return new Promise((resolve, reject) => {
    fs.writeFile(OUTPUT_FILE, JSON.stringify(config, null, 4), (err) => {
      if (err) {
        reject(err)
      } else {
        console.log(`config saved to ${OUTPUT_FILE}`)
        resolve(true)
      }
    })
  })
}

Promise.resolve(config)
.then(createTopic)
.then(createQueue)
.then(getQueueAttr)
.then(createDeadLetterQueue)
.then(getDeadLetterQueueAttr)
.then(snsSubscribe)
.then(setQueueAttr)
.then(writeConfigFile)
.catch((err) => {
  throw err
})
