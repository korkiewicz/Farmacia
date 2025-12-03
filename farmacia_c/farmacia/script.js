// Inicialização do banco de dados SQLite local
let db;
let produtos = [];


function myFunction() 
{
    

}
document.querySelector('#username').innerHTML = `bem vindo ${localStorage.getItem('currentUser')}! `

function inicializarAplicacao() {
    console.log('Iniciando aplicação...');

    if (typeof SQLite3 === 'undefined') {
        console.error('SQLite3 NÃO DISPONÍVEL');
        
        return;
    }

    console.log('SQLite3 WASM disponível, inicializando banco...');
    inicializarBancoDados();
}

function inicializarBancoDados() {
    console.log('Criando/abrindo banco farmacia_igor.sqlite3...');

    try {

        // USO CORRETO para SQLite3 WASM:
        db = new SQLite3.oo1.DB("/farmacia_igor.db");

        // Criar a tabela de produtos
        db.exec(`
            CREATE TABLE IF NOT EXISTS produtos (
                id INTEGER PRIMARY KEY,
                nome TEXT NOT NULL,
                tipo TEXT NOT NULL,
                categoria TEXT,
                tarja TEXT,
                descricao TEXT,
                quantidade TEXT,
                preco REAL NOT NULL,
                promocao INTEGER DEFAULT 0,
                precoAntigo REAL,
                desconto INTEGER,
                imagem TEXT
            )
        `);
        
        console.log('Tabela criada com sucesso');
        inserirProdutosIniciais();
        
    } catch(e) {
        console.error('Erro ao abrir banco:', e);
        
    }
}





function inserirProdutosIniciais() {
    try {
        console.log('🔄 Inserindo/atualizando produtos...');

        const inserts = [
            `INSERT OR IGNORE INTO produtos VALUES (1, 'Dipirona Genérica 500mg', 'medicamento', 'generico', NULL, 'Analgésico e antitérmico', '20 comprimidos', 8.50, 0, NULL, NULL, 'dipirona.jpg')`,
            `INSERT OR IGNORE INTO produtos VALUES (2, 'Rivotril 2mg', 'medicamento', 'referencia', 'preta', 'Tratamento de ansiedade', '30 comprimidos', 45.00, 1, 50.00, 10, 'rivotril.jpg')`,
            `INSERT OR IGNORE INTO produtos VALUES (3, 'Amoxicilina 500mg', 'medicamento', 'generico', 'vermelha', 'Antibiótico de amplo espectro', '21 cápsulas', 15.90, 0, NULL, NULL, 'amoxicilina.jpg')`,
            `INSERT OR IGNORE INTO produtos VALUES (4, 'Shampoo Anticaspa Clear', 'beleza', NULL, NULL, 'Controle da caspa e oleosidade', '400ml', 22.90, 1, 28.90, 20, 'shampoo.jpg')`,
            `INSERT OR IGNORE INTO produtos VALUES (5, 'Paracetamol 750mg', 'medicamento', 'generico', NULL, 'Alívio de dores e febre', '10 comprimidos', 6.50, 0, NULL, NULL, 'paracetamol.jpg')`,
            `INSERT OR IGNORE INTO produtos VALUES (6, 'Protetor Solar FPS 50', 'beleza', NULL, NULL, 'Proteção solar alta', '200ml', 45.00, 1, 55.00, 18, 'protetor-solar.webp')`,
            `INSERT OR IGNORE INTO produtos VALUES (7, 'Omeprazol 20mg', 'medicamento', 'generico', 'vermelha', 'Tratamento de úlceras e refluxo', '28 cápsulas', 12.90, 0, NULL, NULL, 'omeprazol.jpg')`,
            `INSERT OR IGNORE INTO produtos VALUES (8, 'Creme Hidratante Nivea', 'beleza', NULL, NULL, 'Hidratação intensa para pele', '400g', 18.50, 0, NULL, NULL, 'creme-hidratante-nivea-400g.webp')`,
            `INSERT OR IGNORE INTO produtos VALUES (9, 'Complexo de vitamina Pharma', 'medicamento', 'generico', NULL, 'Rico em vitaminas B, C e D', '20 comprimidos', 10.00, 0, NULL, NULL, 'PharmaWin1.jpg')`,
            `INSERT OR IGNORE INTO produtos VALUES (10, 'Complexo de vitaminas para os cabelos', 'beleza', NULL, NULL, '', '1 unidade', 35.00, 0, NULL, NULL, 'PharmaWin2.png')`,
            `INSERT OR IGNORE INTO produtos VALUES (11, 'Hidratante Pharma', 'beleza', NULL, NULL, 'Hidrata todos os cabelos', '500ml', 12.00, 0, NULL, NULL, 'PharmaWin3.png')`,
            `INSERT OR IGNORE INTO produtos VALUES (12, 'Desodorante', 'beleza', NULL, NULL, 'Melhor produto de Higiene do Pais.', '200ml', 20.00, 0, NULL, NULL, 'desodorante.gif')`

        ];

        for (let i = 0; i < inserts.length; i++) {
            try {
                db.exec(inserts[i]);
                console.log('✅ Produto processado:', i + 1);
            } catch(e) {
                console.log('ℹ️ Produto:', i + 1, '-', e.message);
            }
        }

        // console.log('🎉 Produtos processados');
        carregarProdutos();

    } catch (e) {
        // console.error('💥 Erro geral:', e);
    }
}

