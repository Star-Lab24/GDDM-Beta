/* =====================================================
   SCRIPT PRINCIPAL
===================================================== */


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    iniciarSistema();

});


function iniciarSistema() {

    configurarNavegacao();

    configurarMenuMobile();

    configurarTema();

    configurarModais();

    configurarBotoes();

    mostrarDataAtual();

    atualizarDashboard();

}


/* =====================================================
   NAVEGAÇÃO ENTRE PÁGINAS
===================================================== */

function configurarNavegacao() {

    const botoesMenu = document.querySelectorAll(
        "[data-page]"
    );


    botoesMenu.forEach(botao => {

        botao.addEventListener("click", () => {

            const pagina = botao.dataset.page;

            navegarPara(pagina);

        });

    });

}


function navegarPara(nomePagina) {

    const paginas = document.querySelectorAll(".page");

    const botoesMenu = document.querySelectorAll(
        ".menu-item"
    );


    /*
        Esconde todas as páginas
    */

    paginas.forEach(pagina => {

        pagina.classList.remove(
            "active-page"
        );

    });


    /*
        Mostra a página selecionada
    */

    const paginaSelecionada =
        document.getElementById(nomePagina);


    if (paginaSelecionada) {

        paginaSelecionada.classList.add(
            "active-page"
        );

    }


    /*
        Atualiza botão ativo do menu
    */

    botoesMenu.forEach(botao => {

        botao.classList.remove("active");

    });


    const botaoAtivo = document.querySelector(
        `.menu-item[data-page="${nomePagina}"]`
    );


    if (botaoAtivo) {

        botaoAtivo.classList.add("active");

    }


    /*
        Atualiza o título da página
    */

    atualizarTituloPagina(nomePagina);


    /*
        Fecha o menu no celular
    */

    const sidebar =
        document.querySelector(".sidebar");


    sidebar.classList.remove(
        "mobile-open"
    );

}


function atualizarTituloPagina(nomePagina) {

    const titulo =
        document.getElementById(
            "tituloPagina"
        );


    const subtitulo =
        document.getElementById(
            "subtituloPagina"
        );


    const paginas = {

        dashboard: {

            titulo: "Dashboard",

            subtitulo:
                "Visão geral do seu negócio"

        },

        produtos: {

            titulo: "Produtos",

            subtitulo:
                "Gerencie seus produtos e estoque"

        },

        fechamentos: {

            titulo:
                "Fechamentos de Caixa",

            subtitulo:
                "Registre e acompanhe os fechamentos"

        },

        relatorios: {

            titulo: "Relatórios",

            subtitulo:
                "Analise suas movimentações"

        },

        configuracoes: {

            titulo: "Configurações",

            subtitulo:
                "Configure o sistema"

        }

    };


    const pagina =
        paginas[nomePagina];


    if (!pagina) return;


    titulo.textContent =
        pagina.titulo;


    subtitulo.textContent =
        pagina.subtitulo;

}


/* =====================================================
   MENU MOBILE
===================================================== */

function configurarMenuMobile() {

    const btnMenu =
        document.getElementById(
            "btnMenuMobile"
        );


    const sidebar =
        document.querySelector(
            ".sidebar"
        );


    if (!btnMenu || !sidebar) return;


    btnMenu.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "mobile-open"
            );

        }

    );


    /*
        Fecha o menu ao clicar fora dele
    */

    document.addEventListener(
        "click",
        evento => {

            const clicouNoMenu =
                sidebar.contains(
                    evento.target
                );


            const clicouNoBotao =
                btnMenu.contains(
                    evento.target
                );


            if (

                !clicouNoMenu &&

                !clicouNoBotao

            ) {

                sidebar.classList.remove(
                    "mobile-open"
                );

            }

        }

    );

}


/* =====================================================
   TEMA CLARO / ESCURO
===================================================== */

function configurarTema() {

    const btnTema =
        document.getElementById(
            "btnTema"
        );


    const btnTemaConfiguracoes =
        document.getElementById(
            "btnTemaConfiguracoes"
        );


    const temaSalvo =
        localStorage.getItem(
            "tema"
        );


    if (temaSalvo === "dark") {

        ativarTemaEscuro();

    }


    if (btnTema) {

        btnTema.addEventListener(
            "click",
            alternarTema
        );

    }


    if (btnTemaConfiguracoes) {

        btnTemaConfiguracoes.addEventListener(
            "click",
            alternarTema
        );

    }

}


function alternarTema() {

    const temaEscuro =
        document.body.classList.contains(
            "dark-theme"
        );


    if (temaEscuro) {

        ativarTemaClaro();

    } else {

        ativarTemaEscuro();

    }

}


function ativarTemaEscuro() {

    document.body.classList.add(
        "dark-theme"
    );


    localStorage.setItem(
        "tema",
        "dark"
    );


    atualizarBotaoTema();

}


function ativarTemaClaro() {

    document.body.classList.remove(
        "dark-theme"
    );


    localStorage.setItem(
        "tema",
        "light"
    );


    atualizarBotaoTema();

}


