class Timer {
    constructor() {
        this.seconds = 0;
        this.intervalId = null;
        this.isRunning = false;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.intervalId = setInterval(() => {
            this.seconds++;
            this.onTick?.(this.seconds);
        }, 1000);
    }

    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;
        clearInterval(this.intervalId);
    }

    reset() {
        this.stop();
        this.seconds = 0;
        this.onTick?.(this.seconds);
    }

    getTime() {
        return this.seconds;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}