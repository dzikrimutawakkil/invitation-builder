const express = require('express');
const router = express.Router();

const DesignStorage = require('../services/DesignStorage');
const InvitationController = require('../controllers/InvitationController');

const storageService = new DesignStorage();
const invitationController = new InvitationController(storageService);

// --- Routes ---

router.get('/', invitationController.renderBuilder);

router.post('/save-design', invitationController.saveDesign);

// 🔴 CRITICAL FIX: Add '/:id' here so the server accepts the code
router.get('/share/:id', invitationController.renderInvitation);

// 1. Builder (New)
router.get('/', invitationController.renderBuilder);

// 2. Edit Mode (NEW) - Loads the builder with data
router.get('/edit/:id', invitationController.editBuilder); 

// 3. Save Data
router.post('/save-design', invitationController.saveDesign);

// 4. Share View
router.get('/share/:id', invitationController.renderInvitation);

module.exports = router;