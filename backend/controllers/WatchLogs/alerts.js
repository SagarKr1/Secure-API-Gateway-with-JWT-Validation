const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');

// Helper: get all ALERT log files
async function getSortedAlertLogs() {
    const files = await fs.promises.readdir(logDir);
    return files
        .filter(f => f.startsWith('alert-') && f.endsWith('.log'))
        .sort((a, b) => b.localeCompare(a));
}

exports.allAlerts = async (req, res) => {
    try {
        const alertFiles = await getSortedAlertLogs();
        res.json({ status: true, files: alertFiles });
    } catch (err) {
        console.error('❌ Error fetching all alerts:', err);
        res.status(500).json({ error: true, message: 'Could not get all alerts' });
    }
};

exports.recentAlerts = async (req, res) => {
    try {
        const alertFiles = await getSortedAlertLogs();
        res.json({ status: true, files: alertFiles.slice(0, 4) });
    } catch (err) {
        console.error('❌ Error fetching recent alerts:', err);
        res.status(500).json({ error: true, message: 'Could not get recent alerts' });
    }
};

exports.viewAlert = async (req, res) => {
    const { filename } = req.params;
    if (!filename.startsWith('alert-') || !filename.endsWith('.log')) {
        return res.status(400).json({ error: true, message: 'Invalid alert file' });
    }

    const filePath = path.join(logDir, filename);
    if (!filePath.startsWith(logDir)) {
        return res.status(400).json({ error: true, message: 'Invalid path' });
    }

    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        res.json({ status: true, content: data });
    } catch (err) {
        console.error('❌ Error reading alert file:', err);
        res.status(404).json({ error: true, message: 'Alert not found' });
    }
};
