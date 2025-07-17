import { test, expect, beforeAll, afterEach, describe } from "bun:test";
import { JSDOM } from "jsdom";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper to get HTML content from a file
const getHtmlContent = (filename) => {
  const filePath = resolve(__dirname, `../html/${filename}`);
  return readFileSync(filePath, "utf-8");
};

// Helper to load HTML content into JSDOM and inject the script
const loadHtmlAndInjectScript = (htmlContent) => {
  const dom = new JSDOM(htmlContent, { runScripts: "dangerously", resources: "usable" });
  const scriptContent = readFileSync(resolve(__dirname, "../cursor-auto-resume.js"), "utf-8");

  // Manually create a script element and append it to the body
  const scriptElement = dom.window.document.createElement("script");
  scriptElement.textContent = scriptContent;
  dom.window.document.body.appendChild(scriptElement);

  return dom.window;
};

describe("Integration Tests for Cursor Auto Resume Script", () => {
  // This will hold the HTML content of the test pages
  let workInProgressHtml;
  let error1Html;
  let case01Html;
  let selector2Html;
  let selector3Html;
  let modelHtml;
  let agentHtml;
  let inputFieldHtml;
  let indicatorHtml;
  let windowMinimalHtml; // Add minimal window HTML

  beforeAll(() => {
    // Load all necessary HTML files once before all tests
    workInProgressHtml = getHtmlContent("work_in_progress.html");
    error1Html = getHtmlContent("error1.html");
    case01Html = getHtmlContent("case.01.html");
    selector2Html = getHtmlContent("selector-2.html");
    selector3Html = getHtmlContent("selector-3.html");
    modelHtml = getHtmlContent("model.html");
    agentHtml = getHtmlContent("agent.html");
    inputFieldHtml = getHtmlContent("input-field.html");
    indicatorHtml = getHtmlContent("indicator.html");
    windowMinimalHtml = getHtmlContent("window-minimal.html"); // Load minimal window HTML
    // You can load other HTML files here as needed
  });

  // Tests for window-minimal.html - Lightweight testing structure
  describe("Minimal Window HTML Tests", () => {
    test("should load window-minimal.html successfully", () => {
      const window = loadHtmlAndInjectScript(windowMinimalHtml);
      expect(window.document).toBeTruthy();
      expect(window.document.title).toBe("Cursor AI Chat - Minimal Test Structure");
    });

    test("should have main chat container with correct ID", () => {
      const window = loadHtmlAndInjectScript(windowMinimalHtml);
      const chatContainer = window.document.querySelector("#workbench\\.panel\\.aichat\\.86891061-2048-496c-80bb-25d100b145e0");
      expect(chatContainer).toBeTruthy();
      expect(chatContainer.classList.contains("composite")).toBe(true);
      expect(chatContainer.classList.contains("auxiliarybar")).toBe(true);
    });

    test("should have model selector with gemini-2.5-flash option", () => {
      const window = loadHtmlAndInjectScript(windowMinimalHtml);
      const modelSelector = window.document.querySelector("#model-selector");
      expect(modelSelector).toBeTruthy();

      const geminiOption = window.document.querySelector("option[value='gemini-2.5-flash']");
      expect(geminiOption).toBeTruthy();
      expect(geminiOption.textContent).toBe("gemini-2.5-flash");
    });

    test("should have mode selector buttons", () => {
      const window = loadHtmlAndInjectScript(windowMinimalHtml);

      const universalBtn = window.document.querySelector("[data-mode='UNIVERSAL']");
      expect(universalBtn).toBeTruthy();
      expect(universalBtn.textContent).toBe("UNIVERSAL");

      const steadilyBtn = window.document.querySelector("[data-mode='STEADILY']");
      expect(steadilyBtn).toBeTruthy();
      expect(steadilyBtn.textContent).toBe("STEADILY");

      const agentBtn = window.document.querySelector("[data-mode='Agent']");
      expect(agentBtn).toBeTruthy();
      expect(agentBtn.textContent).toBe("Agent");
    });

    test("should have generation status indicators", () => {
      const window = loadHtmlAndInjectScript(windowMinimalHtml);

      const generatingText = window.document.querySelector(".generating-text");
      expect(generatingText).toBeTruthy();
      expect(generatingText.textContent).toBe("Generating...");

      const generatingIndicator = window.document.querySelector(".generating-indicator");
      expect(generatingIndicator).toBeTruthy();

      const fullInputBoxGenerating = window.document.querySelector(".full-input-box-generating");
      expect(fullInputBoxGenerating).toBeTruthy();
    });

    test("should have error message elements (initially hidden)", () => {
      const window = loadHtmlAndInjectScript(windowMinimalHtml);

      const errorMessage = window.document.querySelector(".error-message");
      expect(errorMessage).toBeTruthy();
      expect(errorMessage.classList.contains("hidden")).toBe(true);

      const resumeButton = window.document.querySelector(".resume-button");
      expect(resumeButton).toBeTruthy();
      expect(resumeButton.textContent).toBe("Resume");
    });

    test("should have input area with correct classes", () => {
      const window = loadHtmlAndInjectScript(windowMinimalHtml);

      const inputArea = window.document.querySelector(".chat-input");
      expect(inputArea).toBeTruthy();
      expect(inputArea.classList.contains("inputarea")).toBe(true);
      expect(inputArea.classList.contains("monaco-mouse-cursor-text")).toBe(true);
      expect(inputArea.placeholder).toBe("Ask AI anything...");
    });

    test("should have control buttons", () => {
      const window = loadHtmlAndInjectScript(windowMinimalHtml);

      const sendButton = window.document.querySelector(".send-button");
      expect(sendButton).toBeTruthy();
      expect(sendButton.textContent).toBe("Send");

      const stopButton = window.document.querySelector(".stop-button");
      expect(stopButton).toBeTruthy();
      expect(stopButton.textContent).toBe("Stop");
      expect(stopButton.classList.contains("hidden")).toBe(true);
    });

    test("should have testHelpers API available", () => {
      const window = loadHtmlAndInjectScript(windowMinimalHtml);

      expect(window.testHelpers).toBeTruthy();
      expect(typeof window.testHelpers.setGenerating).toBe("function");
      expect(typeof window.testHelpers.setError).toBe("function");
      expect(typeof window.testHelpers.setMode).toBe("function");
      expect(typeof window.testHelpers.setModel).toBe("function");
    });

    test("should simulate generating state using testHelpers", () => {
      const window = loadHtmlAndInjectScript(windowMinimalHtml);

      // Test generating state
      window.testHelpers.setGenerating(true);

      const generatingText = window.document.querySelector(".generating-text");
      expect(generatingText.textContent).toBe("Generating...");

      const stopButton = window.document.querySelector(".stop-button");
      expect(stopButton.classList.contains("hidden")).toBe(false);

      const sendButton = window.document.querySelector(".send-button");
      expect(sendButton.classList.contains("hidden")).toBe(true);

      // Test non-generating state
      window.testHelpers.setGenerating(false);

      expect(generatingText.textContent).toBe("");
      expect(stopButton.classList.contains("hidden")).toBe(true);
      expect(sendButton.classList.contains("hidden")).toBe(false);
    });

    test("should simulate error state using testHelpers", () => {
      const window = loadHtmlAndInjectScript(windowMinimalHtml);

      // Test error state
      window.testHelpers.setError(true, "Test error message");

      const errorMessage = window.document.querySelector(".error-message");
      expect(errorMessage.classList.contains("hidden")).toBe(false);

      const errorText = window.document.querySelector(".error-text");
      expect(errorText.textContent).toBe("Test error message");

      // Test no error state
      window.testHelpers.setError(false);
      expect(errorMessage.classList.contains("hidden")).toBe(true);
    });

    test("should simulate mode changes using testHelpers", () => {
      const window = loadHtmlAndInjectScript(windowMinimalHtml);

      // Test UNIVERSAL mode
      window.testHelpers.setMode("UNIVERSAL");
      const universalBtn = window.document.querySelector("[data-mode='UNIVERSAL']");
      expect(universalBtn.classList.contains("active")).toBe(true);

      // Test STEADILY mode
      window.testHelpers.setMode("STEADILY");
      const steadilyBtn = window.document.querySelector("[data-mode='STEADILY']");
      expect(steadilyBtn.classList.contains("active")).toBe(true);
      expect(universalBtn.classList.contains("active")).toBe(false);
    });

    test("should simulate model selection using testHelpers", () => {
      const window = loadHtmlAndInjectScript(windowMinimalHtml);

      window.testHelpers.setModel("claude-3.5-sonnet");
      const modelSelector = window.document.querySelector("#model-selector");
      expect(modelSelector.value).toBe("claude-3.5-sonnet");
    });
  });

  test("should display 'Generating...' text in work_in_progress.html", () => {
    const window = loadHtmlAndInjectScript(workInProgressHtml);
    const generatingTextElement = window.document.querySelector("div.group > div > span");
    expect(generatingTextElement).toBeTruthy();
    expect(generatingTextElement.textContent).toContain("Generating...");
  });

  test("should display error message in error1.html", () => {
    const window = loadHtmlAndInjectScript(error1Html);
    const errorMessageElement = window.document.querySelector(".composer-error-message");
    expect(errorMessageElement).toBeTruthy();
    expect(errorMessageElement.textContent).toContain("We're having trouble connecting to the model provider.");
  });

  test("should display Resume button in error1.html", () => {
    const window = loadHtmlAndInjectScript(error1Html);
    const resumeButton = window.document.querySelector("div.anysphere-secondary-button span");
    expect(resumeButton).toBeTruthy();
    expect(resumeButton.textContent).toContain("Resume");
  });

  test("should display Resume button in case.01.html", () => {
    const window = loadHtmlAndInjectScript(case01Html);
    const resumeButton = window.document.querySelector("div.anysphere-secondary-button span");
    expect(resumeButton).toBeTruthy();
    expect(resumeButton.textContent).toContain("Resume");
  });

  // Tests for html/selector-2.html
  test("should display STEADILY dropdown in selector-2.html", () => {
    const window = loadHtmlAndInjectScript(selector2Html);
    const steadilyDropdown = window.document.querySelector("#f6bb1fc74f6464834ac6a238fdccc135853df3e984cc74c6ba49e5cab1fa09387unifieddropdown .truncate-x");
    expect(steadilyDropdown).toBeTruthy();
    expect(steadilyDropdown.textContent).toContain("STEADILY");
  });

  test("should display gemini-2.5-flash model dropdown in selector-2.html", () => {
    const window = loadHtmlAndInjectScript(selector2Html);
    const modelDropdown = window.document.querySelector("#f6bb1fc74f6464834ac6a238fdccc1358a916ae23789c4933b54bd98e56e7e8edunifiedmodeldropdown .truncate-x");
    expect(modelDropdown).toBeTruthy();
    expect(modelDropdown.textContent).toContain("gemini-2.5-flash");
  });

  // Tests for html/selector-3.html
  test("should display input with placeholder '⌘. for mode menu' in selector-3.html", () => {
    const window = loadHtmlAndInjectScript(selector3Html);
    const inputElement = window.document.querySelector("input[placeholder='⌘. for mode menu']");
    expect(inputElement).toBeTruthy();
  });

  test("should display Agent option in selector-3.html", () => {
    const window = loadHtmlAndInjectScript(selector3Html);
    const agentOption = window.document.querySelector("#composer-mode-f6bb1fc74f6464834ac6a238fdccc135853df3e984cc74c6ba49e5cab1fa09387unifieddropdown-agent .monaco-highlighted-label");
    expect(agentOption).toBeTruthy();
    expect(agentOption.textContent).toContain("Agent");
  });

  test("should display Ask option in selector-3.html", () => {
    const window = loadHtmlAndInjectScript(selector3Html);
    const askOption = window.document.querySelector("#composer-mode-f6bb1fc74f6464834ac6a238fdccc135853df3e984cc74c6ba49e5cab1fa09387unifieddropdown-chat .monaco-highlighted-label");
    expect(askOption).toBeTruthy();
    expect(askOption.textContent).toContain("Ask");
  });

  test("should display Manual option in selector-3.html", () => {
    const window = loadHtmlAndInjectScript(selector3Html);
    const manualOption = window.document.querySelector("#composer-mode-f6bb1fc74f6464834ac6a238fdccc135853df3e984cc74c6ba49e5cab1fa09387unifieddropdown-edit .monaco-highlighted-label");
    expect(manualOption).toBeTruthy();
    expect(manualOption.textContent).toContain("Manual");
  });

  test("should display UNIVERSAL option in selector-3.html", () => {
    const window = loadHtmlAndInjectScript(selector3Html);
    const universalOption = window.document.querySelector("#composer-mode-f6bb1fc74f6464834ac6a238fdccc135853df3e984cc74c6ba49e5cab1fa09387unifieddropdown-e2e441f3-4ed1-41ec-820d-e0c0dc6c3bae .monaco-highlighted-label");
    expect(universalOption).toBeTruthy();
    expect(universalOption.textContent).toContain("UNIVERSAL");
  });

  test("should display STEADILY option in selector-3.html", () => {
    const window = loadHtmlAndInjectScript(selector3Html);
    const steadilyOption = window.document.querySelector("#composer-mode-f6bb1fc74f6464834ac6a238fdccc135853df3e984cc74c6ba49e5cab1fa09387unifieddropdown-c8b7bd7a-5681-4029-9f7f-9bed9d7da297 .monaco-highlighted-label");
    expect(steadilyOption).toBeTruthy();
    expect(steadilyOption.textContent).toContain("STEADILY");
  });

  test("should display MODE option in selector-3.html", () => {
    const window = loadHtmlAndInjectScript(selector3Html);
    const modeOption = window.document.querySelector("#composer-mode-f6bb1fc74f6464834ac6a238fdccc135853df3e984cc74c6ba49e5cab1fa09387unifieddropdown-4d44b930-a91f-4947-8570-8acb495d0cdd .monaco-highlighted-label");
    expect(modeOption).toBeTruthy();
    expect(modeOption.textContent).toContain("MODE");
  });

  test("should display RULE option in selector-3.html", () => {
    const window = loadHtmlAndInjectScript(selector3Html);
    const ruleOption = window.document.querySelector("#composer-mode-f6bb1fc74f6464834ac6a238fdccc135853df3e984cc74c6ba49e5cab1fa09387unifieddropdown-6455f10d-a2ca-4972-81bd-b2adf1748aed .monaco-highlighted-label");
    expect(ruleOption).toBeTruthy();
    expect(ruleOption.textContent).toContain("RULE");
  });

  test("should display MIGRATION option in selector-3.html", () => {
    const window = loadHtmlAndInjectScript(selector3Html);
    const migrationOption = window.document.querySelector("#composer-mode-f6bb1fc74f6464834ac6a238fdccc135853df3e984cc74c6ba49e5cab1fa09387unifieddropdown-fac9f5b1-80ab-4fbb-a70b-abbecc4d80cf .monaco-highlighted-label");
    expect(migrationOption).toBeTruthy();
    expect(migrationOption.textContent).toContain("MIGRATION");
  });

  // Tests for html/model.html
  test("should display gemini-2.5-flash model dropdown in model.html", () => {
    const window = loadHtmlAndInjectScript(modelHtml);
    const modelDropdown = window.document.querySelector("#f6bb1fc74f6464834ac6a238fdccc1358084ef5c09fc64358a25cc35f6bb459f5unifiedmodeldropdown .truncate-x");
    expect(modelDropdown).toBeTruthy();
    expect(modelDropdown.textContent).toContain("gemini-2.5-flash");
  });

  // Tests for html/agent.html
  test("should display Agent dropdown in agent.html", () => {
    const window = loadHtmlAndInjectScript(agentHtml);
    const agentDropdown = window.document.querySelector("#f6bb1fc74f6464834ac6a238fdccc13589bbf451657ce4e06849fdd4515695a7cunifieddropdown .truncate-x");
    expect(agentDropdown).toBeTruthy();
    expect(agentDropdown.textContent).toContain("Agent");
  });

  // Tests for html/input-field.html
  test("should display Add Context pill in input-field.html", () => {
    const window = loadHtmlAndInjectScript(inputFieldHtml);
    const addContextPill = window.document.querySelector("#add-file-pill-undefined-30d7e208-78d8-425c-87e6-d2d08940846b");
    expect(addContextPill).toBeTruthy();
    expect(addContextPill.textContent.replace(/\s+/g, ' ').trim()).toContain("Add Context");
  });

  test("should display input placeholder 'Plan, search, build anything' in input-field.html", () => {
    const window = loadHtmlAndInjectScript(inputFieldHtml);
    const inputPlaceholder = window.document.querySelector(".aislash-editor-placeholder");
    expect(inputPlaceholder).toBeTruthy();
    expect(inputPlaceholder.textContent).toContain("Plan, search, build anything");
  });

  test("should display Agent dropdown in input-field.html", () => {
    const window = loadHtmlAndInjectScript(inputFieldHtml);
    const agentDropdown = window.document.querySelector("#f19f3d5cc18a94c9fa348fc1d996ea1e14b43e23462e34da7b13f3409c93bd80funifieddropdown .truncate-x");
    expect(agentDropdown).toBeTruthy();
    expect(agentDropdown.textContent).toContain("Agent");
  });

  test("should display gemini-2.5-flash model dropdown in input-field.html", () => {
    const window = loadHtmlAndInjectScript(inputFieldHtml);
    const modelDropdown = window.document.querySelector("#f19f3d5cc18a94c9fa348fc1d996ea1e10bce96b5af7347b68a7e11fb1680b4f8unifiedmodeldropdown .truncate-x");
    expect(modelDropdown).toBeTruthy();
    expect(modelDropdown.textContent).toContain("gemini-2.5-flash");
  });

  // Tests for html/indicator.html
  test("should display warning indicator in indicator.html", () => {
    const window = loadHtmlAndInjectScript(indicatorHtml);
    const warningIndicator = window.document.querySelector(".codicon-warning");
    expect(warningIndicator).toBeTruthy();
  });

  test("should display 'Note: By default, we stop the agent after 25 tool calls.' message in indicator.html", () => {
    const window = loadHtmlAndInjectScript(indicatorHtml);
    // Target the span that wraps the markdown content
    const noteMessageContainer = window.document.querySelector("span.anysphere-markdown-container-root");
    expect(noteMessageContainer).toBeTruthy();
    // Get all text content and normalize whitespace
    const cleanedText = noteMessageContainer.textContent.replace(/\s+/g, ' ').trim();
    expect(cleanedText).toContain("Note: By default, we stop the agent after 25 tool calls. You can resume the conversation.");
  });

  test("should display 'resume the conversation' link in indicator.html", () => {
    const window = loadHtmlAndInjectScript(indicatorHtml);
    const resumeLink = window.document.querySelector(".markdown-link[data-link='command:composer.resumeCurrentChat']");
    expect(resumeLink).toBeTruthy();
    // Normalize whitespace and expect exact match
    expect(resumeLink.textContent.replace(/\s+/g, ' ').trim()).toEqual("resume the conversation");
  });

  // Add more tests here for other HTML files and interactions
});