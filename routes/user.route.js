const userController = require("../controllers/user.controller");
const { authjwt } = require("../middleware")
module.exports = (app) => {
    app.get("/crm/api/v1/user",[authjwt.verifyToken, authjwt.isAdmin], userController.findAll);
    app.get("/crm/api/v1/user/:id",[authjwt.verifyToken, authjwt.isValidUserIdInReqParam, authjwt.isAdminOrOwner], userController.findByUserId);
    app.put("/crm/api/v1/user/:id", [authjwt.verifyToken, authjwt.isValidUserIdInReqParam, authjwt.isAdminOrOwner], userController.update);

}