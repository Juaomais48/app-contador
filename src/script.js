// Estado da aplicação
let contagemAtual = {
    id: null,
    data: '',
    carro: '',
    matricula: '',
    maquina: '',  
    operador: '',
    horarioInicio: '',
    horarioTermino: '',
    embarques: [],
    finalizada: false,
    pausada: false
};

let embarqueAtualNumero = 1;
let embarqueVisualizadoNumero = 1;
let valorCameras = '0';
let valorVisual = '0';
let valorCamerasConfirmado = null;
let valorVisualConfirmado = null;
let modoInsercaoCameras = 'teclado';
let modoInsercaoVisual = 'teclado';
let campoAtualFocado = null;

// Função de inicialização
function inicializarApp() {
    carregarContagens();
    
    const inputData = document.getElementById('inputData');
    const inputCarro = document.getElementById('inputCarro');
    const inputMatricula = document.getElementById('inputMatricula');
    const inputMaquina = document.getElementById('inputMaquina');
    const inputOperador = document.getElementById('inputOperador');

    if (!inputData || !inputCarro) return;

    const campos = [inputData, inputCarro, inputMatricula, inputMaquina, inputOperador];

    campos.forEach((campo, index) => {
        campo.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const proximoIndex = index + 1;
                if (proximoIndex < campos.length) {
                    campos[proximoIndex].focus();
                }
            }
            
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                const anteriorIndex = index - 1;
                if (anteriorIndex >= 0) {
                    campos[anteriorIndex].focus();
                }
            }
        });
    });

    inputData.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            inputCarro.focus();
        }
    });

    inputCarro.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            inputMatricula.focus();
        }
    });

    inputMatricula.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            inputMaquina.focus();
        }
    });

    inputMaquina.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            inputOperador.focus();
        }
    });

    inputOperador.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            iniciarContagem();
        }
    });

    // Eventos para horários
    const inputHorarioInicio = document.getElementById('inputHorarioInicio');
    const inputHorarioTermino = document.getElementById('inputHorarioTermino');

    if (inputHorarioInicio) {
        inputHorarioInicio.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                confirmarHorarioInicio();
            }
        });
    }

    if (inputHorarioTermino) {
        inputHorarioTermino.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                confirmarHorarioTermino();
            }
        });
    }

    configurarEventosDisplay('visual');
    configurarEventosDisplay('cameras');
}

// Executar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarApp);
} else {
    inicializarApp();
}

