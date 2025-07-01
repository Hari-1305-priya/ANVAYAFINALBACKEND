const Therapist = require('../models/therapist');
const bcrypt = require('bcrypt');

// ✅ Register Therapist
exports.registerTherapist = async (req, res) => {
  try {
    const { therapistName, email, password, approved } = req.body;

    const existing = await Therapist.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Therapist already exists' });
    }

    const newTherapist = new Therapist({
      therapistName,
      email,
      password,
      approved: approved || false // ✅ fixed from isApproved
    });

    await newTherapist.save();
    res.status(201).json({ message: 'Therapist registered successfully' });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Therapist Login
exports.therapistLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const therapist = await Therapist.findOne({ email });
    if (!therapist) {
      return res.status(400).json({ message: 'Therapist not found' });
    }

    const isMatch = await bcrypt.compare(password, therapist.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    if (!therapist.approved) { // ✅ fixed from isApproved
      return res.status(403).json({ message: 'Therapist not approved by admin' });
    }

    res.status(200).json({
      message: 'Login successful',
      userId: therapist._id,
      role: 'therapist'
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get Therapist by ID
exports.getTherapistById = async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id).select("-password");
    if (!therapist) {
      return res.status(404).json({ message: "Therapist not found" });
    }
    res.status(200).json(therapist);
  } catch (err) {
    console.error("Get Therapist Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get Unapproved Therapists
exports.getUnapprovedTherapists = async (req, res) => {
  try {
    const therapists = await Therapist.find({ approved: false }).select("-password"); // ✅ fixed from isApproved
    res.status(200).json(therapists);
  } catch (err) {
    console.error("Fetch unapproved therapists:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get Approved Therapists
exports.getApprovedTherapists = async (req, res) => {
  try {
    const therapists = await Therapist.find({ approved: true }).select("-password"); // ✅ fixed
    res.status(200).json(therapists);
  } catch (err) {
    console.error("Fetch approved therapists:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Approve Therapist
exports.approveTherapist = async (req, res) => {
  try {
    const { id } = req.params;
    const therapist = await Therapist.findById(id);
    if (!therapist) {
      return res.status(404).json({ message: "Therapist not found" });
    }

    therapist.approved = true; // ✅ fixed from isApproved
    await therapist.save();
    res.status(200).json({ message: "Therapist approved", therapist });
  } catch (err) {
    console.error("Approve therapist error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Delete Therapist
exports.deleteTherapist = async (req, res) => {
  try {
    const therapist = await Therapist.findByIdAndDelete(req.params.id);
    if (!therapist) {
      return res.status(404).json({ message: "Therapist not found" });
    }
    res.status(200).json({ message: "Therapist removed successfully" });
  } catch (err) {
    console.error("Delete Therapist Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
