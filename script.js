// Estado da aplicação
let contagemAtual = {
            id: null,
            data: '',
            veiculo: '',
            embarques: [],
            finalizada: false
        };

        let embarqueAtualNumero = 1;
        let valorCameras = '0';
        let valorVisual = '0';
        let valorCamerasConfirmado = null;
        let valorVisualConfirmado = null;
        let modoInsercaoCameras = 'teclado';
        let modoInsercaoVisual = 'teclado';

        // Inicializar data atual
        document.addEventListener('DOMContentLoaded', () => {
            const hoje = new Date().toISOString().split('T')[0];
            document.getElementById('inputData').value = hoje;
            carregarContagens();
            
            // Adicionar eventos de Enter nos campos
            const inputData = document.getElementById('inputData');
            const inputVeiculo = document.getElementById('inputVeiculo');
            
            // Enter no campo Data move para Veículo
            inputData.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    inputVeiculo.focus();
                }
            });
            
            // Enter no campo Veículo inicia a contagem
            inputVeiculo.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    iniciarContagem();
                }
            });
        });

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
            const veiculo = document.getElementById('inputVeiculo').value.trim();

            if (!data) {
                alert('Selecione uma data');
                return;
            }

            if (!veiculo) {
                alert('Digite o número do veículo');
                return;
            }

            contagemAtual = {
                id: Date.now(),
                data: formatarData(data),
                veiculo: veiculo,
                embarques: [],
                finalizada: false,
                totalCameras: 0,
                totalVisual: 0
            };

            embarqueAtualNumero = 1;
            valorCameras = '0';
            valorVisual = '0';
            valorCamerasConfirmado = null;
            valorVisualConfirmado = null;
            modoInsercaoCameras = 'teclado';
            modoInsercaoVisual = 'teclado';

            document.getElementById('embarqueAtual').textContent = `Embarque ${embarqueAtualNumero}`;
            document.getElementById('displayCameras').textContent = '0';
            document.getElementById('displayVisual').textContent = '0';
            document.getElementById('displayCameras').classList.remove('valor-confirmado');
            document.getElementById('displayVisual').classList.remove('valor-confirmado');
            document.getElementById('modoCameras').value = 'teclado';
            document.getElementById('modoVisual').value = 'teclado';

            alterarModoInsercao('cameras');
            alterarModoInsercao('visual');
            mostrarTela('telaContagem');
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
                document.getElementById('displayCameras').textContent = valorCameras;
            } else {
                if (valorVisualConfirmado !== null) return;
                
                if (valorVisual === '0') {
                    valorVisual = digito;
                } else {
                    valorVisual += digito;
                }
                document.getElementById('displayVisual').textContent = valorVisual;
            }
        }

        // Incrementar clique (modo clique)
        function incrementarClique(tipo) {
            if (tipo === 'cameras') {
                if (valorCamerasConfirmado !== null) return;
                
                const valorAtual = parseInt(valorCameras) || 0;
                valorCameras = String(valorAtual + 1);
                document.getElementById('displayCameras').textContent = valorCameras;
            } else {
                if (valorVisualConfirmado !== null) return;
                
                const valorAtual = parseInt(valorVisual) || 0;
                valorVisual = String(valorAtual + 1);
                document.getElementById('displayVisual').textContent = valorVisual;
            }
        }

        // Apagar campo
        function apagarCampo(tipo) {
            if (tipo === 'cameras') {
                valorCameras = '0';
                valorCamerasConfirmado = null;
                document.getElementById('displayCameras').textContent = '0';
                document.getElementById('displayCameras').classList.remove('valor-confirmado');
            } else {
                valorVisual = '0';
                valorVisualConfirmado = null;
                document.getElementById('displayVisual').textContent = '0';
                document.getElementById('displayVisual').classList.remove('valor-confirmado');
            }
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
            } else {
                const valor = parseInt(valorVisual);
                if (isNaN(valor) || valor < 0) {
                    alert('Digite um valor válido');
                    return;
                }
                valorVisualConfirmado = valor;
                document.getElementById('displayVisual').classList.add('valor-confirmado');
            }

            verificarECriarEmbarque();
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
                
                document.getElementById('displayCameras').textContent = '0';
                document.getElementById('displayVisual').textContent = '0';
                document.getElementById('displayCameras').classList.remove('valor-confirmado');
                document.getElementById('displayVisual').classList.remove('valor-confirmado');
                
                document.getElementById('embarqueAtual').textContent = `Embarque ${embarqueAtualNumero}`;
            }
        }

        // Mostrar menu flutuante
        function mostrarMenuFlutuante() {
            document.getElementById('modalMenu').classList.add('active');
        }

        // Finalizar contagem
        function finalizarContagem() {
            if (contagemAtual.embarques.length === 0) {
                alert('Adicione pelo menos um embarque antes de finalizar');
                return;
            }

            contagemAtual.finalizada = true;
            contagemAtual.totalCameras = contagemAtual.embarques.reduce((sum, p) => sum + p.cameras, 0);
            contagemAtual.totalVisual = contagemAtual.embarques.reduce((sum, p) => sum + p.visual, 0);

            salvarContagem(contagemAtual);
            
            fecharModal('modalMenu');
            mostrarTela('telaLista');
            mostrarDetalhes(contagemAtual.id);
        }

        // Salvar contagem
        function salvarContagem(contagem) {
            let contagens = JSON.parse(localStorage.getItem('contagens') || '[]');
            contagens.push(contagem);
            localStorage.setItem('contagens', JSON.stringify(contagens));
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
                c.veiculo.toLowerCase().includes(filtro.toLowerCase())
            ).reverse();

            if (contagensFiltradas.length === 0) {
                listaDiv.innerHTML = '<div class="empty-state">Nenhuma contagem encontrada</div>';
                return;
            }

            listaDiv.innerHTML = contagensFiltradas.map(contagem => `
                <div class="contagem-item" onclick="mostrarDetalhes(${contagem.id})">
                    <h3>${contagem.data}</h3>
                    <p>Veículo: ${contagem.veiculo}</p>
                    <p>Cameras: ${contagem.totalCameras} | Visual: ${contagem.totalVisual}</p>
                    <p class="${contagem.finalizada ? 'status-finalizada' : 'status-andamento'}">
                        ${contagem.finalizada ? '✓ Finalizada' : 'Em andamento'}
                    </p>
                    <button class="btn btn-danger btn-small" onclick="event.stopPropagation(); excluirContagem(${contagem.id})">Excluir</button>
                </div>
            `).join('');
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
                `Embarque ${p.numero}: Cameras=${p.cameras}, Visual=${p.visual}`
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

            document.getElementById('conteudoModal').innerHTML = `
                <p><strong>Data:</strong> ${contagem.data}</p>
                <p><strong>Veículo:</strong> ${contagem.veiculo}</p>
                <p><strong>Status:</strong> ${contagem.finalizada ? 'Finalizada' : 'Em andamento'}</p>
                <p><strong>Total Cameras:</strong> ${contagem.totalCameras}</p>
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