// ========================================
// ORGANIZADOR ESCOLAR
// SCRIPT PRINCIPAL
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // ELEMENTOS DEL HTML
    // ========================================

    const horarioDia =
        document.getElementById("horario-dia");

    const botonesDia =
        document.querySelectorAll(".dia");
        let diaSeleccionado = "lunes";

    const botonAgregarClase =
        document.getElementById("agregarClase");

    const ventanaClase =
        document.getElementById("ventanaClase");

    const cerrarVentanaClase =
        document.getElementById("cerrarVentanaClase");

    const guardarClase =
        document.getElementById("guardarClase");

    const nombreClase =
        document.getElementById("nombreClase");

    const horaClase =
        document.getElementById("horaClase");

    const diaClase =
        document.getElementById("diaClase");


    const botonAgregarActividad =
        document.getElementById("agregarActividad");

    const ventanaActividad =
        document.getElementById("ventanaActividad");

    const cerrarVentanaActividad =
        document.getElementById(
            "cerrarVentanaActividad"
        );

    const guardarActividad =
        document.getElementById(
            "guardarActividad"
        );

    const nombreActividad =
        document.getElementById(
            "nombreActividad"
        );

    const tipoActividad =
        document.getElementById(
            "tipoActividad"
        );

    const fechaActividad =
        document.getElementById(
            "fechaActividad"
        );

    const horaActividad =
        document.getElementById(
            "horaActividad"
        );


    const listaActividades =
        document.getElementById(
            "lista-actividades"
        );


    const fechaHoraElemento =
        document.getElementById(
            "fecha-hora"
        );


    const proximaClaseElemento =
        document.getElementById(
            "proxima-clase"
        );


    const proximoRecordatorio =
        document.getElementById(
            "proximo-recordatorio"
        );


    const resumenDiaElemento =
        document.getElementById(
            "resumen-dia"
        );


    const botonNotificaciones =
        document.getElementById(
            "activarNotificaciones"
        );

const botonNotificacionesAjustes =
    document.getElementById(
        "ajustesNotificaciones"
    );
    const formatoHoraElemento =
    document.getElementById(
        "formatoHora"
    );

    // ========================================
    // VARIABLES
    // ========================================

    let indiceClaseEditando = null;
    let diaClaseEditando = null;

    let indiceActividadEditando = null;


    // ========================================
    // HORARIO
    // ========================================

    const horarioPorDefecto = {

        lunes: [
            {
                hora: "7:00",
                materia: "Matemáticas"
            },
            {
                hora: "8:00",
                materia: "Inglés"
            }
        ],

        martes: [
            {
                hora: "7:00",
                materia: "Español"
            },
            {
                hora: "9:00",
                materia: "Historia"
            }
        ],

        miercoles: [
            {
                hora: "8:00",
                materia: "Biología"
            }
        ],

        jueves: [
            {
                hora: "7:00",
                materia: "Física"
            },
            {
                hora: "10:00",
                materia: "Inglés"
            }
        ],

        viernes: [
            {
                hora: "7:00",
                materia: "Matemáticas"
            }
        ]

    };


    let horariosGuardados =
        localStorage.getItem("horarios");


    let horarios;


    if (horariosGuardados) {

        try {

            horarios =
                JSON.parse(horariosGuardados);

        } catch (error) {

            horarios =
                horarioPorDefecto;

        }

    } else {

        horarios =
            horarioPorDefecto;

    }


    // Asegurar que existan todos los días

    const dias = [
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes"
    ];


    dias.forEach(function (dia) {

        if (!Array.isArray(horarios[dia])) {

            horarios[dia] = [];

        }

    });


    // ========================================
    // MOSTRAR HORARIO
    // ========================================

    function mostrarHorario(dia) {

        horarioDia.innerHTML = "";


        const clases =
            horarios[dia] || [];


        if (clases.length === 0) {

    horarioDia.innerHTML = `

        <div class="estado-vacio">

            <span class="estado-icono">
                📚
            </span>

            <strong>Día libre</strong>

            <span>
                No tienes clases registradas
                para este día.
            </span>

        </div>

    `;

    return;

}


        clases.sort(function (a, b) {

            return convertirHoraAMinutos(a.hora) -
                   convertirHoraAMinutos(b.hora);

        });


        clases.forEach(function (clase) {

            const elemento =
                document.createElement("div");


            elemento.className =
                "clase";


            elemento.innerHTML = `

                <div class="hora">
                    ${formatearHora(clase.hora)}
                </div>

                <div class="info-clase">

                    <h3>
                        ${clase.materia}
                    </h3>

                </div>

                <div class="acciones-clase">

                    <button
                        class="editar-clase"
                        type="button"
                    >
                        ✏️
                    </button>

                    <button
                        class="eliminar-clase"
                        type="button"
                    >
                        🗑️
                    </button>

                </div>

            `;


            // EDITAR

            const botonEditar =
                elemento.querySelector(
                    ".editar-clase"
                );


            botonEditar.addEventListener(
                "click",
                function () {

                    const indice =
                        horarios[dia].indexOf(
                            clase
                        );


                    indiceClaseEditando =
                        indice;

                    diaClaseEditando =
                        dia;


                    nombreClase.value =
                        clase.materia;

                    horaClase.value =
                        convertirHoraAInput(
                            clase.hora
                        );

                    diaClase.value =
                        dia;


                    ventanaClase.style.display =
                        "flex";

                }
            );


            // ELIMINAR

            const botonEliminar =
                elemento.querySelector(
                    ".eliminar-clase"
                );


            botonEliminar.addEventListener(
                "click",
                function () {

                    const confirmar =
                        confirm(
                            "¿Quieres eliminar esta clase?"
                        );


                    if (!confirmar) {
                        return;
                    }


                    const indice =
                        horarios[dia].indexOf(
                            clase
                        );


                    horarios[dia].splice(
                        indice,
                        1
                    );


                    guardarHorarios();


                    mostrarHorario(dia);

                    actualizarTodo();

                }
            );


            horarioDia.appendChild(
                elemento
            );

        });

    }


    // ========================================
    // CAMBIAR DÍA
    // ========================================

