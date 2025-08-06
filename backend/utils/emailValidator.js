const validateEmail = email => {
  const gmailExtension = /^[a-zA-Z0-9.]+@g\.bracu\.ac\.bd$/
  if (!gmailExtension.test(email)) {
    return 'Only BRAC University email addresses (ending with @g.bracu.ac.bd) are allowed'
  }
  return null
}
module.exports = {
  validateEmail,
}
