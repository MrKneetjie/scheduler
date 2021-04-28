const imgur = require('imgur');
const fs = require('fs');

imgur.setCredentials('cyberloh2@mail.ru', 'Myeasypass0.', '40b17620a4a6de6');

const content = fs.readFileSync('/home/cyberloh/Documents/8.png', { encoding: 'base64' });
console.log(content.substring(0, 50));
imgur.uploadBase64(content)
    .then(function (json) {
        console.log(json.data.link);
    })
    .catch(function (err) {
        console.error(err.message);
    });
