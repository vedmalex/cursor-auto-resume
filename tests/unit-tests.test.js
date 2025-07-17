import { test, expect, beforeEach, afterEach, describe } from 'bun:test';

// Define custom MockOptionElement and MockSelectElement classes
class MockOptionElement {
    constructor(value, textContent, selected = false, disabled = false) {
        this.value = value;
        this.textContent = textContent || value; // Use value as textContent if not provided
        this._selected = selected; // Internal state for selected
        this.disabled = disabled;
    }

    get selected() {
        return this._selected;
    }

    set selected(val) {
        this._selected = val;
        // When an option is selected/deselected, its parent select element needs to be updated.
        // This is simplified and assumes a parent is always set for now.
        if (this.parentElement && this.parentElement.updateSelectionFromOption) {
            this.parentElement.updateSelectionFromOption(this, val);
        }
    }
}

class MockSelectElement {
    constructor(id) {
        this.id = id;
        this._options = []; // Array to store MockOptionElement instances
        this._selectedIndex = -1;
        this.onchange = null;
        this.style = {}; // To mock style properties
        this.parentElement = null; // To allow setting a parent for buttons
        this.disabled = false; // Add disabled property

        // Simulate HTMLSelectElement's options collection
        Object.defineProperty(this, 'options', {
            get() { return this._options; }
        });

        // Simulate HTMLSelectElement's selectedOptions collection
        Object.defineProperty(this, 'selectedOptions', {
            get() { return this._options.filter(opt => opt.selected); }
        });

        // Simulate HTMLSelectElement's children for clearing
        Object.defineProperty(this, 'children', {
            get() { return this._options; }
        });

        Object.defineProperty(this, 'firstChild', {
            get() { return this._options.length > 0 ? this._options[0] : null; }
        });
    }

    appendChild(option) {
        this._options.push(option);
        option.parentElement = this; // Set parent for the option
        // If this is the only option and it's selected, update selectedIndex
        if (option.selected && this._selectedIndex === -1) {
            this._selectedIndex = this._options.indexOf(option);
        }
    }

    removeChild(option) {
        const index = this._options.indexOf(option);
        if (index > -1) {
            const removed = this._options.splice(index, 1)[0];
            if (removed) removed.parentElement = null;
            if (this._selectedIndex === index) {
                this._selectedIndex = -1; // Reset if removed selected
            } else if (this._selectedIndex > index) {
                this._selectedIndex--; // Adjust if selected index was after removed
            }
        }
    }

    remove(index) {
        if (index >= 0 && index < this._options.length) {
            const removedOption = this._options.splice(index, 1)[0];
            if (removedOption) removedOption.parentElement = null;
            if (this._selectedIndex === index) {
                this._selectedIndex = -1; // Reset if removed selected
            } else if (this._selectedIndex > index) {
                this._selectedIndex--; // Adjust if selected index was after removed
            }
        }
    }

    // Custom method to update selectedIndex and selected property of options when value is set
    updateSelectionByValue(newValue) {
        let newIndex = -1;
        this._options.forEach((option, index) => {
            if (option.value === newValue) {
                option._selected = true; // Directly set internal selected state
                newIndex = index;
            } else {
                option._selected = false;
            }
        });
        this._selectedIndex = newIndex;
    }

    // Custom method to update selectedIndex and selected property of options when index is set
    updateSelectionByIndex(newIndex) {
        this._options.forEach((option, index) => {
            option._selected = (index === newIndex);
        });
        this._selectedIndex = newIndex;
    }

    get selectedIndex() {
        return this._selectedIndex;
    }

    set selectedIndex(index) {
        this.updateSelectionByIndex(index);
    }

    get value() {
        if (this._selectedIndex !== -1 && this._options[this._selectedIndex]) {
            return this._options[this._selectedIndex].value;
        }
        return '';
    }

    set value(newValue) {
        this.updateSelectionByValue(newValue);
    }

    dispatchEvent(event) {
        if (event.type === 'change' && typeof this.onchange === 'function') {
            this.onchange();
        }
    }

    // Mock for querySelector and querySelectorAll, needed for All/None buttons
    querySelector(selector) {
        if (selector === 'button') {
            // Simple mock for querySelector to find the 'All' button
            return this.parentElement.querySelector(selector);
        }
        return null;
    }

