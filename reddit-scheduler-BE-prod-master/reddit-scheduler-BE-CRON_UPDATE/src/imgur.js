const imgur = require('imgur');

//imgur.setCredentials('cyberloh2@mail.ru', 'Myeasypass0.', '40b17620a4a6de6');
imgur.setAPIUrl('https://imgur-apiv3.p.rapidapi.com/');
imgur.setClientId('40b17620a4a6de6');
imgur.setMashapeKey('2fdf01843fmsh4bdd67783f4b8cfp12be38jsn7c6b7458380d');

const uploadBase64 = base64Img => {
  return imgur.uploadBase64(base64Img.replace(/^data:image\/[a-z]+;base64,/, ''));
};

module.exports = {
  uploadBase64
};
