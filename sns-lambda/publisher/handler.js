'use strict'

const AWS = require('aws-sdk')

AWS.config.update({
  region: 'ap-southeast-1'
})
const sns = new AWS.SNS({
  apiVersion: '2010-03-31',
  region: 'ap-southeast-1'
})

console.log(process.env.SNS_ARN)

module.exports.producer = (event, context, callback) => {
  const params = {
    Message: JSON.stringify({
      message: 'Hello world'
    }),
    Subject: 'Text SNS from Lambda',
    TopicArn: process.env.SNS_ARN
  }

  console.log('Publishing to SNS...')
  sns.publish(params, callback)
}
