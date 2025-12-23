// Estado da aplicação
let contagemAtual = {
    id: null,
    data: '',
    carro: '',
    matricula: '',
    maquina: '',  
    operador: '',
    horario: '',
    embarques: [],
    finalizada: false,
    pausada: false
};

let embarqueAtualNumero = 1;
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
    const inputHorario = document.getElementById('inputHorario');

    if (!inputData || !inputCarro) return; // Se elementos não existem, sair

    const campos = [inputData, inputCarro, inputMatricula, inputMaquina, inputOperador, inputHorario];

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
            inputHorario.focus();
        }
    });
    
    inputHorario.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            iniciarContagem();
        }
    });

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
    
    // Evento de foco
    display.addEventListener('focus', () => {
        campoAtualFocado = tipo;
        display.classList.add('display-focado');
    });
    
    // Evento de perda de foco
    display.addEventListener('blur', () => {
        if (campoAtualFocado === tipo) {
            campoAtualFocado = null;
        }
        display.classList.remove('display-focado');
    });
    
    // Evento de tecla pressionada
    display.addEventListener('keydown', (e) => {
        const confirmado = tipo === 'cameras' ? valorCamerasConfirmado : valorVisualConfirmado;
        
        // Se já confirmado, não permite edição
        if (confirmado !== null && e.key !== 'Enter') {
            e.preventDefault();
            return;
        }
        
        // Enter confirma o valor
        if (e.key === 'Enter') {
            e.preventDefault();
            confirmarCampo(tipo);
            return;
        }
        
        // Backspace apaga o último dígito
        if (e.key === 'Backspace') {
            e.preventDefault();
            apagarUltimoDigito(tipo);
            return;
        }
        
        // Números de 0-9
        if (e.key >= '0' && e.key <= '9') {
            e.preventDefault();
            adicionarDigito(tipo, e.key);
            return;
        }
        
        // Bloqueia outras teclas
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
    const horario = document.getElementById('inputHorario').value;

    if (!data) {
        alert('Selecione uma data');
        return;
    }

    if (!carro) {
        alert('Digite o número do carro');
        return;
    } 

    if (!horario) {
        alert('Selecione um horário');
        return;
    }

    contagemAtual = {
        id: Date.now(),
        data: formatarData(data),
        carro: carro,
        matricula: matricula,
        maquina: maquina,
        operador: operador,
        horario: horario,
        embarques: [],
        finalizada: false,
        pausada: false,
        totalCameras: 0,
        totalVisual: 0
    };

    embarqueAtualNumero = 1;
    resetarCampos();
    mostrarTela('telaContagem');
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
    
    resetarCampos();
    
    document.getElementById('embarqueAtual').textContent = `Embarque ${embarqueAtualNumero}`;
    mostrarTela('telaContagem');
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
        const embarque = {
            numero: embarqueAtualNumero,
            cameras: valorCamerasConfirmado,
            visual: valorVisualConfirmado,
            timestamp: Date.now()
        };

        contagemAtual.embarques.push(embarque);
        
        embarqueAtualNumero++;
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
    if (contagemAtual.embarques.length === 0) {
        alert('Adicione pelo menos um embarque antes de finalizar');
        return;
    }

    // Se estava pausada, atualizar; senão, criar nova
    if (contagemAtual.pausada) {
        atualizarContagem(contagemAtual.id);
    }

    contagemAtual.finalizada = true;
    contagemAtual.pausada = false;
    contagemAtual.totalCameras = contagemAtual.embarques.reduce((sum, p) => sum + p.cameras, 0);
    contagemAtual.totalVisual = contagemAtual.embarques.reduce((sum, p) => sum + p.visual, 0);

    if (!contagemAtual.pausada) {
        salvarContagem(contagemAtual);
    } else {
        atualizarContagem(contagemAtual.id);
    }
    
    fecharModal('modalMenu');
    mostrarTela('telaLista');
    mostrarDetalhes(contagemAtual.id);
}

// Salvar contagem
function salvarContagem(contagem) {
    let contagens = JSON.parse(localStorage.getItem('contagens') || '[]');
    
    // Se já existe (pausada), atualizar
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
        
        return `
            <div class="contagem-item" onclick="mostrarDetalhes(${contagem.id})">
                <h3>${contagem.data} - ${contagem.horario}</h3>    
                <p>Carro: ${contagem.carro}</p>
                <p>Matrícula: ${contagem.matricula}</p>
                <p>Máquina: ${contagem.maquina}</p>
                <p>Operador: ${contagem.operador}</p>
                <p>Visual: ${contagem.totalVisual} | Câmeras: ${contagem.totalCameras}</p>
                <p class="${statusClasse}">${statusTexto}</p>
                ${botaoRetomar}
                <button class="btn btn-success btn-small" onclick="event.stopPropagation(); exportarContagem(${contagem.id})">Exportar Excel - LibreOffice</button>
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

    // Calcular acurácia do cameras
    let acuracia = 0;
    if (contagem.totalVisual > 0) {
        acuracia = Math.round((contagem.totalCameras / contagem.totalVisual) * 100);
    }

    // Determinar classe de acurácia para estilização
    let classeAcuracia = '';
    if (acuracia >= 95 && acuracia <= 105) {
        classeAcuracia = 'acuracia-excelente';
    } else if (acuracia >= 90 && acuracia <= 110) {
        classeAcuracia = 'acuracia-boa';
    } else {
        classeAcuracia = 'acuracia-baixa';
    }

    let statusTexto = contagem.finalizada ? 'Finalizada' : (contagem.pausada ? 'Pausada' : 'Em andamento');

    document.getElementById('conteudoModal').innerHTML = `
        <p><strong>Matícula:</strong> ${contagem.matricula}</p>
        <p><strong>Operador:</strong> ${contagem.operador}</p>
        <p><strong>Carro:</strong> ${contagem.carro}</p>
        <p><strong>Data:</strong> ${contagem.data}</p>
        <p><strong>Horário:</strong> ${contagem.horario}</p>
        <p><strong>Status:</strong> ${statusTexto}</p>
        <p><strong>Total Câmeras:</strong> ${contagem.totalCameras}</p>
        <p><strong>Total Visual:</strong> ${contagem.totalVisual}</p>
        <p><strong>Percentual:</strong> <span class="${classeAcuracia}">${acuracia}%</span></p>
        <p><strong>Embarques:</strong> ${contagem.embarques.length}</p>
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

// Vefifica se um elemento precisa de foco
function focarSeNecessario(elementId) {
    const elemento = document.getElementById(elementId);
    if (document.activeElement !== elemento) {
        elemento.focus();
    }
}

// Vefifica se um elemento precisa de foco
function focarSeNecessario(elementId) {
    const elemento = document.getElementById(elementId);
    if (document.activeElement !== elemento) {
        elemento.focus();
    }
}

function normalizarTexto(texto) {
    if (!texto) return '';
    
    return texto
        .toUpperCase()  // Converte para maiúsculas
        .normalize('NFD')  // Separa os caracteres dos acentos
        .replace(/[\u0300-\u036f]/g, '');  // Remove os acentos
}

// Exportar contagem para Excel
async function exportarContagem(id) {
    const contagens = carregarContagens();
    const contagem = contagens.find(c => c.id === id);

    if (!contagem) {
        alert('Contagem não encontrada');
        return;
    }

    // Determinar período (Manhã ou Tarde) baseado no horário
    const horario = contagem.horario;
    const hora = parseInt(horario.split(':')[0]);
    const periodo = hora <= 12 ? 'Manhã' : 'Tarde';

    // Converter data para formato por extenso
    const [dia, mes, ano] = contagem.data.split('/');
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const dataExtenso = `${dia} de ${meses[parseInt(mes) - 1]} de ${ano}`;

    // Criar workbook e worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Contagem');

    // Definir largura de todas as colunas (15)
    worksheet.columns = [
        { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 },
        { width: 15 }, { width: 15 }, { width: 15 }, { width: 9 },
        { width: 15 }, { width: 15 }, { width: 15 }, { width: 9 }
    ];

    // Linha 1: célula vazia + data mesclada
    worksheet.getCell('A1').value = '';
    worksheet.getCell('B1').value = dataExtenso;
    worksheet.mergeCells('B1:L1');
    
    // Estilo da data (B1:L1) - cinza 25%
    const cellData = worksheet.getCell('B1');
    cellData.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFBFBFBF' }
    };
    cellData.alignment = { horizontal: 'center', vertical: 'middle' };

    // Linha 2: cabeçalhos
    const cabecalhos = [
        'Carro', 'Matrícula', 'Máquina', 'Operador',
        'Horário - Manhã', 'Contagem Visual', 'Contagem Carro', 'Margem',
        'Horário - Tarde', 'Contagem Visual', 'Contagem Carro', 'Margem'
    ];

    cabecalhos.forEach((texto, index) => {
        const cell = worksheet.getCell(2, index + 1);
        cell.value = texto;
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD9D9D9' }
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });

    // Linha 3: dados
    const row3 = worksheet.getRow(3);
    
    // Coluna A (Carro) com cinza 15%
    const cellA3 = worksheet.getCell('A3');
    cellA3.value = Number(contagem.carro) || contagem.carro;
    cellA3.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9D9D9' }
    };
    cellA3.alignment = { horizontal: 'center', vertical: 'middle' };
    cellA3.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };

    // Demais colunas (B, C, D)
    worksheet.getCell('B3').value = Number(contagem.matricula) || contagem.matricula;
    worksheet.getCell('C3').value = contagem.maquina;
    worksheet.getCell('D3').value = contagem.operador;

    // Aplicar estilo nas colunas B, C, D
    ['B3', 'C3', 'D3'].forEach(cellRef => {
        const cell = worksheet.getCell(cellRef);
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });

    // Dados do período (Manhã ou Tarde)
    if (periodo === 'Manhã') {
        // Preencher Manhã (E3:H3)
        worksheet.getCell('E3').value = contagem.horario;
        worksheet.getCell('F3').value = contagem.totalVisual;
        worksheet.getCell('G3').value = contagem.totalCameras;
        worksheet.getCell('H3').value = { formula: '=IFERROR((G3/F3),"")' };
        worksheet.getCell('H3').numFmt = '0%';

        // Estilizar células
        ['E3', 'F3', 'G3', 'H3', 'I3', 'J3', 'K3', 'L3'].forEach(cellRef => {
            const cell = worksheet.getCell(cellRef);
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
    } else {
        // Deixar Manhã vazia (E3:H3) - sem bordas
        ['E3', 'F3', 'G3', 'H3'].forEach(cellRef => {
            const cell = worksheet.getCell(cellRef);
            cell.value = '';
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });

        // Preencher Tarde (I3:L3)
        worksheet.getCell('I3').value = contagem.horario;
        worksheet.getCell('J3').value = contagem.totalVisual;
        worksheet.getCell('K3').value = contagem.totalCameras;
        worksheet.getCell('L3').value = { formula: '=IFERROR((K3/J3),"")' };
        worksheet.getCell('L3').numFmt = '0%';

        // Estilizar células
        ['E3', 'F3', 'G3', 'H3', 'I3', 'J3', 'K3', 'L3'].forEach(cellRef => {
            const cell = worksheet.getCell(cellRef);
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
    }

    // Gerar arquivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OP.${normalizarTexto(contagem.operador)}.MAQ.${contagem.maquina}.CARRO.${contagem.carro}.DATA.${contagem.data.replace(/\//g, '-')}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}