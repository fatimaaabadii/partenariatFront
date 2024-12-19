"use client";

import { DataTable } from "@/components/table/table";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import Modal from "react-modal";

import { useToast } from "@/components/ui/use-toast";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useQuery } from "@tanstack/react-query";
import { api, getDelegations, getUsers, getCurrentUser } from "@/api";
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
  const token = getCookie('token'); 
  const headers = {
    Authorization: `Bearer ${token}`
  };
  const { data: usersData, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers(),
  });

  

  const [modalIsOpen, setIsOpen] = useState(false);
  const [modelDeleteIsOpen, setModelDeleteIsOpen] = useState(false);
  const [value, setValue] = useState();
  const [selectedValue, setselectedValue] = useState({
    name: "",
    email: "",
    password: "",
    delegation:"",
    coordination: "",
    roles:""
  });
  const { data: refetchh,} = useQuery({
    queryKey: ['delegations'],
    queryFn: getDelegations(),
  });
  const [comboBoxOpen, setComboBoxOpen] = useState(false);

  const [typeOfSubmit, settypeOfSubmit] = useState("create");

  const usersCol = [

    {
      accessorKey: "name",
      header: () => <div className="">Nom </div>,
      cell: ({ row }) => {
        const user = row.getValue("name");

        return <div className=" font-medium">{user}</div>;
      },
    },
    {
      accessorKey: "email",
      header: () => <div className="">Email </div>,
      cell: ({ row }) => {
        const user = row.getValue("email");

        return <div className=" font-medium">{user}</div>;
      },
    },
    {
      accessorKey: "delegation",
      header: () => <div className="">Délégation </div>,
      cell: ({ row }) => {
        const user = row.getValue("delegation");

        return <div className=" font-medium">{user}</div>;
      },
    },

    {
      accessorKey: "coordination",
      header: () => <div className="">Coordination </div>,
      cell: ({ row }) => {
        const user = row.getValue("coordination");

        return <div className=" font-medium">{user}</div>;
      },
    },

    {
      accessorKey: "tele",
      header: () => <div className="">Téléphone </div>,
      cell: ({ row }) => {
        const user = row.getValue("tele");

        return <div className=" font-medium">{user}</div>;
      },
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
                  setValue(row.original.roles);
                  setIsOpen(true);
                  settypeOfSubmit("update");
                }}
              >
                Mettre à jour cette ligne
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setselectedValue(row.original);

                  setModelDeleteIsOpen(true);
                }}
              >
                Supprimer cette ligne
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  function openModal() {
    setIsOpen(true);
  }
 
  function closeModal() {
    setIsOpen(false);
  }
  
  const { toast } = useToast()
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const roleMap = {
      "1": "SIEGE_ROLES",
      "2": "DELEGUE_ROLES",
      "3": "COORDINATEUR_Roles",
      "4": "TECHNIQUE_Roles",
     
    };
  
    if (typeOfSubmit === "create" && usersData) {
      
      try {
        
  
        const parsedSelectedValue = {
          ...selectedValue,
          name: selectedValue.name || "", // Assurez-vous que les valeurs sont définies
          email: selectedValue.email || "",
          password: selectedValue.password || "",
          delegation: selectedValue.delegation || "",
          coordination: selectedValue.coordination || "",
          roles: selectedValue.roles || ""
          // Convertir l'identifiant en nombre entier
        };
      
         await api.post("/auth/addUser", {...selectedValue
        }, {
          headers: headers
        });
  
        refetch();
        toast({
          description: "Utilisateur créé avec succès",
          className: "bg-green-500 text-white",
          duration: 2000,
          title: "Succès",
        });
        setIsOpen(false);
      } catch (e) {
        toast({
          description: "Erreur lors de la création de l'utilisateur",
          className: "bg-red-500 text-white",
          duration: 2000,
          title: "Erreur",
        });
      }
    } else if (typeOfSubmit === "update" && usersData) {
      
      try {
        if (!selectedValue.id) {
          throw new Error("Identifiant non défini.");
        }
  
        const parsedSelectedValue = {
          ...selectedValue,
          id: parseInt(selectedValue.id),
          name: selectedValue.name || "",
          email: selectedValue.email || "",
          password: selectedValue.password || "",
          delegation: selectedValue.delegation || "",
          coordination: selectedValue.coordination || "",
          roles:selectedValue.roles || ""
        };
  
        await api.put("/auth/updateUser/" + selectedValue.id, {
          ...parsedSelectedValue
        },{
          headers: headers
        });
  
        refetch();
        toast({
          description: "Utilisateur mis à jour avec succès",
          className: "bg-green-500 text-white",
          duration: 2000,
          title: "Succès",
        });
        setIsOpen(false);
      } catch (e) {
        toast({
          description: "Erreur lors de la mise à jour de l'utilisateur",
          className: "bg-red-500 text-white",
          duration: 2000,
          title: "Erreur",
        });
      }
    }
  };
  {/*const roles = [
    
    {
      value: "1",
      label: "Siège",
    },
    {
      value: "2",
      label: "Délégué",
    },

    {
      value: "3",
      label: "Coordinateur",
    },

     {
      value: "4",
      label: "Service technique",
    },
   
  ];*/}
  const getRoleLabel = (value) => {
    const roleMap = {
      "SIEGE_ROLES": "Siège",
      "DELEGUE_ROLES": "Délégué",
      "COORDINATEUR_Roles": "Coordinateur",
      "TECHNIQUE_Roles": "Service technique",
    };
    // Vérifiez si la valeur est définie avant d'accéder à ses propriétés
    if (value && roleMap[value]) {
      return roleMap[value];
    }
    return ""; // Retourne une chaîne vide si la valeur n'est pas définie ou ne correspond pas à un rôle connu
  };
 
  return (
    <div className="px-6 py-4" id="Tickets">
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
        style={customStyles}
        contentLabel="Example Modal"
        
      
      >
        <form class="max-w-full mx-auto  py-6 bg-white shadow-md rounded-md" onSubmit={handleSubmit} >
          <h2 class="text-lg font-semibold mb-4 px-6">
            {typeOfSubmit === "create"
              ? "Ajouter un nouveau utilisateur"
              : " Modifier les informations de cet utilisateur"}
          </h2>
          <div class=" px-6  mb-4">
            <label class="block mb-1" for="name">
              Nom
            </label>
            <input
              class="w-full border rounded-md px-3 py-2"
              type="text"
              id="name"
              placeholder="Nom"
              value={selectedValue?.name || ""}
              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  name: e.target.value,
                });
              }}
            />
            </div>
           <div className=" px-6  mb-4">
            <label className="block mb-1" for="coordination">
             Coordination
            </label>
            <DropdownMenu>
               <DropdownMenuTrigger>
                  <button className="w-full border rounded-md px-3 py-2 text-left">
                     {selectedValue?.coordination || "Sélectionner une coordination"}
                  </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="origin-top-right right-0">
                   <DropdownMenuItem onSelect={(e) => {
                       setselectedValue({
                        ...selectedValue,
                        coordination: e.target.textContent,
                             });
                        }}>
                          Tanger-Tetouan- Al Hoceima
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                      setselectedValue({
                     ...selectedValue,
                     coordination: e.target.textContent,
                          });
                            }}>
                          Oriental
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                          setselectedValue({
                          ...selectedValue,
                          coordination: e.target.textContent,
                            });
                            }}>
                         Fes-Meknes
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                        setselectedValue({
                        ...selectedValue,
                        coordination: e.target.textContent,
                          });
                                 }}>
                          Rabat-Sale-Kenitra
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                     setselectedValue({
                    ...selectedValue,
                    coordination: e.target.textContent,
                      });
                      }}>
                     Beni Mellal-Khenifra
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => {
                       setselectedValue({
                       ...selectedValue,
                       coordination: e.target.textContent,
                          });
                          }}>
                       Casablanca-Settat
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => {
                               setselectedValue({
                              ...selectedValue,
                              coordination: e.target.textContent,
                              });
                             }}>
                          Marrakech-Safi
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => {
                        setselectedValue({
                         ...selectedValue,
                         coordination: e.target.textContent,
                           });
                             }}>
                               Draa_Tafilalet
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => {
                             setselectedValue({
                             ...selectedValue,
                             coordination: e.target.textContent,
                                 });
                                    }}>
                             Sous-Massa
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => {
                           setselectedValue({
                            ...selectedValue,
                            coordination: e.target.textContent,
                                });
                                 }}>
                              Guelmim-Oued Noun
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                        setselectedValue({
                         ...selectedValue,
                         coordination: e.target.textContent,
                             });
                               }}>
                         Laayoune_Saguia al Hamra
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => {
                        setselectedValue({
                         ...selectedValue,
                         coordination: e.target.textContent,
                             });
                               }}>
                         Ed Dakhla_Oued ed Dahab
                    </DropdownMenuItem>
                </DropdownMenuContent>
          </DropdownMenu>
          </div>
          <div className="px-6 mb-4">
  <label className="block mb-1" htmlFor="delegation">
    Délégation
  </label>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <button className="w-full border rounded-md px-3 py-2 text-left">
        {selectedValue?.delegation || "Sélectionner une délégation"}
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="origin-top-right right-0">
      {(refetchh || [])
        .filter((item) => item.coordination === selectedValue?.coordination)
        .map((item) => (
          <DropdownMenuItem
            key={item.id.toString()}
            onSelect={(e) => {
              setselectedValue({
                ...selectedValue,
                delegation: item.delegation,
              });
            }}
          >
            {item.delegation}
          </DropdownMenuItem>
        ))}
    </DropdownMenuContent>
  </DropdownMenu>
