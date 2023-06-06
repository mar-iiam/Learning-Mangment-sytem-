var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const { con } = require('../Middlewares/mysql')
const bycrpt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { validationToken } = require("../Middlewares/AuthMiddlewares");

router.get('/', (req, res, next) => {

    con.query("SELECT course.instrctor_id , course.id AS C_id ,course.name AS C_name ,course.code ,course.status ,User.name FROM course LEFT JOIN User ON course.instrctor_id = User.id"
        , function (error, results, fields) {
            if (error) throw error;
            console.log(results)
            res.json(results)

        });

})
router.put('/EditName', (req, res, next) => {
    const { newName, id } = req.body;
    if (!newName.replace(/\s/g, '').length || !isNaN(newName)) {
        res.send("Name is undefined");
    } else {
        con.query('UPDATE course SET name = ? WHERE id = ?', [newName, id], function (error, results, fields) {
            if (error) throw error;
            console.log("here" + results[0]);

        });
        res.send("Name edited successfuly");
    }
}
)
router.put('/EditCode', (req, res, next) => {
    const { newCode, id } = req.body;
    if (!newCode.replace(/\s/g, '').length || !isNaN(newCode)) {
        res.send("Code is undefined");
    } else {
        con.query('UPDATE course SET code = ? WHERE id = ?', [newCode, id], function (error, results, fields) {
            if (error) throw error;
            console.log("here" + results[0]);

        });
        res.send("Code edited successfuly");
    }
}
)

router.put('/EditStatus', (req, res, next) => {
    const { newStatus, id } = req.body;
    console.log({ newStatus })
    if (isNaN(newStatus && newStatus.length > 1)) {
        res.send("Status is undefined");
    } else {
        con.query('UPDATE course SET status = ? WHERE id = ?', [newStatus, id], function (error, results, fields) {
            if (error) throw error;
            console.log("here" + results[0]);

        });
        res.send("Status edited successfuly");
    }
}
)
router.delete('/DeleteCourse', (req, res, next) => {
    const { id } = req.body;

    con.query('DELETE FROM course WHERE id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        res.send("Course  deleted successfuly")
    });

})
router.get('/AddCourse', (req, res, next) => {
    res.send('hey get ')
})

router.post('/AddCourse', (req, resp, next) => {


    con.query('SELECT id FROM course WHERE code =?', req.body.code, function (error, results, fields) {
        if (error) throw error;
        console.log(results.length)
        if (results.length !== 0) {
            resp.send("This course is already exists");
        } else {
            let idI = Math.floor((Math.random() * 500) + 1);
            const sql = `INSERT INTO course (id ,name, code , status) VALUES ('${idI}'
          ,'${req.body.name}', '${req.body.code}','${req.body.status}')`;
            con.query(sql, function (err, result, fields) {
                if (err) throw err;
                console.log(result)

            });

            resp.send("Course is added ")
        }
    });


})
router.post('/AssignInstructor', (req, res, next) => {
    const name = req.body.name;
    const Course_id = req.body.id;
    console.log(req.body)
    con.query("SELECT id ,type FROM User WHERE name=? ", name, function (error, results, fields) {
        if (error) throw error;
        console.log(results)
        if (results.length === 0 || results[0].type !==1) {
            res.send("No such an instructor exists")
        } else{
                const inst_id = results[0].id;
                const status =1;
                console.log(inst_id);
                console.log(Course_id);
                var sql = "UPDATE course SET instrctor_id = ?, status = ? WHERE id = ?;"
                con.query(sql, [inst_id,status, Course_id], function (error, result, fields) {
                    if (error) throw error;
                    console.log(result);
                    res.send("instrctor assigned successfuly")
                });
            
        }

    });


})
router.put('/EditInstName',(req,res,next)=>{
    console.log(req.body)
    con.query("SELECT id ,type FROM User WHERE name=? ", req.body.newInstName,function (error, result, fields){
        if (error) throw error;
        console.log(result)
        if(result.length=== 0 || result[0].type !==1){
            res.send("No such an instructor exists")
        }else{
            con.query('UPDATE course SET instrctor_id =? WHERE id =?', [result[0].id, req.body.id], function (error, results, fields) {
                if (error) throw error;
                console.log(results);
    
            });
            res.send("updated successfuly");
        }

    })
    
    
})

router.delete('/DeleteAssignedinstr', (req, res, next) => {
    const { id } = req.body;
    const status =0;
    var sql = "UPDATE course SET instrctor_id = ?, status = ? WHERE id = ?;"
    con.query(sql, [null,status, id], function (error, results, fields) {
        if (error) throw error;
        console.log(results);

  
        res.send("Instrctor deleted   deleted successfuly")
    });

})
router.put('/setGrade',(req,res,next)=>{
    const id = req.body.id;
    const grade = req.body.grade;
    console.log(req.body)
    var sql = "UPDATE registCourse SET grade =? WHERE student_id=? "
    con.query(sql, [grade,id], function (error, result, fields) {
        if (error) throw error;
        console.log(result);
        res.send("instrctor assigned successfuly")
    });
})
module.exports = router;
