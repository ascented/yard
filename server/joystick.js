import { default as SerialPort } from 'serialport';
import { default as Readline } from '@serialport/parser-readline';


class Joystick {
    constructor(VRx, VRy, switchMode) {
        this.moveListeners = [];
        this.switchListeners = {
            switch: [],
            click: [],
            release: []
        };
        this.VRx = VRx || 0;
        this.VRy = VRy || 0;
        this.switchMode = switchMode || 0;
    }

    on(eventType, callback) {
        switch(eventType) {
            case 'move':
                this.moveListeners.push(callback);
                break;
            case 'switch':
                this.switchListeners.switch.push(callback);
                break;
            case 'click':
                this.switchListeners.click.push(callback);
                break;
            case 'release':
                this.switchListeners.release.push(callback);
                break;
        }
    }

    _move(VRx, VRy) {
        this.moveListeners.forEach(listener => listener({
            previousX: this.VRx,
            previousY: this.VRy,
            currentX: VRx,
            currentY: VRy,
            offsetX: VRx - this.VRx,
            offsetY: VRy - this.VRy,
            vectorX: VRxDefault - VRx,
            vectorY: VRyDefault - VRy,
            normalizedVectorX: (VRxDefault - VRx) / VRxDefault,
            normalizedVectorY: (VRyDefault - VRy) / VRyDefault
        }));
        this.VRx = VRx;
        this.VRy = VRy;
    }

    _switch(switchMode) {
        this.switchListeners.switch.forEach(listener => listener(switchMode));
        if (switchMode) {
            this.switchListeners.click.forEach(listener => listener());
        } else {
            this.switchListeners.release.forEach(listener => listener());
        }
    }
}


const portName = 'COM6';
const baudRate = 9600;

const VRmin = 0;
const VRmax = 1024;
/**
 * These values are used to account bad centring on the joystick.
 */
const VRxDefault = 507;
const VRyDefault = 497;

let VRx = VRxDefault;
let VRy = VRyDefault;
let switchMode = 0;

export const joystick = new Joystick(VRx, VRy, switchMode);

const port = new SerialPort(portName, { baudRate });
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));


port.open(() => console.log('Listening.'));

parser.on('data', buffer => {
    let prevVRx = VRx;
    let prevVRy = VRy;
    let prevSwitchMode = switchMode;
    let data = buffer.toString();
    if (data.startsWith('vrx')) {
        VRx = parseInt(data.slice(3));
    }
    if (data.startsWith('vry')) {
        VRy = parseInt(data.slice(3));
    }
    if (data.startsWith('sw')) {
        switchMode = +!parseInt(data.slice(2)); // inverting for better experience
    }
    if (prevVRx !== VRx || prevVRy !== VRy) {
        joystick._move(VRx, VRy);
    }
    if (prevSwitchMode !== switchMode) {
        joystick._switch(switchMode);
    }
});