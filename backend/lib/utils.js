const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const pathToPvtKey = path.join(__dirname, "..", "id_rsa_priv.pem");
const pathToPubKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PRIV_KEY = fs.readFileSync(pathToPvtKey, "utf8");
const PUB_KEY = fs.readFileSync(pathToPubKey, "utf8");

/**
 * -------------- HELPER FUNCTIONS ----------------
 */

/**
 *
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 *
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
function validPassword(password, hash, salt) {
    var hashVerify = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");
    return hash === hashVerify;
}

/**
 *
 * @param {*} password - The password string that the user inputs to the password field in the register form
 *
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 *
 * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
 * You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
 */
function genPassword(password) {
    var salt = crypto.randomBytes(32).toString("hex");
    var genHash = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");

    return {
        salt: salt,
        hash: genHash,
    };
}

/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MongoDB user ID
 */
function issueJWT(user) {
    const _id = user._id;

    const expiresIn = "1d";

    const payload = {
        sub: _id,
        iat: Date.now(),
    };

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
        expiresIn: expiresIn,
        algorithm: "RS256",
    });

    return {
        token: "Bearer " + signedToken,
        expires: expiresIn,
    };
}

function verifyJWT(token) {
    return new Promise((resolve, reject) => {
        jsonwebtoken.verify(
            token,
            PUB_KEY,
            { algorithm: "RS256" },
            (err, decodedPayload) => {
                if (err) {
                    return reject(err);
                }
                resolve(decodedPayload);
            }
        );
    });
}

// const isAdmin = (req, res, next) => {
//     if (!req.user) {
//         return res.status(401).json({ success: false, msg: 'You are not authorized to view this resource' });
//     }

//     if (req.user.admin === false) {
//         return res.status(401).json({ success: false, msg: 'You need to be an admin to access this resource.' });
//     }

//     return next()
// }

function getUserIDFromToken(token) {
    const decodedToken = jsonwebtoken.decode(token);
    return decodedToken.sub;
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;
module.exports.verifyJWT = verifyJWT;
module.exports.getUserIDFromToken = getUserIDFromToken;
// module.exports.isAdmin = isAdmin;
