var mapa = L.map('mapa').setView([-3.71722, -38.54337], 12); 

var camadas = {
    saneamento: L.layerGroup().addTo(mapa), 
    seguranca: L.layerGroup().addTo(mapa), 
    transporte: L.layerGroup().addTo(mapa),
    vegetacao: L.layerGroup().addTo(mapa) 
};

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data © OpenStreetMap contributors'
}).addTo(mapa);

function criarPoligono(camada) {
    let coordenadas;
    
    switch (camada) {
        case 'saneamento':
            coordenadas = [[-3.71722, -38.54337], [-3.71222, -38.54037], [-3.71522, -38.55037]];
            break;
        case 'seguranca':
            coordenadas = [[-3.72522, -38.54337], [-3.72522, -38.55037], [-3.72022, -38.54837]];
            break;
        case 'transporte':
            coordenadas = [[-3.73022, -38.55337], [-3.73322, -38.55037], [-3.73122, -38.54537]];
            break;
        case 'vegetacao':
            coordenadas = [[-3.72022, -38.54037], [-3.72222, -38.54337], [-3.71822, -38.54537]];
            break;
    }

    const poligono = L.polygon(coordenadas, {
        color: camada === 'saneamento' ? 'blue' : camada === 'seguranca' ? 'red' : camada === 'transporte' ? 'green' : 'yellow',
        fillOpacity: 0.5
    }).bindPopup(`Polígono de ${camada.charAt(0).toUpperCase() + camada.slice(1)}`);

    return poligono;
}

function alternarPainelCamadas(event) {
    event.stopPropagation(); 

    var painel = document.getElementById("painel-camadas");

    if (painel.style.display === "block") {
        painel.style.display = "none";
        painel.style.opacity = "0";
    } else {
        painel.style.display = "block";
        painel.style.opacity = "1";

        const rect = event.target.getBoundingClientRect();
        const painelWidth = painel.offsetWidth;
        const painelHeight = painel.offsetHeight;

        let left = rect.left; 
        let top = rect.bottom + 10; 

        if (left + painelWidth > window.innerWidth) {
            left = window.innerWidth - painelWidth - 20; 
        }

        if (top + painelHeight > window.innerHeight) {
            top = window.innerHeight - painelHeight - 20; 
        }

        painel.style.left = `${left}px`;
        painel.style.top = `${top}px`;
    }
}

function mudarCamada(nomeCamada) {
    const camadaLayer = camadas[nomeCamada];

    if (camadaLayer.getLayers().length === 0) {
        camadaLayer.addLayer(criarPoligono(nomeCamada)).addTo(mapa);
    } else {
        camadaLayer.clearLayers(); 
    }
}

document.addEventListener('click', function(event) {
    var painel = document.getElementById("painel-camadas");
    if (painel.style.display === "none") {
        painel.style.display = "none";
    }
});
