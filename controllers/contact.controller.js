const supabase = require("../config/supabase");

// ==========================
// GET all contacts
// ==========================
exports.getContacts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error("GET CONTACT ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// GET single contact by ID
// ==========================
exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error("GET CONTACT BY ID ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// CREATE a new contact
// ==========================
exports.createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, productInterest, message } =
      req.body;

    const { data, error } = await supabase
      .from("contacts")
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          product_interest: productInterest,
          message,
        },
      ])
      .select(); // returns inserted row

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error("POST CONTACT ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// UPDATE a contact by ID
// ==========================
exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, productInterest, message } =
      req.body;

    const { data, error } = await supabase
      .from("contacts")
      .update({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        product_interest: productInterest,
        message,
      })
      .eq("id", id)
      .select(); // returns updated row

    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("UPDATE CONTACT ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// DELETE a contact by ID
// ==========================
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("contacts")
      .delete()
      .eq("id", id)
      .select(); // returns deleted row

    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("DELETE CONTACT ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
