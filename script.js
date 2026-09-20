// ----------------------------------------
// ORGANIZADOR ESCOLAR
// ----------------------------------------

document.addEventListener("DOMContentLoaded", function () {

    // ----------------------------------------
    // ELEMENTOS DEL HTML
    // ----------------------------------------

    const horarioDia = document.getElementById("horario-dia");
    const botonesDia = document.querySelectorAll(".dia");

    const botonAgregar = document.getElementById("agregarClase");
    const ventanaClase = document.getElementById("ventanaClase");
    const cerrarVentana = document.getElementById("cerrarVentana");
    const guardarClase = document.getElementById("guardarClase");

    const nombreMateria = document.getElementById("nombreMateria");
    const horaClase = document.getElementById("horaClase");
    const diaClase = document.getElementById("diaClase");

    const botonAgregarActividad =
        document.getElementById("agregarActividad");

    const ventanaActividad =
        document.getElementById("ventanaActividad");

    const cerrarActividad =
        document.getElementById("cerrarActividad");

    const guardarActividad =
        document.getElementById("guardarActividad");

    const nombreActividad =
        document.getElementById("nombreActividad");

    const materiaActividad =
        document.getElementById("materiaActividad");

    const tipoActividad =
        document.getElementById("tipoActividad");

    const fechaActividad =
        document.getElementById("fechaActividad");

    const horaActividad =
        document.getElementById("horaActividad");

    const descripcionActividad =
        document.getElementById("descripcionActividad");

    const listaActividades =
        document.getElementById("lista-actividades");

    const proximoRecordatorio =
        document.getElementById("proximo-recordatorio");

    const proximaClaseElemento =
        document.getElementById("proxima-clase");

    const fechaHoraElemento =
        document.getElementById("fecha-hora");

    const resumenDiaElemento =
        document.getElementById("resumen-dia");


    // ----------------------------------------
    // HORARIO
    // ----------------------------------------

    const horariosPorDefecto = {

        lunes: [
            {
                hora: "7:00 AM",
                materia: "Matemáticas"
            },
            {
                hora: "8:00 AM",
                materia: "Inglés"
            }
        ],

        martes: [
            {
                hora: "7:00 AM",
                materia: "Español"
            },
            {
                hora: "9:00 AM",
                materia: "Historia"
            }
        ],

        miercoles: [
            {
                hora: "8:00 AM",
                materia: "Biología"
            }
        ],

        jueves: [
            {
                hora: "7:00 AM",
                materia: "Física"
            },
            {
                hora: "10:00 AM",
                materia: "Inglés"
            }
        ],

        viernes: [
            {
                hora: "7:00 AM",
                materia: "Matemáticas"
            }
        ]

    };


    // Cargar horario guardado
    let horarios =
        JSON.parse(localStorage.getItem("horarios")) ||
        horariosPorDefecto;


    // Asegurar que todos los días existan
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

        // Eliminar datos antiguos de aula
        horarios[dia].forEach(function (clase) {
            delete clase.aula;
        });

    });


    localStorage.setItem(
        "horarios",
        JSON.stringify(horarios)
    );


    let indiceClaseEditando = null;
    let diaClaseEditando = null;


    // ----------------------------------------
    // CONVERTIR HORA A MINUTOS
    // ----------------------------------------

    function convertirHoraAMinutos(horaTexto) {

        if (!horaTexto) {
            return 0;
        }

        horaTexto = horaTexto.trim();

        // Formato 12 horas: 7:00 AM
        if (
            horaTexto.includes("AM") ||
            horaTexto.includes("PM")
        ) {

            const partes = horaTexto.split(" ");
            const tiempo = partes[0];
            const periodo = partes[1];

            const partesHora = tiempo.split(":");

            let horas = parseInt(partesHora[0]);
            let minutos = parseInt(partesHora[1]);

            if (periodo === "PM" && horas !== 12) {
                horas += 12;
            }

            if (periodo === "AM" && horas === 12) {
                horas = 0;
            }

            return horas * 60 + minutos;
        }


        // Formato 24 horas: 07:00
        const partesHora = horaTexto.split(":");

        const horas = parseInt(partesHora[0]);
        const minutos = parseInt(partesHora[1]);

        return horas * 60 + minutos;
    }


    // ----------------------------------------
    // CONVERTIR HORA PARA INPUT TIME
    // ----------------------------------------

    function convertirHoraAInput(horaTexto) {

        if (!horaTexto) {
            return "";
        }

        horaTexto = horaTexto.trim();

        if (
            horaTexto.includes("AM") ||
            horaTexto.includes("PM")
        ) {

            const partes = horaTexto.split(" ");
            const tiempo = partes[0];
            const periodo = partes[1];

            const partesHora = tiempo.split(":");

            let horas = parseInt(partesHora[0]);
            const minutos = parseInt(partesHora[1]);

            if (periodo === "PM" && horas !== 12) {
                horas += 12;
            }

            if (periodo === "AM" && horas === 12) {
                horas = 0;
            }

            return String(horas).padStart(2, "0") +
                ":" +
                String(minutos).padStart(2, "0");
        }

        return horaTexto;
    }


    // ----------------------------------------
    // MOSTRAR HORARIO
    // ----------------------------------------

