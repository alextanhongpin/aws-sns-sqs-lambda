'use strict'

const AWS = require('aws-sdk')
AWS.config.apiVersions = {
  sns: '2010-03-31'
}
AWS.config.region = 'ap-southeast-1'

const sns = new AWS.SNS()

module.exports.producer = (event, context, callback) => {
  const params = {
    Message: JSON.stringify({
      message: 'Hello world'
    }),
    Subject: 'Text SNS from Lambda',
    TopicArn: 'arn:aws:sns:ap-southeast-1:*:*'
  }

  console.log('Publishing to SNS...')
  sns.publish(params, callback)
}
