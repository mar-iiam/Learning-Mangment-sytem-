var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const { con } = require('../Middlewares/mysql')
const bycrpt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { validationToken } = require("../Middlewares/AuthMiddlewares");



 const CheckstringValidation=(string,callback)=>{
    if(!string.replace(/\s/g, '').length || !isNaN(string)){
     callback(true)}
     else{
      callback(false)
     }
   }

   const editUserName=(name ,id,callback)=>{
    con.query('UPDATE User SET name = ? WHERE id = ?', [name, id], function (error, results, fields) {
      if (error) throw error;
       callback(results)
  
    });
   }

   const deleteUser=(id,callback)=>{
    con.query('DELETE FROM User WHERE id = ?' ,[id] , function (error, results, fields) {
      if (error) throw error;
      callback(results);
    });
  }
  
  const listAllUsers=(type,callback)=>{
    con.query('SELECT id, name , email ,phone ,status FROM User WHERE type =?',type, function (error, results, fields) {
      if (error) { throw error }
      else {
        console.log(results)
         callback(results)
      }
    })
  }

  module.exports = {listAllUsers,deleteUser,CheckstringValidation,editUserName}  