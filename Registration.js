var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const { con } = require('../Middlewares/mysql')
const bycrpt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { validationToken } = require("../Middlewares/AuthMiddlewares");
const {GetUserID ,GetUserPassword ,CheckIfEmailExists , ComparePasswords ,checkIfAdmin 
,CreateSecretToken ,checkSeacretKey ,HashUserPassword , InsertUserIntoDB ,generateUserID} = require('./Authentication')

router.post('/Login', (req, resp, next) => {
  const Email = req.body.email;
  const Password = req.body.password;
  console.log(Email)
  CheckIfEmailExists(Email, function (exists) {
    if (!exists) { console.log(exists) ;resp.send("THIS USER DOES NOT EXSITS") }
    else {
          GetUserPassword(Email, function (password) {
            ComparePasswords(Password, password, function (compareResult) {
              if (compareResult) {
                GetUserID(Email, function (id) {
                  CreateSecretToken(id, Email, function (FinalResponse) {
                    resp.json({ UserToken: FinalResponse, id: id, email: Email })
                  })
                })
              } else {
                resp.json({ error: "Passwords does not matched" })
              }
            })
          })
        }
      })

  });
router.post('/signup', (req, res, next) => {
  const UserName = req.body.name;
  const UserEmail = req.body.email;
  const UserPassword = req.body.password;
  const UserPhone = req.body.phone;
  const UserStatus = 0;
  const UserType =req.body.type;
  const UserKey = req.body.key;
  checkSeacretKey(UserKey,function(keyResult){
    if(keyResult){
      res.json({error : "your account is not supported to be in here"})
    }else{
      CheckIfEmailExists(UserEmail,function(exists){
        if(exists){
          res.json({error : "Account is already exists"})
        }else{
          HashUserPassword(UserPassword,function(HashedPassword){
            generateUserID(function(Userid){
              InsertUserIntoDB(Userid,UserEmail,HashedPassword,UserStatus,UserType,UserName,UserPhone ,function(InsertionResult){
                res.json({succsess : "User is added successfuly"})
              })
            })
          })
        }
      })
    }
  })
});

module.exports = router;