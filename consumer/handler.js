'use strict'

const AWS = require('aws-sdk')
const sqs = new AWS.SQS()

// From sns-pub > sqs -> lambda
module.exports.hello = (event, context, callback) => {
  const sqsQueueUrl = 'https://sqs.eu-west-1.amazonaws.com/XXXXXXXXXXXX/dummy-queue'
  const receiveMessageParams = {
    QueueUrl: sqsQueueUrl
  }

  sqs.receiveMessage(receiveMessageParams, (err, data) => {
    if (data.Messages && data.Messages.length > 0) {
          // Do something with data here
      var deleteMessageParams = {
        QueueUrl: sqsQueueUrl,
        ReceiptHandle: data.Messages[0].ReceiptHandle
      }
      sqs.deleteMessage(deleteMessageParams, callback)
    }
  })
}
