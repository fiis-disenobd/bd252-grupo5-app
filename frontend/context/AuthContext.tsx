"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface Usuario {
  id_usuario: string;
  correo_electronico: string;
  empleado: {
    nombre: string;
    apellido: string;
    codigo: string;
  };
  operador: {
    id_operador: string;
    turno: string;
    zona_monitoreo: string;
  } | null;
}

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (correo: string, contrasena: string) => Promise<void>;
  logout: () => void;
  reloadUser: () => Promise<void>;
  setAuthData: (token: string, usuario: Usuario) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay sesión guardada
    const tokenGuardado = localStorage.getItem("token");
    const usuarioGuardado = localStorage.getItem("usuario");

    if (tokenGuardado && usuarioGuardado) {
      setToken(tokenGuardado);

      try {
        // Intentar parsear el usuario guardado
        const usuarioData = JSON.parse(usuarioGuardado);
        setUsuario(usuarioData);
        setLoading(false);
      } catch (error) {
        // Si falla el parseo, limpiar sesión
        console.error("Error parsing usuario from localStorage:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        setToken(null);
        setUsuario(null);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (correo: string, contrasena: string) => {
    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo_electronico: correo,
          contrasena,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al iniciar sesión");
      }

      const data = await response.json();

      // Guardar token
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);

      // Obtener perfil completo desde /auth/profile para asegurar estructura correcta
      const profileResponse = await fetch("http://localhost:3001/auth/profile", {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        localStorage.setItem("usuario", JSON.stringify(profileData));
        setUsuario(profileData);
      } else {
        // Si falla, usar los datos del login
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        setUsuario(data.usuario);
      }

      // Redirigir a monitoreo (solo módulo disponible para operadores)
      router.push("/monitoreo");
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    // Limpiar estado
    setToken(null);
    setUsuario(null);

    // Redirigir a login
    router.push("/login");
  };

  const reloadUser = async () => {
    const tokenGuardado = localStorage.getItem("token");
    if (!tokenGuardado) return;

    try {
      const response = await fetch("http://localhost:3001/auth/profile", {
        headers: {
          Authorization: `Bearer ${tokenGuardado}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsuario(data);
        localStorage.setItem("usuario", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error recargando usuario:", error);
    }
  };

  const setAuthData = (newToken: string, newUsuario: Usuario) => {
    setToken(newToken);
    setUsuario(newUsuario);
    localStorage.setItem("token", newToken);
    localStorage.setItem("usuario", JSON.stringify(newUsuario));
  };

  const value: AuthContextType = {
    usuario,
    token,
    login,
    logout,
    reloadUser,
    setAuthData,
    isAuthenticated: !!token && !!usuario,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
