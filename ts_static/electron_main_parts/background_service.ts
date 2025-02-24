// For class-transformer
import 'reflect-metadata';
import { IWebSocketCommand } from '../../src/shared/interfaces/datatransfer/IWebSocketCommand';
import { log } from './logging';
import { getRenderWindow } from './windows';

const { ipcMain } = require('electron')
const { spawn } = require('child_process')
const WebSocket = require("ws");

export const BACKGROUND_SERVICE_PATH = 'gw2data\\WebSocketServerNetFramework.exe';
const WS_CLIENT = "ws://localhost:19939/control";

let webSocket = null;

//Start external program to get position from GW2
let bat = null;
let bat_prefix = "";
const TD = new TextDecoder("utf-8");

export function SetupBackgroundService() {
    bat = spawn(bat_prefix + BACKGROUND_SERVICE_PATH);

    bat.stdout.on("data", (data) => {
        if (webSocket == null) {
            setupWebSocket();
        }
        var text = TD.decode(data);
        log("PositionServer", text)
    });
    bat.on("close", () => {
        log("PositionServer", "Program closed");
    });
}

ipcMain.on('fallback_positionupdate', (event) => {
    log("Main", "Fallback position activating");
    if (bat)
        bat.kill();

    bat = spawn(bat_prefix + "gw2data\\fallback\\TacoCli.exe");

    bat.stdout.on("data", (data) => {
        try {
            var json = TD.decode(data);
            var decoded = JSON.parse(json);
            if (!decoded?.coordinates) { return; }
            // Send new position data to render window
            getRenderWindow()?.webContents.send("gw2data", decoded);
        } catch {
            return;
        }
    });
});


ipcMain.on("sendkeys", (event, arg) => {
    let msg: IWebSocketCommand = {
        Data: arg,
        Type: "keys",
    }
    if (webSocket) {
        webSocket.send(JSON.stringify(msg));
    }
})

function setupWebSocket() {
    webSocket = new WebSocket(WS_CLIENT);

    webSocket.onopen = function (event) {
        log("Main", "Connected to web socket");
    }

    webSocket.onclose = function (event) {
        log("Main", "Disconnected from web socket");
    }

    webSocket.onerror = function (event) {
        log("Main", "Error on web socket");
    }

    webSocket.onmessage = function (event) {
        let msg: IWebSocketCommand = JSON.parse(event.data);
        log("Main", "Got ws message: " + event.data);
        if (msg.Type == "gamerunning") {
            setGameState(msg.Data == "True");
        }
    }
}

function setGameState(state: boolean) {
    log("Main", "Game running: " + state);
}