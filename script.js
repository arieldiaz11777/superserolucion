let model;

async function loadModel() {
    document.getElementById('loadingMessage').classList.remove('hidden');
    model = await tf.loadGraphModel('https://cors-anywhere.herokuapp.com/https://tfhub.dev/captain-pool/esrgan-tf2/1');
    document.getElementById('loadingMessage').classList.add('hidden');
}

async function enhanceImage(image) {
    document.getElementById('loadingMessage2').classList.remove('hidden');
    
    const imgTensor = tf.browser.fromPixels(image);
    const enhancedTensor = model.execute({input: imgTensor.expandDims(0)});
    
    const enhancedImageData = await tf.browser.toPixels(enhancedTensor.squeeze());
    
    const enhancedImageElement = document.getElementById('enhancedImage');
    enhancedImageElement.src = createImageFromData(enhancedImageData, image.width, image.height);
    enhancedImageElement.classList.remove('hidden');

    document.getElementById('loadingMessage2').classList.add('hidden');
}

function createImageFromData(data, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imageData = new ImageData(new Uint8ClampedArray(data), width, height);
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
}

document.getElementById('processBtn').addEventListener('click', () => {
    const imageInput = document.getElementById('imageInput');
    if (imageInput.files.length > 0) {
        const originalImageElement = document.getElementById('originalImage');
        const file = imageInput.files[0];
        const reader = new FileReader();
        
        reader.onload = (event) => {
            originalImageElement.src = event.target.result;
            originalImageElement.classList.remove('hidden');
            enhanceImage(originalImageElement);
        };
        reader.readAsDataURL(file);
    }
});

// Cargar el modelo al inicio
loadModel();
