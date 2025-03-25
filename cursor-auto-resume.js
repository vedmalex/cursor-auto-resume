/**
 * Cursor Auto Resume
 * 
 * This script automatically clicks the "resume the conversation" link when 
 * Cursor IDE hits its API rate limits.
 * 
 * @license MIT
 * @version 1.0.0
 */

// Main script - self-executing function to avoid polluting global scope
(function() {
    console.log('Cursor Auto Resume: Running');
    
    // Track last click time to avoid multiple clicks
    let lastClickTime = 0;
    let clickCount = 0;
    
    // Main function that looks for and clicks the resume link
    function clickResumeLink() {
        // Prevent clicking too frequently (3 second cooldown)
        const now = Date.now();
        if (now - lastClickTime < 3000) return;
        
        // Find elements with rate limit text
        const elements = document.querySelectorAll('body *');
        for (const el of elements) {
            if (!el || !el.textContent) continue;
            
            // Check if element contains rate limit text
            if (el.textContent.includes('stop the agent after 25 tool calls') || 
                el.textContent.includes('Note: we default stop')) {
                
                // Find the resume link inside this element
                const links = el.querySelectorAll('a, span.markdown-link, [role="link"], [data-link]');
                for (const link of links) {
                    if (link.textContent.trim() === 'resume the conversation') {
                        console.log('Clicking "resume the conversation" link');
                        link.click();
                        lastClickTime = now;
                        clickCount++;
                        updateIndicator();
                        return;
                    }
                }
            }
        }
    }
    
    // Clear any existing interval to avoid duplicates
    if (window.__cursorAutoResumeInterval) {
        clearInterval(window.__cursorAutoResumeInterval);
        window.__cursorAutoResumeInterval = null;
    }
    
    // Create visual indicator
    function createIndicator() {
        let indicator = document.getElementById('cursor-auto-resume-indicator');
        if (indicator) return indicator;
        
        indicator = document.createElement('div');
        indicator.id = 'cursor-auto-resume-indicator';
        indicator.style = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 12px;
            z-index: 9999999;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        `;
        
        indicator.innerHTML = `
            <div style="width: 10px; height: 10px; border-radius: 50%; background-color: #4caf50;"></div>
            <span>Cursor Auto Resume: Active</span>
        `;
        
        indicator.title = 'Click to disable';
        indicator.onclick = toggleAutoResume;
        document.body.appendChild(indicator);
        return indicator;
    }
    
    // Update indicator text and state
    function updateIndicator() {
        const indicator = document.getElementById('cursor-auto-resume-indicator');
        if (!indicator) return;
        
        const statusDot = indicator.querySelector('div');
        const statusText = indicator.querySelector('span');
        
        if (window.__cursorAutoResumeInterval) {
            statusDot.style.backgroundColor = '#4caf50'; // green
            statusText.textContent = `Cursor Auto Resume: Active${clickCount > 0 ? ` (${clickCount})` : ''}`;
        } else {
            statusDot.style.backgroundColor = '#f44336'; // red
            statusText.textContent = 'Cursor Auto Resume: Disabled';
        }
    }
    
    // Toggle the auto-resume functionality
    function toggleAutoResume() {
        if (window.__cursorAutoResumeInterval) {
            // Disable
            clearInterval(window.__cursorAutoResumeInterval);
            window.__cursorAutoResumeInterval = null;
            console.log('Cursor Auto Resume: Disabled');
        } else {
            // Enable
            window.__cursorAutoResumeInterval = setInterval(clickResumeLink, 1000);
            console.log('Cursor Auto Resume: Enabled');
        }
        updateIndicator();
    }
    
    // Add keyboard shortcut (Alt+R) to toggle
    function setupKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'r') {
                console.log('Keyboard shortcut detected');
                toggleAutoResume();
            }
        });
    }
    
    // Initialize everything
    function initialize() {
        // Create the visual indicator
        createIndicator();
        
        // Set up the interval
        window.__cursorAutoResumeInterval = setInterval(clickResumeLink, 1000);
        
        // Run once immediately
        clickResumeLink();
        
        // Set up keyboard shortcut
        setupKeyboardShortcut();
        
        console.log('Cursor Auto Resume: Active - Click the indicator to toggle or press Alt+R');
    }
    
    // Start everything
    initialize();
})(); 