function carregarProdutos() {
    console.log('📥 Carregando produtos do banco...');
    
    try {
        // USO CORRETO do SQLite3 WASM - prepared statement com colunas específicas
        const stmt = db.prepare(`
            SELECT 
                id, nome, tipo, categoria, tarja, 
                descricao, quantidade, preco, promocao, 
                precoAntigo, desconto, imagem 
            FROM produtos
        `);
        
        produtos = [];
        
        while (stmt.step()) {
            // Pega cada coluna individualmente pelo índice
            const linha = [
                stmt.get(0),  // id
                stmt.get(1),  // nome
                stmt.get(2),  // tipo
                stmt.get(3),  // categoria
                stmt.get(4),  // tarja
                stmt.get(5),  // descricao
                stmt.get(6),  // quantidade
                stmt.get(7),  // preco
                stmt.get(8),  // promocao
                stmt.get(9),  // precoAntigo
                stmt.get(10), // desconto
                stmt.get(11)  // imagem
            ];
            
            console.log('📦 Produto carregado:', linha[1]);
            produtos.push(linhaProdutoParaObjeto(linha));
        }
        
        stmt.finalize();
        
        console.log('✅ Total de produtos carregados:', produtos.length);
        
        if (produtos.length > 0) {
            renderizarProdutos();
        } else {
            console.log('📭 Nenhum produto encontrado no banco');
        }
        
    } catch(e) {
        console.error('❌ Erro ao carregar produtos:', e);
    }
}

function linhaProdutoParaObjeto(linhaProduto) {
    return {
        id: linhaProduto[0],
        nome: linhaProduto[1],
        tipo: linhaProduto[2],
        categoria: linhaProduto[3],
        tarja: linhaProduto[4],
        descricao: linhaProduto[5],
        quantidade: linhaProduto[6],
        preco: linhaProduto[7],
        promocao: linhaProduto[8] === 1,
        precoAntigo: linhaProduto[9],
        desconto: linhaProduto[10],
        imagem: linhaProduto[11]
    };
}

let carrinho = [];
carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];


// Renderizar produtos
function renderizarProdutos(listaProdutos = produtos) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    listaProdutos.forEach(produto => {
        const card = criarCardProduto(produto);
        container.appendChild(card);
    });
}

