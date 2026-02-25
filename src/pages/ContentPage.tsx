import { BookOpen, Video, ExternalLink } from 'lucide-react';

export function ContentPage() {
  const videos = [
    {
      title: 'Introdução à Educação Financeira',
      description: 'Aprenda os conceitos básicos de educação financeira e como começar a organizar suas finanças.',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: 'https://images.pexels.com/photos/6289065/pexels-photo-6289065.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      title: 'Como Fazer um Orçamento Pessoal',
      description: 'Passo a passo para criar e manter um orçamento eficiente que funciona para você.',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: 'https://images.pexels.com/photos/4475523/pexels-photo-4475523.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      title: 'Investimentos para Iniciantes',
      description: 'Descubra os principais tipos de investimentos e como começar a investir com segurança.',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: 'https://images.pexels.com/photos/7821683/pexels-photo-7821683.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const articles = [
    {
      title: 'O Poder dos Juros Compostos',
      description: 'Entenda como os juros compostos podem multiplicar seu patrimônio ao longo do tempo e por que Einstein os chamava de "a oitava maravilha do mundo".',
      readTime: '8 min',
    },
    {
      title: 'Diversificação de Investimentos',
      description: 'Aprenda a importância de diversificar sua carteira de investimentos e como balancear risco e retorno de forma inteligente.',
      readTime: '10 min',
    },
    {
      title: 'Como Sair das Dívidas',
      description: 'Estratégias práticas para eliminar dívidas, negociar com credores e recuperar sua saúde financeira.',
      readTime: '12 min',
    },
    {
      title: 'Planejamento para Aposentadoria',
      description: 'Comece cedo e garanta um futuro tranquilo. Conheça as melhores estratégias para construir uma aposentadoria confortável.',
      readTime: '15 min',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <BookOpen className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Conteúdo Educacional</h2>
            <p className="text-gray-600">Aprenda sobre investimentos através de vídeos e artigos</p>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center space-x-2 mb-4">
          <Video className="text-blue-600" size={20} />
          <h3 className="text-xl font-bold text-gray-900">Vídeos Educativos</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <a
              key={index}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className="relative h-48 bg-gray-200">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    <Video className="text-blue-600" size={32} />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-gray-900 mb-2">{video.title}</h4>
                <p className="text-sm text-gray-600">{video.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center space-x-2 mb-4">
          <BookOpen className="text-blue-600" size={20} />
          <h3 className="text-xl font-bold text-gray-900">Artigos Recomendados</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {articles.map((article, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-gray-900 text-lg">{article.title}</h4>
                <ExternalLink className="text-gray-400" size={18} />
              </div>
              <p className="text-gray-600 mb-4">{article.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{article.readTime} de leitura</span>
                <span className="text-blue-600 font-medium text-sm hover:text-blue-700">
                  Ler artigo →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
