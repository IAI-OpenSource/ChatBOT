import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Api, getErrorMessage } from "@/ServicesApi/Api";
import { useToast } from "@/hooks/use-toast";

import logo from "../assets/image.png";

const registerSchema = z.object({
    username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
    email: z.string().email("Adresse email invalide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterValues) => {
        setIsLoading(true);
        console.log("Tentative d'inscription avec :", { ...data, password: "***" });
        try {
            // Correspondance exacte avec le backend : /users/register
            console.log("Appel API POST /api/users/register...");
            await Api.post("/users/register", {
                username: data.username,
                email: data.email,
                password: data.password,
            });

            toast({
                title: "Succès !",
                description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
            });

            navigate("/login");
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur lors de l'inscription",
                description: getErrorMessage(error),
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-black transition-all duration-500 ease-in-out">
            <div className="w-full max-w-6xl shadow-[0_0_50px_rgba(255,255,255,0.05)] rounded-2xl lg:rounded-3xl overflow-hidden flex flex-col lg:flex-row transform transition-all duration-500 ease-in-out lg:hover:scale-[1.01] bg-[#0a0a0a] border border-white/5">

                {/* Partie Gauche l'image  */}
                <div className="hidden lg:block w-1/2 relative bg-black border-r border-white/5">
                    <img
                        src={logo}
                        alt="Illustration register"
                        className="w-full h-full object-cover opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent mix-blend-overlay" />
                </div>

                {/* Partie Droite le formulaire */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12">
                    <div className="w-full max-w-md space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-4xl font-extrabold tracking-tight text-white">
                               Bienvenue sur  <span className="text-primary italic">le freeze chat </span>
                            </h2>
                            <p className="text-zinc-500 italic">
                                667 a vie 
                            </p>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                           
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-zinc-300" htmlFor="username">
                                    Nom d'utilisateur :
                                </label>
                                <input
                                    id="username"
                                    placeholder="votre_nom_utilisateur"
                                    {...register("username")}
                                    className={`w-full border rounded-xl px-4 py-2.5 text-sm shadow-sm transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-zinc-900 text-white placeholder:text-zinc-600 ${errors.username ? "border-destructive" : "border-zinc-800"
                                        }`}
                                />
                                {errors.username && (
                                    <p className="text-xs text-destructive font-medium">{errors.username.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-zinc-300" htmlFor="email">
                                    Email :
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="mangemortsquad@gmail.com"
                                    {...register("email")}
                                    className={`w-full border rounded-xl px-4 py-2.5 text-sm shadow-sm transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-zinc-900 text-white placeholder:text-zinc-600 ${errors.email ? "border-destructive" : "border-zinc-800"
                                        }`}
                                />
                                {errors.email && (
                                    <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-zinc-300" htmlFor="password">
                                    Mot de passe :
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        {...register("password")}
                                        className={`w-full border rounded-xl px-4 py-2.5 text-sm shadow-sm transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-zinc-900 text-white placeholder:text-zinc-600 ${errors.password ? "border-destructive" : "border-zinc-800"
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-3 flex items-center text-zinc-500 hover:text-white transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-zinc-300" htmlFor="confirmPassword">
                                    Confirmer le mot de passe :
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("confirmPassword")}
                                    className={`w-full border rounded-xl px-4 py-2.5 text-sm shadow-sm transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-zinc-900 text-white placeholder:text-zinc-600 ${errors.confirmPassword ? "border-destructive" : "border-zinc-800"
                                        }`}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-xs text-destructive font-medium">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                           
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 mt-2 rounded-xl font-bold tracking-wide shadow-lg bg-white text-black transition-all duration-300 hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        Inscription...
                                    </>
                                ) : (
                                    "S'inscrire"
                                )}
                            </button>
                        </form>

                        <div className="pt-2 text-center border-t border-white/5">
                            <p className="text-sm text-zinc-500">
                               Vous êtes deja inscrit  ?{" "}
                                <Link
                                    to="/login"
                                    className="font-bold text-white hover:text-primary transition-all duration-300 underline underline-offset-4"
                                >
                                    Se connecter
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