    querySelectorAll(selector) {
        if (selector === 'button') {
            // Simple mock for querySelectorAll to find 'All' and 'None' buttons
            return this.parentElement.querySelectorAll(selector);
        }
        return [];
    }
}

// Mock for span elements (e.g., status-message, current-mode)
class MockSpanElement {
    constructor(id) {
        this.id = id;
        this.innerText = '';
        this.style = {}; // For color
    }
}

// Mock for div elements
class MockDivElement {
    constructor(id) {
        this.id = id;
        this.innerHTML = '';
        this.style = {};
        this.children = []; // To store appended children
        this.parentElement = null; // Add parentElement property
    }

    appendChild(child) {
        this.children.push(child);
        // Simulate parent-child relationship if needed by happy-dom or other mocks
        if (child.parentElement) {
            // If the child already has a parent, remove it from that parent first
            child.parentElement.removeChild(child);
        }
        child.parentElement = this;
    }

    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
            child.parentElement = null;
        }
    }

    get firstChild() {
        return this.children.length > 0 ? this.children[0] : null;
    }

    // Corrected to be a method, not a getter, to allow arguments
    querySelector(selector) {
        // Basic querySelector mock, can be expanded if needed
        for (const child of this.children) {
            if (selector.startsWith('#') && child.id === selector.substring(1)) {
                return child;
            }
            if (selector.startsWith('.') && child.classList && child.classList.contains(selector.substring(1))) {
                return child;
            }
            // Simple tag name match
            if (child.tagName && child.tagName.toLowerCase() === selector.toLowerCase()) {
                return child;
            }
        }
        return null;
    }

    // Corrected to be a method, not a getter, to allow arguments
    querySelectorAll(selector) {
        // Basic querySelectorAll mock
        const results = [];
        for (const child of this.children) {
            if (selector.startsWith('#') && child.id === selector.substring(1)) {
                results.push(child);
            }
            if (selector.startsWith('.') && child.classList && child.classList.contains(selector.substring(1))) {
                results.push(child);
            }
            // Simple tag name match
            if (child.tagName && child.tagName.toLowerCase() === selector.toLowerCase()) {
                results.push(child);
            }
        }
        return results;
    }
}

// Store original document.getElementById
const originalGetElementById = global.document.getElementById;
const originalQuerySelector = global.document.querySelector;
const originalQuerySelectorAll = global.document.querySelectorAll;

// Helper to mock document.getElementById
const mockGetElementById = (id) => {
    switch (id) {
        case 'agentModeSelect':
            if (!global.document.mockAgentModeSelect) {
                global.document.mockAgentModeSelect = new MockSelectElement('agentModeSelect');
            }
            return global.document.mockAgentModeSelect;
        case 'modelSelect':
            if (!global.document.mockModelSelect) {
                global.document.mockModelSelect = new MockSelectElement('modelSelect');
            }
            return global.document.mockModelSelect;
        case 'scriptStateIndicator':
            if (!global.document.mockScriptStateIndicator) {
                global.document.mockScriptStateIndicator = new MockSpanElement('scriptStateIndicator');
            }
            return global.document.mockScriptStateIndicator;
        case 'statusIndicator':
            if (!global.document.mockStatusIndicator) {
                global.document.mockStatusIndicator = new MockSpanElement('statusIndicator');
            }
            return global.document.mockStatusIndicator;
        case 'logOutput':
            if (!global.document.mockLogOutput) {
                global.document.mockLogOutput = new MockDivElement('logOutput');
            }
            return global.document.mockLogOutput;
        default:
            // For other elements, let happy-dom create them dynamically
            return originalGetElementById(id);
    }
};

// Define necessary variables and mocks for the copied functions to work
// These variables are typically part of the IIFE scope in the original script.
let currentScriptState = 'TEST_STATE'; // Mock for logging
let logOutput = null; // Will be mocked in beforeEach
let isLogCollapsed = false;
let isLoggingPaused = false;
let logHistory = []; // Changed from const to let
const MAX_LOG_LINES = 100;
let DEBUG_MODE = true; // Use true for tests unless specifically testing debug mode off
let scriptLog; // Declare scriptLog globally to be defined later

// Mock setTimeout and clearTimeout
const originalSetTimeout = global.setTimeout;
const originalClearTimeout = global.clearTimeout;

let selectedModelForResume = ''; // Stores the value of the selected model for resume
let selectedModelsForResume = []; // Stores an array of selected models for resume

