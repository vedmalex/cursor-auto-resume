// Ultra-simple Cursor Auto Resume Script - Copy & paste into browser console

(function () {
    // Check for and stop any existing instance of the script
    if (window.cursorAutoResumeScript && typeof window.cursorAutoResumeScript.exit === 'function') {
        console.log('Cursor Auto Resume: Detected existing instance, stopping it.');
        window.cursorAutoResumeScript.exit();
    }

    // --- Custom Logging Setup ---
    let logOutput = null; // Will be set once the UI element is created
    let isLogCollapsed = false;
    const logHistory = [];
    const MAX_LOG_LINES = 100; // Limit the number of lines in the log
    const DEBUG_MODE = false; // Set to true to see debug messages

    // Custom logging function for the script only
    function scriptLog(message, level = 'INFO') {
        // Skip DEBUG messages if DEBUG_MODE is false
        if (level === 'DEBUG' && !DEBUG_MODE) {
            return;
        }

        if (!logOutput) {
            console.log('Script Log:', message); // Fallback to original console
            return;
        }
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const formattedMessage = `[${timestamp}] ${level}: ${message}`;

        logHistory.push(formattedMessage);
        if (logHistory.length > MAX_LOG_LINES) {
            logHistory.shift(); // Remove oldest entry
        }

        // Update DOM safely (only if not collapsed)
        if (!isLogCollapsed) {
            // Clear existing content safely by removing all children
            while (logOutput.firstChild) {
                logOutput.removeChild(logOutput.firstChild);
            }
            logHistory.forEach(line => {
                const lineDiv = document.createElement('div');
                lineDiv.textContent = line; // Use textContent for safety
                logOutput.appendChild(lineDiv);
            });
            logOutput.scrollTop = logOutput.scrollHeight; // Auto-scroll to bottom
        }
    }

    scriptLog('Cursor Auto Resume: Running');

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
    collapseButton.innerText = 'Collapse'; // Text for collapse
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
    statusSpan.id = 'status-message';
    contentContainer.appendChild(statusSpan);

    // Current settings display
    const currentModeSpan = document.createElement('span');
    currentModeSpan.id = 'current-mode';
    Object.assign(currentModeSpan.style, {
        fontSize: '10px',
        color: '#aaa',
        fontStyle: 'italic'
    });
    contentContainer.appendChild(currentModeSpan);

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
    durationLabel.innerText = 'Auto-stop in:';
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

    const durationOptions = [
        { value: 1, label: '1 min' },
        { value: 5, label: '5 min' },
        { value: 10, label: '10 min' },
        { value: 15, label: '15 min' },
        { value: 20, label: '20 min' },
        { value: 30, label: '30 min' },
        { value: 45, label: '45 min' },
        { value: 60, label: '1 hour' },
        { value: 120, label: '2 hours' },
        { value: 180, label: '3 hours' },
        { value: 240, label: '4 hours' },
        { value: 300, label: '5 hours' },
        { value: 360, label: '6 hours' },
        { value: 420, label: '7 hours' },
        { value: 480, label: '8 hours' }
    ];

    durationOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.innerText = option.label;
        if (option.value === 30) { // Default selection
            optionElement.selected = true;
        }
        durationSelect.appendChild(optionElement);
    });

    // Model Selection Container
    const modelControlContainer = document.createElement('div');
    Object.assign(modelControlContainer.style, {
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
        marginTop: '5px',
        color: 'lightgray'
    });
    contentContainer.appendChild(modelControlContainer);

    const modelLabel = document.createElement('span');
    modelLabel.innerText = 'Auto-resume for models:';
    Object.assign(modelLabel.style, {
        fontSize: '10px',
        fontWeight: 'bold'
    });
    modelControlContainer.appendChild(modelLabel);

    const modelSelectContainer = document.createElement('div');
    Object.assign(modelSelectContainer.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    });
    modelControlContainer.appendChild(modelSelectContainer);

    const modelSelect = document.createElement('select');
    modelSelect.id = 'model-resume-select';
    modelSelect.multiple = true;
    modelSelect.size = 3;
    Object.assign(modelSelect.style, {
        backgroundColor: '#333',
        color: 'white',
        border: '1px solid #666',
        borderRadius: '4px',
        fontSize: '10px',
        padding: '2px 4px',
        minWidth: '150px',
        maxHeight: '60px'
    });
    modelSelectContainer.appendChild(modelSelect);

    // Add header option
    const headerOption = document.createElement('option');
    headerOption.textContent = '-- Select models --';
    headerOption.disabled = true;
    headerOption.style.fontStyle = 'italic';
    modelSelect.appendChild(headerOption);

    // Model selection change handler
    modelSelect.onchange = () => {
        selectedModelsForResume.clear();
        for (const option of modelSelect.selectedOptions) {
            if (!option.disabled) {
                selectedModelsForResume.add(option.value);
            }
        }

        const selectedCount = selectedModelsForResume.size;
        const totalCount = availableModels.length;

        if (selectedCount === 0) {
            scriptLog('Auto-resume enabled for ALL models (none selected)');
        } else {
            scriptLog(`Auto-resume enabled for ${selectedCount}/${totalCount} models: ${Array.from(selectedModelsForResume).join(', ')}`);
        }

        updateIndicator('Model selection updated');
    };

    const modelButtonContainer = document.createElement('div');
    Object.assign(modelButtonContainer.style, {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    });
    modelSelectContainer.appendChild(modelButtonContainer);

    const selectAllModelsButton = document.createElement('button');
    selectAllModelsButton.innerText = 'All';
    Object.assign(selectAllModelsButton.style, {
        backgroundColor: '#444',
        color: 'white',
        border: '1px solid #666',
        padding: '2px 5px',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '9px'
    });
    selectAllModelsButton.onclick = () => {
        for (const option of modelSelect.options) {
            if (!option.disabled) {
                option.selected = true;
            }
        }
        modelSelect.onchange();
    };
    modelButtonContainer.appendChild(selectAllModelsButton);

    const clearModelsButton = document.createElement('button');
    clearModelsButton.innerText = 'None';
    Object.assign(clearModelsButton.style, {
        backgroundColor: '#444',
        color: 'white',
        border: '1px solid #666',
        padding: '2px 5px',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '9px'
    });
    clearModelsButton.onclick = () => {
        for (const option of modelSelect.options) {
            option.selected = false;
        }
        modelSelect.onchange();
    };
    modelButtonContainer.appendChild(clearModelsButton);

    // Log Display Container
    const logContainer = document.createElement('div');
    Object.assign(logContainer.style, {
        marginTop: '10px',
        borderTop: '1px solid #333',
        paddingTop: '5px',
        width: '100%' // Ensure it takes full width
    });
    contentContainer.appendChild(logContainer);

    const logHeader = document.createElement('div');
    Object.assign(logHeader.style, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '5px'
    });
    logContainer.appendChild(logHeader);

    const logTitle = document.createElement('span');
    logTitle.innerText = 'Script Log';
    Object.assign(logTitle.style, {
        fontWeight: 'bold',
        color: '#aaa'
    });
    logHeader.appendChild(logTitle);

    const logCollapseButton = document.createElement('button');
    logCollapseButton.innerText = 'Collapse Log';
    Object.assign(logCollapseButton.style, {
        backgroundColor: 'transparent',
        color: 'white',
        border: 'none',
        fontSize: '10px',
        cursor: 'pointer',
        padding: '2px 5px',
        minWidth: '40px'
    });
    logHeader.appendChild(logCollapseButton);

    logOutput = document.createElement('div'); // Assign to the global logOutput variable
    Object.assign(logOutput.style, {
        backgroundColor: '#222',
        border: '1px solid #444',
        padding: '5px',
        maxHeight: '150px', // Limit height
        overflowY: 'auto', // Scrollable
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#eee',
        whiteSpace: 'pre-wrap', // Preserve whitespace and wrap text
        wordBreak: 'break-word' // Break long words
    });
    logContainer.appendChild(logOutput);

    const toggleLogCollapse = () => {
        isLogCollapsed = !isLogCollapsed;
        if (isLogCollapsed) {
            logOutput.style.display = 'none';
            logCollapseButton.innerText = 'Expand Log';
        } else {
            logOutput.style.display = 'block';
            logCollapseButton.innerText = 'Collapse Log';
        }
    };
    logCollapseButton.onclick = toggleLogCollapse;

    // Timer variables
    let startTime = Date.now();
    let maxDuration = 30 * 60 * 1000; // Default 30 minutes in milliseconds

    // Set initial selection
    durationSelect.value = (maxDuration / 60 / 1000).toString();

    let intervalId;
    let isRunning = false; // Add state tracking
    let isGenerating = false; // Track if generation is active
    let generationMonitorId = null; // ID for generation monitoring interval
    let pausedTime = 0; // Track paused time to subtract from total
    let lastClickTime = 0; // Initialize lastClickTime

    // Renamed for clarity: tracks last time any interaction (click or error detection) happened
    let lastInteractionTime = 0;
    let lastDetectedErrorText = null;
    let currentErrorRetryCount = 0;
    const retryDelays = [5000, 10000, 20000, 45000, 60000]; // in milliseconds

    // Define error scenarios globally
    const errorScenarios = [
        {
            errorText: "rate limit",
            buttonText: "Try again",
            logMessage: 'Clicking "Try again" button for rate limit error.'
        },
        {
            errorText: "Rate limit",
            buttonText: "Try again",
            logMessage: 'Clicking "Try again" button for rate limit error.'
        },
        {
            errorText: "Something went wrong",
            buttonText: "Try again",
            logMessage: 'Clicking "Try again" button for something went wrong error.'
        },
        {
            errorText: "An error occurred",
            buttonText: "Resume",
            logMessage: 'Clicking "Resume" button for general error.'
        },
        {
            errorText: "We hit the usage limit",
            buttonText: "Resume",
            logMessage: 'Clicking "Resume" button for usage limit error.'
        },
        {
            errorText: "We're having trouble connecting to the model provider",
            buttonText: "Try again",
            logMessage: 'Clicking "Try again" button for model provider connection error.'
        },
        {
            errorText: "We're having trouble connecting to the model provider",
            buttonText: "Resume",
            logMessage: 'Clicking "Resume" button for model provider connection error.'
        }
    ];

    durationSelect.onchange = (event) => {
        const selectedMinutes = parseInt(event.target.value);
        maxDuration = selectedMinutes * 60 * 1000;
        scriptLog(`Cursor Auto Resume: Auto-stop duration set to ${selectedMinutes} minutes.`);
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

    // Function to detect if generation is active
    function detectGenerationStatus() {
        const elements = document.querySelectorAll('div, span');
        let foundGenerating = false;

        for (let element of elements) {
            const text = element.textContent || element.innerText || '';
            // Check for 'Generating' text without requiring '...'
            if (text.includes('Generating')) {
                // Ensure it's not part of a larger, unrelated text
                // Prioritize finding 'Stop' button or relevant classes in parent
                const parent = element.closest('div');
                if (parent && (parent.textContent.includes('Stop') ||
                               parent.querySelector('[class*="stop"]') ||
                               parent.querySelector('[role*="button"][data-text="Stop"]') || // Specific stop button check
                               parent.classList.contains('anysphere-loading-indicator') || // Check for common loading indicators
                               parent.classList.contains('full-input-box-generating')) // Specific class for generating state
                ) {
                    foundGenerating = true;
                    break;
                }
            }
        }

        return foundGenerating;
    }

    function updateGenerationStatus() {
        const currentlyGenerating = detectGenerationStatus();

        if (currentlyGenerating !== isGenerating) {
            isGenerating = currentlyGenerating;

            if (isGenerating) {
                scriptLog('Cursor Auto Resume: Generation started - timer active');
                // When generation starts, resume timer from where it was paused
                startTime = Date.now() - pausedTime;
                pausedTime = 0;
                updateIndicator('Generation active');
            } else {
                scriptLog('Cursor Auto Resume: Generation stopped - timer paused');
                // When generation stops, calculate and store elapsed time as pausedTime
                pausedTime = Date.now() - startTime; // This correctly stores elapsed time for pause
                updateIndicator('Generation paused');
            }
        }
    }

    function startGenerationMonitoring() {
        if (generationMonitorId) {
            clearInterval(generationMonitorId);
        }

        scriptLog('Cursor Auto Resume: Starting generation monitoring');
        generationMonitorId = setInterval(updateGenerationStatus, 1000); // Check every 1000ms (1 second)
        updateGenerationStatus(); // Initial check
    }

    function stopGenerationMonitoring() {
        if (generationMonitorId) {
            clearInterval(generationMonitorId);
            generationMonitorId = null;
        }
        scriptLog('Cursor Auto Resume: Stopped generation monitoring');
        isGenerating = false;
        pausedTime = 0;
    }

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

    // Define mouseup handler outside to remove it cleanly
    const handleMouseUp = () => {
        isDragging = false;
        if (indicator) { // Add check if indicator still exists
            indicator.style.cursor = 'grab';
        }
    };

    header.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Collapsible functionality
    let isCollapsed = false;
    collapseButton.onclick = () => {
        isCollapsed = !isCollapsed;
        if (isCollapsed) {
            contentContainer.style.display = 'none';
            indicator.style.width = 'fit-content';
            indicator.style.padding = '5px 10px';
            header.style.borderBottom = 'none';
            collapseButton.innerText = 'Expand'; // Text for expand
        } else {
            contentContainer.style.display = 'flex';
            indicator.style.width = 'auto';
            indicator.style.padding = '8px 12px';
            header.style.borderBottom = '1px solid #333';
            collapseButton.innerText = 'Collapse'; // Text for collapse
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

    // Function to get current model and agent settings
    function getCurrentSettings() {
        let currentModel = 'Unknown';
        let currentAgent = 'Unknown';

        // Extract current model from model dropdown (improved selectors)
        const modelElements = document.querySelectorAll(
            '.composer-unified-dropdown-model .truncate-x, ' +
            '.composer-unified-dropdown-model span, ' +
            '.composer-unified-dropdown-model .monaco-highlighted-label'
        );

        for (const element of modelElements) {
            const text = element.textContent.trim();
            if (text && !text.includes('⌘') && text !== 'Agent' && text !== 'Manual' && text.length > 2) {
                currentModel = text;
                break;
            }
        }

        // Extract current agent/mode from agent dropdown (improved selectors)
        const agentElements = document.querySelectorAll(
            '.composer-unified-dropdown .truncate-x, ' +
            '.composer-unified-dropdown span'
        );

        for (const element of agentElements) {
            const text = element.textContent.trim();
            if (text && !text.includes('⌘') && text !== currentModel &&
                (text === 'Agent' || text === 'Chat' || text === 'Composer' || text === 'Manual')) {
                currentAgent = text;
                break;
            }
        }

        // Fallback: try alternative selectors if nothing found
        if (currentModel === 'Unknown') {
            const fallbackModelElements = document.querySelectorAll(
                '[class*="model"] .truncate-x, ' +
                '[class*="dropdown"] .truncate-x, ' +
                '[class*="model"] .monaco-highlighted-label, ' +
                '[class*="unified"] .truncate-x'
            );

            for (const element of fallbackModelElements) {
                const text = element.textContent.trim();
                if (text && (text.includes('gemini') || text.includes('gpt') || text.includes('claude') ||
                           text.includes('flash') || text.includes('sonnet') || text.includes('cursor') ||
                           text.includes('deepseek') || text.includes('grok'))) {
                    currentModel = text;
                    break;
                }
            }
        }

        // Special case: look for specific icons to determine agent mode
        if (currentAgent === 'Unknown') {
            const targetIcon = document.querySelector('.codicon-target-two');
            const infinityIcon = document.querySelector('.codicon-infinity');

            if (targetIcon) {
                currentAgent = 'Manual';
            } else if (infinityIcon) {
                currentAgent = 'Agent';
            }
        }

        return { model: currentModel, agent: currentAgent };
    }

    function updateIndicator(statusText = '') {
        if (!indicator) return;

        const timerDisplay = indicator.querySelector('#timer-display');
        const statusSpan = indicator.querySelector('#status-message');
        const currentModeSpan = indicator.querySelector('#current-mode');
        const collapseButton = indicator.querySelector('#collapse-button');

        if (collapseButton) {
            collapseButton.textContent = isCollapsed ? 'Expand' : 'Collapse';
        }

        if (statusSpan) {
            const generationStatus = isGenerating ? ' (Gen: Active)' : ' (Gen: Paused)';
            statusSpan.innerText = `Status: ${statusText}${generationStatus}`;
        }

        // Update current settings display
        if (currentModeSpan) {
            const settings = getCurrentSettings();
            currentModeSpan.innerText = `Model: ${settings.model} | Mode: ${settings.agent}`;
        }
    }

    function updateTimer() {
        if (!timerDisplay) return;

        const now = Date.now();
        let elapsed;

        if (isGenerating) {
            // Timer is active - calculate elapsed time normally
            elapsed = now - startTime;
        } else {
            // Timer is paused - use stored paused time
            elapsed = pausedTime;
        }

        const remaining = maxDuration - elapsed;

        if (remaining <= 0) {
            timerDisplay.innerText = 'Time: Expired';
            return;
        }

        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        const pausedIndicator = isGenerating ? '' : ' (Paused)';
        timerDisplay.innerText = `Time left: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}${pausedIndicator}`;
    }

    function startScript() {
        if (isRunning) {
            scriptLog('Cursor Auto Resume: Script is already running');
            return;
        }

        scriptLog('Cursor Auto Resume: Starting script');
        isRunning = true;
        intervalId = setInterval(() => {
            clickResumeLink();
            updateTimer();
            updateIndicator('Running'); // This will also update current settings
        }, 1000);

        // Start generation monitoring
        startGenerationMonitoring();

        // Start model selector monitoring
        startModelSelectorMonitoring();

        updateIndicator('Running');

        // Also run once immediately
        clickResumeLink();
        updateTimer();
    }

    function stopScript() {
        if (!isRunning) {
            scriptLog('Cursor Auto Resume: Script is already stopped');
            return;
        }

        scriptLog('Cursor Auto Resume: Stopping script');
        isRunning = false;
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }

        // Stop generation monitoring
        stopGenerationMonitoring();

        // Stop model selector monitoring
        stopModelSelectorMonitoring();

        updateIndicator('Stopped');
    }

    function exitScript() {
        scriptLog('Cursor Auto Resume: Exiting completely.');
        stopScript();
        // Remove event listeners to prevent errors after indicator is gone
        if (header && handleMouseDown) {
            header.removeEventListener('mousedown', handleMouseDown);
        }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        // Stop model selector monitoring
        stopModelSelectorMonitoring();

        if (indicator) {
            indicator.remove();
            indicator = null; // Clear the reference
        }

        if (window.cursorAutoResumeScript) {
            window.cursorAutoResumeScript = undefined;
        }
        updateIndicator('Exited'); // This will now do nothing if indicator is null
        console.log('Cursor Auto Resume: Indicator removed and global reference cleared.'); // Final message to browser console
    }

    // Global functions for manual control
    window.click_reset = function () {
        scriptLog('Cursor Auto Resume: Timer reset');
        startTime = Date.now();
        pausedTime = 0; // Reset paused time
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

    // Expose control functions globally for clean restart
    window.cursorAutoResumeScript = {
        exit: exitScript,
        stop: stopScript,
        start: startScript,
        reset: window.click_reset // Reuse existing global reset
    };

    // Update button event listeners
    const stopButton = createButton('Stop', stopScript);
    const resumeButton = createButton('Resume', click_reset);
    const exitButton = createButton('Exit', exitScript);
    const resetTimerButton = createButton('Reset Timer', click_reset);
    const refreshSettingsButton = createButton('Refresh Settings', () => {
        updateIndicator('Refreshing settings...');
        scriptLog('Manually refreshing current settings and model list');

        // Try to extract models from current DOM
        const currentModels = extractAvailableModels();
        if (currentModels.length > 0) {
            availableModels = currentModels;
            updateModelCombobox();
            scriptLog(`Updated model list: ${currentModels.join(', ')}`);
        } else {
            scriptLog('No models found in current DOM. Try opening model selector to populate list.');
        }
    });

    // Function to try extracting models from current DOM (without waiting for selector)
    function tryExtractCurrentModels() {
        // Look for any model names in the current DOM
        const allElements = document.querySelectorAll('*');
        const potentialModels = [];

        for (const element of allElements) {
            const text = element.textContent?.trim();
            if (text && text.length > 3 && text.length < 30) {
                if (text.includes('gemini') || text.includes('gpt') || text.includes('claude') ||
                    text.includes('sonnet') || text.includes('cursor') || text.includes('deepseek') ||
                    text.includes('grok') || text.includes('flash')) {

                    // Clean up the model name
                    const cleanName = text.replace(/[^\w\-\.]/g, '').toLowerCase();
                    if (cleanName.length > 3 && !potentialModels.includes(cleanName)) {
                        potentialModels.push(cleanName);
                    }
                }
            }
        }

        if (potentialModels.length > 0) {
            scriptLog(`Found potential models in DOM: ${potentialModels.join(', ')}`);
            return potentialModels;
        }

        return [];
    }

    // Main function that looks for and clicks the resume link
    function clickResumeLink() {
        if (!isRunning) {
            return; // Don't execute if script is stopped
        }

        // Check if current model is selected for auto-resume
        if (!isCurrentModelSelectedForResume()) {
            const settings = getCurrentSettings();
            scriptLog(`Skipping auto-resume for model: ${settings.model} (not in selected list)`);
            updateIndicator(`Skipped: ${settings.model}`);
            return;
        }

        scriptLog('Cursor Auto Resume: clickResumeLink executed.');
        updateIndicator('Checking...');

        let now = Date.now(); // Declare now at the very beginning of the function

        // Check if max duration has passed (only when generation is active)
        if (isGenerating) {
            const elapsed = now - startTime;
            if (elapsed > maxDuration) {
                scriptLog('Cursor Auto Resume: Maximum duration elapsed, stopping auto-click');
                stopScript(); // Use stopScript instead of just clearing interval
            return;
            }
        }

        // Prevent clicking too frequently (3 second cooldown)
        if (now - lastClickTime < 3000) {
            scriptLog('Cursor Auto Resume: Cooldown active, skipping click.');
            updateIndicator(`Cooldown: ${3000 / 1000}s`);
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
            scriptLog(`Cursor Auto Resume: Cooldown active (${appliedDelay / 1000}s), skipping click.`);
            updateIndicator(`Cooldown: ${appliedDelay / 1000}s`);
            return;
        }

        // Proceed to check for elements if not in cooldown
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
                scriptLog('Cursor Auto Resume: Tool limit text node or parent missing.');
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
                        scriptLog('Cursor Auto Resume: Clicking "resume the conversation" link.');
                        updateIndicator('Clicking "resume the conversation"');
                        link.click();
                        lastInteractionTime = now;
                        linkFound = true;
                        // Reset error state if a non-error link was clicked
                        lastDetectedErrorText = null;
                        currentErrorRetryCount = 0;
                        // Successfully found and clicked a link, reset cooldown and error state
                        lastClickTime = now;
                        scriptLog(scenario.logMessage);
                        updateIndicator(scenario.logMessage);
                        return; // Stop after successful click
                    }
                }
                if (!linkFound) {
                    scriptLog('Cursor Auto Resume: "resume the conversation" link not found in tool limit context.');
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
                    scriptLog(`Cursor Auto Resume: Detected error: "${scenario.errorText}" in popup.`);
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
                        scriptLog(`Cursor Auto Resume: Cooldown active for persistent error (${appliedDelay / 1000}s), skipping click.`);
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
                    scriptLog(scenario.logMessage);
                        updateIndicator(`Clicking: "${scenario.buttonText}"`);
                    button.click();
                        lastInteractionTime = now;
                        errorHandledInThisCycle = true;
                        // Reset error state if a button for this error was successfully clicked
                        lastDetectedErrorText = null;
                        currentErrorRetryCount = 0;
                    return; // Exit after successful click
                    } else {
                        scriptLog(`Cursor Auto Resume: Button "${scenario.buttonText}" not found for error: "${scenario.errorText}" in popup.`);
                        scriptLog('Cursor Auto Resume: Available buttons in popup:', Array.from(popup.querySelectorAll('button, [role="button"], .anysphere-secondary-button, .anysphere-primary-button')).map(b => b.textContent.trim()));
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

    // --- Model Selection System ---
    let availableModels = [];
    let selectedModelsForResume = new Set(); // Models for which auto-resume is enabled
    let modelSelectorObserver = null;

    // Function to extract available models from the model selector
    function extractAvailableModels() {
        const modelItems = document.querySelectorAll('.composer-unified-context-menu-item .monaco-highlighted-label');
        const models = [];

        for (const item of modelItems) {
            const modelName = item.textContent.trim();
            if (modelName &&
                modelName !== 'Auto' &&
                modelName !== 'MAX Mode' &&
                modelName !== 'Add models' &&
                !modelName.includes('⌘')) {
                models.push(modelName);
            }
        }

        scriptLog(`Extracted ${models.length} models: ${models.join(', ')}`);
        return models;
    }

    // Function to monitor model selector appearance/disappearance
    function startModelSelectorMonitoring() {
        if (modelSelectorObserver) {
            modelSelectorObserver.disconnect();
        }

        modelSelectorObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if model selector appeared
                        if (node.classList?.contains('typeahead-popover') ||
                            node.querySelector?.('.typeahead-popover')) {
                            setTimeout(() => {
                                const newModels = extractAvailableModels();
                                if (newModels.length > 0) {
                                    availableModels = newModels;
                                    updateModelCombobox();
                                    scriptLog(`Model selector detected, updated model list`);
                                }
                            }, 100); // Small delay to ensure DOM is ready
                        }
                    }
                });
            });
        });

        modelSelectorObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        scriptLog('Model selector monitoring started');
    }

    // Function to stop model selector monitoring
    function stopModelSelectorMonitoring() {
        if (modelSelectorObserver) {
            modelSelectorObserver.disconnect();
            modelSelectorObserver = null;
            scriptLog('Model selector monitoring stopped');
        }
    }

    // Function to update model combobox
    function updateModelCombobox() {
        const modelSelect = document.getElementById('model-resume-select');
        if (!modelSelect) return;

        // Clear existing options except the header
        while (modelSelect.children.length > 1) {
            modelSelect.removeChild(modelSelect.lastChild);
        }

        // Add available models as options
        availableModels.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            option.selected = selectedModelsForResume.has(model);
            modelSelect.appendChild(option);
        });
    }

    // Function to check if current model is selected for auto-resume
    function isCurrentModelSelectedForResume() {
        const settings = getCurrentSettings();
        const currentModel = settings.model;

        // If no models selected, work with all models (backward compatibility)
        if (selectedModelsForResume.size === 0) {
            return true;
        }

        return selectedModelsForResume.has(currentModel);
    }

    // Start the script initially
    startScript();

    // Initialize model list
    setTimeout(() => {
        const initialModels = tryExtractCurrentModels();
        if (initialModels.length > 0) {
            availableModels = initialModels;
            updateModelCombobox();
            scriptLog(`Initial model list populated: ${initialModels.join(', ')}`);
        } else {
            scriptLog('No initial models found. Model list will be populated when model selector appears.');
        }
    }, 1000); // Small delay to ensure DOM is ready

    // Log timer info
    scriptLog('Cursor Auto Resume: Will stop after 30 minutes. Call click_reset() to reset timer.');

})();