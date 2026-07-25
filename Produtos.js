/* =====================================================
   PRODUTOS.JS
===================================================== */


/* =====================================================
   VARIÁVEIS
===================================================== */

let produtos = [];

let produtoEditandoId = null;


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        carregarProdutos();

        configurarProdutos();

        renderizarProdutos();

        atualizarDashboardProdutos();

    }
);


/* =====================================================
   CARREGAR PRODUTOS
===================================================== */

function carregarProdutos() {

    const produtosSalvos =
        localStorage.getItem(
            "produtos"
        );


    if (produtosSalvos) {

        produtos =
            JSON.parse(
                produtosSalvos
            );

    } else {

        produtos = [];

    }

}


/* =====================================================
   SALVAR PRODUTOS
===================================================== */

function salvarProdutos() {

    localStorage.setItem(

        "produtos",

        JSON.stringify(
            produtos
        )

    );

}


/* =====================================================
   CONFIGURAÇÃO
===================================================== */

function configurarProdutos() {

    const formProduto =
        document.getElementById(
            "formProduto"
        );


    if (formProduto) {

        formProduto.addEventListener(

            "submit",

            salvarProduto

        );

    }


    const pesquisaProduto =
        document.getElementById(
            "pesquisaProduto"
        );


    if (pesquisaProduto) {

        pesquisaProduto.addEventListener(

            "input",

            renderizarProdutos

        );

    }

}


/* =====================================================
   SALVAR OU EDITAR PRODUTO
===================================================== */

function salvarProduto(evento) {

    evento.preventDefault();


    const nome =
        document
            .getElementById(
                "nomeProduto"
            )
            .value
            .trim();


    const custo =
        Number(

            document
                .getElementById(
                    "custoProduto"
                )
                .value

        );


    const venda =
        Number(

            document
                .getElementById(
                    "vendaProduto"
                )
                .value

        );


    const estoque =
        Number(

            document
                .getElementById(
                    "estoqueProduto"
                )
                .value

        );


    if (!nome) {

        alert(
            "Informe o nome do produto."
        );

        return;

    }


    if (custo < 0 || venda < 0) {

        alert(
            "Os valores não podem ser negativos."
        );

        return;

    }


    if (estoque < 0) {

        alert(
            "O estoque não pode ser negativo."
        );

        return;

    }


    /*
        EDITANDO PRODUTO
    */

    if (
        produtoEditandoId !== null
    ) {

        const produto =
            produtos.find(

                produto =>

                    produto.id ===
                    produtoEditandoId

            );


        if (produto) {

            produto.nome =
                nome;

            produto.custo =
                custo;

            produto.venda =
                venda;

            produto.estoque =
                estoque;

        }

    }


    /*
        CRIANDO PRODUTO
    */

    else {

        const novoProduto = {

            id: gerarIdProduto(),

            nome: nome,

            custo: custo,

            venda: venda,

            estoque: estoque

        };


        produtos.push(
            novoProduto
        );

    }


    salvarProdutos();


    renderizarProdutos();


    atualizarDashboardProdutos();


    limparFormularioProduto();


    fecharModalProduto();

}


/* =====================================================
   RENDERIZAR TABELA
===================================================== */

function renderizarProdutos() {

    const tabela =
        document.getElementById(
            "tabelaProdutos"
        );


    const mensagemVazia =
        document.getElementById(
            "produtosVazio"
        );


    if (!tabela) return;


    const campoPesquisa =
        document.getElementById(
            "pesquisaProduto"
        );


    const pesquisa =
        campoPesquisa
            ? campoPesquisa.value
                .toLowerCase()
                .trim()

            : "";


    const produtosFiltrados =
        produtos.filter(

            produto =>

                produto.nome
                    .toLowerCase()
                    .includes(
                        pesquisa
                    )

        );


    tabela.innerHTML = "";


    if (
        produtosFiltrados.length === 0
    ) {

        if (mensagemVazia) {

            mensagemVazia.style.display =
                "flex";

        }

        return;

    }


    if (mensagemVazia) {

        mensagemVazia.style.display =
            "none";

    }


    produtosFiltrados.forEach(

        produto => {

            const linha =
                document.createElement(
                    "tr"
                );


            const status =
                obterStatusEstoque(
                    produto.estoque
                );


            linha.innerHTML = `

                <td>
                    #${produto.id}
                </td>


                <td>
                    <strong>
                        ${escaparHTML(
                            produto.nome
                        )}
                    </strong>
                </td>


                <td>
                    ${formatarMoedaProduto(
                        produto.custo
                    )}
                </td>


                <td>
                    ${formatarMoedaProduto(
                        produto.venda
                    )}
                </td>


                <td>
                    ${produto.estoque}
                </td>


                <td>

                    <span
                        class="status ${status.classe}"
                    >

                        ${status.texto}

                    </span>

                </td>


                <td>

                    <div
                        class="table-actions"
                    >

                        <button
                            class="btn-edit"
                            onclick="editarProduto(
                                ${produto.id}
                            )"
                        >

                            Editar

                        </button>


                        <button
                            class="btn-danger"
                            onclick="excluirProduto(
                                ${produto.id}
                            )"
                        >

                            Excluir

                        </button>

                    </div>

                </td>

            `;


            tabela.appendChild(
                linha
            );

        }

    );

}


