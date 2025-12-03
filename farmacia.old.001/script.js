// Variáveis globais
var db = null;
var SQL = null;
var currentUser = null;
var carrinho = [];
let egg;
// Inicializar o SQLite
function initDatabase() {
    console.log("Iniciando banco de dados...");
    
    initSqlJs({
        locateFile: function(file) {
            return 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/' + file;
        }
    }).then(function(sqlLib) {
        SQL = sqlLib;
        db = new SQL.Database();
        console.log("Banco de dados criado");
        
        // Criar tabela de usuários
        db.run(`
            CREATE TABLE IF NOT EXISTS usuario (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
                name VARCHAR(100) UNIQUE, 
                password VARCHAR(100)
            );
        `);
        console.log("Tabela usuario criada");
        
        // Criar tabela de produtos
        db.run(`
            CREATE TABLE IF NOT EXISTS produtos (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                nome VARCHAR(100) NOT NULL,
                descricao VARCHAR(200),
                preco REAL NOT NULL,
                icone VARCHAR(10),
                tarja VARCHAR(20) NOT NULL,
                generico INTEGER DEFAULT 0,
                retencao_receita VARCHAR(30) NULL
            );
        `);
        console.log("Tabela produtos criada");
        
        // Verificar se existem usuários
        var resultUsuarios = db.exec("SELECT COUNT(*) as count FROM usuario");
        var countUsuarios = 0;
        if (resultUsuarios.length > 0 && resultUsuarios[0].values) {
            countUsuarios = resultUsuarios[0].values[0][0];
        }
        console.log("Número de usuários:", countUsuarios);
        
        // Inserir usuários de exemplo se não existirem
        if (countUsuarios === 0) {
            db.run("INSERT INTO usuario (name, password) VALUES ('Person 12', 'aib123456789')");
            db.run("INSERT INTO usuario (name, password) VALUES ('Person 34', 'abc123456789')");
            db.run("INSERT INTO usuario (name, password) VALUES ('admin', '123')");
            console.log("Usuários de exemplo inseridos");
        }
        
        // Verificar se existem produtos
        var resultProdutos = db.exec("SELECT COUNT(*) as count FROM produtos");
        var countProdutos = 0;
        if (resultProdutos.length > 0 && resultProdutos[0].values) {
            countProdutos = resultProdutos[0].values[0][0];
        }
        console.log("Número de produtos:", countProdutos);
        
        // Inserir produtos se não existirem
        if (countProdutos === 0) {
            // Medicamentos Tarja Vermelha (venda com receita)
            // db.run("INSERT INTO produtos (nome, descricao, preco, icone, tarja, generico) VALUES ('Amoxilina', 'Antibiótico de amplo espectro', 24.90, '💊', 'vermelha', 1)");
            // db.run("INSERT INTO produtos (nome, descricao, preco, icone, tarja, generico) VALUES ('Amoxilina (Referência)', 'Antibiótico - Marca de referência', 45.90, '💊', 'vermelha', 0)");
            // db.run("INSERT INTO produtos (nome, descricao, preco, icone, tarja, generico) VALUES ('Azitromicina', 'Antibiótico para infecções', 32.50, '💊', 'vermelha', 1)");
            // db.run("INSERT INTO produtos (nome, descricao, preco, icone, tarja, generico) VALUES ('Omeprazol', 'Protetor gástrico', 15.90, '💊', 'vermelha', 1)");
            // db.run("INSERT INTO produtos (nome, descricao, preco, icone, tarja, generico) VALUES ('Losartana', 'Anti-hipertensivo', 18.90, '💊', 'vermelha', 1)");
            // db.run("INSERT INTO produtos (nome, descricao, preco, icone, tarja, generico) VALUES ('Losartana Potássica (Cozaar)', 'Anti-hipertensivo - Referência', 38.90, '💊', 'vermelha', 0)");
            
            // Medicamentos Tarja Preta (controle especial)
            // db.run("INSERT INTO produtos (nome, descricao, preco, icone, tarja, generico) VALUES ('Clonazepam', 'Ansiolítico - Genérico', 35.90, '💊', 'preta', 1)");
            // db.run("INSERT INTO produtos (nome, descricao, preco, icone, tarja, generico) VALUES ('Rivotril', 'Ansiolítico - Receita especial', 65.90, '💊', 'preta', 0)");
            // db.run("INSERT INTO produtos (nome, descricao, preco, icone, tarja, generico) VALUES ('Metilfenidato', 'Estimulante SNC - Genérico', 42.90, '💊', 'preta', 1)");
            // db.run("INSERT INTO produtos (nome, descricao, preco, icone, tarja, generico) VALUES ('Ritalina', 'Estimulante SNC - Referência', 72.90, '💊', 'preta', 0)");
            
            // Medicamentos Sem Tarja (venda livre)
            // db.run("INSERT INTO produtos (nome, descricao, preco, icone, tarja, generico) VALUES ('Paracetamol', 'Analgésico e antitérmico', 8.90, '💊', 'livre', 1)");
            // db.run("INSERT INTO produtos (nome, descricao, preco, icone, tarja, generico) VALUES ('Tylenol', 'Analgésico - Marca de referência', 18.90, '💊', 'livre', 0)");
            // db.run("INSERT INTO produtos (nome, descricao, preco, icone, tarja, generico) VALUES ('Dipirona Sódica', 'Analgésico e antitérmico', 6.50, '💊', 'livre', 1)");
            // db.run("INSERT INTO produtos (nome, descricao, preco, icone, tarja, generico) VALUES ('Novalgina', 'Analgésico - Referência', 16.50, '💊', 'livre', 0)");
            // // db.run("INSERT INTO produtos (nome, descricao, preco, icone, tarja, generico) VALUES ('Ibuprofeno', 'Anti-inflamatório genérico', 12.90, '💊', 'livre', 1)");
            // db.run("INSERT INTO produtos (nome, descricao, preco, icone, tarja, generico) VALUES ('Advil', 'Anti-inflamatório - Referência', 22.90, '💊', 'livre', 0)");
            // db.run("INSERT INTO produtos (nome, descricao, preco, icone, tarja, generico) VALUES ('Vitamina C', '1000mg - 30 comprimidos', 18.90, '💊', 'livre', 1)");
            
            // Produtos de Saúde (sem tarja) - não são medicamentos, então generico = 0
            // db.run("INSERT INTO produtos (nome, descricao, preco, icone, tarja, generico) VALUES ('Curativo', 'Caixa com 10 unidades', 5.90, '🩹', 'livre', 0)");
            // db.run("INSERT INTO produtos (nome, descricao, preco, icone, tarja, generico) VALUES ('Álcool em Gel', 'Frasco 500ml', 12.90, '🧴', 'livre', 0)");
            // db.run("INSERT INTO produtos (nome, descricao, preco, icone, tarja, generico) VALUES ('Termômetro', 'Digital', 29.90, '🌡️', 'livre', 0)");
            // db.run("INSERT INTO produtos (nome, descricao, preco, icone, tarja, generico) VALUES ('Protetor Solar', 'FPS 50 - 200ml', 32.90, '🧴', 'livre', 0)");
            
            // console.log("Produtos inseridos no banco de dados");
        }
        
        console.log("Banco de dados SQLite inicializado com sucesso");
        showResult("Sistema pronto!", "success");
        
    }).catch(function(error) {
        console.error("Erro ao inicializar o banco de dados:", error);
        showResult("Erro ao carregar o banco de dados: " + error.message, "error");
    });
}

