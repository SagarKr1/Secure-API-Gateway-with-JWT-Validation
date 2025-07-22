const express = require('express');
const logs = require('../controllers/WatchLogs/logs');
const alerts = require('../controllers/WatchLogs/alerts');

const router = express.Router();

// auth
const authMiddleware = require('../auth/authToken/authToken');

router.get('/', (req, res) => {
    res.json({
        status: true,
        message: '✅ Log router working!'
    });
});

// request/response logs
router.get('/all',authMiddleware(['admin','subadmin']), logs.allLogs);
router.get('/recent',authMiddleware(['admin','subadmin']), logs.recentLogs);
router.get('/view/:filename',authMiddleware(['admin','subadmin']), logs.viewLog);

// alert logs
router.get('/alerts/all',authMiddleware(['admin','subadmin']), alerts.allAlerts);
router.get('/alerts/recent',authMiddleware(['admin','subadmin']), alerts.recentAlerts);
router.get('/alerts/view/:filename',authMiddleware(['admin','subadmin']), alerts.viewAlert);

module.exports = router;
