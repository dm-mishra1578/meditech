document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');
    const fileName = document.getElementById('fileName');
    const styleIntensity = document.getElementById('styleIntensity');
    const intensityValue = document.getElementById('intensityValue');
    const colorPalette = document.getElementById('colorPalette');
    const convertBtn = document.getElementById('convertBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const originalCanvas = document.getElementById('originalCanvas');
    const convertedCanvas = document.getElementById('convertedCanvas');
    
    let originalImage = null;
    let convertedImage = null;
    
    // Update intensity value display
    styleIntensity.addEventListener('input', function() {
        intensityValue.textContent = this.value;
    });
    
    // Handle image upload
    imageUpload.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            fileName.textContent = file.name;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                originalImage = new Image();
                originalImage.onload = function() {
                    drawOriginalImage();
                    convertBtn.disabled = false;
                };
                originalImage.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Draw original image on canvas
    function drawOriginalImage() {
        const ctx = originalCanvas.getContext('2d');
        
        // Set canvas dimensions to match image
        originalCanvas.width = Math.min(originalImage.width, 500);
        originalCanvas.height = (originalImage.height / originalImage.width) * originalCanvas.width;
        
        ctx.drawImage(originalImage, 0, 0, originalCanvas.width, originalCanvas.height);
    }
    
    // Convert to Gubli style
    convertBtn.addEventListener('click', function() {
        if (!originalImage) return;
        
        // Set converted canvas to same size as original
        convertedCanvas.width = originalCanvas.width;
        convertedCanvas.height = originalCanvas.height;
        
        const ctx = convertedCanvas.getContext('2d');
        ctx.drawImage(originalImage, 0, 0, convertedCanvas.width, convertedCanvas.height);
        
        // Apply Gubli effect
        applyGubliEffect();
        
        downloadBtn.disabled = false;
    });
    
    // Apply the Gubli effect to the image
    function applyGubliEffect() {
        const ctx = convertedCanvas.getContext('2d');
        const intensity = parseInt(styleIntensity.value);
        const palette = colorPalette.value;
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, convertedCanvas.width, convertedCanvas.height);
        const data = imageData.data;
        
        // Apply effects based on settings
        for (let i = 0; i < data.length; i += 4) {
            // Get RGB values
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Apply different effects based on palette
            switch(palette) {
                case 'vibrant':
                    data[i] = Math.min(r * (1 + intensity/20), 255); // Boost red
                    data[i + 1] = g * (1 - intensity/40); // Reduce green
                    data[i + 2] = Math.min(b * (1 + intensity/15), 255); // Boost blue
                    break;
                case 'pastel':
                    data[i] = Math.min(r + intensity * 5, 255);
                    data[i + 1] = Math.min(g + intensity * 5, 255);
                    data[i + 2] = Math.min(b + intensity * 5, 255);
                    // Reduce contrast
                    const avg = (r + g + b) / 3;
                    data[i] = avg * 0.6 + r * 0.4;
                    data[i + 1] = avg * 0.6 + g * 0.4;
                    data[i + 2] = avg * 0.6 + b * 0.4;
                    break;
                case 'monochrome':
                    const grayscale = r * 0.3 + g * 0.59 + b * 0.11;
                    data[i] = grayscale;
                    data[i + 1] = grayscale;
                    data[i + 2] = grayscale;
                    break;
                case 'highContrast':
                    const threshold = 128 + (intensity * 5);
                    const brightness = (r + g + b) / 3;
                    const newVal = brightness > threshold ? 255 : 0;
                    data[i] = newVal;
                    data[i + 1] = newVal;
                    data[i + 2] = newVal;
                    break;
            }
            
            // Add some noise for artistic effect
            if (intensity > 5) {
                const noise = (Math.random() - 0.5) * intensity * 5;
                data[i] = Math.min(Math.max(data[i] + noise, 0), 255);
                data[i + 1] = Math.min(Math.max(data[i + 1] + noise, 0), 255);
                data[i + 2] = Math.min(Math.max(data[i + 2] + noise, 0), 255);
            }
        }
        
        // Apply pixelation effect based on intensity
        if (intensity > 3) {
            const pixelSize = Math.max(1, Math.floor(intensity / 2));
            pixelate(convertedCanvas, pixelSize);
        }
        
        // Put the modified data back
        ctx.putImageData(imageData, 0, 0);
    }
    
    // Pixelation effect
    function pixelate(canvas, pixelSize) {
        const ctx = canvas.getContext('2d');
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        // Set temporary canvas to smaller size
        const w = canvas.width;
        const h = canvas.height;
        tempCanvas.width = w / pixelSize;
        tempCanvas.height = h / pixelSize;
        
        // Draw original image scaled down
        tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
        
        // Draw scaled up version back to original canvas
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, w, h);
    }
    
    // Download converted image
    downloadBtn.addEventListener('click', function() {
        if (!convertedImage) return;
        
        const link = document.createElement('a');
        link.download = 'gubli-image.png';
        link.href = convertedCanvas.toDataURL('image/png');
        link.click();
    });
});