document.addEventListener("DOMContentLoaded", function() {
    fetch('/src/styles/header.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('header').innerHTML = data;
        });
});
