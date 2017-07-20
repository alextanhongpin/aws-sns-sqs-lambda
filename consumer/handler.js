'use strict'

const AWS = require('aws-sdk')
AWS.config.update({
  region: 'ap-southeast-1',
  credentials: new AWS.SharedIniFileCredentials({ profile: 'poc-delivery' })
})
const sqs = new AWS.SQS({
  apiVersion: '2012-11-05'
})

// From sns-pub > sqs -> lambda
module.exports.consumer = (event, context, callback) => {
  const sqsQueueUrl = ''
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
      var deleteMessageParams = {
        QueueUrl: sqsQueueUrl,
        ReceiptHandle: data.Messages[0].ReceiptHandle
      }
      console.log(data)
      sqs.deleteMessage(deleteMessageParams, callback)
    }
  })
}
