// Ultra-simple Cursor Auto Resume Script - Copy & paste into browser console

(function () {
    console.log('Cursor Auto Resume: Running');

    // Visual indicator on screen
    const indicatorId = 'cursor-auto-resume-indicator';
    let indicator = document.getElementById(indicatorId);

    if (indicator) {
        // If indicator already exists, remove it to prevent duplicates
        indicator.remove();
    }

    indicator = document.createElement('div');
    indicator.id = indicatorId;
    // Calculate initial left position to maintain current right-side appearance
    const initialLeft = window.innerWidth - 10 - 200; // Assuming ~200px initial width, 10px right padding

    Object.assign(indicator.style, {
        position: 'fixed',
        top: '10px',
        left: `${initialLeft}px`, // Use calculated left instead of fixed right
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '8px',
        zIndex: '99999',
        fontSize: '12px',
        fontFamily: 'monospace',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        cursor: 'grab' // Make it draggable by default
    });
    document.body.appendChild(indicator);

    // Header for drag and collapse
    const header = document.createElement('div');
    Object.assign(header.style, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'grab',
        paddingBottom: '5px',
        borderBottom: '1px solid #333'
    });
    indicator.appendChild(header);

    const titleSpan = document.createElement('span');
    titleSpan.innerText = 'Cursor Auto Resume';
    header.appendChild(titleSpan);

    const collapseButton = document.createElement('button');
    collapseButton.innerText = 'Свернуть'; // Text for collapse
    Object.assign(collapseButton.style, {
        backgroundColor: 'transparent',
        color: 'white',
        border: 'none',
        fontSize: '10px',
        cursor: 'pointer',
        marginLeft: '10px',
        padding: '2px 5px',
        minWidth: '40px' // Ensure enough space for text
    });
    header.appendChild(collapseButton);

    const contentContainer = document.createElement('div');
    contentContainer.id = 'cursor-auto-resume-content';
    Object.assign(contentContainer.style, {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    });
    indicator.appendChild(contentContainer);

    const statusSpan = document.createElement('span');
    statusSpan.id = 'cursor-auto-resume-status';
    contentContainer.appendChild(statusSpan);

    const buttonContainer = document.createElement('div');
    Object.assign(buttonContainer.style, {
        display: 'flex',
        gap: '5px',
        marginTop: '5px'
    });
    contentContainer.appendChild(buttonContainer);

    const durationControlContainer = document.createElement('div');
    Object.assign(durationControlContainer.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        marginTop: '5px',
        color: 'lightgray'
    });
    contentContainer.appendChild(durationControlContainer);

    const durationLabel = document.createElement('span');
    durationLabel.innerText = 'Остановка через:';
    durationControlContainer.appendChild(durationLabel);

    const durationSelect = document.createElement('select');
    durationSelect.id = 'auto-stop-duration';
    Object.assign(durationSelect.style, {
        backgroundColor: '#333',
        color: 'white',
        border: '1px solid #666',
        borderRadius: '4px',
        fontSize: '10px',
        padding: '2px 4px'
    });
    durationControlContainer.appendChild(durationSelect);

    const durations = [1, 5, 10, 15, 20, 30, 45, 60];
    durations.forEach(min => {
        const option = document.createElement('option');
        option.value = min;
        option.innerText = `${min} мин`;
        durationSelect.appendChild(option);
    });

    // Timer variables
    let startTime = Date.now();
    let maxDuration = 30 * 60 * 1000; // Default 30 minutes in milliseconds

    // Set initial selection
    durationSelect.value = (maxDuration / 60 / 1000).toString();

    let intervalId;
    let isRunning = false; // Add state tracking

    // Renamed for clarity: tracks last time any interaction (click or error detection) happened
    let lastInteractionTime = 0;
    let lastDetectedErrorText = null;
    let currentErrorRetryCount = 0;
    const retryDelays = [5000, 10000, 20000, 45000, 60000]; // in milliseconds

    // Define error scenarios globally
    const errorScenarios = [
        {
            errorText: "We're having trouble connecting to the model provider",
            buttonText: 'Resume', // Updated to match error3.html
            logMessage: 'Clicking "Resume" button for connection error.'
        },
        {
            errorText: "We're experiencing high demand for",
            buttonText: 'Try again',
            logMessage: 'Clicking "Try again" button for high demand error.'
        },
        {
            errorText: "Connection failed. If the problem persists, please check your internet connection",
            buttonText: 'Try again',
            logMessage: 'Clicking "Try again" button for connection failed error.'
        },
        {
            errorText: "Too many requests",
            buttonText: 'Try again',
            logMessage: 'Clicking "Try again" button for too many requests error.'
        },
        {
            errorText: "An unexpected error occurred",
            buttonText: 'Try again',
            logMessage: 'Clicking "Try again" button for unexpected error.'
        },
        {
            errorText: "Session expired",
            buttonText: 'Log in',
            logMessage: 'Clicking "Log in" button for session expired error.'
        },
        {
            errorText: "This might be temporary - please try again in a moment",
            buttonText: 'Resume',
            logMessage: 'Clicking "Resume" button for temporary connection error.'
        }
    ];

    durationSelect.onchange = (event) => {
        const selectedMinutes = parseInt(event.target.value);
        maxDuration = selectedMinutes * 60 * 1000;
        console.log(`Cursor Auto Resume: Auto-stop duration set to ${selectedMinutes} minutes.`);
        updateIndicator(`Duration: ${selectedMinutes} min`);
        click_reset(); // Reset timer with new duration
    };

    // Timer display element
    const timerDisplay = document.createElement('div');
    Object.assign(timerDisplay.style, {
        fontSize: '10px',
        color: 'lightblue',
        marginTop: '3px'
    });
    contentContainer.appendChild(timerDisplay);

    // Function to update timer display
    function updateTimer() {
        if (!timerDisplay) return;

        const now = Date.now();
        const elapsed = now - startTime;
        const remaining = maxDuration - elapsed;

        if (remaining <= 0) {
            timerDisplay.innerText = 'Time: Expired';
            return;
        }

        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        timerDisplay.innerText = `Time left: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Update timer display every second
    setInterval(updateTimer, 1000);
    updateTimer(); // Initial update

    // Draggable functionality
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - indicator.getBoundingClientRect().left;
        offsetY = e.clientY - indicator.getBoundingClientRect().top;
        indicator.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        indicator.style.left = `${e.clientX - offsetX}px`;
        indicator.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        indicator.style.cursor = 'grab';
    });

    // Collapsible functionality
    let isCollapsed = false;
    collapseButton.onclick = () => {
        isCollapsed = !isCollapsed;
        if (isCollapsed) {
            contentContainer.style.display = 'none';
            indicator.style.width = 'fit-content';
            indicator.style.padding = '5px 10px';
            header.style.borderBottom = 'none';
            collapseButton.innerText = 'Развернуть'; // Text for expand
        } else {
            contentContainer.style.display = 'flex';
            indicator.style.width = 'auto';
            indicator.style.padding = '8px 12px';
            header.style.borderBottom = '1px solid #333';
            collapseButton.innerText = 'Свернуть'; // Text for collapse
        }
    };

    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.innerText = text;
        Object.assign(button.style, {
            backgroundColor: '#444',
            color: 'white',
            border: '1px solid #666',
            padding: '3px 7px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '10px'
        });
        button.onmouseover = () => button.style.backgroundColor = '#555';
        button.onmouseout = () => button.style.backgroundColor = '#444';
        button.onclick = onClick;
        buttonContainer.appendChild(button);
        return button;
    }

    function updateIndicator(message) {
        if (statusSpan) {
            statusSpan.innerText = `Status: ${message}`;
        }
    }

    function startScript() {
        if (isRunning) {
            console.log('Cursor Auto Resume: Script is already running');
            return;
        }

        console.log('Cursor Auto Resume: Starting script');
        isRunning = true;
        intervalId = setInterval(() => {
            clickResumeLink();
            updateTimer();
        }, 1000);
        updateIndicator('Running');

        // Also run once immediately
        clickResumeLink();
        updateTimer();
    }

    function stopScript() {
        if (!isRunning) {
            console.log('Cursor Auto Resume: Script is already stopped');
            return;
        }

        console.log('Cursor Auto Resume: Stopping script');
        isRunning = false;
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        updateIndicator('Stopped');
    }

    function exitScript() {
        console.log('Cursor Auto Resume: Exiting script');
        stopScript();
        if (indicator && indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
        }
    }

    // Global functions for manual control
    window.click_reset = function () {
        console.log('Cursor Auto Resume: Timer reset');
        startTime = Date.now();
        updateTimer();
        if (!isRunning) {
            startScript(); // Restart if stopped
        }
        updateIndicator('Timer reset');
    };

    window.click_stop = function () {
        stopScript();
    };

    window.click_start = function () {
        startScript();
    };

    // Update button event listeners
    const stopButton = createButton('Остановить', stopScript);
    const resumeButton = createButton('Продолжить', click_reset);
    const exitButton = createButton('Выйти', exitScript);
    const resetTimerButton = createButton('Сброс таймера', click_reset);

    // Main function that looks for and clicks the resume link
    function clickResumeLink() {
        if (!isRunning) {
            return; // Don't execute if script is stopped
        }

        console.log('Cursor Auto Resume: clickResumeLink executed.');
        updateIndicator('Checking...');
        // Check if 30 minutes have passed
        const now = Date.now();
        if (now - startTime > maxDuration) {
            console.log('Cursor Auto Resume: Maximum duration elapsed, stopping auto-click');
            stopScript(); // Use stopScript instead of just clearing interval
            return;
        }

        // Determine effective delay based on last detected error, or default 3 seconds
        let appliedDelay = 3000; // Default general cooldown
        if (lastDetectedErrorText) {
            const delayIndex = Math.min(currentErrorRetryCount - 1, retryDelays.length - 1);
            appliedDelay = retryDelays[delayIndex];
        }

        // Apply the cooldown logic
        if (now - lastInteractionTime < appliedDelay) {
            console.log(`Cursor Auto Resume: Cooldown active (${appliedDelay / 1000}s), skipping click.`);
            updateIndicator(`Cooldown: ${appliedDelay / 1000}s`);
            return;
        }

        // Proceed to check for elements if not in cooldown
        console.log('Cursor Auto Resume: clickResumeLink executed.');
        updateIndicator('Checking...');

        let errorHandledInThisCycle = false;

        // --- Scenario 1: "stop the agent after..." (Tool Limit Message) ---
        const toolLimitXpath = document.evaluate(
            "//section[contains(@data-markdown-raw, 'stop the agent after') or contains(@data-markdown-raw, 'Note: we default stop')]",
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < toolLimitXpath.snapshotLength; i++) {
            const textNode = toolLimitXpath.snapshotItem(i);
            const el = textNode; // Now el is the section element itself

            if (!el || !el.textContent) {
                console.log('Cursor Auto Resume: Tool limit text node or parent missing.');
                continue;
            }

            // Double-check with regex for "stop the agent after X tool calls" pattern
            const text = el.textContent;
            const hasRateLimitText = (
                /stop the agent after \d+ tool calls/i.test(text) ||
                text.includes('Note: we default stop')
            );

            if (hasRateLimitText) {
                // Find the resume link inside this element
                const links = el.querySelectorAll('a, span.markdown-link, [role="link"], [data-link]');
                let linkFound = false;
                for (const link of links) {
                    if (link.textContent.trim() === 'resume the conversation') {
                        console.log('Cursor Auto Resume: Clicking "resume the conversation" link.');
                        updateIndicator('Clicking "resume the conversation"');
                        link.click();
                        lastInteractionTime = now;
                        linkFound = true;
                        // Reset error state if a non-error link was clicked
                        lastDetectedErrorText = null;
                        currentErrorRetryCount = 0;
                        return; // Exit after successful click
                    }
                }
                if (!linkFound) {
                    console.log('Cursor Auto Resume: "resume the conversation" link not found in tool limit context.');
                    updateIndicator('Link not found (tool limit)');
                }
            }
        }

        // --- Scenario 2: General Error Popups (e.g., from error.html, error2.html) ---
        // Search for error popups using multiple selectors
        const errorPopups = document.querySelectorAll('.composer-warning-popup, .anysphere-notification-banner, .anysphere-modal-content, [class*="warning"], [class*="error"], [class*="popup"]');

        for (const popup of errorPopups) {
            for (const scenario of errorScenarios) {
                // Search for the error message within the current popup using multiple approaches
                let hasErrorText = false;

                // Check in composer-error-message class
                const errorMessageElement = popup.querySelector('.composer-error-message');
                if (errorMessageElement && errorMessageElement.textContent.includes(scenario.errorText)) {
                    hasErrorText = true;
                }

                // Check in data-markdown-raw attribute
                const markdownElement = popup.querySelector('[data-markdown-raw*="' + scenario.errorText + '"]');
                if (markdownElement) {
                    hasErrorText = true;
                }

                // Fallback: check in entire popup text content
                if (!hasErrorText && popup.textContent.includes(scenario.errorText)) {
                    hasErrorText = true;
                }

                if (hasErrorText) {
                    console.log(`Cursor Auto Resume: Detected error: "${scenario.errorText}" in popup.`);
                    updateIndicator(`Detected: "${scenario.errorText.substring(0, 20)}..."`);

                    // Handle error retry logic
                    if (lastDetectedErrorText === scenario.errorText) {
                        currentErrorRetryCount++;
                    } else {
                        lastDetectedErrorText = scenario.errorText;
                        currentErrorRetryCount = 1;
                    }

                    const delayIndex = Math.min(currentErrorRetryCount - 1, retryDelays.length - 1);
                    const appliedDelay = retryDelays[delayIndex];

                    if (now - lastInteractionTime < appliedDelay) {
                        console.log(`Cursor Auto Resume: Cooldown active for persistent error (${appliedDelay / 1000}s), skipping click.`);
                        updateIndicator(`Cooldown: ${appliedDelay / 1000}s`);
                        errorHandledInThisCycle = true;
                        return;
                    }

                    // Search for the button using multiple approaches
                    let button = null;

                    // Approach 1: Look for anysphere button classes
                    const buttonContainers = popup.querySelectorAll(
                        'div.anysphere-secondary-button, div.anysphere-primary-button, .anysphere-text-button'
                    );
                    for (const container of buttonContainers) {
                        if (container.textContent.trim().toLowerCase().includes(scenario.buttonText.trim().toLowerCase())) {
                            button = container;
                            break;
                        }
                    }

                    // Approach 2: Look for standard button elements
                    if (!button) {
                        const standardButtons = popup.querySelectorAll('button');
                        for (const btn of standardButtons) {
                            if (btn.textContent.trim().toLowerCase().includes(scenario.buttonText.trim().toLowerCase())) {
                                button = btn;
                                break;
                            }
                        }
                    }

                    // Approach 3: Look for clickable elements with the button text
                    if (!button) {
                        const clickableElements = popup.querySelectorAll('[role="button"], .cursor-pointer, [onclick]');
                        for (const elem of clickableElements) {
                            if (elem.textContent.trim().toLowerCase().includes(scenario.buttonText.trim().toLowerCase())) {
                                button = elem;
                                break;
                            }
                        }
                    }

                    // Approach 4: General search for any element containing the button text
                    if (!button) {
                        const allElements = popup.querySelectorAll('*');
                        for (const elem of allElements) {
                            if (elem.textContent.trim().toLowerCase() === scenario.buttonText.trim().toLowerCase() &&
                                (elem.tagName === 'SPAN' || elem.tagName === 'DIV') &&
                                elem.parentElement &&
                                (elem.parentElement.style.cursor === 'pointer' || elem.parentElement.classList.contains('cursor-pointer'))) {
                                button = elem.parentElement;
                                break;
                            }
                        }
                    }

                    if (button) {
                        console.log(scenario.logMessage);
                        updateIndicator(`Clicking: "${scenario.buttonText}"`);
                        button.click();
                        lastInteractionTime = now;
                        errorHandledInThisCycle = true;
                        // Reset error state if a button for this error was successfully clicked
                        lastDetectedErrorText = null;
                        currentErrorRetryCount = 0;
                        return; // Exit after successful click
                    } else {
                        console.log(`Cursor Auto Resume: Button "${scenario.buttonText}" not found for error: "${scenario.errorText}" in popup.`);
                        console.log('Cursor Auto Resume: Available buttons in popup:', Array.from(popup.querySelectorAll('button, [role="button"], .anysphere-secondary-button, .anysphere-primary-button')).map(b => b.textContent.trim()));
                        updateIndicator(`Button not found for: "${scenario.errorText.substring(0, 20)}..."`);
                        // Update lastInteractionTime even if button not found, to apply backoff for persistent error
                        lastInteractionTime = now;
                        errorHandledInThisCycle = true;
                        return; // Exit since an error message was detected and processed (even if button not found)
                    }
                }
            }
        }

        // If no action was taken (no link/button clicked in any scenario), reset error state for next cycle
        if (!errorHandledInThisCycle) {
            lastDetectedErrorText = null;
            currentErrorRetryCount = 0;
        }
    }

    // Start the script initially
    startScript();

    // Log timer info
    console.log('Cursor Auto Resume: Will stop after 30 minutes. Call click_reset() to reset timer.');

})();