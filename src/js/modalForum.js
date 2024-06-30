async function fetchTags() {
    try {
        const response = await fetch('https://localhost:7248/api/Tag/ListarTags');
        if (response.ok) {
            const tags = await response.json();
            return tags;
        } else {
            const errorMessage = await response.text();
            console.error('Erro ao buscar tags:', errorMessage);
            return [];
        }
    } catch (error) {
        console.error('Ocorreu um erro ao buscar as tags:', error);
        return [];
    }
}

async function populateTagDropdown() {
    console.log("Populando dropdown de tags"); // Adicionado log
    const tags = await fetchTags();
    const dropdown = $('#descricaoTagForum');
    dropdown.empty();
    dropdown.append('<option value="" selected disabled>Selecione uma tag</option>');
    if (tags.length > 0) {
        tags.forEach(tag => {
            dropdown.append(`<option value="${tag}">${tag}</option>`);
        });
    } else {
        console.warn('Nenhuma tag encontrada'); // Log se nenhuma tag for encontrada
    }
}

$(function() {
    console.log("Modal carregado e pronto");

    // Popula o dropdown de tags ao abrir o modal
    $('#modalAdicionarForum').on('shown.bs.modal', function() {
        populateTagDropdown();
    });

    // Função para salvar fórum
    $('#btnSalvarForum').on('click', async function() {
        const usuarioCadastroForum = $('#usuarioCadastroForum').val();
        const tituloForum = $('#tituloForum').val();
        const conteudoForum = $('#conteudoForum').val();
        const descricaoTagForum = $('#descricaoTagForum').val();

        // Remove classes de erro existentes
        $('.form-control').removeClass('is-invalid');

        if (usuarioCadastroForum && tituloForum && conteudoForum && descricaoTagForum) {
            const success = await AdicionarForum(usuarioCadastroForum, tituloForum, conteudoForum, descricaoTagForum);
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
            if (!descricaoTagForum) {
                $('#descricaoTagForum').addClass('is-invalid');
            }
        }
    });
});

async function AdicionarForum(usuarioCadastroForum, tituloForum, conteudoForum, descricaoTagForum) {
    try {
        const requestBody = {
            usuarioCadastroForum,
            tituloForum,
            conteudoForum,
            descricaoTagForum
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
