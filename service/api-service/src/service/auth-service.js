const { Op } = require("sequelize");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../../logger");

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
      username: payload.username
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

exports.getAllUnassignedUser = async (req,res,next)=>{
  let userList = [];
  let params = req.query;
  let query = {};
  let users = [];
  try {
    let assigneduser = await ProjectUserMapping.findAll({where:{projectId:params.projectId}});
        
    if(assigneduser && assigneduser.length>0){
      for(let i=0;i<assigneduser.length;i++){
        let user = assigneduser[i];
        users.push(user.id);
      }
      query.id =  { [Op.notIn]: users};
    }
    userList = await User.findAll({where:query,include:Person});
    return userList
  } catch (error) {
    throw new Error("Error Occured "+ error.message)
  }
}
