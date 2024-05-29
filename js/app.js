const carrito = document.querySelector('#carrito'), 
      contenedorCarrito = document.querySelector('#lista-carrito tbody'),
      vaciarCarritoBtn = document.querySelector('#vaciar-carrito'),  
      listaCursos = document.querySelector('#lista-cursos'),
      notificacion = document.querySelector('#notificacion');

      let articulosCarrito = [];

      cargarEventListeners();

      function cargarEventListeners(){
        // cuando agregas un curso presionando 'Agregar al carrito'
        listaCursos.addEventListener('click', agregarCurso);

        // Elimina cursos del carrito
        carrito.addEventListener('click', eliminarCurso);

        document.addEventListener('DOMContentLoaded', () => {
            articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

            carritoHTML();
        });

        // Vaciar el carrito
        vaciarCarritoBtn.addEventListener('click', () => {
            articulosCarrito = []; // reseteamos el articulo
            
            limpiarHTML(); // eliminamos todo el html
            actualizarNotification();
        });
      }

     

    //   Funciones
    function agregarCurso(e){
        e.preventDefault();

        if(e.target.classList.contains('agregar-carrito')){
            const SelectCurso = e.target.parentElement.parentElement;
            ContainerCurso(SelectCurso);
        }
    }

    function eliminarCurso(e){
      
        if(e.target.classList.contains('borrar-curso')){
           const cursoId = e.target.getAttribute('data-id');

        //    eliminar del arreglo de articulosCarrito por el data-id
          articulosCarrito =  articulosCarrito.filter(curso => curso.id !== cursoId);
            
          carritoHTML(); //iterar sobre el carrito y mostrar su HTML
          actualizarNotification(); 
        }
    }

    function ContainerCurso(curso){
        // console.log(curso);

        // Crear un objeto con el contenido del curso actual
        const infoCurso = {
            imagen: curso.querySelector('img').src,
            titulo: curso.querySelector('h4').textContent,
            precio: curso.querySelector('.precio span').textContent,
            id: curso.querySelector('a').getAttribute('data-id'),
            cantidad: 1,
           
        };

        // comprobar si un elemento ya existe en el arreglo
        const isExist = articulosCarrito.some( curso => curso.id === infoCurso.id );
       
      
        
        if(isExist){
            // Actualizamos la cantidad
            const cursos = articulosCarrito.map( curso =>{
                if(curso.id === infoCurso.id){
                        curso.cantidad++;
                      
                        return curso;
                     }else{
                        return curso;
                }
            });
            articulosCarrito = [...cursos];

        }else{
            // Agregamos al carrito
            // Agregar elementos al arreglo de carrito
            articulosCarrito = [...articulosCarrito, infoCurso];
            console.log(articulosCarrito);
        }

        carritoHTML();
        actualizarNotification();

    }

    // Muestra el carrito de compras en el HTML
    function carritoHTML(){
        // Limpiar el HTML
        limpiarHTML();
        // Recorre el carrito y genera el HTML
        articulosCarrito.map( curso => {
           const {imagen, titulo, precio, cantidad, id} = curso
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src='${imagen}' width="100"></td>
                <td>${titulo}</td>
                <td>${precio}</td>
                <td>${cantidad}</td>
                <td>
                    <a href="#" class="borrar-curso" data-id="${id}">X</a>
                </td>
            `;

            // Agrega el HTML del carrito en el body
            contenedorCarrito.appendChild(row);
        });

        sincronizarStorage();

    }

    function sincronizarStorage(){
        localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
    }

    // Elimina los cursos del tbody
    function limpiarHTML(){
       // mejor performance
       while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)

       }
    }

    function actualizarNotification(){
        const totalCursos = articulosCarrito.reduce((total, curso) => total + curso.cantidad, 0);
        if(totalCursos > 0){
            notificacion.style.display = 'block';
            notificacion.textContent = totalCursos;
        }else{
            notificacion.style.display = 'none';
        }
    }