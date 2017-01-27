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

var inputs = document.getElementsByTagName('input'),
    variables = new Object;

for (var i = 0; i < inputs.length; i++) {
    if ((' ' + inputs[i].className + ' ').indexOf(' style ') > -1) {
        var name = inputs[i].name,
            value = inputs[i].value;

        variables["@" + name] = value;
        updateTheme(name, value);

        inputs[i].addEventListener('input', function (e) {
            var name = e.target.name,
                value = e.target.value;

            variables["@" + name] = value;

            updateTheme(name, value);
            less.modifyVars(variables);
            less.refreshStyles();
        }, false);
    }
}

function updateTheme(variable, value) {
    var els = document.getElementsByClassName(variable);
    for (var i = 0; i < els.length; i++) {
        value = value.replace(/#/g, '');
        els[i].innerHTML = value;
    }
}