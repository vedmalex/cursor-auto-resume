// Ultra-simple Cursor Auto Resume Script - Copy & paste into browser console
(function() {
    console.log('Cursor Auto Resume: Running');
    
    // Track last click time to avoid multiple clicks
    let lastClickTime = 0;
    
    // Timer variables
    let startTime = Date.now();
    const maxDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
    let intervalId;
    
    // Function to reset the timer
    function click_reset() {
        startTime = Date.now();
        console.log('Cursor Auto Resume: Timer reset');
    }
    
    // Make click_reset available globally
    window.click_reset = click_reset;
    
    // Main function that looks for and clicks the resume link
    function clickResumeLink() {
        // Check if 30 minutes have passed
        const now = Date.now();
        if (now - startTime > maxDuration) {
            console.log('Cursor Auto Resume: 30 minutes elapsed, stopping auto-click');
            clearInterval(intervalId);
            return;
        }
        
        // Prevent clicking too frequently (3 second cooldown)
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
                        return;
                    }
                }
            }
        }
    }
    
    // Run periodically
    intervalId = setInterval(clickResumeLink, 1000);
    
    // Also run once immediately
    clickResumeLink();
    
    // Log timer info
    console.log('Cursor Auto Resume: Will stop after 30 minutes. Call click_reset() to reset timer.');
    
})(); 