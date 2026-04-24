var db; // Variable global para la base de datos
var proyectos; // Variable global para los proyectos
const filtroEstado = document.getElementById("filtroEstado");
const filtroCiudad = document.getElementById("filtroCiudad");
const filtroTipo = document.getElementById("filtroTipo");
const contenedorResultados = document.getElementById("resultados");

//Animación del Carrusel, selección del documento
let index = 0;
const slides = document.getElementById("slides");
const totalSlides = document.querySelectorAll(".slide");

//Filtros de proyectos
filtroEstado.addEventListener("change", filtrarProyectos);
filtroCiudad.addEventListener("change", filtrarProyectos);
filtroTipo.addEventListener("change", filtrarProyectos);

// Formulario de contacto
const servicio = document.getElementById("servicio");
const tipoProyectoDiv = document.getElementById("tipoProyectoDiv");
const areaDiv = document.getElementById("areaDiv");
const form = document.getElementById("formConstructora");
const respuesta = document.getElementById("respuesta"); 


async function main()
{
  const SQL= await initSqlJs({

  locateFile: file => `https://sql.js.org/dist/${file}`
  });

  db = new SQL.Database();


  //sentencia básica para insertar datos en la tabla de proyectos, reemplazando el const proyectos que habia antes.
  let sqlstr = "CREATE TABLE proyectos (id int, nombre char, ciudad char, estado char, progreso int, tipo char, imagen char); \
  INSERT INTO proyectos VALUES (0, 'Paysandú', 'Bogotá', 'terminado', 100, 'Residencial', 'src/Paysandú_Imagen.jpg'); \
  INSERT INTO proyectos VALUES (1, 'Rivadaira', 'Bogotá', 'construccion', 50, 'Residencial', 'src/Rivadaira_Imagen.jpg'); \
  INSERT INTO proyectos VALUES (2, 'Lavalleja', 'Medellín', 'terminado', 100, 'Residencial', 'src/Lavalleja_Imagen.jpg'); \
  INSERT INTO proyectos VALUES (3, 'Tacuarembó', 'Medellín', 'construccion', 50, 'Comercial', 'src/Tacuarembó_Imagen.jpg');";
  db.run(sqlstr); // Insertamos sin rgresar nada.

  // Ejemplo de sentencia SQL para filtrar.
  //const stmt = db.prepare("SELECT * FROM proyectos WHERE estado= ?");

  // Esto es para filtrar resultados de acuerdo al valor del filtro, en este caso, proyectos donde el estado = "terminado"
  //const result = stmt.getAsObject({':estado' : 'terminado'});
  //console.log(result); // Regresa {id:0, nombre:'Paysandú', estado:'terminado', ciudad:'Bogotá', progreso:100, tipo:'Residencial', imagen:'imagen1.jpg'}

  //.free() para liberar memoria usada por la sentencia SQL.
  //stmt.free();


  //EJEMPLO para UPDATE & DELETE:
   // UPDATE:
   // const updateStmt = db.prepare("UPDATE proyectos SET nombre = ? WHERE id = ?");
   // updateStmt.run([0, 'Paysandu2']); // Cambia el nombre del proyecto con id 0 (Paysandú) a "Paysandu2"
   // updateStmt.free(); // Liberar recursos
   //Después de eso, leemos de nuevo la tabla con db.exec("SELECT * FROM proyectos") ver linea 67.
   //  DELETE:
   // const deleteStmt = db.prepare("DELETE FROM proyectos WHERE id = ?");
   // deleteStmt.run([0]); //este sería Paysandú y quedaría borrado.
    //Después de eso, leemos de nuevo la tabla con db.exec("SELECT * FROM proyectos") ver linea 67.
   // deleteStmt.free();

  const res = db.exec("SELECT * FROM proyectos");

  //res: contiene un array de resultados, cada resultado tiene una propiedad "columns" con los nombres de las columnas y una propiedad "values" con los datos en formato de array de arrays.
  proyectos= res[0].values.map(row => {
    return {
      id: row[0],
      nombre: row[1],
      ciudad: row[2],
      estado: row[3],
      progreso: row[4],
      tipo: row[5],
      imagen: row[6]
    };
  });

  console.log(proyectos);

  

// Mostrar campos según selección
servicio.addEventListener("change", function () {
  if (this.value === "construccion" || this.value === "remodelacion") {
    tipoProyectoDiv.classList.remove("hidden");
    areaDiv.classList.remove("hidden");
  } else {
    tipoProyectoDiv.classList.add("hidden");
    areaDiv.classList.add("hidden");
  }
});

// Validación y lógica de envío
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const servicioValor = servicio.value;
  const area = document.getElementById("area").value;

  // Condición de negocio
  if (servicioValor === "construccion" && area < 50) {
    respuesta.innerHTML =
      "⚠️ Para proyectos de construcción, el área mínima es de 50 m².";
    respuesta.style.color = "red";
    return;
  }

  // Mensaje personalizado
  if (servicioValor === "cotizacion") {
    respuesta.innerHTML = "✅ Te contactaremos pronto para tu cotización.";
  } else {
    respuesta.innerHTML =
      "✅ Gracias por tu interés. Un asesor se comunicará contigo.";
  }

  respuesta.style.color = "green";

  form.reset();
  tipoProyectoDiv.classList.add("hidden");
  areaDiv.classList.add("hidden");
  });

  // Mostrar todos al inicio
  mostrarResultados(proyectos);
}

