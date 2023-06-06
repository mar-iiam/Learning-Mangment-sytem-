var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Hello iam nodejs main router ");
});



router.get('/',(req,res,next)=>{
    
  let type = "instructor";
  con.query("SELECT id , name , email , phone , status , type FROM User WHERE type =1", function (error, results, fields) {
    if (error) throw error;
    console.log( results);
    res.json(results)

  });

})

router.put('/EditPhone' , (req,res,next)=>{
  const {newPhone , id} = req.body;
  if(!newPhone.replace(/\s/g, '').length ){
    res.send("Phone is undefined");
  }else{
    con.query('UPDATE User SET phone = ? WHERE id = ?', [newPhone, id], function (error, results, fields) {
      if (error) throw error;
      console.log("here"+ results[0]);
  
    });
      res.send("Phone edited successfuly");
    }
  }
 
 
)

router.put('/EditStatus' , (req,res,next)=>{
  const {newStatus , id} = req.body;
  if(!newStatus.replace(/\s/g, '').length || !isNaN(newStatus) ){
    res.send("Status is undefined");
  }else{
    con.query('UPDATE User SET status = ? WHERE id = ?', [newStatus, id], function (error, results, fields) {
      if (error) throw error;
  
    });
      res.send("Status edited successfuly");
    }
  }
 
 
)


module.exports = router;