let selectedAgentModeForResume = ''; // Stores the value of the selected agent mode for resume
let selectedAgentModesForResume = []; // Stores an array of selected agent modes for resume

let availableModels = []; // Holds the full list of available models
let availableAgentModes = []; // Holds the full list of available agent modes


beforeEach(() => {
    // Reset global document.getElementById mock for each test
    global.document.getElementById = mockGetElementById;
    global.document.querySelector = originalQuerySelector; // Use original for general queries unless specific mocks are needed
    global.document.querySelectorAll = originalQuerySelectorAll; // Use original for general queries unless specific mocks are needed

    // Reset log history and state variables
    logHistory = [];
    isLoggingPaused = false;
    currentScriptState = 'TEST_STATE';
    DEBUG_MODE = true;

    // Mock setTimeout and clearTimeout to control timers
    global.setTimeout = (fn, delay) => {
        return originalSetTimeout(fn, delay);
    };
    global.clearTimeout = (id) => {
        originalClearTimeout(id);
    };

    // Explicitly reset mocks for comboboxes before each test
    global.document.mockAgentModeSelect = new MockSelectElement('agentModeSelect');
    global.document.mockModelSelect = new MockSelectElement('modelSelect');
    global.document.mockScriptStateIndicator = new MockSpanElement('scriptStateIndicator');
    global.document.mockStatusIndicator = new MockSpanElement('statusIndicator');
    global.document.mockLogOutput = new MockDivElement('logOutput');

    logOutput = global.document.getElementById('logOutput'); // Re-assign logOutput mock
});

afterEach(() => {
    // Restore original setTimeout and clearTimeout
    global.setTimeout = originalSetTimeout;
    global.clearTimeout = originalClearTimeout;
});

// Custom logging function for the script only (simplified for tests)
scriptLog = (message, level = 'INFO') => {
    // Error messages always bypass the pause, others are skipped if paused
    if (isLoggingPaused && level !== 'ERROR') {
        return;
    }

    // Skip DEBUG messages if DEBUG_MODE is false
    if (level === 'DEBUG' && !DEBUG_MODE) {
        return;
    }

    // Ensure logOutput is properly mocked for tests.
    const targetLogOutput = document.getElementById('logOutput');
    // If not, log to history directly with simplified format as a fallback.
    if (!targetLogOutput) {
        logHistory.push(`[${currentScriptState}] ${level}: ${message}`);
        return;
    }

    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const formattedMessage = `[${timestamp}] [${currentScriptState}] ${level}: ${message}`;

    logHistory.push(formattedMessage);
    if (logHistory.length > MAX_LOG_LINES) {
        logHistory.shift(); // Remove oldest entry
    }

    // Update DOM safely (only if not collapsed)
    if (!isLogCollapsed) {
        // Clear existing content safely by removing all children
        while (targetLogOutput.firstChild) {
            targetLogOutput.removeChild(targetLogOutput.firstChild);
        }
        logHistory.forEach(line => {
            const lineDiv = document.createElement('div');
            lineDiv.textContent = line;
            targetLogOutput.appendChild(lineDiv);
        });
    }
};

// Start of copied functions from cursor-auto-resume.js (only relevant ones for tests)
const detectGenerationStatus = () => {
    const generatingText = document.querySelector('.highlight-block.text-response.blinking-cursor');
    const isGenerating = !!generatingText && generatingText.offsetParent !== null; // Check for visibility

    const errorBlock = document.querySelector('.error-block');
    const isError = !!errorBlock && errorBlock.offsetParent !== null; // Check for visibility

    const resumeButton = document.querySelector('button.resume-button');
    const isResume = !!resumeButton && resumeButton.offsetParent !== null; // Check for visibility

    return { isGenerating, isError, isResume };
};

