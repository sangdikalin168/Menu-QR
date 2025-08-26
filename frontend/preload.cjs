const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('electronAPI', {
    printReceipt: (html, copies) => ipcRenderer.send('print-receipt', html, copies),
});

