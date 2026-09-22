const CACHE_NAME = "organizador-escolar-v3";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
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

                    return null;

                })
            );

        })
    );

    self.clients.claim();
});


self.addEventListener("fetch", function (evento) {

    if (evento.request.method !== "GET") {
        return;
    }

    evento.respondWith(

        fetch(evento.request)
            .then(function (respuesta) {

                if (respuesta && respuesta.status === 200) {

                    const copia = respuesta.clone();

                    caches.open(CACHE_NAME)
                        .then(function (cache) {
                            cache.put(evento.request, copia);
                        });
                }

                return respuesta;

            })
            .catch(function () {

                return caches.match(evento.request);

            })

    );

});