const checkErrorOrResumeButtons = () => {
    const errorBlock = document.querySelector('.error-block');
    const resumeButton = document.querySelector('button.resume-button');
    const editButton = document.querySelector('button.edit-button');
    const agentModeCombobox = document.getElementById('agentModeSelect');
    const modelCombobox = document.getElementById('modelSelect');

    const errorVisible = errorBlock && errorBlock.offsetParent !== null; // offsetParent check for visibility
    const resumeVisible = resumeButton && resumeButton.offsetParent !== null;
    const editVisible = editButton && editButton.offsetParent !== null;

    // Check if both comboboxes are disabled when there's an error or resume button is visible
    // This should be true if *either* is disabled, to simplify re-enabling.
    const comboboxesCurrentlyDisabled = (agentModeCombobox && agentModeCombobox.disabled) || (modelCombobox && modelCombobox.disabled);

    // If an error is visible, or resume button is visible, and comboboxes are not disabled, disable them.
    if ((errorVisible || resumeVisible) && !comboboxesCurrentlyDisabled) {
        if (agentModeCombobox) agentModeCombobox.disabled = true;
        if (modelCombobox) modelCombobox.disabled = true;
        scriptLog('Comboboxes disabled due to error or resume button presence.', 'DEBUG');
    }
    // If no error and no resume button, and comboboxes are disabled, enable them.
    else if (!(errorVisible || resumeVisible) && comboboxesCurrentlyDisabled) {
        if (agentModeCombobox) agentModeCombobox.disabled = false;
        if (modelCombobox) modelCombobox.disabled = false;
        scriptLog('Comboboxes re-enabled as error/resume button not present.', 'DEBUG');
    }

    return { errorVisible, resumeVisible, editVisible };
};

const extractAvailableModels = () => {
    const modelSelect = document.getElementById('modelSelect');
    if (!modelSelect) {
        scriptLog('Model select combobox not found.', 'WARN');
        return [];
    }
    const models = Array.from(modelSelect.options).map(option => option.value);
    scriptLog(`Extracted available models: ${models.join(', ')}`, 'DEBUG');
    return models;
};

const extractAvailableAgentModes = () => {
    const agentModeSelect = document.getElementById('agentModeSelect');
    if (!agentModeSelect) {
        scriptLog('Agent mode select combobox not found.', 'WARN');
        return [];
    }
    const modes = Array.from(agentModeSelect.options).map(option => option.value);
    scriptLog(`Extracted available agent modes: ${modes.join(', ')}`, 'DEBUG');
    return modes;
};

const updateModelCombobox = (models, selectedModel) => {
    const modelSelect = document.getElementById('modelSelect');
    if (!modelSelect) {
        scriptLog('Model select combobox not found, cannot update.', 'WARN');
        return;
    }

    const currentSelectedModel = modelSelect.value; // Get the currently selected model before clearing

    // Clear existing options
    while (modelSelect.firstChild) {
        modelSelect.removeChild(modelSelect.firstChild);
    }

    models.forEach(model => {
        const option = new MockOptionElement(model, model); // Use MockOptionElement
        modelSelect.appendChild(option);
    });

    // Attempt to re-select the previously selected model or the provided selectedModel
    if (models.includes(selectedModel)) {
        modelSelect.value = selectedModel;
        scriptLog(`Set model combobox to provided selectedModel: ${selectedModel}`, 'DEBUG');
    } else if (models.includes(currentSelectedModel)) {
        modelSelect.value = currentSelectedModel;
        scriptLog(`Re-selected previous model: ${currentSelectedModel}`, 'DEBUG');
    } else if (models.length > 0) {
        modelSelect.value = models[0];
        scriptLog(`Selected first available model: ${models[0]}`, 'DEBUG');
    }
};

const updateAgentModeCombobox = (modes, selectedMode) => {
    const agentModeSelect = document.getElementById('agentModeSelect');
    if (!agentModeSelect) {
        scriptLog('Agent mode select combobox not found, cannot update.', 'WARN');
        return;
    }

    const currentSelectedMode = agentModeSelect.value; // Get the currently selected mode before clearing

    // Clear existing options
    while (agentModeSelect.firstChild) {
        agentModeSelect.removeChild(agentModeSelect.firstChild);
    }

    modes.forEach(mode => {
        const option = new MockOptionElement(mode, mode); // Use MockOptionElement
        agentModeSelect.appendChild(option);
    });

    // Attempt to re-select the previously selected mode or the provided selectedMode
    if (modes.includes(selectedMode)) {
        agentModeSelect.value = selectedMode;
        scriptLog(`Set agent mode combobox to provided selectedMode: ${selectedMode}`, 'DEBUG');
    } else if (modes.includes(currentSelectedMode)) {
        agentModeSelect.value = currentSelectedMode;
        scriptLog(`Re-selected previous agent mode: ${currentSelectedMode}`, 'DEBUG');
    } else if (modes.length > 0) {
        agentModeSelect.value = modes[0];
        scriptLog(`Selected first available agent mode: ${modes[0]}`, 'DEBUG');
    }
};

