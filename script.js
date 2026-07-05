// ============================================================
// 0. FUNÇÃO AUXILIAR PARA NORMALIZAR (remover acentos)
// ============================================================
function normalizar(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// ============================================================
// 1. DADOS DO JOGO (Palavras por nível)
// ============================================================
const niveis = [
    { // Nível 1 - Iniciante
        nome: "Iniciante",
        palavras: [
            { palavra: "REPRESA", dica: "Barramento artificial que forma um lago para abastecimento ou energia." },
            { palavra: "RIO", dica: "Curso de água doce que flui continuamente em direção ao mar ou lago." },
            { palavra: "PEIXE", dica: "Animal vertebrado aquático, com escamas e guelras." },
            { palavra: "LAGOA", dica: "Corpo de água doce, geralmente raso e com vegetação marginal." },
            { palavra: "RESERVATORIO", dica: "Grande depósito de água, natural ou artificial, para armazenamento." },
            { palavra: "RIACHO", dica: "Curso de água pequeno e estreito, geralmente afluente de um rio." },
            { palavra: "ALGA", dica: "Organismo fotossintetizante aquático, pode ser microscópico ou macroscópico." },
            { palavra: "TURBIDEZ", dica: "Medida da transparência da água, causada por partículas em suspensão." },
            { palavra: "LÓTICO", dica: "Ambiente aquático de águas correntes, como rios e riachos." },
            { palavra: "COPÉPODE", dica: "Pequeno organismo planctônico, muito comum em águas doces." }
        ]
    },
    { // Nível 2 - Explorador
        nome: "Explorador",
        palavras: [
            { palavra: "OXIGENIO", dica: "Gás essencial para a respiração aquática e terrestre." },
            { palavra: "HABITAT", dica: "Local natural onde uma espécie vive e encontra condições para sobreviver." },
            { palavra: "LITORAL", dica: "Zona de transição entre o ambiente aquático e o terrestre." },
            { palavra: "MACROFITA", dica: "Planta aquática de grande porte, visível a olho nu." },
            { palavra: "PLANCTON", dica: "Todos os organismos microscópicos que flutuam passivamente na coluna d'água." },
            { palavra: "BENTOS", dica: "Organismos que habitam o fundo dos corpos d'água." },
            { palavra: "SEDIMENTO", dica: "Material orgânico ou inorgânico depositado no fundo de lagos e rios." },
            { palavra: "CADEIA", dica: "Sequência de organismos onde um serve de alimento para o outro (alimentar)." },
            { palavra: "FOTOSSINTESE", dica: "Processo pelo qual algas e plantas produzem seu próprio alimento usando luz." }
        ]
    },
    { // Nível 3 - Mestre das Águas
        nome: "Mestre das Águas",
        palavras: [
            { palavra: "FITOPLANCTON", dica: "Organismos microscópicos fotossintetizantes que formam a base da cadeia alimentar aquática." },
            { palavra: "ZOOPLANCTON", dica: "Organismos microscópicos heterotróficos que se alimentam de fitoplâncton." },
            { palavra: "NITROGENIO", dica: "Nutriente essencial, presente em ciclos biogeoquímicos e fundamental para o crescimento de algas." },
            { palavra: "FOSFORO", dica: "Nutriente essencial, frequentemente limitante em ecossistemas aquáticos." },
            { palavra: "TURBIDEZ", dica: "Medida da transparência da água, influenciada por partículas em suspensão como sedimentos e algas." },
            { palavra: "MESOTROFICO", dica: "Classificação de um lago com produtividade intermediária, entre oligotrófico e eutrófico." },
            { palavra: "ESTRATIFICACAO", dica: "Formação de camadas de densidade diferentes em um lago, geralmente térmicas." },
            { palavra: "PRODUTIVIDADE", dica: "Taxa de produção de matéria orgânica por organismos fotossintetizantes em um ecossistema." },
            { palavra: "NUTRIENTE", dica: "Substância química essencial para o crescimento e metabolismo dos organismos aquáticos." }
        ]
    },
    { // Nível 4 - Limnólogo
        nome: "Limnólogo",
        palavras: [
            { palavra: "EUTROFIZACAO", dica: "Processo de enriquecimento excessivo por nutrientes, causando proliferação de algas e perda de oxigênio." },
            { palavra: "HIPOLIMNIO", dica: "Camada mais profunda e fria de um lago, geralmente com baixo oxigênio." },
            { palavra: "EPILIMNIO", dica: "Camada superficial e aquecida de um lago, com alta concentração de oxigênio." },
            { palavra: "OLIGOTROFICO", dica: "Lago com baixa produtividade biológica, águas claras e poucos nutrientes." },
            { palavra: "ZONA EUFOTICA", dica: "Região da coluna d'água onde a luz solar é suficiente para a fotossíntese." },
            { palavra: "METALIMNIO", dica: "Camada intermediária entre o epilímnio e o hipolímnio, com rápida variação de temperatura." },
            { palavra: "PLEUSTON", dica: "Organismos que vivem na superfície da água, apoiados pela tensão superficial." },
            { palavra: "NEUSTON", dica: "Organismos que vivem na interface água-ar, na película superficial." }
        ]
    }
];

// ============================================================
// 2. ESTADO DO JOGO
// ============================================================
let estado = {
    nivelAtual: 0,
    vidas: 5,
    totalVidas: 5,
    letrasClicadas: new Set(),
    jogoFinalizado: false,
    combo: 0,
    maiorCombo: 0,
    moedas: 0,
    totalAcertos: 0,
    totalErros: 0,
    totalPalavrasResolvidas: 0,
    maiorSequencia: 0,
    conquistasDesbloqueadas: new Set(),
    palavrasUsadasNivel: [],
    palavrasAcertadasNivel: [],
    errosPermitidos: 3
};

// ============================================================
// 3. CONQUISTAS
// ============================================================
const conquistasLista = [
    { id: "primeira_vitoria", nome: "Primeira vitória", condicao: (dados) => dados.totalPalavrasResolvidas >= 1 },
    { id: "10_palavras", nome: "10 palavras", condicao: (dados) => dados.totalPalavrasResolvidas >= 10 },
    { id: "100_palavras", nome: "100 palavras", condicao: (dados) => dados.totalPalavrasResolvidas >= 100 },
    { id: "10_vitorias_seguidas", nome: "10 vitórias seguidas", condicao: (dados) => dados.maiorSequencia >= 10 },
    { id: "mestre_limnologia", nome: "Mestre da Limnologia", condicao: (dados) => dados.totalPalavrasResolvidas >= 5 && dados.maiorSequencia >= 5 },
    { id: "perfeccionista", nome: "Perfeccionista", condicao: (dados) => dados.totalErros === 0 && dados.totalPalavrasResolvidas >= 5 },
    { id: "combo_x3", nome: "Combo x3", condicao: (dados) => dados.maiorSequencia >= 3 },
    { id: "combo_x5", nome: "Combo x5", condicao: (dados) => dados.maiorSequencia >= 5 }
];

// ============================================================
// 4. ELEMENTOS DOM
// ============================================================
const slotsContainer = document.getElementById("slots-container");
const vidasContainer = document.getElementById("vidas-container");
const alfabetoContainer = document.getElementById("alfabeto-container");
const dicaTexto = document.getElementById("dica-texto");
const modalOverlay = document.getElementById("modal-overlay");
const modalMensagem = document.getElementById("modal-mensagem");
const modalMoedasGanhas = document.getElementById("modal-moedas-ganhas");
const modalJogarNovamente = document.getElementById("modal-jogar-novamente");
const moedasContador = document.getElementById("moedas-contador");
const nivelAtualSpan = document.getElementById("nivel-atual");
const comboFlutuante = document.getElementById("combo-flutuante");
const notificacaoConquista = document.getElementById("notificacao-conquista");
const notificacaoTexto = document.getElementById("notificacao-texto");
const errosContador = document.getElementById("erros-contador");

const btnLojaHeader = document.getElementById("btn-loja-header");
const btnVoltarInicio = document.getElementById("btn-voltar-inicio");
const telaInicial = document.getElementById("tela-inicial");
const telaJogo = document.getElementById("tela-jogo");
const btnIniciar = document.getElementById("btn-iniciar");
const btnInstrucoes = document.getElementById("btn-instrucoes");
const btnRankingInicial = document.getElementById("btn-ranking-inicial");
const btnEstatisticasInicial = document.getElementById("btn-estatisticas-inicial");

const lojaOverlay = document.getElementById("loja-overlay");
const estatisticasOverlay = document.getElementById("estatisticas-overlay");
const rankingOverlay = document.getElementById("ranking-overlay");
const instrucoesOverlay = document.getElementById("instrucoes-overlay");
const fecharLoja = document.getElementById("fechar-loja");
const fecharEstatisticas = document.getElementById("fechar-estatisticas");
const fecharRanking = document.getElementById("fechar-ranking");
const fecharInstrucoes = document.getElementById("fechar-instrucoes");
const lojaItens = document.getElementById("loja-itens");
const estatisticasConteudo = document.getElementById("estatisticas-conteudo");
const rankingConteudo = document.getElementById("ranking-conteudo");

// ============================================================
// 5. FUNÇÕES DE PERSISTÊNCIA
// ============================================================
function carregarDados() {
    try {
        const dados = JSON.parse(localStorage.getItem("forca_limno_dados"));
        if (dados) {
            estado.moedas = dados.moedas || 0;
            estado.totalAcertos = dados.totalAcertos || 0;
            estado.totalErros = dados.totalErros || 0;
            estado.totalPalavrasResolvidas = dados.totalPalavrasResolvidas || 0;
            estado.maiorSequencia = dados.maiorSequencia || 0;
            estado.nivelAtual = dados.nivelAtual || 0;
            estado.palavrasAcertadasNivel = dados.palavrasAcertadasNivel || niveis.map(() => []);
            estado.palavrasUsadasNivel = dados.palavrasUsadasNivel || niveis.map(() => []);
            estado.errosPermitidos = dados.errosPermitidos !== undefined ? dados.errosPermitidos : 3;
            if (dados.conquistasDesbloqueadas) {
                estado.conquistasDesbloqueadas = new Set(dados.conquistasDesbloqueadas);
            }
        } else {
            estado.palavrasAcertadasNivel = niveis.map(() => []);
            estado.palavrasUsadasNivel = niveis.map(() => []);
            estado.errosPermitidos = 3;
        }
    } catch (e) {
        estado.palavrasAcertadasNivel = niveis.map(() => []);
        estado.palavrasUsadasNivel = niveis.map(() => []);
        estado.errosPermitidos = 3;
    }
    while (estado.palavrasAcertadasNivel.length < niveis.length) {
        estado.palavrasAcertadasNivel.push([]);
    }
    while (estado.palavrasUsadasNivel.length < niveis.length) {
        estado.palavrasUsadasNivel.push([]);
    }
    atualizarMoedasUI();
    atualizarNivelUI();
    atualizarErrosUI();
}

function salvarDados() {
    const dados = {
        moedas: estado.moedas,
        totalAcertos: estado.totalAcertos,
        totalErros: estado.totalErros,
        totalPalavrasResolvidas: estado.totalPalavrasResolvidas,
        maiorSequencia: estado.maiorSequencia,
        nivelAtual: estado.nivelAtual,
        palavrasAcertadasNivel: estado.palavrasAcertadasNivel,
        palavrasUsadasNivel: estado.palavrasUsadasNivel,
        errosPermitidos: estado.errosPermitidos,
        conquistasDesbloqueadas: Array.from(estado.conquistasDesbloqueadas)
    };
    localStorage.setItem("forca_limno_dados", JSON.stringify(dados));
}

// ============================================================
// 6. SONS (opcional) - silencioso se não encontrar
// ============================================================
function tocarSom(caminho) {
    try {
        const audio = new Audio(caminho);
        audio.volume = 0.5;
        audio.play().catch(() => {});
    } catch (e) {}
}

// ============================================================
// 7. BOLHAS REMOVIDAS – não há mais função de geração
// ============================================================

// ============================================================
// 8. TELA INICIAL / JOGO
// ============================================================
function mostrarTelaInicial() {
    telaInicial.classList.add('active');
    telaJogo.style.display = 'none';
}

function mostrarTelaJogo() {
    telaInicial.classList.remove('active');
    telaJogo.style.display = 'block';
    iniciarJogo();
}

btnIniciar.addEventListener('click', mostrarTelaJogo);
btnVoltarInicio.addEventListener('click', () => {
    fecharTodosModais();
    mostrarTelaInicial();
});

// ============================================================
// 9. INICIALIZAÇÃO DO JOGO
// ============================================================
function iniciarJogo() {
    modalOverlay.classList.remove('active');

    const nivel = niveis[estado.nivelAtual];
    const totalPalavras = nivel.palavras.length;
    const acertadas = estado.palavrasAcertadasNivel[estado.nivelAtual] || [];
    const usadas = estado.palavrasUsadasNivel[estado.nivelAtual] || [];

    if (acertadas.length === totalPalavras) {
        if (estado.nivelAtual === niveis.length - 1) {
            exibirModal(
                "🎉 PARABÉNS! Você completou todos os níveis! 🎉",
                "🏆 Você é um verdadeiro mestre das águas!",
                "🔄 Recomeçar Jogo",
                () => {
                    modalOverlay.classList.remove('active');
                    reiniciarProgressoCompleto();
                }
            );
            return;
        } else {
            estado.nivelAtual++;
            if (!estado.palavrasAcertadasNivel[estado.nivelAtual]) {
                estado.palavrasAcertadasNivel[estado.nivelAtual] = [];
            }
            if (!estado.palavrasUsadasNivel[estado.nivelAtual]) {
                estado.palavrasUsadasNivel[estado.nivelAtual] = [];
            }
            estado.errosPermitidos = 3;
            atualizarNivelUI();
            atualizarErrosUI();
            salvarDados();
            exibirModal(
                `⭐ Nível ${estado.nivelAtual+1} desbloqueado!`,
                "Prepare-se para novos desafios!",
                "Continuar",
                () => {
                    modalOverlay.classList.remove('active');
                    iniciarJogo();
                }
            );
            return;
        }
    }

    const disponiveis = [];
    for (let i = 0; i < totalPalavras; i++) {
        if (!usadas.includes(i)) {
            disponiveis.push(i);
        }
    }

    if (disponiveis.length === 0) {
        exibirModal(
            "😢 Você usou todas as palavras do nível sem acertar todas!",
            "Recomece do nível 1 e tente novamente.",
            "Recomeçar do Nível 1",
            () => {
                modalOverlay.classList.remove('active');
                reiniciarProgressoCompleto();
            }
        );
        return;
    }

    const idx = disponiveis[Math.floor(Math.random() * disponiveis.length)];
    const item = nivel.palavras[idx];

    estado.palavrasUsadasNivel[estado.nivelAtual].push(idx);
    estado.palavraAtual = item.palavra.toUpperCase();
    estado.dicaAtual = item.dica;
    estado.vidas = estado.totalVidas;
    estado.letrasDescobertas = estado.palavraAtual.split('').map(c => c === ' ');
    estado.letrasClicadas = new Set();
    estado.jogoFinalizado = false;

    renderizarDica();
    renderizarSlots();
    renderizarVidas();
    renderizarAlfabeto();
    atualizarMoedasUI();
    atualizarNivelUI();
    atualizarErrosUI();
    modalOverlay.classList.remove('active');
    comboFlutuante.classList.remove('ativo');
    comboFlutuante.textContent = '';
}

// ============================================================
// 10. RENDERIZAÇÕES
// ============================================================
function renderizarDica() {
    dicaTexto.textContent = estado.dicaAtual;
}
function renderizarSlots() {
    slotsContainer.innerHTML = "";
    const palavra = estado.palavraAtual;
    for (let i = 0; i < palavra.length; i++) {
        const span = document.createElement("span");
        span.classList.add("slot");
        const letra = palavra[i];
        if (letra === ' ') {
            span.textContent = '-';
            span.classList.add("revelada", "espaco");
        } else if (estado.letrasDescobertas[i]) {
            span.textContent = letra;
            span.classList.add("revelada");
        } else {
            span.textContent = "";
            span.classList.add("vazia");
        }
        slotsContainer.appendChild(span);
    }
}
function renderizarVidas() {
    vidasContainer.innerHTML = "";
    for (let i = 0; i < estado.totalVidas; i++) {
        const span = document.createElement("span");
        span.classList.add("vida");
        span.textContent = "❤️";
        if (i >= estado.vidas) {
            span.classList.add("perdida");
        }
        vidasContainer.appendChild(span);
    }
}
function renderizarAlfabeto() {
    alfabetoContainer.innerHTML = "";
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let letra of letras) {
        const btn = document.createElement("button");
        btn.classList.add("letra-btn");
        btn.textContent = letra;
        btn.dataset.letra = letra;
        if (estado.letrasClicadas.has(letra) || estado.jogoFinalizado) {
            btn.disabled = true;
            if (estado.letrasClicadas.has(letra)) {
                const baseLetra = normalizar(letra);
                const palavraNormalizada = normalizar(estado.palavraAtual);
                if (palavraNormalizada.includes(baseLetra)) {
                    btn.classList.add("certa");
                } else {
                    btn.classList.add("errada");
                }
            }
        }
        btn.addEventListener("click", () => tratarCliqueLetra(letra, btn));
        alfabetoContainer.appendChild(btn);
    }
}
function atualizarMoedasUI() {
    moedasContador.textContent = estado.moedas;
}
function atualizarNivelUI() {
    nivelAtualSpan.textContent = estado.nivelAtual + 1;
}
function atualizarErrosUI() {
    errosContador.textContent = estado.errosPermitidos;
    const display = document.getElementById("erros-display");
    if (estado.errosPermitidos <= 1) {
        display.classList.add("critico");
    } else {
        display.classList.remove("critico");
    }
}

