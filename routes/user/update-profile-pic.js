import axios from "axios";
import { uploadCloudName, uploadPreset } from "../../config/config.js";
import { getDb, ObjectId } from "../../db.js";

export const updateProfilePic = async (req, res) => {
  const db = await getDb();
  const { userId } = req;

  const { profilePicBase64 } = req.body;

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${uploadCloudName}/image/upload`,
      {
        file: profilePicBase64,
        upload_preset: uploadPreset,
      }
    );

    const profilePic = response.data.secure_url.replace(".png", ".jpg");
    const updatedUser = await db
      .collection("user")
      .findOneAndUpdate(
        { _id: ObjectId(userId) },
        { $set: { profilePic } },
        { returnDocument: "after" }
      );

    return res.status(200).json({ user: updatedUser.value });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};
