// Estado da aplicação
let contagemAtual = {
            id: null,
            data: '',
            veiculo: '',
            pontos: [],
            finalizada: false
        };

        let pontoAtualNumero = 1;
        let valorSensor = '0';
        let valorVisual = '0';
        let valorSensorConfirmado = null;
        let valorVisualConfirmado = null;
        let modoInsercaoSensor = 'teclado';
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
                pontos: [],
                finalizada: false,
                totalSensor: 0,
                totalVisual: 0
            };

            pontoAtualNumero = 1;
            valorSensor = '0';
            valorVisual = '0';
            valorSensorConfirmado = null;
            valorVisualConfirmado = null;
            modoInsercaoSensor = 'teclado';
            modoInsercaoVisual = 'teclado';

            document.getElementById('pontoAtual').textContent = `Ponto ${pontoAtualNumero}`;
            document.getElementById('displaySensor').textContent = '0';
            document.getElementById('displayVisual').textContent = '0';
            document.getElementById('displaySensor').classList.remove('valor-confirmado');
            document.getElementById('displayVisual').classList.remove('valor-confirmado');
            document.getElementById('modoSensor').value = 'teclado';
            document.getElementById('modoVisual').value = 'teclado';

            alterarModoInsercao('sensor');
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
            
            if (tipo === 'sensor') {
                modoInsercaoSensor = modo;
                if (modo === 'teclado') {
                    document.getElementById('tecladoSensor').style.display = 'grid';
                    document.getElementById('cliqueSensor').style.display = 'none';
                } else {
                    document.getElementById('tecladoSensor').style.display = 'none';
                    document.getElementById('cliqueSensor').style.display = 'flex';
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
            if (tipo === 'sensor') {
                if (valorSensorConfirmado !== null) return;
                
                if (valorSensor === '0') {
                    valorSensor = digito;
                } else {
                    valorSensor += digito;
                }
                document.getElementById('displaySensor').textContent = valorSensor;
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
            if (tipo === 'sensor') {
                if (valorSensorConfirmado !== null) return;
                
                const valorAtual = parseInt(valorSensor) || 0;
                valorSensor = String(valorAtual + 1);
                document.getElementById('displaySensor').textContent = valorSensor;
            } else {
                if (valorVisualConfirmado !== null) return;
                
                const valorAtual = parseInt(valorVisual) || 0;
                valorVisual = String(valorAtual + 1);
                document.getElementById('displayVisual').textContent = valorVisual;
            }
        }

        // Apagar campo
        function apagarCampo(tipo) {
            if (tipo === 'sensor') {
                valorSensor = '0';
                valorSensorConfirmado = null;
                document.getElementById('displaySensor').textContent = '0';
                document.getElementById('displaySensor').classList.remove('valor-confirmado');
            } else {
                valorVisual = '0';
                valorVisualConfirmado = null;
                document.getElementById('displayVisual').textContent = '0';
                document.getElementById('displayVisual').classList.remove('valor-confirmado');
            }
        }

        // Confirmar campo
        function confirmarCampo(tipo) {
            if (tipo === 'sensor') {
                const valor = parseInt(valorSensor);
                if (isNaN(valor) || valor < 0) {
                    alert('Digite um valor válido');
                    return;
                }
                valorSensorConfirmado = valor;
                document.getElementById('displaySensor').classList.add('valor-confirmado');
            } else {
                const valor = parseInt(valorVisual);
                if (isNaN(valor) || valor < 0) {
                    alert('Digite um valor válido');
                    return;
                }
                valorVisualConfirmado = valor;
                document.getElementById('displayVisual').classList.add('valor-confirmado');
            }

            verificarECriarPonto();
        }

        // Verificar e criar ponto
        function verificarECriarPonto() {
            if (valorSensorConfirmado !== null && valorVisualConfirmado !== null) {
                const ponto = {
                    numero: pontoAtualNumero,
                    sensor: valorSensorConfirmado,
                    visual: valorVisualConfirmado,
                    timestamp: Date.now()
                };

                contagemAtual.pontos.push(ponto);
                
                alert(`Ponto ${pontoAtualNumero} criado!\nSensor: ${valorSensorConfirmado}\nVisual: ${valorVisualConfirmado}`);
                
                pontoAtualNumero++;
                valorSensor = '0';
                valorVisual = '0';
                valorSensorConfirmado = null;
                valorVisualConfirmado = null;
                
                document.getElementById('displaySensor').textContent = '0';
                document.getElementById('displayVisual').textContent = '0';
                document.getElementById('displaySensor').classList.remove('valor-confirmado');
                document.getElementById('displayVisual').classList.remove('valor-confirmado');
                
                document.getElementById('pontoAtual').textContent = `Ponto ${pontoAtualNumero}`;
            }
        }

        // Mostrar menu flutuante
        function mostrarMenuFlutuante() {
            document.getElementById('modalMenu').classList.add('active');
        }

        // Finalizar contagem
        function finalizarContagem() {
            if (contagemAtual.pontos.length === 0) {
                alert('Adicione pelo menos um ponto antes de finalizar');
                return;
            }

            if (!confirm('Deseja finalizar esta contagem?')) return;

            contagemAtual.finalizada = true;
            contagemAtual.totalSensor = contagemAtual.pontos.reduce((sum, p) => sum + p.sensor, 0);
            contagemAtual.totalVisual = contagemAtual.pontos.reduce((sum, p) => sum + p.visual, 0);

            salvarContagem(contagemAtual);

            alert(`Contagem finalizada!\n\nTotal Sensor: ${contagemAtual.totalSensor}\nTotal Visual: ${contagemAtual.totalVisual}\nPontos: ${contagemAtual.pontos.length}`);
            
            fecharModal('modalMenu');
            mostrarTela('telaInicial');
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
                    <p>Sensor: ${contagem.totalSensor} | Visual: ${contagem.totalVisual}</p>
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

            const pontosDetalhes = contagem.pontos.map(p => 
                `Ponto ${p.numero}: Sensor=${p.sensor}, Visual=${p.visual}`
            ).join('\n');

            document.getElementById('conteudoModal').innerHTML = `
                <p><strong>Data:</strong> ${contagem.data}</p>
                <p><strong>Veículo:</strong> ${contagem.veiculo}</p>
                <p><strong>Status:</strong> ${contagem.finalizada ? 'Finalizada' : 'Em andamento'}</p>
                <p><strong>Total Sensor:</strong> ${contagem.totalSensor}</p>
                <p><strong>Total Visual:</strong> ${contagem.totalVisual}</p>
                <p><strong>Pontos:</strong> ${contagem.pontos.length}</p>
                <br>
                <pre>${pontosDetalhes}</pre>
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