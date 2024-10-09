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

document.getElementById('enhanceButton').addEventListener('click', async function () {
    const imgElement = document.getElementById('originalImage');
    const errorElement = document.createElement('p');
    errorElement.style.color = 'red';

    try {
        if (imgElement.src) {
            // Mostramos un mensaje de cargando mientras se mejora la imagen
            errorElement.textContent = 'Cargando modelo y mejorando imagen...';
            document.body.appendChild(errorElement);

            const model = await superResolution.load(); // Cargar el modelo
            const enhancedImage = await model.enhance(imgElement); // Mejorar la imagen

            // Convertimos la imagen mejorada a un formato visible
            const canvas = document.createElement('canvas');
            canvas.width = enhancedImage.shape[1];
            canvas.height = enhancedImage.shape[0];
            const ctx = canvas.getContext('2d');

            const imageData = new ImageData(
                new Uint8ClampedArray(enhancedImage.dataSync()),
                enhancedImage.shape[1],
                enhancedImage.shape[0]
            );

            ctx.putImageData(imageData, 0, 0);
            document.getElementById('enhancedImage').src = canvas.toDataURL();

            errorElement.textContent = ''; // Borrar mensaje de cargando
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
