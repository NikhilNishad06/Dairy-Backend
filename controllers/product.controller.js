const supabase = require("../config/supabase");

// ==============================
// GET ALL PRODUCTS
// ==============================
exports.getProducts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==============================
// ADD PRODUCT WITH IMAGE
// ==============================
exports.addProduct = async (req, res) => {
  try {
    const { name, category, price, rating, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // ✅ SAFE FILE NAME
    const ext = req.file.originalname.split(".").pop();
    const filePath = `products/${Date.now()}.${ext}`;

    // ✅ SAME BUCKET NAME EVERYWHERE
    const bucket = "product";

    // ⬆️ UPLOAD IMAGE
    const { data: uploadData, error: uploadError } =
      await supabase.storage
        .from(bucket)
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
        });

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message });
    }

    // 🌍 GET PUBLIC URL
    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(uploadData.path);

    const image_url = publicData.publicUrl;

    // 🗃️ INSERT PRODUCT
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          category,
          price: Number(price),
          rating: Number(rating),
          description,
          image_url,
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
// UPDATE PRODUCT (WITH / WITHOUT IMAGE)
// ==============================
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, price, rating, description } = req.body;

  try {
    let image_url;

    // 🔄 If new image uploaded
    if (req.file) {
      const ext = req.file.originalname.split(".").pop();
      const filePath = `products/${Date.now()}.${ext}`;
      const bucket = "product-images";

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

      image_url = publicData.publicUrl;
    }

    // 📝 UPDATE DATA OBJECT
    const updateData = {
      name,
      category,
      price: price ? Number(price) : undefined,
      rating: rating ? Number(rating) : undefined,
      description,
      ...(image_url && { image_url }),
    };

    const { data, error } = await supabase
      .from("products")
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
// DELETE PRODUCT
// ==============================
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
