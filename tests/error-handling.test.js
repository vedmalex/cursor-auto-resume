import { test, expect, beforeAll, afterEach, describe } from "bun:test";
import { JSDOM } from "jsdom";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper to get script content
const getScriptContent = () => {
  const scriptPath = resolve(__dirname, "../cursor-auto-resume.js");
  return readFileSync(scriptPath, "utf-8");
};

// Helper to create a DOM with error popup
const createErrorPopupDOM = (errorText, buttonText) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><title>Error Test</title></head>
    <body>
      <div class="composer-warning-popup">
        <div class="composer-error-message">${errorText}</div>
        <button class="anysphere-secondary-button">${buttonText}</button>
      </div>
    </body>
    </html>
  `;

  return new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
};

// Helper to create a DOM with tool limit scenario
const createToolLimitDOM = () => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><title>Tool Limit Test</title></head>
    <body>
      <section data-markdown-raw="Note: we default stop the agent after 25 tool calls.">
        <p>Note: we default stop the agent after 25 tool calls.</p>
        <a href="#" class="markdown-link">resume the conversation</a>
      </section>
    </body>
    </html>
  `;

  return new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
};

describe("Error Handling Functionality", () => {
  let dom;
  let window;
  let document;

  afterEach(() => {
    if (dom) {
      dom.window.close();
    }
  });

  test("should detect and handle rate limit error DOM structure", async () => {
    dom = createErrorPopupDOM("rate limit", "Try again");
    window = dom.window;
    document = window.document;

    // Set up global variables that the script expects
    global.window = window;
    global.document = document;

    // Inject the script
    const scriptContent = getScriptContent();
    const script = document.createElement("script");
    script.textContent = scriptContent;
    document.head.appendChild(script);

    // Wait for script to initialize
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify the error popup structure is correct for script detection
    const errorPopup = document.querySelector('.composer-warning-popup');
    expect(errorPopup).toBeTruthy();
    expect(errorPopup.textContent).toContain("rate limit");

    const button = errorPopup.querySelector('button');
    expect(button).toBeTruthy();
    expect(button.textContent).toBe("Try again");

    // Verify script indicator was created (indicating script loaded successfully)
    const indicator = document.querySelector('#cursor-auto-resume-indicator');
    expect(indicator).toBeTruthy();
  });

  test("should detect and handle general error DOM structure", async () => {
    dom = createErrorPopupDOM("An error occurred", "Resume");
    window = dom.window;
    document = window.document;

    global.window = window;
    global.document = document;

    const scriptContent = getScriptContent();
    const script = document.createElement("script");
    script.textContent = scriptContent;
    document.head.appendChild(script);

    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify the error popup structure is correct for script detection
    const errorPopup = document.querySelector('.composer-warning-popup');
    expect(errorPopup).toBeTruthy();
    expect(errorPopup.textContent).toContain("An error occurred");

    const button = errorPopup.querySelector('button');
    expect(button).toBeTruthy();
    expect(button.textContent).toBe("Resume");

    // Verify script indicator was created
    const indicator = document.querySelector('#cursor-auto-resume-indicator');
    expect(indicator).toBeTruthy();
  });

  test("should detect and handle tool limit scenario", async () => {
    dom = createToolLimitDOM();
    window = dom.window;
    document = window.document;

    global.window = window;
    global.document = document;

    const scriptContent = getScriptContent();
    const script = document.createElement("script");
    script.textContent = scriptContent;
    document.head.appendChild(script);

    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify the tool limit section is detected
    const toolLimitSection = document.querySelector('section[data-markdown-raw*="stop the agent after"]');
    expect(toolLimitSection).toBeTruthy();
    expect(toolLimitSection.textContent).toContain("stop the agent after 25 tool calls");

    const resumeLink = toolLimitSection.querySelector('a');
    expect(resumeLink).toBeTruthy();
    expect(resumeLink.textContent.trim()).toBe("resume the conversation");

    // Verify script indicator was created
    const indicator = document.querySelector('#cursor-auto-resume-indicator');
    expect(indicator).toBeTruthy();
  });

  test("should have all required error scenarios in script content", async () => {
    const scriptContent = getScriptContent();

    // Verify all expected error scenarios are present in script
    const expectedErrors = [
      { errorText: "rate limit", buttonText: "Try again" },
      { errorText: "Rate limit", buttonText: "Try again" },
      { errorText: "Something went wrong", buttonText: "Try again" },
      { errorText: "An error occurred", buttonText: "Resume" },
      { errorText: "We hit the usage limit", buttonText: "Resume" },
      { errorText: "We're having trouble connecting to the model provider", buttonText: "Try again" },
      { errorText: "We're having trouble connecting to the model provider", buttonText: "Resume" }
    ];

    // Check that errorScenarios array is defined
    expect(scriptContent).toContain("const errorScenarios = [");

    // Check that each expected error scenario is present in the script
    for (const expectedError of expectedErrors) {
      expect(scriptContent).toContain(`errorText: "${expectedError.errorText}"`);
      expect(scriptContent).toContain(`buttonText: "${expectedError.buttonText}"`);
    }
  });

  test("should have error handling variables and logic initialized", async () => {
    const scriptContent = getScriptContent();

    // Check that error handling variables are present in script
    expect(scriptContent).toContain("lastClickTime");
    expect(scriptContent).toContain("lastInteractionTime");
    expect(scriptContent).toContain("lastDetectedErrorText");
    expect(scriptContent).toContain("currentErrorRetryCount");
    expect(scriptContent).toContain("retryDelays");
    expect(scriptContent).toContain("errorScenarios");

    // Check that the enhanced clickResumeLink function is present
    expect(scriptContent).toContain("function clickResumeLink()");
    expect(scriptContent).toContain("errorHandledInThisCycle");
    expect(scriptContent).toContain("composer-warning-popup");
    expect(scriptContent).toContain("anysphere-notification-banner");
    expect(scriptContent).toContain("resume the conversation");

    // Check that cooldown logic is present
    expect(scriptContent).toContain("cooldownMultiplier");
    expect(scriptContent).toContain("baseCooldown");
    expect(scriptContent).toContain("adjustedCooldown");

    // Check that XPath logic for tool limit is present
    expect(scriptContent).toContain("document.evaluate");
    expect(scriptContent).toContain("stop the agent after");
  });

  test("should create script indicator when loaded", async () => {
    const scriptContent = getScriptContent();

    // Verify script creates its indicator element
    expect(scriptContent).toContain("indicator = document.createElement('div');");
    expect(scriptContent).toContain("indicator.id = indicatorId;");
    expect(scriptContent).toContain("document.body.appendChild(indicator);");

    // Verify the indicator has the expected structure and text assignment logic
    expect(scriptContent).toContain("const header = document.createElement('div');");
    expect(scriptContent).toContain("indicator.appendChild(header);");
    expect(scriptContent).toContain("const titleSpan = document.createElement('span');");
    expect(scriptContent).toContain("titleSpan.innerText = 'CAR:';");
    expect(scriptContent).toContain("header.appendChild(titleSpan);");
  });
});