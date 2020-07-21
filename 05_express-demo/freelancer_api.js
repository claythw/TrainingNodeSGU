const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers' : '*'
    });
    next();
})

// TEMPORARY MASTER DATA USER
const users = [
    { id: 1, email: 'hebert.hendrik@gmail.com', password: 'Bert10031988' }
];





/*
*
* ROUTE HANDLER 
*
*/

// GET ALL USER
app.get('/api/users', (req, res) => {
    
    // LOG TIME
    var datetime = new Date();
    console.log("\n"+datetime);
    console.log('User data has been retrieved.');
    return res.json(users);

});

app.get('/api/users/:email/:password', (req, res) => {

    // LOG TIME
    var datetime = new Date();
    console.log("\n"+datetime);
    console.log("Incoming new GET HTTP request for LOGIN");
    console.log(req.body);

    // VALIDATE
    const {error} = validateUser(req.params);
    if (error) {
        console.log('Validation error');

        var jsonRespond = {
            result: "",
            message: error.details[0].message
        }

        return res.status(400).json(jsonRespond);
    }
    console.log('Validation success and accepted');

    // CHECK IF THE EMAIL AND PASSWORD CORRECT
    console.log('Check existing email: '+req.params.email+' and password: '+req.params.password);
    const check_user = users.find( u => u.email === req.params.email && u.password === req.params.email );
    if (!check_user) {
        var error_message = 'Invalid login detail. Email or password is not correct.';
        console.log(error_message);
        
        var jsonRespond = {
            result: "",
            message: error_message
        }

        return res.status(404).json(jsonRespond);
    }

    var jsonRespond = {
        result: user,
        message: "Login success"
    }
    return res.json(jsonRespond);



});

// REGISTER NEW USER
app.post('/api/users', (req, res) => {

    // LOG TIME
    var datetime = new Date();
    console.log("\n"+datetime);
    console.log("Incoming new POST HTTP request");
    console.log(req.body);

    // VALIDATE
    const {error} = validateUser(req.body);
    if (error) {
        console.log('Validation error');

        var jsonRespond = {
            result: "",
            message: error.details[0].message
        }

        return res.status(400).json(jsonRespond);
    }
    console.log('Validation success and accepted');

    // CHECK IF THE EMAIL ALREADY EXISTS
    console.log('Check existing email: '+req.body.email);
    const check_user = users.find( u => u.email === req.body.email );
    if (check_user) {
        console.log('Email: '+req.body.email+' is already registered');
        
        var jsonRespond = {
            result: "",
            message: "Registration failed. Email "+req.body.email+" is already registered. Please use other email."
        }

        return res.status(404).json(jsonRespond);
    }

    console.log('Email ' + req.body.email + ' is available for registration');
    const user = {
        id: users.length + 1,
        email: req.body.email,
        password: req.body.password
    };
    
    users.push(user);
    return res.json(user);
});

/*
*
* END ROUTE HANDLER
*
*/



// RUN WEB SERVER AT PORT 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

// VALIDATION FUNCTION
function validateUser(user) {
    const schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    });

    return schema.validate(user);
}