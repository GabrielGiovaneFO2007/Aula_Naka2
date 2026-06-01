/* ============================================================
   BarberFacil - Controle de Estoque (Entrada e Saída)
   ============================================================ */

const Estoque = {
  carregarTabela(containerId, filtro = '') {
    const tbody = document.getElementById(containerId);
    if (!tbody) return;

    let movs = Storage.getMovimentacoes();

    if (filtro) {
      const f = filtro.toLowerCase();
      movs = movs.filter(m => {
        const produto = Storage.buscarProdutoPorId(m.produtoId);
        return (produto && produto.nome.toLowerCase().includes(f)) ||
               m.tipo.toLowerCase().includes(f) ||
               m.observacao.toLowerCase().includes(f);
      });
    }

    // Ordenar por data (mais recente primeiro)
    movs.sort((a, b) => new Date(b.data) - new Date(a.data));

    if (movs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="table-empty"><p>Nenhuma movimentação registrada.</p></td></tr>`;
      return;
    }

    tbody.innerHTML = movs.map(m => {
      const produto = Storage.buscarProdutoPorId(m.produtoId);
      return `
      <tr>
        <td>${produto ? Utils.escapeHtml(produto.nome) : 'Produto removido'}</td>
        <td>
          <span class="badge ${m.tipo === 'entrada' ? 'badge-success' : 'badge-danger'}">
            ${m.tipo === 'entrada' ? 'ENTRADA' : 'SAÍDA'}
          </span>
        </td>
        <td class="text-bold">${m.tipo === 'entrada' ? '+' : '-'}${m.quantidade} un.</td>
        <td>${Utils.formatarDataHora(m.data)}</td>
        <td class="text-muted">${Utils.escapeHtml(m.observacao)}</td>
      </tr>`;
    }).join('');
  },

  abrirModalEntrada() {
    const modal = document.getElementById('modal-estoque');
    if (!modal) return;
    document.getElementById('modal-estoque-title').textContent = 'Registrar Entrada de Estoque';
    document.getElementById('mov-tipo').value = 'entrada';
    Utils.limparFormulario('form-mov-estoque');
    this.preencherSelectProdutos();
    modal.classList.add('show');
  },

  abrirModalSaida() {
    const modal = document.getElementById('modal-estoque');
    if (!modal) return;
    document.getElementById('modal-estoque-title').textContent = 'Registrar Saída de Estoque';
    document.getElementById('mov-tipo').value = 'saida';
    Utils.limparFormulario('form-mov-estoque');
    this.preencherSelectProdutos();
    modal.classList.add('show');
  },

  preencherSelectProdutos() {
    const sel = document.getElementById('mov-produto');
    if (!sel) return;
    const produtos = Storage.getProdutos();
    sel.innerHTML = `<option value="">Selecione um produto...</option>` +
      produtos.map(p => `<option value="${p.id}">${p.nome} (Estoque: ${p.quantidade})</option>`
      ).join('');
  },

  salvar() {
    const tipo = document.getElementById('mov-tipo').value;
    const produtoId = document.getElementById('mov-produto').value;
    const quantidade = parseInt(document.getElementById('mov-quantidade').value);
    const observacao = document.getElementById('mov-observacao').value.trim();

    if (!produtoId) {
      Utils.toast('Selecione um produto.', 'error');
      return;
    }
    if (!quantidade || quantidade <= 0) {
      Utils.toast('Quantidade deve ser maior que zero.', 'error');
      return;
    }
    if (!observacao) {
      Utils.toast('Observação é obrigatória.', 'error');
      return;
    }

    const produto = Storage.buscarProdutoPorId(produtoId);
    if (!produto) {
      Utils.toast('Produto não encontrado.', 'error');
      return;
    }

    if (tipo === 'saida' && produto.quantidade < quantidade) {
      Utils.toast(`Estoque insuficiente. Disponível: ${produto.quantidade} un.`, 'error');
      return;
    }

    // Atualizar quantidade do produto
    const novaQtd = tipo === 'entrada'
      ? produto.quantidade + quantidade
      : produto.quantidade - quantidade;
    Storage.atualizarProduto(produtoId, { quantidade: novaQtd });

    // Registrar movimentação
    Storage.adicionarMovimentacao({
      id: Utils.gerarId(),
      produtoId,
      tipo,
      quantidade,
      data: Utils.dataAtual(),
      observacao
    });

    const acao = tipo === 'entrada' ? 'Entrada' : 'Saída';
    Utils.toast(`${acao} de ${quantidade} un. de "${produto.nome}" registrada!`, 'success');

    this.fecharModal();
    this.carregarTabela('tbody-movimentacoes', document.getElementById('busca-mov')?.value || '');
    Produtos.atualizarContagem();
  },

  fecharModal() {
    const modal = document.getElementById('modal-estoque');
    if (modal) modal.classList.remove('show');
  }
};
