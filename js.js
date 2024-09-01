document.addEventListener('DOMContentLoaded', function() {
    var colorWheelContainer = document.getElementById('colorWheelContainer');
    var hexInput = document.getElementById('hexInput');

    var colorWheel = new iro.ColorPicker(colorWheelContainer, {
        width: 200,
        color: "#91baad"
    });

    function updateHarmonyColors(baseColor) {
        const harmonyType = document.getElementById('harmonyType').value;
        const colors = getHarmonyColors(baseColor, harmonyType);
        displayColors(colors);
        updateColorIndicators(colors);
        displayColorCards(colors);
    }

    function getHarmonyColors(color, type) {
        const baseColor = chroma(color);
        const baseHue = baseColor.get('hsl.h');
        const baseSaturation = baseColor.get('hsl.s');
        const baseLightness = baseColor.get('hsl.l');
        let hues;

        switch (type) {
            case 'complementary':
                hues = [baseHue, (baseHue + 180) % 360];
                break;
            case 'analogous':
                hues = [(baseHue - 30 + 360) % 360, baseHue, (baseHue + 30) % 360];
                break;
            case 'triadic':
                hues = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
                break;
            case 'square':
                hues = [baseHue, (baseHue + 90) % 360, (baseHue + 180) % 360, (baseHue + 270) % 360];
                break;
        }

        return hues.map(hue => chroma.hsl(hue, baseSaturation, baseLightness).hex());
    }

    function displayColors(colors) {
        const harmonyColors = document.getElementById('harmonyColors');
        harmonyColors.innerHTML = '';
        colors.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.style.backgroundColor = color;
            harmonyColors.appendChild(colorDiv);
        });
    }

    function updateColorIndicators(colors) {
        colorWheelContainer.querySelectorAll('.colorIndicator').forEach(indicator => indicator.remove());

        const wheelRadius = colorWheelContainer.offsetWidth / 2;
        const centerX = wheelRadius;
        const centerY = wheelRadius;

        colors.forEach((color, index) => {
            if (index === 0) return;

            const hue = chroma(color).get('hsl.h');
            const angleRadians = (hue * Math.PI / 180);
            const indicatorX = centerX + wheelRadius * Math.cos(angleRadians);
            const indicatorY = centerY - wheelRadius * Math.sin(angleRadians);

            const indicator = document.createElement('div');
            indicator.classList.add('colorIndicator');
            indicator.style.position = 'absolute';
            indicator.style.left = `${indicatorX}px`;
            indicator.style.top = `${indicatorY}px`;
            indicator.style.transform = 'translate(-50%, -50%)';
            indicator.style.backgroundColor = color;

            colorWheelContainer.appendChild(indicator);
        });
    }

function generateColorPalettes(baseColors, selectedColor) {
    const paletteContainer = document.createElement('div');
    paletteContainer.id = 'paletteContainer';
    paletteContainer.style.display = 'flex';
    paletteContainer.style.flexDirection = 'column';
    paletteContainer.style.gap = '20px';
    paletteContainer.style.width = '100%';

    baseColors.forEach(color => {
        let colorName = ntc.name(color)[1];
        colorName = colorName.replace(/-color.*$/i, '').trim(); // Remove "-color" and everything after it, case-insensitive

        const palette = document.createElement('div');
        palette.style.display = 'flex';
        palette.style.flexDirection = 'row';
        palette.style.gap = '10px';
        palette.style.flexWrap = 'wrap';

        // Create the lightest value (50)
        let paletteColor = chroma(color).set('hsl.l', 0.95).hex(); // Very light color
        let hexColor = paletteColor.toUpperCase();
        let card = createColorCard('50', hexColor, paletteColor, selectedColor);
        palette.appendChild(card);

        for (let i = 1; i <= 9; i++) {  // Light to dark (100 to 900)
            const lightness = 1 - (i * 0.1);
            paletteColor = chroma(color).set('hsl.l', lightness).hex();
            hexColor = paletteColor.toUpperCase();
            card = createColorCard(`${i * 100}`, hexColor, paletteColor, selectedColor);
            palette.appendChild(card);
        }

        const paletteTitle = document.createElement('h4');
        paletteTitle.textContent = colorName;  // Use the cleaned-up color name
        paletteContainer.appendChild(paletteTitle);
        paletteContainer.appendChild(palette);
    });

    document.getElementById('colorCards').appendChild(paletteContainer);
}

  
  
function createColorCard(tokenName, hexColor, paletteColor, selectedColor) {
    const card = document.createElement('div');
    card.classList.add('colorCard', 'gradientCard');
    card.style.backgroundColor = paletteColor;
    card.style.color = chroma(paletteColor).luminance() > 0.5 ? '#333333' : '#ffffff';
    card.style.width = '80px';
    card.style.height = '80px'; 
    card.style.borderRadius = '8px'; 
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.justifyContent = 'center';
    card.style.alignItems = 'center';
    card.style.fontFamily = 'Arial, sans-serif';
    card.style.fontSize = '14px';

    // Highlight the matching color
    if (chroma.valid(selectedColor) && chroma(paletteColor).hex() === chroma(selectedColor).hex()) {
        card.style.border = '3px solid #000000';
    }

    card.innerHTML = `
        <div style="font-size: 14px; font-weight: bold;">${tokenName}</div>
        <div style="font-size: 14px; margin-top: 4px;">${hexColor}</div>
    `;

    return card;
}
  
function updateHarmonyColors(baseColor) {
    const harmonyType = document.getElementById('harmonyType').value;
    const colors = getHarmonyColors(baseColor, harmonyType);
    displayColors(colors);
    updateColorIndicators(colors);
    displayColorCards(colors, baseColor);
}

    function displayColorCards(colors) {
        const colorCardsContainer = document.getElementById('colorCards');
        colorCardsContainer.innerHTML = '';

        colors.forEach(color => {
            const rgbColor = chroma(color).rgb();
            const [r, g, b] = rgbColor;
            let colorName = ntc.name(color)[1];

            colorName = colorName.replace(/ Color RGB.*/, '');

            const hexColor = chroma(color).hex();
            const hslColor = chroma(color).hsl().map(value => value.toFixed(2));

            const textColor = chroma(color).luminance() > 0.5 ? '#000000' : '#ffffff';

            const cardDiv = document.createElement('div');
            cardDiv.classList.add('colorCard');
            cardDiv.style.backgroundColor = color;
            cardDiv.style.color = textColor;
            cardDiv.innerHTML = `
                
                <p>${colorName}</p>
                <p>RGB: ${r} ${g} ${b}</p>
                <p>HEX: ${hexColor}</p>
                <p>HSL: ${hslColor[0]} ${hslColor[1]} ${hslColor[2]}</p>
            `;
            colorCardsContainer.appendChild(cardDiv);
        });

        generateColorPalettes(colors);
    }

    colorWheel.on(['color:init', 'color:change'], function(color) {
        updateHarmonyColors(color.hexString);
        hexInput.value = color.hexString; // Update the hex input field when the color changes
    });

    document.getElementById('harmonyType').addEventListener('change', function() {
        updateHarmonyColors(colorWheel.color.hexString);
    });

    hexInput.addEventListener('input', function() {
        const hexValue = hexInput.value.trim();
        if (chroma.valid(hexValue)) {
            colorWheel.color.hexString = hexValue; // Update the color wheel's position and harmony colors
        }
    });

    updateHarmonyColors(colorWheel.color.hexString);
});