const updateIndicator = (isGenerating, isError, isResume, selectedModel, selectedMode) => {
    const scriptStateIndicator = document.getElementById('scriptStateIndicator');
    const statusIndicator = document.getElementById('statusIndicator');

    if (!scriptStateIndicator || !statusIndicator) {
        scriptLog('Indicators not found, cannot update.', 'WARN');
        return;
    }

    if (isGenerating) {
        scriptStateIndicator.innerText = 'Generating...';
        scriptStateIndicator.style.color = 'yellow';
        statusIndicator.innerText = ''; // Clear status when generating
        statusIndicator.style.color = '';
    } else if (isError) {
        scriptStateIndicator.innerText = 'Error!';
        scriptStateIndicator.style.color = 'red';
        statusIndicator.innerText = ''; // Clear status on error
        statusIndicator.style.color = '';
    } else if (isResume) {
        scriptStateIndicator.innerText = 'Ready to Resume';
        scriptStateIndicator.style.color = 'orange';
        statusIndicator.innerText = `Model: ${selectedModel || 'N/A'}, Mode: ${selectedMode || 'N/A'}`;
        statusIndicator.style.color = 'orange';
    } else {
        scriptStateIndicator.innerText = 'Idle';
        scriptStateIndicator.style.color = 'lightgreen';
        statusIndicator.innerText = `Model: ${selectedModel || 'N/A'}, Mode: ${selectedMode || 'N/A'}`;
        statusIndicator.style.color = 'lightgreen';
    }
};

// End of copied functions from cursor-auto-resume.js

// Test Suite: UI Detection Functions
describe('UI Detection Functions', () => {
    beforeEach(() => {
        // Set up a basic DOM structure for happy-dom
        document.body.innerHTML = `
            <div id="container">
                <div class="highlight-block text-response blinking-cursor"></div>
                <div class="error-block"></div>
                <button class="resume-button"></button>
                <button class="edit-button"></button>
                <select id="agentModeSelect"></select>
                <select id="modelSelect"></select>
                <span id="scriptStateIndicator"></span>
                <span id="statusIndicator"></span>
                <div id="logOutput"></div>
            </div>
        `;
    });

    test('detectGenerationStatus correctly identifies generating state', () => {
        expect(detectGenerationStatus().isGenerating).toBe(true);
        document.querySelector('.highlight-block.text-response.blinking-cursor').remove();
        expect(detectGenerationStatus().isGenerating).toBe(false);
    });

    test('detectGenerationStatus correctly identifies error state', () => {
        expect(detectGenerationStatus().isError).toBe(true);
        document.querySelector('.error-block').remove();
        expect(detectGenerationStatus().isError).toBe(false);
    });

    test('detectGenerationStatus correctly identifies resume state', () => {
        expect(detectGenerationStatus().isResume).toBe(true);
        document.querySelector('button.resume-button').remove();
        expect(detectGenerationStatus().isResume).toBe(false);
    });

    test('checkErrorOrResumeButtons disables comboboxes when error is visible', () => {
        const agentModeSelect = document.getElementById('agentModeSelect');
        const modelSelect = document.getElementById('modelSelect');
        agentModeSelect.disabled = false;
        modelSelect.disabled = false;

        document.querySelector('.error-block').style.display = ''; // Make visible
        document.querySelector('button.resume-button').style.display = 'none'; // Make invisible

        checkErrorOrResumeButtons();
        expect(agentModeSelect.disabled).toBe(true);
        expect(modelSelect.disabled).toBe(true);
    });

    test('checkErrorOrResumeButtons disables comboboxes when resume button is visible', () => {
        const agentModeSelect = document.getElementById('agentModeSelect');
        const modelSelect = document.getElementById('modelSelect');
        agentModeSelect.disabled = false;
        modelSelect.disabled = false;

        document.querySelector('.error-block').style.display = 'none'; // Make invisible
        document.querySelector('button.resume-button').style.display = ''; // Make visible

        checkErrorOrResumeButtons();
        expect(agentModeSelect.disabled).toBe(true);
        expect(modelSelect.disabled).toBe(true);
    });

    test('checkErrorOrResumeButtons re-enables comboboxes when neither error nor resume button are visible', () => {
        const agentModeSelect = document.getElementById('agentModeSelect');
        const modelSelect = document.getElementById('modelSelect');
        agentModeSelect.disabled = true; // Start disabled
        modelSelect.disabled = true; // Start disabled

        document.querySelector('.error-block').style.display = 'none';
        document.querySelector('button.resume-button').style.display = 'none';

        checkErrorOrResumeButtons();
        expect(agentModeSelect.disabled).toBe(false);
        expect(modelSelect.disabled).toBe(false);
    });
});