// Criar card do produto
function criarCardProduto(produto) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = produto.id;

    // Tags/Labels do produto
    let labelsHTML = '';
    if (produto.tipo === 'medicamento') {
        if (produto.categoria === 'generico') {
            labelsHTML = '<span class="product-label label-generico">Genérico</span>';
        }
        if (produto.tarja === 'preta') {
            labelsHTML += '<span class="product-label label-tarja-preta" style="top: 10px; left: auto; right: 10px;">Tarja Preta</span>';
        } else if (produto.tarja === 'vermelha') {
            labelsHTML += '<span class="product-label label-tarja-vermelha" style="top: 10px; left: auto; right: 10px;">Tarja Vermelha</span>';
        }
    }

    // Criar imagem simulada de medicamento ou produto
    let imagemFallback = '';
    if (produto.tipo === 'medicamento') {
        // Cor de fundo baseada no tipo
        let corFundo = '#fff';
        let corBorda = '#ddd';
        
        if (produto.categoria === 'generico') {
            corFundo = '#fffbf0'; // Amarelo claro para genérico
            corBorda = '#ffa500';
        }
        
        if (produto.tarja === 'preta') {
            corBorda = '#000';
        } else if (produto.tarja === 'vermelha') {
            corBorda = '#dc3545';
        }
        
        // Caixa de medicamento simulada
        imagemFallback = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='${encodeURIComponent(corFundo)}'/%3E%3Crect x='20' y='30' width='160' height='140' fill='white' stroke='${encodeURIComponent(corBorda)}' stroke-width='3' rx='5'/%3E%3Ctext x='100' y='90' font-family='Arial' font-size='14' font-weight='bold' text-anchor='middle' fill='%23333'%3E${encodeURIComponent(produto.nome.substring(0, 15))}%3C/text%3E%3Ctext x='100' y='110' font-family='Arial' font-size='12' text-anchor='middle' fill='%23666'%3E${encodeURIComponent(produto.quantidade)}%3C/text%3E%3Ctext x='100' y='140' font-family='Arial' font-size='24' text-anchor='middle'%3E💊%3C/text%3E%3C/svg%3E`;
    } else {
        // Produto de beleza
        imagemFallback = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f8f9fa'/%3E%3Crect x='60' y='40' width='80' height='120' fill='white' stroke='%2390caf9' stroke-width='2' rx='8'/%3E%3Cellipse cx='100' cy='50' rx='25' ry='8' fill='%2390caf9'/%3E%3Ctext x='100' y='110' font-family='Arial' font-size='12' font-weight='bold' text-anchor='middle' fill='%23333'%3E${encodeURIComponent(produto.nome.substring(0, 12))}%3C/text%3E%3Ctext x='100' y='140' font-family='Arial' font-size='32' text-anchor='middle'%3E✨%3C/text%3E%3C/svg%3E`;
    }

    // Imagem do produto
    const imagemHTML = `
        <div class="product-image">
            ${labelsHTML}
            <img src="imagens/${produto.imagem}" alt="${produto.nome}" onerror="this.src='${imagemFallback}'">
        </div>
    `;

    // Tipo do produto
    const tipoHTML = `<span class="product-type">${produto.tipo === 'medicamento' ? '💊 Medicamento' : '✨ Beleza'}</span>`;

    // Preço
    let precoHTML = '';
    if (produto.promocao) {
        precoHTML = `
            <div class="price-promotion">
                <span class="price-old">de R$ ${produto.precoAntigo.toFixed(2)}</span>
                <span class="price-discount">-${produto.desconto}%</span>
                <span class="price-new">por R$ ${produto.preco.toFixed(2)}</span>
            </div>
        `;
    } else {
        precoHTML = `<div class="price-normal">R$ ${produto.preco.toFixed(2)}</div>`;
    }

    card.innerHTML = `
        ${imagemHTML}
        ${tipoHTML}
        <h3 style="font-size: 16px; margin: 10px 0; color: #333;">${produto.nome}</h3>
        <p class="product-description">${produto.descricao}</p>
        <p class="product-quantity">${produto.quantidade}</p>
        <div class="product-price">
            ${precoHTML}
        </div>
        <button class="buy-btn" onclick="mostrarQuantidade(${produto.id})">Comprar</button>
        <div class="quantity-selector" id="qty-${produto.id}">
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="alterarQuantidade(${produto.id}, -1)">-</button>
                <input type="number" class="quantity-input" id="input-${produto.id}" value="1" min="1" readonly>
                <button class="quantity-btn" onclick="alterarQuantidade(${produto.id}, 1)">+</button>
            </div>
            <div class="add-actions">
                <button class="add-continue-btn" onclick="adicionarEContinuar(${produto.id})">
                    Adicionar e ver mais produtos
                </button>
                <button class="add-cart-btn" onclick="adicionarEIrCarrinho(${produto.id})">
                    Adicionar e ir pro carrinho
                </button>
            </div>
        </div>
    `;

    return card;
}

// Mostrar seletor de quantidade
function mostrarQuantidade(produtoId) {
    const selector = document.getElementById(`qty-${produtoId}`);
    const btn = selector.previousElementSibling;
    
    if (selector.classList.contains('active')) {
        selector.classList.remove('active');
        btn.style.display = 'block';
    } else {
        selector.classList.add('active');
        btn.style.display = 'none';
    }
}

// Alterar quantidade
function alterarQuantidade(produtoId, delta) {
    const input = document.getElementById(`input-${produtoId}`);
    let valor = parseInt(input.value) + delta;
    if (valor < 1) valor = 1;
    input.value = valor;
}

// Adicionar e continuar comprando
function adicionarEContinuar(produtoId) {
    adicionarAoCarrinho(produtoId);
    mostrarQuantidade(produtoId);
}

// Adicionar e ir para o carrinho
function adicionarEIrCarrinho(produtoId) {
    adicionarAoCarrinho(produtoId);
    abrirCarrinho();
}

// Adicionar ao carrinho
function adicionarAoCarrinho(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    const quantidade = parseInt(document.getElementById(`input-${produtoId}`).value);
    
    const itemExistente = carrinho.find(item => item.id === produtoId);
    
    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        carrinho.push({
            ...produto,
            quantidade: quantidade


        });
    }
    
    atualizarContadorCarrinho();
    document.getElementById(`input-${produtoId}`).value = 1;
}