botonesDia.forEach(function (boton) {
    boton.addEventListener("click", function () {

        botonesDia.forEach(function (otroBoton) {
            otroBoton.classList.remove("activo");
        });

        boton.classList.add("activo");

        diaSeleccionado = boton.dataset.dia;

        mostrarHorario(diaSeleccionado);
    });
});


    // ========================================
    // AGREGAR CLASE
    // ========================================

    botonAgregarClase.addEventListener(
        "click",
        function () {

            indiceClaseEditando =
                null;

            diaClaseEditando =
                null;

            nombreClase.value = "";

            horaClase.value = "";

            ventanaClase.style.display =
                "flex";

        }
    );


    // ========================================
    // CERRAR VENTANA CLASE
    // ========================================

    cerrarVentanaClase.addEventListener(
        "click",
        function () {

            ventanaClase.style.display =
                "none";

        }
    );


    // ========================================
    // GUARDAR CLASE
    // ========================================

    guardarClase.addEventListener(
        "click",
        function () {

            const materia =
                nombreClase.value.trim();

            const hora =
                horaClase.value;

            const dia =
                diaClase.value;
                diaSeleccionado = dia;


            if (
                materia === "" ||
                hora === ""
            ) {

                alert(
                    "Completa todos los campos 📚"
                );

                return;

            }


            const nuevaClase = {

                hora: hora,

                materia: materia

            };


            // NUEVA CLASE

            if (
                indiceClaseEditando === null
            ) {

                horarios[dia].push(
                    nuevaClase
                );

            }


            // EDITAR CLASE

            else {

                horarios[
                    diaClaseEditando
                ].splice(
                    indiceClaseEditando,
                    1
                );


                horarios[dia].push(
                    nuevaClase
                );


                indiceClaseEditando =
                    null;

                diaClaseEditando =
                    null;

            }


            guardarHorarios();


            ventanaClase.style.display =
                "none";


            nombreClase.value = "";

            horaClase.value = "";


            // Activar día seleccionado

            botonesDia.forEach(
                function (boton) {

                    boton.classList.remove(
                        "activo"
                    );


                    if (
                        boton.dataset.dia ===
                        dia
                    ) {

                        boton.classList.add(
                            "activo"
                        );

                    }

                }
            );


            mostrarHorario(dia);

            actualizarTodo();

        }
    );


    // ========================================
    // GUARDAR HORARIOS
    // ========================================

    function guardarHorarios() {

        localStorage.setItem(
            "horarios",
            JSON.stringify(horarios)
        );

    }


    // ========================================
    // ACTIVIDADES
    // ========================================

    function obtenerActividades() {

        return (
            JSON.parse(
                localStorage.getItem(
                    "actividades"
                )
            ) || []
        );

    }

