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

console.log('SQS_QUEUE_URL', sqsQueueUrl)

// From sns-pub > sqs -> lambda
module.exports.index = (event, context, callback) => {
  console.log('Starting push-notification delivery')
  const receiveMessageParams = {
    QueueUrl: sqsQueueUrl
  }

  sqs.receiveMessage(receiveMessageParams, (err, data) => {
    if (err) {
      return callback(err)
    }
    if (data && data.Messages && data.Messages.length > 0) {
      // Do something with data here
      const deleteMessageParams = {
        QueueUrl: sqsQueueUrl,
        ReceiptHandle: data.Messages[0].ReceiptHandle
      }
      const jsonMessages = data.Messages.map((message) => {
        return JSON.parse(message.Body)
      }).map((body) => {
        return JSON.parse(body.Message)
      })
      console.log(jsonMessages)
      sqs.deleteMessage(deleteMessageParams, callback)
    }
  })
}