// ============================================================
// 11. COMBO FLUTUANTE
// ============================================================
function mostrarCombo(combo) {
    if (combo < 2) return;
    const texto = `🔥 Combo x${combo}`;
    comboFlutuante.textContent = texto;
    comboFlutuante.classList.remove('ativo');
    void comboFlutuante.offsetWidth;
    comboFlutuante.classList.add('ativo');
    setTimeout(() => {
        comboFlutuante.classList.remove('ativo');
    }, 2000);
}

// ============================================================
// 12. NOTIFICAÇÃO DE CONQUISTA
// ============================================================
let timeoutNotificacao = null;
function mostrarNotificacaoConquista(nome) {
    notificacaoTexto.innerHTML = `🏆 ${nome}`;
    notificacaoConquista.style.display = 'block';
    void notificacaoConquista.offsetWidth;
    notificacaoConquista.classList.add('ativo');
    clearTimeout(timeoutNotificacao);
    timeoutNotificacao = setTimeout(() => {
        notificacaoConquista.classList.remove('ativo');
        setTimeout(() => {
            notificacaoConquista.style.display = 'none';
        }, 500);
    }, 3000);
}

// ============================================================
// 13. LÓGICA DE CLIQUE EM LETRA
// ============================================================
function tratarCliqueLetra(letra, btnElement) {
    if (estado.jogoFinalizado || estado.letrasClicadas.has(letra)) return;

    estado.letrasClicadas.add(letra);
    btnElement.disabled = true;

    const palavra = estado.palavraAtual;
    const baseLetra = normalizar(letra);
    const acertou = palavra.split('').some(caractere => normalizar(caractere) === baseLetra);

    if (acertou) {
        tocarSom("sounds/acerto.mp3");
        btnElement.classList.add("certa");

        for (let i = 0; i < palavra.length; i++) {
            if (normalizar(palavra[i]) === baseLetra) {
                estado.letrasDescobertas[i] = true;
            }
        }
        renderizarSlots();

        if (estado.letrasDescobertas.every(v => v === true)) {
            estado.jogoFinalizado = true;
            estado.combo++;
            if (estado.combo > estado.maiorSequencia) {
                estado.maiorSequencia = estado.combo;
            }
            estado.totalAcertos++;
            estado.totalPalavrasResolvidas++;

            const nivel = niveis[estado.nivelAtual];
            const idxPalavra = nivel.palavras.findIndex(p => p.palavra === palavra);
            if (idxPalavra !== -1 && !estado.palavrasAcertadasNivel[estado.nivelAtual].includes(idxPalavra)) {
                estado.palavrasAcertadasNivel[estado.nivelAtual].push(idxPalavra);
            }

            let moedasGanhas = 20;
            if (estado.letrasClicadas.size === palavra.length) {
                moedasGanhas += 30;
            }
            if (estado.combo >= 2) {
                moedasGanhas += estado.combo * 5;
            }
            estado.moedas += moedasGanhas;

            tocarSom("sounds/win.mp3");
            mostrarCombo(estado.combo);

            const total = nivel.palavras.length;
            const acertadas = estado.palavrasAcertadasNivel[estado.nivelAtual].length;
            if (acertadas === total) {
                salvarDados();
                atualizarMoedasUI();
                desabilitarTodasLetras();
                exibirModal(
                    `🎉 Palavra: ${palavra} - Nível COMPLETO!`,
                    `💰 +${moedasGanhas} moedas (Combo x${estado.combo})`,
                    "Continuar",
                    () => {
                        modalOverlay.classList.remove('active');
                        iniciarJogo();
                    }
                );
            } else {
                exibirModal(
                    `🎉 Palavra: ${palavra}`,
                    `💰 +${moedasGanhas} moedas (Combo x${estado.combo})`,
                    "Próxima Palavra",
                    () => {
                        modalOverlay.classList.remove('active');
                        iniciarJogo();
                    }
                );
            }

            verificarConquistas();
            salvarDados();
            atualizarMoedasUI();
            desabilitarTodasLetras();
        }
    } else {
        tocarSom("sounds/erro.mp3");
        btnElement.classList.add("errada");
        estado.vidas--;
        estado.totalErros++;
        estado.combo = 0;
        renderizarVidas();

        if (estado.vidas === 0) {
            estado.errosPermitidos--;
            atualizarErrosUI();
            estado.jogoFinalizado = true;
            const palavraRevelada = estado.palavraAtual;
            tocarSom("sounds/lose.mp3");

            for (let i = 0; i < palavraRevelada.length; i++) {
                estado.letrasDescobertas[i] = true;
            }
            renderizarSlots();
            desabilitarTodasLetras();

            if (estado.errosPermitidos <= 0) {
                exibirModal(
                    "💀 Você esgotou seus 3 erros permitidos!",
                    "Recomece do nível 1 para tentar novamente.",
                    "Recomeçar do Nível 1",
                    () => {
                        modalOverlay.classList.remove('active');
                        reiniciarProgressoCompleto();
                    }
                );
            } else {
                exibirModal(
                    `😢 Você perdeu! A palavra era: ${palavraRevelada}`,
                    `Erros restantes: ${estado.errosPermitidos}`,
                    "Próxima Palavra",
                    () => {
                        modalOverlay.classList.remove('active');
                        iniciarJogo();
                    }
                );
            }
            salvarDados();
            atualizarMoedasUI();
        }
    }

    if (estado.jogoFinalizado) {
        desabilitarTodasLetras();
    }
}

