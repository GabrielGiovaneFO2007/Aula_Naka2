/* ============================================================
   BarberFacil - Gestão de Clientes
   ============================================================ */

const Clientes = {
  carregarTabela(containerId, filtro = '') {
    const container = document.getElementById(containerId);
    if (!container) return;

    let clientes = Storage.getClientes();

    if (filtro) {
      const f = filtro.toLowerCase();
      clientes = clientes.filter(c =>
        c.nome.toLowerCase().includes(f) ||
        c.cpf.includes(Utils.somenteNumeros(filtro)) ||
        c.telefone.includes(f)
      );
    }

    if (clientes.length === 0) {
      container.innerHTML = `
        <div class="table-empty">
          <p>Nenhum cliente encontrado.</p>
        </div>`;
      return;
    }

    const tbody = container.querySelector('tbody') || container;
    tbody.innerHTML = clientes.map(c => `
      <tr>
        <td><strong>${Utils.escapeHtml(c.nome)}</strong></td>
        <td class="text-mono">${Utils.formatarCpf(c.cpf)}</td>
        <td>${Utils.formatarTelefone(c.telefone)}</td>
        <td>${Utils.escapeHtml(c.chavePix)}</td>
        <td>${Utils.formatarData(c.dataCadastro)}</td>
        <td>
          <div class="flex gap-1">
            <button class="btn btn-secondary btn-sm" onclick="Clientes.editar('${c.id}')">Editar</button>
            <button class="btn btn-warning btn-sm" onclick="Clientes.verHistorico('${c.id}')">Histórico</button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  abrirModalCadastro() {
    const modal = document.getElementById('modal-cliente');
    if (!modal) return;
    document.getElementById('modal-cliente-title').textContent = 'Novo Cliente';
    document.getElementById('cliente-id').value = '';
    Utils.limparFormulario('form-cliente');
    modal.classList.add('show');
  },

  editar(id) {
    const cliente = Storage.buscarClientePorId(id);
    if (!cliente) return;

    const modal = document.getElementById('modal-cliente');
    if (!modal) return;

    document.getElementById('modal-cliente-title').textContent = 'Editar Cliente';
    document.getElementById('cliente-id').value = cliente.id;
    document.getElementById('cliente-nome').value = cliente.nome;
    document.getElementById('cliente-cpf').value = cliente.cpf;
    document.getElementById('cliente-telefone').value = cliente.telefone;
    document.getElementById('cliente-pix').value = cliente.chavePix;
    modal.classList.add('show');
  },

  salvar() {
    const id = document.getElementById('cliente-id').value;
    const nome = document.getElementById('cliente-nome').value.trim();
    const cpf = Utils.somenteNumeros(document.getElementById('cliente-cpf').value);
    const telefone = Utils.somenteNumeros(document.getElementById('cliente-telefone').value);
    const chavePix = document.getElementById('cliente-pix').value.trim();

    // Validações
    if (!nome || nome.length < 3) {
      Utils.toast('Nome deve ter pelo menos 3 caracteres.', 'error');
      return;
    }
    if (!Utils.validarCpf(cpf)) {
      Utils.toast('CPF deve conter 11 dígitos.', 'error');
      return;
    }
    if (!telefone || telefone.length < 10) {
      Utils.toast('Telefone deve conter pelo menos 10 dígitos.', 'error');
      return;
    }
    if (!chavePix) {
      Utils.toast('Chave PIX é obrigatória.', 'error');
      return;
    }
    if (Storage.cpfClienteJaCadastrado(cpf, id)) {
      Utils.toast('Este CPF já está cadastrado para outro cliente.', 'error');
      return;
    }

    if (id) {
      // Editar
      Storage.atualizarCliente(id, { nome, cpf, telefone, chavePix });
      Utils.toast('Cliente atualizado com sucesso!', 'success');
    } else {
      // Novo
      Storage.adicionarCliente({
        id: Utils.gerarId(),
        nome, cpf, telefone, chavePix,
        dataCadastro: Utils.dataAtual()
      });
      Utils.toast('Cliente cadastrado com sucesso!', 'success');
    }

    this.fecharModal();
    this.atualizarContagem();
    this.carregarTabela('tabela-clientes', document.getElementById('busca-cliente')?.value || '');
  },

  fecharModal() {
    const modal = document.getElementById('modal-cliente');
    if (modal) modal.classList.remove('show');
  },

  verHistorico(clienteId) {
    const cliente = Storage.buscarClientePorId(clienteId);
    if (!cliente) return;

    const pedidos = Storage.getPedidos().filter(p => p.clienteId === clienteId);
    const totalGasto = pedidos.reduce((sum, p) => sum + p.valorTotal, 0);

    const modal = document.getElementById('modal-historico');
    if (!modal) return;

    const body = document.getElementById('historico-body');
    body.innerHTML = `
      <div class="flex-between mb-3">
        <div>
          <strong>${Utils.escapeHtml(cliente.nome)}</strong><br>
          <span class="text-muted">CPF: ${Utils.formatarCpf(cliente.cpf)}</span>
        </div>
        <div class="text-right">
          <div class="text-muted text-sm">Total Gasto</div>
          <div class="text-accent text-bold" style="font-size:1.2rem">${Utils.formatarMoeda(totalGasto)}</div>
          <div class="text-muted text-sm">${pedidos.length} pedidos</div>
        </div>
      </div>
      ${pedidos.length === 0 ? '<p class="text-muted">Nenhum pedido encontrado.</p>' :
        pedidos.map(p => `
          <div class="flex-between" style="padding:8px 0; border-bottom:1px solid var(--border)">
            <div>
              <span class="text-mono text-sm">${Utils.formatarData(p.dataVenda)}</span><br>
              <span class="text-muted text-sm">${p.itens.length} item(ns) - ${p.metodoPagamento}</span>
            </div>
            <div class="text-right">
              <div class="text-bold">${Utils.formatarMoeda(p.valorTotal)}</div>
              <span class="badge ${p.statusPagamento === 'Concluído' ? 'badge-concluido' : 'badge-pendente'}">${p.statusPagamento}</span>
            </div>
          </div>
        `).join('')
      }
    `;
    modal.classList.add('show');
  },

  fecharHistorico() {
    const modal = document.getElementById('modal-historico');
    if (modal) modal.classList.remove('show');
  },

  atualizarContagem() {
    const el = document.getElementById('total-clientes');
    if (el) el.textContent = Storage.getClientes().length;
  }
};
