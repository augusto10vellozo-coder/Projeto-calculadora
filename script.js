const visor = document.getElementById("visor");

const botoesNumero =
    document.querySelectorAll("[data-numero]");

const botoesOperador =
    document.querySelectorAll("[data-operador]");

const botoesAcao =
    document.querySelectorAll("[data-acao]");

const listaHistorico =
    document.getElementById("lista-historico");

const limparHistorico =
    document.getElementById("limpar-historico");

const botaoTema =
    document.getElementById("tema");


let numeroAtual = "";

let numeroAnterior = "";

let operador = null;

let aguardandoNumero = false;


/*
=================================
NÚMEROS
=================================
*/

botoesNumero.forEach(function (botao) {

    botao.addEventListener("click", function () {

        adicionarNumero(botao.dataset.numero);

    });

});


/*
=================================
OPERADORES
=================================
*/

botoesOperador.forEach(function (botao) {

    botao.addEventListener("click", function () {

        escolherOperador(
            botao.dataset.operador
        );

    });

});


/*
=================================
AÇÕES
=================================
*/

botoesAcao.forEach(function (botao) {

    botao.addEventListener("click", function () {

        const acao = botao.dataset.acao;


        if (acao === "limpar") {
            limparCalculadora();
        }


        if (acao === "resultado") {
            calcularResultado();
        }


        if (acao === "porcentagem") {
            transformarPorcentagem();
        }


        if (acao === "apagar") {
            apagarNumero();
        }

    });

});


/*
=================================
ADICIONAR NÚMERO
=================================
*/

function adicionarNumero(numero) {

    if (aguardandoNumero) {

        numeroAtual = "";

        aguardandoNumero = false;

    }


    if (
        numero === "." &&
        numeroAtual.includes(".")
    ) {
        return;
    }


    if (
        numero === "." &&
        numeroAtual === ""
    ) {

        numeroAtual = "0";

    }


    numeroAtual += numero;

    atualizarVisor();

}


/*
=================================
ESCOLHER OPERADOR
=================================
*/

function escolherOperador(novoOperador) {

    if (numeroAtual === "") {
        return;
    }


    if (
        numeroAnterior !== "" &&
        operador !== null
    ) {

        calcularResultado();

    }


    numeroAnterior = numeroAtual;

    operador = novoOperador;

    aguardandoNumero = true;

}


/*
=================================
CALCULAR RESULTADO
=================================
*/

function calcularResultado() {

    if (
        numeroAnterior === "" ||
        numeroAtual === "" ||
        operador === null
    ) {

        return;

    }


    const primeiroNumero =
        Number(numeroAnterior);

    const segundoNumero =
        Number(numeroAtual);


    let resultado;


    switch (operador) {

        case "+":

            resultado =
                primeiroNumero +
                segundoNumero;

            break;


        case "-":

            resultado =
                primeiroNumero -
                segundoNumero;

            break;


        case "*":

            resultado =
                primeiroNumero *
                segundoNumero;

            break;


        case "/":

            if (segundoNumero === 0) {

                visor.textContent = "Erro";

                numeroAtual = "";

                numeroAnterior = "";

                operador = null;

                return;

            }


            resultado =
                primeiroNumero /
                segundoNumero;

            break;

    }


    const expressao =
        `${formatarNumero(primeiroNumero)}
        ${mostrarOperador(operador)}
        ${formatarNumero(segundoNumero)}
        = ${formatarNumero(resultado)}`;


    adicionarHistorico(expressao);


    numeroAtual =
        String(resultado);

    numeroAnterior = "";

    operador = null;

    aguardandoNumero = true;


    atualizarVisor();

}


/*
=================================
APAGAR ÚLTIMO
=================================
*/

function apagarNumero() {

    if (numeroAtual === "") {
        return;
    }


    numeroAtual =
        numeroAtual.slice(0, -1);


    atualizarVisor();

}


/*
=================================
PORCENTAGEM
=================================
*/

