'use strict'

const sqsQueueUrl = process.env.SQS_QUEUE_URL

const AWS = require('aws-sdk')
AWS.config.update({
  region: 'ap-southeast-1'
  // credentials: new AWS.SharedIniFileCredentials({ profile: 'poc-delivery' })
})

const sqs = new AWS.SQS({
  apiVersion: '2012-11-05',
  region: 'ap-southeast-1'
})

const sns = new AWS.SNS({
  apiVersion: '2010-03-31',
  region: 'ap-southeast-1'
})

const EMAIL_SNS_ARN = process.env.EMAIL_SNS_ARN
const PUSH_NOTIFICATION_SNS_ARN = process.env.PUSH_NOTIFICATION_SNS_ARN

console.log('SQS_QUEUE_URL', sqsQueueUrl)

// From sns-pub > sqs -> lambda
module.exports.index = (event, context, callback) => {
  console.log('Starting broadcaster')
  const receiveMessageParams = {
    QueueUrl: sqsQueueUrl
  }

  sqs.receiveMessage(receiveMessageParams, (err, data) => {
    if (err) {
      return callback(err)
    }
    if (data && data.Messages && data.Messages.length > 0) {
      // Do something with data here

      const jsonMessages = data.Messages.map((message) => {
        return JSON.parse(message.Body)
      }).map((body) => {
        return JSON.parse(body.Message)
      })
      console.log(jsonMessages)
      const isEmailTopic = Math.random() > 0.5

      const params = {
        Message: JSON.stringify({
          message: 'Hello world'
        }),
        Subject: isEmailTopic ? 'Sending as email' : 'Sending as push notification',
        TopicArn: isEmailTopic ? EMAIL_SNS_ARN : PUSH_NOTIFICATION_SNS_ARN
      }

      console.log(isEmailTopic ? 'Sending as email' : 'Sending as push notification')
      sns.publish(params, (err, _) => {
        const deleteMessageParams = {
          QueueUrl: sqsQueueUrl,
          ReceiptHandle: data.Messages[0].ReceiptHandle
        }
        if (err) {
          sqs.deleteMessage(deleteMessageParams, (sqsErr, _) => {
            if (sqsErr) {
              return callback(err)
            }
          })
          return callback(err)
        }

        sqs.deleteMessage(deleteMessageParams, callback)
      })
    }
  })
}