// ========================================
// MOSTRAR ACTIVIDADES
// ========================================

function mostrarActividades() {

    const actividades =
        obtenerActividades();


    listaActividades.innerHTML =
        "";


    /*
     * Guardamos el índice original de cada actividad.
     * Esto permite editar, completar y eliminar
     * aunque las actividades se ordenen por fecha.
     */

    const actividadesPendientes =
        actividades
            .map(function (actividad, indice) {

                return {
                    actividad: actividad,
                    indiceOriginal: indice
                };

            })
            .filter(function (item) {

                return !item.actividad.completada;

            });


    /*
     * No hay actividades pendientes
     */

    if (
        actividadesPendientes.length === 0
    ) {

        listaActividades.innerHTML = `

            <div class="estado-vacio">

                <span class="estado-icono">
                    📝
                </span>

                <strong>
                    No hay actividades pendientes
                </strong>

                <span>
                    Aquí aparecerán tus tareas,
                    exámenes y demás actividades.
                </span>

            </div>

        `;

        return;

    }


    /*
     * Ordenar por fecha y hora
     */

    actividadesPendientes.sort(
        function (a, b) {

            return (
                new Date(
                    a.actividad.fecha +
                    "T" +
                    a.actividad.hora
                ) -
                new Date(
                    b.actividad.fecha +
                    "T" +
                    b.actividad.hora
                )
            );

        }
    );


    /*
     * Crear cada actividad
     */

    actividadesPendientes.forEach(
        function (item) {

            const actividad =
                item.actividad;


            const indiceOriginal =
                item.indiceOriginal;


            const tarjeta =
                document.createElement(
                    "div"
                );


            tarjeta.className =
                "tarjeta";


            const fecha =
                new Date(
                    actividad.fecha +
                    "T00:00:00"
                ).toLocaleDateString(
                    "es-ES",
                    {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                );


            tarjeta.innerHTML = `

                <h3>
                    📝 ${actividad.nombre}
                </h3>

                <p>
                    📌 ${actividad.tipo}
                </p>

                <p>
                    📅 ${fecha}
                </p>

                <p>
                    ⏰ ${formatearHora(
                        actividad.hora
                    )}
                </p>

                <button
                    class="completar-actividad"
                    type="button"
                >
                    ✅ Completar
                </button>

                <button
                    class="editar-actividad"
                    type="button"
                >
                    ✏️ Editar
                </button>

                <button
                    class="eliminar-actividad"
                    type="button"
                >
                    🗑️ Eliminar
                </button>

            `;


            // ========================================
            // COMPLETAR
            // ========================================

            const botonCompletar =
                tarjeta.querySelector(
                    ".completar-actividad"
                );


            botonCompletar.addEventListener(
                "click",
                function () {

                    const actividadesActualizadas =
                        obtenerActividades();


                    /*
                     * Usamos el índice original.
                     */

                    if (
                        actividadesActualizadas[
                            indiceOriginal
                        ]
                    ) {

                        actividadesActualizadas[
                            indiceOriginal
                        ].completada = true;


                        localStorage.setItem(
                            "actividades",
                            JSON.stringify(
                                actividadesActualizadas
                            )
                        );


                        /*
                         * La actividad desaparece
                         * automáticamente de la lista.
                         */

                        mostrarActividades();

                        mostrarProximoRecordatorio();

                        mostrarResumenDia();

                    }

                }
            );


            // ========================================
            // EDITAR
            // ========================================

            const botonEditar =
                tarjeta.querySelector(
                    ".editar-actividad"
                );


            botonEditar.addEventListener(
                "click",
                function () {

                    /*
                     * Guardamos el índice real
                     * de la actividad en localStorage.
                     */

                    indiceActividadEditando =
                        indiceOriginal;


                    nombreActividad.value =
                        actividad.nombre;


                    tipoActividad.value =
                        actividad.tipo;


                    fechaActividad.value =
                        actividad.fecha;


                    horaActividad.value =
                        actividad.hora;


                    ventanaActividad.style.display =
                        "flex";

                }
            );


            // ========================================
            // ELIMINAR
            // ========================================

            const botonEliminar =
                tarjeta.querySelector(
                    ".eliminar-actividad"
                );


            botonEliminar.addEventListener(
                "click",
                function () {

                    const confirmar =
                        confirm(
                            "¿Quieres eliminar esta actividad?"
                        );


                    if (!confirmar) {

                        return;

                    }


                    const actividadesActualizadas =
                        obtenerActividades();


                    /*
                     * Eliminar usando el índice
                     * original de localStorage.
                     */

                    if (
                        actividadesActualizadas[
                            indiceOriginal
                        ]
                    ) {

                        actividadesActualizadas.splice(
                            indiceOriginal,
                            1
                        );


                        localStorage.setItem(
                            "actividades",
                            JSON.stringify(
                                actividadesActualizadas
                            )
                        );


                        mostrarActividades();

                        mostrarProximoRecordatorio();

                        mostrarResumenDia();

                    }

                }
            );


            listaActividades.appendChild(
                tarjeta
            );

        }
    );

}

    // ========================================
    // ABRIR ACTIVIDADES
    // ========================================

    botonAgregarActividad.addEventListener(
        "click",
        function () {

            indiceActividadEditando =
                null;

            nombreActividad.value = "";

            tipoActividad.value =
                "Tarea";

            fechaActividad.value = "";

            horaActividad.value = "";


            ventanaActividad.style.display =
                "flex";

        }
    );


    // ========================================
    // CERRAR ACTIVIDADES
    // ========================================

    cerrarVentanaActividad.addEventListener(
        "click",
        function () {

            ventanaActividad.style.display =
                "none";

        }
    );


    // ========================================
    // GUARDAR ACTIVIDAD
    // ========================================

    guardarActividad.addEventListener(
        "click",
        function () {

            const nombre =
                nombreActividad.value.trim();

            const tipo =
                tipoActividad.value;

            const fecha =
                fechaActividad.value;

            const hora =
                horaActividad.value;


            if (
                nombre === "" ||
                fecha === "" ||
                hora === ""
            ) {

                alert(
                    "Completa los campos principales 📝"
                );

                return;

            }


            const actividad = {

                nombre: nombre,

                tipo: tipo,

                fecha: fecha,

                hora: hora,

                completada: false

            };


            const actividades =
                obtenerActividades();


            // NUEVA

            if (
                indiceActividadEditando ===
                null
            ) {

                actividades.push(
                    actividad
                );

            }


            // EDITAR

            else {

                const actividadAnterior =
                    actividades[
                        indiceActividadEditando
                    ];


                actividad.completada =
                    actividadAnterior
                        .completada || false;


                actividades[
                    indiceActividadEditando
                ] = actividad;


                indiceActividadEditando =
                    null;

            }


            localStorage.setItem(
                "actividades",
                JSON.stringify(
                    actividades
                )
            );


            ventanaActividad.style.display =
                "none";


            nombreActividad.value = "";

            fechaActividad.value = "";

            horaActividad.value = "";


            mostrarActividades();

            mostrarProximoRecordatorio();

            mostrarResumenDia();

        }
    );


    // ========================================
    // FECHA Y HORA
    // ========================================

    function mostrarFechaHora() {

        const ahora =
            new Date();


        const fecha =
            ahora.toLocaleDateString(
                "es-ES",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );


        const hora =
            ahora.toLocaleTimeString(
                "es-ES",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            );


        fechaHoraElemento.textContent =
            "📅 " +
            fecha +
            " · 🕐 " +
            hora;

    }


    // ========================================
    // PRÓXIMA CLASE
    // ========================================

    function obtenerProximaClase() {

        const ahora =
            new Date();


        const diasSemana = [
            "domingo",
            "lunes",
            "martes",
            "miercoles",
            "jueves",
            "viernes",
            "sabado"
        ];


        const diaActual =
            diasSemana[
                ahora.getDay()
            ];


        const horaActual =
            ahora.getHours() * 60 +
            ahora.getMinutes();


        // Primero buscar en el día actual

        const clasesHoy =
            horarios[diaActual] || [];


        const futuras =
            clasesHoy.filter(
                function (clase) {

                    return (
                        convertirHoraAMinutos(
                            clase.hora
                        ) > horaActual
                    );

                }
            );


        if (futuras.length > 0) {

            futuras.sort(
                function (a, b) {

                    return (
                        convertirHoraAMinutos(
                            a.hora
                        ) -
                        convertirHoraAMinutos(
                            b.hora
                        )
                    );

                }
            );


            return {

                clase: futuras[0],

                dia: diaActual

            };

        }


        // Buscar días siguientes

        const ordenDias = [
            "lunes",
            "martes",
            "miercoles",
            "jueves",
            "viernes"
        ];


let posicion = ordenDias.indexOf(diaActual);

if (posicion === -1) {
    posicion = 4;
}


        if (posicion !== -1) {

            for (
                let i = 1;
                i <= 5;
                i++
            ) {

                const siguiente =
                    ordenDias[
                        (
                            posicion + i
                        ) % 5
                    ];


                if (
                    horarios[siguiente] &&
                    horarios[siguiente]
                        .length > 0
                ) {

                    const clases =
                        [
                            ...horarios[
                                siguiente
                            ]
                        ];


                    clases.sort(
                        function (a, b) {

                            return (
                                convertirHoraAMinutos(
                                    a.hora
                                ) -
                                convertirHoraAMinutos(
                                    b.hora
                                )
                            );

                        }
                    );


                    return {

                        clase: clases[0],

                        dia: siguiente

                    };

                }

            }

        }


        return null;

    }


    // ========================================
    // MOSTRAR PRÓXIMA CLASE
    // ========================================

    function mostrarProximaClase() {

        const resultado =
            obtenerProximaClase();


        if (!resultado) {

            proximaClaseElemento.innerHTML = `

                <div class="tarjeta">

                    <h3>
                        🎉 No hay clases próximas
                    </h3>

                    <p>
                        No tienes clases
                        registradas.
                    </p>

                </div>

            `;

            return;

        }


        proximaClaseElemento.innerHTML = `

            <div class="tarjeta">

                <h3>
                    📚 ${resultado.clase.materia}
                </h3>

                <p>
                    ⏰ ${formatearHora(
                        resultado.clase.hora
                    )}
                </p>

                <p>
                    📅 ${capitalizar(
                        resultado.dia
                    )}
                </p>

            </div>

        `;

    }


    // ========================================
    // PRÓXIMO RECORDATORIO
    // ========================================

    function mostrarProximoRecordatorio() {

        const actividades =
            obtenerActividades();


        const ahora =
            new Date();


        const futuras =
            actividades.filter(
                function (actividad) {

                    if (
                        actividad.completada
                    ) {
                        return false;
                    }


                    const fecha =
                        new Date(
                            actividad.fecha +
                            "T" +
                            actividad.hora
                        );


                    return fecha >= ahora;

                }
            );


        futuras.sort(
            function (a, b) {

                return (
                    new Date(
                        a.fecha +
                        "T" +
                        a.hora
                    ) -
                    new Date(
                        b.fecha +
                        "T" +
                        b.hora
                    )
                );

            }
        );


        const actividad =
            futuras[0];


        if (!actividad) {

            proximoRecordatorio.innerHTML = `

                <div class="tarjeta">

                    <h3>
                        🎉 Todo al día
                    </h3>

                    <p>
                        No tienes actividades
                        pendientes próximas.
                    </p>

                </div>

            `;

            return;

        }


        const fecha =
            new Date(
                actividad.fecha +
                "T00:00:00"
            ).toLocaleDateString(
                "es-ES",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );


        proximoRecordatorio.innerHTML = `

            <div class="tarjeta">

                <h3>
                    📝 ${actividad.nombre}
                </h3>

                <p>
                    📌 ${actividad.tipo}
                </p>

                <p>
                    📅 ${fecha}
                </p>

                <p>
                    ⏰ ${formatearHora(
                        actividad.hora
                    )}
                </p>

            </div>

        `;

    }


    // ========================================
    // RESUMEN DEL DÍA
    // ========================================

    function mostrarResumenDia() {

        const ahora =
            new Date();


        const diasSemana = [
            "domingo",
            "lunes",
            "martes",
            "miercoles",
            "jueves",
            "viernes",
            "sabado"
        ];


        const diaActual =
            diasSemana[
                ahora.getDay()
            ];


        const clases =
            horarios[diaActual] || [];


const año = ahora.getFullYear();
const mes = String(ahora.getMonth() + 1).padStart(2, "0");
const dia = String(ahora.getDate()).padStart(2, "0");

const fechaActual = `${año}-${mes}-${dia}`;


const actividades =
    obtenerActividades()
        .filter(
            function (actividad) {

                return (
                    actividad.fecha ===
                    fechaActual &&
                    !actividad.completada
                );

            }
        );


        let contenido =
            "";


        if (
            clases.length === 0 &&
            actividades.length === 0
        ) {

            contenido = `

                <div class="tarjeta">

                    <h3>
                        🎉 Día tranquilo
                    </h3>

                    <p>
                        No tienes clases ni
                        actividades para hoy.
                    </p>

                </div>

            `;

        } else {

            clases.forEach(
                function (clase) {

                    contenido += `

                        <div class="tarjeta">

                            <h3>
                                📚 ${clase.materia}
                            </h3>

                            <p>
                                ⏰ ${formatearHora(
                                    clase.hora
                                )}
                            </p>

                        </div>

                    `;

                }
            );


            actividades.forEach(
                function (actividad) {

                    contenido += `

                        <div class="tarjeta">

                            <h3>
                                📝 ${actividad.nombre}
                            </h3>

                            <p>
                                📌 ${actividad.tipo}
                            </p>

                            <p>
                                ⏰ ${formatearHora(
                                    actividad.hora
                                )}
                            </p>

                        </div>

                    `;

                }
            );

        }


        resumenDiaElemento.innerHTML =
            contenido;

    }


    // ========================================
    // CONVERSIÓN DE HORAS
    // ========================================

    function convertirHoraAMinutos(hora) {

        if (!hora) {
            return 0;
        }


        if (
            hora.includes("AM") ||
            hora.includes("PM")
        ) {

            const partes =
                hora.split(" ");


            const tiempo =
                partes[0];

            const periodo =
                partes[1];


            const partesHora =
                tiempo.split(":");


            let horas =
                parseInt(
                    partesHora[0]
                );


            const minutos =
                parseInt(
                    partesHora[1]
                );


            if (
                periodo === "PM" &&
                horas !== 12
            ) {

                horas += 12;

            }


            if (
                periodo === "AM" &&
                horas === 12
            ) {

                horas = 0;

            }


            return (
                horas * 60 +
                minutos
            );

        }


        const partes =
            hora.split(":");


        return (
            parseInt(partes[0]) * 60 +
            parseInt(partes[1])
        );

    }


    // ========================================
    // CONVERTIR HORA A INPUT
    // ========================================

    function convertirHoraAInput(hora) {

        if (!hora) {
            return "";
        }


        if (
            hora.includes("AM") ||
            hora.includes("PM")
        ) {

            const minutos =
                convertirHoraAMinutos(
                    hora
                );


            const horas =
                Math.floor(
                    minutos / 60
                );


            const mins =
                minutos % 60;


            return (
                String(horas)
                    .padStart(2, "0") +
                ":" +
                String(mins)
                    .padStart(2, "0")
            );

        }


        return hora;

    }




    // ========================================
    // CAPITALIZAR
    // ========================================

    function capitalizar(texto) {

        if (!texto) {
            return "";
        }


        return (
            texto.charAt(0)
                .toUpperCase() +
            texto.slice(1)
        );

    }

// ========================================
// AJUSTES
// ========================================

const abrirAjustes =
    document.getElementById("abrirAjustes");

const seccionAjustes =
    document.getElementById("ajustes");

const cerrarAjustes =
    document.getElementById("cerrarAjustes");


abrirAjustes.addEventListener(
    "click",
    function () {

        ocultarTodo();

        seccionAjustes.style.display =
            "block";

    }
);


cerrarAjustes.addEventListener(
    "click",
    function () {

        mostrarInicio();

    }
);

// ========================================
// FORMATEAR HORA
// ========================================

function formatearHora(hora) {

    if (!hora) {
        return "";
    }

    const minutos =
        convertirHoraAMinutos(
            hora
        );

    let horas =
        Math.floor(
            minutos / 60
        );

    const mins =
        minutos % 60;

    // ========================================
    // FORMATO DE 24 HORAS
    // ========================================

    const formatoGuardado =
        localStorage.getItem(
            "formatoHora"
        ) || "12";

    if (formatoGuardado === "24") {

        return (
            String(horas).padStart(
                2,
                "0"
            ) +
            ":" +
            String(mins).padStart(
                2,
                "0"
            )
        );
    }

    // ========================================
    // FORMATO DE 12 HORAS
    // ========================================

    const periodo =
        horas >= 12
        ? "PM"
        : "AM";

    if (horas === 0) {

        horas = 12;

    } else if (horas > 12) {

        horas -= 12;

    }

    return (
        horas +
        ":" +
        String(mins).padStart(
            2,
            "0"
        ) +
        " " +
        periodo
    );
}

    // ========================================
    // NAVEGACIÓN
    // ========================================

    const botonesNavegacion =
        document.querySelectorAll(
            ".nav-boton"
        );


    const seccionInicio =
        document.getElementById(
            "inicio"
        );

    const seccionHorario =
        document.getElementById(
            "horario"
        );

    const seccionActividades =
        document.getElementById(
            "actividades"
        );

    const seccionRecordatorios =
        document.querySelector(
            ".recordatorios"
        );

    const seccionProximaClase =
        document.querySelector(
            ".proxima-clase"
        );


    const todasLasSecciones = [

    seccionInicio,

    seccionHorario,

    seccionActividades,

    seccionRecordatorios,

    seccionProximaClase,

    seccionAjustes

];


    function ocultarTodo() {

        todasLasSecciones.forEach(
            function (seccion) {

                if (seccion) {

                    seccion.style.display =
                        "none";

                }

            }
        );

    }


    function mostrarInicio() {

        ocultarTodo();


        seccionInicio.style.display =
            "block";

        seccionProximaClase.style.display =
    "none";

seccionRecordatorios.style.display =
    "none";


        botonesNavegacion.forEach(
            function (boton) {

                boton.classList.remove(
                    "activo"
                );


                if (
                    boton.dataset.seccion ===
                    "inicio"
                ) {

                    boton.classList.add(
                        "activo"
                    );

                }

            }
        );

    }


    function mostrarSeccion(nombre) {

        ocultarTodo();


        if (
            nombre === "inicio"
        ) {

            mostrarInicio();

            return;

        }


        if (
            nombre === "horario"
        ) {

            seccionHorario.style.display =
                "block";

        }


        if (
            nombre === "actividades"
        ) {

            seccionActividades.style.display =
                "block";

        }


        botonesNavegacion.forEach(
            function (boton) {

                boton.classList.remove(
                    "activo"
                );


                if (
                    boton.dataset.seccion ===
                    nombre
                ) {

                    boton.classList.add(
                        "activo"
                    );

                }

            }
        );

    }


    botonesNavegacion.forEach(
        function (boton) {

            boton.addEventListener(
                "click",
                function () {

                    mostrarSeccion(
                        boton.dataset.seccion
                    );

                }
            );

        }
    );
// ========================================
// BOTONES VOLVER AL INICIO
// ========================================

const botonesVolver =
    document.querySelectorAll(".boton-volver");

botonesVolver.forEach(function (boton) {

    boton.addEventListener(
        "click",
        function () {

            mostrarInicio();

        }
    );

});

    // ========================================
    // ACCESOS RÁPIDOS
    // ========================================

    const accesoHorario =
        document.getElementById(
            "accesoHorario"
        );

    const accesoActividades =
        document.getElementById(
            "accesoActividades"
        );

    const accesoRecordatorios =
        document.getElementById(
            "accesoRecordatorios"
        );

    const accesoProximaClase =
        document.getElementById(
            "accesoProximaClase"
        );


    accesoHorario.addEventListener(
        "click",
        function () {

            mostrarSeccion(
                "horario"
            );

        }
    );


    accesoActividades.addEventListener(
        "click",
        function () {

            mostrarSeccion(
                "actividades"
            );

        }
    );


    accesoRecordatorios.addEventListener(
        "click",
        function () {

            ocultarTodo();


            seccionRecordatorios.style.display =
                "block";

        }
    );


    accesoProximaClase.addEventListener(
        "click",
        function () {

            ocultarTodo();


            seccionProximaClase.style.display =
                "block";

        }
    );


    // ========================================
    // NOTIFICACIONES
    // ========================================

    if (botonNotificaciones) {

        botonNotificaciones.addEventListener(
            "click",
            async function () {

                if (
                    !("Notification" in window)
                ) {

                    alert(
                        "Este navegador no permite notificaciones."
                    );

                    return;

                }


                try {

                    const permiso =
                        await Notification.requestPermission();


                    if (
                        permiso ===
                        "granted"
                    ) {

                        if (
                            "serviceWorker" in
                            navigator
                        ) {

                            const registro =
                                await navigator
                                    .serviceWorker
                                    .ready;


                            await registro.showNotification(
                                "📚 Organizador Escolar",
                                {
                                    body:
                                        "¡Las notificaciones funcionan correctamente! 🔔",
                                    icon:
                                        "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
                                    badge:
                                        "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                                }
                            );

                        }


                        botonNotificaciones.textContent =
                            "✅ Notificación de prueba enviada";

                    } else {

                        alert(
                            "No se activaron las notificaciones."
                        );

                    }

                } catch (error) {

                    alert(
                        "No se pudo enviar la notificación."
                    );

                }

            }
        );

    }
/* ========================================
   BOTÓN DE NOTIFICACIONES EN AJUSTES
======================================== */

if (botonNotificacionesAjustes) {

    botonNotificacionesAjustes.addEventListener(
        "click",
        function () {

            if (botonNotificaciones) {

                botonNotificaciones.click();

            } else {

                alert(
                    "No se encontró el sistema de notificaciones."
                );

            }

        }
    );

}
// ========================================
// FORMATO DE HORA
// ========================================

if (formatoHoraElemento) {

    const formatoGuardado =
        localStorage.getItem(
            "formatoHora"
        );

    if (formatoGuardado) {

        formatoHoraElemento.value =
            formatoGuardado;

    }

    formatoHoraElemento.addEventListener(
        "change",
        function () {

            localStorage.setItem(
                "formatoHora",
                formatoHoraElemento.value
            );

            mostrarHorario(diaSeleccionado);
            mostrarActividades();
            mostrarProximaClase();
            mostrarProximoRecordatorio();
            mostrarResumenDia();

        }
    );

}

    // ========================================
    // ACTUALIZAR TODO
    // ========================================

    function actualizarTodo() {

        mostrarActividades();

        mostrarProximoRecordatorio();

        mostrarProximaClase();

        mostrarResumenDia();

        mostrarFechaHora();

    }


    // ========================================
    // INICIO
    // ========================================

    mostrarHorario("lunes");

    actualizarTodo();

    mostrarInicio();


    // ========================================
    // ACTUALIZACIÓN AUTOMÁTICA
    // ========================================

    setInterval(
        mostrarFechaHora,
        1000
    );


    setInterval(
        mostrarProximaClase,
        60000
    );


    setInterval(
        mostrarProximoRecordatorio,
        60000
    );


    setInterval(
        mostrarResumenDia,
        60000
    );


    // ========================================
    // SERVICE WORKER
    // ========================================

    if (
        "serviceWorker" in navigator
    ) {

        navigator.serviceWorker.register(
            "service-worker.js"
        );

    }

});