// Atualizar contador do carrinho
function atualizarContadorCarrinho() {
    // Conta quantos produtos diferentes (não a soma das quantidades)
    const totalProdutos = carrinho.length;
    document.getElementById('cartCount').textContent = totalProdutos;
}

// Abrir carrinho lateral
function abrirCarrinho() {
    document.getElementById('cartSidebar').classList.add('active');
    document.getElementById('cartOverlay').classList.add('active');
    renderizarCarrinho();
}

// Fechar carrinho lateral
function fecharCarrinho() {
    document.getElementById('cartSidebar').classList.remove('active');
    document.getElementById('cartOverlay').classList.remove('active');
}

// Renderizar itens do carrinho
function renderizarCarrinho() {
    const container = document.getElementById('cartItems');
    
    if (carrinho.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <div class="cart-empty-text">Seu carrinho está vazio</div>
            </div>
        `;
        document.getElementById('finalizePurchase').disabled = true;
        document.getElementById('cartTotalPrice').textContent = 'R$ 0,00';
        return;
    }
    
    document.getElementById('finalizePurchase').disabled = false;
    
    container.innerHTML = '';
    
    carrinho.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        // Imagem fallback
        let imagemFallback = '';
        if (item.tipo === 'medicamento') {
            let corFundo = item.categoria === 'generico' ? '#fffbf0' : '#fff';
            let corBorda = item.categoria === 'generico' ? '#ffa500' : '#ddd';
            if (item.tarja === 'preta') corBorda = '#000';
            else if (item.tarja === 'vermelha') corBorda = '#dc3545';
            
            imagemFallback = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='${encodeURIComponent(corFundo)}'/%3E%3Crect x='10' y='15' width='60' height='50' fill='white' stroke='${encodeURIComponent(corBorda)}' stroke-width='2' rx='3'/%3E%3Ctext x='40' y='45' font-family='Arial' font-size='24' text-anchor='middle'%3E💊%3C/text%3E%3C/svg%3E`;
        } else {
            imagemFallback = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23f8f9fa'/%3E%3Crect x='25' y='15' width='30' height='50' fill='white' stroke='%2390caf9' stroke-width='2' rx='4'/%3E%3Ctext x='40' y='50' font-family='Arial' font-size='20' text-anchor='middle'%3E✨%3C/text%3E%3C/svg%3E`;
        }
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="imagens/${item.imagem}" alt="${item.nome}" onerror="this.src='${imagemFallback}'">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.nome}</div>
                <div class="cart-item-quantity">${item.quantidade}</div>
                <div class="cart-item-price">R$ ${(item.preco * item.quantidade).toFixed(2)}</div>
                <div class="cart-item-actions">
                    <button class="cart-item-qty-btn" onclick="alterarQuantidadeCarrinho(${item.id}, -1)">-</button>
                    <span class="cart-item-qty">${item.quantidade}</span>
                    <button class="cart-item-qty-btn" onclick="alterarQuantidadeCarrinho(${item.id}, 1)">+</button>
                    <button class="cart-item-remove" onclick="removerDoCarrinho(${item.id})">Remover</button>
                </div>
            </div>
        `;
        
        container.appendChild(cartItem);
    });
    
    // Atualizar total
    const total = calcularTotal();
    document.getElementById('cartTotalPrice').textContent = `R$ ${total.toFixed(2)}`;
}

// Calcular total do carrinho
function calcularTotal() {
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
}

// Alterar quantidade no carrinho
function alterarQuantidadeCarrinho(produtoId, delta) {
    const item = carrinho.find(i => i.id === produtoId);
    
    if (item) {
        item.quantidade += delta;
        
        if (item.quantidade <= 0) {
            removerDoCarrinho(produtoId);
        } else {
            renderizarCarrinho();
        }
    }
}

// Remover produto do carrinho
function removerDoCarrinho(produtoId) {
    carrinho = carrinho.filter(item => item.id !== produtoId);
    atualizarContadorCarrinho();
    renderizarCarrinho();
}

// Abrir modal de checkout
function abrirCheckout() {
    // Fechar carrinho lateral antes de abrir checkout
    fecharCarrinho();
    
    document.getElementById('checkoutModal').classList.add('active');
    verificarRestricaoEntrega();
    renderizarProdutosCheckout();
    atualizarResumo();
}

// Verificar se há restrição de entrega
function verificarRestricaoEntrega() {
    // Verifica se há medicamentos controlados no carrinho
    const temMedicamentoControlado = carrinho.some(item => 
        item.tipo === 'medicamento' && (item.tarja === 'preta' || item.tarja === 'vermelha')
    );
    
    const opcaoPadrao = document.querySelector('input[name="delivery"][value="padrao"]');
    const opcaoProgramada = document.querySelector('input[name="delivery"][value="programada"]');
    const cardPadrao = opcaoPadrao.closest('.delivery-option-card');
    const cardProgramada = opcaoProgramada.closest('.delivery-option-card');
    
    if (temMedicamentoControlado) {
        // Desabilitar entregas, permitir apenas retirada
        opcaoPadrao.disabled = true;
        opcaoProgramada.disabled = true;
        cardPadrao.classList.add('disabled');
        cardProgramada.classList.add('disabled');
        
        // Selecionar automaticamente retirada em loja
        document.querySelector('input[name="delivery"][value="loja"]').checked = true;
        
        // Adicionar aviso
        if (!document.getElementById('deliveryWarning')) {
            const aviso = document.createElement('div');
            aviso.id = 'deliveryWarning';
            aviso.className = 'delivery-warning';
            aviso.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <div>
                    <strong>Atenção: Medicamentos Controlados</strong>
                    <p>Seu carrinho contém medicamentos de tarja preta ou vermelha com retenção de receita. Por questões de segurança e legislação sanitária, estes produtos só podem ser retirados presencialmente em nossa loja, mediante apresentação da receita médica original.</p>
                </div>
            `;
            
            const deliverySection = document.querySelector('.delivery-options-horizontal');
            deliverySection.parentElement.insertBefore(aviso, deliverySection);
        }
    } else {
        // Habilitar todas as opções
        opcaoPadrao.disabled = false;
        opcaoProgramada.disabled = false;
        cardPadrao.classList.remove('disabled');
        cardProgramada.classList.remove('disabled');
        
        // Remover aviso se existir
        const aviso = document.getElementById('deliveryWarning');
        if (aviso) aviso.remove();
    }
}

