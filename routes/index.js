var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:token', async function(req, res, next) {

  let token = req.params.token;

  let tokenData = await req.tokens.findOne({token:token});

  if (tokenData === null) {
    res.render('not_found', { token: token} )
  } else if (tokenData.expiryDate == null) {
    res.render('prepare', { tokenData: tokenData });
  } else if (tokenData.expiryDate >= new Date()) {
    res.render('in_progress', {tokenData:tokenData});
  } else if (tokenData.expiryDate < new Date()) {
    res.render('finished', {tokenData:tokenData});
  } else {
    res.render('index', { title: 'Very Hard Coding test' });
  }

});

router.post('/:token', async function(req, res, next) {

  let token = req.params.token;

  let tokenData = await req.tokens.findOne({token:token});

  if (tokenData !== null && tokenData.expiryDate !== null && tokenData.expiryDate >= new Date()) {
    let code = req.body.code;

    await req.tokens.update({token:token}, {$set: {code : code}});
  }

  res.redirect(`/${token}/`);
});

router.get('/:token/start', async function(req, res, next) {
  let token = req.params.token;

  let tokenData = await req.tokens.findOne({token: token});

  if (tokenData === null) {
    res.render('not_found', {token: token})
  } else {
    if (tokenData.expiryDate == null) {
      let expiryDate = new Date();
      expiryDate.setMinutes(new Date().getMinutes() + 30);
      await req.tokens.updateOne({token:token}, {$set: { expiryDate : expiryDate}});
    }

    res.redirect(`/${token}/`);
  }

});

module.exports = router;
