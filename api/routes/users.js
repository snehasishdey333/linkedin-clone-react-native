const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { CustomError } = require("../middlewares/error");
const upload = require("../middlewares/upload");

router.get("/:userId", async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("No user found", 404);
    }

    const { password, ...data } = user;
    res.status(200).json(data._doc);
  } catch (error) {
    next(error);
  }
});

router.get("/users/:userId", async (req, res, next) => {
  try {
    
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError(404, "User not found!");
    }

    const connections = user.connections 
    const connectionRequests = user.connectionRequests
    const sentConnectionRequestsIds=await User.find({connectionRequests:userId},"_id")
    const sentConnectionRequestArray=sentConnectionRequestsIds.map(user => user._id)
    const excludedIds = [userId, ...connections, ...connectionRequests,...sentConnectionRequestArray];
    const users =await User.find({ _id: { $nin: excludedIds } }).select(
        "-password -email -posts -skills -connections "
      );


    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
});

router.put("/:userId", async (req, res, next) => {
  const { userId } = req.params;
  const updateData = req.body;
  try {
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      throw new CustomError("User not found!", 404);
    }

    Object.assign(userToUpdate, updateData);

    await userToUpdate.save();

    res
      .status(200)
      .json({ message: "User updated successfully!", user: userToUpdate });
  } catch (error) {
    next(error);
  }
});

router.get("/search/:query", async (req, res, next) => {
  const { query } = req.params;

  try {
    const users = await User.find({
      $or: [
        { name: { $regex: new RegExp(query, "i") } },
        { bio: { $regex: new RegExp(query, "i") } },
      ],
    });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

const generateFileUrl = (filename) => {
  return process.env.URL + `/uploads/${filename}`;
};

router.put(
  "/update-profile-picture/:userId",
  upload.single("profilePicture"),
  async (req, res, next) => {
    const { userId } = req.params;
    const { filename } = req.file;
    
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { profilePicture: generateFileUrl(filename) },
        { new: true }
      );
      if (!user) {
        throw new CustomError("User not found!", 404);
      }

      res
        .status(200)
        .json({ message: "Profile picture updated successfully!", user });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/update-cover-picture/:userId",
  upload.single("coverPicture"),
  async (req, res, next) => {
    const { userId } = req.params;
    const { filename } = req.file;
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { coverPicture: generateFileUrl(filename) },
        { new: true }
      );
      if (!user) {
        throw new CustomError("User not found!", 404);
      }

    
      res
        .status(200)
        .json({ message: "Cover picture updated successfully!", user });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/send-request", async (req, res, next) => {
  try {
    const { userId, targetUserId } = req.body;
    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { connectionRequests: userId },
    });
    res
      .status(200)
      .json({ success: true, message: "Connection request sent successfully" });
  } catch (error) {
    next(error);
  }
});

router.post("/accept-request", async (req, res, next) => {
  try {
    const { userId, requesterId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError(404, "User not found!");
    }
    await User.findByIdAndUpdate(userId, {
      $pull: { connectionRequests: requesterId },
    });
    await User.findByIdAndUpdate(requesterId, {
      $addToSet: { connections: userId },
    });
    await User.findByIdAndUpdate(userId, {
      $addToSet: { connections: requesterId },
    });
    
    res
      .status(200)
      .json({
        success: true,
        message: "Connection request accepted successfully",
        requests:user.connectionRequests
      });
  } catch (error) {
    next(error);
  }
});

router.post("/reject-request", async (req, res, next) => {
  try {
    const { userId, requesterId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError(404, "User not found!");
    }
    await User.findByIdAndUpdate(
      userId,
      { $pull: { connectionRequests: requesterId } },
      { new: true }
    );
  
    res
      .status(200)
      .json({
        success: true,
        message: "Connection request rejected",
        requests: user.connectionRequests,
      });
  } catch (error) {
    next(error);
  }
});

router.get("/connections/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "connections",
      "name profilePicture bio"
    );
    res.status(200).json({ success: true, connections: user.connections });
  } catch (error) {
    next(error);
  }
});

router.get("/requests/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "connectionRequests",
      "name profilePicture bio"
    );
    res.status(200).json({ success: true, users: user.connectionRequests });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
