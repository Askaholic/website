let flash = {};
let request = require('request');
let error = require('./error');

exports = module.exports = function (req, res) {

  let locals = res.locals;

  locals.formData = req.body || {};

  // validate the input
  req.checkBody('usernameOrEmail', 'Username or email is required').notEmpty();

  // check the validation object for errors
  let errors = req.validationErrors();

  //Must have client side errors to fix
  if (errors) {
    flash.class = 'alert-danger';
    flash.messages = errors;
    flash.type = 'Error!';

    res.render('account/requestPasswordReset', {flash: flash});
  } else {
    let identifier = req.body.usernameOrEmail;

    let overallRes = res;

    //Run post to reset endpoint
    request.post({
      url: process.env.API_URL + '/users/requestPasswordReset',
      form: {identifier: identifier}
    }, function (err, res, body) {

      if (res.statusCode !== 200) {
        error.parseApiErrors(body, flash);
        return overallRes.render('account/requestPasswordReset', {flash: flash});
      }

      // Successfully reset password
      flash.class = 'alert-success';
      flash.messages = [{msg: 'Your password is in the process of being reset, please reset your password by clicking on the link provided in an email.'}];
      flash.type = 'Success!';

      overallRes.render('account/requestPasswordReset', {flash: flash});
    });
  }
};
