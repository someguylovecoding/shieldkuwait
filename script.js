// Parse death log and format it
function parseDeathLog(logText, year, misc) {
    const lines = logText.trim().split('\n');

    if (lines.length === 0) {
        return 'Please paste a death log!';
    }

    // Extract location from first line
    // Format: "PD DEATHS [Shiganshina | Wall Maria]"
    const firstLine = lines[0];
    const locationMatch = firstLine.match(/\[([^\]|]+)/);
    let location = 'Unknown Location';

    if (locationMatch) {
        location = locationMatch[1].trim();
    }

    // Parse each death entry
    const deaths = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();

        if (!line) continue;

        // Extract player name before " has perished"
        // Format: "Najin | FatelIess has perished. [NO_TAG] [00:20:38]"
        const deathMatch = line.match(/^(.+?)\s+has perished/);

        if (deathMatch) {
            deaths.push(deathMatch[1].trim());
        }
    }

    // Build formatted output
    let output = `*A PERMANENT DEATH EVENT HAS ENDED IN **${location}!***\n`;
    output += `> **${year}** | \n\n`;
    output += `**KIA:**\n`;

    if (deaths.length > 0) {
        deaths.forEach(name => {
            output += `> ${name}\n`;
        });
    } else {
        output += `> No deaths recorded\n`;
    }

    output += `\n**MISC:**\n`;
    output += `> ${misc || ''}\n\n`;
    output += `⁨⁨⁨⁨⁨⁨⁨⁨⁨⁨\`""\`⁩⁩⁩⁩⁩⁩⁩⁩⁩⁩\n`;
    output += `|| @here||`;

    return output;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const formatBtn = document.getElementById('formatBtn');
    const copyBtn = document.getElementById('copyBtn');
    const deathLogInput = document.getElementById('deathLog');
    const yearInput = document.getElementById('yearInput');
    const miscInput = document.getElementById('miscInput');
    const outputArea = document.getElementById('output');
    const notification = document.getElementById('notification');

    // Format button click
    formatBtn.addEventListener('click', () => {
        const logText = deathLogInput.value;
        const year = yearInput.value || '558 AY';
        const misc = miscInput.value;

        const formatted = parseDeathLog(logText, year, misc);
        outputArea.value = formatted;
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', async () => {
        const text = outputArea.value;

        if (!text) {
            showNotification('Nothing to copy!');
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            showNotification('Copied to clipboard!');
        } catch (err) {
            // Fallback for older browsers
            outputArea.select();
            document.execCommand('copy');
            showNotification('Copied to clipboard!');
        }
    });

    // Show notification
    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }

    // Auto-format on paste (optional convenience feature)
    deathLogInput.addEventListener('paste', () => {
        setTimeout(() => {
            formatBtn.click();
        }, 100);
    });
});
