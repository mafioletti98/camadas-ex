var mapa = L.map("mapa").setView([-5.095625370566354, -42.80261634613696], 11); // TERESINA

var estiloArticulacaoFolha = {
  color: "#000080",
  weight: 5,
  fillColor: "transparent",
  // "opacity": 0.65
};

var articulacaoFolhas = L.geoJSON([articulacao], {
  style: estiloArticulacaoFolha,
}).addTo(mapa);

var estiloPonto = {
  radius: 8,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
};

var articulacaoCentroide = L.geoJSON([articulacaoCentroide1], {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, estiloPonto);
  },
  onEachFeature: function (feature, layer) {
    layer.on("click", function (e) {
      var popup = L.popup()
        .setLatLng(e.latlng)
        .setContent("Você clicou no ponto!")
        .openOn(mapa);
    });
  },
}).addTo(mapa);

var camadas = {
  saneamento: L.layerGroup().addTo(mapa),
  seguranca: L.layerGroup().addTo(mapa),
  transporte: L.layerGroup().addTo(mapa),
  vegetacao: L.layerGroup().addTo(mapa),
};

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "Map data © OpenStreetMap contributors",
}).addTo(mapa);

function criarPoligono(camada) {
  let coordenadas;

  switch (camada) {
    case "saneamento":
      coordenadas = [
        [-5.065634573530536, -42.79341495810306],
        [-5.0814959572553695, -42.76940684657558],
        [-5.065366130722947, -42.752022896705185],
      ];
      break;
    case "seguranca":
      coordenadas = [
        [-5.073138098550511, -42.807134739598446],
        [-5.069200898573242, -42.808480939452906],
        [-5.086048017997727, -42.81779659343033],
      ];
      break;
    case "transporte":
      coordenadas = [
        [-5.091779237537374, -42.79643516926362],
        [-5.095316511659258, -42.814191658441224],
        [-5.109958974522348, -42.79833470078417],
      ];
      break;
    case "vegetacao":
      coordenadas = [
        [-5.110908129980748, -42.75416612340153],
        [-5.089323521748492, -42.735829628332766],
        [-5.101894865353572, -42.75964325829221],
      ];
      break;
  }

  const poligono = L.polygon(coordenadas, {
    color:
      camada === "saneamento"
        ? "blue"
        : camada === "seguranca"
        ? "red"
        : camada === "transporte"
        ? "brown"
        : "green",
    fillOpacity: 0.5,
  }).bindPopup(
    `Polígono de ${camada.charAt(0).toUpperCase() + camada.slice(1)}`
  );

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

document.addEventListener("click", function (event) {
  var painel = document.getElementById("painel-camadas");
  if (painel.style.display === "none") {
    painel.style.display = "none";
  }
});

let quadradoSelecionado = null;

function preencherQuadrado(layer) {
  layer.setStyle({
    fillColor: "#ff0000",
    fillOpacity: 0.7,
  });
}

function restaurarEstilo(layer) {
  layer.setStyle({
    fillColor: "transparent",
  });
}

function onEachFeature(feature, layer) {
  layer.bindPopup("Foto: " + feature.properties.FOTO);

  layer.on("click", function (e) {
    if (quadradoSelecionado && quadradoSelecionado !== layer) {
      restaurarEstilo(quadradoSelecionado);
    }

    // Verifica se o quadrado atual foi clicado novamente para remover o preenchimento
    if (quadradoSelecionado === layer) {
      restaurarEstilo(layer);
      quadradoSelecionado = null;
    } else {
      preencherQuadrado(layer);
      quadradoSelecionado = layer;
    }

    layer.openPopup();
    e.originalEvent.stopPropagation();
  });
}

// Evento para remover preenchimento e popup quando clicar fora de qualquer quadrado
mapa.on("click", function () {
  if (quadradoSelecionado) {
    restaurarEstilo(quadradoSelecionado);
    quadradoSelecionado = null; // Reseta a seleção
    mapa.closePopup();
  }
});

var articulacaoFolhas = L.geoJSON([articulacao], {
  style: estiloArticulacaoFolha,
  onEachFeature: onEachFeature, // Associa o evento de clique e popup para cada camada
}).addTo(mapa);
