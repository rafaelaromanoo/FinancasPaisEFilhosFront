async function AdicionarForum(usuarioCadastroForum, tituloForum, conteudoForum) {
    try {
        const requestBody = {
            usuarioCadastroForum,
            tituloForum,
            conteudoForum
        };

        const response = await fetch('https://localhost:7248/api/Forum/AdicionarForum', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Fórum adicionado com sucesso:', data);
            return true;
        } else {
            const errorMessage = await response.text();
            console.error('Erro ao tentar adicionar um novo fórum:', errorMessage);
            return false;
        }
    } catch (error) {
        console.error('Ocorreu um erro ao carregar os fóruns:', error);
        return false;
    }
}

$(function() {
    console.log("Modal carregado e pronto");

    // Função para salvar fórum
    $('#btnSalvarForum').on('click', async function() {
        console.log("Clique no botão salvar");
        const usuarioCadastroForum = $('#usuarioCadastroForum').val();
        const tituloForum = $('#tituloForum').val();
        const conteudoForum = $('#conteudoForum').val();

        // Remove classes de erro existentes
        $('.form-control').removeClass('is-invalid');

        if (usuarioCadastroForum && tituloForum && conteudoForum) {
            const success = await AdicionarForum(usuarioCadastroForum, tituloForum, conteudoForum);
            if (success) {
                $('#modalAdicionarForum').modal('hide'); // Fecha o modal após salvar
                location.reload(); // Recarrega a página
            } else {
                alert("Erro ao tentar adicionar um novo fórum.");
            }
        } else {
            // Adiciona classes de erro aos campos vazios
            if (!usuarioCadastroForum) {
                $('#usuarioCadastroForum').addClass('is-invalid');
            }
            if (!tituloForum) {
                $('#tituloForum').addClass('is-invalid');
            }
            if (!conteudoForum) {
                $('#conteudoForum').addClass('is-invalid');
            }
        }
    });
});