function whatsapp() {
  const numero = "573245082990"; // tu número
  const mensaje =
    "Hola, quiero información sobre sus servicios de construcción";
  window.open(
    `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`,
    "_blank",
  );
}

//función de actualización del carrusel
function actualizarCarrusel() {
  slides.style.transform = `translateX(-${index * 100}%)`;

  totalSlides.forEach((slide) => slide.classList.remove("activo"));
  totalSlides[index].classList.add("activo");
}

function mover(direccion) {
  index += direccion;

  if (index < 0) index = totalSlides.length - 1;
  if (index >= totalSlides.length) index = 0;

  actualizarCarrusel();
}

function contactar() {
  alert("Te redirigiremos a contacto (puedes conectar WhatsApp aquí)");
}

// Auto-play
setInterval(() => {
  mover(1);
}, 4000);



function filtrarProyectos() {
  const estado = filtroEstado.value;
  const ciudad = filtroCiudad.value;
  const tipo = filtroTipo.value;

  const filtrados =  //tratamos con una copia de la lista de proyectos traida de la base de datos, pero podríamos usar consultas SQL
  //para actuar directamente sobre los datos SQL y traer los datos con los filtros.
  //Si borramos datos de la bd entonces debemos filtrar siempre con esos datos.
  //Aqui lo hacemos todavía con la variable JS para mantener la simplicidad, pero esta variable debe ser constantemente actualizada con los datos
  //de la bd.

    proyectos.filter((p) => {
    return (
      (!estado || p.estado === estado) &&
      (!ciudad || p.ciudad === ciudad) &&
      (!tipo || p.tipo === tipo)
    );
  });

  mostrarResultados(filtrados);
}

function mostrarResultados(lista) {
  contenedorResultados.innerHTML = "";

  // Agrupar por ciudad
  const agrupados = {};

  lista.forEach((p) => {
    if (!agrupados[p.ciudad]) {
      agrupados[p.ciudad] = [];
    }
    agrupados[p.ciudad].push(p);
  });

  // Render
  for (const ciudad in agrupados) {
    const tituloCiudad = document.createElement("h3");
    tituloCiudad.textContent = ciudad;
    contenedorResultados.appendChild(tituloCiudad);

    agrupados[ciudad].forEach((p) => {
      const div = document.createElement("div");
      div.classList.add("resultado");

      div.innerHTML = `
        <img src="${p.imagen}" width="200"/>
        <p><strong>Nombre:</strong> ${p.nombre}</p>
        <p><strong>Estado:</strong> ${p.progreso}%</p>
        <p><strong>Tipo:</strong> ${p.tipo}</p>
      `;

      contenedorResultados.appendChild(div);
    });
  }
}

//Punto de entrada.
main();