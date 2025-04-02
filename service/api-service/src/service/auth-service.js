const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../../logger");
const sendMail = require("../mail/mailer");

exports.authenticate = async (req, res) => {
  let payload = req.body;
  let authenticateUser = new User();
  let user = {};
  try {
    user = await User.findOne({
      where: { username: req.body.username }
    });
    authenticateUser = {
      id: user.id,
      username: user.username
    };
  } catch (err) {
    return {
      isSuccess: false,
      message: "User Not Found",
      body:{}
    };
  }
  try {
    const cmp = await bcrypt.compare(payload.password, user.password);
    if (cmp) {
      const token = jwt.sign(
        {
          userid: user.id,
          username: user.username,
        },
        "asdfgj",
        {
          expiresIn: "2h",
        }
      );
      return {
        message: "Login Successfull",
        isSuccess: true,
        body: {
          userid: authenticateUser.id,
          username: authenticateUser.username,
          email:authenticateUser.email,
          token: token,
        },
      };
    } else {
      return {
        isSuccess: false,
        message: "Wrong Credential",
      };
    }
  } catch (error) {
    logger.error(error.message);
   throw new Error("Server Error "+ error.message)
  }
};

exports.signOut = (req, res, next) => {
  req.session.destroy();
  return res.status(200).json({
    message: "User Sign out",
  });
};

exports.isLoggedIn = async (req, res, next) => {
  let decoded = {};
  try {
    decoded = jwt.verify(req.query.token, "asdfgj");
  } catch (error) {
    return res.status(200).json({
      body: {
        status: false,
      },
    });
  }

  User.findOne({ where: { id: decoded.userid } })
    .then((authenticatedUser) => {
      if (authenticatedUser) {
        return res.status(200).json({
          body: {
            status: true
          },
        });
      } else {
        return res.status(200).json({
          body: {
            status: false,
          },
        });
      }
    })
    .catch((err) => {
      return res.status(404).json({
        isSuccess:false,
        message: "Login Failed! Server Error!",
        error: err.message,
      });
    });
};
exports.addUser = async (req, res, next) => {
  let payload = req.body;
  try {
    let user = {
      username: payload.username,
      email:payload.email,
      userrole:"admin"
    };
    bcrypt.hash(payload.password, 10, (err, hash) => {
      console.log(hash);
      user.password = hash;
      User.create(user)
        .then((newuser) => {
          console.log(newuser);
          return res.status(201).json({
            message: "User Created",
            body: newuser.dataValues,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } catch (error) {
    return res.status(500).json({
      message: "User Creation Failed",
      body: err,
    });
  }
};
exports.findUserByusername = async (req, res, next) => {
  try {
    let user = await User.findOne({ where: { username: req.query.username } });
    if (user) {
      return res.status(200).json({
        message: "This user already exists",
        body: true,
      });
    } else {
      return res.status(200).json({
        message: "This user does not exists",
        body: false,
      });
    }
  } catch (error) {
    return res.status(200).json({
      message: "This user does not exists",
      body: false,
    });
  }
};

exports.getAllUser = async (req,res,next)=>{
  let userList = [];
  let params = req.query;
  let query = {};
  try {
    if(params.username || params.username!=''){
      query.username = params.username;
    }
    userList = await User.findAll({where:query,include:[Person,ProjectUserMapping]});
    return res.status(200).json({
      message: "Userlist Fetched",
      body: userList,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}


exports.generateResetPasswordToken = async (req,res)=>{
  let params = req.query;
  let user = {};
  try {
    user = await User.findOne({ where: { email: params.email } });
    if(user){
      const token = jwt.sign(
        {
          userid: user.id,
          username: user.username,
          timestamp: Date.now(),
        },
        "asdfgj",
        {
          expiresIn: "30m",
        }
      );
      const emailBody = generateResetPasswordEmailBody(user, token);
      sendMail(user.email, "Reset Password", emailBody);
      return {
        message: "Reset Token Sent",
      };
    }else{
      logger.error("User Not Found");
      logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    throw new Error("Error Occured " + error.message);
    }
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    throw new Error("Error Occured " + error.message);
  }
}

exports.resetPassword = async (req,res,next)=>{
  let payload = req.body;
  let user = {};
  try {
    user = await User.findOne({ where: { id: payload.id } });
    if(user){
      bcrypt.hash(payload.newPassword, 10, (err, hash) => {
        console.log(hash);
        user.password = hash;
        user.save()
          .then((newuser) => {
            return {
              message: "Password Updated",
              body: newuser.dataValues,
            };
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }else{
      throw new Error("User Not Found")
    }
  } catch (error) {
    throw new Error("Server Error "+ error.message)
  }
}
exports.verifyResetPasswordToken = async (req,res)=>{
  let token = req.query.token;
  let decoded = {};
  try {
    decoded = jwt.verify(token, "asdfgj");
  } catch (error) {
    return res.status(400).json({
      body: {
        status: false,
        message: "Token Invalid",
      },
    });
  }
  User.findOne({ where: { id: decoded.userid } })
    .then((authenticatedUser) => {
      if (authenticatedUser) {
        return res.status(200).json({
          body: {
            status: true,
            userId: authenticatedUser.id,
            username:authenticatedUser.username
          },
        });
      } else {
        return res.status(200).json({
          body: {
            status: false,
          },
        });
      }
    })
    .catch((err) => {
      return res.status(404).json({
        isSuccess:false,
        message: "Login Failed! Server Error!",
        error: err.message,
      });
    });
}
const generateResetPasswordEmailBody = (user, token) => {
  let baseUrl = 'https://doggyduty.live/#/';
  return `<html>
  <body>
    <h1>Reset Password</h1>
    <p>Hello ${user.username},</p>
    <p>Click the link below to reset your password:</p>` +
    `<a href="${baseUrl}auth/reset-password/${token}">Reset Password</a>` +
    `<p>The token will expire in 30 minutes</p>
      <p>If you did not request this, please ignore this email.</p>
  </body>
  </html>`;
}
