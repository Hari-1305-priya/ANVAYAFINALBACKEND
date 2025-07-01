const Therapist = require('../models/therapist');
const Student = require('../models/student');
const bcrypt = require('bcryptjs');

// ✅ Load admin credentials from .env (fallback to default)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@anvaya.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // ✅ Admin login
    if (role === 'admin') {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        return res.status(200).json({
          message: 'Admin login successful',
          userId: 'admin',
          role: 'admin'
        });
      } else {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }
    }

    // ✅ Therapist login
    if (role === 'therapist') {
      const therapist = await Therapist.findOne({ email });
      if (!therapist) return res.status(404).json({ message: 'Therapist not found' });

      const isMatch = await bcrypt.compare(password, therapist.password);
      if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

      // ✅ Fix: use correct field name
      if (!therapist.approved) {
        return res.status(403).json({ message: 'Therapist not approved yet' });
      }

      return res.status(200).json({
        message: 'Therapist login successful',
        userId: therapist._id,
        role: 'therapist'
      });
    }

    // ✅ Student login
    if (role === 'student') {
      const student = await Student.findOne({ email });
      if (!student) return res.status(404).json({ message: 'Student not found' });

      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

      return res.status(200).json({
        message: 'Student login successful',
        userId: student._id,
        role: 'student'
      });
    }

    return res.status(400).json({ message: 'Invalid user role provided' });

  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
};
