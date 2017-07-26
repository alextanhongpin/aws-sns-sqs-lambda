
const Publisher = (AWS) => {
  const sns = new AWS.SNS({
    apiVersion: '2010-03-31',
    region: process.env.AWS_REGION || 'ap-southeast-1'
  })

  return {
    publish ({ topic, subject, message }) {
      const params = {
        Message: JSON.stringify(message),
        Subject: subject,
        TopicArn: topic
      }
      return new Promise((resolve, reject) => {
        sns.publish(params, (err, data) => {
          err ? reject(err) : resolve(data)
        })
      })
    }
  }
}

module.exports = Publisher