function desabilitarTodasLetras() {
    const botoes = alfabetoContainer.querySelectorAll(".letra-btn");
    botoes.forEach(btn => btn.disabled = true);
}

// ============================================================
// 14. EXIBIR MODAL
// ============================================================
let acaoModal = null;

function exibirModal(mensagem, moedasGanhas, botaoTexto, acao) {
    modalMensagem.textContent = mensagem;
    modalMoedasGanhas.textContent = moedasGanhas;
    modalJogarNovamente.textContent = botaoTexto;
    acaoModal = acao;
    modalOverlay.classList.add('active');
}

modalJogarNovamente.addEventListener('click', () => {
    if (typeof acaoModal === 'function') {
        acaoModal();
    }
});

// ============================================================
// 15. VERIFICAR CONQUISTAS
// ============================================================
function verificarConquistas() {
    const dados = {
        totalPalavrasResolvidas: estado.totalPalavrasResolvidas,
        maiorSequencia: estado.maiorSequencia,
        totalErros: estado.totalErros,
        totalAcertos: estado.totalAcertos
    };
    conquistasLista.forEach(conq => {
        if (!estado.conquistasDesbloqueadas.has(conq.id) && conq.condicao(dados)) {
            estado.conquistasDesbloqueadas.add(conq.id);
            mostrarNotificacaoConquista(conq.nome);
        }
    });
    salvarDados();
}

