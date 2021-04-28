const { linkPostSubmit } = require('./reddit');
const { uploadBase64 } = require('./imgur');

const sleep = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000));

const fixImage = async (app, post) => {
  try {
    const imageUpload = await uploadBase64(post.img);
    await app.service('posts').patch(post._id, { imageUrl: imageUpload.data.link });
    post.imageUrl = imageUpload.data.link;
    return true;
  }
  catch(err){
    console.log(err);
    return false;
  }
};

const postSubmit = async (app, post) => {
  if(!post.imageUrl.startsWith('http')){
    const fixed = await fixImage(app, post);
    if(!fixed)
      return { updates: {} };
  }
  return linkPostSubmit(app, post).catch(err => console.log(err));
};

const submitPosts = (app, posts) => {
  const tasks = [];
  for(let post of posts)
    tasks.push(linkPostSubmit(app, post).catch(err => console.log(err)));
  return Promise.all(tasks);
};

const savePostResults = (app, postResults) => {
  const tasks = [];
  for(let postResult of postResults)
    tasks.push(app.service('posts').patch(postResult._id, postResult.updates));
  return Promise.all(tasks);
};

const start = async (app) => {
  while(true){
    const posts = await app.service('posts').find({ 
      query: { 
        posted: false,
        error: '',
        postAt: {
          $lte: new Date()
        }
      } 
    }); 
    const postResults = await submitPosts(app, posts.data || posts);
    await savePostResults(app, postResults);
    await sleep(100);
  }
};

module.exports = {
  start
};
