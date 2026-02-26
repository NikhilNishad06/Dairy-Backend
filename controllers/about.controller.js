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

    // If table doesn't exist or is empty, return mock data
    if (error || !data || data.length === 0) {
      return res.json({
        data: {
          team: [
            {
              id: 1,
              name: "Rajesh Kumar",
              role: "Co-Founder & CEO",
              image: "https://via.placeholder.com/300?text=Rajesh"
            },
            {
              id: 2,
              name: "Priya Singh",
              role: "Co-Founder & Operations Head",
              image: "https://via.placeholder.com/300?text=Priya"
            },
            {
              id: 3,
              name: "Amit Patel",
              role: "Product & Quality Manager",
              image: "https://via.placeholder.com/300?text=Amit"
            }
          ]
        }
      });
    }

    res.json({
      data: {
        team: data || []
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
