const redisClient = require('./signin').redisClient;

const revokeAuth = (req, res) => {
  const { authorization } = req.headers;
  redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json('Unauthorized');
    }
    redisClient.del(authorization, (err, reply) => {
      if (!err && reply) {
        res.json({ success: true })
      }
      else {
        res.status(404).json('Unauthorized deletion');
      }
    })
  })
}

module.exports = {
  revokeAuth: revokeAuth
}