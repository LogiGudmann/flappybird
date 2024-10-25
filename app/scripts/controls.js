export class Controls {
    constructor() {
        this._didJump = false;
        this.keys = {};
        this.KEYS = {
            0: 'click',
            32: 'space',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        window.addEventListener('keydown', this._onKeyDown.bind(this));
        window.addEventListener('keyup', this._onKeyUp.bind(this));
        window.addEventListener('mousedown', this._onMouseDown.bind(this));
        window.addEventListener('mouseup', this._onMouseUp.bind(this));
        // Add touch events
        window.addEventListener('touchstart', this._onMouseDown.bind(this));
        window.addEventListener('touchend', this._onMouseUp.bind(this));
    }

    _onMouseDown() {
        this.keys.click = true;
    }

    _onMouseUp() {
        this.keys.click = false;
    }

    _onKeyDown(e) {
        // Only jump if space wasn't pressed.
        if (e.keyCode === 32 && this.keys.space) {
            this._didJump = true;
        }

        // Remember that this button is down.
        if (e.keyCode in this.KEYS) {
            const keyName = this.KEYS[e.keyCode];
            this.keys[keyName] = true;
            return false;
        }
    }

    _onKeyUp(e) {
        if (e.keyCode in this.KEYS) {
            const keyName = this.KEYS[e.keyCode];
            this.keys[keyName] = false;
            return false;
        }
    }

    /**
     * Only answers true once until a key is pressed again.
     */
    didJump() {
        const answer = this._didJump;
        this._didJump = false;
        return answer;
    }
}

// Export singleton.
export const controls = new Controls();
