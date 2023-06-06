var express = require('express');
var router = express.Router();
const {con} = require('../Middlewares/mysql');
const bycrpt = require('bcrypt');
const  {validationToken} = require("../Middlewares/AuthMiddlewares");  
const mysql = require('mysql');
const { sign } = require('jsonwebtoken');
const {listAllUsers , deleteUser , CheckstringValidation , editUserName} = require('./UserOperations')
const {GetUserID,GetUserPassword ,CheckIfEmailExists , ComparePasswords ,checkIfAdmin 
,CreateSecretToken ,checkSeacretKey ,HashUserPassword , InsertUserIntoDB ,generateUserID} = require('./Authentication')

router.post('/AddUser', (req, resp, next) => {
  const UserName = req.body.name;
  const UserEmail = req.body.email;
  const UserPassword = req.body.password;
  const UserPhone = req.body.phone;
  const UserStatus = 0;
  const UserType =req.body.type;
  const AdminEmail = req.body.adminEmail;
  checkIfAdmin(AdminEmail,function(type){
    if(type){
      resp.json({error : " you are not allowed to add a user"})
    }else{
      CheckIfEmailExists(UserEmail,function(exists){
        if(exists){
          resp.json({error : " User is already exsits"})
        }else {
          HashUserPassword(UserPassword,function(HashedPassword){
            generateUserID(function(Userid){
              InsertUserIntoDB(Userid,UserEmail,HashedPassword,UserStatus,UserType,UserName,UserPhone ,function(InsertionResult){
                resp.json({succsess : "User is added successfuly"})
              })
            })
          })
        }
      })
    }
  })

})

router.put('/EditName' , (req,res,next)=>{
   const newName = req.body.name;
   const UserID = req.body.userID;
   const AdminEmail = req.body.adminEmail;
   checkIfAdmin(AdminEmail,function(type){
      if(type){
        res.json({error : "You are not supported to edit user name "})
      }else{
        CheckstringValidation(newName,function(valid){
          if(valid){
            res.json({error : "This name is not valid"})
          }else
          {
             editUserName(newName,UserID,function(response){
              res.json({success : " name edited successfuly"})
             })
          }
        })
       }
   }) 
  }
)

router.delete('/DeleteUser',(req,res,next)=>{
  const UserID = req.body.userID;
  const AdminEmail = req.body.adminEmail;
  checkIfAdmin(AdminEmail,function(type){
    if(type){
      res.json({error : "You are not supported to edit user name "})
    }else{
       deleteUser(UserID,function(response){
        if(response){
          res.json({success : "user deleted"})
        }
       })
     }
 }) 
})



router.get('/Allusers', (req, res, next) => {
  const userType = req.body.type;
  const AdminEmail = req.body.adminEmail;
  checkIfAdmin(AdminEmail,function(type){
    if(type){
      res.json({error : "You are not supported to edit user name "})
    }else{
       listAllUsers(userType,function(response){
         res.json(response)
       })
     }
 }) 
})

module.exports = router;