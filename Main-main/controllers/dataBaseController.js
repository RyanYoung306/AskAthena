const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const dataBaseController = {};

dataBaseController.connection = mysql.createConnection({
    host: process.env.AA_DB_ENDPOINT,
    user: process.env.AA_DB_USER,
    password: process.env.AA_DB_PASS,
    database: 'askathena',
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync(path.resolve(__dirname, '..', 'DigiCertGlobalRootCA.crt.pem'))
    }
});

dataBaseController.connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database!');
});

//get all data from user feed back
dataBaseController.userFeedBackScore = (req, res) => {
    dataBaseController.connection.query('SELECT * FROM userfeedback', (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return;
        }
        console.log('Query results:', results);
        res.send(results)
    });
};

//get global value from user feed back
dataBaseController.userFeedBackScoreGlobal = (req, res) => {
    
    //calculates global score of user feedback
    const query = 'UPDATE userfeedback set GlobalScore = (select SUM(userFeedBackScore) from userfeedback) where iD_cache = 0';
    dataBaseController.connection.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return;
        }
        console.log('Global Score updated');
            // res.send(results)
    });

    //returns value of global score
    const query1 = 'select GlobalScore from userfeedback where iD_cache = 0';
    dataBaseController.connection.query(query1, (error, results) => {
    if (error) {
        console.error('Error executing query:', error);
        return;
    }
        console.log('Query results:', results);
        res.send(results);
    });
};

//increase the user feed back score
dataBaseController.userFeedBackScoreIncrease = (req, res) => {
    const query = 'INSERT INTO userfeedback(userFeedBackScore) VALUES (1);'
    dataBaseController.connection.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return;
        }
        console.log('Query results:', results);
        res.send("score increased")
    });
};

dataBaseController.userFeedBackScoreDecrease = (req, res) => {
    const query = 'INSERT INTO userfeedback(userFeedBackScore) VALUES (-1);'
    dataBaseController.connection.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return;
        }
        console.log('Query results:', results);
        res.send("score decreased")
    });
};

dataBaseController.userPositive = (req, res) => {
    const query = 'select count(*) from userfeedback where userFeedBackScore > 0'
    dataBaseController.connection.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return;
        }
        console.log('Positive results:', results);
        res.send(results);
    });
};

dataBaseController.userNegative = (req, res) => {
    const query = 'select count(*) from userfeedback where userFeedBackScore < 0'
    dataBaseController.connection.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return;
        }
        console.log('Negative results:', results);
        res.send(results);
    });
};

module.exports = dataBaseController;