// Fechar modal de checkout
function fecharCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
}

// Renderizar produtos na tabela de checkout
function renderizarProdutosCheckout() {
    const container = document.getElementById('checkoutProductsList');
    container.innerHTML = '';
    
    carrinho.forEach(item => {
        // Imagem fallback
        let imagemFallback = '';
        if (item.tipo === 'medicamento') {
            let corFundo = item.categoria === 'generico' ? '#fffbf0' : '#fff';
            let corBorda = item.categoria === 'generico' ? '#ffa500' : '#ddd';
            if (item.tarja === 'preta') corBorda = '#000';
            else if (item.tarja === 'vermelha') corBorda = '#dc3545';
            
            imagemFallback = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='${encodeURIComponent(corFundo)}'/%3E%3Crect x='8' y='12' width='44' height='36' fill='white' stroke='${encodeURIComponent(corBorda)}' stroke-width='2' rx='2'/%3E%3Ctext x='30' y='35' font-family='Arial' font-size='18' text-anchor='middle'%3E💊%3C/text%3E%3C/svg%3E`;
        } else {
            imagemFallback = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='%23f8f9fa'/%3E%3Crect x='20' y='12' width='20' height='36' fill='white' stroke='%2390caf9' stroke-width='2' rx='3'/%3E%3Ctext x='30' y='35' font-family='Arial' font-size='16' text-anchor='middle'%3E✨%3C/text%3E%3C/svg%3E`;
        }
        
        // Verifica se precisa de receita
        const precisaReceita = item.tipo === 'medicamento' && (item.tarja === 'preta' || item.tarja === 'vermelha');
        const receitaAnexada = item.receita ? true : false;
        
        // HTML para upload de receita
        let receitaHTML = '';
        if (precisaReceita) {
            if (receitaAnexada) {
                receitaHTML = `
                    <div class="prescription-status uploaded">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Receita anexada</span>
                        <button class="btn-remove-prescription" onclick="removerReceita(${item.id})">×</button>
                    </div>
                `;
            } else {
                receitaHTML = `
                    <div class="prescription-required">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <span>Receita obrigatória</span>
                        <label class="btn-upload-prescription">
                            <input type="file" accept="image/*,.pdf" onchange="anexarReceita(${item.id}, this.files[0])" style="display: none;">
                            📎 Anexar
                        </label>
                    </div>
                `;
            }
        }
        
        const row = document.createElement('div');
        row.className = 'product-row';
        row.innerHTML = `
            <div class="product-info">
                <div class="product-img">
                    <img src="imagens/${item.imagem}" 
                    alt="${item.nome}" onerror="this.src='${imagemFallback}'">
                </div>
                <div class="product-details">
                    <h4>${item.nome}</h4>
                    <p>${item.descricao} - ${item.quantidade}</p>
                    ${receitaHTML}
                </div>
            </div>
            <div>-</div>
            <div class="product-price">R$ ${item.preco.toFixed(2)}</div>
            <div class="product-quantity-controls">
                <button class="qty-btn-small" onclick="alterarQuantidadeCheckout(${item.id}, -1)">-</button>
                <span class="qty-display">${item.quantidade}</span>
                <button class="qty-btn-small" onclick="alterarQuantidadeCheckout(${item.id}, 1)">+</button>
            </div>
            <div class="product-total">
                R$ ${(item.preco * item.quantidade).toFixed(2)}
                <button class="remove-product" onclick="removerDoCarrinhoCheckout(${item.id})" title="Remover">×</button>
            </div>
        `;
        container.appendChild(row);
    });
}

