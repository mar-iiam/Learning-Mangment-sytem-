var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const bycrpt = require('bcrypt');
const {sign} = require('jsonwebtoken');
const { con } = require('../Middlewares/mysql')


/* GET users listing. */
router.get('/', function (req, res, next) {
 

 
    console.log("Connected! in Home page ");

    con.query('SELECT * FROM About WHERE id= 1 ', function (err, result, fields) {
      if (err) throw err;
      console.log(result)
      res.json(result);
    });



 
});

router.post('/AddStudent', (req, resp, next) => {


  con.query('SELECT id ,type FROM User WHERE email =?', req.body.email, function (error, results, fields) {
    if (error) throw error;
    console.log(results.length)
    if(results.length !==0)
    {
      resp.send("This Student is already exists");
    }else{
      let idI = Math.floor((Math.random() * 500) + 1);
      let type = 2;
      bycrpt.hash(req.body.password, 10).then((hash) => {

        const sql = `INSERT INTO User (id ,name, email, password,phone,status,type) VALUES ('${idI}'
        ,'${req.body.name}', '${req.body.email}','${hash}', '${req.body.phone}',' ${req.body.status}' ,' ${type}')`;
        con.query(sql, function (err, result, fields) {
          if (err) throw err;
          console.log(result)
          console.log(hash)
        
        });
      });

     resp.send("Student is added ")
    }
  });


})

router.post('/login' , (req,resp,next)=>{
  const inputEmail = req.body.email;


  con.query('SELECT id , password ,type  FROM User WHERE email =?', inputEmail, function (err, result, fields) {
    if (err) throw err;

    if (result.length == 0) {
      resp.json({ error: "User is not found  " });

    } else {
      console.log(result[0].type)
      if (result[0].type ===0) {
        resp.json({ error: 'This account is not supported here' })
      } else if(result[0].type ===2) {
        console.log(result)
        console.log(result[0].id);
        console.log("here in compare");
        bycrpt.compare(req.body.password, result[0].password, function (err, res) {

          if (err) {
            console.log(Error)
          }
          if (res) {
            {
              const UserToken = sign({ id: result[0].id, email: req.body.email }, "SecretToken");
              console.log(UserToken)
             
             resp.json({ userToken: UserToken, id: result[0].id , type : result[0].type});
            }

          } else {
            // response is OutgoingMessage object that server response http request
            resp.json({ error: "passwords doesnt match " });
          }
        });
      }else {
        console.log(result)
        console.log(result[0].id);
        console.log("here in compare");
        bycrpt.compare(req.body.password, result[0].password, function (err, res) {

          if (err) {
            console.log(Error)
          }
          if (res) {
            {
              const InstToken = sign({ id: result[0].id, email: req.body.email }, "SecretToken");
              console.log(InstToken)
             
             resp.json({ InstToken: InstToken, id: result[0].id , type : result[0].type});
            }

          } else {
            // response is OutgoingMessage object that server response http request
            resp.json({ error: "passwords doesnt match " });
          }
        });
      }



    }

  })




})


router.get('/studentProfile/:id',(req,res,next)=>{
  const id = req.query.id;
  con.query('SELECT id, name , email ,phone ,status FROM User WHERE id =?', id, function (error, results, fields) {
    if (error) { throw error }
    else {
      console.log(results)
      res.json(results[0])
    }
  })
})

router.get('/studentCourses/:id',(req,res,next)=>{
  const id = req.query.id;
  con.query("SELECT course.name AS course_name, registCourse.course_id  AS course_id , course.code , registCourse.grade FROM registCourse JOIN course ON registCourse.course_id = course.id WHERE student_id = ?",id, function (err, result) {
    if (err) throw err;
    console.log(result);
    res.json(result)
  });
 
})

router.get('/StudentsInstructor/:id' ,(req,res,next)=>{
  const id = req.query.id;
  console.log(id)
  con.query("SELECT User.name As student_name , User.id AS Student_id , course.name , course.code , registCourse.grade FROM ((User INNER JOIN registCourse ON User.id = registCourse.student_id) INNER JOIN course ON course.id = registCourse.course_id) WHERE course.instrctor_id =?", id, function (err, result) {
    if (err) throw err;
    console.log(result);
    res.json(result)
  });
})
module.exports = router;

router.get("/profile/:id", (req, res, next) => {
  const id = req.query.id
  console.log(req)
  con.query('SELECT id, name , email ,phone ,status FROM User WHERE id =?', id, function (error, results, fields) {
    if (error) { throw error }
    else {
      console.log(results)
      res.json(results[0])
    }
  })

})
router.get('/AllStudents', (req, res, next) => {
  con.query('SELECT id, name , email ,phone ,status FROM User WHERE type =2', function (error, results, fields) {
    if (error) { throw error }
    else {
      console.log(results)
      res.json(results)
    }
  })
})

