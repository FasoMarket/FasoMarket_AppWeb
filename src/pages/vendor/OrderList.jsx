import { cn } from '../../utils/cn';
import { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const initialOrders = [
  { id: '#FM-8542', customer: 'Amadou Traoré', date: '24 Mai 2024, 14:30', amount: '15,500 FCFA', status: 'En attente', statusColor: 'bg-orange-100 text-orange-600 border-orange-200' },
  { id: '#FM-8541', customer: 'Kadidia Diallo', date: '24 Mai 2024, 10:15', amount: '42,000 FCFA', status: 'En préparation', statusColor: 'bg-blue-100 text-blue-600 border-blue-200' },
  { id: '#FM-8540', customer: 'Ibrahim Sanou', date: '23 Mai 2024, 16:45', amount: '8,750 FCFA', status: 'Expédiée', statusColor: 'bg-green-100 text-green-600 border-green-200' },
  { id: '#FM-8539', customer: 'Fatoumata Koné', date: '23 Mai 2024, 09:00', amount: '22,300 FCFA', status: 'Annulée', statusColor: 'bg-red-100 text-red-600 border-red-200' },
];

const tabs = ['Toutes (124)', 'Nouvelles (12)', 'En cours (8)', 'Terminées (104)'];

export default function OrderList() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-4 text-sm font-semibold transition-all border-b-2",
                activeTab === tab ? "text-primary border-primary" : "text-gray-500 border-transparent hover:text-gray-700"
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-12">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0" />
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID Commande</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {initialOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0" />
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{order.date}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      order.statusColor
                    )}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      to={`/vendor/orders/${order.id.replace('#', '')}`}
                      className="text-primary font-semibold hover:text-primary/80 px-4 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/5 transition-all text-sm inline-flex items-center gap-1"
                    >
                      Voir <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white text-sm">
          <p className="text-gray-500">Affichage de 1 à 5 sur 124 commandes</p>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed">Précédent</button>
            <button className="px-4 py-1.5 bg-primary text-white rounded-lg font-bold">1</button>
            <button className="px-4 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">2</button>
            <button className="px-4 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">3</button>
            <button className="px-4 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Suivant</button>
          </div>
        </div>
      </div>
    </div>
  );
}
