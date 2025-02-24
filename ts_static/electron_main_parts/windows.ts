import { configUpdated, GetSettings } from "./settings";

const { BrowserWindow, ipcMain } = require('electron')

let rendererWindow = null;
let configButton = null;
let openWindows: { [path: string]: typeof BrowserWindow } = {};

ipcMain.on("debugrenderer", (event, arg) => {
    //renderer.setIgnoreMouseEvents(false);
    rendererWindow.webContents.openDevTools({ mode: 'detach' });
});

ipcMain.on("debug-window", (event, arg: string) => {
    //renderer.setIgnoreMouseEvents(false);
    openWindows[arg]?.webContents.openDevTools({ mode: 'detach' });
});


ipcMain.on("reloadRender", (event, arg) => {
    rendererWindow.setIgnoreMouseEvents(true);
    rendererWindow.reload();
});

ipcMain.on("cleanup-done", (event, arg) => {
    rendererWindow.reload();
});

export function createRenderWindow(): typeof BrowserWindow {
    if (rendererWindow != null) {
        rendererWindow.close();
    }
    // Create the browser window.
    const win: typeof BrowserWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        frame: false,
        transparent: true,
        fullscreen: true,
        resizable: false,
    })

    win.setAlwaysOnTop(true, "screen-saver");
    win.setIgnoreMouseEvents(true, { forward: true });

    win.loadFile('build/renderer.html')

    rendererWindow = win;
    configUpdated();
    return win;
}

ipcMain.on("resize", (event, arg) => {
    configButton?.setSize(arg.w, arg.h);
})


export function createConfigButtonWindow() {
    // Create the browser window.
    const cwin = new BrowserWindow({
        width: 200,
        height: 500,
        x: 350,
        y: 0,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        frame: false,
        transparent: true,
        maximizable: false,
        fullscreenable: false,
        parent: rendererWindow,
    })

    cwin.setAlwaysOnTop(true, "screen-saver");
    cwin.loadFile('build/config_button.html')
    configButton = cwin;
    return cwin;
}

function createWindow(parent, path: string) {
    // Create the browser window.
    const cwin = new BrowserWindow({
        width: 600,
        height: 400,
        minWidth: 100,
        minHeight: 80,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        frame: false,
        transparent: true,
        parent: parent,
    })

    cwin.setAlwaysOnTop(true, "screen-saver");
    cwin.loadFile('build/index.html', { hash: "/" + path });

    cwin.webContents.send("setsettings", GetSettings());
    
    return cwin;
}

export function getRenderWindow() {
    return rendererWindow;
}
export function getConfigButtonWindow() {
    return configButton;
}

export function getWindow(path: string) {
    return openWindows[path];
}

export function getWindows() {
    return openWindows;
}

ipcMain.on("show-page", (event, arg: { show: boolean, path: string }) => {
    if (arg.show) {
        if (!openWindows[arg.path]) {
            openWindows[arg.path] = createWindow(rendererWindow, arg.path);
        }
    } else {
        if (openWindows[arg.path]) {
            openWindows[arg.path].close();
            openWindows[arg.path] = null;
        }
    }
});