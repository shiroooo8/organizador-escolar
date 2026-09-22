const CACHE_NAME = "organizador-escolar-v1";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json"
];

self.addEventListener("install", function (evento) {

    evento.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(ARCHIVOS);
            })
    );

    self.skipWaiting();
});


self.addEventListener("activate", function (evento) {

    evento.waitUntil(
        caches.keys().then(function (nombres) {

            return Promise.all(
                nombres.map(function (nombre) {

                    if (nombre !== CACHE_NAME) {
                        return caches.delete(nombre);
                    }

                })
            );

        })
    );

    self.clients.claim();
});


self.addEventListener("fetch", function (evento) {

    evento.respondWith(

        caches.match(evento.request)
            .then(function (respuesta) {

                if (respuesta) {
                    return respuesta;
                }

                return fetch(evento.request);

            })

    );

});