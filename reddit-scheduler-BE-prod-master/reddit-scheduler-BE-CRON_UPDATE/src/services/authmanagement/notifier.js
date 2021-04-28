module.exports = function(app) {

    function getLink(type, hash) {
      const url = 'https://onlybands.xyz/reddit_api/' + type + '?token=' + hash
      return url
    }
  
    function sendEmail(email) {
      return app.service('mailer').create(email).then(function (result) {
        console.log('Sent email', result)
      }).catch(err => {
        console.log('Error sending email', err)
      })
    }
  
    return {
      notifier: function(type, user, notifierOptions) {
        let tokenLink
        let email
        switch (type) {
          case 'resendVerifySignup': //sending the user the verification email
            tokenLink = getLink('verify', user.verifyToken)
            email = {
               from: process.env.FROM_EMAIL,
               to: user.email,
               subject: 'Verify Signup',
               html: tokenLink
            }
            return sendEmail(email)
            break
  
          case 'verifySignup': // confirming verification
            tokenLink = getLink('verify', user.verifyToken)
            email = {
               from: process.env.FROM_EMAIL,
               to: user.email,
               subject: 'Confirm Signup',
               html: 'Thanks for verifying your email'
            }
            return sendEmail(email)
            break
  
          case 'sendResetPwd':
          
            tokenLink = getLink('reset', user.resetToken)
            email = {
              from: process.env.GMAIL,
              to: user.email,
              subject: 'Reset Password',
              html:tokenLink 
            }
            return sendEmail(email)
            break
  

  
          case 'passwordChange':
            email = {}
            
            return sendEmail(email)
            break
  
          case 'identityChange':
            tokenLink = getLink('verifyChanges', user.verifyToken)
            email = {}
            return sendEmail(email)
            break
  
          default:
            break
        }
      }
    }
  }