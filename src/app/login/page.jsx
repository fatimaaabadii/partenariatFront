'use client';
import { api } from "@/api";
import { useToast } from "@/components/ui/use-toast";
import React, { useState } from "react";
import { setCookie, deleteCookie } from "cookies-next";
import { useMutation } from "@tanstack/react-query";
export default function Page() {

  const [userName, setuserName] = useState()
  const [password, setpassword] = useState()
  const { toast } = useToast()

  const login = async (data) => {

    try {
      const response = await api.post('/auth/login', { userName, password })
     // console.log(response.data);
      setCookie("token", response.data, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      toast({
        description: <span style={{ color: 'white', fontFamily: 'Arial, sans-serif' }}>Connexion réussie </span>,
        className: "bg-green-500 text-white", // Fond vert, texte blanc
        duration: 2000,
        title: "Succès",
    })
      window.location.href = "/"

    } catch (error) {
      toast({
        description: <span style={{ color: 'white', fontFamily: 'Arial, sans-serif' }}>Échec de connexion </span>,
        variant: "destructive",
        duration: 2000,
        title: "Erreur",
    })
    }
  }

  const { mutate } = useMutation({ mutationFn: login })

  function handleSubmit(event) {
    event.preventDefault()

    mutate({ userName, password }, {
      onSuccess: () => {


      }

    })
  }

  return (
    <>
      <style jsx global>{`
        .auth-container {
        background-image: url('/fatima6.jpg');
        background-size: cover;
        background-position: center;
        }
        .app-title {
          text-align: center;
          font-size: 24px;
          margin-bottom: 20px;
        }
      `}
      </style>
      <div className="auth-container flex justify-center items-center h-screen">

        <div className="app-title" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '2rem', color: '#333' }}>
          <h1>Bienvenue sur Entraide-Partenariat</h1>
        </div>

        <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
          <h1 className="text-2xl font-semibold mb-4">Authentification</h1>
          <form onSubmit={handleSubmit}>

            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-600">
                Email
              </label>
              <input
                type="text"
                id="username"
                name="email"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                autoComplete="off"
                value={userName}
                required
                onChange={(e) => setuserName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-600">
                 Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                required
                autoComplete="off"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
              />
            </div>



            <button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-md py-2 px-4 w-full"
            >
              Connexion
            </button>
          </form>

        </div>
      </div>
    </>
  );
}