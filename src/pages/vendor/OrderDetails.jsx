import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer, 
  MessageCircle, 
  CheckCircle2, 
  MapPin, 
  Truck,
  CreditCard
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

const items = [
  { name: 'Panier de Légumes Frais (Bio)', category: 'Alimentation', qty: 2, price: '3 750 FCFA', total: '7 500 FCFA', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgHSK-0l6d4rlbVzGi5zxoHLoo5p_IzKPssgzNB9RTNVEdeMMQ4F3-CzepjqogDs64PSmsUUtHlGde_BxLHLPz-D-QB0zOjgLEmXEn03rNF3EBZMYb6Iwe1W9vk1fDT0LKvhZ3Ogx2HefATnHbvbnHdEo1-5A7jkbZPpR3z6bvRVqU0iX06cs8r26CpiBpm4bOoSg3ueO_ci_MBABdPvcph7qkv2Ajmm1V-oSQ7pDZ6ZSq33mQpgbg4jzOfl5KNk_6W0FsP9PVilCm' },
  { name: 'Miel du Nahouri (500g)', category: 'Epicerie', qty: 1, price: '4 000 FCFA', total: '4 000 FCFA', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQGUpXfpabouQPQbIRmmEC4mV4rmC0ak4hVNPGPP8KzwMZyq0WClrbo3MVPsQ-NuNblJ20vrQab7328lrsM_jWU3yPIjka2rzX9jeR0ME3v-k6y0UKXt8V7_JuRZjnEuTzvxehii5XqDh9vjrq_2vcUb9RV7XLac8jcc4M7hSG4LLVdqAFYv8iH7SgxfuiPZHLnoNe3D3A9RuGo0bF3T6FQKc-jW6yH8qhG3ONoqmfdiipfhYS67cQLjdLQX5VPa1wnBbYimzFXEFG' },
];

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft size={16} />
            Retour aux commandes
          </button>
          <h1 className="text-2xl font-bold">Commande #{id}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Printer size={18} />
            Imprimer Facture
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-2">
            <MessageCircle size={18} />
            Contacter Client
          </button>
        </div>
      </div>

      {/* Action Bar & Status */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-full">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Statut de la commande</p>
            <p className="font-bold text-lg">En cours de préparation</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold text-slate-700">Changer le statut :</label>
          <select className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent block p-2.5 min-w-[200px] outline-none">
            <option value="pending">En attente</option>
            <option selected value="preparing">En préparation</option>
            <option value="shipped">Expédiée</option>
            <option value="delivered">Livrée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold">Articles commandés</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.name} className="p-6 flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-slate-200" />
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                    <p className="text-sm text-slate-500">Catégorie: {item.category}</p>
                    <p className="text-sm font-semibold mt-1 text-primary">Qté: {item.qty}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{item.total}</p>
                    <p className="text-xs text-slate-400">{item.price} / unité</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-primary" />
              Mode de paiement
            </h3>
            <div className="flex items-center gap-4 p-4 border border-primary/10 bg-primary/5 rounded-2xl">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-black italic text-sm">
                OM
              </div>
              <div>
                <p className="font-bold text-slate-900">Orange Money Burkina</p>
                <p className="text-xs text-slate-500 tracking-wider">Transaction ID: OM-98234-BF-X</p>
              </div>
              <div className="ml-auto">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-green-200">
                  Payé
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Side Info Column */}
        <div className="space-y-6">
          {/* Customer Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <span className="p-1 bg-primary/10 rounded text-primary"><MapPin size={18} /></span>
              Informations Client
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Nom complet</p>
                <p className="font-bold text-slate-900 text-lg">Moussa Traoré</p>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Téléphone</p>
                <p className="font-bold text-slate-900">+226 70 00 00 00</p>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Adresse de livraison</p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="font-bold text-slate-800">Quartier Ouaga 2000</p>
                  <p className="text-sm text-slate-500">Rue de l'Ambassade, Villa 452</p>
                  <p className="text-sm text-slate-500">Ouagadougou, Burkina Faso</p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-primary text-sm font-bold hover:underline">
                <MapPin size={16} />
                Voir sur la carte
              </button>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:sticky lg:top-24">
            <h3 className="font-bold mb-4">Résumé financier</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Sous-total (3 articles)</span>
                <span className="font-bold">11 500 FCFA</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Livraison</span>
                <span className="font-bold">1 500 FCFA</span>
              </div>
              <div className="flex justify-between text-sm text-red-500">
                <span>Commission FasoMarket (5%)</span>
                <span className="font-bold">- 575 FCFA</span>
              </div>
              <div className="pt-4 border-t border-dashed border-slate-200 flex justify-between items-center">
                <span className="font-black text-slate-900 text-lg">Total Vendeur</span>
                <span className="font-black text-primary text-2xl">12 425 FCFA</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-slate-900 rounded-2xl text-[11px] text-slate-400 leading-relaxed border-l-4 border-primary">
              <p>Note: Les gains seront crédités sur votre portefeuille dès que le statut sera marqué "Livré".</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
