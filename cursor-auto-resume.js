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
        cursor: 'grab', // Make it draggable by default
        transition: 'all 0.3s ease' // Smooth transition for collapse/expand
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
    titleSpan.innerText = 'CAR:';
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
        gap: '5px',
        transition: 'opacity 0.3s ease' // Smooth transition for content
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
        updateCollapsedInfo(); // Update collapsed info on model change
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

    // Agent Mode Selection Container
    const agentModeControlContainer = document.createElement('div');
    Object.assign(agentModeControlContainer.style, {
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
        marginTop: '10px', // More margin to separate from models
        color: 'lightgray'
    });
    contentContainer.appendChild(agentModeControlContainer);

    const agentModeLabel = document.createElement('span');
    agentModeLabel.innerText = 'Auto-resume for modes:';
    Object.assign(agentModeLabel.style, {
        fontSize: '10px',
        fontWeight: 'bold'
    });
    agentModeControlContainer.appendChild(agentModeLabel);

    const agentModeSelectContainer = document.createElement('div');
    Object.assign(agentModeSelectContainer.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    });
    agentModeControlContainer.appendChild(agentModeSelectContainer);

    const agentModeSelect = document.createElement('select');
    agentModeSelect.id = 'agent-mode-resume-select';
    agentModeSelect.multiple = true;
    agentModeSelect.size = 3;
    Object.assign(agentModeSelect.style, {
        backgroundColor: '#333',
        color: 'white',
        border: '1px solid #666',
        borderRadius: '4px',
        fontSize: '10px',
        padding: '2px 4px',
        minWidth: '150px',
        maxHeight: '60px'
    });
    agentModeSelectContainer.appendChild(agentModeSelect);

    // Add header option for agent modes
    const agentModeHeaderOption = document.createElement('option');
    agentModeHeaderOption.textContent = '-- Select modes --';
    agentModeHeaderOption.disabled = true;
    agentModeHeaderOption.style.fontStyle = 'italic';
    agentModeSelect.appendChild(agentModeHeaderOption);

    // Agent mode selection change handler
    agentModeSelect.onchange = () => {
        selectedAgentModesForResume.clear();
        for (const option of agentModeSelect.selectedOptions) {
            if (!option.disabled) {
                selectedAgentModesForResume.add(option.value);
            }
        }

        const selectedCount = selectedAgentModesForResume.size;
        const totalCount = availableAgentModes.length;

        if (selectedCount === 0) {
            scriptLog('Auto-resume enabled for ALL agent modes (none selected)');
        } else {
            scriptLog(`Auto-resume enabled for ${selectedCount}/${totalCount} agent modes: ${Array.from(selectedAgentModesForResume).join(', ')}`);
        }

        updateIndicator('Agent mode selection updated');
        updateCollapsedInfo(); // Update collapsed info on agent mode change
    };

    const agentModeButtonContainer = document.createElement('div');
    Object.assign(agentModeButtonContainer.style, {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    });
    agentModeSelectContainer.appendChild(agentModeButtonContainer);

    const selectAllAgentModesButton = document.createElement('button');
    selectAllAgentModesButton.innerText = 'All';
    Object.assign(selectAllAgentModesButton.style, {
        backgroundColor: '#444',
        color: 'white',
        border: '1px solid #666',
        padding: '2px 5px',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '9px'
    });
    selectAllAgentModesButton.onclick = () => {
        for (const option of agentModeSelect.options) {
            if (!option.disabled) {
                option.selected = true;
            }
        }
        agentModeSelect.onchange();
    };
    agentModeButtonContainer.appendChild(selectAllAgentModesButton);

    const clearAgentModesButton = document.createElement('button');
    clearAgentModesButton.innerText = 'None';
    Object.assign(clearAgentModesButton.style, {
        backgroundColor: '#444',
        color: 'white',
        border: '1px solid #666',
        padding: '2px 5px',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '9px'
    });
    clearAgentModesButton.onclick = () => {
        for (const option of agentModeSelect.options) {
            option.selected = false;
        }
        agentModeSelect.onchange();
    };
    agentModeButtonContainer.appendChild(clearAgentModesButton);

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

    // Collapsed info display
    const collapsedInfo = document.createElement('div');
    collapsedInfo.id = 'collapsed-info';
    Object.assign(collapsedInfo.style, {
        display: 'none',
        flexDirection: 'column',
        gap: '3px',
        fontSize: '10px',
        color: '#ccc',
        marginTop: '5px',
        padding: '5px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '4px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        minWidth: '180px'
    });

    // Click on collapsed info to expand
    collapsedInfo.onclick = (e) => {
        e.stopPropagation(); // Prevent triggering drag
        if (isCollapsed) {
            collapseButton.click(); // Trigger expand
        }
    };

    // Hover effects for collapsed info
    collapsedInfo.onmouseenter = () => {
        if (isCollapsed) {
            collapsedInfo.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            collapsedInfo.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }
    };

    collapsedInfo.onmouseleave = () => {
        if (isCollapsed) {
            collapsedInfo.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            collapsedInfo.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
    };

    indicator.appendChild(collapsedInfo);

    // Initialize collapsed info with current data
    setTimeout(() => {
        updateCollapsedInfo();
    }, 100);

    // Function to update collapsed info
    function updateCollapsedInfo() {
        // Clear previous content
        while (collapsedInfo.firstChild) {
            collapsedInfo.removeChild(collapsedInfo.firstChild);
        }

        const settings = getCurrentSettings();
        const now = Date.now();

        // Calculate remaining time
        let elapsed;
        if (isGenerating) {
            elapsed = now - startTime;
        } else {
            elapsed = pausedTime;
        }
        const remaining = maxDuration - elapsed;

        let timeText = 'Time: Expired';
        if (remaining > 0) {
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            const pausedIndicator = isGenerating ? '' : ' (Paused)';
            timeText = `⏱️ ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}${pausedIndicator}`;
        }

        // Format model name (truncate if too long)
        const modelName = settings.model.length > 15 ? settings.model.substring(0, 15) + '...' : settings.model;
        const thinkingIcon = settings.isThinking ? ' 🧠' : '';

        // Line 1: Agent and Status Dot
        const agentStatusDiv = document.createElement('div');
        Object.assign(agentStatusDiv.style, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
        });
        const agentSpan = document.createElement('span');
        agentSpan.style.fontWeight = 'bold';
        agentSpan.textContent = `🤖 ${settings.agent}`;
        agentStatusDiv.appendChild(agentSpan);

        const statusDotSpan = document.createElement('span');
        Object.assign(statusDotSpan.style, {
            color: isRunning ? '#90EE90' : '#FFB6C1',
            fontSize: '12px'
        });
        statusDotSpan.textContent = '●';
        agentStatusDiv.appendChild(statusDotSpan);
        collapsedInfo.appendChild(agentStatusDiv);

        // Line 2: Model Name
        const modelDiv = document.createElement('div');
        Object.assign(modelDiv.style, {
            color: '#87CEEB',
            fontSize: '10px'
        });
        modelDiv.textContent = `📱 ${modelName}${thinkingIcon}`;
        collapsedInfo.appendChild(modelDiv);

        // Line 3: Timer
        const timerDiv = document.createElement('div');
        Object.assign(timerDiv.style, {
            color: '#FFD700',
            fontSize: '10px'
        });
        timerDiv.textContent = timeText;
        collapsedInfo.appendChild(timerDiv);

        // Line 4: Generation Status
        const genStatusDiv = document.createElement('div');
        Object.assign(genStatusDiv.style, {
            color: '#DDA0DD',
            fontSize: '9px',
            fontStyle: 'italic'
        });
        genStatusDiv.textContent = isGenerating ? '🔄 Generating...' : '⏸️ Waiting...';
        collapsedInfo.appendChild(genStatusDiv);
    }

    // Collapsible functionality
    let isCollapsed = false;
    collapseButton.onclick = () => {
        isCollapsed = !isCollapsed;
        if (isCollapsed) {
            contentContainer.style.display = 'none';
            collapsedInfo.style.display = 'flex';
            indicator.style.width = 'auto';
            indicator.style.minWidth = '200px';
            indicator.style.padding = '8px 12px';
            header.style.borderBottom = '1px solid #333';
            collapseButton.innerText = 'Expand';
            updateCollapsedInfo(); // Update info when collapsing
        } else {
            contentContainer.style.display = 'flex';
            collapsedInfo.style.display = 'none';
            indicator.style.width = 'auto';
            indicator.style.padding = '8px 12px';
            header.style.borderBottom = '1px solid #333';
            collapseButton.innerText = 'Collapse';
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

    // --- Universal Mode Detection System ---
    let availableAgentModes = [];
    let agentSelectorObserver = null;

    // Function to extract available agent modes from the agent selector
    function extractAvailableAgentModes() {
        const modeItems = document.querySelectorAll('.composer-unified-context-menu-item .monaco-highlighted-label');
        const modes = [];

        // Define known models to filter them out from agent modes
        const knownModels = new Set([
            'gemini-2.5-flash', 'claude-4-sonnet', 'gpt-4.1', 'deepseek-v3.1', 'grok-3-mini-beta',
            'Auto', 'MAX Mode', 'Add models'
        ]);

        for (const item of modeItems) {
            const modeName = item.textContent.trim();
            if (modeName && !modeName.includes('⌘') && modeName.length > 0 &&
                !knownModels.has(modeName)) { // Filter out models

                // Get the icon class from the same menu item
                const menuItem = item.closest('.composer-unified-context-menu-item');
                let iconClass = 'unknown';

                if (menuItem) {
                    const iconElement = menuItem.querySelector('[class*="codicon-"]');
                    if (iconElement) {
                        // Extract all codicon classes
                        const classes = Array.from(iconElement.classList);
                        const codiconClass = classes.find(cls => cls.startsWith('codicon-') && cls !== 'codicon');
                        if (codiconClass) {
                            iconClass = codiconClass;
                        }
                    }
                }

                const modeInfo = {
                    name: modeName,
                    icon: iconClass,
                    isSelected: menuItem && menuItem.hasAttribute('data-is-selected')
                };

                modes.push(modeInfo);
            }
        }

        if (modes.length > 0) {
            scriptLog(`Extracted ${modes.length} agent modes: ${modes.map(m => `${m.name} (${m.icon})`).join(', ')}`);
        }
        return modes;
    }

    // Function to monitor agent selector appearance/disappearance
    function startAgentSelectorMonitoring() {
        if (agentSelectorObserver) {
            agentSelectorObserver.disconnect();
        }

        agentSelectorObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if agent/mode selector appeared
                        if (node.querySelector?.('.composer-unified-context-menu-item') ||
                            node.classList?.contains('composer-unified-context-menu-item')) {
                            setTimeout(() => {
                                const newModes = extractAvailableAgentModes();
                                if (newModes.length > 0) {
                                    availableAgentModes = newModes;
                                    scriptLog(`Agent selector detected, updated mode list`);
                                }
                            }, 100); // Small delay to ensure DOM is ready
                        }
                    }
                });
            });
        });

        agentSelectorObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        scriptLog('Agent selector monitoring started');
    }

    // Function to stop agent selector monitoring
    function stopAgentSelectorMonitoring() {
        if (agentSelectorObserver) {
            agentSelectorObserver.disconnect();
            agentSelectorObserver = null;
            scriptLog('Agent selector monitoring stopped');
        }
    }

    // Function to get current model and agent settings
    function getCurrentSettings() {
        let currentModel = 'Unknown';
        let currentAgent = 'Unknown';
        let isThinkingModel = false;

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

                // Check if this is a thinking model by looking for brain icon
                const modelContainer = element.closest('.composer-unified-dropdown-model');
                if (modelContainer && modelContainer.querySelector('.codicon-brain')) {
                    isThinkingModel = true;
                }
                break;
            }
        }

        // Universal agent/mode detection from dropdown
        const agentElements = document.querySelectorAll(
            '.composer-unified-dropdown .truncate-x, ' +
            '.composer-unified-dropdown span'
        );

        for (const element of agentElements) {
            const text = element.textContent.trim();
            if (text && !text.includes('⌘') && text !== currentModel && text.length > 0) {
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

        // Universal agent mode detection by any codicon icon
        if (currentAgent === 'Unknown') {
            // Look for any codicon icon in the agent dropdown area
            const agentDropdown = document.querySelector('.composer-unified-dropdown');
            if (agentDropdown) {
                const iconElement = agentDropdown.querySelector('[class*="codicon-"]:not(.codicon-chevron-down)');
                if (iconElement) {
                    // Try to find the corresponding mode name from our extracted modes
                    const iconClasses = Array.from(iconElement.classList);
                    const codiconClass = iconClasses.find(cls => cls.startsWith('codicon-') && cls !== 'codicon');

                    if (codiconClass && availableAgentModes.length > 0) {
                        const matchingMode = availableAgentModes.find(mode => mode.icon === codiconClass);
                        if (matchingMode) {
                            currentAgent = matchingMode.name;
                        } else {
                            // If no match found, use a generic name based on icon
                            currentAgent = `Custom (${codiconClass.replace('codicon-', '')})`;
                        }
                    }
                }
            }
        }

        return {
            model: currentModel,
            agent: currentAgent,
            isThinking: isThinkingModel
        };
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
            const thinkingIndicator = settings.isThinking ? ' 🧠' : '';
            const modelDisplay = `${settings.model}${thinkingIndicator}`;
            currentModeSpan.innerText = `Model: ${modelDisplay} | Mode: ${settings.agent}`;
        }

        // Update collapsed info if in collapsed mode
        updateCollapsedInfo();
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
            updateCollapsedInfo(); // Update collapsed info when timer expires
            return;
        }

        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        const pausedIndicator = isGenerating ? '' : ' (Paused)';
        timerDisplay.innerText = `Time left: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}${pausedIndicator}`;

        // Update collapsed info with current timer
        updateCollapsedInfo();
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

        // Update toggle button text
        const toggleButton = document.getElementById('toggle-button');
        if (toggleButton) {
            toggleButton.innerText = 'Stop';
        }

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

        // Update toggle button text
        const toggleButton = document.getElementById('toggle-button');
        if (toggleButton) {
            toggleButton.innerText = 'Continue';
        }

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

    // Create control buttons using the new function
    const controlButtons = createControlButtons();
    buttonContainer.appendChild(controlButtons);

    // Function to check if auto-resume should proceed based on selected model and agent mode
    function shouldAutoResumeBasedOnSettings() {
        const settings = getCurrentSettings();
        const currentModel = settings.model;
        const currentAgent = settings.agent;

        // Check model selection
        let isModelSelected = false;
        if (selectedModelsForResume.size === 0) {
            // If no models selected, auto-resume works for ALL models
            isModelSelected = true;
        } else {
            isModelSelected = selectedModelsForResume.has(currentModel);
        }

        // Check agent mode selection
        let isAgentModeSelected = false;
        if (selectedAgentModesForResume.size === 0) {
            // If no agent modes selected, auto-resume works for ALL agent modes
            isAgentModeSelected = true;
        } else {
            isAgentModeSelected = selectedAgentModesForResume.has(currentAgent);
        }

        // Log detailed skipping info only if auto-resume is prevented
        if (!isModelSelected || !isAgentModeSelected) {
            const modelInfo = settings.isThinking ? ' 🧠' : '';
            let skipReason = '';
            if (!isModelSelected && !isAgentModeSelected) {
                skipReason = `Model: ${currentModel}${modelInfo} and Mode: ${currentAgent} (not in selected lists)`;
            } else if (!isModelSelected) {
                skipReason = `Model: ${currentModel}${modelInfo} (not in selected list)`;
            } else if (!isAgentModeSelected) {
                skipReason = `Mode: ${currentAgent} (not in selected list)`;
            }
            scriptLog(`Skipping auto-resume: ${skipReason}`);
            updateIndicator(`Skipped: ${currentModel}${modelInfo} | ${currentAgent}`);
        }

        return isModelSelected && isAgentModeSelected;
    }

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
                    const cleanName = text.replace(/[^\w\-\.]/g, '');
                    if (cleanName.length > 3 && !potentialModels.find(m =>
                        (typeof m === 'string' ? m : m.name) === cleanName)) {

                        // Try to detect if it's a thinking model
                        const container = element.closest('div');
                        const isThinking = container && container.querySelector('.codicon-brain');

                        potentialModels.push({
                            name: cleanName,
                            isThinking: !!isThinking
                        });
                    }
                }
            }
        }

        if (potentialModels.length > 0) {
            scriptLog(`Found potential models in DOM: ${potentialModels.map(m => m.name + (m.isThinking ? ' (thinking)' : '')).join(', ')}`);
            return potentialModels;
        }

        return [];
    }

    // Main function that looks for and clicks the resume link
    function clickResumeLink() {
        if (!isRunning) {
            return; // Don't execute if script is stopped
        }

        // Check if auto-resume should proceed based on selected model and agent mode
        if (!shouldAutoResumeBasedOnSettings()) {
            return;
        }

        const settings = getCurrentSettings();
        const thinkingInfo = settings.isThinking ? ' (thinking 🧠)' : '';
        scriptLog(`Cursor Auto Resume: clickResumeLink executed for ${settings.model}${thinkingInfo}.`);
        updateIndicator('Checking...');

        let now = Date.now(); // Declare now at the very beginning of the function

        // Special handling for thinking models (future enhancement)
        let cooldownMultiplier = 1;
        if (settings.isThinking) {
            // Thinking models might need longer processing time
            cooldownMultiplier = 1.2; // 20% longer cooldown
        }

        // Check if max duration has passed (only when generation is active)
        if (isGenerating) {
            const elapsed = now - startTime;
            if (elapsed > maxDuration) {
                scriptLog('Cursor Auto Resume: Maximum duration elapsed, stopping auto-click');
                stopScript(); // Use stopScript instead of just clearing interval
            return;
            }
        }

        // Prevent clicking too frequently (3 second cooldown with thinking model adjustment)
        const baseCooldown = 3000;
        const adjustedCooldown = baseCooldown * cooldownMultiplier;

        if (now - lastClickTime < adjustedCooldown) {
            scriptLog(`Cursor Auto Resume: Cooldown active, skipping click. (${adjustedCooldown / 1000}s${settings.isThinking ? ' - thinking model' : ''})`);
            updateIndicator(`Cooldown: ${adjustedCooldown / 1000}s`);
            return;
        }

        // Determine effective delay based on last detected error, or default cooldown
        let appliedDelay = adjustedCooldown; // Use adjusted cooldown for thinking models
        if (lastDetectedErrorText) {
            const delayIndex = Math.min(currentErrorRetryCount - 1, retryDelays.length - 1);
            appliedDelay = retryDelays[delayIndex] * cooldownMultiplier; // Apply multiplier to error delays too
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
                    const appliedDelay = retryDelays[delayIndex] * cooldownMultiplier;

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

    // --- Agent Mode Selection System ---
    let selectedAgentModesForResume = new Set(); // Agent modes for which auto-resume is enabled

    // Function to extract available models from the model selector
    function extractAvailableModels() {
        const modelItems = document.querySelectorAll('.composer-unified-context-menu-item .monaco-highlighted-label');
        const models = [];

        // Define known agent modes to filter them out from models
        const knownAgentModes = new Set(['Agent', 'Ask', 'Manual', 'UNIVERSAL', 'STEADILY', 'MODE', 'RULE', 'MIGRATION']);

        for (const item of modelItems) {
            const modelName = item.textContent.trim();
            if (modelName &&
                modelName !== 'Auto' &&
                modelName !== 'MAX Mode' &&
                modelName !== 'Add models' &&
                !modelName.includes('⌘') &&
                !knownAgentModes.has(modelName)) { // Filter out agent modes

                // Check if this is a thinking model
                const menuItem = item.closest('.composer-unified-context-menu-item');
                const isThinking = menuItem && menuItem.querySelector('.codicon-brain');

                const modelInfo = {
                    name: modelName,
                    isThinking: !!isThinking
                };

                models.push(modelInfo);
            }
        }

        scriptLog(`Extracted ${models.length} models: ${models.map(m => m.name + (m.isThinking ? ' (thinking)' : '')).join(', ')}`);
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
            const modelName = typeof model === 'string' ? model : model.name;
            const isThinking = typeof model === 'object' ? model.isThinking : false;

            option.value = modelName;
            option.textContent = modelName + (isThinking ? ' 🧠' : '');
            option.selected = selectedModelsForResume.has(modelName);

            if (isThinking) {
                option.style.fontWeight = 'bold';
                option.style.color = '#87CEEB'; // Light blue for thinking models
            }

            modelSelect.appendChild(option);
        });
    }

    // Function to update agent mode combobox
    function updateAgentModeCombobox() {
        const agentModeSelect = document.getElementById('agent-mode-resume-select');
        if (!agentModeSelect) return;

        // Clear existing options except the header
        while (agentModeSelect.children.length > 1) {
            agentModeSelect.removeChild(agentModeSelect.lastChild);
        }

        // Add available agent modes as options
        availableAgentModes.forEach(mode => {
            const option = document.createElement('option');
            option.value = mode.name;
            option.textContent = mode.name;
            option.selected = selectedAgentModesForResume.has(mode.name);
            agentModeSelect.appendChild(option);
        });
    }

    // Function to force refresh available modes
    function forceRefreshModes() {
        scriptLog('Force refreshing available modes...');

        // Clear current modes
        availableAgentModes = [];

        // Try to trigger agent selector to appear by simulating click
        const agentDropdown = document.querySelector('.composer-unified-dropdown');
        if (agentDropdown) {
            agentDropdown.click();

            setTimeout(() => {
                const newModes = extractAvailableAgentModes();
                if (newModes.length > 0) {
                    availableAgentModes = newModes;
                    updateAgentModeCombobox(); // Update agent mode combobox on refresh
                    scriptLog(`Refreshed modes: ${availableAgentModes.map(m => m.name).join(', ')}`);
                } else {
                    scriptLog('No modes found during refresh');
                }

                // Close the dropdown
                document.body.click();
            }, 200);
        } else {
            scriptLog('Agent dropdown not found for refresh');
        }
    }

    // Create control buttons
    function createControlButtons() {
        const controlsDiv = document.createElement('div');
        controlsDiv.style.cssText = 'margin-top: 5px; display: flex; gap: 3px; flex-wrap: wrap;';

        // Stop/Continue button
        const toggleButton = document.createElement('button');
        toggleButton.innerText = isRunning ? 'Stop' : 'Continue';
        toggleButton.id = 'toggle-button'; // Add ID for easy access
        toggleButton.style.cssText = 'padding: 2px 6px; font-size: 10px; background: #007acc; color: white; border: none; border-radius: 3px; cursor: pointer; flex: 1; min-width: 45px;';
        toggleButton.onclick = () => {
            if (isRunning) {
                stopScript();
            } else {
                startScript();
            }
            // Update button text and collapsed info immediately
            toggleButton.innerText = isRunning ? 'Stop' : 'Continue';
            updateCollapsedInfo();
        };
        controlsDiv.appendChild(toggleButton);

        // Exit button
        const exitButton = document.createElement('button');
        exitButton.innerText = 'Exit';
        exitButton.style.cssText = 'padding: 2px 6px; font-size: 10px; background: #d73a49; color: white; border: none; border-radius: 3px; cursor: pointer; flex: 1; min-width: 35px;';
        exitButton.onclick = () => {
            if (confirm('Are you sure you want to exit the auto-resume script?')) {
                exitScript();
            }
        };
        controlsDiv.appendChild(exitButton);

        // Refresh Modes button
        const refreshButton = document.createElement('button');
        refreshButton.innerText = 'Refresh Modes';
        refreshButton.style.cssText = 'padding: 2px 6px; font-size: 10px; background: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer; flex: 1; min-width: 60px;';
        refreshButton.onclick = forceRefreshModes;
        controlsDiv.appendChild(refreshButton);

        return controlsDiv;
    }

    // Initialize the script
    function init() {
        scriptLog('Starting cursor auto-resume script');

        // Start monitoring systems
        startModelSelectorMonitoring();
        startAgentSelectorMonitoring();

        // Try to extract initial modes if selector is already open
        setTimeout(() => {
            const initialModes = extractAvailableAgentModes();
            if (initialModes.length > 0) {
                availableAgentModes = initialModes;
                updateAgentModeCombobox(); // Populate agent mode combobox
            }
        }, 1000);

        // Initialize model list
        setTimeout(() => {
            const initialModels = tryExtractCurrentModels();
            if (initialModels.length > 0) {
                availableModels = initialModels;
                updateModelCombobox();
                scriptLog(`Initial model list populated: ${initialModels.map(m => m.name).join(', ')}`);
            } else {
                scriptLog('No initial models found. Model list will be populated when model selector appears.');
            }
        }, 1000);

        // Start the main script
        startScript();

        scriptLog('Cursor Auto Resume: Will stop after 30 minutes. Call click_reset() to reset timer.');
    }

    // Cleanup function
    function cleanup() {
        if (scriptInterval) {
            clearInterval(scriptInterval);
            scriptInterval = null;
        }

        stopModelSelectorMonitoring();
        stopAgentSelectorMonitoring();

        if (indicator) {
            indicator.remove();
            indicator = null;
        }

        isRunning = false;
        isGenerating = false;

        scriptLog('Script cleanup completed');
    }

    // Initialize the script
    init();

})();