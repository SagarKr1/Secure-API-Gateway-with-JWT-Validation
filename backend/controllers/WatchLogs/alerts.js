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

// GET: List all alert log filenames
exports.allAlerts = async (req, res) => {
    try {
        const alertFiles = await getSortedAlertLogs();
        res.json({ status: true, body: alertFiles });
    } catch (err) {
        console.error('❌ Error fetching all alerts:', err);
        res.status(500).json({ status: false, body: 'Could not get all alerts' });
    }
};

// GET: Get last 4 lines from today’s alert log
exports.recentAlerts = async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const fileName = `alert-${today}.log`;
    const filePath = path.join(logDir, fileName);

    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const lines = data.trim().split('\n').filter(Boolean);
        const lastLines = lines.slice(-4);
        res.json({ status: true, body: lastLines });
    } catch (err) {
        console.error('❌ Error reading recent alert file:', err);
        res.status(404).json({ status: false, body: 'Could not get recent alerts' });
    }
};

// GET: View full alert log by filename
exports.viewAlert = async (req, res) => {
    const { filename } = req.params;

    if (!filename.startsWith('alert-') || !filename.endsWith('.log')) {
        return res.status(400).json({ status: false, body: 'Invalid alert file' });
    }

    const filePath = path.join(logDir, filename);
    const resolvedPath = path.resolve(filePath);

    if (!resolvedPath.startsWith(path.resolve(logDir))) {
        return res.status(400).json({ status: false, body: 'Invalid path' });
    }

    try {
        const data = await fs.promises.readFile(resolvedPath, 'utf8');
        const lines = data.split('\n').filter(Boolean);
        res.json({ status: true, body: lines });
    } catch (err) {
        console.error('❌ Error reading alert file:', err);
        res.status(404).json({ status: false, body: 'Alert not found' });
    }
};