function transformarPorcentagem() {

    if (numeroAtual === "") {
        return;
    }


    numeroAtual =
        String(Number(numeroAtual) / 100);


    atualizarVisor();

}


/*
=================================
LIMPAR CALCULADORA
=================================
*/

function limparCalculadora() {

    numeroAtual = "";

    numeroAnterior = "";

    operador = null;

    aguardandoNumero = false;

    visor.textContent = "0";

}


/*
=================================
ATUALIZAR VISOR
=================================
*/

function atualizarVisor() {

    if (numeroAtual === "") {

        visor.textContent = "0";

        return;

    }


    visor.textContent =
        formatarNumero(Number(numeroAtual));

}


/*
=================================
FORMATAR NÚMERO
=================================
*/

function formatarNumero(numero) {

    if (!Number.isFinite(numero)) {
        return "Erro";
    }


    return numero
        .toLocaleString("pt-BR", {
            maximumFractionDigits: 10
        });

}


/*
=================================
MOSTRAR OPERADOR
=================================
*/

function mostrarOperador(operador) {

    const operadores = {

        "+": "+",

        "-": "−",

        "*": "×",

        "/": "÷"

    };


    return operadores[operador];

}


/*
=================================
HISTÓRICO
=================================
*/

function adicionarHistorico(expressao) {

    const historico =
        JSON.parse(
            localStorage.getItem("historicoCalculadora")
        ) || [];


    historico.unshift(expressao);


    if (historico.length > 10) {

        historico.pop();

    }


    localStorage.setItem(
        "historicoCalculadora",
        JSON.stringify(historico)
    );


    mostrarHistorico();

}


/*
=================================
MOSTRAR HISTÓRICO
=================================
*/

function mostrarHistorico() {

    const historico =
        JSON.parse(
            localStorage.getItem("historicoCalculadora")
        ) || [];


    listaHistorico.innerHTML = "";


    if (historico.length === 0) {

        listaHistorico.innerHTML =
            `<li class="historico-vazio">
                Nenhum cálculo realizado.
            </li>`;

        return;

    }


    historico.forEach(function (item) {

        const elemento =
            document.createElement("li");

        elemento.textContent = item;

        listaHistorico.appendChild(elemento);

    });

}


/*
=================================
LIMPAR HISTÓRICO
=================================
*/

limparHistorico.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "historicoCalculadora"
        );

        mostrarHistorico();

    }
);


/*
=================================
MODO ESCURO
=================================
*/

botaoTema.addEventListener(
    "click",
    function () {

        document.body.classList.toggle("escuro");


        const modoEscuro =
            document.body.classList.contains("escuro");


        localStorage.setItem(
            "modoEscuro",
            modoEscuro
        );


        botaoTema.textContent =
            modoEscuro ? "☀️" : "🌙";

    }
);


/*
=================================
RECUPERAR MODO ESCURO
=================================
*/

const modoSalvo =
    localStorage.getItem("modoEscuro");


if (modoSalvo === "true") {

    document.body.classList.add("escuro");

    botaoTema.textContent = "☀️";

}


/*
=================================
TECLADO
=================================
*/

document.addEventListener(
    "keydown",
    function (evento) {

        const tecla = evento.key;


        if (
            tecla >= "0" &&
            tecla <= "9"
        ) {

            adicionarNumero(tecla);

        }


        if (tecla === ".") {

            adicionarNumero(".");

        }


        if (
            tecla === "+" ||
            tecla === "-" ||
            tecla === "*" ||
            tecla === "/"
        ) {

            escolherOperador(tecla);

        }


        if (
            tecla === "Enter" ||
            tecla === "="
        ) {

            calcularResultado();

        }


        if (tecla === "Escape") {

            limparCalculadora();

        }


        if (
            tecla === "Backspace"
        ) {

            apagarNumero();

        }


        if (tecla === "%") {

            transformarPorcentagem();

        }

    }
);


/*
=================================
INICIAR HISTÓRICO
=================================
*/

mostrarHistorico();