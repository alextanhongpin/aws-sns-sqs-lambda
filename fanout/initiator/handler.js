'use strict'

const AWS = require('aws-sdk')
AWS.config.apiVersions = {
  sns: '2010-03-31'
}
AWS.config.region = 'ap-southeast-1'

const sns = new AWS.SNS()

console.log(process.env.SNS_ARN)

module.exports.index = (event, context, callback) => {
  const params = {
    Message: JSON.stringify({
      message: 'POC Initiator',
      integerData: 1,
      booleanData: false,
      stringData: 'Hello world',
      arrayData: [1, 2, 3]
    }),
    Subject: 'POC Initiator',
    TopicArn: process.env.SNS_ARN
  }

  console.log('Publishing to SNS...')
  Array(10).fill(0).forEach(() => {
    sns.publish(params, callback)
  })
}
