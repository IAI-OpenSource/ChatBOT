import { Github, Users, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Equipe() {
    const navigate = useNavigate();
    const theme = localStorage.getItem("theme") || "dark"; // On récupère le thème global si possible

    const membres = [
        {
            nom: "Membre 1",
            role: "Développeur Fullstack",
            desc: "Expert en React et FastAPI. Passionné par l'architecture logicielle et les interfaces utilisateur intuitives.",
            github: "https://github.com/votre-compte/lefreeze-chat"
        },
        {
            nom: "Membre 2",
            role: "Designer UI/UX",
            desc: "Spécialiste du design premium et des expériences interactives. Créateur de l'identité visuelle de lefreeze.",
            github: "https://github.com/votre-compte/lefreeze-chat"
        }
    ];

    return (
        <div className={`min-h-screen w-full flex flex-col items-center p-8 transition-colors duration-500 ${theme === "dark" ? "bg-[#0a0a0a] text-white" : "bg-zinc-50 text-zinc-900"
            }`}>
            {/* Header */}
            <div className="w-full max-w-5xl flex items-center justify-between mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
                <button
                    onClick={() => navigate("/dashboard")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border ${theme === "dark" ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-zinc-200 hover:bg-zinc-100"
                        }`}
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm font-medium">Retour au Chat</span>
                </button>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-zinc-100 border-zinc-200"
                        }`}>
                        <Users size={24} className={theme === "dark" ? "text-white" : "text-zinc-600"} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Notre Équipe</h1>
                </div>
            </div>

            {/* Content */}
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {membres.map((membre, index) => (
                    <div
                        key={index}
                        className={`group p-8 rounded-3xl border transition-all duration-300 hover:scale-[1.02] shadow-2xl ${theme === "dark" ? "bg-[#151515] border-white/5 hover:border-white/20" : "bg-white border-zinc-200 hover:border-zinc-300"
                            }`}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-extrabold">{membre.nom}</h2>
                                <p className={`text-sm font-medium ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                                    {membre.role}
                                </p>
                            </div>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 ${theme === "dark" ? "bg-white/5" : "bg-zinc-100"
                                }`}>
                                <Users size={20} className={theme === "dark" ? "text-white" : "text-zinc-600"} />
                            </div>
                        </div>

                        <p className={`text-sm leading-relaxed mb-8 ${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>
                            {membre.desc}
                        </p>

                        <a
                            href={membre.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold transition-all ${theme === "dark" ? "bg-white text-black hover:bg-zinc-200" : "bg-black text-white hover:bg-zinc-800"
                                }`}
                        >
                            <Github size={20} />
                            <span>Voir le Projet GitHub</span>
                        </a>
                    </div>
                ))}
            </div>

        </div>
    );
}
