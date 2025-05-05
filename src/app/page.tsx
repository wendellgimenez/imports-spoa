"use client";

import { useState, useCallback } from 'react';
import { MapPin, Instagram, Phone, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface Produto {
  id: number;
  nome: string;
  categoria: string;
  descricao: string;
  imagem: string;
  preco: number;
  detalhes?: string[];
  fotos?: string[];
}

const produtos: Produto[] = [
  {
    id: 1,
    nome: 'iPhone 11 Pro Max - 64GB',
    categoria: 'novos',
    descricao: 'iPhone 11 Pro Max novo, lacrado.',
    imagem: '/iphone11-pro-max-64gb.png',
    preco: 4999.90,
    detalhes: [
      'Tela Super Retina XDR de 6,5 polegadas',
      'Chip A13 Bionic',
      'Câmera tripla de 12MP',
      'Bateria de longa duração',
      'Garantia de 1 ano'
    ],
    fotos: [
      '/iphone11-pro-max-64gb.png',
      '/iphone11-pro-max-64gb-2.png',
      '/iphone11-pro-max-64gb-3.png'
    ]
  },
  {
    id: 2,
    nome: 'iPhone 13 - 128GB (Usado)',
    categoria: 'usados',
    descricao: 'Em ótimo estado, 90% de bateria.',
    imagem: '/iphone13-128gb.png',
    preco: 2890.00
  },
  {
    id: 3,
    nome: 'iPhone 15 Pro Max - 256GB',
    categoria: 'novos',
    descricao: 'iPhone 15 Pro Max novo, lacrado.',
    imagem: '/iphone15-pro-max-256gb.png',
    preco: 5990.00
  },
  {
    id: 4,
    nome: 'iPhone 12 - 64GB (Usado)',
    categoria: 'usados',
    descricao: 'Em ótimo estado, 90% de bateria.',
    imagem: '/iphone12-64gb.png',
    preco: 2590.00
  },
  {
    id: 5,
    nome: 'Kit Apple',
    categoria: 'acessorios',
    descricao: 'Kit Apple com AirPods Pro, AirPods Max e Apple Watch.',
    imagem: '/kit-apple.png',
    preco: 1890.00
  },
];

export default function Home() {
  const [categoria, setCategoria] = useState('todos');
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [fotoAtual, setFotoAtual] = useState(0);
  const [fotosCards, setFotosCards] = useState<{ [key: number]: number }>({});
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextPhoto();
    }
    if (isRightSwipe) {
      previousPhoto();
    }
  };

  const nextPhoto = useCallback(() => {
    if (produtoSelecionado?.fotos && produtoSelecionado.fotos.length > 0) {
      setFotoAtual((current) => 
        current === produtoSelecionado.fotos!.length - 1 ? 0 : current + 1
      );
    }
  }, [produtoSelecionado]);

  const previousPhoto = useCallback(() => {
    if (produtoSelecionado?.fotos && produtoSelecionado.fotos.length > 0) {
      setFotoAtual((current) => 
        current === 0 ? produtoSelecionado.fotos!.length - 1 : current - 1
      );
    }
  }, [produtoSelecionado]);

  const nextPhotoCard = useCallback((produtoId: number) => {
    const produto = produtos.find(p => p.id === produtoId);
    if (produto?.fotos && produto.fotos.length > 0) {
      setFotosCards(prev => ({
        ...prev,
        [produtoId]: (prev[produtoId] || 0) === produto.fotos!.length - 1 ? 0 : (prev[produtoId] || 0) + 1
      }));
    }
  }, []);

  const previousPhotoCard = useCallback((produtoId: number) => {
    const produto = produtos.find(p => p.id === produtoId);
    if (produto?.fotos && produto.fotos.length > 0) {
      setFotosCards(prev => ({
        ...prev,
        [produtoId]: (prev[produtoId] || 0) === 0 ? produto.fotos!.length - 1 : (prev[produtoId] || 0) - 1
      }));
    }
  }, []);

  const produtosFiltrados = categoria === 'todos'
    ? produtos
    : produtos.filter(p => p.categoria === categoria);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white relative">
      <header className="p-4 border-b border-white/10 bg-black/30 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Imports.Spoa
            </h1>
            <nav className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
              <button 
                onClick={() => setCategoria('todos')}
                className={`px-3 py-2 text-sm sm:text-base rounded-lg transition-all duration-300 ${
                  categoria === 'todos' 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/50' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                Todos
              </button>
              <button 
                onClick={() => setCategoria('novos')}
                className={`px-3 py-2 text-sm sm:text-base rounded-lg transition-all duration-300 ${
                  categoria === 'novos' 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/50' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                iPhones Novos
              </button>
              <button 
                onClick={() => setCategoria('usados')}
                className={`px-3 py-2 text-sm sm:text-base rounded-lg transition-all duration-300 ${
                  categoria === 'usados' 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/50' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                iPhones Usados
              </button>
              <button 
                onClick={() => setCategoria('acessorios')}
                className={`px-3 py-2 text-sm sm:text-base rounded-lg transition-all duration-300 ${
                  categoria === 'acessorios' 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/50' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                Acessórios
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative z-0">
        {produtosFiltrados.map(prod => (
          <div 
            key={prod.id} 
            className="border border-white/10 rounded-2xl p-4 bg-black/40 backdrop-blur-md hover:bg-black/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 group cursor-pointer"
            onClick={() => {
              setProdutoSelecionado(prod);
              setFotoAtual(0);
            }}
          >
            <div className="relative w-full h-64 mb-4 bg-black/30 rounded-xl flex items-center justify-center overflow-hidden group/image">
              <Image
                src={prod.fotos?.[fotosCards[prod.id] || 0] || prod.imagem}
                alt={prod.nome}
                fill
                className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Setas de Navegação no Card */}
              {prod.fotos && prod.fotos.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      previousPhotoCard(prod.id);
                    }}
                    className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-black/70 z-10"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextPhotoCard(prod.id);
                    }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-black/70 z-10"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">{prod.nome}</h2>
            <p className="text-sm text-gray-300 mb-3">{prod.descricao}</p>
            <p className="text-2xl font-bold text-green-400 mb-4">
              R$ {prod.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <button
              className="w-full bg-green-500 text-white px-4 py-3 rounded-xl inline-block text-center hover:bg-green-600 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://wa.me/5551995619576?text=Olá, tenho interesse no produto: ${encodeURIComponent(prod.nome)}`, '_blank');
              }}
            >
              Comprar no WhatsApp
            </button>
          </div>
        ))}
      </main>

      {/* Modal de Detalhes do Produto */}
      {produtoSelecionado && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">{produtoSelecionado.nome}</h2>
                <button
                  onClick={() => setProdutoSelecionado(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Fechar modal"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Galeria de Fotos */}
              <div 
                className="relative w-full h-[400px] mb-6 bg-black/30 rounded-xl overflow-hidden group"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <Image
                  src={produtoSelecionado.fotos?.[fotoAtual] || produtoSelecionado.imagem}
                  alt={produtoSelecionado.nome}
                  fill
                  className="object-contain p-4"
                />
                
                {/* Setas de Navegação */}
                {produtoSelecionado.fotos && produtoSelecionado.fotos.length > 1 && (
                  <>
                    <button
                      onClick={previousPhoto}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                      aria-label="Foto anterior"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                      aria-label="Próxima foto"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                {/* Indicadores de Navegação */}
                {produtoSelecionado.fotos && produtoSelecionado.fotos.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {produtoSelecionado.fotos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setFotoAtual(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === fotoAtual ? 'bg-green-500 scale-125' : 'bg-white/50'
                        }`}
                        aria-label={`Ver foto ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Detalhes do Produto */}
              <div className="space-y-4">
                <p className="text-gray-300">{produtoSelecionado.descricao}</p>
                <div className="bg-black/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Especificações:</h3>
                  <ul className="space-y-2">
                    {produtoSelecionado.detalhes?.map((detalhe, index) => (
                      <li key={index} className="text-gray-300 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        {detalhe}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-3xl font-bold text-green-400">
                  R$ {produtoSelecionado.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <a
                  href={`https://wa.me/5551995619576?text=Olá, tenho interesse no produto: ${encodeURIComponent(produtoSelecionado.nome)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-500 text-white px-6 py-4 rounded-xl inline-block text-center text-lg font-semibold hover:bg-green-600 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50"
                >
                  Comprar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="p-6 border-t border-white/10 mt-8 text-center text-sm space-y-3 bg-black/30 backdrop-blur-md">
        <div className="flex justify-center items-center gap-2">
          <Instagram size={18} className="text-green-400" />
          <a 
            href="https://www.instagram.com/imports.spoa/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-300 hover:text-green-400 transition-colors"
          >
            @imports.spoa
          </a>
        </div>
        <div className="flex justify-center items-center gap-2 text-gray-300">
          <MapPin size={18} className="text-green-400" />
          <span>Av. Icaraí, 1717 - Cristal, Porto Alegre - RS, 90810-000</span>
        </div>
        
        {/* Mapa do Google */}
        <div className="mt-6 w-full max-w-3xl mx-auto">
          <div className="relative w-full h-[300px] rounded-xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.002935240868!2d-51.24719178902744!3d-30.09410227479389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9519820d0809e52f%3A0x46253e2e64c5d46f!2sAv.%20Icara%C3%AD%2C%201717%20-%20Cristal%2C%20Porto%20Alegre%20-%20RS%2C%2090810-000!5e0!3m2!1spt-BR!2sbr!4v1746478162812!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              className="rounded-xl border-0"
              title="Localização da Imports.Spoa no Google Maps"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Créditos do Desenvolvedor */}
        <div className="mt-6 pt-4 border-t border-white/5">
          <p className="text-xs text-gray-500">
            Desenvolvido por{' '}
            <a 
              href="https://www.instagram.com/wendell_gimenez/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-green-400 transition-colors"
            >
              Wendell Gimenez
            </a>
          </p>
        </div>
      </footer>

      <a
        href="https://wa.me/5551995619576"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-xl hover:bg-green-600 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/50 z-20 group"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contato WhatsApp"
      >
        <Phone size={24} className="group-hover:scale-110 transition-transform duration-300" />
      </a>
    </div>
  );
}
