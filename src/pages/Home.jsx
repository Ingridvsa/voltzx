import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="font-sans">
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <div className="text-2xl font-bold text-yellow-500">
          <span className="text-black">VOLT</span>Z<span className="text-black">X</span>
        </div>
        <nav className="space-x-6 text-sm font-medium text-gray-700">
          <a href="#">Sobre</a>
          <a href="#">Serviços</a>
          <a href="#">Contato</a>
          <a href="#">Como funciona?</a>
          <button
            onClick={() => navigate("/register")}
            className="bg-yellow-400 px-4 py-2 rounded font-semibold text-white hover:bg-yellow-500"
          >
            Comece já!
          </button>
        </nav>
      </header>

      <main className="px-6 py-10 text-center">
        <h1 className="text-3xl font-bold leading-tight mb-4">
          Transformamos terra em energia, conexão em oportunidade e sol em progresso.
        </h1>
        <p className="text-gray-700 max-w-3xl mx-auto mb-10">
          A VoltzX é a conexão inteligente que transforma o potencial do sol em oportunidades reais de negócio. Com tecnologia de ponta e foco em sustentabilidade, fazemos da inovação o combustível para gerar impacto positivo e resultados concretos.
        </p>

        <section className="bg-yellow-100 py-10">
          <h2 className="font-bold text-lg mb-6 text-black">
            Somos a <span className="underline">ponte</span> entre proprietários de terrenos, empresas inovadoras e investidores estratégicos, unindo forças para acelerar a <span className="underline">revolução da energia solar</span> no Brasil.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-orange-400 text-white p-6 rounded">
              <h3 className="font-bold text-lg mb-2">Para Proprietários de Terrenos</h3>
              <p className="text-sm">
                Cadastram terrenos e os disponibilizam no marketplace, recebem propostas de empresas para desenvolvimento de projetos solares, aprovam ou rejeitam essas propostas e acompanham o andamento dos projetos e ofertas de investimento no painel de monitoramento.
              </p>
              <button className="mt-4 bg-yellow-400 text-black px-4 py-2 rounded">Saiba mais</button>
            </div>

            <div className="bg-orange-400 text-white p-6 rounded">
              <h3 className="font-bold text-lg mb-2">Para Empresas de Energia Solar</h3>
              <p className="text-sm">
                Buscam terrenos no marketplace, criam e vinculam projetos solares, enviam propostas aos proprietários e gerenciam as ofertas de investimento feitas por investidores, tudo com relatórios dedicados e transparência para garantir decisões ágeis e transparentes.
              </p>
              <button className="mt-4 bg-yellow-400 text-black px-4 py-2 rounded">Saiba mais</button>
            </div>

            <div className="bg-orange-400 text-white p-6 rounded">
              <h3 className="font-bold text-lg mb-2">Para Investidores</h3>
              <p className="text-sm">
                Visualizam projetos disponíveis para investimento, enviam ofertas financeiras, participam da aprovação conjunta com empresas e proprietários, e monitoram o desempenho dos projetos investidos por meio de um painel dedicado com comunicação centralizada.
              </p>
              <button className="mt-4 bg-yellow-400 text-black px-4 py-2 rounded">Saiba mais</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}