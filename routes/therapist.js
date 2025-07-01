const express = require('express');
const router = express.Router();

const {
  therapistLogin,
  getTherapistById,
  registerTherapist,
  getUnapprovedTherapists,
  getApprovedTherapists,      // ✅ New Controller
  approveTherapist,
  deleteTherapist
} = require('../controllers/therapistController');

// 🧑‍⚕️ Therapist registers (added by admin or self)
router.post('/register', registerTherapist);

// 🔐 Therapist login
router.post('/login', therapistLogin);

// 📄 Get therapist profile by ID
router.get('/:id', getTherapistById);

// 🛠️ Admin-only routes (approval + deletion)
router.get('/admin/unapproved', getUnapprovedTherapists);       // Pending approval
router.get('/admin/approved', getApprovedTherapists);          // ✅ NEW: View approved
router.put('/admin/approve/:id', approveTherapist);             // Approve therapist
router.delete('/admin/delete/:id', deleteTherapist);            // Delete therapist

module.exports = router;
