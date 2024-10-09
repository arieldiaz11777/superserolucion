document.getElementById('upload').addEventListener('change', handleImageUpload);
document.getElementById('enhanceBtn').addEventListener('click', enhanceImageFromInput);

let model; // Variable global para almacenar el modelo

async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.onload = () => {
        // Habilitar el botón de mejora
        document.getElementById('enhanceBtn').disabled = false;
        document.getElementById('canvas').width = img.width;
        document.getElementById('canvas').height = img.height;

        const ctx = document.getElementById('canvas').getContext('2d');
        ctx.drawImage(img, 0, 0);
    };
}

async function enhanceImageFromInput() {
    document.getElementById('loadingMessage').classList.remove('hidden');

    // Si el modelo no está cargado, cárgalo
    if (!model) {
        model = await tf.loadGraphModel('https://tfhub.dev/captain-pool/esrgan-tf2/1');
    }

    const canvas = document.getElementById('canvas');
    const imgTensor = tf.browser.fromPixels(canvas);
    const enhancedTensor = await enhanceImage(imgTensor);
    const outputImage = document.getElementById('enhancedImage');

    // Mostrar imagen mejorada
    await tf.browser.toPixels(enhancedTensor, canvas);
    outputImage.src = canvas.toDataURL();

    // Mostrar el contenedor de salida
    document.getElementById('output').classList.remove('hidden');
    document.getElementById('loadingMessage').classList.add('hidden'); // Ocultar mensaje de carga
}

async function enhanceImage(imgTensor) {
    const resizedImage = tf.image.resizeBilinear(imgTensor, [256, 256]); // Redimensionar si es necesario
    const normalizedImage = resizedImage.div(255.0); // Normalizar
    const input = normalizedImage.expandDims(0); // Añadir dimensión

    // Mejorar la imagen
    const output = model.predict(input);
    return output.squeeze().clipByValue(0, 1); // Procesar la salida
}