// Alterar quantidade no checkout
function alterarQuantidadeCheckout(produtoId, delta) {
    const item = carrinho.find(i => i.id === produtoId);
    
    if (item) {
        item.quantidade += delta;
        
        if (item.quantidade <= 0) {
            removerDoCarrinhoCheckout(produtoId);
        } else {
            verificarRestricaoEntrega();
            renderizarProdutosCheckout();
            atualizarResumo();
        }
    }
}

// Remover do carrinho no checkout
function removerDoCarrinhoCheckout(produtoId) {
    carrinho = carrinho.filter(item => item.id !== produtoId);
    atualizarContadorCarrinho();
    
    if (carrinho.length === 0) {
        fecharCheckout();
        alert('Seu carrinho está vazio!');
    } else {
        verificarRestricaoEntrega();
        renderizarProdutosCheckout();
        atualizarResumo();
    }
}

// Variáveis globais
let descontoAtivo = 0;
let cupomAplicado = null;

// Atualizar resumo
function atualizarResumo() {
    const subtotal = calcularTotal();
    const entregaSelecionada = document.querySelector('input[name="delivery"]:checked');
    const valorEntrega = entregaSelecionada ? parseFloat(entregaSelecionada.dataset.price) : 0;
    const total = subtotal + valorEntrega - descontoAtivo;
    
    document.getElementById('summarySubtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
    document.getElementById('summaryDelivery').textContent = valorEntrega === 0 ? 'Grátis' : `R$ ${valorEntrega.toFixed(2)}`;
    
    if (descontoAtivo > 0) {
        document.getElementById('summaryDiscountRow').style.display = 'flex';
        document.getElementById('summaryDiscount').textContent = `- R$ ${descontoAtivo.toFixed(2)}`;
    } else {
        document.getElementById('summaryDiscountRow').style.display = 'none';
    }
    
    document.getElementById('summaryTotal').textContent = `R$ ${total.toFixed(2)}`;
    
    // Frete grátis
    const valorParaFreteGratis = 119.01;
    if (subtotal < valorParaFreteGratis) {
        document.getElementById('freeShippingInfo').style.display = 'block';
        document.getElementById('freeShippingValue').textContent = (valorParaFreteGratis - subtotal).toFixed(2);
    } else {
        document.getElementById('freeShippingInfo').style.display = 'none';
    }
}

// Calcular frete
function calcularFrete() {
    const cep = document.getElementById('deliveryCEP').value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        alert('Por favor, digite um CEP válido!');
        return;
    }
    
    document.getElementById('displayCEP').textContent = cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    alert(`CEP ${cep.replace(/(\d{5})(\d{3})/, '$1-$2')} confirmado!\n\nOpções de entrega calculadas com sucesso.`);
}

// Aplicar cupom
function aplicarCupom() {
    const codigo = document.getElementById('couponCode').value.trim();
    
    if (!codigo) {
        alert('Digite um código de cupom!');
        return;
    }
    
    const cupons = {
        'PRIMEIRACOMPRA': { tipo: 'percentual', valor: 0.10 }, // 10%
        'BEMVINDO': { tipo: 'fixo', valor: 5.00 },             // R$ 5
        'FRETEGRATIS': { tipo: 'frete', valor: 0 }             // Frete grátis
    };
    
    if (cupons.hasOwnProperty(codigo)) {
        const cupom = cupons[codigo];
        cupomAplicado = codigo;
        
        if (cupom.tipo === 'frete') {
            // Desconto igual ao valor do frete selecionado
            const entregaSelecionada = document.querySelector('input[name="delivery"]:checked');
            const valorEntrega = parseFloat(entregaSelecionada.dataset.price);
            
            if (valorEntrega === 0) {
                alert('❌ Este cupom não se aplica!\n\nVocê já selecionou Retirada em Loja (frete grátis).');
                cupomAplicado = null;
                return;
            }
            
            descontoAtivo = valorEntrega;
            alert(`✅ Cupom aplicado com sucesso!\n\nFrete grátis! Você economizou R$ ${valorEntrega.toFixed(2)}`);
        } else if (cupom.tipo === 'fixo') {
            descontoAtivo = cupom.valor;
            alert(`✅ Cupom aplicado com sucesso!\n\nDesconto de R$ ${descontoAtivo.toFixed(2)}`);
        } else if (cupom.tipo === 'percentual') {
            descontoAtivo = calcularTotal() * cupom.valor;
            alert(`✅ Cupom aplicado com sucesso!\n\nDesconto de ${(cupom.valor * 100).toFixed(0)}% (R$ ${descontoAtivo.toFixed(2)})`);
        }
        
        document.getElementById('couponCode').value = '';
        document.getElementById('couponCode').disabled = true;
        document.getElementById('applyCoupon').disabled = true;
        document.getElementById('applyCoupon').textContent = 'Aplicado';
        atualizarResumo();
    } else {
        alert('❌ Cupom inválido!');
    }
}

