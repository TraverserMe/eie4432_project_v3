class AutoLogout {
    constructor() {
        this.events = ['load', 'mousemove', 'mousedown',
            'click', 'scroll', 'keypress'];

        this.warn = this.warn.bind(this);
        this.logout = this.logout.bind(this);
        this.resetTimeout = this.resetTimeout.bind(this);

        this.events.forEach((event) => {
            window.addEventListener(event, this.resetTimeout);
        });

        this.setTimeout();
    }

    clearTimeout() {
        if (this.warnTimeout)
            clearTimeout(this.warnTimeout);

        if (this.logoutTimeout)
            clearTimeout(this.logoutTimeout);
    }

    setTimeout() {
        this.warnTimeout = setTimeout(this.warn, 14 * 10 * 1000);

        // this.logoutTimeout = setTimeout(this.logout, 1 * 10 * 1000);
    }

    resetTimeout() {
        clearTimeout(this.alertTimeout);
        this.setTimeout();
        const warningWordElement = document.getElementById('warning-word');
        if (warningWordElement) {
            warningWordElement.remove();
        }
    }

    warn() {
        const warningWordElement = document.getElementById('warning-word');
        if (!warningWordElement) {
            const warningWord = document.createElement('div');
            warningWord.textContent = 'User idle, you will be logged out automatically in 1 minute.';
            warningWord.style.position = 'fixed';
            warningWord.style.top = '50%';
            warningWord.style.left = '50%';
            warningWord.style.transform = 'translate(-50%, -50%)';
            warningWord.style.padding = '10px';
            warningWord.style.background = 'lightgrey';
            warningWord.style.color = 'white';
            warningWord.style.border = '1px solid white';
            warningWord.style.zIndex = '9999';
            warningWord.setAttribute('id', 'warning-word');
            document.body.appendChild(warningWord);
        }

        this.alertTimeout = setTimeout(() => {
            const warningWordElement = document.getElementById('warning-word');
            if (warningWordElement) {
                warningWordElement.remove();
            }
            this.logout();
        }, 60 * 1000);
    }

    logout() {
        // Send a logout request to the API
        console.log('Sending a logout request to the API...');
        $('#logout-btn').click();
        this.destroy();  // Cleanup
    }

    destroy() {
        this.clearTimeout();

        this.events.forEach((event) => {
            window.removeEventListener(event, this.resetTimeout);
        });
    }
}