document.getElementById('cadastroPetForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const cadastro = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        "pet-name": document.getElementById('pet-name').value.trim(),
        "pet-age": parseInt(document.getElementById('pet-age').value, 10),
        "pet-species": document.getElementById('pet-species').value,
        message: document.getElementById('message').value.trim()
    };

    if (!cadastro.name || !cadastro.email || !cadastro["pet-name"] || isNaN(cadastro["pet-age"]) || !cadastro["pet-species"]) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    fetch("http://localhost:3003/cadastro-pet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cadastro)
    })
    .then(async response => {
        const text = await response.text();
        console.log('Resposta do servidor:', text);
        if (!response.ok) {
            let errorData;
            try {
                errorData = JSON.parse(text);
            } catch {
                throw new Error(text);
            }
            throw new Error(errorData.message || errorData.error || 'Erro desconhecido');
        }
        return JSON.parse(text);
    })
    .then(data => {
        document.getElementById('status').textContent = data.message;
        document.getElementById('cadastroPetForm').reset();
    })
    .catch(error => {
        console.error(error);
        alert("Erro ao cadastrar pet: " + error.message);
    });
});