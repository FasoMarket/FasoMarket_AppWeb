import { useState, useEffect } from 'react';
import { DollarSign, Download, Calendar, ArrowRight, CreditCard, TrendingUp } from 'lucide-react';
import { vendorAdvancedService } from '../../services/vendorAdvancedService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function VendorFinances() {
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sumRes, histRes] = await Promise.all([
          vendorAdvancedService.getFinancialSummary(),
          vendorAdvancedService.getPaymentHistory()
        ]);
        setSummary(sumRes.data.summary);
        setHistory(histRes.data.history || []);
      } catch (err) {
        console.error('Erreur Finances:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Gestion Financière</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
          <Download size={18} />
          Exporter le rapport
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">Revenu Brut Total</p>
            <h3 className="text-2xl font-bold text-slate-800">{summary?.grossRevenue?.toLocaleString() || 0} FCFA</h3>
            <p className="text-xs text-slate-400 mt-1">Volume d'affaires total</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">Commission Plateforme</p>
            <h3 className="text-2xl font-bold text-red-500">-{summary?.commission?.toLocaleString() || 0} FCFA</h3>
            <p className="text-xs text-slate-400 mt-1">Frais de service (5%)</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="bg-primary rounded-3xl p-6 shadow-lg shadow-primary/20 flex items-start justify-between text-white">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">Revenu Net (À verser)</p>
            <h3 className="text-2xl font-bold">{summary?.netRevenue?.toLocaleString() || 0} FCFA</h3>
            <p className="text-xs text-white/60 mt-1">Montant après frais</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <CreditCard size={24} />
          </div>
        </div>
      </div>

      {/* History */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Historique des Transactions</h2>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar size={16} />
            Dernières 30 jours
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase">Référence</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase">Client</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase">Date</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase">Montant</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase">Statut</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="text-sm font-mono font-bold text-slate-800">{order.reference_paiement || order._id.slice(-8).toUpperCase()}</span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-slate-700">{order.customer?.name}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm text-slate-500">{format(new Date(order.createdAt), 'dd MMMM yyyy', { locale: fr })}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-slate-800">{order.totalAmount?.toLocaleString()} FCFA</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Complété
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-slate-400 group-hover:text-primary transition-colors">
                      <ArrowRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-8 py-10 text-center text-slate-400 text-sm">
                    Aucun historique de paiement disponible
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
