var themes, defaultTheme = "Bright";

main();

/**
 * This is the begining.
 */
function main() {
    initClipboard();
    loadThemes(function () {
        // And finally display albert to the public
        document.getElementById('albert').style.display = 'block';
        document.getElementById('options').style.display = 'block';
    });

    // Get all inputs with the 'style' class and add an event listener
    var inputs = [].slice.call(document.querySelectorAll('.style'));
    inputs.forEach(function (input) {
        input.addEventListener('input', function () {
            updateTheme(input.name, input.value);
        });
    });
}

/**
 * Init the clipboard plugin.
 */
function initClipboard() {
    var clipboard = new Clipboard(".theme button", {
        text: function () {
            return document.getElementById("result").innerText;
        }
    });

    clipboard.on('success', function (e) {
        var trigger = e.trigger,
            original = trigger.innerHTML;

        trigger.innerHTML = "Copied!";
        setTimeout(function () {
            trigger.innerHTML = original;
        }, 1000);
    });
}

function loadThemes(callback) {
    var XmlHttpRequest = new XMLHttpRequest();
    XmlHttpRequest.overrideMimeType("application/json");
    XmlHttpRequest.open('GET', '../themes.json', true);
    XmlHttpRequest.onreadystatechange = function () {
        if (XmlHttpRequest.readyState == 4 && XmlHttpRequest.status == "200") {
            themes = JSON.parse(XmlHttpRequest.responseText);

            // We set the first theme to be the base theme, since it's the default one in albert
            for (var prop in themes[defaultTheme]) {
                updateTheme(prop, themes[defaultTheme][prop]);

                var els = document.querySelectorAll("[name='" + prop + "']");
                for (var i = 0; i < els.length; i++) {
                    els[i].value = themes[defaultTheme][prop];
                }
            }

            callback();
        }
    }
    XmlHttpRequest.send(null);
}

/**
 * Update the theme with the user's changes.
 *
 * @param el
 */
function updateTheme(propName, propValue) {
    var original = propValue;

    if (propName == 'item_selected_color' || propName == 'action_list_selected_color') {
        propValue = hexToRgbA(propValue, 0.2);
    }

    // Update the style in realtime
    document.documentElement.style.setProperty('--' + propName, propValue, "");

    // Update the to be qss file
    var els = document.querySelectorAll('.' + propName);
    for (var i = 0; i < els.length; i++) {
        original = original.replace(/#/g, '');
        els[i].innerHTML = original;
    }
}

/**
 *
 * @returns {string}
 */
function hexToRgbA(hex, transparency) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ', ' + transparency + ')';
    }
    throw new Error('Bad Hex');
}