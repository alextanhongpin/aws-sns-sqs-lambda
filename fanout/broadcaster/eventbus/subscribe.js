const Subscriber = (AWS) => {
  const sqs = new AWS.SQS({
    apiVersion: '2012-11-05',
    region: process.env.AWS_REGION || 'ap-southeast-1'
  })

  return {
    parseData (data) {
      if (data && data.Messages && data.Messages.length > 0) {
        // Parse data and convert the string body to json
        return data.Messages.map((message) => {
          return [message.ReceiptHandle, JSON.parse(message.Body)]
        }).map(([receiptHandle, body]) => {
          return [receiptHandle, JSON.parse(body.Message)]
        })
      }
      return []
    },
    subscribe (queueUrl) {
      const params = {
        QueueUrl: queueUrl
      }
      return new Promise((resolve, reject) => {
        sqs.receiveMessage(params, (err, data) => {
          err ? reject(err) : resolve(data)
        })
      })
    },
    unsubscribe (queueUrl, receiptHandle) {
      const params = {
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle
      }
      return new Promise((resolve, reject) => {
        sqs.deleteMessage(params, (err, data) => {
          err ? reject(err) : resolve(data)
        })
      })
    }
  }
}

module.exports = Subscriber
