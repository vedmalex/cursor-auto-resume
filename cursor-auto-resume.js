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
        
        // --- Scenario 1: "stop the agent after..." ---
        const toolLimitXpath = document.evaluate(
            "//div[contains(@class, 'composer-bar')]//text()[contains(., 'stop the agent after') or contains(., 'Note: we default stop')]",
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );
        
        for (let i = 0; i < toolLimitXpath.snapshotLength; i++) {
            const textNode = toolLimitXpath.snapshotItem(i);
            const el = textNode.parentElement;

            if (!el || !el.textContent) continue;
            
            // Double-check with regex for "stop the agent after X tool calls" pattern
            const text = el.textContent;
            const hasRateLimitText = (
                /stop the agent after \d+ tool calls/i.test(text) ||
                text.includes('Note: we default stop')
            );
            
            if (hasRateLimitText) {
                // Find the resume link inside this element
                const links = el.querySelectorAll('a, span.markdown-link, [role="link"], [data-link]');
                for (const link of links) {
                    if (link.textContent.trim() === 'resume the conversation') {
                        console.log('Clicking "resume the conversation" link');
                        link.click();
                        lastClickTime = now;
                        return; // Exit after successful click
                    }
                }
            }
        }
        
        // --- Scenarios 2 & 3: Popup errors in chat window ---
        const chatWindow = document.querySelector("div[class*='composer-bar']")?.closest("div[class*='full-input-box']");
        if (!chatWindow) return;

        const errorScenarios = [
            {
                errorText: "We're having trouble connecting to the model provider",
                buttonText: 'Resume',
                logMessage: 'Clicking "Resume" button for connection error.'
            },
            {
                errorText: "We're experiencing high demand for",
                buttonText: 'Try again',
                logMessage: 'Clicking "Try again" button for high demand error.'
            }
        ];

        for (const scenario of errorScenarios) {
            const errorXpath = `.//section[contains(@data-markdown-raw, "${scenario.errorText}")] | .//div[contains(text(), "${scenario.errorText}")] | .//span[contains(text(), "${scenario.errorText}")]`;
            const errorElementResult = document.evaluate(errorXpath, chatWindow, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
            
            if (errorElementResult) {
                const buttonXpath = `(.//div[contains(@class, 'anysphere-secondary-button')]//span[text()='${scenario.buttonText}']/.. | .//button[contains(., '${scenario.buttonText}')])[last()]`;
                const button = document.evaluate(buttonXpath, chatWindow, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;

                if (button) {
                    console.log(scenario.logMessage);
                    button.click();
                    lastClickTime = now;
                    return; // Exit after successful click
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