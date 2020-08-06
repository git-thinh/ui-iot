
fetch('https://www.oxfordlearnersdictionaries.com/wordlists/oxford3000-5000', {
    credentials: "include"
}).then(r => r.text()).then(console.log)

