const express = require("express");
const router = express.Router();
const list = require("../../models/Members.js");



router.get('/', (req, res) => {
    res.json(list);
})

router.get('/:id', (req, res) => {
    const found = list.some(member => member["id"] === parseInt(req.params.id));

    if (found) {
        res.json(list.filter(member => member["id"] === parseInt(req.params.id)));
    } else {
        res.status(400).json({
            "error": `No id of ${req.params.id}`
        })
    }
    // console.log();
})

router.post('/', (req, res) => {
    const newMember = new list({
        Name: req.body["Name"],
        Location: req.body["Location"]
    });

    if (!newMember["Name"] || !newMember["Location"]) return res.status(400).json({
        "Error": "Error while creating new member"
    });

    newMember.save()
        .then(result => console.log("Written data succeed!"))
        .catch(err => console.error("Something has occured error!"));
    res.redirect("/api/app");
})


module.exports = router;