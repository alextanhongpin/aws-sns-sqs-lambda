'use strict'

const queueUrl = process.env.SQS_QUEUE_URL
const eventbus = require('./eventbus')

const AWS = require('aws-sdk')
AWS.config.update({
  region: 'ap-southeast-1'
  // credentials: new AWS.SharedIniFileCredentials({ profile: 'poc-delivery' })
})
const EMAIL_SNS_ARN = process.env.EMAIL_SNS_ARN
const PUSH_NOTIFICATION_SNS_ARN = process.env.PUSH_NOTIFICATION_SNS_ARN

const publisher = eventbus.Publisher(AWS)
const subscriber = eventbus.Subscriber(AWS)

// From sns-pub > sqs -> lambda
module.exports.index = (event, context, callback) => {
  console.log('Starting broadcaster')

  subscriber.subscribe(queueUrl).then((data) => {
    console.log(subscriber.parseData(data))

    const parsedData = subscriber.parseData(data)
    const messages = parsedData.map(([receiptHandle, body]) => {
      // From the data obtained, decide on which topic it needs to send to
      const isEmailTopic = Math.random() > 0.5
      console.log(isEmailTopic ? 'Sending as email' : 'Sending as push notification')
      const params = {
        message: {
          stringData: 'Any data can be passed here',
          integerData: 42,
          booleanData: false,
          arrayData: [1, 2, 3]
        },
        topic: isEmailTopic ? EMAIL_SNS_ARN : PUSH_NOTIFICATION_SNS_ARN,
        subject: isEmailTopic ? 'Sending as email' : 'Sending as push notification'
      }

      return publisher.publish(params).then(subscriber.unsubscribe(queueUrl, receiptHandle))
    })

    return Promise.all(messages)
  }).then((data) => {
    callback(null, {
      message: 'Done'
    })
  }).catch(callback)
}
