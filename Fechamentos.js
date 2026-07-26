/* =====================================================
   FECHAMENTOS.JS
===================================================== */


/* =====================================================
   VARIÁVEIS
===================================================== */

let fechamentos = [];

let fechamentoEditandoId = null;


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        carregarFechamentos();

        configurarFechamentos();

        renderizarFechamentos();

        atualizarResumoFechamentos();

        atualizarUltimosFechamentos();

    }
);


/* =====================================================
   CARREGAR FECHAMENTOS
===================================================== */

function carregarFechamentos() {

    const dadosSalvos =
        localStorage.getItem(
            "fechamentos"
        );


    if (dadosSalvos) {

        fechamentos =
            JSON.parse(
                dadosSalvos
            );

    } else {

        fechamentos = [];

    }

}


/* =====================================================
   SALVAR FECHAMENTOS
===================================================== */

function salvarFechamentos() {
   const produtosDoFechamento =
    obterProdutosDoFechamento();


const totalReceita =
    produtosDoFechamento.reduce(

        (total, produto) =>

            total +
            produto.receita,

        0

    );


const totalCusto =
    produtosDoFechamento.reduce(

        (total, produto) =>

            total +
            produto.custo,

        0

    );


const lucroBruto =

    totalReceita -
    totalCusto;

    localStorage.setItem(

        "fechamentos",

        JSON.stringify(
            fechamentos
        )

    );

}


/* =====================================================
   CONFIGURAÇÃO
===================================================== */

function configurarFechamentos() {

    const form =
        document.getElementById(
            "formFechamento"
        );


    if (form) {

        form.addEventListener(

            "submit",

            salvarFechamento

        );

    }


    const btnNovo =
        document.getElementById(
            "btnNovoFechamento"
        );


    if (btnNovo) {

        btnNovo.addEventListener(

            "click",

            () => {

                limparFormularioFechamento();

                definirDataAtual();

                abrirModalFechamento();

            }

        );

    }

}


/* =====================================================
   SALVAR FECHAMENTO
===================================================== */

function salvarFechamento(
    evento
) {

    evento.preventDefault();


    const data =
        document
            .getElementById(
                "dataFechamento"
            )
            .value;


    const local =
        document
            .getElementById(
                "localFechamento"
            )
            .value
            .trim();


    const funcionario =
        document
            .getElementById(
                "funcionarioFechamento"
            )
            .value
            .trim();


    const dinheiro =
        obterNumeroCampo(
            "dinheiroFechamento"
        );


    const maquininha =
        obterNumeroCampo(
            "maquininhaFechamento"
        );


    const pix =
        obterNumeroCampo(
            "pixFechamento"
        );


    const taxas =
        obterNumeroCampo(
            "taxasFechamento"
        );


    const impostos =
        obterNumeroCampo(
            "impostosFechamento"
        );


    const despesasExtras =
        obterNumeroCampo(
            "despesasFechamento"
        );


    const observacoes =
        document
            .getElementById(
                "observacoesFechamento"
            )
            .value
            .trim();


    if (!data) {

        alert(
            "Informe a data do fechamento."
        );

        return;

    }


    /*
        TOTAL BRUTO
    */

    const totalBruto =

        dinheiro +

        maquininha +

        pix;


    /*
        TOTAL DE DESPESAS
    */

    const totalDespesas =

        taxas +

        impostos +

        despesasExtras;


    /*
        TOTAL LÍQUIDO
    */

    const totalLiquido =

        totalBruto -

        totalDespesas;


    /*
        EDITAR FECHAMENTO
    */

    if (
        fechamentoEditandoId !== null
    ) {

        const fechamento =
            fechamentos.find(

                item =>

                    item.id ===
                    fechamentoEditandoId

            );


        if (fechamento) {

            fechamento.data =
                data;

            fechamento.local =
                local;

            fechamento.funcionario =
                funcionario;

            fechamento.dinheiro =
                dinheiro;

            fechamento.maquininha =
                maquininha;

            fechamento.pix =
                pix;

            fechamento.taxas =
                taxas;

            fechamento.impostos =
                impostos;

            fechamento.despesasExtras =
                despesasExtras;

            fechamento.observacoes =
                observacoes;

            fechamento.totalBruto =
                totalBruto;

            fechamento.totalLiquido =
                totalLiquido;

        }

    }


    /*
        NOVO FECHAMENTO
    */

    else {

        const novoFechamento = {

    id:
        gerarIdFechamento(),

    data,

    local,

    funcionario,


    produtos:
        produtosDoFechamento,


    totalReceita,

    totalCusto,

    lucroBruto,


    dinheiro,

    maquininha,

    pix,

    taxas,

    impostos,

    despesasExtras,

    observacoes,

    totalBruto,

    totalLiquido

};


        fechamentos.push(

            novoFechamento

        );

    }


    salvarFechamentos();


    renderizarFechamentos();


    atualizarResumoFechamentos();


    atualizarUltimosFechamentos();


    limparFormularioFechamento();


    fecharModalFechamento();

}