/* =====================================================
   STATUS DO ESTOQUE
===================================================== */

function obterStatusEstoque(
    estoque
) {

    const quantidade =
        Number(
            estoque
        );


    if (
        quantidade <= 0
    ) {

        return {

            texto: "Sem estoque",

            classe:
                "status-danger"

        };

    }


    if (
        quantidade <= 5
    ) {

        return {

            texto: "Estoque baixo",

            classe:
                "status-warning"

        };

    }


    return {

        texto: "Normal",

        classe:
            "status-normal"

    };

}


/* =====================================================
   EDITAR PRODUTO
===================================================== */

function editarProduto(
    id
) {

    const produto =
        produtos.find(

            produto =>

                produto.id === id

        );


    if (!produto) return;


    produtoEditandoId =
        id;


    document
        .getElementById(
            "produtoId"
        )
        .value =
        produto.id;


    document
        .getElementById(
            "nomeProduto"
        )
        .value =
        produto.nome;


    document
        .getElementById(
            "custoProduto"
        )
        .value =
        produto.custo;


    document
        .getElementById(
            "vendaProduto"
        )
        .value =
        produto.venda;


    document
        .getElementById(
            "estoqueProduto"
        )
        .value =
        produto.estoque;


    const titulo =
        document
            .getElementById(
                "tituloModalProduto"
            );


    if (titulo) {

        titulo.textContent =
            "Editar produto";

    }


    abrirModalProduto();

}


/* =====================================================
   EXCLUIR PRODUTO
===================================================== */

function excluirProduto(
    id
) {

    const produto =
        produtos.find(

            produto =>

                produto.id === id

        );


    if (!produto) return;


    const confirmar =
        confirm(

            `Deseja excluir o produto "${produto.nome}"?`

        );


    if (!confirmar) return;


    produtos =
        produtos.filter(

            produto =>

                produto.id !== id

        );


    salvarProdutos();


    renderizarProdutos();


    atualizarDashboardProdutos();

}


/* =====================================================
   ABRIR MODAL DE NOVO PRODUTO
===================================================== */

function abrirModalProduto() {

    const modal =
        document.getElementById(
            "modalProduto"
        );


    if (!modal) return;


    modal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   FECHAR MODAL DE PRODUTO
===================================================== */

function fecharModalProduto() {

    const modal =
        document.getElementById(
            "modalProduto"
        );


    if (!modal) return;


    modal.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";


    limparFormularioProduto();

}


/* =====================================================
   LIMPAR FORMULÁRIO
===================================================== */

function limparFormularioProduto() {

    const form =
        document.getElementById(
            "formProduto"
        );


    if (form) {

        form.reset();

    }


    const id =
        document.getElementById(
            "produtoId"
        );


    if (id) {

        id.value = "";

    }


    const titulo =
        document.getElementById(
            "tituloModalProduto"
        );


    if (titulo) {

        titulo.textContent =
            "Novo produto";

    }


    produtoEditandoId =
        null;

}


/* =====================================================
   ATUALIZAR DASHBOARD
===================================================== */

function atualizarDashboardProdutos() {

    const totalProdutos =
        document.getElementById(
            "totalProdutos"
        );


    if (totalProdutos) {

        totalProdutos.textContent =
            produtos.length;

    }


    atualizarProdutosEstoqueBaixo();

}


/* =====================================================
   PRODUTOS COM ESTOQUE BAIXO
===================================================== */

function atualizarProdutosEstoqueBaixo() {

    const container =
        document.getElementById(
            "produtosEstoqueBaixo"
        );


    if (!container) return;


    const produtosBaixos =
        produtos.filter(

            produto =>

                Number(
                    produto.estoque
                ) <= 5

        );


    if (
        produtosBaixos.length === 0
    ) {

        container.innerHTML = `

            <p class="empty-message">

                Nenhum produto com
                estoque baixo.

            </p>

        `;

        return;

    }


    container.innerHTML = "";


    produtosBaixos.forEach(

        produto => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "estoque-item";


            item.innerHTML = `

                <strong>

                    ${escaparHTML(
                        produto.nome
                    )}

                </strong>


                <span
                    class="status status-warning"
                >

                    ${produto.estoque}
                    unidades

                </span>

            `;


            container.appendChild(
                item
            );

        }

    );

}


/* =====================================================
   ID DO PRODUTO
===================================================== */

function gerarIdProduto() {

    if (
        produtos.length === 0
    ) {

        return 1;

    }


    const ids =
        produtos.map(

            produto =>

                Number(
                    produto.id
                )

        );


    return Math.max(
        ...ids
    ) + 1;

}


/* =====================================================
   FORMATAR MOEDA
===================================================== */

function formatarMoedaProduto(
    valor
) {

    return Number(
        valor || 0
    ).toLocaleString(

        "pt-BR",

        {

            style: "currency",

            currency: "BRL"

        }

    );

}


/* =====================================================
   PROTEÇÃO CONTRA HTML
===================================================== */

function escaparHTML(
    texto
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        texto;


    return div.innerHTML;

        }
