// Simple Cursor Auto Resume Script
// Displays total uptime and successful resume clicks.
// In collapsed mode, shows only a red/green status dot in the header.

(function () {
    // Check for and stop any existing instance of the script
    if (window.cursorAutoResumeScript && typeof window.cursorAutoResumeScript.exit === 'function') {
        console.log('Cursor Auto Resume: Detected existing instance, stopping it.');
        window.cursorAutoResumeScript.exit();
    }

    // --- Core variables ---
    let scriptStartTime = Date.now(); // Track when the script started
    let successfulResumesCount = 0;   // Count of successful resume clicks
    let intervalId;
    let isRunning = false;
    let previousIsCollapsed = null; // Track previous collapsed state for minimal DOM updates
    let previousIsRunning = null;   // Track previous running state for minimal DOM updates
    let lastInteractionTime = 0; // Cooldown tracking
    let lastDetectedErrorText = null;
    let currentErrorRetryCount = 0;
    const retryDelays = [5000, 10000, 20000, 45000, 60000]; // in milliseconds
    const baseCooldown = 3000; // 3 seconds cooldown

    const errorScenarios = [
        { errorText: "rate limit", buttonText: "Try again" },
        { errorText: "Rate limit", buttonText: "Try again" },
        { errorText: "Something went wrong", buttonText: "Try again" },
        { errorText: "An error occurred", buttonText: "Resume" },
        { errorText: "We hit the usage limit", buttonText: "Resume" },
        { errorText: "We're having trouble connecting to the model provider", buttonText: "Try again" },
        { errorText: "We're having trouble connecting to the model provider", buttonText: "Resume" }
    ];

    // Visual indicator on screen
    const indicatorId = 'cursor-auto-resume-indicator';
    let indicator = document.getElementById(indicatorId);

    if (indicator) {
        indicator.remove(); // Remove existing indicator if present
    }

    indicator = document.createElement('div');
    indicator.id = indicatorId;
    const initialLeft = window.innerWidth - 10 - 200; // Assuming ~200px initial width, 10px right padding

    Object.assign(indicator.style, {
        position: 'fixed',
        top: '10px',
        left: `${initialLeft}px`,
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
        cursor: 'grab', // Make it draggable
        transition: 'all 0.3s ease'
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

    // Elements for header - these will be toggled
    const titleSpan = document.createElement('span');
    titleSpan.innerText = 'CAR:'; // Default title for expanded state
    header.appendChild(titleSpan);

    const statusDotHeader = document.createElement('span'); // New element for status dot in header
    Object.assign(statusDotHeader.style, {
        fontSize: '12px',
        display: 'none' // Hidden by default, only shown when collapsed
    });
    header.appendChild(statusDotHeader);

    const collapseButton = document.createElement('button');
    collapseButton.innerText = '\u25A0'; // Default text for expanded state (black square for collapse)
    Object.assign(collapseButton.style, {
        backgroundColor: 'transparent',
        color: 'white',
        border: 'none',
        fontSize: '12px', // Slightly larger for better visibility
        cursor: 'pointer',
        marginLeft: '10px',
        padding: '2px 5px',
        minWidth: '20px' // Adjust min-width for single char
    });
    header.appendChild(collapseButton);

    // --- Content Container (for expanded view - new default) ---
    const contentContainer = document.createElement('div');
    contentContainer.id = 'cursor-auto-resume-content';
    Object.assign(contentContainer.style, {
        display: 'flex', // Visible by default (new "normal" state)
        flexDirection: 'column',
        gap: '5px',
        transition: 'opacity 0.3s ease'
    });
    indicator.appendChild(contentContainer);

    // Display for uptime (inside contentContainer)
    const uptimeDisplay = document.createElement('span');
    uptimeDisplay.id = 'uptime-display';
    contentContainer.appendChild(uptimeDisplay);

    // Display for successful resume attempts (inside contentContainer)
    const resumeCountDisplay = document.createElement('span');
    resumeCountDisplay.id = 'resume-count-display';
    contentContainer.appendChild(resumeCountDisplay);

    // Control buttons (inside contentContainer)
    const buttonContainer = document.createElement('div');
    Object.assign(buttonContainer.style, {
        display: 'flex',
        gap: '5px',
        marginTop: '5px'
    });
    contentContainer.appendChild(buttonContainer);

    // Draggable functionality
    let isDragging = false;
    let offsetX, offsetY;

    const handleMouseDown = (e) => {
        isDragging = true;
        offsetX = e.clientX - indicator.getBoundingClientRect().left;
        offsetY = e.clientY - indicator.getBoundingClientRect().top;
        indicator.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        indicator.style.left = `${e.clientX - offsetX}px`;
        indicator.style.top = `${e.clientY - offsetY}px`;
    };

    const handleMouseUp = () => {
        isDragging = false;
        if (indicator) {
            indicator.style.cursor = 'grab';
        }
    };

    header.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // --- Collapsible functionality ---
    let isCollapsed = false;

    // This function will update the content of contentContainer and header dynamically
    function updateUI() {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - scriptStartTime) / 1000);
        const hours = Math.floor(elapsedSeconds / 3600);
        const minutes = Math.floor((elapsedSeconds % 3600) / 60);
        const seconds = elapsedSeconds % 60;
        const uptimeText = `Uptime: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        uptimeDisplay.innerText = uptimeText;
        resumeCountDisplay.innerText = `Successful Clicks: ${successfulResumesCount}`;

        // Update header and content visibility based on collapsed state ONLY if it has changed
        if (isCollapsed !== previousIsCollapsed) {
            if (isCollapsed) {
                contentContainer.style.display = 'none';
                titleSpan.style.display = 'none';
                statusDotHeader.style.display = 'inline-block';
                header.style.justifyContent = 'flex-end';
                header.style.borderBottom = 'none';
                collapseButton.innerText = '\u25A1'; // White square for expand
                indicator.style.width = 'auto'; // Shrink to content
                indicator.style.minWidth = '50px'; // Very small minimal width
                indicator.style.padding = '8px 12px';
            } else {
                contentContainer.style.display = 'flex';
                titleSpan.style.display = 'inline-block';
                statusDotHeader.style.display = 'none';
                header.style.justifyContent = 'space-between';
                header.style.borderBottom = '1px solid #333';
                collapseButton.innerText = '\u25A0'; // Black square for collapse
                indicator.style.width = 'auto'; // Restore width
                indicator.style.minWidth = '200px'; // Restore minimum width for content
                indicator.style.padding = '8px 12px';
            }
            previousIsCollapsed = isCollapsed; // Update previous state
        }

        // Only update the status dot color and text if isRunning state has changed
        // This part applies both in collapsed mode (statusDotHeader is visible) and expanded mode (but statusDotHeader is hidden)
        // so we check if statusDotHeader is currently visible for collapsed state, or if we are in expanded mode
        if (isRunning !== previousIsRunning || previousIsRunning === null) { // Update on change or first run
            const newDotColor = isRunning ? '#90EE90' : '#FFB6C1';
            const newDotText = 'AR: ' + (isRunning ? '\u25CF' : '\u25CB'); // Filled for running, empty for stopped

            if (statusDotHeader.style.color !== newDotColor) {
                statusDotHeader.style.color = newDotColor;
            }
            if (statusDotHeader.textContent !== newDotText) {
                statusDotHeader.textContent = newDotText;
            }
            previousIsRunning = isRunning; // Update previous state
        }
    }

    collapseButton.onclick = () => {
        isCollapsed = !isCollapsed;
        updateUI(); // Call updateUI to handle the visual changes
    };

    function startScript() {
        if (isRunning) return;
        isRunning = true;
        intervalId = setInterval(() => {
            clickResumeLink();
            updateUI(); // Update UI on each tick
        }, 1000);

        const toggleButton = document.getElementById('toggle-button');
        if (toggleButton) { toggleButton.innerText = 'Stop'; }
        updateUI(); // Initial UI update, also sets previousIsRunning
    }

    function stopScript() {
        if (!isRunning) return;
        isRunning = false;
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        const toggleButton = document.getElementById('toggle-button');
        if (toggleButton) { toggleButton.innerText = 'Start'; }
        updateUI(); // Update UI on stop, also sets previousIsRunning
    }

    function exitScript() {
        stopScript();
        if (header && handleMouseDown) { header.removeEventListener('mousedown', handleMouseDown); }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        if (indicator) { indicator.remove(); indicator = null; }
        if (window.cursorAutoResumeScript) { window.cursorAutoResumeScript = undefined; }
        console.log('Cursor Auto Resume: Script exited.');
    }

    // Expose control functions globally for clean restart
    window.cursorAutoResumeScript = {
        exit: exitScript,
        stop: stopScript,
        start: startScript,
        reset: () => {
            scriptStartTime = Date.now();
            successfulResumesCount = 0;
            updateUI(); // Update UI on reset
            startScript();
        }
    };

    // Create control buttons
    function createControlButtons() {
        const controlsDiv = document.createElement('div');
        controlsDiv.style.cssText = 'margin-top: 5px; display: flex; gap: 3px; flex-wrap: wrap;';

        const toggleButton = document.createElement('button');
        toggleButton.innerText = isRunning ? 'Stop' : 'Start';
        toggleButton.id = 'toggle-button';
        toggleButton.style.cssText = 'padding: 2px 6px; font-size: 10px; background: #007acc; color: white; border: none; border-radius: 3px; cursor: pointer; flex: 1; min-width: 45px;';
        toggleButton.onclick = () => {
            if (isRunning) {
                stopScript();
            } else {
                startScript();
            }
        };
        controlsDiv.appendChild(toggleButton);

        const resetButton = document.createElement('button');
        resetButton.innerText = 'Reset';
        resetButton.style.cssText = 'padding: 2px 6px; font-size: 10px; background: #555; color: white; border: none; border-radius: 3px; cursor: pointer; flex: 1; min-width: 45px;';
        resetButton.onclick = window.cursorAutoResumeScript.reset;
        controlsDiv.appendChild(resetButton);

        const exitButton = document.createElement('button');
        exitButton.innerText = 'Exit';
        exitButton.style.cssText = 'padding: 2px 6px; font-size: 10px; background: #d73a49; color: white; border: none; border-radius: 3px; cursor: pointer; flex: 1; min-width: 35px;';
        exitButton.onclick = () => {
            if (confirm('Are you sure you want to exit the auto-resume script?')) {
                exitScript();
            }
        };
        controlsDiv.appendChild(exitButton);

        return controlsDiv;
    }

    buttonContainer.appendChild(createControlButtons());

    // Main function that looks for and clicks the resume link/button
    function clickResumeLink() {
        if (!isRunning) {
            return;
        }

        let now = Date.now();
        // Determine effective delay based on last detected error, or default cooldown
        let appliedDelay = baseCooldown;
        if (lastDetectedErrorText) {
            const delayIndex = Math.min(currentErrorRetryCount - 1, retryDelays.length - 1);
            appliedDelay = retryDelays[delayIndex];
        }

        // Apply the cooldown logic
        if (now - lastInteractionTime < appliedDelay) {
            return;
        }

        let errorHandledInThisCycle = false;

        // --- Scenario 1: "resume the conversation" link (Tool Limit Message) ---
        const toolLimitXpath = document.evaluate(
            "//section[contains(@data-markdown-raw, 'stop the agent after') or contains(@data-markdown-raw, 'Note: we default stop')]",
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < toolLimitXpath.snapshotLength; i++) {
            const el = toolLimitXpath.snapshotItem(i);
            if (!el || !el.textContent) continue;

            const text = el.textContent;
            const hasRateLimitText = (
                /stop the agent after \d+ tool calls/i.test(text) ||
                text.includes('Note: we default stop')
            );

            if (hasRateLimitText) {
                const links = el.querySelectorAll('a, span.markdown-link, [role="link"], [data-link]');
                for (const link of links) {
                    if (link.textContent.trim() === 'resume the conversation') {
                        link.click();
                        successfulResumesCount++;
                        lastInteractionTime = now;
                        lastDetectedErrorText = null;
                        currentErrorRetryCount = 0;
                        return; // Stop after successful click
                    }
                }
            }
        }

        // --- Scenario 2: General Error Popups (e.g., from error.html, error2.html) ---
        const errorPopups = document.querySelectorAll('.composer-warning-popup, .anysphere-notification-banner, .anysphere-modal-content, [class*="warning"], [class*="error"], [class*="popup"]');

        for (const popup of errorPopups) {
            for (const scenario of errorScenarios) {
                let hasErrorText = false;
                const errorMessageElement = popup.querySelector('.composer-error-message');
                if (errorMessageElement && errorMessageElement.textContent.includes(scenario.errorText)) {
                    hasErrorText = true;
                }
                const markdownElement = popup.querySelector('[data-markdown-raw*="' + scenario.errorText + '"]');
                if (markdownElement) {
                    hasErrorText = true;
                }
                if (!hasErrorText && popup.textContent.includes(scenario.errorText)) {
                    hasErrorText = true;
                }

                if (hasErrorText) {
                    if (lastDetectedErrorText === scenario.errorText) {
                        currentErrorRetryCount++;
                    } else {
                        lastDetectedErrorText = scenario.errorText;
                        currentErrorRetryCount = 1;
                    }

                    const delayIndex = Math.min(currentErrorRetryCount - 1, retryDelays.length - 1);
                    const appliedDelay = retryDelays[delayIndex];

                    if (now - lastInteractionTime < appliedDelay) {
                        errorHandledInThisCycle = true;
                        return;
                    }

                    let button = null;
                    const buttonContainers = popup.querySelectorAll('div.anysphere-secondary-button, div.anysphere-primary-button, .anysphere-text-button');
                    for (const container of buttonContainers) {
                        if (container.textContent.trim().toLowerCase().includes(scenario.buttonText.trim().toLowerCase())) {
                            button = container;
                            break;
                        }
                    }

                    if (!button) {
                        const standardButtons = popup.querySelectorAll('button');
                        for (const btn of standardButtons) {
                            if (btn.textContent.trim().toLowerCase().includes(scenario.buttonText.trim().toLowerCase())) {
                                button = btn;
                                break;
                            }
                        }
                    }

                    if (!button) {
                        const clickableElements = popup.querySelectorAll('[role="button"], .cursor-pointer, [onclick]');
                        for (const elem of clickableElements) {
                            if (elem.textContent.trim().toLowerCase().includes(scenario.buttonText.trim().toLowerCase())) {
                                button = elem;
                                break;
                            }
                        }
                    }

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
                        button.click();
                        successfulResumesCount++;
                        lastInteractionTime = now;
                        lastDetectedErrorText = null;
                        currentErrorRetryCount = 0;
                        return; // Exit after successful click
                    } else {
                        lastInteractionTime = now; // Apply backoff even if button not found
                        errorHandledInThisCycle = true;
                        return; // Exit since an error message was detected and processed (even if button not found)
                    }
                }
            }
        }

        if (!errorHandledInThisCycle) {
            lastDetectedErrorText = null;
            currentErrorRetryCount = 0;
        }
    }

    // Initialize the script
    startScript();
})(); 