function formatearHora(hora) {

    if (!hora) {
        return "";
    }

    const partes = hora.split(":");

    let horas = parseInt(partes[0]);
    const minutos = partes[1];

    const periodo = horas >= 12 ? "PM" : "AM";

    if (horas === 0) {
        horas = 12;
    } else if (horas > 12) {
        horas -= 12;
    }

    return `${horas}:${minutos} ${periodo}`;
}
    function mostrarHorario(dia) {

        horarioDia.innerHTML = "";

        if (!horarios[dia]) {
            horarios[dia] = [];
        }

        horarios[dia].sort(function (a, b) {

            return convertirHoraAMinutos(a.hora) -
                convertirHoraAMinutos(b.hora);

        });


        horarios[dia].forEach(function (clase) {

            const elemento =
                document.createElement("div");

            elemento.className = "clase";

            elemento.innerHTML = `
                <div class="hora">
    ${formatearHora(clase.hora)}
</div>

                <div class="info-clase">
                    <h3>${clase.materia}</h3>
                </div>

                <div class="acciones-clase">
                    <button class="editar-clase">✏️</button>
                    <button class="eliminar-clase">🗑️</button>
                </div>
            `;


            // ELIMINAR CLASE
            const botonEliminar =
                elemento.querySelector(".eliminar-clase");

            botonEliminar.addEventListener(
                "click",
                function () {

                    const confirmar = confirm(
                        "¿Quieres eliminar esta clase?"
                    );

                    if (!confirmar) {
                        return;
                    }

                    const indice =
                        horarios[dia].indexOf(clase);

                    horarios[dia].splice(indice, 1);

                    localStorage.setItem(
                        "horarios",
                        JSON.stringify(horarios)
                    );

                    mostrarHorario(dia);
                    mostrarProximaClase();
                    mostrarResumenDia();

                }
            );


            // EDITAR CLASE
            const botonEditar =
                elemento.querySelector(".editar-clase");

            botonEditar.addEventListener(
                "click",
                function () {

                    const indice =
                        horarios[dia].indexOf(clase);

                    indiceClaseEditando = indice;
                    diaClaseEditando = dia;

                    nombreMateria.value =
                        clase.materia;

                    horaClase.value =
                        convertirHoraAInput(clase.hora);

                    diaClase.value = dia;

                    ventanaClase.style.display = "flex";

                }
            );


            horarioDia.appendChild(elemento);

        });

    }


    // ----------------------------------------
    // CAMBIAR DE DÍA
    // ----------------------------------------

    botonesDia.forEach(function (boton) {

        boton.addEventListener(
            "click",
            function () {

                botonesDia.forEach(function (b) {

                    b.classList.remove("activo");

                });

                boton.classList.add("activo");

                const diaSeleccionado =
                    boton.dataset.dia;

                mostrarHorario(diaSeleccionado);

            }
        );

    });


    // ----------------------------------------
    // AGREGAR CLASE
    // ----------------------------------------

    botonAgregar.addEventListener(
        "click",
        function () {

            indiceClaseEditando = null;
            diaClaseEditando = null;

            nombreMateria.value = "";
            horaClase.value = "";

            ventanaClase.style.display = "flex";

        }
    );


    // ----------------------------------------
    // CERRAR VENTANA DE CLASE
    // ----------------------------------------

    cerrarVentana.addEventListener(
        "click",
        function () {

            ventanaClase.style.display = "none";

            indiceClaseEditando = null;
            diaClaseEditando = null;

        }
    );


    // ----------------------------------------
    // GUARDAR CLASE
    // ----------------------------------------

    guardarClase.addEventListener(
        "click",
        function () {

            const materia =
                nombreMateria.value.trim();

            const hora =
                horaClase.value;

            const dia =
                diaClase.value;


            if (materia === "" || hora === "") {

                alert(
                    "Completa todos los campos 📚"
                );

                return;
            }


            // NUEVA CLASE
            if (indiceClaseEditando === null) {

                horarios[dia].push({
                    hora: hora,
                    materia: materia
                });

            }

            // EDITAR CLASE
            else {

                horarios[diaClaseEditando].splice(
                    indiceClaseEditando,
                    1
                );

                horarios[dia].push({
                    hora: hora,
                    materia: materia
                });

                indiceClaseEditando = null;
                diaClaseEditando = null;

            }


            localStorage.setItem(
                "horarios",
                JSON.stringify(horarios)
            );


            ventanaClase.style.display = "none";

            nombreMateria.value = "";
            horaClase.value = "";


            mostrarHorario(dia);
            mostrarProximaClase();
            mostrarResumenDia();


            alert(
                "¡Clase guardada correctamente! 🎉"
            );

        }
    );


    // ----------------------------------------
    // FECHA Y HORA ACTUAL
    // ----------------------------------------

    function mostrarFechaHora() {

        const ahora = new Date();

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


    // ----------------------------------------
    // PRÓXIMA CLASE
    // ----------------------------------------

    function obtenerProximaClase() {

        const ahora = new Date();

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
            diasSemana[ahora.getDay()];

        const clasesHoy =
            horarios[diaActual] || [];


        const horaActual =
            ahora.getHours() * 60 +
            ahora.getMinutes();


        const clasesFuturas =
            clasesHoy.filter(function (clase) {

                return convertirHoraAMinutos(
                    clase.hora
                ) > horaActual;

            });


        clasesFuturas.sort(function (a, b) {

            return convertirHoraAMinutos(a.hora) -
                convertirHoraAMinutos(b.hora);

        });


        return clasesFuturas[0] || null;

    }


    function mostrarProximaClase() {

        const clase =
            obtenerProximaClase();


        if (!clase) {

            proximaClaseElemento.innerHTML = `
                <div class="tarjeta">
                    <h3>🎉 No tienes más clases hoy</h3>
                    <p>Has terminado tu horario por hoy.</p>
                </div>
            `;

            return;
        }


        proximaClaseElemento.innerHTML = `
            <div class="tarjeta">
                <h3>📚 ${clase.materia}</h3>
                <p>⏰ ${clase.hora}</p>
            </div>
        `;

    }


    // ----------------------------------------
    // RESUMEN DEL DÍA
    // ----------------------------------------

    function mostrarResumenDia() {

        const ahora = new Date();

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
            diasSemana[ahora.getDay()];


        const clasesHoy =
            horarios[diaActual] || [];


        const actividadesGuardadas =
            JSON.parse(
                localStorage.getItem("actividades")
            ) || [];


        const fechaHoy =
            ahora.toISOString().split("T")[0];


        const actividadesHoy =
            actividadesGuardadas.filter(
                function (actividad) {

                    return actividad.fecha === fechaHoy;

                }
            );


        let contenido = "";


        if (
            clasesHoy.length === 0 &&
            actividadesHoy.length === 0
        ) {

            contenido = `
                <div class="tarjeta">
                    <h3>🎉 Día tranquilo</h3>
                    <p>
                        No tienes clases ni actividades
                        registradas para hoy.
                    </p>
                </div>
            `;

        }

        else {

            clasesHoy.forEach(function (clase) {

                contenido += `
                    <div class="tarjeta">
                        <h3>📚 ${clase.materia}</h3>
                        <p>🕐 ${clase.hora}</p>
                    </div>
                `;

            });


            actividadesHoy.forEach(
                function (actividad) {

                    contenido += `
                        <div class="tarjeta">
                            <h3>
                                📝 ${actividad.nombre}
                            </h3>

                            <p>
                                📚 ${actividad.materia}
                            </p>

                            <p>
                                ⏰ ${actividad.hora}
                            </p>
                        </div>
                    `;

                }
            );

        }


        resumenDiaElemento.innerHTML =
            contenido;

    }


    // ----------------------------------------
    // ACTIVIDADES
    // ----------------------------------------

    let indiceActividadEditando = null;


    function mostrarActividades() {

        const actividadesGuardadas =
            JSON.parse(
                localStorage.getItem("actividades")
            ) || [];


        // Agregar estado a actividades antiguas
        actividadesGuardadas.forEach(
            function (actividad) {

                if (
                    actividad.completada === undefined
                ) {

                    actividad.completada = false;

                }

            }
        );


        localStorage.setItem(
            "actividades",
            JSON.stringify(actividadesGuardadas)
        );


        listaActividades.innerHTML = "";


        actividadesGuardadas.sort(
            function (a, b) {

                return new Date(
                    a.fecha + "T" + a.hora
                ) -
                new Date(
                    b.fecha + "T" + b.hora
                );

            }
        );


        actividadesGuardadas.forEach(
            function (actividad) {

                const tarjeta =
                    document.createElement("div");

                tarjeta.className = "tarjeta";


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
                        📚 ${actividad.materia}
                    </p>

                    <p>
                        📅 ${fecha}
                        · ⏰ ${actividad.hora}
                    </p>

                    <p>
                        📌 ${actividad.tipo}
                    </p>

                    ${
                        actividad.descripcion
                        ? `<p>${actividad.descripcion}</p>`
                        : ""
                    }

                    <button class="completar-actividad">
                        ${
                            actividad.completada
                            ? "↩️ Pendiente"
                            : "✅ Completar"
                        }
                    </button>

                    <button class="eliminar-actividad">
                        🗑️ Eliminar
                    </button>

                    <button class="editar-actividad">
                        ✏️ Editar
                    </button>
                `;


                // COMPLETAR
                const botonCompletar =
                    tarjeta.querySelector(
                        ".completar-actividad"
                    );


                botonCompletar.addEventListener(
                    "click",
                    function () {

                        const actividadesActualizadas =
                            JSON.parse(
                                localStorage.getItem(
                                    "actividades"
                                )
                            ) || [];


                        const indice =
                            actividadesActualizadas.indexOf(
                                actividad
                            );


                        if (indice === -1) {
                            return;
                        }


                        actividadesActualizadas[
                            indice
                        ].completada =
                            !actividadesActualizadas[
                                indice
                            ].completada;


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
                );


                // ELIMINAR
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
                            JSON.parse(
                                localStorage.getItem(
                                    "actividades"
                                )
                            ) || [];


                        const indice =
                            actividadesActualizadas.indexOf(
                                actividad
                            );


                        if (indice !== -1) {

                            actividadesActualizadas.splice(
                                indice,
                                1
                            );

                        }


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
                );


// EDITAR
                const botonEditar =
                    tarjeta.querySelector(
                        ".editar-actividad"
                    );


                botonEditar.addEventListener(
                    "click",
                    function () {

                        const actividadesActualizadas =
                            JSON.parse(
                                localStorage.getItem(
                                    "actividades"
                                )
                            ) || [];


                        const indice =
                            actividadesActualizadas.indexOf(
                                actividad
                            );


                        if (indice === -1) {
                            return;
                        }


                        indiceActividadEditando =
                            indice;


                        const actividadEditar =
                            actividadesActualizadas[
                                indice
                            ];


                        nombreActividad.value =
                            actividadEditar.nombre;

                        materiaActividad.value =
                            actividadEditar.materia;

                        tipoActividad.value =
                            actividadEditar.tipo;

                        fechaActividad.value =
                            actividadEditar.fecha;

                        horaActividad.value =
                            actividadEditar.hora;

                        descripcionActividad.value =
                            actividadEditar.descripcion || "";


                        ventanaActividad.style.display =
                            "flex";

                    }
                );


                listaActividades.appendChild(
                    tarjeta
                );

            }
        );

    }


    // ----------------------------------------
    // PRÓXIMA ACTIVIDAD
    // ----------------------------------------

    function obtenerProximaActividad() {

        const actividadesGuardadas =
            JSON.parse(
                localStorage.getItem("actividades")
            ) || [];


        const ahora = new Date();


        const actividadesFuturas =
            actividadesGuardadas.filter(
                function (actividad) {

                    if (actividad.completada) {
                        return false;
                    }

                    const fechaActividad =
                        new Date(
                            actividad.fecha +
                            "T" +
                            actividad.hora
                        );


                    return fechaActividad >= ahora;

                }
            );


        actividadesFuturas.sort(
            function (a, b) {

                return new Date(
                    a.fecha + "T" + a.hora
                ) -
                new Date(
                    b.fecha + "T" + b.hora
                );

            }
        );


        return actividadesFuturas[0] || null;

    }


    // ----------------------------------------
    // MOSTRAR RECORDATORIO
    // ----------------------------------------

    function mostrarProximoRecordatorio() {

        const actividad =
            obtenerProximaActividad();


        if (!actividad) {

            proximoRecordatorio.innerHTML = `
                <div class="tarjeta">
                    <h3>
                        🎉 No tienes actividades próximas
                    </h3>

                    <p>
                        Todo está al día.
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
                    📚 ${actividad.materia}
                </p>

                <p>
                    📅 ${fecha}
                    · ⏰ ${actividad.hora}
                </p>
            </div>
        `;

    }


    // ----------------------------------------
    // AGREGAR ACTIVIDAD
    // ----------------------------------------

    botonAgregarActividad.addEventListener(
        "click",
        function () {

            indiceActividadEditando = null;

            nombreActividad.value = "";
            materiaActividad.value = "";
            fechaActividad.value = "";
            horaActividad.value = "";
            descripcionActividad.value = "";

            ventanaActividad.style.display =
                "flex";

        }
    );


    //
    
    
    // CERRAR ACTIVIDAD
    // ========================================

    cerrarActividad.addEventListener(
        "click",
        function () {

            ventanaActividad.style.display =
                "none";

            indiceActividadEditando = null;

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

            const materia =
                materiaActividad.value.trim();

            const tipo =
                tipoActividad.value;

            const fecha =
                fechaActividad.value;

            const hora =
                horaActividad.value;

            const descripcion =
                descripcionActividad.value.trim();


            if (
                nombre === "" ||
                materia === "" ||
                fecha === "" ||
                hora === ""
            ) {

                alert(
                    "Completa los campos principales 📝"
                );

                return;

            }


            const actividadesGuardadas =
                JSON.parse(
                    localStorage.getItem(
                        "actividades"
                    )
                ) || [];


            let completada = false;


            // Si estamos editando,
            // conservar si ya estaba completada
            if (
                indiceActividadEditando !== null &&
                actividadesGuardadas[
                    indiceActividadEditando
                ]
            ) {

                completada =
                    actividadesGuardadas[
                        indiceActividadEditando
                    ].completada || false;

            }


            const actividad = {

                nombre: nombre,
                materia: materia,
                tipo: tipo,
                fecha: fecha,
                hora: hora,
                descripcion: descripcion,
                completada: completada

            };


            // NUEVA ACTIVIDAD
            if (
                indiceActividadEditando === null
            ) {

                actividadesGuardadas.push(
                    actividad
                );

            }

            // EDITAR ACTIVIDAD
            else {

                actividadesGuardadas[
                    indiceActividadEditando
                ] = actividad;

                indiceActividadEditando = null;

            }


            localStorage.setItem(
                "actividades",
                JSON.stringify(
                    actividadesGuardadas
                )
            );


            ventanaActividad.style.display =
                "none";


            nombreActividad.value = "";
            materiaActividad.value = "";
            fechaActividad.value = "";
            horaActividad.value = "";
            descripcionActividad.value = "";


            mostrarActividades();
            mostrarProximoRecordatorio();
            mostrarResumenDia();


            alert(
                "¡Actividad guardada correctamente! 🎉"
            );

        }
    );


    // ========================================
    // NAVEGACIÓN
    // ========================================

    const botonesNavegacion =
        document.querySelectorAll(
            ".nav-boton"
        );


    // Todo esto pertenece a INICIO
    const seccionesInicio = [

        document.getElementById("inicio"),

        document.querySelector(
            ".recordatorios"
        ),

        document.querySelector(
            ".proxima-clase"
        ),

        document.querySelector(
            ".resumen-dia"
        )

    ];


    const seccionHorario =
        document.getElementById("horario");


    const seccionActividades =
        document.getElementById("actividades");


    const todasLasSecciones = [

        ...seccionesInicio,

        seccionHorario,

        seccionActividades

    ].filter(Boolean);


    function mostrarSeccion(
        seccionSeleccionada
    ) {

        // Ocultar todo
        todasLasSecciones.forEach(
            function (seccion) {

                seccion.style.display = "none";

            }
        );


        // Mostrar Inicio
        if (
            seccionSeleccionada === "inicio"
        ) {

            seccionesInicio.forEach(
                function (seccion) {

                    if (seccion) {
                        seccion.style.display =
                            "block";
                    }

                }
            );

        }


        // Mostrar Horario
        if (
            seccionSeleccionada === "horario"
        ) {

            seccionHorario.style.display =
                "block";

        }


        // Mostrar Actividades
        if (
            seccionSeleccionada === "actividades"
        ) {

            seccionActividades.style.display =
                "block";

        }


        // Cambiar botón activo
        botonesNavegacion.forEach(
            function (boton) {

                boton.classList.remove(
                    "activo"
                );

                if (
                    boton.dataset.seccion ===
                    seccionSeleccionada
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
    // INICIAR APP
    // ========================================

    mostrarHorario("lunes");

    mostrarActividades();

    mostrarProximoRecordatorio();

    mostrarProximaClase();

    mostrarResumenDia();

    mostrarFechaHora();

    mostrarSeccion("inicio");


    // ========================================
    // ACTUALIZACIÓN AUTOMÁTICA
    // ========================================

    setInterval(
        mostrarProximoRecordatorio,
        60000
    );

    setInterval(
        mostrarProximaClase,
        60000
    );

    setInterval(
        mostrarResumenDia,
        60000
    );

    setInterval(
        mostrarFechaHora,
        1000
    );

});
// ========================================
// NOTIFICACIONES
// ========================================

const botonNotificaciones =
    document.getElementById(
        "activarNotificaciones"
    );

if (botonNotificaciones) {

    botonNotificaciones.addEventListener(
        "click",
        async function () {

            if (!("Notification" in window)) {

                alert(
                    "Tu navegador no permite notificaciones."
                );

                return;
            }

            const permiso =
                await Notification.requestPermission();

            if (permiso === "granted") {

                new Notification(
                    "📚 Organizador Escolar",
                    {
                        body:
                            "¡Las notificaciones están activadas! 🔔"
                    }
                );

                botonNotificaciones.textContent =
                    "✅ Notificaciones activadas";

            } else {

                alert(
                    "No se activaron las notificaciones."
                );

            }

        }
    );

}
// ========================================
// REGISTRAR SERVICE WORKER
// ========================================

if ("serviceWorker" in navigator) {

    navigator.serviceWorker.register(
        "service-worker.js"
    );

}