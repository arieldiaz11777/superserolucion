document.getElementById('enhanceButton').addEventListener('click', async function () {
    const imgElement = document.getElementById('originalImage');
    const errorElement = document.createElement('p');
    errorElement.style.color = 'red';

    try {
        if (imgElement.src) {
            // Mostramos un mensaje de cargando mientras se mejora la imagen
            errorElement.textContent = 'Cargando modelo y mejorando imagen...';
            document.body.appendChild(errorElement);

            // Cargar el modelo de TensorFlow.js (reemplaza la URL por la del modelo correcto)
            const model = await tf.loadGraphModel('URL_DEL_MODELO/model.json');

            // Convertir la imagen a un tensor
            const inputTensor = tf.browser.fromPixels(imgElement).expandDims(0).toFloat();
            
            // Realizar la predicción con el modelo
            const enhancedImageTensor = model.predict(inputTensor);
            
            // Quitar la dimensión extra del tensor
            const enhancedImage = enhancedImageTensor.squeeze();

            // Crear un canvas para mostrar la imagen mejorada
            const canvas = document.createElement('canvas');
            canvas.width = enhancedImage.shape[1];
            canvas.height = enhancedImage.shape[0];
            const ctx = canvas.getContext('2d');

            // Convertir el tensor mejorado en una imagen visible
            const imageData = new ImageData(
                new Uint8ClampedArray(enhancedImage.dataSync()),
                enhancedImage.shape[1],
                enhancedImage.shape[0]
            );
            ctx.putImageData(imageData, 0, 0);

            // Mostrar la imagen mejorada en la página
            document.getElementById('enhancedImage').src = canvas.toDataURL();

            // Limpiar el mensaje de cargando
            errorElement.textContent = '';
        } else {
            alert("Primero sube una imagen.");
        }
    } catch (error) {
        // Mostrar el error en la página
        errorElement.textContent = 'Error al procesar la imagen: ' + error.message;
        document.body.appendChild(errorElement);
        console.error('Error:', error); // También registrar el error en la consola
    }
});
