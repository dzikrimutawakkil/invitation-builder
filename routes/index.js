const express = require('express');
const router = express.Router();

// We need to instantiate our classes here to link them up
const DesignStorage = require('../services/DesignStorage');
const InvitationController = require('../controllers/InvitationController');

// 1. Create the Service Instance
const storageService = new DesignStorage();

// 2. Create the Controller Instance (injecting the service)
const invitationController = new InvitationController(storageService);

// --- Define Routes ---

// Route to the Builder Page
router.get('/', invitationController.renderBuilder);

// Route to Save Data
router.post('/save-design', invitationController.saveDesign);

// Route to View the Shared Page
router.get('/share', invitationController.renderInvitation);

module.exports = router;