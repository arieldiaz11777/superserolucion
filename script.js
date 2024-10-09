// Cargar y mostrar la imagen original cuando el usuario la sube
document.getElementById('imageInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('originalImage').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Función para mejorar la imagen al hacer clic en el botón
document.getElementById('enhanceButton').addEventListener('click', async function () {
    const imgElement = document.getElementById('originalImage');
    const errorElement = document.createElement('p');
    errorElement.style.color = 'red';

    try {
        if (imgElement.src) {
            // Mostrar un mensaje de cargando mientras se mejora la imagen
            errorElement.textContent = 'Cargando modelo y mejorando imagen...';
            document.body.appendChild(errorElement);

            // Cargar el modelo de super-resolución (reemplaza la URL con la correcta)
            const model = await tf.loadGraphModel('URL_DEL_MODELO/model.json');

            // Convertir la imagen a tensor
            const inputTensor = tf.browser.fromPixels(imgElement).expandDims(0).toFloat();
            
            // Realizar la predicción con el modelo cargado
            const enhancedImageTensor = model.predict(inputTensor);
            
            // Convertir el tensor de vuelta a imagen visible
            const enhancedImage = enhancedImageTensor.squeeze(); // Quitar la dimensión adicional

            // Crear un canvas para mostrar la imagen mejorada
            const canvas = document.createElement('canvas');
            canvas.width = enhancedImage.shape[1];
            canvas.height = enhancedImage.shape[0];
            const ctx = canvas.getContext('2d');

            // Crear la imagen a partir del tensor mejorado
            const imageData = new ImageData(
                new Uint8ClampedArray(enhancedImage.dataSync()),
                enhancedImage.shape[1],
                enhancedImage.shape[0]
            );
            ctx.putImageData(imageData, 0, 0);

            // Mostrar la imagen mejorada en el elemento de imagen
            document.getElementById('enhancedImage').src = canvas.toDataURL();

            // Borrar mensaje de cargando
            errorElement.textContent = '';
        } else {
            alert("Primero sube una imagen.");
        }
    } catch (error) {
        // Mostrar el error en la página
        errorElement.textContent = 'Error al procesar la imagen: ' + error.message;
        document.body.appendChild(errorElement);
        console.error('Error:', error); // También loguear el error en la consola
    }
});