function atualizarBotaoTema() {

    const btnTema =
        document.getElementById(
            "btnTema"
        );


    if (!btnTema) return;


    const temaEscuro =
        document.body.classList.contains(
            "dark-theme"
        );


    if (temaEscuro) {

        btnTema.innerHTML = `

            <span>☀️</span>

            <span>Tema claro</span>

        `;

    } else {

        btnTema.innerHTML = `

            <span>🌙</span>

            <span>Tema escuro</span>

        `;

    }

}


/* =====================================================
   DATA ATUAL
===================================================== */

function mostrarDataAtual() {

    const elemento =
        document.getElementById(
            "dataAtual"
        );


    if (!elemento) return;


    const data =
        new Date();


    const dataFormatada =
        data.toLocaleDateString(
            "pt-BR",
            {

                weekday: "long",

                day: "2-digit",

                month: "long",

                year: "numeric"

            }

        );


    elemento.textContent =
        dataFormatada;

}


/* =====================================================
   MODAIS
===================================================== */

function configurarModais() {

    /*
        Abrir modal de produto
    */

    const btnNovoProduto =
        document.getElementById(
            "btnNovoProduto"
        );


    if (btnNovoProduto) {

        btnNovoProduto.addEventListener(
            "click",
            () => {

                abrirModal(
                    "modalProduto"
                );

            }

        );

    }


    /*
        Abrir modal de fechamento
    */

    const btnNovoFechamento =
        document.getElementById(
            "btnNovoFechamento"
        );


    if (btnNovoFechamento) {

        btnNovoFechamento.addEventListener(
            "click",
            () => {

                abrirModal(
                    "modalFechamento"
                );

            }

        );

    }


    /*
        Botões que fecham os modais
    */

    const botoesFechar =
        document.querySelectorAll(
            "[data-modal]"
        );


    botoesFechar.forEach(botao => {

        botao.addEventListener(
            "click",
            () => {

                const nomeModal =
                    botao.dataset.modal;


                fecharModal(
                    nomeModal
                );

            }

        );

    });


    /*
        Fecha o modal clicando no fundo
    */

    document.querySelectorAll(
        ".modal"
    ).forEach(modal => {

        modal.addEventListener(
            "click",
            evento => {

                if (
                    evento.target === modal
                ) {

                    modal.classList.remove(
                        "active"
                    );

                }

            }

        );

    });


    /*
        Fecha com a tecla ESC
    */

    document.addEventListener(
        "keydown",
        evento => {

            if (
                evento.key === "Escape"
            ) {

                document.querySelectorAll(
                    ".modal.active"
                ).forEach(modal => {

                    modal.classList.remove(
                        "active"
                    );

                });

            }

        }

    );

}


function abrirModal(nomeModal) {

    const modal =
        document.getElementById(
            nomeModal
        );


    if (!modal) return;


    modal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


function fecharModal(nomeModal) {

    const modal =
        document.getElementById(
            nomeModal
        );


    if (!modal) return;


    modal.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

}


/* =====================================================
   BOTÕES
===================================================== */

function configurarBotoes() {

    /*
        Botões com data-page que não
        estão no menu também navegam
    */

    const botoesPagina =
        document.querySelectorAll(
            "button[data-page]"
        );


    botoesPagina.forEach(botao => {

        botao.addEventListener(
            "click",
            () => {

                navegarPara(
                    botao.dataset.page
                );

            }

        );

    });

}


/* =====================================================
   DASHBOARD
===================================================== */

function atualizarDashboard() {

    atualizarTotalProdutos();

    atualizarUltimoFechamento();

    atualizarEstoqueBaixo();

}


/* =====================================================
   TOTAL DE PRODUTOS
===================================================== */

function atualizarTotalProdutos() {

    const elemento =
        document.getElementById(
            "totalProdutos"
        );


    if (!elemento) return;


    const produtos =
        JSON.parse(

            localStorage.getItem(
                "produtos"
            )

        ) || [];


    elemento.textContent =
        produtos.length;

}


/* =====================================================
   ESTOQUE BAIXO
===================================================== */

function atualizarEstoqueBaixo() {

    const container =
        document.getElementById(
            "produtosEstoqueBaixo"
        );


    if (!container) return;


    const produtos =
        JSON.parse(

            localStorage.getItem(
                "produtos"
            )

        ) || [];


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


    container.innerHTML =
        produtosBaixos.map(
            produto => `

                <div class="estoque-item">

                    <strong>

                        ${produto.nome}

                    </strong>

                    <span class="status status-warning">

                        ${produto.estoque}
                        unidades

                    </span>

                </div>

            `
        ).join("");

}


/* =====================================================
   ÚLTIMO FECHAMENTO
===================================================== */

function atualizarUltimoFechamento() {

    const elemento =
        document.getElementById(
            "ultimoFechamento"
        );


    if (!elemento) return;


    const fechamentos =
        JSON.parse(

            localStorage.getItem(
                "fechamentos"
            )

        ) || [];


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
        ultimo.data || "—";

}


/* =====================================================
   FUNÇÕES UTILITÁRIAS
===================================================== */


/*
    Formata valores para Real brasileiro
*/

function formatarMoeda(valor) {

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


/*
    Gera um ID único
*/

function gerarId() {

    return Date.now();

}


/*
    Exibe uma mensagem simples
*/

function mostrarMensagem(
    mensagem,
    tipo = "sucesso"
) {

    alert(mensagem);

          }
