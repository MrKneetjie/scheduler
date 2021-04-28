'use strict';
/* eslint-disable */

//Libraries
const cron = require('node-cron');
const moment = require('moment')
const _ = require('lodash')

//PostNow Service Reddit
const { linkPostSubmit } = require('../reddit');
const { add } = require('../logger');

//Submit Post
const submitPosts = async  (app, post) => {
    let submitStatus = await linkPostSubmit(app, post).catch(err => console.log(err)) //linkPostSubmit
    return submitStatus;
};
//Save PostResults
const savePostResults = (app, postResults) => {
    let results = postResults
    //Do postAt Update Add 15 minutes when Rate Limit Error Appears
    if(_.includes(postResults.updates.error_,'RATELIMIT'))Object.assign(results.updates,{postAt: moment().add(15,'minutes')})
  
    //Apply Updates if there are any
    app.service('posts').patch(postResults._id, postResults.updates)
};
const start = async (app) => {
    cron.schedule('* * * * *', async ()=>{
        const posts = await app.service('posts').find({ 
            query: { 
              posted: false,
              /* To Get Post Only Scheduler For Today*/
              postAt: {  
                $lt: new Date(), 
                $gte: new Date(new Date().setDate(new Date().getDate()-1))
              }
            } 
        }); 
        console.log(`Number of posts scheduled today: ${posts.data.length}`)
        for(const post of posts.data) {
            //Testing Purposes
            // const postResults = await submitPosts(app,post)
            // console.log(`post results are:`)
            // await savePostResults(app, postResults);


            // Only Execute if Due Today at Exact Hour and minute
            if(moment(post.postAt).format('YYYY-MM-DD hh:mm') ==  moment().format('YYYY-MM-DD hh:mm')){ 
                const postResults = await submitPosts(app,post)
                console.log(`post results are:`)
                await savePostResults(app, postResults);
            }
        }
       
    })
};
module.exports = {start}