/* =====================================================
   RENDERIZAR TABELA
===================================================== */

function renderizarFechamentos() {

    const tabela =
        document.getElementById(
            "tabelaFechamentos"
        );


    const mensagemVazia =
        document.getElementById(
            "fechamentosVazio"
        );


    if (!tabela) return;


    tabela.innerHTML = "";


    if (
        fechamentos.length === 0
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


    /*
        Mais recentes primeiro
    */

    const lista =
        [...fechamentos]
            .reverse();


    lista.forEach(

        fechamento => {

            const linha =
                document.createElement(
                    "tr"
                );


            linha.innerHTML = `

                <td>

                    #${fechamento.id}

                </td>


                <td>

                    ${formatarData(
                        fechamento.data
                    )}

                </td>


                <td>

                    ${escaparHTMLFechamento(
                        fechamento.local ||
                        "—"
                    )}

                </td>


                <td>

                    ${escaparHTMLFechamento(
                        fechamento.funcionario ||
                        "—"
                    )}

                </td>


                <td>

                    ${formatarMoedaFechamento(
                        fechamento.totalBruto
                    )}

                </td>


                <td>

                    <strong>

                        ${formatarMoedaFechamento(
                            fechamento.totalLiquido
                        )}

                    </strong>

                </td>


                <td>

                    <div
                        class="table-actions"
                    >

                        <button

                            class="btn-edit"

                            onclick="editarFechamento(
                                ${fechamento.id}
                            )"

                        >

                            Editar

                        </button>


                        <button

                            class="btn-danger"

                            onclick="excluirFechamento(
                                ${fechamento.id}
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
   ATUALIZAR RESUMO
===================================================== */

function atualizarResumoFechamentos() {

    const totalDinheiro =
        document.getElementById(
            "totalDinheiro"
        );


    const totalMaquininha =
        document.getElementById(
            "totalMaquininha"
        );


    const totalPix =
        document.getElementById(
            "totalPix"
        );


    const totalLiquido =
        document.getElementById(
            "totalLiquido"
        );


    /*
        Soma dos fechamentos
    */

    const dinheiro =
        fechamentos.reduce(

            (total, fechamento) =>

                total +

                Number(
                    fechamento.dinheiro ||
                    0
                ),

            0

        );


    const maquininha =
        fechamentos.reduce(

            (total, fechamento) =>

                total +

                Number(
                    fechamento.maquininha ||
                    0
                ),

            0

        );


    const pix =
        fechamentos.reduce(

            (total, fechamento) =>

                total +

                Number(
                    fechamento.pix ||
                    0
                ),

            0

        );


    const liquido =
        fechamentos.reduce(

            (total, fechamento) =>

                total +

                Number(
                    fechamento.totalLiquido ||
                    0
                ),

            0

        );


    if (totalDinheiro) {

        totalDinheiro.textContent =

            formatarMoedaFechamento(
                dinheiro
            );

    }


    if (totalMaquininha) {

        totalMaquininha.textContent =

            formatarMoedaFechamento(
                maquininha
            );

    }


    if (totalPix) {

        totalPix.textContent =

            formatarMoedaFechamento(
                pix
            );

    }


    if (totalLiquido) {

        totalLiquido.textContent =

            formatarMoedaFechamento(
                liquido
            );

    }

}


/* =====================================================
   ÚLTIMOS FECHAMENTOS
===================================================== */

function atualizarUltimosFechamentos() {

    const container =
        document.getElementById(
            "ultimosFechamentos"
        );


    if (!container) return;


    if (
        fechamentos.length === 0
    ) {

        container.innerHTML = `

            <p class="empty-message">

                Nenhum fechamento
                registrado.

            </p>

        `;

        return;

    }


    const ultimos =
        [...fechamentos]

            .reverse()

            .slice(
                0,
                5
            );


    container.innerHTML = "";


    ultimos.forEach(

        fechamento => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "fechamento-item";


            item.innerHTML = `

                <div>

                    <strong>

                        ${formatarData(
                            fechamento.data
                        )}

                    </strong>


                    <span>

                        ${escaparHTMLFechamento(
                            fechamento.local ||
                            "Sem local"
                        )}

                    </span>

                </div>


                <strong>

                    ${formatarMoedaFechamento(
                        fechamento.totalLiquido
                    )}

                </strong>

            `;


            container.appendChild(
                item
            );

        }

    );

}


/* =====================================================
   EDITAR FECHAMENTO
===================================================== */

function editarFechamento(
    id
) {

    const fechamento =
        fechamentos.find(

            item =>

                item.id === id

        );


    if (!fechamento) return;


    fechamentoEditandoId =
        id;


    preencherCampo(
        "dataFechamento",
        fechamento.data
    );


    preencherCampo(
        "localFechamento",
        fechamento.local
    );


    preencherCampo(
        "funcionarioFechamento",
        fechamento.funcionario
    );


    preencherCampo(
        "dinheiroFechamento",
        fechamento.dinheiro
    );


    preencherCampo(
        "maquininhaFechamento",
        fechamento.maquininha
    );


    preencherCampo(
        "pixFechamento",
        fechamento.pix
    );


    preencherCampo(
        "taxasFechamento",
        fechamento.taxas
    );


    preencherCampo(
        "impostosFechamento",
        fechamento.impostos
    );


    preencherCampo(
        "despesasFechamento",
        fechamento.despesasExtras
    );


    preencherCampo(
        "observacoesFechamento",
        fechamento.observacoes
    );


    abrirModalFechamento();

}


/* =====================================================
   EXCLUIR FECHAMENTO
===================================================== */

function excluirFechamento(
    id
) {

    const fechamento =
        fechamentos.find(

            item =>

                item.id === id

        );


    if (!fechamento) return;


    const confirmar =
        confirm(

            "Deseja excluir este fechamento?"

        );


    if (!confirmar) return;


    fechamentos =
        fechamentos.filter(

            item =>

                item.id !== id

        );


    salvarFechamentos();


    renderizarFechamentos();


    atualizarResumoFechamentos();


    atualizarUltimosFechamentos();


    atualizarDashboardFechamentos();

}


/* =====================================================
   ATUALIZAR DASHBOARD
===================================================== */

function atualizarDashboardFechamentos() {

    const elemento =
        document.getElementById(
            "ultimoFechamento"
        );


    if (!elemento) return;


    if (
        fechamentos.length === 0
    ) {

        elemento.textContent =
            "—";

        return;

    }


    const ultimo =
        fechamentos[
            fechamentos.length - 1
        ];


    elemento.textContent =
        formatarData(
            ultimo.data
        );

}


/* =====================================================
   ABRIR MODAL
===================================================== */

function abrirModalFechamento() {

    const modal =
        document.getElementById(
            "modalFechamento"
        );


    if (!modal) return;

renderizarProdutosNoFechamento();
   
    modal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   FECHAR MODAL
===================================================== */

function fecharModalFechamento() {

    const modal =
        document.getElementById(
            "modalFechamento"
        );


    if (!modal) return;


    modal.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";


    limparFormularioFechamento();

}


/* =====================================================
   LIMPAR FORMULÁRIO
===================================================== */

function limparFormularioFechamento() {

    const form =
        document.getElementById(
            "formFechamento"
        );


    if (form) {

        form.reset();

    }


    fechamentoEditandoId =
        null;


    /*
        Zera os campos numéricos
    */

    const camposNumericos = [

        "dinheiroFechamento",

        "maquininhaFechamento",

        "pixFechamento",

        "taxasFechamento",

        "impostosFechamento",

        "despesasFechamento"

    ];


    camposNumericos.forEach(

        id => {

            const campo =
                document.getElementById(
                    id
                );


            if (campo) {

                campo.value =
                    "0";

            }

        }

    );

}


/* =====================================================
   DATA ATUAL
===================================================== */

function definirDataAtual() {

    const campo =
        document.getElementById(
            "dataFechamento"
        );


    if (!campo) return;


    const hoje =
        new Date();


    const ano =
        hoje.getFullYear();


    const mes =
        String(

            hoje.getMonth() + 1

        ).padStart(
            2,
            "0"
        );


    const dia =
        String(

            hoje.getDate()

        ).padStart(
            2,
            "0"
        );


    campo.value =

        `${ano}-${mes}-${dia}`;

}


/* =====================================================
   FUNÇÕES AUXILIARES
===================================================== */

function obterNumeroCampo(
    id
) {

    const campo =
        document.getElementById(
            id
        );


    if (!campo) return 0;


    const valor =
        Number(
            campo.value
        );


    return isNaN(
        valor
    )

        ? 0

        : Math.max(
            0,
            valor
        );

}


function preencherCampo(
    id,
    valor
) {

    const campo =
        document.getElementById(
            id
        );


    if (campo) {

        campo.value =
            valor ?? "";

    }

}


function gerarIdFechamento() {

    if (
        fechamentos.length === 0
    ) {

        return 1;

    }


    const ids =
        fechamentos.map(

            fechamento =>

                Number(
                    fechamento.id
                )

        );


    return Math.max(
        ...ids
    ) + 1;

}


function formatarMoedaFechamento(
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


function formatarData(
    data
) {

    if (!data) return "—";


    const partes =
        data.split(
            "-"
        );


    if (
        partes.length !== 3
    ) {

        return data;

    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


function escaparHTMLFechamento(
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

function renderizarProdutosNoFechamento() {

    const container =
        document.getElementById(
            "listaProdutosFechamento"
        );


    if (!container) return;


    const produtosSalvos =
        localStorage.getItem(
            "produtos"
        );


    const produtosCadastrados =
        produtosSalvos

            ? JSON.parse(
                produtosSalvos
            )

            : [];


    container.innerHTML = "";


    if (
        produtosCadastrados.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-message">

                Nenhum produto cadastrado.

            </div>

        `;

        return;

    }


    produtosCadastrados.forEach(

        produto => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "produto-fechamento-item";


            item.dataset.produtoId =
                produto.id;


            item.innerHTML = `

                <div
                    class="produto-fechamento-info"
                >

                    <strong>

                        ${escaparHTMLFechamento(
                            produto.nome
                        )}

                    </strong>


                    <span>

                        Custo:
                        ${formatarMoedaFechamento(
                            produto.custo
                        )}

                    </span>

                </div>


                <div
                    class="produto-fechamento-campos"
                >

                    <div>

                        <label>
                            Estoque inicial
                        </label>

                        <input

                            type="number"

                            min="0"

                            value="0"

                            class="estoque-inicial"

                            data-produto-id="${produto.id}"

                        >

                    </div>


                    <div>

                        <label>
                            Estoque final
                        </label>

                        <input

                            type="number"

                            min="0"

                            value="0"

                            class="estoque-final"

                            data-produto-id="${produto.id}"

                        >

                    </div>


                    <div>

                        <label>
                            Valor de venda
                        </label>

                        <input

                            type="number"

                            min="0"

                            step="0.01"

                            value="${produto.venda}"

                            class="valor-venda"

                            data-produto-id="${produto.id}"

                        >

                    </div>

                </div>


                <div
                    class="produto-fechamento-resultado"
                >

                    <span>

                        Vendidos:

                        <strong
                            class="quantidade-vendida"
                        >
                            0
                        </strong>

                    </span>


                    <span>

                        Receita:

                        <strong
                            class="receita-produto"
                        >
                            R$ 0,00
                        </strong>

                    </span>


                    <span>

                        Custo:

                        <strong
                            class="custo-produto"
                        >
                            R$ 0,00
                        </strong>

                    </span>

                </div>

            `;


            container.appendChild(
                item
            );

        }

    );


    adicionarEventosProdutosFechamento();

}
function adicionarEventosProdutosFechamento() {

    const campos =
        document.querySelectorAll(

            "#listaProdutosFechamento input"

        );


    campos.forEach(

        campo => {

            campo.addEventListener(

                "input",

                calcularProdutosFechamento

            );

        }

    );

}
function calcularProdutosFechamento() {

    const itens =
        document.querySelectorAll(

            ".produto-fechamento-item"

        );


    let totalReceita = 0;

    let totalCusto = 0;


    itens.forEach(

        item => {

            const produtoId =
                Number(

                    item.dataset.produtoId

                );


            const produto =
                produtos.find(

                    item =>

                        item.id ===
                        produtoId

                );


            if (!produto) return;


            const estoqueInicial =
                Number(

                    item.querySelector(
                        ".estoque-inicial"
                    ).value

                ) || 0;


            const estoqueFinal =
                Number(

                    item.querySelector(
                        ".estoque-final"
                    ).value

                ) || 0;


            const valorVenda =
                Number(

                    item.querySelector(
                        ".valor-venda"
                    ).value

                ) || 0;


            const quantidadeVendida =

                Math.max(

                    0,

                    estoqueInicial -
                    estoqueFinal

                );


            const receita =

                quantidadeVendida *
                valorVenda;


            const custo =

                quantidadeVendida *
                Number(
                    produto.custo
                );


            totalReceita +=
                receita;


            totalCusto +=
                custo;


            item.querySelector(

                ".quantidade-vendida"

            ).textContent =

                quantidadeVendida;


            item.querySelector(

                ".receita-produto"

            ).textContent =

                formatarMoedaFechamento(
                    receita
                );


            item.querySelector(

                ".custo-produto"

            ).textContent =

                formatarMoedaFechamento(
                    custo
                );

        }

    );


    const lucroBruto =

        totalReceita -
        totalCusto;


    document

        .getElementById(
            "receitaProdutosFechamento"
        )

        .textContent =

        formatarMoedaFechamento(
            totalReceita
        );


    document

        .getElementById(
            "custoProdutosFechamento"
        )

        .textContent =

        formatarMoedaFechamento(
            totalCusto
        );


    document

        .getElementById(
            "lucroProdutosFechamento"
        )

        .textContent =

        formatarMoedaFechamento(
            lucroBruto
        );

}
function obterProdutosDoFechamento() {

    const itens =
        document.querySelectorAll(

            ".produto-fechamento-item"

        );


    const produtosFechamento = [];


    itens.forEach(

        item => {

            const produtoId =
                Number(

                    item.dataset.produtoId

                );


            const produto =
                produtos.find(

                    item =>

                        item.id ===
                        produtoId

                );


            if (!produto) return;


            const estoqueInicial =
                Number(

                    item.querySelector(
                        ".estoque-inicial"
                    ).value

                ) || 0;


            const estoqueFinal =
                Number(

                    item.querySelector(
                        ".estoque-final"
                    ).value

                ) || 0;


            const valorVenda =
                Number(

                    item.querySelector(
                        ".valor-venda"
                    ).value

                ) || 0;


            const quantidadeVendida =

                Math.max(

                    0,

                    estoqueInicial -
                    estoqueFinal

                );


            const receita =

                quantidadeVendida *
                valorVenda;


            const custo =

                quantidadeVendida *
                Number(
                    produto.custo
                );


            /*
                Não salva produtos
                que não tiveram movimentação
            */

            if (

                estoqueInicial === 0 &&

                estoqueFinal === 0

            ) {

                return;

            }


            produtosFechamento.push({

                produtoId,

                nome:
                    produto.nome,

                estoqueInicial,

                estoqueFinal,

                quantidadeVendida,

                valorVenda,

                valorCusto:
                    produto.custo,

                receita,

                custo

            });

        }

    );


    return produtosFechamento;

}
