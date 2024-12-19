"use client";
import { DataTable } from "@/components/coordTable";
import React, { useState, useEffect } from 'react';
import { setCookie, getCookie, deleteCookie } from "cookies-next";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import Modal from "react-modal";
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { useQuery } from "@tanstack/react-query";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { api, getDelegations, getUsers, getCurrentUser } from "@/api";
import { QueryClient, QueryClientProvider } from 'react-query';
import ReactDOM from 'react-dom';


import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

const Page = () => {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "0",
      width: "50vw",
    },
  };
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modelDeleteIsOpen, setModelDeleteIsOpen] = useState(false);
  const [value, setValue] = useState();
  const [selectedValue, setselectedValue] = useState();
  
  
  const [comboBoxOpen, setComboBoxOpen] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [typeOfSubmit, settypeOfSubmit] = useState("create");
  const token = getCookie('token'); 
  const headers = {
    Authorization: `Bearer ${token}`
  };
  const delegationColumns = [
    
    
    {
      accessorKey: "delegation",
      header: "Délégation",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("delegation")}</div>
      ),
    },
    {
      accessorKey: "coordination",
      header: "Coordination",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("coordination")}</div>
      ),
    },
    {
      accessorKey: "tel",
      header: "Téléphone",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("tel")}</div>
      ),
    }, 
    {
      accessorKey: "fax",
      header: "Fax",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("fax")}</div>
      ),
    },
    
    
    {
      accessorKey: "email",
      header: "email",
      cell: ({ row }) => (
        <div >{row.getValue("email")}</div>
      ),
    },
   
    {
      accessorKey: "adresse",
      header: "Adresse",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("adresse")}</div>
      ),
    },
    
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => {
                  //get selected row data
                  setselectedValue(row.original);
                  const partenaireId = row.original.id; // Récupération de l'ID de l'employé
   
    
    
    
                  


                  setIsOpen(true);
                  settypeOfSubmit("update");
                  
                }}
              >
                Mettre à jour ces informations
              </DropdownMenuItem>
             
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const { toast } = useToast()

  //use query to get data from the server
  const { data, refetch } = useQuery({
    queryKey: ['Delegations'],
    queryFn: getDelegations(),
  });
  
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (typeOfSubmit === "create") {
      try {
        const parsedSelectedValue = {
          ...selectedValue,
          delegation: selectedValue.delegation,
          coordination: selectedValue.coordination,
          tel: selectedValue.tel,
          id: parseFloat(selectedValue.id), // Si som est un nombre à virgule flottante
          
          
          email: selectedValue.email,
          
          
        };
  
       // console.log('Données envoyées au serveur:', parsedSelectedValue); 
        const response = await api.post("/delegation/create", parsedSelectedValue, {
    headers: headers
         
        })
        
        refetch()
        toast({
          description: "Délégation créé avec succès",
          className: "bg-green-500 text-white",
          duration: 2000,
          title: "Success",
        })
        setIsOpen(false);
      } catch (e) {
        toast({
          description: "Erreur lors de la création d'une nouvelle délégation",
          className: "bg-red-500 text-white",
          duration: 2000,
          title: "Error",
        })
      }
    
        
    
    }
    else if (typeOfSubmit === "update" ) {
      try {
        const parsedSelectedValue = {
          ...selectedValue,
          delegation: selectedValue.delegation,
          coordination: selectedValue.coordination,
          tel: selectedValue.tel,
          id: parseFloat(selectedValue.id), // Si som est un nombre à virgule flottante
          
          
          email: selectedValue.email,
          
        };
        
        //console.log('Données envoyées au serveur:', parsedSelectedValue);
       // console.log(selectedValue);
        const response = await api.put("/delegation/update/"+ selectedValue.id, 
        parsedSelectedValue, {
            headers: headers
                 
                })
          
        
        refetch()
        toast({
          description: "Délégation mise à jour avec succès",
          className: "bg-green-500 text-white",
          duration: 2000,
          title: "Success",
        })
        setIsOpen(false);
      } catch (e) {
        toast({
          description: "Erreur lors de la mise à jour de votre délégation",
          className: "bg-red-500 text-white",
          duration: 2000,
          title: "Error",
        })
      }
    }
  }
  const [userDelegation, setUserDelegation] = useState(null); // État pour stocker la délégation de l'utilisateur
  // Autres déclarations de state et fonctions...

  // Récupérer les données de l'utilisateur
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser(),
  });

  // Mettre à jour l'état de la délégation de l'utilisateur lors de la réception des données
  useEffect(() => {
    if (userData) {
      setUserDelegation(userData.delegation); // Supposons que la délégation de l'utilisateur est stockée dans userData.delegation
    }
  }, [userData]);

  // Filtrer les données en fonction de la délégation de l'utilisateur
  const filteredData = data?.filter(item => item.delegation === userDelegation) || [];

  return (
    <div className="px-6 py-4" id="Delegations">
      <DeleteModal
        closeModal={() => setModelDeleteIsOpen(false)}
        modalIsOpen={modelDeleteIsOpen}
        selectedValue={selectedValue}
        refetch={refetch}
        toast={toast}
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
       
        contentLabel="Example Modal"
      >
        <form className="max-w-lg mx-auto py-8 bg-white shadow-md rounded-md" onSubmit={handleSubmit}>
          <h2 className="text-lg font-semibold mb-4 px-6">
            {typeOfSubmit === "create"
              ? "Ajouter une nouvelle délégation"
              : " Mise à jour des coordonnées de notre délégation"}
          </h2>
          <div className=" px-6  mb-4">
            <label className="block mb-1" for="delegation">
            Délégation
            </label>
            <input
              className="w-full border rounded-md px-3 py-2"
              type="text"
              id="delegation"
              placeholder="delegation"
              readOnly
              value={selectedValue?.delegation || ""}
              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  delegation: e.target.value,
                });
              }}
            />
          </div>
         
          <div className=" px-6  mb-4">
            <label className="block mb-1" for="coordination">
             Coordination
            </label>
            <input
              className="w-full border rounded-md px-3 py-2"
              type="text"
              id="coordination"
              placeholder="coordination"
              readOnly
              value={selectedValue?.coordination || ""}

              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  coordination: e.target.value,
                });
              }}
            />
          </div>






          <div className=" px-6  mb-4">
            <label className="block mb-1" for="tel">
            Téléphone
            </label>
            <input
              className="w-full border rounded-md px-3 py-2"
              type="text"
              id="tel"
              placeholder="tel"
              value={selectedValue?.tel || ""}
              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  tel: e.target.value,
                });
              }}
            />
          </div>
          
          <div className=" px-6  mb-4">
            <label className="block mb-1" for="fax">
            Fax
            </label>
            <input
              className="w-full border rounded-md px-3 py-2"
              type="text"
              id="fax"
              placeholder="fax"
              value={selectedValue?.fax || ""}
              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  fax: e.target.value,
                });
              }}
            />
          </div>


          <div className=" px-6  mb-4">
            <label className="block mb-1" for="email">
            Email
            </label>
            <input
              className="w-full border rounded-md px-3 py-2"
              type="text"
              id="email"
              
              placeholder="email"
              value={selectedValue?.email || ""}
              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  email: e.target.value,
                });
              }}
            />
          </div>
          <div className=" px-6  mb-4">
            <label className="block mb-1" for="adresse">
            Adresse
            </label>
            <input
              className="w-full border rounded-md px-3 py-2"
              type="text"
              id="adresse"
              placeholder="adresse"
              value={selectedValue?.adresse || ""}
              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  adresse: e.target.value,
                });
              }}
            />
          </div>
          
          <div className="mt-4 px-6 flex justify-end">
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-md">
              Envoyer
            </button>
          </div>
        </form>
      </Modal>
      <DataTable
        title={"Coordonnées de ma structure"}
        filterCol="delegation"
        columns={delegationColumns}
        data={filteredData || []}
        setOpenModal={openModal}
        settypeOfSubmit={settypeOfSubmit}
        canAdd={true}
      />
    </div>
  );
};

export default Page;

const DeleteModal = ({ modalIsOpen, afterOpenModal, closeModal, selectedValue, refetch, toast }) => {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "0",
      width: "fit-content",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getCookie('token'); 
    const headers = {
        Authorization: `Bearer ${token}`
    };
    try {
      await api.delete("/delegation/" + selectedValue.id,{
        headers: headers
             
            } )
      toast({
        description: "Supprimé avec succès",
        className: "bg-green-500 text-white",
        duration: 2000,
        title: "Success",
      })
      refetch()
      closeModal()
    } catch (e) {
      toast({
        description: "Erreur lors de la suppression de la délégation",
        className: "bg-red-500 text-white",
        duration: 2000,
        title: "Error",
      })
      console.log(e);
    }
  }
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      
      contentLabel="Example Modal"
    >
      <form className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md" onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold mb-4">Supprimer</h2>
        <div className="mb-4">
          <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={closeModal}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md">
          
            Annuler
          </button>
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded-md">
          
            Supprimer
          </button>
        </div>
      </form>
    </Modal>
  );
};


