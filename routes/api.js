const Task = require("../models/task");
const express = require("express");
const router = express.Router();

router.use(express.json());

/*  get method  */
router.get("/get", async (req, res) => {
    try{
        const allTasks = await Task.find({});
        res.status(200).json(allTasks);
    }catch(err){
        console.log(err);
    }
});

/*  post method */
router.post("/post", async (req, res) => {
    try{
        const createTasks = await Task.create(req.body);
        res.status(200).json(createTasks);
    }catch(err){
        console.log(err);
    }
})

/*  edit method */

/*  delete method   */


module.exports = router;