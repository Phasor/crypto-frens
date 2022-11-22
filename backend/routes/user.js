var express = require("express");
var router = express.Router();
const passport = require("passport");
const userController = require("../controllers/userController");

// open route
router.post("/signup", userController.post_signup);

// protected routes
router.get(
    "/all",
    passport.authenticate("jwt", { session: false }),
    userController.get_all_users
);
router.get(
    "/all/excluding-friends",
    passport.authenticate("jwt", { session: false }),
    userController.get_all_users_ex_friends
);
router.get(
    "/:id/getPendingFriendsReceived",
    passport.authenticate("jwt", { session: false }),
    userController.get_pending_friends_recieved
);
router.get(
    "/:id/getPendingFriendsSent",
    passport.authenticate("jwt", { session: false }),
    userController.get_pending_friends_sent
);
router.post(
    "/:id/deleteFriend",
    passport.authenticate("jwt", { session: false }),
    userController.delete_friend
);
router.get(
    "/:id/getFriends",
    passport.authenticate("jwt", { session: false }),
    userController.get_friends
);
router.get(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    userController.get_by_id
);
router.put(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    userController.put_update_user
);
router.post(
    "/:id/friend-request",
    passport.authenticate("jwt", { session: false }),
    userController.post_friend_request
);
router.post(
    "/:id/friend-request/accept",
    passport.authenticate("jwt", { session: false }),
    userController.post_friend_request_accept
);

module.exports = router;
