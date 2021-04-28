const unirest = require("unirest");

const uploadBase64 = base64Img => {
  
    var req = unirest("POST", "https://imgur-apiv3.p.rapidapi.com/3/image");
    
  req.headers({
      "content-type": "application/x-www-form-urlencoded",
      "authorization": "Bearer e51feb211a620a8a8473e6212bbe052b1fc55109", // TODO: UPDATE BEARER TO DYNAMIC TOKEN
      "x-rapidapi-key": "011ae85680msh62f28da124accdep1c76d8jsn3768d0ee40bf",
      "x-rapidapi-host": "imgur-apiv3.p.rapidapi.com",
      "useQueryString": true
  });
  req.form({
        "image": base64Img.replace(/^data:image\/[a-z]+;base64,/, '')
  });
    
  return new Promise((resolve, reject) => {
    req.end(function (res) {
      if (res.error)
        reject(res.error);
      resolve(res.body.data.link);          
    });
      
  });
  
} 

module.exports = {
  uploadBase64
};

