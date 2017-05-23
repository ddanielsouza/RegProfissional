req = null;

window.onload = function(){
    document.getElementById("addonSearch").onclick = consultaRegistro;
    document.getElementById("btnSearch").onclick = consultaRegistro;
    
    document.getElementById("search").onkeydown = function(event){  //Verifica se tecla pressionada foi o "Enter" 
        if(event.keyCode == 13){                                    //(Enter ==  13)
            consultaRegistro();
        }
    }
    
    document.getElementById("btnClose").onclick = function() {window.location.reload()}; //Recarrega Aplicação
    document.getElementById("btnNovaConsulta").onclick = function() {window.location.reload()};
}

// Consulta Ajax 
function consultaRegistro() {
    var txtSearch = new String(document.getElementById("search").value);
    var uf = document.getElementById("uf");
    var txtUf = new String(uf.options[uf.selectedIndex].value);
    var tipo = document.getElementById("tipo");
    var txtTipo = new String(tipo.options[tipo.selectedIndex].value)
	var url = encodeURI("http://www.consultacrm.com.br/api/index.php?destino=json&chave=lulucrate455566"
            + "&tipo=" + txtTipo + "&uf=" + txtUf + "&q=" + txtSearch);   
    
	if (window.XMLHttpRequest) {
	    req = new XMLHttpRequest();     
	}
	else if (window.ActiveXObject) {
	         req = new ActiveXObject("Microsoft.XMLHTTP");    // Internet Explorer >= versão 5
	     }
    req.onreadystatechange = callback;
	req.open("GET", url, true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	req.send(null);
}

function callback() {
    if (req.readyState == 1) {
        mostraImgCarregando();    
	}
    if (req.readyState == 4) {
	    if (req.status == 200){
            mostraResultado(JSON.parse(req.responseText));
        }
        else{
		    console.log("Erro: " + req.status + " Descrição: " + req.statusText);
            alert("Sistema indisponivel no momento\n"
                 +"Tente novamente mais tarde")
        }
        delete document.getElementById("carregando").remove();
	}
}


function mostraResultado(result){
    var table = document.getElementById("tbRegistro");
    
    //Servidor Retorna no JSON o numero total encontrado
    if(result.total == 0){
        var p = document.createElement("P");
        p.style = "text-align: center";
        p.appendChild(document.createTextNode("A Busca Não Encontrou Nenhum Profisional"));
        p.appendChild(document.createElement("BR"));
        p.appendChild(document.createTextNode("Verifique o Nome ou Número de Registro Inserido"));
        
        table.appendChild(p);
    }
    
    for(var i = 0; i < result.total; i++){
        //Cria Elementos HTML
        var cod = document.createElement("LABEL");
        var nome = document.createElement("LABEL");
        var tipo = document.createElement("LABEL");
        var uf = document.createElement("LABEL");
        var situacao = document.createElement("LABEL");
        var profissao = document.createElement("LABEL");
        var tr = document.createElement("TR");
        var div = document.createElement("DIV");
        
        //Insere os dados do registros nos elementos
        cod.appendChild(document.createTextNode(result.item[i].numero));
        nome.appendChild(document.createTextNode(result.item[i].nome));
        tipo.appendChild(document.createTextNode(result.item[i].tipo));
        uf.appendChild(document.createTextNode(result.item[i].uf));
        profissao.appendChild(document.createTextNode(result.item[i].profissao))
        situacao.appendChild(document.createTextNode(result.item[i].situacao));
        
        //Criando arvore de elementos
        div.appendChild(cod);
        div.appendChild(document.createTextNode(" - "));
        div.appendChild(nome);
        div.appendChild(document.createElement("BR"));
        div.appendChild(tipo);
        div.appendChild(document.createTextNode(" - "));
        div.appendChild(uf);
        div.appendChild(document.createElement("BR"));
        div.appendChild(profissao)
        div.appendChild(document.createTextNode(" - "));
        div.appendChild(situacao);
        
        tr.appendChild(div);
        
        table.appendChild(tr);
    }
    $("#modalResult").modal("show");
}


function mostraImgCarregando(){
    if(!document.getElementById("carregando")){
        var imgCarregando = document.createElement("IMG");
        imgCarregando.src = "img/carregando.gif"
        imgCarregando.setAttribute("class", "carregando");
        imgCarregando.setAttribute("id", "carregando");
        document.body.appendChild(imgCarregando);
    }
}