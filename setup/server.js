const AWS = require('aws-sdk')
const fs = require('fs')

const config = {
  TopicArn: '',
  QueueUrl: '',
  QueueArn: ''
}

// Environment Variables
const SNS_TOPIC = 'Initiator'
const QUEUE_NAME = 'initiator' // SQS Queue Name
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
        console.log(result)
        config.TopicArn = result.TopicArn
        resolve(config)
      }
    })
  })
}

function createQueue (config) {
  return new Promise((resolve, reject) => {
    console.log('createQueue', config)
    sqs.createQueue({
      QueueName: QUEUE_NAME
    }, (err, result) => {
      if (err) {
        reject(err)
      } else {
        console.log('Created queue successfully:\n')
        console.log(result)
        config.QueueUrl = result.QueueUrl
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
        console.log(result)
        config.QueueArn = result.Attributes.QueueArn
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
        console.log(result)
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
        MessageRetentionPeriod: 1209600, // 14 days, defaults to  345600 (4 days).
        VisibilityTimeout: 60, // Defaults to 30
        RedrivePolicy: JSON.stringify({
          deadLetterTargetArn: `${QUEUE_NAME}-dead-letter-queue`,
          // Is this the right amount?
          maxReceiveCount: 10
        }),
        ReceiveMessageWaitTimeSeconds: 20
      }
    }, (err, result) => {
      if (err) {
        reject(err)
      } else {
        console.log('Set queue attributes:\n')
        console.log(result)
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
        console.log('config saved to config.json')
        resolve(true)
      }
    })
  })
}

Promise.resolve(config)
.then(createTopic)
.then(createQueue)
.then(getQueueAttr)
.then(snsSubscribe)
.then(setQueueAttr)
.then(writeConfigFile)
.then((ok) => {
  console.log('Done')
})
.catch((err) => {
  throw err
})
