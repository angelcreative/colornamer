 document.addEventListener('DOMContentLoaded', function() {
        var colorWheelContainer = document.getElementById('colorWheelContainer');
        var hexInput = document.getElementById('hexInput');
        
        var colorWheel = new iro.ColorPicker(colorWheelContainer, {
            width: 200,
            color: "#f00"
        });

        function updateHarmonyColors(baseColor) {
            const harmonyType = document.getElementById('harmonyType')?.value || 'complementary';
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
            // Remove existing indicators
            colorWheelContainer.querySelectorAll('.colorIndicator').forEach(indicator => indicator.remove());

            // Add new indicators
            const wheelRadius = colorWheelContainer.offsetWidth / 2;
            const centerX = wheelRadius;
            const centerY = wheelRadius;

            colors.forEach((color, index) => {
                if (index === 0) return; // Skip the base color

                const hue = chroma(color).get('hsl.h');
                const angleRadians = (hue * Math.PI / 180); // Convert hue to radians
                const indicatorX = centerX + wheelRadius * Math.cos(angleRadians);
                const indicatorY = centerY - wheelRadius * Math.sin(angleRadians); // Note the subtraction here to correct the direction

                const indicator = document.createElement('div');
                indicator.classList.add('colorIndicator');
                indicator.style.position = 'absolute';
                indicator.style.left = `${indicatorX}px`;
                indicator.style.top = `${indicatorY}px`;
                indicator.style.transform = 'translate(-50%, -50%)'; // Center the indicator on the point
                indicator.style.backgroundColor = color;

                colorWheelContainer.appendChild(indicator);
            });
        }

        function displayColorCards(colors) {
            const colorCardsContainer = document.getElementById('colorCards');
            colorCardsContainer.innerHTML = ''; // Clear previous cards

            colors.forEach(color => {
                const rgbColor = chroma(color).rgb();
                const [r, g, b] = rgbColor;
                let colorName = ntc.name(color)[1]; // Get color name using ntc.js

                // Remove the "Color RGB" part from the color name
                colorName = colorName.replace(/ Color RGB.*/, '');

                // Get HEX and HSL values
                const hexColor = chroma(color).hex();
                const hslColor = chroma(color).hsl().map(value => value.toFixed(2));

                // Determine if text should be light or dark based on the color's luminance
                const textColor = chroma(color).luminance() > 0.5 ? '#000000' : '#ffffff';

                // Create a new card for each color
                const cardDiv = document.createElement('div');
                cardDiv.classList.add('colorCard');
                cardDiv.style.backgroundColor = color;
                cardDiv.style.color = textColor; // Set the text color dynamically
                cardDiv.innerHTML = `
                    <div style="background-color:${color};width:50px;height:50px;margin-bottom:5px;"></div>
                    <p>${colorName}</p>
                    <p>RGB: ${r} ${g} ${b}</p>
                    <p>HEX: ${hexColor}</p>
                    <p>HSL: ${hslColor[0]} ${hslColor[1]} ${hslColor[2]}</p>
                `;
                colorCardsContainer.appendChild(cardDiv);
            });
        }

        // Listen to color wheel changes
        colorWheel.on(['color:init', 'color:change'], function(color) {
            updateHarmonyColors(color.hexString);
            hexInput.value = color.hexString; // Update the hex input field
        });

        // Update the harmony colors when the harmony type is changed
        document.getElementById('harmonyType')?.addEventListener('change', function() {
            updateHarmonyColors(colorWheel.color.hexString);
        });

        // Handle hex input changes
        hexInput.addEventListener('input', function() {
            const hexValue = hexInput.value.trim();
            if (chroma.valid(hexValue)) {
                colorWheel.color.hexString = hexValue; // Update the color wheel's position
            }
        });

        // Initialize the color wheel with the default color
        updateHarmonyColors(colorWheel.color.hexString);
    });
