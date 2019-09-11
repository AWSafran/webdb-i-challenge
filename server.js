const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());


server.get("/accounts/all", (req, res) =>{
    db('accounts')
        .then(accounts =>{
            res.status(200).json(accounts);
        })
        .catch(err =>{
            res.status(500).json({
                err: err,
                message: "Server error"
            });
        });
});


server.post('/accounts/new', (req, res) =>{
    if(req.body.name && req.body.budget){
        db('accounts').insert({
            name: req.body.name,
            budget: req.body.budget
        })
            .then(id =>{
                res.status(201).json({id: id});
            })
            .catch(err =>{
                res.status(500).json({
                    err: err,
                    message: "Server Error"
                });
            })
    }

    else{
        res.status(400).send("Error: bad request")
    }
})


server.put('/accounts/update/:id', (req, res) =>{
    const id = req.params.id;
    if(req.body.name && req.body.budget){
        db('accounts').where({id: id}).update({
            name: req.body.name,
            budget: req.body.budget
        })
            .then(rows =>{
                res.status(200).json({"Rows Updated": rows});
            })
            .catch(err =>{
                res.status(500).json({
                    err: err,
                    message: "Server Error"
                });
            });
    }

    else{
        res.status(400).send("Error: bad request");
    }
});


server.delete('/accounts/delete/:id', (req, res) =>{
    const id = req.params.id;

    db('accounts').where({id: id}).del()
        .then(rows =>{
            if(rows > 0){
                res.status(200).json({"Rows Deleted": rows});
            }
            else{
                res.status(404).send("Could not find record to delete");
            }
        })
        .catch(err =>{
            res.status(500).json({
                err: err,
                message: "Server Error"
            });
        });
});

module.exports = server;