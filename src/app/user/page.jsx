"use client";
import React, { useState } from 'react';
import { api, getTickets, getUsers, getCurrentUser } from "@/api";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
function ProfilePage() {
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('Délégué');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');
  const [selectedValue, setselectedValue] = useState();
  const { toast } = useToast();
  const token = getCookie('token'); 
    const headers = {
        Authorization: `Bearer ${token}`
    };
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser(),
  });
  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    if (oldPassword && newPassword && confirmNewPassword && newPassword === confirmNewPassword) {
      try {
        const parsedValue = {
         
          oldPassword: oldPassword, // Assurez-vous que les valeurs sont définies
          newPassword: newPassword,
          confirmPassword: confirmNewPassword,
          
        };
        await api.put("/auth/changepsw/" + userData.id,parsedValue , { headers });
        toast({
          description: "Modification de mot de passe réussie",
          className: "bg-green-500 text-white",
          duration: 2000,
          title: "Success",
        });
       
        
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setPasswordChangeMessage('Mot de passe modifié avec succès.');
      } catch (error) {
        toast({
          description: "Erreur lors de la modification de mot de passe",
          className: "bg-red-500 text-white",
          duration: 2000,
          title: "Error",
        });
        console.error(error);
      }
    } else {
      setPasswordChangeMessage('Veuillez remplir correctement tous les champs.');
    }
  };  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '1000px',height: '600px', textAlign: 'center', fontFamily: 'Arial, sans-serif',backgroundColor:'white' }}>
        <div style={{  borderRadius: '5px', padding: '20px', marginBottom: '20px', margin: '0 20px' }}>
        <h1 className="text-center text-2xl font-bold mb-4 font-serif">Mon Profil</h1>

        </div>
        <div style={{ border: '2px solid #ccc', borderRadius: '5px', padding: '20px', marginBottom: '20px', margin: '0 20px' }}>
        <h2 className="text-center text-m font-bold mb-4 font-serif">Informations personnelles</h2>
          <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
  <label style={{ marginLeft: '330px', marginRight: '100px' }}><strong>Nom:</strong></label>
  <span>{userData?.name}</span>
</div>
<div style={{ display: 'flex', marginBottom: '10px' }}>
  <label style={{ marginLeft: '330px', marginRight: '93px' }}><strong>Email:</strong></label>
  <span>{userData?.email}</span>
</div>

<div style={{ display: 'flex', marginBottom: '10px' }}>
  <label style={{ marginLeft: '330px', marginRight: '36px' }}><strong>Coordination:</strong></label>
  <span>{userData?.coordination}</span>
</div>
<div style={{ display: 'flex', marginBottom: '10px' }}>
  <label style={{ marginLeft: '330px', marginRight: '55px' }}><strong>Délégation:</strong></label>
  <span>{userData?.delegation}</span>
</div>

<div style={{ display: 'flex', marginBottom: '10px' }}>
  <label style={{ marginLeft: '330px', marginRight: '101px' }}><strong>Rôle:</strong></label>
  <span>{userData?.roles}</span>
</div>



          </div>
        </div>
        <div style={{ border: '2px solid #ccc', borderRadius: '5px', padding: '20px', margin: '0 20px' }}>
          <h2 className="text-center text-m font-bold mb-4 font-serif">Modifier le mot de passe</h2>
          <form onSubmit={handleSubmitPasswordChange}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Ancien mot de passe:</label>
              <input type="password" style={{ padding: '5px', borderRadius: '3px', border: '1px solid #ccc', width: '100%' }} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Nouveau mot de passe:</label>
              <input type="password" style={{ padding: '5px', borderRadius: '3px', border: '1px solid #ccc', width: '100%' }} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Confirmer le nouveau mot de passe:</label>
              <input type="password" style={{ padding: '5px', borderRadius: '3px', border: '1px solid #ccc', width: '100%' }} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
            </div>
            <button type="submit" style={{ padding: '8px 20px', backgroundColor: '#e2e2e2', color: '#333', border: '2px solid #ccc', borderRadius: '3px' }}>Changer le mot de passe</button>
            {passwordChangeMessage && <p style={{ color: 'green' }}>{passwordChangeMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;