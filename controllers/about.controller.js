const supabase = require("../config/supabase");

// ==============================
// GET ABOUT DATA (TEAM MEMBERS)
// ==============================
exports.getAbout = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("team")
      .select("*")
      .order("id", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });

    res.json({
      success: true,
      data: data || []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==============================
// ADD TEAM MEMBER WITH IMAGE
// ==============================
exports.addTeamMember = async (req, res) => {
  try {
    const { name, role, experience, bio } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const ext = req.file.originalname.split(".").pop();
    const filePath = `team/${Date.now()}.${ext}`;
    const bucket = "product"; // Using existing bucket for simplicity

    const { data: uploadData, error: uploadError } =
      await supabase.storage
        .from(bucket)
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
        });

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message });
    }

    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(uploadData.path);

    const image = publicData.publicUrl;

    const { data, error } = await supabase
      .from("team")
      .insert([
        {
          name,
          role,
          experience,
          bio,
          image,
        },
      ])
      .select();

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==============================
// UPDATE TEAM MEMBER
// ==============================
exports.updateTeamMember = async (req, res) => {
  const { id } = req.params;
  const { name, role, experience, bio } = req.body;

  try {
    let image;

    if (req.file) {
      const ext = req.file.originalname.split(".").pop();
      const filePath = `team/${Date.now()}.${ext}`;
      const bucket = "product";

      const { data: uploadData, error: uploadError } =
        await supabase.storage
          .from(bucket)
          .upload(filePath, req.file.buffer, {
            contentType: req.file.mimetype,
          });

      if (uploadError) {
        return res.status(500).json({ error: uploadError.message });
      }

      const { data: publicData } = supabase.storage
        .from(bucket)
        .getPublicUrl(uploadData.path);

      image = publicData.publicUrl;
    }

    const updateData = {
      name,
      role,
      experience,
      bio,
      ...(image && { image }),
    };

    const { data, error } = await supabase
      .from("team")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) return res.status(500).json({ error: error.message });

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==============================
// DELETE TEAM MEMBER
// ==============================
exports.deleteTeamMember = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("team")
      .delete()
      .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: "Team member deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