// Configurar eventos de teclado e foco
function configurarEventosDisplay(tipo) {
    const display = document.getElementById(`display${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
    
    display.addEventListener('focus', () => {
        campoAtualFocado = tipo;
        display.classList.add('display-focado');
    });
    
    display.addEventListener('blur', () => {
        if (campoAtualFocado === tipo) {
            campoAtualFocado = null;
        }
        display.classList.remove('display-focado');
    });
    
    display.addEventListener('keydown', (e) => {
        const confirmado = tipo === 'cameras' ? valorCamerasConfirmado : valorVisualConfirmado;
        
        if (confirmado !== null && e.key !== 'Enter') {
            e.preventDefault();
            return;
        }
        
        if (e.key === 'Enter') {
            e.preventDefault();
            confirmarCampo(tipo);
            return;
        }
        
        if (e.key === 'Backspace') {
            e.preventDefault();
            apagarUltimoDigito(tipo);
            return;
        }
        
        if (e.key >= '0' && e.key <= '9') {
            e.preventDefault();
            adicionarDigito(tipo, e.key);
            return;
        }
        
        e.preventDefault();
    });
}

// Navegação entre telas
function mostrarTela(idTela) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(idTela).classList.add('active');

    if (idTela === 'telaLista') {
        exibirContagens();
    }
}

// Iniciar nova contagem
function iniciarContagem() {
    const data = document.getElementById('inputData').value;
    const carro = document.getElementById('inputCarro').value.trim();
    const matricula = document.getElementById('inputMatricula').value.trim();
    const maquina = document.getElementById('inputMaquina').value.trim();
    const operador = document.getElementById('inputOperador').value.trim();

    if (!data) {
        alert('Selecione uma data');
        return;
    }

    if (!carro) {
        alert('Digite o número do carro');
        return;
    }

    contagemAtual = {
        id: Date.now(),
        data: formatarData(data),
        carro: carro,
        matricula: matricula,
        maquina: maquina,
        operador: operador,
        horarioInicio: '',
        horarioTermino: '',
        embarques: [],
        finalizada: false,
        pausada: false,
        totalCameras: 0,
        totalVisual: 0
    };

    embarqueAtualNumero = 1;
    embarqueVisualizadoNumero = 1;
    resetarCampos();
    mostrarTela('telaContagem');
    
    // Mostrar popup de horário de início
    mostrarPopupHorarioInicio();
}

// Mostrar popup de horário de início
function mostrarPopupHorarioInicio() {
    const modal = document.getElementById('modalHorarioInicio');
    const input = document.getElementById('inputHorarioInicio');
    
    modal.classList.add('active');
    setTimeout(() => input.focus(), 100);
}

// Confirmar horário de início
function confirmarHorarioInicio() {
    const horario = document.getElementById('inputHorarioInicio').value;
    
    if (!horario) {
        alert('Informe o horário de início');
        return;
    }
    
    contagemAtual.horarioInicio = horario;
    fecharModal('modalHorarioInicio');
    
    setTimeout(() => {
        focarSeNecessario('displayVisual');
    }, 100);
}

// Solicitar finalização (mostra popup de horário de término)
function solicitarFinalizacao() {
    if (contagemAtual.embarques.length === 0) {
        alert('Adicione pelo menos um embarque antes de finalizar');
        return;
    }
    
    fecharModal('modalMenu');
    
    const modal = document.getElementById('modalHorarioTermino');
    const input = document.getElementById('inputHorarioTermino');
    
    modal.classList.add('active');
    setTimeout(() => input.focus(), 100);
}

// Confirmar horário de término e finalizar
function confirmarHorarioTermino() {
    const horario = document.getElementById('inputHorarioTermino').value;
    
    if (!horario) {
        alert('Informe o horário de término');
        return;
    }
    
    contagemAtual.horarioTermino = horario;
    fecharModal('modalHorarioTermino');
    
    finalizarContagem();
}

// Retomar contagem pausada
function retomarContagem(id) {
    const contagens = carregarContagens();
    const contagem = contagens.find(c => c.id === id);
    
    if (!contagem || !contagem.pausada) {
        alert('Contagem não encontrada ou não está pausada');
        return;
    }
    
    contagemAtual = { ...contagem };
    embarqueAtualNumero = contagem.embarques.length + 1;
    embarqueVisualizadoNumero = embarqueAtualNumero;
    
    resetarCampos();
    atualizarBotoesNavegacao();
    
    document.getElementById('embarqueAtual').textContent = `Embarque ${embarqueAtualNumero}`;
    mostrarTela('telaContagem');
}

// Navegar entre embarques
function navegarEmbarque(direcao) {
    // direcao: -1 = direita (volta para anterior), +1 = esquerda (avança para próximo)
    const novoNumero = embarqueVisualizadoNumero + direcao;
    
    // Validar limites
    if (novoNumero < 1 || novoNumero > embarqueAtualNumero) {
        return;
    }
    
    embarqueVisualizadoNumero = novoNumero;
    
    // Se estamos no embarque atual (não confirmado ainda), limpar campos
    if (embarqueVisualizadoNumero === embarqueAtualNumero) {
        valorCameras = '0';
        valorVisual = '0';
        valorCamerasConfirmado = null;
        valorVisualConfirmado = null;
        
        document.getElementById('displayCameras').value = '0';
        document.getElementById('displayVisual').value = '0';
        document.getElementById('displayCameras').classList.remove('valor-confirmado');
        document.getElementById('displayVisual').classList.remove('valor-confirmado');
        document.getElementById('btnCorrecaoCameras').style.display = 'none';
        document.getElementById('btnCorrecaoVisual').style.display = 'none';
        document.querySelector('.campo-contagem.cameras .btn-success').style.display = 'inline-block';
        document.querySelector('.campo-contagem.visual .btn-success').style.display = 'inline-block';
    } else {
        // Carregar dados do embarque confirmado
        const embarque = contagemAtual.embarques[embarqueVisualizadoNumero - 1];
        
        valorCameras = String(embarque.cameras);
        valorVisual = String(embarque.visual);
        valorCamerasConfirmado = embarque.cameras;
        valorVisualConfirmado = embarque.visual;
        
        document.getElementById('displayCameras').value = valorCameras;
        document.getElementById('displayVisual').value = valorVisual;
        document.getElementById('displayCameras').classList.add('valor-confirmado');
        document.getElementById('displayVisual').classList.add('valor-confirmado');
        document.getElementById('btnCorrecaoCameras').style.display = 'inline-block';
        document.getElementById('btnCorrecaoVisual').style.display = 'inline-block';
        document.querySelector('.campo-contagem.cameras .btn-success').style.display = 'none';
        document.querySelector('.campo-contagem.visual .btn-success').style.display = 'none';
    }
    
    document.getElementById('embarqueAtual').textContent = `Embarque ${embarqueVisualizadoNumero}`;
    
    atualizarBotoesNavegacao();
}

// Atualizar visibilidade dos botões de navegação
function atualizarBotoesNavegacao() {
    const btnEsquerda = document.getElementById('btnSetaEsquerda');
    const btnDireita = document.getElementById('btnSetaDireita');
    
    // Botão direita (▶): volta para embarques anteriores - aparece se não estiver no embarque 1
    if (embarqueVisualizadoNumero > 1) {
        btnDireita.style.display = 'inline-block';
    } else {
        btnDireita.style.display = 'none';
    }
    
    // Botão esquerda (◀): avança para embarques posteriores - aparece se não estiver no embarque atual (último)
    if (embarqueVisualizadoNumero < embarqueAtualNumero) {
        btnEsquerda.style.display = 'inline-block';
    } else {
        btnEsquerda.style.display = 'none';
    }
}

// Resetar campos
function resetarCampos() {
    valorCameras = '0';
    valorVisual = '0';
    valorCamerasConfirmado = null;
    valorVisualConfirmado = null;
    modoInsercaoCameras = 'teclado';
    modoInsercaoVisual = 'teclado';

    document.getElementById('embarqueAtual').textContent = `Embarque ${embarqueAtualNumero}`;
    document.getElementById('displayCameras').value = '0';
    document.getElementById('displayVisual').value = '0';
    document.getElementById('displayCameras').classList.remove('valor-confirmado');
    document.getElementById('displayVisual').classList.remove('valor-confirmado');
    document.getElementById('modoCameras').value = 'teclado';
    document.getElementById('modoVisual').value = 'teclado';
    document.getElementById('btnCorrecaoCameras').style.display = 'none';
    document.getElementById('btnCorrecaoVisual').style.display = 'none';

    alterarModoInsercao('cameras');
    alterarModoInsercao('visual');

    setTimeout(() => {
        focarSeNecessario('displayVisual');
    }, 100);
}

// Formatar data
function formatarData(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

// Alterar modo de inserção
function alterarModoInsercao(tipo) {
    const modo = document.getElementById(`modo${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).value;
    
    if (tipo === 'cameras') {
        modoInsercaoCameras = modo;
        if (modo === 'teclado') {
            document.getElementById('tecladoCameras').style.display = 'grid';
            document.getElementById('cliqueCameras').style.display = 'none';
        } else {
            document.getElementById('tecladoCameras').style.display = 'none';
            document.getElementById('cliqueCameras').style.display = 'flex';
        }
    } else {
        modoInsercaoVisual = modo;
        if (modo === 'teclado') {
            document.getElementById('tecladoVisual').style.display = 'grid';
            document.getElementById('cliqueVisual').style.display = 'none';
        } else {
            document.getElementById('tecladoVisual').style.display = 'none';
            document.getElementById('cliqueVisual').style.display = 'flex';
        }
    }
}

// Adicionar dígito (modo teclado)
function adicionarDigito(tipo, digito) {
    if (tipo === 'cameras') {
        if (valorCamerasConfirmado !== null) return;
        
        if (valorCameras === '0') {
            valorCameras = digito;
        } else {
            valorCameras += digito;
        }
        document.getElementById('displayCameras').value = valorCameras;
        focarSeNecessario('displayCameras');
    } else {
        if (valorVisualConfirmado !== null) return;
        
        if (valorVisual === '0') {
            valorVisual = digito;
        } else {
            valorVisual += digito;
        }
        document.getElementById('displayVisual').value = valorVisual;
        focarSeNecessario('displayVisual');
    }
}

// Apagar último dígito
function apagarUltimoDigito(tipo) {
    if (tipo === 'cameras') {
        if (valorCamerasConfirmado !== null) return;
        
        if (valorCameras.length > 1) {
            valorCameras = valorCameras.slice(0, -1);
        } else {
            valorCameras = '0';
        }
        document.getElementById('displayCameras').value = valorCameras;
        focarSeNecessario('displayCameras');
    } else {
        if (valorVisualConfirmado !== null) return;
        
        if (valorVisual.length > 1) {
            valorVisual = valorVisual.slice(0, -1);
        } else {
            valorVisual = '0';
        }
        document.getElementById('displayVisual').value = valorVisual;
        focarSeNecessario('displayVisual');
    }
}

// Incrementar clique (modo clique)
function incrementarClique(tipo) {
    if (tipo === 'cameras') {
        if (valorCamerasConfirmado !== null) return;
        
        const valorAtual = parseInt(valorCameras) || 0;
        valorCameras = String(valorAtual + 1);
        document.getElementById('displayCameras').value = valorCameras;
        focarSeNecessario('displayCameras');
    } else {
        if (valorVisualConfirmado !== null) return;
        
        const valorAtual = parseInt(valorVisual) || 0;
        valorVisual = String(valorAtual + 1);
        document.getElementById('displayVisual').value = valorVisual;
        focarSeNecessario('displayVisual');
    }
}

// Apagar campo
function apagarCampo(tipo) {
    apagarUltimoDigito(tipo);
}

// Confirmar campo
function confirmarCampo(tipo) {
    if (tipo === 'cameras') {
        const valor = parseInt(valorCameras);
        if (isNaN(valor) || valor < 0) {
            alert('Digite um valor válido');
            return;
        }
        valorCamerasConfirmado = valor;
        document.getElementById('displayCameras').classList.add('valor-confirmado');
        document.getElementById('btnCorrecaoCameras').style.display = 'inline-block';
        document.querySelector('.campo-contagem.cameras .btn-success').style.display = 'none';

        setTimeout(() => {
            focarSeNecessario('displayVisual');
        }, 100);
    } else {
        const valor = parseInt(valorVisual);
        if (isNaN(valor) || valor < 0) {
            alert('Digite um valor válido');
            return;
        }
        valorVisualConfirmado = valor;
        document.getElementById('displayVisual').classList.add('valor-confirmado');
        document.getElementById('btnCorrecaoVisual').style.display = 'inline-block';
        document.querySelector('.campo-contagem.visual .btn-success').style.display = 'none';

        setTimeout(() => {
            focarSeNecessario('displayCameras');
        }, 100);
    }

    verificarECriarEmbarque();
}

// Corrigir campo
function corrigirCampo(tipo) {
    if (tipo === 'cameras') {
        valorCamerasConfirmado = null;
        document.getElementById('displayCameras').classList.remove('valor-confirmado');
        document.getElementById('btnCorrecaoCameras').style.display = 'none';
        document.querySelector('.campo-contagem.cameras .btn-success').style.display = 'inline-block';
        focarSeNecessario('displayCameras');
    } else {
        valorVisualConfirmado = null;
        document.getElementById('displayVisual').classList.remove('valor-confirmado');
        document.getElementById('btnCorrecaoVisual').style.display = 'none';
        document.querySelector('.campo-contagem.visual .btn-success').style.display = 'inline-block';
        focarSeNecessario('displayVisual');
    }
}

// Verificar e criar embarque
function verificarECriarEmbarque() {
    if (valorCamerasConfirmado !== null && valorVisualConfirmado !== null) {
        // Se estamos editando um embarque existente
        if (embarqueVisualizadoNumero <= contagemAtual.embarques.length) {
            const embarque = contagemAtual.embarques[embarqueVisualizadoNumero - 1];
            embarque.cameras = valorCamerasConfirmado;
            embarque.visual = valorVisualConfirmado;
            
            // Voltar ao embarque atual (não confirmado)
            embarqueVisualizadoNumero = embarqueAtualNumero;
            valorCameras = '0';
            valorVisual = '0';
            valorCamerasConfirmado = null;
            valorVisualConfirmado = null;
            
            document.getElementById('displayCameras').value = '0';
            document.getElementById('displayVisual').value = '0';
            document.getElementById('displayCameras').classList.remove('valor-confirmado');
            document.getElementById('displayVisual').classList.remove('valor-confirmado');
            document.getElementById('btnCorrecaoCameras').style.display = 'none';
            document.getElementById('btnCorrecaoVisual').style.display = 'none';
            document.querySelector('.campo-contagem.cameras .btn-success').style.display = 'inline-block';
            document.querySelector('.campo-contagem.visual .btn-success').style.display = 'inline-block';
            
            document.getElementById('embarqueAtual').textContent = `Embarque ${embarqueAtualNumero}`;
            
            atualizarBotoesNavegacao();
        } else {
            // Criar novo embarque
            const embarque = {
                numero: embarqueAtualNumero,
                cameras: valorCamerasConfirmado,
                visual: valorVisualConfirmado,
                timestamp: Date.now()
            };

            contagemAtual.embarques.push(embarque);
            
            embarqueAtualNumero++;
            embarqueVisualizadoNumero = embarqueAtualNumero;
            valorCameras = '0';
            valorVisual = '0';
            valorCamerasConfirmado = null;
            valorVisualConfirmado = null;
            
            document.getElementById('displayCameras').value = '0';
            document.getElementById('displayVisual').value = '0';
            document.getElementById('displayCameras').classList.remove('valor-confirmado');
            document.getElementById('displayVisual').classList.remove('valor-confirmado');
            document.getElementById('btnCorrecaoCameras').style.display = 'none';
            document.getElementById('btnCorrecaoVisual').style.display = 'none';

            document.querySelector('.campo-contagem.cameras .btn-success').style.display = 'inline-block';
            document.querySelector('.campo-contagem.visual .btn-success').style.display = 'inline-block';
            
            document.getElementById('embarqueAtual').textContent = `Embarque ${embarqueAtualNumero}`;
            
            atualizarBotoesNavegacao();
        }

        setTimeout(() => {
            focarSeNecessario('displayVisual');
        }, 100);
    }
}

// Mostrar menu flutuante
function mostrarMenuFlutuante() {
    document.getElementById('modalMenu').classList.add('active');
}

// Pausar contagem
function pausarContagem() {
    if (contagemAtual.embarques.length === 0) {
        alert('Adicione pelo menos um embarque antes de pausar');
        return;
    }

    contagemAtual.pausada = true;
    contagemAtual.totalCameras = contagemAtual.embarques.reduce((sum, p) => sum + p.cameras, 0);
    contagemAtual.totalVisual = contagemAtual.embarques.reduce((sum, p) => sum + p.visual, 0);

    salvarContagem(contagemAtual);
    
    fecharModal('modalMenu');
    mostrarTela('telaLista');
}

// Finalizar contagem
function finalizarContagem() {
    contagemAtual.finalizada = true;
    contagemAtual.pausada = false;
    contagemAtual.totalCameras = contagemAtual.embarques.reduce((sum, p) => sum + p.cameras, 0);
    contagemAtual.totalVisual = contagemAtual.embarques.reduce((sum, p) => sum + p.visual, 0);

    salvarContagem(contagemAtual);
    
    mostrarTela('telaLista');
    mostrarDetalhes(contagemAtual.id);
}

// Salvar contagem
function salvarContagem(contagem) {
    let contagens = JSON.parse(localStorage.getItem('contagens') || '[]');
    
    const index = contagens.findIndex(c => c.id === contagem.id);
    if (index !== -1) {
        contagens[index] = contagem;
    } else {
        contagens.push(contagem);
    }
    
    localStorage.setItem('contagens', JSON.stringify(contagens));
}

// Atualizar contagem existente
function atualizarContagem(id) {
    let contagens = carregarContagens();
    const index = contagens.findIndex(c => c.id === id);
    
    if (index !== -1) {
        contagens[index] = contagemAtual;
        localStorage.setItem('contagens', JSON.stringify(contagens));
    }
}

// Carregar contagens
function carregarContagens() {
    return JSON.parse(localStorage.getItem('contagens') || '[]');
}

// Exibir contagens
function exibirContagens(filtro = '') {
    const contagens = carregarContagens();
    const listaDiv = document.getElementById('listaContagens');

    const contagensFiltradas = contagens.filter(c => 
        c.data.toLowerCase().includes(filtro.toLowerCase()) ||
        c.carro.toLowerCase().includes(filtro.toLowerCase())
    ).reverse();

    if (contagensFiltradas.length === 0) {
        listaDiv.innerHTML = '<div class="empty-state">Nenhuma contagem encontrada</div>';
        return;
    }

    listaDiv.innerHTML = contagensFiltradas.map(contagem => {
        let statusTexto = '';
        let statusClasse = '';
        let botaoRetomar = '';
        
        if (contagem.finalizada) {
            statusTexto = '✓ Finalizada';
            statusClasse = 'status-finalizada';
        } else if (contagem.pausada) {
            statusTexto = '⏸ Pausada';
            statusClasse = 'status-pausada';
            botaoRetomar = `<button class="btn btn-warning btn-small" onclick="event.stopPropagation(); retomarContagem(${contagem.id})">Retomar</button>`;
        } else {
            statusTexto = 'Em andamento';
            statusClasse = 'status-andamento';
        }
        
        const horarios = contagem.horarioInicio ? `${contagem.horarioInicio}${contagem.horarioTermino ? ' - ' + contagem.horarioTermino : ''}` : '';
        
        return `
            <div class="contagem-item" onclick="mostrarDetalhes(${contagem.id})">
                <h3>${contagem.data}${horarios ? ' - ' + horarios : ''}</h3>    
                <p>Carro: ${contagem.carro}</p>
                <p>Matrícula: ${contagem.matricula}</p>
                <p>Máquina: ${contagem.maquina}</p>
                <p>Operador: ${contagem.operador}</p>
                <p>Visual: ${contagem.totalVisual} | Câmeras: ${contagem.totalCameras}</p>
                <p class="${statusClasse}">${statusTexto}</p>
                ${botaoRetomar}
                <button class="btn btn-danger btn-small" onclick="event.stopPropagation(); excluirContagem(${contagem.id})">Excluir</button>
            </div>
        `;
    }).join('');
}

// Filtrar contagens
function filtrarContagens() {
    const filtro = document.getElementById('searchInput').value;
    exibirContagens(filtro);
}

// Mostrar detalhes
function mostrarDetalhes(id) {
    const contagens = carregarContagens();
    const contagem = contagens.find(c => c.id === id);

    if (!contagem) return;

    const embarquesDetalhes = contagem.embarques.map(p => 
        `Embarque ${p.numero}: Câmeras=${p.cameras}, Visual=${p.visual}`
    ).join('\n');

    let acuracia = 0;
    if (contagem.totalVisual > 0) {
        acuracia = Math.round((contagem.totalCameras / contagem.totalVisual) * 100);
    }

    let classeAcuracia = '';
    let mensagemAcuracia = '';
    
    if (acuracia <= 94) {
        classeAcuracia = 'acuracia-critica';
        mensagemAcuracia = ' - Enviar para a manutenção</p>';
    } else if (acuracia >= 95 && acuracia <= 105) {
        classeAcuracia = 'acuracia-saudavel';
        mensagemAcuracia = '';
    } else if (acuracia >= 106) {
        classeAcuracia = 'acuracia-critica';
        mensagemAcuracia = ' - Enviar para a manutenção</p>';
    }

    let statusTexto = contagem.finalizada ? 'Finalizada' : (contagem.pausada ? 'Pausada' : 'Em andamento');

    document.getElementById('conteudoModal').innerHTML = `
        <p><strong>Carro:</strong> ${contagem.carro}</p>
        <p><strong>Data:</strong> ${contagem.data}</p>
        <p><strong>Horário Início:</strong> ${contagem.horarioInicio || 'Não informado'}</p>
        <p><strong>Horário Término:</strong> ${contagem.horarioTermino || 'Não informado'}</p>
        <p><strong>Total Visual:</strong> ${contagem.totalVisual}</p>
        <p><strong>Total Câmeras:</strong> ${contagem.totalCameras}</p>
        <p><strong>Percentual:</strong> <span class="${classeAcuracia}">${acuracia}%${mensagemAcuracia}</span></p>
        <p><strong>Status:</strong> ${statusTexto}</p>
        <br>
        <pre>${embarquesDetalhes}</pre>
    `;

    document.getElementById('modalDetalhes').classList.add('active');
}

// Fechar modal
function fecharModal(idModal) {
    document.getElementById(idModal).classList.remove('active');
}

// Excluir contagem
function excluirContagem(id) {
    if (!confirm('Deseja realmente excluir esta contagem?')) return;

    let contagens = carregarContagens();
    contagens = contagens.filter(c => c.id !== id);
    localStorage.setItem('contagens', JSON.stringify(contagens));
    
    exibirContagens();
}

// Verifica se um elemento precisa de foco
function focarSeNecessario(elementId) {
    const elemento = document.getElementById(elementId);
    if (elemento && document.activeElement !== elemento) {
        elemento.focus();
    }
}