// ============================================================
// 16. REINICIAR PROGRESSO
// ============================================================
function reiniciarProgressoCompleto() {
    estado.nivelAtual = 0;
    estado.palavrasAcertadasNivel = niveis.map(() => []);
    estado.palavrasUsadasNivel = niveis.map(() => []);
    estado.errosPermitidos = 3;
    estado.totalPalavrasResolvidas = 0;
    estado.maiorSequencia = 0;
    estado.combo = 0;
    estado.totalAcertos = 0;
    estado.totalErros = 0;
    salvarDados();
    iniciarJogo();
}

// ============================================================
// 17. LOJA
// ============================================================
function abrirLoja() {
    lojaOverlay.classList.add('active');
    atualizarBotoesLoja();
}
function fecharLojaFn() {
    lojaOverlay.classList.remove('active');
}
function atualizarBotoesLoja() {
    const botoes = lojaItens.querySelectorAll(".comprar-btn");
    botoes.forEach(btn => {
        const item = btn.closest(".loja-item").dataset.item;
        let preco = 0;
        if (item === "vida") preco = 100;
        else if (item === "revelar") preco = 80;
        btn.disabled = estado.moedas < preco;
    });
}
function comprarItem(item) {
    let preco = 0;
    if (item === "vida") preco = 100;
    else if (item === "revelar") preco = 80;

    if (estado.moedas < preco) {
        alert("Moedas insuficientes!");
        return;
    }

    estado.moedas -= preco;
    if (item === "vida") {
        if (estado.vidas < estado.totalVidas) {
            estado.vidas++;
            renderizarVidas();
        } else {
            if (estado.totalVidas < 7) {
                estado.totalVidas++;
                estado.vidas++;
                renderizarVidas();
            } else {
                alert("Você já tem o máximo de vidas!");
                estado.moedas += preco;
                salvarDados();
                atualizarMoedasUI();
                atualizarBotoesLoja();
                return;
            }
        }
    } else if (item === "revelar") {
        const palavra = estado.palavraAtual;
        const indicesNaoDescobertos = [];
        for (let i = 0; i < palavra.length; i++) {
            if (!estado.letrasDescobertas[i]) indicesNaoDescobertos.push(i);
        }
        if (indicesNaoDescobertos.length > 0) {
            const idx = indicesNaoDescobertos[Math.floor(Math.random() * indicesNaoDescobertos.length)];
            const letraOriginal = palavra[idx];
            const baseLetra = normalizar(letraOriginal);
            estado.letrasClicadas.add(baseLetra);
            for (let i = 0; i < palavra.length; i++) {
                if (normalizar(palavra[i]) === baseLetra) {
                    estado.letrasDescobertas[i] = true;
                }
            }
            renderizarSlots();
            const botoes = alfabetoContainer.querySelectorAll(".letra-btn");
            botoes.forEach(btn => {
                if (btn.dataset.letra === baseLetra) {
                    btn.disabled = true;
                    btn.classList.add("certa");
                }
            });
            if (estado.letrasDescobertas.every(v => v === true)) {
                estado.jogoFinalizado = true;
                estado.totalPalavrasResolvidas++;
                estado.totalAcertos++;
                const nivel = niveis[estado.nivelAtual];
                const idxPalavra = nivel.palavras.findIndex(p => p.palavra === palavra);
                if (idxPalavra !== -1 && !estado.palavrasAcertadasNivel[estado.nivelAtual].includes(idxPalavra)) {
                    estado.palavrasAcertadasNivel[estado.nivelAtual].push(idxPalavra);
                }
                estado.moedas += 10;
                tocarSom("sounds/win.mp3");
                const total = nivel.palavras.length;
                const acertadas = estado.palavrasAcertadasNivel[estado.nivelAtual].length;
                if (acertadas === total) {
                    salvarDados();
                    atualizarMoedasUI();
                    desabilitarTodasLetras();
                    exibirModal(
                        `🎉 Palavra: ${palavra} (revelada) - Nível COMPLETO!`,
                        `💰 +10 moedas`,
                        "Continuar",
                        () => {
                            modalOverlay.classList.remove('active');
                            iniciarJogo();
                        }
                    );
                } else {
                    exibirModal(
                        `🎉 Palavra: ${palavra} (revelada)`,
                        `💰 +10 moedas`,
                        "Próxima Palavra",
                        () => {
                            modalOverlay.classList.remove('active');
                            iniciarJogo();
                        }
                    );
                }
                desabilitarTodasLetras();
                salvarDados();
                atualizarMoedasUI();
                verificarConquistas();
            }
        } else {
            alert("Não há letras para revelar!");
            estado.moedas += preco;
            salvarDados();
            atualizarMoedasUI();
            atualizarBotoesLoja();
            return;
        }
    }

    salvarDados();
    atualizarMoedasUI();
    atualizarBotoesLoja();
}

