var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const { con } = require('../Middlewares/mysql')
const bycrpt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { validationToken } = require("../Middlewares/AuthMiddlewares");

router.get('/registCourse',(req,res,next)=>{
    con.query("SELECT course.instrctor_id , course.id AS C_id ,course.name AS C_name ,course.code ,course.status ,User.name FROM course LEFT JOIN User ON course.instrctor_id = User.id WHERE course.status =1"
        , function (error, results, fields) {
            if (error) throw error;
            console.log(results)
            res.json(results)

        });
})

router.post('/registCourse' ,(req,res,next)=>{
    const studentCourses = req.body.courses;
    const student_id = req.body.student_id;
    console.log(studentCourses+" "+ student_id)
    for(let i=0 ; i< studentCourses.length ;i++){
        con.query("SELECT course_id FROM registCourse WHERE student_id = ? AND course_id =?",[student_id , studentCourses[i]], function (err, result) {
            if (err) throw err;
            console.log(result);
            if(result.length!==0){
              res.send('Course is aleady registerd has been resgisterd again')
              return
            }else{
                for(let i=0 ; i < studentCourses.length ;i++){
                    console.log(studentCourses[i]);
                    const sql = `INSERT INTO registCourse (course_id ,student_id) VALUES ('${studentCourses[i]}','${student_id}')`;
                    con.query(sql, function (err, result, fields) {
                      if (err) throw err;
                      console.log(result)
                    
                    });
                }
                res.send(studentCourses.length + " courses are added successfuly")
            }
          });
        }
   
})

module.exports = router;