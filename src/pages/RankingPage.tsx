import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface RankingEntry {
  id: string;
  user_id: string;
  total_score: number;
  quiz_attempts: number;
  last_quiz_at: string | null;
  full_name: string;
}

export function RankingPage() {
  const { user } = useAuth();
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    loadRankings();
  }, [user]);

  const loadRankings = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('user_scores')
      .select(`
        id,
        user_id,
        total_score,
        quiz_attempts,
        last_quiz_at,
        user_profiles (full_name)
      `)
      .order('total_score', { ascending: false });

    if (error) {
      console.error('Error loading rankings:', error);
      setLoading(false);
      return;
    }

    const formattedData = (data || []).map((item: any) => ({
      id: item.id,
      user_id: item.user_id,
      total_score: item.total_score,
      quiz_attempts: item.quiz_attempts,
      last_quiz_at: item.last_quiz_at,
      full_name: item.user_profiles?.full_name || 'Usuário',
    }));

    setRankings(formattedData);

    if (user) {
      const userIndex = formattedData.findIndex((r) => r.user_id === user.id);
      setUserRank(userIndex !== -1 ? userIndex + 1 : null);
    }

    setLoading(false);
  };

  const getRankIcon = (position: number) => {
    if (position === 1) return <Trophy className="text-yellow-500" size={24} />;
    if (position === 2) return <Medal className="text-gray-400" size={24} />;
    if (position === 3) return <Medal className="text-orange-400" size={24} />;
    return <Award className="text-gray-300" size={20} />;
  };

  const getRankBadge = (position: number) => {
    if (position === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (position === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (position === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
    return 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Carregando ranking...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-yellow-100 rounded-lg">
            <Trophy className="text-yellow-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Ranking de Desempenho</h2>
            <p className="text-gray-600">Veja sua posição e compare com outros usuários</p>
          </div>
        </div>

        {userRank && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Sua Posição</p>
                <p className="text-3xl font-bold text-gray-900">#{userRank}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Sua Pontuação</p>
                <p className="text-2xl font-bold text-blue-600">
                  {rankings[userRank - 1]?.total_score || 0} pts
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {rankings.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-600">Nenhum usuário no ranking ainda.</p>
            <p className="text-gray-500 text-sm mt-2">Seja o primeiro a fazer o quiz!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {rankings.map((entry, index) => {
              const position = index + 1;
              const isCurrentUser = user?.id === entry.user_id;

              return (
                <div
                  key={entry.id}
                  className={`p-4 flex items-center justify-between transition-colors ${
                    isCurrentUser ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${getRankBadge(
                        position
                      )}`}
                    >
                      {position <= 3 ? getRankIcon(position) : `#${position}`}
                    </div>

                    <div className="flex-1">
                      <p className={`font-bold ${isCurrentUser ? 'text-blue-600' : 'text-gray-900'}`}>
                        {entry.full_name}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                            Você
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        {entry.quiz_attempts} {entry.quiz_attempts === 1 ? 'tentativa' : 'tentativas'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{entry.total_score}</p>
                    <p className="text-xs text-gray-500">pontos</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-sm p-6 text-white">
        <h3 className="text-xl font-bold mb-3">Como Subir no Ranking</h3>
        <ul className="space-y-2 text-blue-50">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Complete o quiz para ganhar pontos</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Estude o conteúdo educacional antes de fazer o quiz</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Você pode fazer o quiz múltiplas vezes para aumentar sua pontuação</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Cada resposta correta vale 1 ponto</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
