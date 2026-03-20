import { useState } from 'react';
import { 
  AlertTriangle, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  Flag,
  User,
  Store,
  Calendar,
  X
} from 'lucide-react';
import { cn } from '../../utils/cn';
import ConfirmModal from '../../components/ConfirmModal';

const initialReports = [
  { id: 1, name: 'Baskets de Course', shop: 'Boutique Faso', reporter: 'Moussa K.', reason: 'Contrefaçon', date: '24 Mai 2024', status: 'En attente', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOeoDHCT4yarBqXnn_qtX2RMk-Tmf7k66WCb1og8HwRkfb9e7LLGeB0PDbr1PAzM8cyJfiA_X_extzhIIqAjUAIq1A4rRTrjLxlvQpm2OUPTH2IuFqMIZJW62lUUK3PW4D745o6w-8eaWTyqZGnnT3UxHLYRWk3lAWrRzR46bKQW4AZFuOb9NChC7aLdGeteBwCPvzz6bqhOuNdtRS8wvkmaMrNNugG3aQ8uhPScLnrRfFcjsWyL-9dD62QuEA9AcygqCXkpWpOLNi', details: "Ce produit ressemble à une copie bas de gamme d'une grande marque. Les finitions sont très mauvaises..." },
  { id: 2, name: 'Montre Classique', shop: 'Savon Bio BF', reporter: 'Fatou O.', reason: 'Produit non conforme', date: '23 Mai 2024', status: 'Rejeté', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_msJuOWwSlWhTAvb0hlPwQLGiV7EPgaauWIvk9DGkjt16t3ZZDO62M4q8LmbViqoQAvOyUGox19wihUQ5mvjEhaoyTbw37tVJNZmCe4O9w14-zlNPJAEsplojUuW7--_SD60B1RTAzaZh29EPfGqGorKDXEyleD_VZ5CFVceLDBI1xWY5s1FVpEI2Kb3Y6wJJlHA-eON7iqs1cVPRebR8L6h3P7-MOUkNO--Pkb3yPKY5iIEt7jhqNBKbO4gyGFwMm4BKEybCY7GS', details: "J'ai reçu ce produit mais il ne correspond pas du tout à la photo sur la boutique. Très déçu de mon achat." },
];

export default function ReportedProducts() {
  const [reports, setReports] = useState(initialReports);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportToDelete, setReportToDelete] = useState(null);

  const handleIgnore = (id) => {
    setReports(reports.map(report => 
      report.id === id ? { ...report, status: 'Ignoré' } : report
    ));
  };

  const handleDelete = (id) => {
    setReportToDelete(id);
  };

  const confirmDelete = () => {
    if (reportToDelete) {
      setReports(reports.filter(report => report.id !== reportToDelete));
      setReportToDelete(null);
    }
  };

  const activeReportsCount = reports.filter(r => r.status === 'En attente').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Produits Signalés</h1>
          <p className="text-gray-500">Examinez les signalements effectués par les utilisateurs.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl border border-red-100 font-bold text-xs uppercase tracking-widest">
           <Flag size={16} /> {activeReportsCount} Nouveaux
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reports.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-all group">
             <div className="md:w-64 h-48 md:h-auto shrink-0 relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4">
                   <span className={cn(
                     "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md",
                     item.status === 'En attente' ? "bg-orange-500/90" : 
                     item.status === 'Ignoré' ? "bg-gray-500/90" : "bg-red-500/90"
                   )}>
                     {item.status}
                   </span>
                </div>
             </div>
             
             <div className="flex-1 p-8 flex flex-col justify-between">
                <div>
                   <div className="flex justify-between items-start mb-4">
                      <div>
                         <h3 className="text-xl font-black text-gray-900 group-hover:text-primary transition-colors">{item.name}</h3>
                         <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                               <Store size={14} className="text-primary" /> {item.shop}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                               <Calendar size={14} /> {item.date}
                            </div>
                         </div>
                      </div>
                      <div className="px-4 py-2 bg-red-50 text-red-600 rounded-xl border border-red-100 text-xs font-black uppercase tracking-widest">
                         {item.reason}
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 mt-6">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                         {item.reporter[0]}
                      </div>
                      <div className="text-sm">
                         <span className="font-bold text-gray-900">{item.reporter}</span>
                         <p className="text-xs text-gray-500 line-clamp-1">Signalement: "{item.details}"</p>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-50">
                   <button 
                     onClick={() => setSelectedReport(item)}
                     className="px-6 py-2.5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 active:scale-95 shadow-lg"
                   >
                      <Eye size={16} /> Voir détails
                   </button>
                   {item.status === 'En attente' && (
                     <button 
                        onClick={() => handleIgnore(item.id)}
                        className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2 active:scale-95"
                     >
                        <CheckCircle2 size={16} className="text-primary" /> Ignorer
                     </button>
                   )}
                   <div className="flex-1"></div>
                   <button 
                     onClick={() => handleDelete(item.id)}
                     className="p-2.5 text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100 active:scale-95" 
                     title="Supprimer le signalement"
                   >
                      <Trash2 size={20} />
                   </button>
                </div>
             </div>
          </div>
        ))}

        {reports.length === 0 && (
          <div className="p-16 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
              <CheckCircle2 size={24} className="text-green-500" />
            </div>
            <h3 className="text-gray-900 font-black">Aucun signalement</h3>
            <p className="text-gray-500 text-sm font-medium mt-1">Tout semble en ordre ! Aucun produit n'a été signalé récemment.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-800 flex justify-between items-center relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                 <AlertTriangle size={80} className="text-red-500 rotate-12" />
               </div>
               <div className="relative z-10 flex items-center gap-4">
                  <div className="p-3 bg-red-500/20 text-red-400 rounded-2xl shadow-lg backdrop-blur-sm border border-red-500/20">
                    <Flag size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white leading-tight">Détails du Signalement</h3>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">#{selectedReport.id}</p>
                  </div>
               </div>
               <button 
                  onClick={() => setSelectedReport(null)}
                  className="relative z-10 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
               >
                  <X size={24} />
               </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex gap-4 items-start">
                  <img src={selectedReport.image} alt="Produit" className="w-20 h-20 rounded-2xl object-cover border border-gray-100 shadow-sm" />
                  <div>
                    <h4 className="font-black text-gray-900 text-lg">{selectedReport.name}</h4>
                    <p className="text-sm font-bold text-primary mt-1">{selectedReport.shop}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">
                      {selectedReport.reason}
                    </span>
                  </div>
              </div>

              <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                 <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Message de l'utilisateur</h5>
                 <p className="text-sm text-gray-700 font-medium leading-relaxed italic">
                   "{selectedReport.details}"
                 </p>
                 <div className="mt-4 flex flex-col gap-1 border-t border-gray-200 pt-3 text-xs text-gray-500">
                   <div className="flex items-center gap-2"><User size={12}/> Signalé par: <b>{selectedReport.reporter}</b></div>
                   <div className="flex items-center gap-2"><Calendar size={12}/> Date: <b>{selectedReport.date}</b></div>
                 </div>
              </div>

              <div className="flex gap-4 pt-4 mt-4 border-t border-gray-100">
                 <button 
                  onClick={() => setSelectedReport(null)}
                  className="w-full py-3.5 border border-gray-200 text-gray-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-all active:scale-95"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!reportToDelete}
        onClose={() => setReportToDelete(null)}
        onConfirm={confirmDelete}
        title="Supprimer le signalement"
        message="Êtes-vous sûr de vouloir supprimer ce signalement ?"
        confirmLabel="Oui, supprimer"
        variant="danger"
      />
    </div>
  );
}