lojaItens.addEventListener("click", (e) => {
    const btn = e.target.closest(".comprar-btn");
    if (!btn) return;
    const item = btn.closest(".loja-item").dataset.item;
    comprarItem(item);
});

btnLojaHeader.addEventListener('click', abrirLoja);
fecharLoja.addEventListener('click', fecharLojaFn);

// ============================================================
// 18. ESTATÍSTICAS E CONQUISTAS
// ============================================================
function abrirEstatisticas() {
    estatisticasConteudo.innerHTML = `
        <p><strong>Palavras resolvidas:</strong> ${estado.totalPalavrasResolvidas}</p>
        <p><strong>Acertos:</strong> ${estado.totalAcertos}</p>
        <p><strong>Erros:</strong> ${estado.totalErros}</p>
        <p><strong>Precisão:</strong> ${estado.totalAcertos + estado.totalErros > 0 ? Math.round((estado.totalAcertos / (estado.totalAcertos + estado.totalErros)) * 100) : 0}%</p>
        <p><strong>Maior sequência:</strong> ${estado.maiorSequencia}</p>
        <p><strong>Nível atual:</strong> ${estado.nivelAtual + 1}</p>
        <p><strong>Moedas:</strong> ${estado.moedas}</p>
        <p><strong>Erros permitidos restantes:</strong> ${estado.errosPermitidos}</p>
    `;
    estatisticasOverlay.classList.add('active');
}
function abrirRanking() {
    let html = "<p><strong>Conquistas desbloqueadas:</strong></p><ul style='list-style:none;padding:0;'>";
    conquistasLista.forEach(conq => {
        const desbloqueada = estado.conquistasDesbloqueadas.has(conq.id);
        html += `<li style='${desbloqueada ? "color:#ffd93d;" : "color:#aaa;"}'>${desbloqueada ? "✅" : "⏳"} ${conq.nome}</li>`;
    });
    html += "</ul>";
    html += `<p><strong>Recorde de sequência:</strong> ${estado.maiorSequencia}</p>`;
    html += `<p><strong>Total de palavras:</strong> ${estado.totalPalavrasResolvidas}</p>`;
    rankingConteudo.innerHTML = html;
    rankingOverlay.classList.add('active');
}

// ============================================================
// 19. INSTRUÇÕES
// ============================================================
function abrirInstrucoes() {
    instrucoesOverlay.classList.add('active');
}
function fecharInstrucoesFn() {
    instrucoesOverlay.classList.remove('active');
}

btnInstrucoes.addEventListener('click', abrirInstrucoes);
fecharInstrucoes.addEventListener('click', fecharInstrucoesFn);

// ============================================================
// 20. FECHAR TODOS OS MODAIS
// ============================================================
function fecharTodosModais() {
    lojaOverlay.classList.remove('active');
    estatisticasOverlay.classList.remove('active');
    rankingOverlay.classList.remove('active');
    instrucoesOverlay.classList.remove('active');
    modalOverlay.classList.remove('active');
}

btnEstatisticasInicial.addEventListener('click', abrirEstatisticas);
fecharEstatisticas.addEventListener('click', () => estatisticasOverlay.classList.remove('active'));

btnRankingInicial.addEventListener('click', abrirRanking);
fecharRanking.addEventListener('click', () => rankingOverlay.classList.remove('active'));

// ============================================================
// 21. INICIALIZAÇÃO
// ============================================================
carregarDados();
mostrarTelaInicial();
