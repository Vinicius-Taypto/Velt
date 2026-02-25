import { useState } from 'react';
import { TrendingUp, Calculator, DollarSign } from 'lucide-react';

export function SimulationPage() {
  const [principal, setPrincipal] = useState('1000');
  const [rate, setRate] = useState('10');
  const [time, setTime] = useState('12');
  const [result, setResult] = useState<number | null>(null);

  const calculateCompoundInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100 / 12;
    const t = parseFloat(time);

    const amount = p * Math.pow(1 + r, t);
    setResult(amount);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Calculator className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Calculadora de Juros Compostos</h2>
            <p className="text-gray-600">Simule seus investimentos e veja o poder dos juros</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Inicial (R$)
              </label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taxa de Juros Anual (%)
              </label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="10"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período (meses)
              </label>
              <input
                type="number"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="12"
              />
            </div>

            <button
              onClick={calculateCompoundInterest}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Calcular
            </button>
          </div>

          <div className="flex items-center justify-center">
            {result !== null ? (
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border-2 border-green-200 w-full">
                <DollarSign className="mx-auto text-green-600 mb-3" size={48} />
                <p className="text-gray-600 mb-2">Valor Final</p>
                <p className="text-4xl font-bold text-gray-900">
                  R$ {result.toFixed(2)}
                </p>
                <p className="text-green-600 font-medium mt-3">
                  Rendimento: R$ {(result - parseFloat(principal)).toFixed(2)}
                </p>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <TrendingUp size={64} className="mx-auto mb-4 opacity-50" />
                <p>Preencha os dados e clique em calcular</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="font-bold text-lg mb-3 text-gray-900">Tesouro Direto</h3>
          <p className="text-gray-600 mb-4">
            Investimento seguro em títulos públicos do governo. Ideal para iniciantes com rendimentos previsíveis.
          </p>
          <div className="flex items-center text-green-600 font-medium">
            <TrendingUp size={18} className="mr-2" />
            <span>Risco: Baixo</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="font-bold text-lg mb-3 text-gray-900">CDB e LCI/LCA</h3>
          <p className="text-gray-600 mb-4">
            Certificados de depósito bancário com rentabilidade atrativa e proteção do FGC até R$ 250 mil.
          </p>
          <div className="flex items-center text-blue-600 font-medium">
            <TrendingUp size={18} className="mr-2" />
            <span>Risco: Baixo a Médio</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="font-bold text-lg mb-3 text-gray-900">Ações</h3>
          <p className="text-gray-600 mb-4">
            Participação em empresas com potencial de crescimento. Requer conhecimento e análise de mercado.
          </p>
          <div className="flex items-center text-orange-600 font-medium">
            <TrendingUp size={18} className="mr-2" />
            <span>Risco: Alto</span>
          </div>
        </div>
      </div>
    </div>
  );
}
