const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');

// Helper: get all API log files
async function getSortedApiLogs() {
    const files = await fs.promises.readdir(logDir);
    return files
        .filter(f => f.startsWith('api-') && f.endsWith('.log'))
        .sort((a, b) => b.localeCompare(a));
}

exports.allLogs = async (req, res) => {
    try {
        const logFiles = await getSortedApiLogs();
        res.json({ status: true, body: logFiles });
    } catch (err) {
        console.error('❌ Error fetching all logs:', err);
        res.status(500).json({ status: true, body: 'Could not get all logs' });
    }
};

exports.recentLogs = async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const fileName = `api-${today}.log`;
    const filePath = path.join(logDir, fileName);

    try {
        const data = await fs.promises.readFile(filePath, 'utf8');

        const lines = data.trim().split('\n');
        const lastLines = lines.slice(-4); // last 4 lines

        res.json({ status: true, body: lastLines });
    } catch (err) {
        console.error('❌ Error reading recent log file:', err);
        res.status(500).json({ status: false, body: 'Could not get recent logs' });
    }
};


exports.viewLog = async (req, res) => {
    const { filename } = req.params;

    if (!filename.startsWith('api-') || !filename.endsWith('.log')) {
        return res.status(400).json({ status: false, body: 'Invalid log file' });
    }

    const filePath = path.join(logDir, filename);
    if (!filePath.startsWith(logDir)) {
        return res.status(400).json({ status: false, body: 'Invalid path' });
    }

    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const lines = data.split('\n').filter(line => line.trim() !== '');
        res.json({ status: true, body: lines });
    } catch (err) {
        console.error('❌ Error reading log file:', err);
        res.status(404).json({ status: false, body: 'Log not found' });
    }
};

