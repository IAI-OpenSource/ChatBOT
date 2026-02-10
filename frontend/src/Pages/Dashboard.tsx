import { useState, useEffect, useRef } from "react";
import {
    Plus,
    MessageSquare,
    User,
    Send,
    LogOut,
    Menu,
    X,
    ChevronRight,
    BrainCircuit,
    Sun,
    Moon,
    Bot,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Api, type Conversation, getErrorMessage } from "@/ServicesApi/Api";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
    const [currentMessages, setCurrentMessages] = useState<{ role: string; content: string }[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState<{ id: number; username: string; email: string } | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [theme, setTheme] = useState<"dark" | "light">("dark");

    const scrollRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { toast } = useToast();

    
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [currentMessages]);

    useEffect(() => {
        const init = async () => {
            const user = await fetchUserData();
            if (user) {
                fetchConversations(user.id);
            }
        };
        init();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await Api.get("/users/me");
            setUserData(response.data);
            return response.data;
        } catch (error) {
            console.error("Erreur user:", error);
            return null;
        }
    };

    const fetchConversations = async (userId?: number) => {
        const uid = userId || userData?.id;
        if (!uid) return;

        try {
            const response = await Api.get(`/conversations/user/${uid}`);
            setConversations(response.data);
        } catch (error) {
            console.error("Erreur conversations:", error);
        }
    };

    const startNewChat = () => {
        setActiveConversationId(null);
        setCurrentMessages([]);
    };

    const selectConversation = async (id: number) => {
        setActiveConversationId(id);
        try {
            const response = await Api.get(`/conversations/${id}`);
            const messages = response.data.messages.map((m: any) => ({
                role: m.role,
                content: m.content
            }));
            setCurrentMessages(messages);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de charger la conversation",
            });
        }
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue.trim();
        setInputValue("");
        setCurrentMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            let convId = activeConversationId;

            // Si c'est une nouvelle conversation, on la crée d'abord
            if (!convId) {
                if (!userData?.id) return;
                const createRes = await Api.post("/chat/new", null, {
                    params: {
                        id_user: userData.id,
                        title: userMessage.substring(0, 30)
                    }
                });
                convId = createRes.data.id_conv;
                if (!convId) throw new Error("Erreur lors de la création de la conversation");

                setActiveConversationId(convId);
                fetchConversations();
            }

            // Envoi du message a mistral ai 
            const chatRes = await Api.post(`/chat/ask/${convId}`, null, {
                params: { prompt: userMessage }
            });

            
            setCurrentMessages(prev => [...prev, { role: "assistant", content: chatRes.data.reponse }]);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: getErrorMessage(error),
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const deleteConversation = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (!confirm("Supprimer cette discussion ?")) return;

        try {
            await Api.delete(`/conversations/${id}`);
            if (activeConversationId === id) {
                startNewChat();
            }
            fetchConversations();
            toast({ title: "Supprimé", description: "La conversation a été supprimée." });
        } catch (error) {
            toast({ variant: "destructive", title: "Erreur", description: "Impossible de supprimer." });
        }
    };

    return (
        <div className={`flex h-screen w-full overflow-hidden transition-colors duration-500 ${theme === "dark" ? "bg-[#0a0a0a] text-white" : "bg-zinc-50 text-zinc-900"
            }`}>
            {/* SIDEBAR */}
            <aside
                className={`${isSidebarOpen ? "w-72" : "w-0 lg:w-0"} 
                transition-all duration-300 border-r flex flex-col relative z-20 overflow-hidden ${theme === "dark" ? "border-white/5 bg-black" : "border-zinc-200 bg-white"
                    }`}
            >
                {/* Header Sidebar */}
                <div className="p-4 flex flex-col gap-4">
                    <button
                        onClick={startNewChat}
                        className="flex items-center gap-3 w-full p-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all group"
                    >
                        <div className={`${theme === "dark" ? "bg-white text-black" : "bg-black text-white"} p-1 rounded-md group-hover:scale-110 transition-transform`}>
                            <Plus size={16} strokeWidth={3} />
                        </div>
                        <span className="font-semibold text-sm">Nouvelle Chat</span>
                    </button>
                </div>

                {/* Liste Conversations */}
                <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
                    <div className="px-3 py-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                        Historique
                    </div>
                    {conversations.length === 0 ? (
                        <div className="px-4 py-8 text-center space-y-2">
                            <MessageSquare className="mx-auto text-zinc-800" size={32} />
                            <p className="text-xs text-zinc-600 italic">Aucune discussion encore</p>
                        </div>
                    ) : (
                        conversations.map((conv) => (
                            <div
                                key={conv.id_conv}
                                onClick={() => selectConversation(conv.id_conv)}
                                className={`flex items-center gap-3 w-full p-3 rounded-xl text-left text-sm transition-all cursor-pointer hover:bg-white/5 group ${activeConversationId === conv.id_conv ? "bg-white/10 text-white" : "text-zinc-400"
                                    }`}
                            >
                                <MessageSquare size={16} className={activeConversationId === conv.id_conv ? "text-primary" : ""} />
                                <span className="truncate flex-1 font-medium">{conv.title}</span>
                                <button
                                    onClick={(e) => deleteConversation(e, conv.id_conv)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                                >
                                    <X size={14} />
                                </button>
                                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))
                    )}
                </div>

            </aside>

           
            <main className={`flex-1 flex flex-col relative transition-colors duration-500 ${theme === "dark" ? "bg-[#0a0a0a]" : "bg-white"
                }`}>
                <header className={`h-16 border-b flex items-center justify-between px-6 backdrop-blur-xl sticky top-0 z-10 transition-colors ${theme === "dark" ? "border-white/5 bg-black/50" : "border-zinc-200 bg-white/80"
                    }`}>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <h1 className="text-lg font-bold tracking-tight">
                            lefreeze<span className="text-zinc-500 font-light">+ Chat</span>
                        </h1>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-black border border-white/10 flex items-center justify-center overflow-hidden transition-all hover:border-white/40 active:scale-95 shadow-lg group"
                        >
                            <User size={20} className="text-zinc-400 group-hover:text-white transition-colors" />
                        </button>

                        {isProfileOpen && (
                            <div className="absolute top-12 right-0 w-64 bg-[#151515] border border-white/10 rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200 z-50">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                                        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center">
                                            <User size={20} className="text-zinc-500" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-bold truncate text-white">{userData?.username || "Profil"}</p>
                                            <p className="text-[10px] text-zinc-500 truncate">{userData?.email || "Connecté"}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <button
                                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                            className={`flex items-center gap-3 w-full p-2.5 rounded-xl text-sm transition-all text-left ${theme === "dark" ? "text-zinc-400 hover:bg-white/5 hover:text-white" : "text-zinc-600 hover:bg-black/5 hover:text-black"
                                                }`}
                                        >
                                            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                                            <span>Mode {theme === "dark" ? "Clair" : "Sombre"}</span>
                                        </button>
                                        <button className={`flex items-center gap-3 w-full p-2.5 rounded-xl text-sm transition-all text-left ${theme === "dark" ? "text-zinc-400 hover:bg-white/5 hover:text-white" : "text-zinc-600 hover:bg-black/5 hover:text-black"
                                            }`}>
                                            <LogOut size={16} />
                                            <span onClick={handleLogout}>Déconnexion</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

             
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center"
                >
                    {currentMessages.length === 0 ? (
                        <div className="mt-[20vh] w-full max-w-2xl px-6 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <div className={`inline-flex p-3 rounded-2xl border mb-2 transition-colors ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-zinc-100 border-zinc-200"
                                }`}>
                                <BrainCircuit size={40} className={theme === "dark" ? "text-white" : "text-zinc-600"} />
                            </div>
                            <h2 className={`text-5xl font-extrabold tracking-tight transition-colors ${theme === "dark" ? "text-white" : "text-zinc-900"
                                }`}>
                                Bienvenue dans la secte 667 
                            </h2>
                            
                        </div>
                    ) : (
                        /* Messages en cours ce qui va s'afficher comme gemini  */
                        <div className="w-full max-w-3xl flex flex-col py-8 px-6 space-y-12">
                            {currentMessages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 ${msg.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    {/* les roles */}
                                    {msg.role === "assistant" && (
                                        <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0 mt-1">
                                            <Bot size={16} className="text-white" />
                                        </div>
                                    )}

                                    <div className={`max-w-[85%] space-y-2 ${msg.role === "user" ? "order-first" : ""}`}>
                                        {msg.role === "user" ? (
                                            <div className={`px-5 py-3 rounded-2xl rounded-tr-sm border leading-relaxed text-[15px] ${theme === "dark" ? "bg-white/10 text-white border-white/5" : "bg-black text-white border-black/5 shadow-lg"
                                                }`}>
                                                {msg.content}
                                            </div>
                                        ) : (
                                            <div className={`leading-relaxed text-[15px] p-2 ${theme === "dark" ? "text-zinc-200" : "text-zinc-800"
                                                }`}>
                                                {msg.content.split('\n').map((line, i) => (
                                                    <p key={i} className={line ? "mb-4" : "h-2"}>{line}</p>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {msg.role === "user" && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-black border border-white/10 flex items-center justify-center shrink-0 mt-1 overflow-hidden">
                                            <User size={16} className="text-zinc-400" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex gap-6 animate-pulse">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                                        <Bot size={16} className="text-zinc-600" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-white/5 rounded-full w-[40%]" />
                                        <div className="h-4 bg-white/5 rounded-full w-[60%]" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className={`p-6 w-full flex justify-center transition-colors ${theme === "dark" ? "bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]" : "bg-gradient-to-t from-zinc-50 via-zinc-50"
                    } to-transparent`}>
                    <form
                        onSubmit={handleSendMessage}
                        className="w-full max-w-3xl relative group"
                    >
                        <div className={`relative flex items-center border rounded-2xl shadow-2xl transition-all p-1.5 pl-6 ${theme === "dark" ? "bg-[#151515] border-white/10 focus-within:border-white/20" : "bg-white border-zinc-200 focus-within:border-zinc-400"
                            }`}>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask anything..."
                                className={`flex-1 bg-transparent border-none outline-none py-3 text-sm transition-colors ${theme === "dark" ? "text-white placeholder:text-zinc-500" : "text-black placeholder:text-zinc-400"
                                    }`}
                            />

                            <div className="flex items-center gap-2 pr-2">

                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isLoading}
                                    className={`p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100 shadow-xl ${theme === "dark" ? "bg-white text-black disabled:bg-zinc-800 disabled:text-zinc-600 shadow-white/5" : "bg-black text-white disabled:bg-zinc-200 disabled:text-zinc-400 shadow-black/5"
                                        }`}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
            </main>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
        </div>
    );
}
