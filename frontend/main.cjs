const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
require('dotenv').config(); // Loads .env by default

let ENV = process.env.NODE_ENV || 'development';

// Manually load correct .env file if exists
const envPath = path.resolve(__dirname, `.env.${ENV}`);
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

const APP_URL = process.env.APP_URL || 'http://localhost:5173';

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    frame: true,
    autoHideMenuBar: true, // ✅ Hide menu bar
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.cjs')
    },
  });

  console.log('Using preload from:', path.join(__dirname, 'preload.cjs'));

  const appURL = process.env.APP_URL || (process.env.NODE_ENV === 'development'
    ? 'http://localhost:5173'
    : 'http://203.176.133.252:5173'
  );

  console.log(`🚀 Loading URL: ${appURL}`);
  mainWindow.loadURL(appURL);

  mainWindow.maximize(); // Maximize after creation
}

app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});


// ✅ Print Static HTML via hidden window
ipcMain.on('print-receipt', (event, html, copies) => {
  console.log('🖨️ Printing receipt with copies:', copies);
  const printWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      sandbox: false,
    },
  });

  printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);

  printWindow.webContents.on('did-finish-load', () => {
    setTimeout(() => {
      printWindow.webContents.print({
        copies: copies,
        silent: true,
        printBackground: true,
        margin: {
          marginType: 'none',
        },
        landscape: false,
        pagesPerSheet: 1,
        collate: false,
      }, (success, errorType) => {
        if (!success) {
          console.error('❌ Print failed:', errorType);
        }
        printWindow.close();
      });
    }, 1000); // wait a bit for render (e.g. images)
  });
});



