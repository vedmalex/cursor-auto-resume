# Installation Guide for Cursor Auto Resume

This guide provides step-by-step instructions for setting up the Cursor Auto Resume tool.

## Installation Steps

1. Open Cursor IDE
2. Click "Help" in the menu bar
3. Select "Toggle Developer Tools"
4. Click the "Console" tab at the top
5. Copy the entire code from [cursor-auto-resume.js](cursor-auto-resume.js)
6. Paste it into the console
7. Press Enter to run it
8. Close DevTools by clicking the X in the corner (optional)
9. A small button will appear in the bottom-right corner showing the tool is active

## Troubleshooting

### Nothing happens when I run the script
- Check if there are any errors in the Console tab
- Make sure you're running it in Cursor IDE, not another window
- Try refreshing Cursor and running the script again

### The indicator appears but doesn't click the "resume" link
- The script looks for specific text patterns. If Cursor changes these patterns, the script may need updating
- Check if the rate limit message contains "stop the agent after 25 tool calls" or similar text

### The indicator disappears after a while
- The indicator is attached to the current page. If Cursor refreshes or navigates, you'll need to run the script again

## Uninstalling

Close and reopen Cursor IDE.

## Next Steps

For more advanced usage and customization options, check the [README.md](README.md) file. 