// Confirmar compra
function confirmarCompra() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    // Verificar se há medicamentos controlados sem receita
    const medicamentosControlados = carrinho.filter(item => 
        item.tipo === 'medicamento' && (item.tarja === 'preta' || item.tarja === 'vermelha')
    );
    
    const medicamentosSemReceita = medicamentosControlados.filter(item => !item.receita);
    
    if (medicamentosSemReceita.length > 0) {
        const nomesRemedio = medicamentosSemReceita.map(item => `• ${item.nome}`).join('\n');
        alert(`⚠️ Atenção!\n\nOs seguintes medicamentos controlados precisam de receita médica:\n\n${nomesRemedio}\n\nPor favor, anexe a receita antes de finalizar a compra.`);
        return;
    }
    
    const cep = document.getElementById('deliveryCEP').value.replace(/\D/g, '');
    
    if (!cep || cep.length !== 8) {
        alert('Por favor, informe um CEP válido para calcular o frete!');
        document.getElementById('deliveryCEP').focus();
        return;
    }
    
    const entregaSelecionada = document.querySelector('input[name="delivery"]:checked');
    const tipoEntrega = entregaSelecionada.parentElement.querySelector('strong').textContent;
    const valorEntrega = parseFloat(entregaSelecionada.dataset.price);
    
    const subtotal = calcularTotal();
    const total = subtotal + valorEntrega - descontoAtivo;
    
    const pedido = {
        produtos: carrinho.map(item => ({
            ...item,
            receitaAnexada: item.receita ? true : false
        })),
        subtotal: subtotal,
        entrega: {
            tipo: tipoEntrega,
            valor: valorEntrega,
            cep: cep
        },
        cupom: cupomAplicado,
        desconto: descontoAtivo,
        total: total,
        data: new Date().toISOString()
    };
    
    // Salvar pedido
    let pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
    pedidos.push(pedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    localStorage.removeItem('carrinho');
    
    const numeroPedido = Math.floor(100000 + Math.random() * 900000);
    
    let mensagemReceitas = '';
    if (medicamentosControlados.length > 0) {
        mensagemReceitas = `\n✅ Receitas anexadas: ${medicamentosControlados.length} medicamento(s) controlado(s)\n`;
    }
    
    alert(`✅ Pedido #${numeroPedido} confirmado com sucesso!

Subtotal: R$ ${subtotal.toFixed(2)}
Entrega: ${tipoEntrega} - ${valorEntrega === 0 ? 'Grátis' : 'R$ ' + valorEntrega.toFixed(2)}
${descontoAtivo > 0 ? 'Desconto: R$ ' + descontoAtivo.toFixed(2) + '\n' : ''}${mensagemReceitas}
Total: R$ ${total.toFixed(2)}

Entrega no CEP: ${cep.replace(/(\d{5})(\d{3})/, '$1-$2')}

Obrigado por comprar na Farmácia Igor! 🎉`);
    
    // Limpar tudo
    carrinho = [];
    descontoAtivo = 0;
    cupomAplicado = null;
    atualizarContadorCarrinho();
    document.getElementById('couponCode').disabled = false;
    document.getElementById('applyCoupon').disabled = false;
    document.getElementById('applyCoupon').textContent = 'Ativar';
    document.getElementById('couponCode').value = '';
    document.getElementById('deliveryCEP').value = '';
    
    fecharCheckout();
    fecharCarrinho();
}

