let mongoose = require("mongoose");
let Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

let userSchema = new Schema({
    "userName": {
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": [{
        "dateTime": Date,
        "userAgent": String
    }]
});

let User;  // to be defined on new connection (see initialize)

module.exports.initialize = () => {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://jgvitalicio:jgvpass789@senecaweb-lbojb.mongodb.net/web322_assignment6?retryWrites=true&w=majority");
        db.on('error', (err) => {
            reject(err); // reject the promise with the provided error
        });
        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
}

module.exports.registerUser = (userData) => {
    return new Promise((resolve, reject) => {
        if (userData.password != userData.password2) {
            reject("Passwords do not match");
        }
        else {
            let newUser = new User(userData);
            bcrypt.genSalt(10, (err, salt) => { // Generate a "salt" using 10 rounds
                bcrypt.hash(userData.password, salt, (err, hash) => { // encrypt the password
                    if (err) {
                        reject("There was an error encrypting the password");
                    }
                    else {
                        newUser.password = hash;
                        newUser.save()
                            .then(() => {
                                resolve();
                            })
                            .catch((err) => {
                                if (err.code == 11000) {
                                    reject("User Name already taken");
                                }
                                else if (err.code != 11000) {
                                    reject("There was an error creating the user: " + err);
                                }
                            });
                    }
                });
            });
        }
    });
}

module.exports.checkUser = (userData) => {
    return new Promise((resolve, reject) => {
        User.find({ userName: userData.userName })
            .exec()
            .then((users) => {
                bcrypt.compare(userData.password, users[0].password)
                    .then((res) => {
                        users[0].loginHistory.push({ dateTime: (new Date()).toString(), userAgent: userData.userAgent });
                        User.update({ userName: users[0].userName },
                            { $set: { loginHistory: users[0].loginHistory } },
                            { multi: false })
                            .exec()
                            .then(() => {
                                resolve(users[0]);
                            })
                            .catch((err) => {
                                reject("There was an error verifying the user: " + err);
                            });
                    })
                    .catch((err) => {
                        reject("Incorrect Password for user: " + userData.userName);
                    })
            })
            .catch((err) => {
                reject("Unable to find user: " + userData.userName);
            })
    });
}

