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
module.exports.consumer = (event, context, callback) => {
  console.log('Starting consumer')
  const receiveMessageParams = {
    QueueUrl: sqsQueueUrl
  }

  sqs.receiveMessage(receiveMessageParams, (err, data) => {
    if (err) {
      console.log(err)
      return callback(err)
    }
    if (data && data.Messages && data.Messages.length > 0) {
    // Do something with data here
      const deleteMessageParams = {
        QueueUrl: sqsQueueUrl,
        ReceiptHandle: data.Messages[0].ReceiptHandle
      }
      console.log(data)
      setTimeout(() => {
        sqs.deleteMessage(deleteMessageParams, callback)
      }, 1000)
    }
  })
}
