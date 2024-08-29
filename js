document.addEventListener('DOMContentLoaded', function() {
    var colorWheelContainer = document.getElementById('colorWheelContainer');
    var colorWheel = new iro.ColorPicker(colorWheelContainer, {
        width: 200,
        color: "#f00"
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
    });

    // Update the harmony colors when the harmony type is changed
    document.getElementById('harmonyType').addEventListener('change', function() {
        updateHarmonyColors(colorWheel.color.hexString);
    });

    // Initialize the color wheel with the default color
    updateHarmonyColors(colorWheel.color.hexString);
});

function getSelectedValues() {
    const elementIds = [
        "person",
        "home_room",
        "design_style",
        "generated_artwork",
        "point_of_view",
        "color_scheme",
        "camera_select",
        "film_grain",
        "action_select",
        "person_descriptor",
        "room_size",
        "space_to_be_designed",
        "children_room",
        "pool",
        "landscaping_options",
        "garden",
        "room_shape",
        "inspired_by_this_interior_design_magazine",
        "furniture_provided_by_this_vendor",
        "furniture_pattern",
        "seating_upholstery_pattern",
        "designed_by_this_interior_designer",
        "designed_by_this_architect",
        "lens_used",
        "photo_lighting_type",
        "illumination",
        "door",
        "windows",
        "ceiling_design",
        "roof_material",
        "roof_height",
        "wall_type",
        "wall_cladding",
        "walls_pattern",
        "exterior_finish",
        "exterior_trim_molding",
        "facade_pattern",
        "floors",
        "kitchen_layout",
        "countertop_material",
        "backsplash_design",
        "cabinet_storage_design",
        "appliance_style_finish",
        "bathroom_fixture_style",
        "bathroom_tile_design",
        "bathroom_vanity_style",
        "shower_bathtub_design",
        "bathroom_lighting_fixtures",
        "fireplace_design",
        "balcony_design",
        "material",
        "ceramic_material",
        "fabric",
        "stone_material",
        "marble_material",
        "wood_material",
        "decorative_elements",
        "type_select",
        "photo_location",
        "hairstyle_select"
    ];

    const colorElements = [
        { id: "dominant_color", switchId: "use_colors" },
        { id: "secondary_color", switchId: "use_colors" },
        { id: "accent_color", switchId: "use_colors" },
        { id: "walls_paint_color", switchId: "use_walls_paint_color" },
        { id: "furniture_color", switchId: "use_furniture_color" }
    ];

    const values = {};

    // Capture values for general elements
    elementIds.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            values[elementId] = element.value;
        }
    });

    // Capture values for color elements
    colorElements.forEach(colorElement => {
        const colorInput = document.getElementById(colorElement.id);
        const colorSwitch = document.getElementById(colorElement.switchId);
        const colorNameSpan = document.getElementById(`${colorElement.id}_name`);

        if (colorInput && colorSwitch) {
            const updateColor = () => {
                const hexColor = colorInput.value;
                const n_match = ntc.name(hexColor);
                const colorName = n_match[1]; // Only the color name

                if (colorSwitch.checked) {
                    values[colorElement.id] = `${colorName} (${hexColor})`; // Save the color name and HEX
                    colorNameSpan.textContent = colorName; // Display the color name under the picker
                } else {
                    values[colorElement.id] = ""; // Assign an empty value if the switch is off
                    colorNameSpan.textContent = ""; // Clear the displayed color name
                }
            };

            // Listen for changes in the color input and the checkbox
            colorInput.addEventListener('input', updateColor);
            colorSwitch.addEventListener('change', updateColor);

            // Initialize the color name when the page loads
            updateColor();
        }
    });

    // Capture the selected colors from the color wheel
    const selectedColors = colorWheel.colors.map(c => c.hexString);
    values['harmony_colors'] = selectedColors; // Add the selected colors to the values object

    return values;
}
