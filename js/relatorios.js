/* ============================================================
   BarberFacil - Relatórios
   ============================================================ */

const Relatorios = {
  // Relatório de vendas por período
  relatorioVendas(periodo = 'mensal') {
    const pedidos = Storage.getPedidos();
    const hoje = new Date();

    let dataInicio;
    if (periodo === 'mensal') {
      dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
    } else if (periodo === 'trimestral') {
      dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 3, 1);
    } else {
      dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 6, 1);
    }

    const pedidosFiltrados = pedidos.filter(p => new Date(p.dataVenda) >= dataInicio);
    const concluidos = pedidosFiltrados.filter(p => p.statusPagamento === 'Concluído');
    const pendentes = pedidosFiltrados.filter(p => p.statusPagamento === 'Pendente');

    const totalVendas = concluidos.reduce((sum, p) => sum + p.valorTotal, 0);
    const totalPendente = pendentes.reduce((sum, p) => sum + p.valorTotal, 0);

    // Vendas por cliente
    const vendasPorCliente = {};
    pedidosFiltrados.forEach(p => {
      const cliente = Storage.buscarClientePorId(p.clienteId);
      const nome = cliente ? cliente.nome : 'N/A';
      if (!vendasPorCliente[nome]) vendasPorCliente[nome] = { total: 0, qtd: 0 };
      vendasPorCliente[nome].total += p.valorTotal;
      vendasPorCliente[nome].qtd++;
    });

    // Vendas por método de pagamento
    const vendasPorMetodo = {};
    concluidos.forEach(p => {
      if (!vendasPorMetodo[p.metodoPagamento]) vendasPorMetodo[p.metodoPagamento] = 0;
      vendasPorMetodo[p.metodoPagamento] += p.valorTotal;
    });

    // Top produtos vendidos
    const vendasPorProduto = {};
    pedidosFiltrados.forEach(p => {
      p.itens.forEach(item => {
        const produto = Storage.buscarProdutoPorId(item.produtoId);
        const nome = produto ? produto.nome : 'N/A';
        if (!vendasPorProduto[nome]) vendasPorProduto[nome] = { qtd: 0, total: 0 };
        vendasPorProduto[nome].qtd += item.quantidade;
        vendasPorProduto[nome].total += item.precoUnit * item.quantidade;
      });
    });

    // Renderizar
    this.renderizarRelatorioVendas({
      periodo: periodo === 'mensal' ? 'Último Mês' : periodo === 'trimestral' ? 'Último Trimestre' : 'Último Semestre',
      dataInicio: Utils.formatarData(dataInicio.toISOString()),
      dataFim: Utils.formatarData(hoje.toISOString()),
      totalPedidos: pedidosFiltrados.length,
      totalVendas,
      totalPendente,
      concluidosCount: concluidos.length,
      pendentesCount: pendentes.length,
      vendasPorCliente,
      vendasPorMetodo,
      vendasPorProduto,
      pedidos: pedidosFiltrados.sort((a, b) => new Date(b.dataVenda) - new Date(a.dataVenda))
    });
  },

  renderizarRelatorioVendas(dados) {
    const container = document.getElementById('relatorio-vendas-conteudo');
    if (!container) return;

    const clientesOrdenados = Object.entries(dados.vendasPorCliente)
      .sort((a, b) => b[1].total - a[1].total);

    const produtosOrdenados = Object.entries(dados.vendasPorProduto)
      .sort((a, b) => b[1].qtd - a[1].qtd);

    container.innerHTML = `
      <div class="report-summary">
        <div class="summary-card">
          <div class="summary-label">Total de Vendas</div>
          <div class="summary-value positive">${Utils.formatarMoeda(dados.totalVendas)}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Pedidos (${dados.periodo})</div>
          <div class="summary-value neutral">${dados.totalPedidos}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Concluídos</div>
          <div class="summary-value positive">${dados.concluidosCount}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Pendentes</div>
          <div class="summary-value negative">${Utils.formatarMoeda(dados.totalPendente)}</div>
        </div>
      </div>

      <h3 class="mb-2 mt-3">Vendas por Cliente</h3>
      <div class="table-container mb-3">
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Pedidos</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${clientesOrdenados.map(([nome, dados]) => `
              <tr>
                <td>${Utils.escapeHtml(nome)}</td>
                <td>${dados.qtd}</td>
                <td class="text-mono">${Utils.formatarMoeda(dados.total)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <h3 class="mb-2 mt-3">Top Produtos Vendidos</h3>
      <div class="table-container mb-3">
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Qtd Vendida</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${produtosOrdenados.map(([nome, dados]) => `
              <tr>
                <td>${Utils.escapeHtml(nome)}</td>
                <td>${dados.qtd} un.</td>
                <td class="text-mono">${Utils.formatarMoeda(dados.total)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <h3 class="mb-2 mt-3">Vendas por Método de Pagamento</h3>
      <div class="table-container mb-3">
        <table>
          <thead>
            <tr>
              <th>Método</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(dados.vendasPorMetodo).map(([metodo, total]) => `
              <tr>
                <td>${metodo}</td>
                <td class="text-mono">${Utils.formatarMoeda(total)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <h3 class="mb-2 mt-3">Histórico de Pedidos</h3>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Cliente</th>
              <th>Itens</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${dados.pedidos.map(p => {
              const c = Storage.buscarClientePorId(p.clienteId);
              return `
              <tr>
                <td>${Utils.formatarData(p.dataVenda)}</td>
                <td>${c ? Utils.escapeHtml(c.nome) : 'N/A'}</td>
                <td>${p.itens.length}</td>
                <td class="text-mono">${Utils.formatarMoeda(p.valorTotal)}</td>
                <td><span class="badge ${p.statusPagamento === 'Concluído' ? 'badge-concluido' : 'badge-pendente'}">${p.statusPagamento}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // Relatório financeiro (Admin only)
  relatorioFinanceiro() {
    const produtos = Storage.getProdutos();
    const pedidos = Storage.getPedidos();
    const movs = Storage.getMovimentacoes();

    // Total em estoque (valor)
    const valorEstoque = produtos.reduce((sum, p) => sum + (p.preco * p.quantidade), 0);

    // Total investido (entradas)
    const totalInvestido = movs
      .filter(m => m.tipo === 'entrada')
      .reduce((sum, m) => sum + m.quantidade, 0);

    // Total vendido (saídas por vendas)
    const vendasConcluidas = pedidos.filter(p => p.statusPagamento === 'Concluído');
    const totalReceita = vendasConcluidas.reduce((sum, p) => sum + p.valorTotal, 0);

    const totalPendente = pedidos.filter(p => p.statusPagamento === 'Pendente')
      .reduce((sum, p) => sum + p.valorTotal, 0);

    // Lucro estimado (receita - custo estimado 40%)
    const custoEstimado = totalReceita * 0.4;
    const lucroEstimado = totalReceita - custoEstimado;

    const container = document.getElementById('relatorio-financeiro-conteudo');
    if (!container) return;

    container.innerHTML = `
      <div class="report-summary">
        <div class="summary-card">
          <div class="summary-label">Receita Total</div>
          <div class="summary-value positive">${Utils.formatarMoeda(totalReceita)}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Pendente a Receber</div>
          <div class="summary-value negative">${Utils.formatarMoeda(totalPendente)}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Custo Estimado (40%)</div>
          <div class="summary-value negative">${Utils.formatarMoeda(custoEstimado)}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Lucro Estimado</div>
          <div class="summary-value positive">${Utils.formatarMoeda(lucroEstimado)}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Valor em Estoque</div>
          <div class="summary-value neutral">${Utils.formatarMoeda(valorEstoque)}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Total de Pedidos</div>
          <div class="summary-value neutral">${pedidos.length}</div>
        </div>
      </div>

      <h3 class="mb-2 mt-3">Produtos em Estoque (Valor)</h3>
      <div class="table-container mb-3">
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Preço Unit.</th>
              <th>Valor Total</th>
            </tr>
          </thead>
          <tbody>
            ${produtos.map(p => `
              <tr>
                <td>${Utils.escapeHtml(p.nome)}</td>
                <td>${p.quantidade} un.</td>
                <td class="text-mono">${Utils.formatarMoeda(p.preco)}</td>
                <td class="text-mono text-bold">${Utils.formatarMoeda(p.preco * p.quantidade)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // Frequência de compra de clientes
  relatorioFrequencia() {
    const pedidos = Storage.getPedidos();
    const clientes = Storage.getClientes();
    const hoje = new Date();

    const frequencia = clientes.map(c => {
      const pedidosCliente = pedidos.filter(p => p.clienteId === c.id);
      const ultimoPedido = pedidosCliente.length > 0
        ? Math.max(...pedidosCliente.map(p => new Date(p.dataVenda).getTime()))
        : 0;
      const diasSemCompra = ultimoPedido ? Math.floor((hoje.getTime() - ultimoPedido) / (1000 * 60 * 60 * 24)) : 999;
      const totalGasto = pedidosCliente.reduce((sum, p) => sum + p.valorTotal, 0);

      return {
        id: c.id,
        nome: c.nome,
        cpf: c.cpf,
        telefone: c.telefone,
        totalPedidos: pedidosCliente.length,
        totalGasto,
        ultimoPedido: ultimoPedido ? Utils.formatarData(new Date(ultimoPedido).toISOString()) : 'Nunca comprou',
        diasSemCompra,
        status: diasSemCompra > 30 ? 'inativo' : diasSemCompra > 15 ? 'atenção' : 'ativo'
      };
    });

    // Ordenar: inativos primeiro
    frequencia.sort((a, b) => b.diasSemCompra - a.diasSemCompra);

    const inativos = frequencia.filter(f => f.status === 'inativo').length;
    const atencao = frequencia.filter(f => f.status === 'atenção').length;
    const ativos = frequencia.filter(f => f.status === 'ativo').length;

    const container = document.getElementById('relatorio-frequencia-conteudo');
    if (!container) return;

    container.innerHTML = `
      <div class="report-summary">
        <div class="summary-card">
          <div class="summary-label">Clientes Ativos</div>
          <div class="summary-value positive">${ativos}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Em Atenção (15-30 dias)</div>
          <div class="summary-value neutral" style="color:var(--warning)">${atencao}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Inativos (>30 dias)</div>
          <div class="summary-value negative">${inativos}</div>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Telefone</th>
              <th>Pedidos</th>
              <th>Total Gasto</th>
              <th>Última Compra</th>
              <th>Dias</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${frequencia.map(f => `
              <tr>
                <td><strong>${Utils.escapeHtml(f.nome)}</strong></td>
                <td>${Utils.formatarTelefone(f.telefone)}</td>
                <td>${f.totalPedidos}</td>
                <td class="text-mono">${Utils.formatarMoeda(f.totalGasto)}</td>
                <td>${f.ultimoPedido}</td>
                <td class="text-bold ${f.diasSemCompra > 30 ? 'text-danger' : f.diasSemCompra > 15 ? 'text-warning' : 'text-success'}">${f.diasSemCompra > 900 ? '-' : f.diasSemCompra}</td>
                <td>
                  <span class="badge ${f.status === 'ativo' ? 'badge-success' : f.status === 'atenção' ? 'badge-warning' : 'badge-danger'}">
                    ${f.status === 'ativo' ? 'ATIVO' : f.status === 'atenção' ? 'ATENÇÃO' : 'INATIVO'}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // Relatório do dia (Colaborador)
  relatorioDoDia() {
    const stats = Vendas.getStatsHoje();
    const hoje = new Date().toISOString().split('T')[0];
    const pedidos = Storage.getPedidos().filter(p => p.dataVenda.startsWith(hoje));

    const container = document.getElementById('relatorio-dia-conteudo');
    if (!container) return;

    container.innerHTML = `
      <div class="report-summary">
        <div class="summary-card">
          <div class="summary-label">Pedidos Hoje</div>
          <div class="summary-value neutral">${stats.totalPedidos}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Vendido Hoje</div>
          <div class="summary-value positive">${Utils.formatarMoeda(stats.totalVendido)}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Pendentes</div>
          <div class="summary-value negative">${stats.totalPendente}</div>
        </div>
      </div>

      <h3 class="mb-2 mt-3">Pedidos de Hoje</h3>
      <div class="table-container">
        ${pedidos.length === 0 ?
          '<div class="table-empty"><p>Nenhum pedido registrado hoje.</p></div>' :
          `<table>
            <thead>
              <tr>
                <th>Hora</th>
                <th>Cliente</th>
                <th>Itens</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${pedidos.sort((a, b) => new Date(b.dataVenda) - new Date(a.dataVenda)).map(p => {
                const c = Storage.buscarClientePorId(p.clienteId);
                return `
                <tr>
                  <td>${new Date(p.dataVenda).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>${c ? Utils.escapeHtml(c.nome) : 'N/A'}</td>
                  <td>${p.itens.length}</td>
                  <td class="text-mono">${Utils.formatarMoeda(p.valorTotal)}</td>
                  <td><span class="badge ${p.statusPagamento === 'Concluído' ? 'badge-concluido' : 'badge-pendente'}">${p.statusPagamento}</span></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>`
        }
      </div>
    `;
  }
};