// Test Suite: Logging Pause and Timer Interaction
describe('Logging Pause and Timer Interaction', () => {
    let mockConsoleLog;
    let originalConsoleLog;

    beforeEach(() => {
        // Mock console.log to capture output
        originalConsoleLog = console.log;
        mockConsoleLog = [];
        console.log = (...args) => mockConsoleLog.push(args.join(' '));

        // Ensure logOutput is present for scriptLog to use it
        document.body.innerHTML = '<div id="logOutput"></div>';
        logOutput = document.getElementById('logOutput');
    });

    afterEach(() => {
        // Restore original console.log
        console.log = originalConsoleLog;
    });

    test('scriptLog does not log messages when isLoggingPaused is true, except for errors', () => {
        isLoggingPaused = true;
        logHistory = []; // Reset logHistory for this test

        scriptLog('This is a normal message.', 'INFO');
        expect(logHistory.length).toBe(0); // Should not log normal messages when paused

        scriptLog('This is an error message.', 'ERROR');
        expect(logHistory.length).toBe(1); // Should log error messages even when paused
        expect(logHistory[0]).toContain('[TEST_STATE] ERROR: This is an error message.');

        scriptLog('This is a debug message.', 'DEBUG');
        expect(logHistory.length).toBe(1); // Should not log debug messages when paused
    });

    test('scriptLog logs messages when isLoggingPaused is false', () => {
        isLoggingPaused = false;
        logHistory = []; // Reset logHistory for this test

        scriptLog('Normal message 1.', 'INFO');
        expect(logHistory.length).toBe(1);
        expect(logHistory[0]).toContain('[TEST_STATE] INFO: Normal message 1.');

        scriptLog('Debug message 1.', 'DEBUG');
        expect(logHistory.length).toBe(2);
        expect(logHistory[1]).toContain('[TEST_STATE] DEBUG: Debug message 1.');
    });

    test('Timer callback executes even if logging is paused during callback execution', async () => {
        isLoggingPaused = false;
        let timerCallbackExecuted = false;
        logHistory = []; // Reset logHistory for this test

        const testCallback = () => {
            timerCallbackExecuted = true;
            isLoggingPaused = true; // Pause logging inside the callback
            scriptLog('Message from timer callback.', 'INFO');
        };

        const timerId = setTimeout(testCallback, 10); // Use a small delay

        await new Promise(resolve => setTimeout(resolve, 20)); // Wait for timer to likely execute

        expect(timerCallbackExecuted).toBe(true);
        expect(isLoggingPaused).toBe(true); // Logging should be paused now
        expect(logHistory.length).toBe(0); // Since logging was paused *inside* callback for the log message, it shouldn't be logged.
        clearTimeout(timerId);
    });

    test('scriptLog respects DEBUG_MODE setting', () => {
        DEBUG_MODE = false;
        logHistory = []; // Reset logHistory for this test

        scriptLog('This is an INFO message.', 'INFO');
        expect(logHistory.length).toBe(1); // INFO should always log

        scriptLog('This is a DEBUG message.', 'DEBUG');
        expect(logHistory.length).toBe(1); // DEBUG should not log if DEBUG_MODE is false
    });
});