</div>

          





<div className=" px-6  mb-4">
            <label className="block mb-1" for="roles">
             Role
            </label>
            <DropdownMenu>
               <DropdownMenuTrigger>
                  <button className="w-full border rounded-md px-3 py-2 text-left">
                     {selectedValue?.roles}
                  </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="origin-top-right right-0">
                   <DropdownMenuItem onSelect={(e) => {
                       setselectedValue({
                        ...selectedValue,
                        roles: e.target.textContent,
                             });
                        }}>
                         SIEGE_ROLES 
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                      setselectedValue({
                     ...selectedValue,
                     roles: e.target.textContent,
                          });
                            }}>
                              DELEGUE_ROLES
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                          setselectedValue({
                          ...selectedValue,
                          roles: e.target.textContent,
                            });
                            }}>
                         COORDINATEUR_ROLES
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                          setselectedValue({
                          ...selectedValue,
                          roles: e.target.textContent,
                            });
                            }}>
                         TECHNIQUE_ROLES
                   </DropdownMenuItem>
                    
                 
                </DropdownMenuContent>
          </DropdownMenu>
          </div>



          <div class=" px-6  mb-4">
            <label class="block mb-1" for="tele">
              Téléphone
            </label>
            <input
              class="w-full border rounded-md px-3 py-2"
              type="text"
              id="tele"
              placeholder="tele"
              value={selectedValue?.tele || ""}
              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  tele: e.target.value,
                });
              }}
            />
          </div>













          
          <div class=" px-6  mb-4">
            <label class="block mb-1" for="email">
              Email
            </label>
            <input
              class="w-full border rounded-md px-3 py-2"
              type="email"
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
          <div class=" px-6  mb-4">
            <label class="block mb-1" for="password">
              Mot de passe
            </label>
            <input
              class="w-full border rounded-md px-3 py-2"
              type="password"
              id="password"
              placeholder="password"
              value={selectedValue?.password || ""}
              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  password: e.target.value,
                });
              }}
            />
          </div>
          
         















          <div class="mt-4 px-6 flex justify-end">
            <button class="bg-blue-500 text-white px-4 py-2 rounded-md">
              Envoyer
            </button>
          </div>
        </form>
      </Modal>
      <DataTable
        title={"Utilisateurs"}
        filterCol="name"
        columns={usersCol}
        data={usersData || []}
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
      await api.delete("/auth/deleteUser/" + selectedValue.id, {
        headers: headers
             
            })
      toast({
        description: "Suppression réussie",
        className: "bg-green-500 text-white",
        duration: 2000,
        title: "Success",
      })
      refetch()
      closeModal()
    } catch (e) {
      toast({
        description: "Erreur lors de la suppression de cet utilisateur",
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
      style={customStyles}
      contentLabel="Example Modal"
    >
      <form className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md" onSubmit={handleSubmit} >
        <h2 className="text-lg font-semibold mb-4">Supprimer un élément</h2>
        <div className="mb-4">
          <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={closeModal}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
          >
           Annuler
          </button>
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
          >
            Supprimer
          </button>
        </div>
      </form>
    </Modal>
  );
};