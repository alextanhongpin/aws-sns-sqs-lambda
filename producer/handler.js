'use strict'

const AWS = require('aws-sdk')
const sns = new AWS.SNS()

module.exports.hello = (event, context, callback) => {
  const eventText = JSON.stringify(event)

  const params = {
    Message: eventText,
    Subject: 'Text SNS from Lambda',
    TopicArn: 'arn:aws:sns:ap-southeast-1:*:test-topic1'
  }

  // Publish to an sns
  sns.publish(params, callback)
}
