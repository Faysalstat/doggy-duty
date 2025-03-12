const authService = require("../service/auth-service")
exports.login = async (req, res, next) => {
  try {
    let response = await authService.authenticate(req,res);
    return res.status(200).json({
      isSuccess:response.isSuccess,
      body:response.body,
      message:response.message
    })
  } catch (error) {
    return res.status(404).json({
      isSuccess:false,
      message: "Login Failed!" + error.message,
    });
  }
   
};
exports.addUser = async (req, res, next) => {
    await authService.addUser(req,res);
}
exports.signout = async(req,res,next)=>{
    await authService.signOut(req,res,next);
}
exports.isLoggedIn = async (req,res,next)=>{
    await authService.isLoggedIn(req,res,next);
  }

  exports.checkExistingUser = async (req,res,next)=>{
    await authService.findUserByUserName(req,res,next);
  }
  exports.getAllUser = async (req,res,next)=>{
    await authService.getAllUser(req,res,next);
  }

  exports.getAllUnassignedUser = async (req,res,next)=>{
    try {
      let users = await authService.getAllUnassignedUser(req,res,next);
      return res.status(200).json({
        body: users,
        isSuccess: true,
        message:"Users Found"
      });
    } catch (error) {
      return res.status(400).json({
        message: "Users Not Found." + error.message,
        isSuccess: false,
      });
    }
  }