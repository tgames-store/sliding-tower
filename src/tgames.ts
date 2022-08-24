export class TGames {
    listener = new EventTarget()
    #freezeGame() {
        this.listener.dispatchEvent(new Event("freeze"))
    }
    #unfreezeGame() {
        this.listener.dispatchEvent(new Event("unfreeze"))
    }
    #sendEvent (name: any, data = {}) {
        let message = {type: name, info: data}
        window.top.postMessage(message, "*")
    }
    #addEventListener (name: string, handler: EventListenerOrEventListenerObject, useOnce = false) {
        this.listener.addEventListener(name, handler, useOnce)
    }
    async eventHandler (e: { origin: string; data: { type: string; info: any } }) {
        if (e.origin != "https://tgames.store") return;
        this.listener.dispatchEvent(new CustomEvent(e.data.type, {detail: e.data.info}))
    }
    async setScore (score: any) {
        this.#sendEvent("newScore", {score: score})
    }
    async gameStarted () {
        this.#sendEvent("gameStarted")
    }
    async gamePaused () {
        this.#sendEvent("gamePaused")
    }
    async gameResumed () {
        this.#sendEvent("gameResumed")
    }
    async gameOver (score: any) {
        this.#sendEvent("gameOver", {score: score})
    }
    async showAd () {
        this.#sendEvent("showAd")
    }
    async showRewardedAd (type="default") {
        this.#freezeGame()
        this.#sendEvent("showRewardedAd", { adType: type })
        return new Promise<void>((resolve, reject) => {
            this.#addEventListener("rewardedAd", (info: any) => {
                this.#unfreezeGame()
                if (info.detail.success) resolve()
                reject()
            }, true)
        })
    }
    async continueGameAd () {
        this.gameResumed()
        return this.showRewardedAd("continue")
    }
    async share () {
        this.#sendEvent("share")
    }
}

export const tgames = new TGames();
window.addEventListener('message', tgames.eventHandler.bind(tgames), false)