function showResult(message, type) {
    var resultDiv = document.getElementById('result');
    resultDiv.textContent = message;
    
    if (type === 'success') {
        resultDiv.className = 'result-success';
    } else {
        resultDiv.className = 'result-error';
    }
    
    setTimeout(function() {
        resultDiv.style.display = 'none';
    }, 5000);
}

function showLoginForm() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('create-account-form').classList.add('hidden');
}

function showCreateAccountForm() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('create-account-form').classList.remove('hidden');
}

function showFarmaciaPage(user) {
    currentUser = user;
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('farmacia-container').style.display = 'block';
    document.getElementById('user-welcome').textContent = 'Bem-vindo, ' + user + '!';
    
    carregarProdutos();
    atualizarCarrinho();
}

function showLoginPage() {
    currentUser = null;
    document.getElementById('farmacia-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'flex';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    carrinho = [];
}

function carregarProdutos() {
    var grid = document.getElementById('produtos-grid');
    grid.innerHTML = '';
    
    // Buscar produtos do banco de dados ordenados por tarja
    var result = db.exec("SELECT id, nome, descricao, preco, icone, tarja, generico FROM produtos ORDER BY CASE tarja WHEN 'preta' THEN 1 WHEN 'vermelha' THEN 2 WHEN 'livre' THEN 3 END, generico DESC, nome");
    
    if (result.length > 0 && result[0].values) {
        var produtos = result[0].values;
        var tarjaAtual = '';
        
        for (var i = 0; i < produtos.length; i++) {
            var produto = produtos[i];
            var id = produto[0];
            var nome = produto[1];
            var descricao = produto[2];
            var preco = produto[3];
            var icone = produto[4];
            var tarja = produto[5];
            var generico = produto[6];
            
            // Adicionar título de categoria quando mudar a tarja
            if (tarja !== tarjaAtual) {
                tarjaAtual = tarja;
                var categoriaDiv = document.createElement('div');
                categoriaDiv.className = 'categoria-tarja';
                
                var tituloCategoria = '';
                var corTarja = '';
                
                if (tarja === 'preta') {
                    tituloCategoria = '⚫ TARJA PRETA - Venda sob Receita Especial';
                    corTarja = 'tarja-preta';
                } else if (tarja === 'vermelha') {
                    tituloCategoria = '🔴 TARJA VERMELHA - Venda sob Receita Médica';
                    corTarja = 'tarja-vermelha';
                } else {
                    tituloCategoria = '🟢 VENDA LIVRE - Sem necessidade de receita';
                    corTarja = 'tarja-livre';
                }
                
                categoriaDiv.innerHTML = '<h3 class="' + corTarja + '">' + tituloCategoria + '</h3>';
                grid.appendChild(categoriaDiv);
            }
            
            var produtoCard = document.createElement('div');
            produtoCard.className = 'produto-card';
            
            // Adicionar badges de tarja e genérico no card
            var badges = '';
            
            // Badge de tarja
            if (tarja === 'preta') {
                badges += '<span class="badge-tarja badge-preta">TARJA PRETA</span>';
            } else if (tarja === 'vermelha') {
                badges += '<span class="badge-tarja badge-vermelha">TARJA VERMELHA</span>';
            } else {
                badges += '<span class="badge-tarja badge-livre">VENDA LIVRE</span>';
            }
            
            // Badge de genérico (somente para medicamentos com ícone de pílula)
            if (icone === '💊') {
                if (generico === 1) {
                    badges += '<span class="badge-generico badge-generico-sim">GENÉRICO</span>';
                } else {
                    badges += '<span class="badge-generico badge-generico-nao">REFERÊNCIA</span>';
                }
            }
            
            produtoCard.innerHTML = 
                badges +
                '<div class="produto-imagem">' + icone + '</div>' +
                '<div class="produto-nome">' + nome + '</div>' +
                '<div class="produto-descricao">' + descricao + '</div>' +
                '<div class="produto-preco">R$ ' + preco.toFixed(2) + '</div>' +
                '<button class="add-carrinho-btn" onclick="adicionarAoCarrinho(' + id + ')">' +
                    'Adicionar ao Carrinho' +
                '</button>';
            
            grid.appendChild(produtoCard);
        }
    }
}

function adicionarAoCarrinho(produtoId) {
    // Buscar produto no banco de dados
    var query = "SELECT id, nome, preco, icone FROM produtos WHERE id = " + produtoId;
    var result = db.exec(query);
    
    if (result.length > 0 && result[0].values && result[0].values.length > 0) {
        var produtoData = result[0].values[0];
        var id = produtoData[0];
        var nome = produtoData[1];
        var preco = produtoData[2];
        var icone = produtoData[3];
        
        // Verificar se o produto já está no carrinho
        var itemExistente = null;
        for (var i = 0; i < carrinho.length; i++) {
            if (carrinho[i].id === id) {
                itemExistente = carrinho[i];
                break;
            }
        }
        
        if (itemExistente) {
            itemExistente.quantidade = itemExistente.quantidade + 1;
        } else {
            carrinho.push({
                id: id,
                nome: nome,
                preco: preco,
                quantidade: 1,
                icone: icone
            });
        }
        
        atualizarCarrinho();
        showResult(nome + ' adicionado ao carrinho!', "success");
    }
}



function atualizarCarrinho() {
    var carrinhoItems = document.getElementById('carrinho-items');
    var carrinhoTotal = document.getElementById('carrinho-total');
    
    carrinhoItems.innerHTML = '';
    
    if (carrinho.length === 0) {
        carrinhoTotal.style.display = 'none';
        carrinhoItems.innerHTML = '<div class="carrinho-vazio">Seu carrinho está vazio</div>';
    } else {
        carrinhoTotal.style.display = 'block';
        
        for (var i = 0; i < carrinho.length; i++) {
            var item = carrinho[i];
            
            var itemElement = document.createElement('div');
            itemElement.className = 'carrinho-item';
            
            var itemInfo = document.createElement('div');
            itemInfo.className = 'item-info';
            itemInfo.innerHTML = '<h4>' + item.icone + ' ' + item.nome + '</h4>' +
                                '<div class="preco">R$ ' + item.preco.toFixed(2) + '</div>';
            
            var itemControles = document.createElement('div');
            itemControles.className = 'item-controles';
            
            var btnDiminuir = document.createElement('button');
            btnDiminuir.className = 'quantidade-btn';
            btnDiminuir.textContent = '-';
            btnDiminuir.itemId = item.id;
            btnDiminuir.onclick = diminuirQuantidade;
            
            var spanQuantidade = document.createElement('span');
            spanQuantidade.className = 'quantidade';
            spanQuantidade.textContent = item.quantidade;
            
            var btnAumentar = document.createElement('button');
            btnAumentar.className = 'quantidade-btn';
            btnAumentar.textContent = '+';
            btnAumentar.itemId = item.id;
            btnAumentar.onclick = aumentarQuantidade;
            
            var btnRemover = document.createElement('button');
            btnRemover.className = 'remover-btn';
            btnRemover.textContent = 'Remover';
            btnRemover.itemId = item.id;
            btnRemover.onclick = removerItem;
            
            itemControles.appendChild(btnDiminuir);
            itemControles.appendChild(spanQuantidade);
            itemControles.appendChild(btnAumentar);
            itemControles.appendChild(btnRemover);
            
            itemElement.appendChild(itemInfo);
            itemElement.appendChild(itemControles);
            carrinhoItems.appendChild(itemElement);
        }
        
        var subtotal = 0;
        for (var i = 0; i < carrinho.length; i++) {
            subtotal = subtotal + (carrinho[i].preco * carrinho[i].quantidade);
        }
        
        var desconto = subtotal * 0.1;
        var totalFinal = subtotal - desconto;
        
        document.getElementById('subtotal').textContent = 'R$ ' + subtotal.toFixed(2);
        document.getElementById('desconto').textContent = 'R$ ' + desconto.toFixed(2);
        document.getElementById('total-final').textContent = 'R$ ' + totalFinal.toFixed(2);
    }
}

function diminuirQuantidade() {
    var idProduto = this.itemId;
    for (var i = 0; i < carrinho.length; i++) {
        if (carrinho[i].id === idProduto) {
            if (carrinho[i].quantidade > 1) {
                carrinho[i].quantidade = carrinho[i].quantidade - 1;
            } else {
                carrinho.splice(i, 1);
            }
            atualizarCarrinho();
            return;
        }
    }
}

function aumentarQuantidade() {
    var idProduto = this.itemId;
    for (var i = 0; i < carrinho.length; i++) {
        if (carrinho[i].id === idProduto) {
            carrinho[i].quantidade = carrinho[i].quantidade + 1;
            atualizarCarrinho();
            return;
        }
    }
}

function removerItem() {
    var idProduto = this.itemId;
    for (var i = 0; i < carrinho.length; i++) {
        if (carrinho[i].id === idProduto) {
            carrinho.splice(i, 1);
            atualizarCarrinho();
            return;
        }
    }
}

function finalizarCompra() {
    if (carrinho.length === 0) {
        showResult("Seu carrinho está vazio!", "error");
        return;
    }
    
    var total = 0;
    for (var i = 0; i < carrinho.length; i++) {
        total = total + (carrinho[i].preco * carrinho[i].quantidade);
    }
    total = total * 0.9;
    
    showResult('✅ Compra finalizada com sucesso! Total: R$ ' + total.toFixed(2), "success");
    
    carrinho = [];
    atualizarCarrinho();
}

function enterAccount() {
    if (!db) {
        showResult("Banco de dados não carregado", "error");
        return;
    }
    
    var name = document.getElementById('username').value.trim();
    var password = document.getElementById('password').value;
    
    clearFieldError('username');
    clearFieldError('password');
    
    if (!name || !password) {
        if (!name) {
            showFieldError('username', 'Por favor, digite seu nome de usuário');
        }
        if (!password) {
            showFieldError('password', 'Por favor, digite sua senha');
        }
        showResult("Por favor, preencha todos os campos", "error");
        return;
    }
    
    var query = "SELECT * FROM usuario WHERE name = '" + name + "' AND password = '" + password + "'";
    var result = db.exec(query);
    
    if (result.length > 0 && result[0].values.length > 0) {
        showResult("✅ Login realizado com sucesso!", "success");
        setTimeout(function() {
            localStorage.setItem('currentUser', name);
            localStorage.setItem('sessionActive', 'true');
            window.location.href = 'https://korkiewicz.github.io/Farmacia/farmacia/index.html';



        }, 1000);
    } else {
        showFieldError('username', 'Usuário ou senha incorretos');
        showFieldError('password', 'Usuário ou senha incorretos');
        showResult("❌ Usuário ou senha incorretos.", "error");
        document.getElementById('username').focus();
    }
}

function passwordIsValid(password) {
    var hasNumber = false;
    var hasMinLength = password.length >= 10;

    
    // Verificar se tem número
    for (var i = 0; i < password.length; i++) {
        var char = password.charAt(i);
        if (char >= '0' && char <= '9') {
            hasNumber = true;
            break;
        }
    }
    
    return hasNumber && hasMinLength;
}

function updatePasswordRequirements() {
    var password = document.getElementById('passwordnovo').value;
    var requirements = document.querySelectorAll('.password-requirements li');
    
    if (requirements.length > 0) {
        // Verificar comprimento
        var hasMinLength = password.length >= 10;
        if (hasMinLength) {
            requirements[0].className = 'requirement-met';
        } else {
            requirements[0].className = 'requirement-not-met';
        }
        
        // Verificar número
        var hasNumber = false;
        for (var i = 0; i < password.length; i++) {
            var char = password.charAt(i);
            if (char >= '0' && char <= '9') {
                hasNumber = true;
                break;
            }
        }
        if (hasNumber) {
            requirements[1].className = 'requirement-met';
        } else {
            requirements[1].className = 'requirement-not-met';
        }
        
        
    }
}

function criarconta() {
    if (!db) {
        showResult("Banco de dados não carregado", "error");
        return;
    }
    
    var name = document.getElementById('usernamenovo').value.trim();
    var password = document.getElementById('passwordnovo').value;
    
    clearFieldError('usernamenovo');
    clearFieldError('passwordnovo');
    
    if (!name || !password) {
        if (!name) {
            showFieldError('usernamenovo', 'Por favor, digite um nome de usuário');
        }
        if (!password) {
            showFieldError('passwordnovo', 'Por favor, digite uma senha');
        }
        showResult("Por favor, preencha todos os campos", "error");
        return;
    }
    
    if (name.length < 3) {
        showFieldError('usernamenovo', 'O nome de usuário deve ter pelo menos 3 caracteres');
        showResult("O nome de usuário deve ter pelo menos 3 caracteres", "error");
        return;
    }
    
    var checkQuery = "SELECT * FROM usuario WHERE name = '" + name + "'";
    var checkResult = db.exec(checkQuery);
    
    if (checkResult.length > 0 && checkResult[0].values.length > 0) {
        showFieldError('usernamenovo', 'Este nome de usuário já está em uso');
        showResult("❌ Nome de usuário já existe. Escolha outro nome.", "error");
        return;
    }
    
    if (!passwordIsValid(password)) {
        showFieldError('passwordnovo', 'A senha não atende a todos os requisitos');
        showResult("❌ A senha não atende a todos os requisitos. Verifique as regras abaixo.", "error");
        return;
    }
    
    var insertQuery = "INSERT INTO usuario (name, password) VALUES ('" + name + "', '" + password + "')";
    db.exec(insertQuery);
    
    showResult("✅ Conta criada com sucesso! Agora você pode fazer login.", "success");
    
    document.getElementById('usernamenovo').value = '';
    document.getElementById('passwordnovo').value = '';
    updatePasswordRequirements();
    
    setTimeout(function() {
        showLoginForm();
    }, 2000);
}

function showFieldError(fieldId, message) {
    var field = document.getElementById(fieldId);
    var errorDiv = document.getElementById(fieldId + '-error');
    
    if (field && errorDiv) {
        field.classList.add('error');
        field.classList.add('shake');
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
        
        setTimeout(function() {
            field.classList.remove('shake');
        }, 500);
    }
}

function clearFieldError(fieldId) {
    var field = document.getElementById(fieldId);
    var errorDiv = document.getElementById(fieldId + '-error');
    
    if (field && errorDiv) {
        field.classList.remove('error');
        errorDiv.classList.remove('show');
    }
}

// Configuração quando a página carregar
window.addEventListener('load', function() {
    console.log("Página carregada - inicializando banco de dados");
    
    initDatabase();
    
    // Configurar eventos do login
    var loginButton = document.getElementById('login-button');
    if (loginButton) {
        loginButton.onclick = function() {
            enterAccount();
        };
    }
    
    var createAccountButton = document.getElementById('criouconta');
    if (createAccountButton) {
        createAccountButton.onclick = function() {
            criarconta();
        };
    }
    
    var createAccountLink = document.getElementById('create-account-link');
    if (createAccountLink) {
        createAccountLink.onclick = function() {
            showCreateAccountForm();
        };
    }
    
    var backToLoginButton = document.getElementById('back-to-login');
    if (backToLoginButton) {
        backToLoginButton.onclick = function() {
            showLoginForm();
        };
    }
    
    var passwordInput = document.getElementById('passwordnovo');
    if (passwordInput) {
        passwordInput.oninput = function() {
            updatePasswordRequirements();
        };
    }
    
    // Configurar eventos da farmácia
    var logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = function() {
            showLoginPage();
        };
    }
    
    var finalizarBtn = document.getElementById('finalizar-btn');
    if (finalizarBtn) {
        finalizarBtn.onclick = function() {
            finalizarCompra();
        };
    }
    
    // Limpar erros quando o usuário começar a digitar
    var usernameInput = document.getElementById('username');
    if (usernameInput) {
        usernameInput.oninput = function() {
            clearFieldError('username');
        };
    }
    
    var passwordLoginInput = document.getElementById('password');
    if (passwordLoginInput) {
        passwordLoginInput.oninput = function() {
            clearFieldError('password');
        };
    }
    
    var usernameNovoInput = document.getElementById('usernamenovo');
    if (usernameNovoInput) {
        usernameNovoInput.oninput = function() {
            clearFieldError('usernamenovo');
        };
    }
    
    var passwordNovoInput = document.getElementById('passwordnovo');
    if (passwordNovoInput) {
        passwordNovoInput.oninput = function() {
            clearFieldError('passwordnovo');
        };
    }
    
    // Eventos de Enter
    if (usernameInput) {
        usernameInput.onkeypress = function(e) {
            if (e.key === 'Enter') {
                enterAccount();
            }
        };
    }
    
    if (passwordLoginInput) {
        passwordLoginInput.onkeypress = function(e) {
            if (e.key === 'Enter') {
                enterAccount();
            }
        };
    }
    
    if (usernameNovoInput) {
        usernameNovoInput.onkeypress = function(e) {
            if (e.key === 'Enter') {
                criarconta();
            }
        };
    }
    
    if (passwordNovoInput) {
        passwordNovoInput.onkeypress = function(e) {
            if (e.key === 'Enter') {
                criarconta();
            }
        };
    }
    
    showLoginForm();
});