// Anexar receita
function anexarReceita(produtoId, arquivo) {
    if (!arquivo) return;
    
    // Validar tipo de arquivo
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!tiposPermitidos.includes(arquivo.type)) {
        alert('❌ Formato não suportado!\n\nPor favor, envie imagens (JPG, PNG) ou PDF.');
        return;
    }
    
    // Validar tamanho (máximo 5MB)
    const tamanhoMaximo = 5 * 1024 * 1024; // 5MB
    if (arquivo.size > tamanhoMaximo) {
        alert('❌ Arquivo muito grande!\n\nO tamanho máximo é 5MB.');
        return;
    }
    
    const item = carrinho.find(i => i.id === produtoId);
    if (item) {
        // Simular armazenamento do arquivo (em produção, enviaria para servidor)
        item.receita = {
            nome: arquivo.name,
            tamanho: arquivo.size,
            tipo: arquivo.type,
            dataAnexo: new Date().toISOString()
        };
        
        verificarRestricaoEntrega();
        renderizarProdutosCheckout();
        alert(`✅ Receita anexada com sucesso!\n\nArquivo: ${arquivo.name}\nTamanho: ${(arquivo.size / 1024).toFixed(1)} KB`);
    }
}

// Remover receita
function removerReceita(produtoId) {
    const item = carrinho.find(i => i.id === produtoId);
    if (item) {
        delete item.receita;
        verificarRestricaoEntrega();
        renderizarProdutosCheckout();
        alert('Receita removida!');
    }
}

// Pesquisar produtos
function pesquisarProdutos() {
    const termo = document.getElementById('searchInput').value.toLowerCase();
    
    if (termo === '') {
        renderizarProdutos();
        return;
    }
    
    const resultados = produtos.filter(p => 
        p.nome.toLowerCase().includes(termo) ||
        p.descricao.toLowerCase().includes(termo) ||
        p.tipo.toLowerCase().includes(termo)
    );
    
    renderizarProdutos(resultados);
}

// Event Listeners
document.getElementById('searchBtn').addEventListener('click', pesquisarProdutos);
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        pesquisarProdutos();
    }
});

document.getElementById('loginBtn').addEventListener('click', () => {
    if (localStorage.getItem("sessionActive") !== "true" || localStorage.getItem('currentUser') === null)
        {
        
        localStorage.setItem('carrinho', JSON.stringify(carrinho));


        window.location.href = "../farmacia.old.001/index.html";

        }
});

document.getElementById('cartBtn').addEventListener('click', () => {
    abrirCarrinho();
});

document.getElementById('closeCart').addEventListener('click', () => {
    fecharCarrinho();
});

document.getElementById('cartOverlay').addEventListener('click', () => {
    fecharCarrinho();
});

document.getElementById('finalizePurchase').addEventListener('click', () => {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    if (localStorage.getItem("sessionActive") !== "true")
        {
        localStorage.setItem('carrinho', JSON.stringify(carrinho));

        alert('⚠️ Você precisa estar logado para finalizar a compra.\n\nSerá redirecionado para a página de login.');
        window.location.href = "../farmacia.old.001/index.html";
        }
    
    abrirCheckout();
});

document.getElementById('closeCheckout').addEventListener('click', () => {
    fecharCheckout();
});

document.getElementById('continueShoppingBtn').addEventListener('click', () => {
    fecharCheckout();
    fecharCarrinho();
});

document.getElementById('confirmPurchaseBtn').addEventListener('click', () => {
    confirmarCompra();
});

document.getElementById('calculateShipping').addEventListener('click', () => {
    calcularFrete();
});

document.getElementById('applyCoupon').addEventListener('click', () => {
    aplicarCupom();
});

document.getElementById('viewCoupons').addEventListener('click', () => {
    alert('Cupons disponíveis:\n\n• PRIMEIRACOMPRA - 10% de desconto\n• FRETEGRATIS - Frete grátis\n• BEMVINDO - R$ 5 de desconto');
});

// Converter cupom para maiúsculas e apenas alfanuméricos
document.getElementById('couponCode').addEventListener('input', function(e) {
    // Remove caracteres especiais e espaços, mantém apenas letras e números
    let valor = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    // Converte para maiúsculas
    e.target.value = valor.toUpperCase();
});

// Atualizar resumo quando mudar entrega
document.querySelectorAll('input[name="delivery"]').forEach(radio => {
    radio.addEventListener('change', () => {
        atualizarResumo();
        // Reaplica cupom FRETEGRATIS se estiver ativo
        if (cupomAplicado === 'FRETEGRATIS') {
            const entregaSelecionada = document.querySelector('input[name="delivery"]:checked');
            const valorEntrega = parseFloat(entregaSelecionada.dataset.price);
            descontoAtivo = valorEntrega;
            atualizarResumo();
        }
    });
});

// Inicializar
inicializarBancoDados();
