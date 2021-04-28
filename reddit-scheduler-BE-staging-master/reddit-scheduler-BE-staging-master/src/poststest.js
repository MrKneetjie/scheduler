const app = require('./app');

const test = async () => {
  const posts = await app.service('posts').find({ 
    query: { 
      posted: false,
      postAt: {
        $lte: new Date()
      }
    } 
  }); 
  console.log(posts);
};

test();
