/* ============================================================
   BarberFacil - Gestão de Vendas (Pedidos)
   ============================================================ */

const Vendas = {
  itensVenda: [],

  carregarTabela(containerId, filtro = '', statusFiltro = '') {
    const tbody = document.getElementById(containerId);
    if (!tbody) return;

    let pedidos = Storage.getPedidos();

    if (filtro) {
      const f = filtro.toLowerCase();
      pedidos = pedidos.filter(p => {
        const cliente = Storage.buscarClientePorId(p.clienteId);
        return (cliente && cliente.nome.toLowerCase().includes(f)) ||
               p.statusPagamento.toLowerCase().includes(f) ||
               p.metodoPagamento.toLowerCase().includes(f);
      });
    }

    if (statusFiltro) {
      pedidos = pedidos.filter(p => p.statusPagamento === statusFiltro);
    }

    // Ordenar por data (mais recente primeiro)
    pedidos.sort((a, b) => new Date(b.dataVenda) - new Date(a.dataVenda));

    if (pedidos.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="table-empty"><p>Nenhum pedido encontrado.</p></td></tr>`;
      return;
    }

    tbody.innerHTML = pedidos.map(p => {
      const cliente = Storage.buscarClientePorId(p.clienteId);
      return `
      <tr>
        <td><strong>${cliente ? Utils.escapeHtml(cliente.nome) : 'Cliente removido'}</strong></td>
        <td>${p.itens.length} item(ns)</td>
        <td class="text-mono text-bold">${Utils.formatarMoeda(p.valorTotal)}</td>
        <td><span class="badge ${p.statusPagamento === 'Concluído' ? 'badge-concluido' : 'badge-pendente'}">${p.statusPagamento}</span></td>
        <td>${p.metodoPagamento}</td>
        <td>${Utils.formatarDataHora(p.dataVenda)}</td>
        <td>
          <div class="flex gap-1">
            <button class="btn btn-secondary btn-sm" onclick="Vendas.verDetalhes('${p.id}')">Detalhes</button>
          </div>
        </td>
      </tr>`;
    }).join('');
  },

  abrirModalVenda() {
    const modal = document.getElementById('modal-venda');
    if (!modal) return;
    this.itensVenda = [];
    Utils.limparFormulario('form-venda');
    this.preencherSelectClientes();
    this.preencherSelectProdutos();
    this.renderizarItensVenda();
    this.atualizarTotalVenda();
    modal.classList.add('show');
  },

  preencherSelectClientes() {
    const sel = document.getElementById('venda-cliente');
    if (!sel) return;
    const clientes = Storage.getClientes();
    sel.innerHTML = `<option value="">Selecione um cliente...</option>` +
      clientes.map(c => `<option value="${c.id}">${c.nome} - ${Utils.formatarCpf(c.cpf)}</option>`
      ).join('');
  },

  preencherSelectProdutos() {
    const sel = document.getElementById('venda-produto-item');
    if (!sel) return;
    const produtos = Storage.getProdutos();
    sel.innerHTML = `<option value="">Selecione...</option>` +
      produtos.filter(p => p.quantidade > 0).map(p =>
        `<option value="${p.id}" data-preco="${p.preco}" data-qtd="${p.quantidade}">${p.nome} - ${Utils.formatarMoeda(p.preco)} (${p.quantidade} un.)</option>`
      ).join('');
  },

  adicionarItem() {
    const sel = document.getElementById('venda-produto-item');
    const qtdInput = document.getElementById('venda-item-qtd');
    const produtoId = sel.value;
    const quantidade = parseInt(qtdInput.value);

    if (!produtoId || !quantidade || quantidade <= 0) {
      Utils.toast('Selecione um produto e quantidade.', 'error');
      return;
    }

    const produto = Storage.buscarProdutoPorId(produtoId);
    if (!produto) return;

    // Verificar se já foi adicionado
    const existente = this.itensVenda.find(i => i.produtoId === produtoId);
    const qtdJaAdicionada = existente ? existente.quantidade : 0;

    if (qtdJaAdicionada + quantidade > produto.quantidade) {
      Utils.toast(`Estoque insuficiente. Disponível: ${produto.quantidade - qtdJaAdicionada} un.`, 'error');
      return;
    }

    if (existente) {
      existente.quantidade += quantidade;
    } else {
      this.itensVenda.push({
        produtoId,
        nome: produto.nome,
        precoUnit: produto.preco,
        quantidade
      });
    }

    sel.value = '';
    qtdInput.value = '';
    this.renderizarItensVenda();
    this.atualizarTotalVenda();
  },

  removerItem(index) {
    this.itensVenda.splice(index, 1);
    this.renderizarItensVenda();
    this.atualizarTotalVenda();
  },

  renderizarItensVenda() {
    const container = document.getElementById('venda-itens-lista');
    if (!container) return;

    if (this.itensVenda.length === 0) {
      container.innerHTML = '<p class="text-muted text-center mt-2">Nenhum item adicionado.</p>';
      return;
    }

    container.innerHTML = `
      <table style="width:100%; margin-top:12px; font-size:0.85rem;">
        <thead>
          <tr>
            <th style="text-align:left; padding:8px;">Produto</th>
            <th style="text-align:center; padding:8px;">Qtd</th>
            <th style="text-align:right; padding:8px;">Preço</th>
            <th style="text-align:right; padding:8px;">Subtotal</th>
            <th style="padding:8px;"></th>
          </tr>
        </thead>
        <tbody>
          ${this.itensVenda.map((item, idx) => `
            <tr>
              <td style="padding:6px 8px;">${Utils.escapeHtml(item.nome)}</td>
              <td style="text-align:center; padding:6px 8px;">${item.quantidade}</td>
              <td style="text-align:right; padding:6px 8px;">${Utils.formatarMoeda(item.precoUnit)}</td>
              <td style="text-align:right; padding:6px 8px; font-weight:600;">${Utils.formatarMoeda(item.precoUnit * item.quantidade)}</td>
              <td style="padding:6px 8px;"><button class="btn btn-danger btn-sm" onclick="Vendas.removerItem(${idx})">X</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;
  },

  atualizarTotalVenda() {
    const total = this.itensVenda.reduce((sum, item) => sum + (item.precoUnit * item.quantidade), 0);
    const el = document.getElementById('venda-total');
    if (el) el.textContent = Utils.formatarMoeda(total);
  },

  salvar() {
    const clienteId = document.getElementById('venda-cliente').value;
    const metodoPagamento = document.getElementById('venda-metodo').value;
    const statusPagamento = document.getElementById('venda-status').value;

    if (!clienteId) {
      Utils.toast('Selecione um cliente.', 'error');
      return;
    }
    if (!metodoPagamento) {
      Utils.toast('Selecione o método de pagamento.', 'error');
      return;
    }
    if (!statusPagamento) {
      Utils.toast('Selecione o status do pagamento.', 'error');
      return;
    }
    if (this.itensVenda.length === 0) {
      Utils.toast('Adicione pelo menos um item.', 'error');
      return;
    }

    const sessao = Auth.getSessao();
    const valorTotal = this.itensVenda.reduce((sum, item) => sum + (item.precoUnit * item.quantidade), 0);

    const pedido = {
      id: Utils.gerarId(),
      clienteId,
      itens: this.itensVenda.map(i => ({
        produtoId: i.produtoId,
        quantidade: i.quantidade,
        precoUnit: i.precoUnit
      })),
      valorTotal,
      statusPagamento,
      metodoPagamento,
      dataVenda: Utils.dataAtual(),
      vendedorCpf: sessao ? sessao.cpf : ''
    };

    // Deduzir estoque
    this.itensVenda.forEach(item => {
      const produto = Storage.buscarProdutoPorId(item.produtoId);
      if (produto) {
        Storage.atualizarProduto(item.produtoId, {
          quantidade: produto.quantidade - item.quantidade
        });
        Storage.adicionarMovimentacao({
          id: Utils.gerarId(),
          produtoId: item.produtoId,
          tipo: 'saida',
          quantidade: item.quantidade,
          data: Utils.dataAtual(),
          observacao: `Venda - Pedido ${pedido.id}`
        });
      }
    });

    Storage.adicionarPedido(pedido);

    const cliente = Storage.buscarClientePorId(clienteId);
    Utils.toast(`Venda de ${Utils.formatarMoeda(valorTotal)} para ${cliente?.nome || 'cliente'} registrada!`, 'success');

    this.fecharModal();
    this.carregarTabela('tbody-pedidos', '', '');
    Produtos.atualizarContagem();
  },

  fecharModal() {
    const modal = document.getElementById('modal-venda');
    if (modal) modal.classList.remove('show');
  },

  verDetalhes(pedidoId) {
    const pedido = Storage.getPedidos().find(p => p.id === pedidoId);
    if (!pedido) return;

    const cliente = Storage.buscarClientePorId(pedido.clienteId);
    const vendedor = Storage.buscarUsuarioPorCpf(pedido.vendedorCpf);

    const modal = document.getElementById('modal-detalhes-venda');
    if (!modal) return;

    const body = document.getElementById('detalhes-venda-body');
    body.innerHTML = `
      <div class="flex-between mb-2">
        <div>
          <div class="text-muted text-sm">Cliente</div>
          <strong>${cliente ? Utils.escapeHtml(cliente.nome) : 'N/A'}</strong>
        </div>
        <div class="text-right">
          <div class="text-muted text-sm">Vendedor</div>
          <strong>${vendedor ? Utils.escapeHtml(vendedor.nome) : 'N/A'}</strong>
        </div>
      </div>
      <div class="flex-between mb-2">
        <div>
          <div class="text-muted text-sm">Data</div>
          <span>${Utils.formatarDataHora(pedido.dataVenda)}</span>
        </div>
        <div class="text-right">
          <div class="text-muted text-sm">Pagamento</div>
          <span>${pedido.metodoPagamento}</span>
          <span class="badge ${pedido.statusPagamento === 'Concluído' ? 'badge-concluido' : 'badge-pendente'} ml-1">${pedido.statusPagamento}</span>
        </div>
      </div>
      <hr style="border-color: var(--border); margin: 12px 0;">
      <table style="width:100%; font-size:0.88rem;">
        <thead>
          <tr>
            <th style="text-align:left; padding:8px;">Produto</th>
            <th style="text-align:center; padding:8px;">Qtd</th>
            <th style="text-align:right; padding:8px;">Preço</th>
            <th style="text-align:right; padding:8px;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${pedido.itens.map(item => {
            const p = Storage.buscarProdutoPorId(item.produtoId);
            return `
            <tr>
              <td style="padding:8px;">${p ? Utils.escapeHtml(p.nome) : 'N/A'}</td>
              <td style="text-align:center; padding:8px;">${item.quantidade}</td>
              <td style="text-align:right; padding:8px;">${Utils.formatarMoeda(item.precoUnit)}</td>
              <td style="text-align:right; padding:8px; font-weight:600;">${Utils.formatarMoeda(item.precoUnit * item.quantidade)}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
      <div class="flex-between mt-2" style="padding-top:12px; border-top:1px solid var(--border);">
        <strong>Total</strong>
        <strong class="text-accent" style="font-size:1.2rem">${Utils.formatarMoeda(pedido.valorTotal)}</strong>
      </div>
    `;
    modal.classList.add('show');
  },

  fecharDetalhes() {
    const modal = document.getElementById('modal-detalhes-venda');
    if (modal) modal.classList.remove('show');
  },

  getStatsHoje() {
    const hoje = new Date().toISOString().split('T')[0];
    const pedidos = Storage.getPedidos().filter(p => p.dataVenda.startsWith(hoje));
    const totalVendido = pedidos.reduce((sum, p) => sum + p.valorTotal, 0);
    const pendentes = pedidos.filter(p => p.statusPagamento === 'Pendente');
    return {
      totalPedidos: pedidos.length,
      totalVendido,
      pedidosPendentes: pendentes.length,
      totalPendente: pendentes.reduce((sum, p) => sum + p.valorTotal, 0)
    };
  }
};
