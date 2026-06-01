/* ============================================================
   BarberFacil - Gestão de Produtos
   ============================================================ */

const Produtos = {
  carregarTabela(containerId, filtro = '') {
    const tbody = document.getElementById(containerId);
    if (!tbody) return;

    let produtos = Storage.getProdutos();

    if (filtro) {
      const f = filtro.toLowerCase();
      produtos = produtos.filter(p =>
        p.nome.toLowerCase().includes(f) ||
        p.marca.toLowerCase().includes(f) ||
        p.categoria.toLowerCase().includes(f)
      );
    }

    if (produtos.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="table-empty"><p>Nenhum produto encontrado.</p></td></tr>`;
      return;
    }

    tbody.innerHTML = produtos.map(p => {
      const statusClass = p.quantidade > 20 ? 'high' : p.quantidade > 5 ? 'medium' : 'low';
      return `
      <tr>
        <td><strong>${Utils.escapeHtml(p.nome)}</strong></td>
        <td>${Utils.escapeHtml(p.marca)}</td>
        <td>${Utils.escapeHtml(p.categoria)}</td>
        <td class="text-mono">${Utils.formatarMoeda(p.preco)}</td>
        <td>
          <div class="stock-indicator">
            <span class="stock-dot ${statusClass}"></span>
            <strong>${p.quantidade}</strong> un.
          </div>
        </td>
        <td class="text-mono">${Utils.formatarMoeda(p.preco * p.quantidade)}</td>
        <td>
          <div class="flex gap-1">
            <button class="btn btn-secondary btn-sm" onclick="Produtos.editar('${p.id}')">Editar</button>
          </div>
        </td>
      </tr>`;
    }).join('');
  },

  abrirModalCadastro() {
    const modal = document.getElementById('modal-produto');
    if (!modal) return;
    document.getElementById('modal-produto-title').textContent = 'Novo Produto';
    document.getElementById('produto-id').value = '';
    Utils.limparFormulario('form-produto');

    // Preencher categorias
    const sel = document.getElementById('produto-categoria');
    if (sel) {
      sel.innerHTML = APP_CONFIG.categorias.map(c =>
        `<option value="${c}">${c}</option>`
      ).join('');
    }

    modal.classList.add('show');
  },

  editar(id) {
    const produto = Storage.buscarProdutoPorId(id);
    if (!produto) return;

    const modal = document.getElementById('modal-produto');
    if (!modal) return;

    // Preencher categorias
    const sel = document.getElementById('produto-categoria');
    if (sel) {
      sel.innerHTML = APP_CONFIG.categorias.map(c =>
        `<option value="${c}" ${c === produto.categoria ? 'selected' : ''}>${c}</option>`
      ).join('');
    }

    document.getElementById('modal-produto-title').textContent = 'Editar Produto';
    document.getElementById('produto-id').value = produto.id;
    document.getElementById('produto-nome').value = produto.nome;
    document.getElementById('produto-marca').value = produto.marca;
    document.getElementById('produto-preco').value = produto.preco;
    document.getElementById('produto-quantidade').value = produto.quantidade;
    modal.classList.add('show');
  },

  salvar() {
    const id = document.getElementById('produto-id').value;
    const nome = document.getElementById('produto-nome').value.trim();
    const marca = document.getElementById('produto-marca').value.trim();
    const categoria = document.getElementById('produto-categoria').value;
    const preco = parseFloat(document.getElementById('produto-preco').value);
    const quantidade = parseInt(document.getElementById('produto-quantidade').value);

    if (!nome || nome.length < 2) {
      Utils.toast('Nome do produto é obrigatório.', 'error');
      return;
    }
    if (!marca) {
      Utils.toast('Marca é obrigatória.', 'error');
      return;
    }
    if (!preco || preco <= 0) {
      Utils.toast('Preço deve ser maior que zero.', 'error');
      return;
    }
    if (isNaN(quantidade) || quantidade < 0) {
      Utils.toast('Quantidade deve ser um número válido.', 'error');
      return;
    }

    if (id) {
      Storage.atualizarProduto(id, { nome, marca, categoria, preco, quantidade });
      Utils.toast('Produto atualizado com sucesso!', 'success');
    } else {
      Storage.adicionarProduto({
        id: Utils.gerarId(),
        nome, marca, categoria, preco, quantidade
      });
      Utils.toast('Produto cadastrado com sucesso!', 'success');
    }

    this.fecharModal();
    this.atualizarContagem();
    this.carregarTabela('tbody-produtos', document.getElementById('busca-produto')?.value || '');
  },

  fecharModal() {
    const modal = document.getElementById('modal-produto');
    if (modal) modal.classList.remove('show');
  },

  atualizarContagem() {
    const el = document.getElementById('total-produtos');
    if (el) el.textContent = Storage.getProdutos().length;

    const elBaixo = document.getElementById('produtos-estoque-baixo');
    if (elBaixo) {
      elBaixo.textContent = Storage.getProdutos().filter(p => p.quantidade <= 5).length;
    }
  }
};
