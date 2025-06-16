import User from "../../models/User.js";

const profile_get = async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  res.render("user/profile", { title: "My Profile", user });
};

const profile_post = async (req, res) => {
  const user = await User.findById(req.params.id);

  // Update text fields
  const { username, email, phone, city } = req.body;
  user.username = username;
  user.email    = email;
  user.phone    = phone;
  user.city     = city;

  // Avatar upload
  if (req.files.profilePicture) {
    user.profilePicture = "/uploads/users/" + req.files.profilePicture[0].filename;
  }

  // Album uploads
  if (req.files.albums) {
    req.files.albums.forEach(f =>
      user.albums.push("/uploads/users/" + f.filename)
    );
  }

  await user.save();
  res.redirect(`/user/${req.params.id}/profile`);
};

export default { profile_get, profile_post };