// Test Suite: Model and Agent Mode Persistence and Display
describe('Model and Agent Mode Persistence and Display', () => {
    let mockModelSelect;
    let mockAgentModeSelect;
    let mockScriptStateIndicator;
    let mockStatusIndicator;

    beforeEach(() => {
        // Set up a basic DOM structure for happy-dom
        document.body.innerHTML = `
            <div>
                <select id="modelSelect"></select>
                <select id="agentModeSelect"></select>
                <span id="scriptStateIndicator"></span>
                <span id="statusIndicator"></span>
                <div id="logOutput"></div>
            </div>
        `;

        // Manually get and assign mocks to ensure they are the ones used by getElementById
        mockModelSelect = document.getElementById('modelSelect');
        mockAgentModeSelect = document.getElementById('agentModeSelect');
        mockScriptStateIndicator = document.getElementById('scriptStateIndicator');
        mockStatusIndicator = document.getElementById('statusIndicator');

        // Add options to mocks
        updateModelCombobox(['gpt-4', 'gpt-3.5'], 'gpt-4');
        updateAgentModeCombobox(['chat', 'edit'], 'chat');

        logOutput = document.getElementById('logOutput'); // Re-assign logOutput mock for this suite
    });

    test('extractAvailableModels correctly extracts models from combobox', () => {
        // Assuming updateModelCombobox has run in beforeEach
        const models = extractAvailableModels();
        expect(models).toEqual(['gpt-4', 'gpt-3.5']);
        expect(mockModelSelect.options[0].textContent).toBe('gpt-4');
    });

    test('extractAvailableAgentModes correctly extracts modes from combobox', () => {
        // Assuming updateAgentModeCombobox has run in beforeEach
        const modes = extractAvailableAgentModes();
        expect(modes).toEqual(['chat', 'edit']);
        expect(mockAgentModeSelect.options[0].textContent).toBe('chat');
    });

    test('updateModelCombobox populates and selects provided model', () => {
        const newModels = ['gemini', 'claude'];
        const selected = 'claude';
        updateModelCombobox(newModels, selected);

        expect(mockModelSelect.options.length).toBe(2);
        expect(mockModelSelect.options[0].value).toBe('gemini');
        expect(mockModelSelect.options[1].value).toBe('claude');
        expect(mockModelSelect.value).toBe(selected);
        expect(mockModelSelect.selectedIndex).toBe(1); // selected is 'claude' (index 1)
        expect(mockModelSelect.options[1].selected).toBe(true);
    });

    test('updateModelCombobox re-selects previously selected model if available', () => {
        // Initially selected 'gpt-4' from beforeEach
        const newModels = ['gpt-4', 'new-model'];
        updateModelCombobox(newModels, 'no-match'); // Try to set a non-existent model

        expect(mockModelSelect.options.length).toBe(2);
        expect(mockModelSelect.value).toBe('gpt-4'); // Should re-select 'gpt-4'
        expect(mockModelSelect.selectedIndex).toBe(0);
        expect(mockModelSelect.options[0].selected).toBe(true);
    });

    test('updateModelCombobox selects first model if neither provided nor previous is available', () => {
        const newModels = ['first', 'second'];
        global.document.mockModelSelect.value = ''; // Clear previous selection for this test explicitly

        updateModelCombobox(newModels, 'non-existent');

        expect(mockModelSelect.options.length).toBe(2);
        expect(mockModelSelect.value).toBe('first'); // Should select 'first'
        expect(mockModelSelect.options[0].selected).toBe(true);
    });

    test('updateModelCombobox handles empty models array gracefully', () => {
        updateModelCombobox([], '');
        expect(mockModelSelect.options.length).toBe(0);
        expect(mockModelSelect.value).toBe('');
    });

    test('updateModelCombobox handles missing combobox gracefully', () => {
        // Temporarily set logOutput to a mock that doesn't use happy-dom to avoid errors
        const originalLogOutput = logOutput;
        logOutput = {
            appendChild: () => {},
            removeChild: () => {},
            firstChild: null
        };

        global.document.getElementById = (id) => {
            if (id === 'modelSelect') return null; // Simulate missing combobox
            if (id === 'logOutput') return originalLogOutput; // Still use the actual logOutput for messages
            return originalGetElementById(id);
        };

        updateModelCombobox(['a'], 'a');
        // No error should be thrown, and a warning should be logged
        expect(logHistory[logHistory.length - 1]).toContain('Model select combobox not found, cannot update.');

        logOutput = originalLogOutput; // Restore original
    });

    test('updateAgentModeCombobox populates and selects provided mode', () => {
        const newModes = ['debug', 'release'];
        const selected = 'release';
        updateAgentModeCombobox(newModes, selected);

        expect(mockAgentModeSelect.options.length).toBe(2);
        expect(mockAgentModeSelect.options[0].value).toBe('debug');
        expect(mockAgentModeSelect.options[1].value).toBe('release');
        expect(mockAgentModeSelect.value).toBe(selected);
        expect(mockAgentModeSelect.selectedIndex).toBe(1);
        expect(mockAgentModeSelect.options[1].selected).toBe(true);
    });

    test('updateAgentModeCombobox re-selects previously selected mode if available', () => {
        // Initially selected 'chat' from beforeEach
        const newModes = ['chat', 'new-mode'];
        updateAgentModeCombobox(newModes, 'no-match');

        expect(mockAgentModeSelect.options.length).toBe(2);
        expect(mockAgentModeSelect.value).toBe('chat');
        expect(mockAgentModeSelect.selectedIndex).toBe(0);
        expect(mockAgentModeSelect.options[0].selected).toBe(true);
    });

    test('updateAgentModeCombobox selects first mode if neither provided nor previous is available', () => {
        const newModes = ['first-mode', 'second-mode'];
        global.document.mockAgentModeSelect.value = ''; // Clear previous selection for this test explicitly
        updateAgentModeCombobox(newModes, 'non-existent');

        expect(mockAgentModeSelect.options.length).toBe(2);
        expect(mockAgentModeSelect.value).toBe('first-mode');
        expect(mockAgentModeSelect.selectedIndex).toBe(0);
        expect(mockAgentModeSelect.options[0].selected).toBe(true);
    });

    test('updateAgentModeCombobox handles empty modes array gracefully', () => {
        updateAgentModeCombobox([], '');
        expect(mockAgentModeSelect.options.length).toBe(0);
        expect(mockAgentModeSelect.value).toBe('');
    });

    test('updateAgentModeCombobox handles missing combobox gracefully', () => {
        const originalLogOutput = logOutput;
        logOutput = {
            appendChild: () => {},
            removeChild: () => {},
            firstChild: null
        };

        global.document.getElementById = (id) => {
            if (id === 'agentModeSelect') return null; // Simulate missing combobox
            if (id === 'logOutput') return originalLogOutput; // Still use the actual logOutput for messages
            return originalGetElementById(id);
        };

        updateAgentModeCombobox(['a'], 'a');
        expect(logHistory[logHistory.length - 1]).toContain('Agent mode select combobox not found, cannot update.');

        logOutput = originalLogOutput;
    });

    test('updateIndicator correctly displays "Generating" state', () => {
        updateIndicator(true, false, false, 'gpt-4', 'chat');
        expect(mockScriptStateIndicator.innerText).toBe('Generating...');
        expect(mockScriptStateIndicator.style.color).toBe('yellow');
        expect(mockStatusIndicator.innerText).toBe('');
    });

    test('updateIndicator correctly displays "Error!" state', () => {
        updateIndicator(false, true, false, 'gpt-4', 'chat');
        expect(mockScriptStateIndicator.innerText).toBe('Error!');
        expect(mockScriptStateIndicator.style.color).toBe('red');
        expect(mockStatusIndicator.innerText).toBe('');
    });

    test('updateIndicator correctly displays "Ready to Resume" state with selected model and mode', () => {
        updateIndicator(false, false, true, 'gpt-4', 'chat');
        expect(mockScriptStateIndicator.innerText).toBe('Ready to Resume');
        expect(mockScriptStateIndicator.style.color).toBe('orange');
        expect(mockStatusIndicator.innerText).toBe('Model: gpt-4, Mode: chat');
        expect(mockStatusIndicator.style.color).toBe('orange');
    });

    test('updateIndicator correctly displays "Idle" state with selected model and mode', () => {
        updateIndicator(false, false, false, 'gpt-4', 'chat');
        expect(mockScriptStateIndicator.innerText).toBe('Idle');
        expect(mockScriptStateIndicator.style.color).toBe('lightgreen');
        expect(mockStatusIndicator.innerText).toBe('Model: gpt-4, Mode: chat');
        expect(mockStatusIndicator.style.color).toBe('lightgreen');
    });

    test('updateIndicator handles missing indicators gracefully', () => {
        global.document.getElementById = (id) => {
            if (id === 'scriptStateIndicator' || id === 'statusIndicator') return null;
            if (id === 'logOutput') return logOutput; // Ensure logOutput is still available
            return originalGetElementById(id);
        };
        updateIndicator(true, false, false, 'gpt-4', 'chat');
        // Expect no errors, and a warning should be logged
        expect(logHistory[logHistory.length - 1]).toContain('Indicators not found, cannot update.');
    });
});