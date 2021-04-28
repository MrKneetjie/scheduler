'use strict'


const findEmailIfExist = async (app,email) => {
    const emailExists = await app.service('users').find({email})
    return emailExists;
};

module.exports = { findEmailIfExist }