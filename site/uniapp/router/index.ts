import type { Router } from 'vue-router'

let router: Router;

export function initRouter(rou: Router) {
    console.log(rou)
    router = rou
}


export function getRoter() {
    return router
}
