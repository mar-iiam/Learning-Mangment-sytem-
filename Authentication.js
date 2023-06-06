var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const { con } = require('../Middlewares/mysql')
const bycrpt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { validationToken } = require("../Middlewares/AuthMiddlewares")

const CheckIfEmailExists = (email, callback) => {
    con.query('SELECT id  FROM User WHERE email =?', email, function (err, result, fields) {
      if (err) throw err;
      callback(result.length);
    })
  }
  

  function checkIfAdmin(email, callback) {
    con.query('SELECT type FROM User WHERE email =?', email, function (err, result, fields) {
      if (err) {
        throw err;
      }
      callback(result[0].type);
    });
  }

  const ComparePasswords = (inputPassword, savedPassword, callback) => {
    bycrpt.compare(inputPassword, savedPassword, function (err, res) {
      if (err) throw err
      console.log(res)
      callback(res)
    })
  }

  const CreateSecretToken = (id, email, callback) => {
    const UserToken = sign({ id: id, email: email }, "SecretToken");
    callback(UserToken);
  }

  const GetUserPassword = (email, callback) => {
    con.query('SELECT password  FROM User WHERE email =?', email, function (err, result, fields) {
      if (err) throw err;
      console.log(result[0].password)
      callback(result[0].password);
    })
  }

  const GetUserID = (email, callback) => {
    con.query('SELECT id FROM User WHERE email =?', email, function (err, result, fields) {
      if (err) throw err;
      console.log(result[0].id)
      callback(result[0].id);
    })
  }


const checkSeacretKey =(key, callback)=>{
  let secretKey = 122;
  if (secretKey.toString() !== key) {
    callback(true)
  }else {
    callback(false)
  }
}

const HashUserPassword=(password , callback)=>{
  bycrpt.genSalt(10, function (err, salt) {
    bycrpt.hash(password, salt, function (err, hash) {
      console.log(hash)
      callback(hash)
    });
  });

}

const generateUserID=(callback)=>{
  let id = Math.floor((Math.random() * 500) + 1);
  console.log(id)
  callback(id)
}

const InsertUserIntoDB=(id,email,password,status,type,name, phone,callback)=>{
  const sql = `INSERT INTO User (id ,name, email ,password , phone , status ,type) VALUES ('${id}'
  ,'${name}', '${email}','${password}','${phone}','${status}','${type}')`;
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    callback(result)

  });
}


module.exports = {GetUserID,GetUserPassword ,CheckIfEmailExists , ComparePasswords ,checkIfAdmin ,CreateSecretToken , HashUserPassword , generateUserID , InsertUserIntoDB,checkSeacretKey}  