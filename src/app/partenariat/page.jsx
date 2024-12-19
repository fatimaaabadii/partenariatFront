"use client";
import { DataTable } from "@/components/table/table";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useState , useCallback } from "react";
import { useHistory } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import Multiselect from "multiselect-react-dropdown";
import Modal from "react-modal";
import  { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Select from 'react-select';
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { useQuery } from "@tanstack/react-query";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { api, getPartenaires, getDelegations,getPartenariats , getCurrentUser} from "@/api";
import { QueryClient, QueryClientProvider } from 'react-query';
import ReactDOM from 'react-dom';
import React from 'react';
import { useRouter } from 'next/router';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

const Page = () => {
  const moreDetailsToShow = [
    {
      accessorKey: "partenariatName",
      header: "Nom de partenariat",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("partenariatName")}</div>
      ),
    },
    
    {
      accessorKey: "numero",
      header: "Numero",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("numero")}</div>
      ),
    },

    
    // Ajoutez d'autres détails à afficher lorsque "plus de détails" est activé
];


// Utilisation de la correspondance inversée pour obtenir les noms d'options à partir des identifiants

const styles = {
  contactForm: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px'
  },
  sectionLegend: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  sectionDivider: {
    margin: '20px 0',
    border: '0',
    borderTop: '1px solid #ccc'
  }
};
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
  const [selectedDate, setSelectedDate] = useState('');


  
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const [partenariatId, setPartenariatId] = useState(null);
  
  
  // Déclarez l'état pour les options sélectionnées
  
  const { data: part, refetch:repart} = useQuery({
    queryKey: ['partenariats'],
    queryFn: getPartenariats(),
  });

    // Fetch centreOptions from API if needed
  



  function convertToISO(dateString) {
    // Créer une nouvelle date
    var date = new Date(dateString);

    // Obtenir les composantes de la date
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // Les mois commencent à 0, donc ajoutez 1
    var day = ("0" + date.getDate()).slice(-2);
    var hours = ("0" + date.getHours()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);

    // Construire la date au format ISO 8601
    var isoDate = year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds;

    return isoDate;
}
  const handleSubmitt = (event) => {
    event.preventDefault();
    // Vous pouvez ici envoyer selectedDate à votre backend ou faire d'autres traitements avec la date.
   // console.log("Date sélectionnée :", selectedDate);
  };
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modelDeleteIsOpen, setModelDeleteIsOpen] = useState(false);
  const [modelSuiviIsOpen, setModelSuiviIsOpen] = useState(false);
  const [modelAttachmentIsOpen, setModelAttachmentIsOpen] = useState(false);
  const [delegations, setDelegations] = useState([]);
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser(),
  });
  const [value, setValue] = useState();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const { data: refetchh,} = useQuery({
    queryKey: ['delegations'],
    queryFn: getDelegations(),
  });
  let idDelegation = null;
if (refetchh) {
  const matchingDelegation = refetchh.find(item => item.delegation === userData?.delegation);
  idDelegation = matchingDelegation ? matchingDelegation.id : null;
 // console.log(idDelegation);
}
  const [selectedValue, setselectedValue] = useState({
    partenaires: [], // Initialisez la liste des partenaires
    populationCible: [],
    typeCentre:[],
    domaine:[],
    contribEn:[],
    delegations: [],
    indh: "", 
    programme_INDH:null,
    coordination: userData?.roles === "DELEGUE_ROLES" || userData?.roles === "COORDINATEUR_ROLES"
            ? userData.coordination
            : "",
    // Autres données nécessaires
    idDelegations: userData?.roles === "DELEGUE_ROLES"   [idDelegation], 
  });
  useEffect(() => {
    if (userData?.roles === "DELEGUE_ROLES" || userData?.roles === "COORDINATEUR_ROLES") {
        setselectedValue(prevState => ({
            ...prevState,
            coordination: userData.coordination
        }));
    }
}, [userData]);



  // Effet pour initialiser les délégations sélectionnées
  useEffect(() => {
    if (selectedValue && selectedValue.delegations && selectedValue.delegations.length > 0) {
      setSelectedOptions(selectedValue.delegations.map(delegation => ({
        value: delegation.id.toString(),
        label: delegation.delegation,
      })));
    }
  }, [selectedValue]);

  // Fonction de mise à jour des options sélectionnées
  const handleSelect = (selectedList) => {
    setSelectedOptions(selectedList);
    // Autres manipulations si nécessaire
  };


  
  const [showDetails, setShowDetails] = useState(false);
  const [dateSignature, setDateSignature] = useState();
  const [date_lancement, setDate_lancement] = useState();
  const [date_achevement, setdate_achevement] = useState();
  // État pour stocker l'état de la case à cocher
  const [indhPartenaire, setIndhPartenaire] = useState(false);
  // État pour stocker la valeur du champ associé à INDH
  const [programme_INDH, setProgramme_INDH] = useState('');
  const [populationCible, setpopulationCible] = useState('');
  const [typeCentre, settypeCentre] = useState('');
  // Gérer le changement de l'état de la case à cocher
  const handleCheckboxChangee = (event) => {
    setIndhPartenaire(event.target.checked);
  };


  
  const handleTypeChange = (index, type) => {
    setSelectedTypePartenaire(type);
    if (type === "Collectivité territoriale") {
      // Afficher le deuxième menu déroulant
      setShowSubTypeDropdown(true);
    }
    if (type !== "Collectivité territoriale") {
      // Cacher le deuxième menu déroulant si un autre type est sélectionné
      setShowSubTypeDropdown(false);
      // Remettre à zéro le sous-type lorsqu'un autre type est sélectionné
      setSelectedSubTypePartenaire('');
    }
    
    if (selectedValue.partenaires[index]) {
      // Mise à jour d'un partenaire existant
      setselectedValue(prevSelectedValue => {
        const updatedPartenaires = [...prevSelectedValue.partenaires];
        updatedPartenaires[index].type = type;
        return {
          ...prevSelectedValue,
          partenaires: updatedPartenaires
        };
      });
    } else {
      // Ajout d'un nouveau partenaire
      const updatedpartenaires = [...partenaires]; // Créez une copie de la liste des partenaires
        updatedpartenaires[index].type = type; // Mettez à jour le type du partenaire à l'index spécifié
        setpartenaires(updatedpartenaires);
    }
    
  };




  const [selectedPopulationCible, setSelectedPopulationCible] = useState([]);
  
  {/*const handleCheckboxChangeP = (event, value) => {
    const isChecked = event.target.checked;
    
    // Récupérer une copie de selectedValue
    const updatedSelectedValue = { ...selectedValue };
  
    // Récupérer une copie de populationCible
    const updatedPopulationCible = [...updatedSelectedValue.populationCible];
  
    // Modifier populationCible en fonction de la case à cocher
    if (isChecked) {
      updatedPopulationCible.push(value);
    } else {
      const index = updatedPopulationCible.indexOf(value);
      if (index !== -1) {
        updatedPopulationCible.splice(index, 1);
      }
    }
  
    // Mettre à jour selectedValue avec la nouvelle populationCible
    updatedSelectedValue.populationCible = updatedPopulationCible;
  
    // Mettre à jour l'état
    setselectedValue(updatedSelectedValue);
  };*/}

  const handleCheckboxChangeP = (event, value) => {
    const isChecked = event.target.checked;
    
    // Récupérer une copie de selectedValue
    const updatedSelectedValue = { ...selectedValue };
    
    // Déterminer si nous sommes dans le cas d'ajout ou de modification
    const isAdding = !selectedValue.populationCible;
    const isStringPopulationCible = typeof selectedValue.populationCible === 'string';
    
    // Récupérer une copie de populationCible
    let updatedPopulationCible = [];
    
    if (isAdding || !isStringPopulationCible) {
      // Ajout : populationCible n'est pas encore initialisé ou est un tableau
      updatedPopulationCible = isAdding ? [] : [...selectedValue.populationCible];
    } else {
      // Modification : populationCible est une chaîne de caractères
      const trimmedPopulationCible = selectedValue.populationCible.trim();
      
      if (trimmedPopulationCible !== '') {
        // Supprimer les crochets `[ ]` et les guillemets `" "`
        updatedPopulationCible = trimmedPopulationCible.replace(/[\[\]"]/g, '').split(',');
      }
    }
    
    // Modifier en fonction de la case à cocher
    if (isChecked) {
      // Ajouter la valeur à populationCible
      updatedPopulationCible.push(value);
    } else {
      // Supprimer la valeur de populationCible si elle est cochée
      updatedPopulationCible = updatedPopulationCible.filter(pop => pop.trim() !== value.trim());
    }
  
    // Mettre à jour les populations cibles déjà présentes dans selectedValue
    if (selectedValue.populationCible && Array.isArray(selectedValue.populationCible)) {
      const existingPopulations = selectedValue.populationCible.filter(pop => !updatedPopulationCible.includes(pop));
      updatedPopulationCible = updatedPopulationCible.concat(existingPopulations);
    }
  
    // Mettre à jour selectedValue avec la nouvelle valeur de populationCible
    updatedSelectedValue.populationCible = updatedPopulationCible.length > 0 ? updatedPopulationCible.join(',') : null;
    
    // Mettre à jour l'état
    setselectedValue(updatedSelectedValue);
   // console.log(updatedSelectedValue.populationCible);
  };


  // Gérer le changement de la valeur du champ associé à INDH
  const handleChangeProgramme_INDH = (event) => {
    setProgramme_INDH(event.target.value);
  };


  {/*const handleCheckboxChangeTC = (event, value) => {
    const isChecked = event.target.checked;
    
    // Récupérer une copie de selectedValue
    const updatedSelectedValue = { ...selectedValue };
  
    // Récupérer une copie de 
    const updatedTypeCentre = [...updatedSelectedValue.typeCentre];
  
    // Modifier  en fonction de la case à cocher
    if (isChecked) {
      updatedTypeCentre.push(value);
    } else {
      const index = updatedTypeCentre.indexOf(value);
      if (index !== -1) {
        updatedTypeCentre.splice(index, 1);
      }
    }
  
    // Mettre à jour selectedValue avec la nouvelle 
    updatedSelectedValue.typeCentre = updatedTypeCentre;
  
    // Mettre à jour l'état
    setselectedValue(updatedSelectedValue);
  };*/}
   
  const handleCheckboxChangeTC = (event, value) => {
    const isChecked = event.target.checked;
    
    // Récupérer une copie de selectedValue
    const updatedSelectedValue = { ...selectedValue };
    
    // Déterminer si nous sommes dans le cas d'ajout ou de modification
    const isAdding = !selectedValue.typeCentre;
    const isStringTC = typeof selectedValue.typeCentre === 'string';
    
    // Récupérer une copie de typeCentre
    let updatedTypeCentre = [];
    
    if (isAdding || !isStringTC) {
      // Ajout : typeCentre n'est pas encore initialisé ou est un tableau
      updatedTypeCentre = isAdding ? [] : [...selectedValue.typeCentre];
    } else {
      // Modification : typeCentre est une chaîne de caractères
      const trimmedTC = selectedValue.typeCentre.trim();
      
      if (trimmedTC !== '') {
        // Supprimer les crochets `[ ]` et les guillemets `" "`
        updatedTypeCentre = trimmedTC.replace(/[\[\]"]/g, '').split(',');
      }
    }
    
    // Modifier en fonction de la case à cocher
    if (isChecked) {
      // Ajouter la valeur au typeCentre
      updatedTypeCentre.push(value);
    } else {
      // Supprimer la valeur du typeCentre si elle est cochée
      updatedTypeCentre = updatedTypeCentre.filter(tc => tc.trim() !== value.trim());
    }
  
    // Mettre à jour les typesCentre déjà présents dans selectedValue
    if (selectedValue.typeCentre && Array.isArray(selectedValue.typeCentre)) {
      const existingTC = selectedValue.typeCentre.filter(tc => !updatedTypeCentre.includes(tc));
      updatedTypeCentre = updatedTypeCentre.concat(existingTC);
    }
  
    // Mettre à jour selectedValue avec la nouvelle valeur de typeCentre
    updatedSelectedValue.typeCentre = updatedTypeCentre.length > 0 ? updatedTypeCentre.join(',') : null;
    
    // Mettre à jour l'état
    setselectedValue(updatedSelectedValue);
   // console.log(updatedSelectedValue.typeCentre);
  };




  const handleCheckboxChangeDomaine = (event, value) => {
    const isChecked = event.target.checked;
    
    // Récupérer une copie de selectedValue
    const updatedSelectedValue = { ...selectedValue };
    
    // Déterminer si nous sommes dans le cas d'ajout ou de modification
    const isAdding = !selectedValue.domaine;
    const isStringDomaine = typeof selectedValue.domaine === 'string';
    
    // Récupérer une copie de domaine
    let updatedDomaine = [];
    
    if (isAdding || !isStringDomaine) {
      // Ajout : domaine n'est pas encore initialisé ou est un tableau
      updatedDomaine = isAdding ? [] : [...selectedValue.domaine];
    } else {
      // Modification : domaine est une chaîne de caractères
      const trimmedDomaine = selectedValue.domaine.trim();
      
      if (trimmedDomaine !== '') {
        // Supprimer les crochets `[ ]` et les guillemets `" "`
        updatedDomaine = trimmedDomaine.replace(/[\[\]"]/g, '').split(',');
      }
    }
    
    // Modifier en fonction de la case à cocher
    if (isChecked) {
      // Ajouter la valeur au domaine
      updatedDomaine.push(value);
    } else {
      // Supprimer la valeur du domaine si elle est cochée
      updatedDomaine = updatedDomaine.filter(domain => domain.trim() !== value.trim());
    }
  
    // Mettre à jour les domaines déjà présents dans selectedValue
    if (selectedValue.domaine && Array.isArray(selectedValue.domaine)) {
      const existingDomains = selectedValue.domaine.filter(domain => !updatedDomaine.includes(domain));
      updatedDomaine = updatedDomaine.concat(existingDomains);
    }
  
    // Mettre à jour selectedValue avec la nouvelle valeur de domaine
    updatedSelectedValue.domaine = updatedDomaine.length > 0 ? updatedDomaine.join(',') : null;
    
    // Mettre à jour l'état
    setselectedValue(updatedSelectedValue);
    //console.log(updatedSelectedValue.domaine);
  };



  const handleCheckboxChangeContribution = (index,event, value) => {
    // Récupérer une copie de selectedValue
    const updatedSelectedValue = { ...selectedValue };
    const isChecked = event.target.checked;
    // Récupérer une copie de la liste des partenaires
    const updatedPartenaires = [...updatedSelectedValue.partenaires];
    let updatedContribution = [];
    // Vérifier si le partenaire à l'index spécifié existe
    if (updatedPartenaires[index]) {
      
      // Déterminer si nous sommes dans le cas d'ajout ou de modification
      const isAdding = !selectedValue.partenaires[index]?.contribution;
      const isStringTC = typeof selectedValue.partenaires[index]?.contribution === 'string';
      
      // Récupérer une copie de typeCentre
      
      
      if (isAdding || !isStringTC) {
        // Ajout : typeCentre n'est pas encore initialisé ou est un tableau
        updatedContribution = isAdding ? [] : [...selectedValue.partenaires[index]?.contribution];
      } else {
        // Modification : typeCentre est une chaîne de caractères
        const trimmedTC = selectedValue.partenaires[index]?.contribution.trim();
        
        if (trimmedTC !== '') {
          // Supprimer les crochets `[ ]` et les guillemets `" "`
          updatedContribution = trimmedTC.replace(/[\[\]"]/g, '').split(',');
        }
      }
    
      // Modifier en fonction de la case à cocher
      if (isChecked) {
        // Ajouter la valeur au typeCentre
        updatedContribution.push(value);
      } else {
        // Supprimer la valeur du typeCentre si elle est cochée
        updatedContribution = updatedContribution.filter(tc => tc.trim() !== value.trim());
      }
    
      // Mettre à jour les typesCentre déjà présents dans selectedValue
      if (selectedValue.partenaires[index]?.contribution && Array.isArray(selectedValue.partenaires[index]?.contribution)) {
        const existingTC = selectedValue.partenaires[index].contribution.filter(tc => !updatedContribution.includes(tc));
        updatedContribution = updatedContribution.concat(existingTC);
      }
    
      // Mettre à jour selectedValue avec la nouvelle valeur de typeCentre
      updatedSelectedValue.partenaires[index].contribution = updatedContribution.length > 0 ? updatedContribution.join(',') : null;
      
      // Mettre à jour l'état
      setselectedValue(updatedSelectedValue);}

     else {
      //console.log("nv");
    const updatedPartenaires = [...partenaires];
    const updatedContribution = [...updatedPartenaires[index].contribution];
    const isChecked = updatedContribution.includes(value);

    if (isChecked) {
      const valueIndex = updatedContribution.indexOf(value);
      if (valueIndex !== -1) {
        updatedContribution.splice(valueIndex, 1);
      }
    } else {
      updatedContribution.push(value);
    }

    updatedPartenaires[index].contribution = updatedContribution;
    setpartenaires(updatedPartenaires);
    // console.log(updatedPartenaires);
    }
  
      
      //console.log(updatedSelectedValue.partenaires[index].contribution);
    };


   

  {/*const handleCheckboxChangeContrib = (event, value) => {
    const isChecked = event.target.checked;
    
    // Récupérer une copie de selectedValue
    const updatedSelectedValue = { ...selectedValue };
  
    // Récupérer une copie de 
    const updatedContrib = [...updatedSelectedValue.contribEn];
  
    // Modifier  en fonction de la case à cocher
    if (isChecked) {
      updatedContrib.push(value);
    } else {
      const index = updatedContrib.indexOf(value);
      if (index !== -1) {
        updatedContrib.splice(index, 1);
      }
    }
  
    // Mettre à jour selectedValue avec la nouvelle 
    updatedSelectedValue.contribEn = updatedContrib;
  
    // Mettre à jour l'état
    setselectedValue(updatedSelectedValue);
  };*/}


  {/*useEffect(() => {
    if (selectedValue.contribEn && typeof selectedValue.contribEn === 'string') {
      const trimmedContribEn = selectedValue.contribEn.trim();
      if (trimmedContribEn !== '') {
        const contribEnArray = trimmedContribEn.split(','); // Si contribEn est séparé par des virgules
        contribEnArray.forEach(value => {
          const checkbox = document.getElementById(`contrib${value}`);
          if (checkbox) {
            checkbox.checked = true;
          }
        });
      }
    }
  }, [selectedValue.contribEn]);*/}
  
  // Gestion de la modification des cases à cocher
  const handleCheckboxChangeContrib = (event, value) => {
    const isChecked = event.target.checked;
    
    // Récupérer une copie de selectedValue
    const updatedSelectedValue = { ...selectedValue };
    
    // Déterminer si nous sommes dans le cas d'ajout ou de modification
    const isAdding = !selectedValue.contribEn;
    const isStringContribEn = typeof selectedValue.contribEn === 'string';
    
    // Récupérer une copie de contribEn
    let updatedContribEn = [];
    
    if (isAdding || !isStringContribEn) {
      // Ajout : contribEn n'est pas encore initialisé ou est un tableau
      updatedContribEn = isAdding ? [] : [...selectedValue.contribEn];
    } else {
      // Modification : contribEn est une chaîne de caractères
      const trimmedContribEn = selectedValue.contribEn.trim();
      
      if (trimmedContribEn !== '') {
        // Supprimer les crochets `[ ]` et les guillemets `" "`
        updatedContribEn = trimmedContribEn.replace(/[\[\]"]/g, '').split(',');
      }
    }
    
    // Modifier en fonction de la case à cocher
    if (isChecked) {
      // Ajouter la valeur à contribEn
      updatedContribEn.push(value);
    } else {
      // Supprimer la valeur de contribEn si elle est cochée
      updatedContribEn = updatedContribEn.filter(contrib => contrib.trim() !== value.trim());
    }
  
    // Mettre à jour les contributions déjà présentes dans selectedValue
    if (selectedValue.contribEn && Array.isArray(selectedValue.contribEn)) {
      const existingContribs = selectedValue.contribEn.filter(contrib => !updatedContribEn.includes(contrib));
      updatedContribEn = updatedContribEn.concat(existingContribs);
    }
  
    // Mettre à jour selectedValue avec la nouvelle valeur de contribEn
    updatedSelectedValue.contribEn = updatedContribEn.length > 0 ? updatedContribEn.join(',') : null;
    
    // Mettre à jour l'état
    setselectedValue(updatedSelectedValue);
    //console.log(updatedSelectedValue.contribEn);
  };

  

  // Gérer le changement de la valeur du champ dateSignature
  const handleChangeDateSignature = (event) => {
    const newDateSignature = event.target.value;
    setDateSignature(newDateSignature);
  };
  const handleChangeDate_lancement = (event) => {
    setDate_lancement(event.target.value);
  };
  const handleChangeDate_achevement = (event) => {
    setdate_achevement(event.target.value);
  };
  const [comboBoxOpen, setComboBoxOpen] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [typeOfSubmit, settypeOfSubmit] = useState("create");
  const token = getCookie('token'); 
  const headers = {
    Authorization: `Bearer ${token}`
  };

  const [partenaires, setpartenaires] = useState([{partenaire: '', tel: '' ,fax:'',type:'',soustype:'',adresse: '',email: '',web: '',contribution: '',estimContribFinanc: ''}]);
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
selectedValue.partenaires
    if(selectedValue.partenaires[index]){
    setselectedValue(prevSelectedValue => {
      const updatedPartenaires = [...prevSelectedValue.partenaires];
      updatedPartenaires[index][name] = value;
      return {
        ...prevSelectedValue,
        partenaires: updatedPartenaires
      };
    });}
    else{
      const list = [...partenaires];
      list[index][name] = value;
      setpartenaires(list);
    }
  };
  const handleInputChanges = (index, selectedOption) => {
    const list = [...partenaires];
    list[index]['contribution'] = selectedOption;
    setpartenaires(list);
};
  const handleRemoveClick = (index) => {
    if (selectedValue.partenaires[index]) {
      setselectedValue(prevSelectedValue => {
          const updatedPartenaires = [...prevSelectedValue.partenaires];
          updatedPartenaires.splice(index, 1);
          return {
              ...prevSelectedValue,
              partenaires: updatedPartenaires
          };
      });
  } else {
      const list = [...partenaires];
      list.splice(index, 1);
      setpartenaires(list);
  }
  };
  
  const handleAddClick = () => {
    //setpartenaires([...partenaires, { partenaire: '', tel: '' ,fax:'',type:'',soustype:'',adresse: '',email: '',web: '',contribution: '',estimContribFinanc: ''}]);
    const newPartenaire = { partenaire: '', tel: '', fax: '', type: '', soustype: '', adresse: '', email: '', web: '', contribution: '', estimContribFinanc: '' };

    if (selectedValue.partenaires.length > 0) {
        setselectedValue(prevSelectedValue => {
            const updatedPartenaires = [...prevSelectedValue.partenaires, newPartenaire];
            return {
                ...prevSelectedValue,
                partenaires: updatedPartenaires
            };
        });
    } else {
        setpartenaires([...partenaires, newPartenaire]);
    }
  };


  useEffect(() => {
    // Vérifier si la fenêtre modale supplémentaire doit être ouverte automatiquement lors de la modification
    if (selectedValue.partenaires.length > 1) {
      setpartenaires(selectedValue.partenaires)}
    if (selectedValue.partenaires.length > 2) {
        setpartenaires(selectedValue.partenaires)}
    
    if (selectedValue.partenaires.length > 3) {
      setpartenaires(selectedValue.partenaires)}

    if (selectedValue.partenaires.length > 4) {
        setpartenaires(selectedValue.partenaires)}
    if (selectedValue.partenaires.length > 5) {
          setpartenaires(selectedValue.partenaires)}
    if (selectedValue.partenaires.length > 6) {
            setpartenaires(selectedValue.partenaires)}
      // Ouvrir la fenêtre modale supplémentaire ici
      // Vous devrez utiliser le code pour afficher la fenêtre modale appropriée
      // Par exemple, vous pouvez utiliser une fonction pour mettre à jour l'état pour afficher la fenêtre modale
      // setModalOpen(true);
    
  }, [selectedValue]);

  useEffect(() => {
    // Met à jour l'état de la case à cocher lorsque selectedValue.programmeINDH change
    if (selectedValue.programme_INDH !== null) {
      setIndhPartenaire(true);
    } 
  }, [selectedValue]);

  const actionButtonStyle = {
    backgroundColor: '#f2f2f2', // Gris clair
      color: '#333', // Texte en gris foncé
      padding: '6px 12px', // Petit rembourrage
      borderRadius: '3px', // Coins arrondis
      border: 'none', // Pas de bordure
      cursor: 'pointer',
      margin: '0 4px',
      transition: 'background-color 0.3s, color 0.3s',
  };
  const dataToShow = [
    
    
    {
      accessorKey: "partenariatName",
      header: "Nom de partenariat",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("partenariatName")}</div>
      ),
    },
    
    {
      accessorKey: "numero",
      header: "Numero",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("numero")}</div>
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
      accessorKey: "delegation",
      header: "Délégation",
      cell: ({ row }) => (
        <div>
          {row.original.delegations.map((item, index) => (
            <div key={index} className="capitalize">{item.delegation}</div>
          ))}
        </div>
      ),
    },,


  
  
   
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const selected = row.original;

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
                  
                 
                   // Récupération de l'ID de l'employé
                   const partenariatId = row.original.id;
                   
                   //console.log(selectedValue);
                  setIsOpen(true);
                  settypeOfSubmit("update");
                  //console.log(row.original.domaine);
                }}
                
              >
                Mettre à jour cette ligne

              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setselectedValue(row.original);
                 // console.log(selectedValue.id);
                  setModelDeleteIsOpen(true);
                }}
              >
                Supprimer cette ligne
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setselectedValue(row.original);
                 // console.log(selectedValue.id);
                  setModelAttachmentIsOpen(true);
                }}
              >
                Ajouter des Pièces jointes
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setselectedValue(row.original);
                 // console.log(selectedValue.id);
                  setModelSuiviIsOpen(true);
                }}
              >
                Suivi
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const { toast } = useToast()
  
  var idMap = {
    'option1': 1,
    'option2': 2,
    'option3': 3,
    'option4': 4,
    'option5': 5,
    'option6': 6,
    // Ajoutez d'autres correspondances au besoin
};
  //use query to get data from the server
  const { data, refetch } = useQuery({
    queryKey: ['partenaires'],
    queryFn: getPartenaires(),
  });
 
  
 
  //console.log(userData)
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // Filtrer les données en fonction du rôle de l'utilisateur lorsqu'il change
    const filtered = filterDataByRole(part || [], userData);
    setFilteredData(filtered);
  }, [part, userData]);

  // Fonction pour filtrer les données en fonction du rôle de l'utilisateur
  const filterDataByRole = (data, userData) => {
    if (userData?.roles === "DELEGUE_ROLES") {
      // Filtrer les données où la colonne "delegation" est égale à "user.delegation"
      return data.filter(item => item.delegations && item.delegations.some(delegation => delegation.delegation === userData.delegation));
    } else if (userData?.roles === "COORDINATEUR_ROLES") {
      // Filtrer les données en fonction de la colonne "coordination"
      // Remplacez "user.coordination" par la propriété correcte de l'utilisateur
      return data.filter(item => item.coordination === userData.coordination);
    } else {
      // Si le rôle de l'utilisateur n'est pas défini, retourner toutes les données
      return data;
    }
  };

  const roles = [
    
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
   
  ];
  const [selectedTypePartenaire, setSelectedTypePartenaire] = useState('');
  const [selectedSubTypePartenaire, setSelectedSubTypePartenaire] = useState('');
  const [showSubTypeDropdown, setShowSubTypeDropdown] = useState(false);

 {/* const handleTypePartenaireChange = (index, type) => {
    setSelectedTypePartenaire(type);
    // Vérifier si le type sélectionné est "Collectivité territoriale"
    if (type === "Collectivité territoriale") {
      // Afficher le deuxième menu déroulant
      setShowSubTypeDropdown(true);
    } else {
      // Cacher le deuxième menu déroulant si un autre type est sélectionné
      setShowSubTypeDropdown(false);
    }
  };*/}

  const handleSubTypeChange = (index,subtype) => {
    setSelectedSubTypePartenaire(subtype);
    if (selectedValue.partenaires[index]) {
      // Mise à jour d'un partenaire existant
      setselectedValue(prevSelectedValue => {
        const updatedPartenaires = [...prevSelectedValue.partenaires];
        updatedPartenaires[index].soustype = subtype;
        return {
          ...prevSelectedValue,
          partenaires: updatedPartenaires
        };
      });
    } else {
      // Ajout d'un nouveau partenaire
      const updatedpartenaires = [...partenaires]; // Créez une copie de la liste des partenaires
        updatedpartenaires[index].soustype = subtype; // Mettez à jour le type du partenaire à l'index spécifié
        setpartenaires(updatedpartenaires);
    }
  };
  const partenairesAvecContributionJSON = partenaires.map(partenaire => {
    return {
      ...partenaire,
      contribution: JSON.stringify(partenaire.contribution)
    };
  
  });
  const partenairesAvecContributionJSONN = selectedValue.partenaires.map(partenaire => {
    // Vérifier si la contribution est un tableau
    if (Array.isArray(partenaire.contribution)) {
      // Filtrer les éléments du tableau selon un critère spécifique, par exemple leur longueur
      partenaire.contribution = partenaire.contribution.filter(mot => mot.length !== 1);
     // console.log(partenaire.contribution);
    }
    
    // Convertir la contribution en JSON
   // partenaire.contribution = JSON.stringify(partenaire.contribution);
   // console.log(partenaire.contribution);
    // Retourner le partenaire mis à jour
    return {
      ...partenaire,
      contribution: JSON.stringify(partenaire.contribution)
    };
  });
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (typeOfSubmit === "create" ) {
     // console.log("create");
      try{
        const parsedSelectedValue = {
          ...selectedValue,
          numero: selectedValue.numero || '', 
          partenariatName:selectedValue.partenariatName,
          idDelegations:  userData?.roles === "DELEGUE_ROLES"  ? [idDelegation]: selectedOptions.map(option => parseInt(option.value)),
          coordination: selectedValue.coordination,
          domaine: (selectedValue.domaine),
          id: parseFloat(selectedValue.id),
           // Si som est un nombre à virgule flottante
           typeCentre:(selectedValue.typeCentre),
           dureepartenariat: selectedValue.dureepartenariat,
           type: selectedValue.type,
           
           signataire: selectedValue.signataire, 
           indh:selectedValue.indh,
           programme_INDH: selectedValue.programme_INDH,
           contribEn: (selectedValue.contribEn),
           estimatioFinancier:(selectedValue.estimatioFinancier),
           montant_global:(selectedValue.montant_global),
           dateSignature:selectedValue.dateSignature,
           date_achevement:" ",
           //convertToISO(new Date(date_achevement)),
           date_lancement:selectedValue.date_lancement,
           populationCible:(selectedValue.populationCible),
           idcibles:[],
           partenaires: partenairesAvecContributionJSON,
           
           }  

           
        
  
       // console.log('Données envoyées au serveur:', parsedSelectedValue); 
        const response = await api.post("/part/create", parsedSelectedValue, {
    headers: headers
         
       })
        
       repart()
        toast({
          description: <span style={{ color: 'white', fontFamily: 'Arial, sans-serif' }}>Partenariat créé avec succès ✔️</span>,
          className: "bg-green-500 text-white", // Fond vert, texte blanc
          duration: 2000,
          title: "Succès",
      })
      setIsOpen(false);
      window.location.reload()
        
    }catch{
        toast({
          description: <span style={{ color: 'white', fontFamily: 'Arial, sans-serif' }}>Échec d&apos;ajout d&apos;un partenariat ❌</span>,
          variant: "destructive",
          duration: 2000,
          title: "Erreur",
      })}
      
    
        
    
    }
    else if (typeOfSubmit === "update" ) {
      
      if (Array.isArray(selectedValue.domaine)) {
        selectedValue.domaine = JSON.stringify(selectedValue.domaine.filter(mot => mot.length !== 1));
       
      }
      if (Array.isArray(selectedValue.typeCentre)) {
        selectedValue.typeCentre = JSON.stringify(selectedValue.typeCentre.filter(mot => mot.length !== 1));
       
      }
      if (Array.isArray(selectedValue.contribEn)) {
        selectedValue.contribEn = JSON.stringify(selectedValue.contribEn.filter(mot => mot.length !== 1));
       
      }
      //if (Array.isArray(selectedValue.populationCible)) {
      //  selectedValue.populationCible = JSON.stringify(selectedValue.populationCible.filter(mot => mot.length !== 1));
       
     // }
   
   
      try {
        
        const parsedSelectedValue = {
          ...selectedValue,
         
          numero: selectedValue.numero || '', 
          partenariatName:selectedValue.partenariatName,
          idDelegations: selectedOptions.map(option => parseInt(option.value)),
          coordination: selectedValue.coordination,
          
          domaine: (selectedValue.domaine),
          id: parseFloat(selectedValue.id),
           // Si som est un nombre à virgule flottante
           typeCentre:(selectedValue.typeCentre),
           dureepartenariat: selectedValue.dureepartenariat,
           type: selectedValue.type,
           
           signataire: selectedValue.signataire, 
           indh: selectedValue.indh,
           programme_INDH: selectedValue.programme_INDH,
           contribEn: (selectedValue.contribEn),
           estimatioFinancier:(selectedValue.estimatioFinancier),
           montant_global:(selectedValue.montant_global),
           dateSignature:selectedValue.dateSignature,
           date_achevement:" ",
           //convertToISO(new Date(date_achevement)),
           date_lancement:selectedValue.date_lancement,
           populationCible:(selectedValue.populationCible),
           
           partenaires: partenairesAvecContributionJSONN,
           //partenairesAvecContributionJSONN,
           
           
          
        };
        
       console.log('Données envoyées au serveur:', parsedSelectedValue);
       // console.log(selectedValue);
       const response = await api.put("/part/update/"+ selectedValue.id, 
        parsedSelectedValue, {
            headers: headers
                 
               })
          
        
         repart()
       
       toast({
        description: <span style={{ color: 'white', fontFamily: 'Arial, sans-serif' }}>Partenariat mis à jour avec succès ✔️</span>,
        className: "bg-green-500 text-white", // Fond vert, texte blanc
        duration: 2000,
        title: "Succès",
    })
        setIsOpen(false);
      } catch (e) {
        toast({
          description: <span style={{ color: 'white', fontFamily: 'Arial, sans-serif' }}>Échec de la mise à jour du partenariat ❌</span>,
          variant: "destructive",
          duration: 2000,
          title: "Erreur",
      })
      }
    }
  }
  
  return (
    <div className="px-6 py-4" id="Partenaires">
      <DeleteModal
        closeModal={() => setModelDeleteIsOpen(false)}
        modalIsOpen={modelDeleteIsOpen}
        selectedValue={selectedValue}
        refetch={part}
        toast={toast}
      />
      <AttachmentModal
       
       isOpen={modelAttachmentIsOpen}
       closeModal={() => setModelAttachmentIsOpen(false)}
       selectedValue={selectedValue}
       refetch={refetch}
       toast={toast}
      
       idpart ={selectedValue.id} 
     />
      <SuiviModal
       
        isOpen={modelSuiviIsOpen}
        closeModal={() => setModelSuiviIsOpen(false)}
        selectedValue={selectedValue}
        refetch={refetch}
        toast={toast}
        partenariatId ={selectedValue.id} 
      />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
       
        contentLabel="Example Modal"
      >
        <form class="max-w-full mx-auto  py-6 bg-white shadow-md rounded-md" onSubmit={handleSubmit}>
          <h2 className="text-lg font-semibold mb-4 px-6">
            {typeOfSubmit === "create"
              ? "Ajouter un nouveau partenariat"
              : " Mettre à jour le partenariat actuel"}
          </h2>
          <fieldset style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', marginBottom: '20px' }}>
          <div style={{ textAlign: 'center' ,backgroundColor: '#f0f0f0', padding: '10px', marginBottom: '10px' }}>
             <legend style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>Informations Générales</legend>
         </div>
          <div className=" px-6  mb-4">
            <label className="block mb-1" for="numero">
            Numéro de la convention ou de l&apos;avenant
            </label>
            <input
              className="w-full border rounded-md px-3 py-2"
              type="text"
              id="numero"
              placeholder="Numéro de la convention"
              value={selectedValue?.numero || ""}
              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  numero: e.target.value,
                });
              }}
              
            />
          </div>
          <div className=" px-6  mb-4">
            <label className="block mb-1" for="partenariatName">
            Intitulé du partenariat
            </label>
            <input
              className="w-full border rounded-md px-3 py-2"
              type="text"
              id="partenariatName"
              placeholder="Intitulé du partenariat"
              value={selectedValue?.partenariatName || ""}
              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  partenariatName: e.target.value,
                });
              }}
              required
            />
          </div>
          <div className=" px-6  mb-4">
            <label className="block mb-1" for="coordination">
             Coordination
            </label>
            {userData?.roles !== "DELEGUE_ROLES" && userData?.roles !== "COORDINATEUR_ROLES" ? (
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
          ) : (
            <input
                type="text"
                id="coordination"
                name="coordination"
                value={selectedValue.coordination}
                readOnly
                className="w-full border rounded-md px-3 py-2"
            />
        )}
          </div>

          
          <div className="px-6 mb-4 flex flex-col w-full">
      <label className="block mb-1" htmlFor="delegation">
        Délégation
      </label>
      {userData?.roles !== "DELEGUE_ROLES"? (
      <Multiselect
        options={(refetchh || []).filter(item => item.coordination === selectedValue?.coordination).map(item => ({
          value: item.id.toString(),
          label: item.delegation,
        }))}
        selectedValues={selectedOptions}
        onSelect={handleSelect}
        onRemove={handleSelect}
        displayValue="label"
        placeholder="Sélectionner une ou plusieurs délégations"
      />
      ) : (
        <input
            type="text"
            id="delegation"
            name="delegation"
            value={userData.delegation}
            readOnly
            className="w-full border rounded-md px-3 py-2"
        />
    )}
    </div>
    <div className=" px-6  mb-4">
            <label className="block mb-1" for="type">
            Type du partenariat
            </label>
            <DropdownMenu>
               <DropdownMenuTrigger>
                  <button className="w-full border rounded-md px-3 py-2 text-left">
                     {selectedValue?.type || "Sélectionner le type de convention"}
                  </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="origin-top-right right-0">
                   <DropdownMenuItem onSelect={(e) => {
                       setselectedValue({
                        ...selectedValue,
                        type: e.target.textContent,
                             });
                        }}>
                          Cadre
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                      setselectedValue({
                     ...selectedValue,
                     type: e.target.textContent,
                          });
                            }}>
                          Convention spécifique
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                          setselectedValue({
                          ...selectedValue,
                          type: e.target.textContent,
                            });
                            }}>
                         Avenant
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                        setselectedValue({
                        ...selectedValue,
                        type: e.target.textContent,
                          });
                                 }}>
                          Charte
                   </DropdownMenuItem>
                 
                   
                </DropdownMenuContent>
          </DropdownMenu>
          </div>
          
          
          <div className=" px-6  mb-4">
            <label className="block mb-1" for="dureepartenariat">
            Durée du partenariat
            </label>
            <input
              className="w-full border rounded-md px-3 py-2"
              type="number"
              id="dureepartenariat"
              placeholder="Durée du partenariat"
              value={selectedValue?.dureepartenariat || ""}
              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  dureepartenariat: e.target.value,
                });
              }}
              required
            />
          </div>
          <div className="px-6 mb-4">
      <label className="block mb-1" htmlFor="dateSignature">
        Date de signature
      </label>
      {/* Champ de date */}
      <input
        className="w-full border rounded-md px-3 py-2"
        type="text"
        id="dateSignature"
        placeholder="format JJ/MM/AAAA"
        value={selectedValue?.dateSignature || ""}
              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  dateSignature: e.target.value,
                });
              }}
              required
      />
    </div>
    <div className="px-6 mb-4">
      <label className="block mb-1" htmlFor="date_lancement">
        Date de début du partenariat
      </label>
      {/* Champ de date */}
      <input
        className="w-full border rounded-md px-3 py-2"
        type="text"
        id="date_lancement"
        placeholder="format JJ/MM/AAAA"
        value={selectedValue?.date_lancement || ""}
              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  date_lancement: e.target.value,
                });
              }}
              required
      />
    </div>
  {/*  <div className="px-6 mb-4">
      <label className="block mb-1" htmlFor="date_achevement">
        Date de fin du partenariat
      </label>
      <input
        className="w-full border rounded-md px-3 py-2"
        type="text"
        id="date_achevement"
        placeholder="format JJ/MM/AAAA"
        value={selectedValue?.date_achevement || ""}
              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  date_achevement: e.target.value,
                });
              }}
              required
      />
    </div>*/}
    <div className=" px-6  mb-4">
            <label className="block mb-1" for="signataire">
            Nature de la Signature
            </label>
            <DropdownMenu>
               <DropdownMenuTrigger>
                  <button className="w-full border rounded-md px-3 py-2 text-left">
                     {selectedValue?.signataire || "Sélectionner ..."}
                  </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="origin-top-right right-0">
                   <DropdownMenuItem onSelect={(e) => {
                       setselectedValue({
                        ...selectedValue,
                        signataire: e.target.textContent,
                             });
                        }}>
                          Localement
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                      setselectedValue({
                     ...selectedValue,
                     signataire: e.target.textContent,
                          });
                            }}>
                          Par le biais d&apos;une délégation de signature de la part de l&apos;administration centrale
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                      setselectedValue({
                     ...selectedValue,
                     signataire: e.target.textContent,
                          });
                            }}>
                          Par le biais d&apos;une délégation de signature de la part de la coordination régionale
                   </DropdownMenuItem>
                 
                   
                </DropdownMenuContent>
          </DropdownMenu>
          </div>
          <div>
      {/* Case à cocher pour INDH */}
      <div className=" px-6  mb-4">
            <label className="block mb-1" for="indh">
            INDH est l&apos;un des partenaires?
            </label>
            <DropdownMenu>
               <DropdownMenuTrigger>
                  <button className="w-full border rounded-md px-3 py-2 text-left">
                     {selectedValue?.indh || "Choisissez ..."}
                  </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="origin-top-right right-0">
                   <DropdownMenuItem onSelect={(e) => {
                       setselectedValue({
                        ...selectedValue,
                        indh: e.target.textContent,
                             });
                        }}>
                          Oui
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                      setselectedValue({
                     ...selectedValue,
                     indh: e.target.textContent,
                          });
                            }}>
                          Non
                   </DropdownMenuItem>
                   
                   
                </DropdownMenuContent>
          </DropdownMenu>
                          </div>

          {selectedValue.indh === "Oui" && (
        <div>
          <label>
            Sélectionner le Programmes INDH :
            <DropdownMenu>
               <DropdownMenuTrigger>
                  <button className="w-full border rounded-md px-3 py-2 text-left">
                     {selectedValue?.programme_INDH || "Sélectionner le programme INDH"}
                  </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="origin-top-right right-0">
                   <DropdownMenuItem onSelect={(e) => {
                       setselectedValue({
                        ...selectedValue,
                        programme_INDH: e.target.textContent,
                             });
                        }}>
                          Le programme transversal
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                      setselectedValue({
                     ...selectedValue,
                     programme_INDH: e.target.textContent,
                          });
                            }}>
                          Le programme de lutte contre la précarité
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                          setselectedValue({
                          ...selectedValue,
                          programme_INDH: e.target.textContent,
                            });
                            }}>
                        Le programme de lutte contre l&apos;exclusion sociale en milieu urbain
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                        setselectedValue({
                        ...selectedValue,
                        programme_INDH: e.target.textContent,
                          });
                                 }}>
                          Le programme de lutte contre la pauvreté en milieu rural
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                        setselectedValue({
                        ...selectedValue,
                        programme_INDH: e.target.textContent,
                          });
                                 }}>
                          Mise à niveau territoriale
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                        setselectedValue({
                        ...selectedValue,
                        programme_INDH: e.target.textContent,
                          });
                                 }}>
                          Rattrapage des déficits en infrastructures et services sociaux de base
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                        setselectedValue({
                        ...selectedValue,
                        programme_INDH: e.target.textContent,
                          });
                                 }}>
                         Accompagnement des personnes en situation de précarité
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                        setselectedValue({
                        ...selectedValue,
                        programme_INDH: e.target.textContent,
                          });
                                 }}>
                        Amélioration du revenu et inclusion économique des jeunes 
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                        setselectedValue({
                        ...selectedValue,
                        programme_INDH: e.target.textContent,
                          });
                                 }}>
                        Impulsion du capital humain des générations montantes 
                   </DropdownMenuItem>
                   
                </DropdownMenuContent>
          </DropdownMenu>
          </label>
        </div>
          )}
    </div>

          </fieldset>
    <fieldset style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', marginBottom: '20px' }}>
          <div style={{ textAlign: 'center' ,backgroundColor: '#f0f0f0', padding: '10px', marginBottom: '10px' }}>
             <legend style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>Domaine de partenariat</legend>
         </div>
         <div className="px-6 mb-4">
        
        <div className="flex flex-wrap">
          <div className="w-1/2 mb-2">
            <input
              type="checkbox"
              id="Assistance sociale"
              value="Assistance sociale"
              checked={selectedValue && selectedValue.domaine && selectedValue.domaine.includes("Assistance sociale")}
              onChange={(e) => handleCheckboxChangeDomaine(e, "Assistance sociale")}
              
            />
            <label htmlFor="Assistance sociale" className="ml-2">Assistance sociale</label>
          </div>
          <div className="w-1/2 mb-2">
            <input
              type="checkbox"
              id="Aide sociale en nature"
              value="Aide sociale en nature"
              checked={selectedValue && selectedValue.domaine && selectedValue.domaine.includes("Aide sociale en nature")}
              onChange={(e) => handleCheckboxChangeDomaine(e, "Aide sociale en nature")}
            />
            <label htmlFor="Aide sociale en nature" className="ml-2">Aide sociale en nature</label>
          </div>
          <div className="w-1/2 mb-2">
            <input
              type="checkbox"
              id="Formation au profit des personnes en situation difficile"
              value="Formation au profit des personnes en situation difficile"
              checked={selectedValue && selectedValue.domaine && selectedValue.domaine.includes("Formation au profit des personnes en situation difficile")}
              onChange={(e) => handleCheckboxChangeDomaine(e, "Formation au profit des personnes en situation difficile")}
            />
            <label htmlFor="Formation au profit des personnes en situation difficile" className="ml-2">Formation au profit des personnes en situation difficile</label>
          </div>
        
          {/*<div className="w-1/2 mb-2">
            <input
              type="checkbox"
              id="domaine5"
              value="domaine5"
              checked={selectedValue && selectedValue.domaine && selectedValue.domaine.includes("domaine5")}
              onChange={(e) => handleCheckboxChangeDomaine(e, "domaine5")}
            />
            <label htmlFor="domaine5" className="ml-2">Contribution au soutien et à la gestion des centres et des structures sociales</label>
                                </div>*/}
         
          <div className="w-1/2 mb-2">
            <input
              type="checkbox"
              id="Intégration sociale et économique des personnes en situation difficile"
              value="Intégration sociale et économique des personnes en situation difficile"
              checked={selectedValue && selectedValue.domaine && selectedValue.domaine.includes("Intégration sociale et économique des personnes en situation difficile")}
              onChange={(e) => handleCheckboxChangeDomaine(e, "Intégration sociale et économique des personnes en situation difficile")}
            />
            <label htmlFor="Intégration sociale et économique des personnes en situation difficile" className="ml-2">Intégration sociale et économique des personnes en situation difficile</label>
          </div>
         
          

          <div className="w-1/2 mb-2">
            <input
              type="checkbox"
              id="Appui aux centres; établissements et espaces sociaux"
              value="Appui aux centres; établissements et espaces sociaux"
              checked={selectedValue && selectedValue.domaine && selectedValue.domaine.includes("Appui aux centres; établissements et espaces sociaux")}
              onChange={(e) => handleCheckboxChangeDomaine(e, "Appui aux centres; établissements et espaces sociaux")}
            />
            <label htmlFor="Appui aux centres; établissements et espaces sociaux" className="ml-2">Appui aux centres, établissements et espaces sociaux</label>
          </div>
        </div>
      </div>
      </fieldset>
     {/* <div className=" px-6  mb-4">
            <label className="block mb-1" for="anneeFin">
            Au titre de l'exercice financier
            </label>
            <DropdownMenu>
               <DropdownMenuTrigger>
                  <button className="w-full border rounded-md px-3 py-2 text-left">
                     {selectedValue?.anneeFin || "Sélectionner ..."}
                  </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="origin-top-right right-0">
                   <DropdownMenuItem onSelect={(e) => {
                       setselectedValue({
                        ...selectedValue,
                        anneeFin: e.target.textContent,
                             });
                        }}>
                          Oui
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                      setselectedValue({
                     ...selectedValue,
                     anneeFin: e.target.textContent,
                          });
                            }}>
                          Non
                   </DropdownMenuItem>
                   
                   
                 
                   
                </DropdownMenuContent>
          </DropdownMenu>
                          </div>*/}



<fieldset style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', marginBottom: '20px' }}>
          <div style={{ textAlign: 'center' ,backgroundColor: '#f0f0f0', padding: '10px', marginBottom: '10px' }}>
             <legend style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>Type de centre/Programme</legend>
         </div>


          <div className="px-6 mb-4">
 
  <div className="flex flex-wrap">
    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Centre d'Éducation et de Formation (CEF)"
        value="Centre d'Éducation et de Formation (CEF)"
        checked={selectedValue && selectedValue.typeCentre && selectedValue.typeCentre.includes("Centre d'Éducation et de Formation (CEF)")}
        onChange={(e) => handleCheckboxChangeTC(e, "Centre d'Éducation et de Formation (CEF)")}
      />
      <label htmlFor="Centre d'Éducation et de Formation (CEF)" className="ml-2">Centre d&apos;Éducation et de Formation (CEF)</label>
    </div>
    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Centre de formation par apprentissage (CFA)"
        value="Centre de formation par apprentissage (CFA)"
        checked={selectedValue && selectedValue.typeCentre && selectedValue.typeCentre.includes("Centre de formation par apprentissage (CFA)")}
        onChange={(e) => handleCheckboxChangeTC(e, "Centre de formation par apprentissage (CFA)")}
      />
      <label htmlFor="Centre de formation par apprentissage (CFA)" className="ml-2">Centre de formation par apprentissage (CFA)</label>
    </div>
    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Établissement de Protection Sociale (EPS)"
        value="Établissement de Protection Sociale (EPS)"
        checked={selectedValue && selectedValue.typeCentre && selectedValue.typeCentre.includes("Établissement de Protection Sociale (EPS)")}
        onChange={(e) => handleCheckboxChangeTC(e, "Établissement de Protection Sociale (EPS)")}
      />
      <label htmlFor="Établissement de Protection Sociale (EPS)" className="ml-2">Établissement de Protection Sociale (EPS)</label>
    </div>

    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Espace multifonctionnel pour les femmes (EMF)"
        value="Espace multifonctionnel pour les femmes (EMF)"
        checked={selectedValue && selectedValue.typeCentre && selectedValue.typeCentre.includes("Espace multifonctionnel pour les femmes (EMF)")}
        onChange={(e) => handleCheckboxChangeTC(e, "Espace multifonctionnel pour les femmes (EMF)")}
      />
      <label htmlFor="Espace multifonctionnel pour les femmes (EMF)" className="ml-2">Espace multifonctionnel pour les femmes (EMF)</label>
    </div>

    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Unité de Protection de l'Enfance (UPE)"
        value="Unité de Protection de l'Enfance (UPE)"
        checked={selectedValue && selectedValue.typeCentre && selectedValue.typeCentre.includes("Unité de Protection de l'Enfance (UPE)")}
        onChange={(e) => handleCheckboxChangeTC(e, "Unité de Protection de l'Enfance (UPE)")}
      />
      <label htmlFor="Unité de Protection de l'Enfance (UPE)" className="ml-2">Unité de Protection de l&apos;Enfance (UPE)</label>
    </div>
    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Centre d’accompagnement pour la protection de l’enfance (CAPE)"
        value="Centre d’accompagnement pour la protection de l’enfance (CAPE)"
        checked={selectedValue && selectedValue.typeCentre && selectedValue.typeCentre.includes("Centre d’accompagnement pour la protection de l’enfance (CAPE)")}
        onChange={(e) => handleCheckboxChangeTC(e, "Centre d’accompagnement pour la protection de l’enfance (CAPE)")}
      />
      <label htmlFor="Centre d’accompagnement pour la protection de l’enfance (CAPE)" className="ml-2">Centre d&apos;accompagnement pour la protection de l&apos;enfance (CAPE)</label>
    </div>

    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Centre d’orientation et d’assistance des personnes en situation de handicap (COAPH)"
        value="Centre d’orientation et d’assistance des personnes en situation de handicap (COAPH)"
        checked={selectedValue && selectedValue.typeCentre && selectedValue.typeCentre.includes("Centre d’orientation et d’assistance des personnes en situation de handicap (COAPH)")}
        onChange={(e) => handleCheckboxChangeTC(e, "Centre d’orientation et d’assistance des personnes en situation de handicap (COAPH)")}
      />
      <label htmlFor="Centre d’orientation et d’assistance des personnes en situation de handicap (COAPH)" className="ml-2">Centre d&apos;orientation et d&apos;assistance des personnes en situation de handicap (COAPH)</label>
    </div>

    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Centre pour Personnes Âgées (CPA)"
        value="Centre pour Personnes Âgées (CPA)"
        checked={selectedValue && selectedValue.typeCentre && selectedValue.typeCentre.includes("Centre pour Personnes Âgées (CPA)")}
        onChange={(e) => handleCheckboxChangeTC(e, "Centre pour Personnes Âgées (CPA)")}
      />
      <label htmlFor="Centre pour Personnes Âgées (CPA)" className="ml-2">Centre pour Personnes Âgées (CPA)</label>
    </div>


    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Garderie"
        value="Garderie"
        checked={selectedValue && selectedValue.typeCentre && selectedValue.typeCentre.includes("Garderie")}
        onChange={(e) => handleCheckboxChangeTC(e, "Garderie")}
      />
      <label htmlFor="Garderie" className="ml-2">Garderie (G)</label>
    </div>

    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Maison du Citoyen(DAM)"
        value="Maison du Citoyen(DAM)"
        checked={selectedValue && selectedValue.typeCentre && selectedValue.typeCentre.includes("Maison du Citoyen(DAM)")}
        onChange={(e) => handleCheckboxChangeTC(e, "Maison du Citoyen(DAM)")}
      />
      <label htmlFor="Maison du Citoyen(DAM)" className="ml-2">Maison du Citoyen(DAM)</label>
    </div>

    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Centre Polyvalent(CP)"
        value="Centre Polyvalent(CP)"
        checked={selectedValue && selectedValue.typeCentre && selectedValue.typeCentre.includes("Centre Polyvalent(CP)")}
        onChange={(e) => handleCheckboxChangeTC(e, "Centre Polyvalent(CP)")}
      />
      <label htmlFor="Centre Polyvalent(CP)" className="ml-2">Centre Polyvalent (CP)</label>
    </div>
    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Centre pour Personnes en Situation de Handicap (CPSH)"
        value="Centre pour Personnes en Situation de Handicap (CPSH)"
        checked={selectedValue && selectedValue.typeCentre && selectedValue.typeCentre.includes("Centre pour Personnes en Situation de Handicap (CPSH)")}
        onChange={(e) => handleCheckboxChangeTC(e, "Centre pour Personnes en Situation de Handicap (CPSH)")}
      />
      <label htmlFor="Centre pour Personnes en Situation de Handicap (CPSH)" className="ml-2">Centre pour Personnes en Situation de Handicap (CPSH)</label>
    </div>
    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Service d’assistance sociale (SAS)"
        value="Service d’assistance sociale (SAS)"
        checked={selectedValue && selectedValue.typeCentre && selectedValue.typeCentre.includes("Service d’assistance sociale (SAS)")}
        onChange={(e) => handleCheckboxChangeTC(e, "Service d’assistance sociale (SAS)")}
      />
      <label htmlFor="Service d’assistance sociale (SAS)" className="ml-2">Service d&apos;assistance sociale (SAS)</label>
    </div>
   <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Tout type de centre"
        value="Tout type de centre"
        checked={selectedValue && selectedValue.typeCentre && selectedValue.typeCentre.includes("Tout type de centre")}
        onChange={(e) => handleCheckboxChangeTC(e, "Tout type de centre")}
      />
      <label htmlFor="Tout type de centre" className="ml-2">Tout type de centre</label>
    </div>

   

    

    
    
    
  </div>
  
</div>
</fieldset>

<fieldset style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', marginBottom: '20px' }}>
          <div style={{ textAlign: 'center' ,backgroundColor: '#f0f0f0', padding: '10px', marginBottom: '10px' }}>
             <legend style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}> Population Cible</legend>
         </div>
          <div className="px-6 mb-4">
 
  <div className="flex flex-wrap">
    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Enfants en Situation Difficile"
        value="Enfants en Situation Difficile"
        checked={selectedValue && selectedValue.populationCible && selectedValue.populationCible.includes("Enfants en Situation Difficile")}
        onChange={(e) => handleCheckboxChangeP(e, "Enfants en Situation Difficile")}
      />
      <label htmlFor="Enfants en Situation Difficile" className="ml-2">Enfants en Situation Difficile</label>
    </div>
    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Femmes en Situation Difficile"
        value="Femmes en Situation Difficile"
        checked={selectedValue && selectedValue.populationCible && selectedValue.populationCible.includes("Femmes en Situation Difficile")}
        onChange={(e) => handleCheckboxChangeP(e, "Femmes en Situation Difficile")}
      />
      <label htmlFor="Femmes en Situation Difficile" className="ml-2">Femmes en Situation Difficile</label>
    </div>
    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Personnes en Situation de Handicap"
        value="Personnes en Situation de Handicap"
        checked={selectedValue && selectedValue.populationCible && selectedValue.populationCible.includes("Personnes en Situation de Handicap")}
        onChange={(e) => handleCheckboxChangeP(e, "Personnes en Situation de Handicap")}
      />
      <label htmlFor="Personnes en Situation de Handicap" className="ml-2">Personnes en Situation de Handicap</label>
    </div>
    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Personnes âgées et retraités"
        value="Personnes âgées et retraités"
        checked={selectedValue && selectedValue.populationCible && selectedValue.populationCible.includes("Personnes âgées et retraités")}
        onChange={(e) => handleCheckboxChangeP(e, "Personnes âgées et retraités")}
      />
      <label htmlFor="Personnes âgées et retraités" className="ml-2">Personnes âgées et retraités</label>
    </div>
    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Famille"
        value="Famille"
        checked={selectedValue && selectedValue.populationCible && selectedValue.populationCible.includes("Famille")}
        onChange={(e) => handleCheckboxChangeP(e, "Famille")}
      />
      <label htmlFor="Famille" className="ml-2">Famille</label>
    </div>
   {/* <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="option5"
        value="option5"
        checked={selectedValue && selectedValue.populationCible && selectedValue.populationCible.includes("option5")}
        onChange={(e) => handleCheckboxChangeP(e, "option5")}
      />
      <label htmlFor="option5" className="ml-2">Familles en difficulté</label>
    </div>*/}
    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Personnes en situation de migration"
        value="Personnes en situation de migration"
        checked={selectedValue && selectedValue.populationCible && selectedValue.populationCible.includes("Personnes en situation de migration")}
        onChange={(e) => handleCheckboxChangeP(e, "Personnes en situation de migration")}
      />
      <label htmlFor="Personnes en situation de migration" className="ml-2">Personnes en situation de migration</label>
    </div>

 <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Autre"
        value="Autre"
        checked={selectedValue && selectedValue.populationCible && selectedValue.populationCible.includes("Autre")}
        onChange={(e) => handleCheckboxChangeP(e, "Autre")}
      />
      <label htmlFor="Autre" className="ml-2">Autre</label>
    </div>

  </div>
</div>

</fieldset>
       

          


          <fieldset style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', marginTop: '50px' }}>
          <div style={{ textAlign: 'center' ,backgroundColor: '#f0f0f0', padding: '10px', marginBottom: '10px' }}>
             <legend style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>Contribution de l&apos;Entraide Nationale</legend>
         </div>
          
         



         <div className="px-6 mb-4">
 
  <div className="flex flex-wrap">
    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Suivi et accompagnement"
        value="Suivi et accompagnement"
        checked={selectedValue && selectedValue.contribEn && selectedValue.contribEn.includes("Suivi et accompagnement")}
        onChange={(e) => handleCheckboxChangeContrib(e, "Suivi et accompagnement")}
      />
      <label htmlFor="Suivi et accompagnement" className="ml-2">Suivi et accompagnement</label>
    </div>
    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Délivrance des diplômes"
        value="Délivrance des diplômes"
        checked={selectedValue && selectedValue.contribEn && selectedValue.contribEn.includes("Délivrance des diplômes")}
        onChange={(e) => handleCheckboxChangeContrib(e, "Délivrance des diplômes")}
      />
      <label htmlFor="Délivrance des diplômes" className="ml-2">Délivrance des diplômes</label>
    </div>


    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Subvention annuelle"
        value="Subvention annuelle"
        checked={selectedValue && selectedValue.contribEn && selectedValue.contribEn.includes("Subvention annuelle")}
        onChange={(e) => handleCheckboxChangeContrib(e, "Subvention annuelle")}
      />
      <label htmlFor="Subvention annuelle" className="ml-2"> Subvention annuelle</label>
    </div>

    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Appui financier"
        value="Appui financier"
        checked={selectedValue && selectedValue.contribEn && selectedValue.contribEn.includes("Appui financier")}
        onChange={(e) => handleCheckboxChangeContrib(e, "Appui financier")}
      />
      <label htmlFor="Appui financier" className="ml-2">Appui financier</label>
    </div>

    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Mettre certaines salles ou espaces à la disposition des programmes de partenariat"
        value="Mettre certaines salles ou espaces à la disposition des programmes de partenariat"
        checked={selectedValue && selectedValue.contribEn && selectedValue.contribEn.includes("Mettre certaines salles ou espaces à la disposition des programmes de partenariat")}
        onChange={(e) => handleCheckboxChangeContrib(e, "Mettre certaines salles ou espaces à la disposition des programmes de partenariat")}
      />
      <label htmlFor="Mettre certaines salles ou espaces à la disposition des programmes de partenariat" className="ml-2">Mettre certaines salles ou espaces à la disposition des programmes de partenariat</label>
    </div>
    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Equipement"
        value="Equipement"
        checked={selectedValue && selectedValue.contribEn && selectedValue.contribEn.includes("Equipement")}
        onChange={(e) => handleCheckboxChangeContrib(e, "Equipement")}
      />
      <label htmlFor="Equipement" className="ml-2">Equipement</label>
    </div>

    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Encadrement"
        value="Encadrement"
        checked={selectedValue && selectedValue.contribEn && selectedValue.contribEn.includes("Encadrement")}
        onChange={(e) => handleCheckboxChangeContrib(e, "Encadrement")}
      />
      <label htmlFor="Encadrement" className="ml-2">Encadrement</label>
    </div>

    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Cogestion"
        value="Cogestion"
        checked={selectedValue && selectedValue.contribEn && selectedValue.contribEn.includes("Cogestion")}
        onChange={(e) => handleCheckboxChangeContrib(e, "Cogestion")}
      />
      <label htmlFor="Cogestion" className="ml-2">Cogestion</label>
    </div>


    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Formation"
        value="Formation"
        checked={selectedValue && selectedValue.contribEn && selectedValue.contribEn.includes("Formation")}
        onChange={(e) => handleCheckboxChangeContrib(e, "Formation")}
      />
      <label htmlFor="Formation" className="ml-2">Formation</label>
    </div>

    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Construction"
        value="Construction"
        checked={selectedValue && selectedValue.contribEn && selectedValue.contribEn.includes("Construction")}
        onChange={(e) => handleCheckboxChangeContrib(e, "Construction")}
      />
      <label htmlFor="Construction" className="ml-2"> Construction</label>
    </div>
    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Aménagement"
        value="Aménagement"
        checked={selectedValue && selectedValue.contribEn && selectedValue.contribEn.includes("Aménagement")}
        onChange={(e) => handleCheckboxChangeContrib(e, "Aménagement")}
      />
      <label htmlFor="Aménagement" className="ml-2"> Aménagement</label>
    </div>
    <div className="w-1/2 mb-2">
      <input
        type="checkbox"
        id="Réalisation des études techniques"
        value="Réalisation des études techniques"
        checked={selectedValue && selectedValue.contribEn && selectedValue.contribEn.includes("Réalisation des études techniques")}
        onChange={(e) => handleCheckboxChangeContrib(e, "Réalisation des études techniques")}
      />
      <label htmlFor="Réalisation des études techniques" className="ml-2">Réalisation des études techniques</label>
    </div>
    
   
  </div>
</div>


          <div className=" px-6  mb-4">
            <label className="block mb-1" for="estimatioFinancier">
            Contribution financière
            </label>
            <input
              className="w-full border rounded-md px-3 py-2"
              type="number"
              id="estimatioFinancier"
              placeholder="Contribution financière"
              value={selectedValue?.estimatioFinancier || 0}
              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  estimatioFinancier: e.target.value,
                });
              }}
            />
          </div>
          </fieldset>


          <fieldset style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', marginTop: '50px' }}>
          <div style={{ textAlign: 'center' ,backgroundColor: '#f0f0f0', padding: '10px', marginBottom: '10px' }}>
             <legend style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>Montant Global</legend>
         </div>
         <div className=" px-6  mb-4">
            
            <input
              className="w-full border rounded-md px-3 py-2"
              type="number"
              id="montant_global"
              placeholder="Montant Global"
              value={selectedValue?.montant_global || 0}
              onChange={(e) => {
                setselectedValue({
                  ...selectedValue,
                  montant_global: e.target.value,
                });
              }}
              required
            />
          </div>
         </fieldset>
         <fieldset style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', marginTop: '50px' }}>
          <div style={{ textAlign: 'center' ,backgroundColor: '#f0f0f0', padding: '10px', marginBottom: '10px' }}>
             <legend style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>Partenaires</legend>
         </div>



         <div className="flex flex-wrap">
  {partenaires.map((partenaire, index) => {
    
    return (
      <div key={index} className="partenaire-container px-6 mb-4" style={{
        border: '1px solid #ccc',
        padding: '10px',
        marginRight: '10px', // Espacement entre les partenaires
        marginBottom: '10px',
        borderRadius: '5px'
      }}>
        <div className="form-group px-6 mb-4">
          <label className="block mb-1">Nom du partenaire:</label>
          <input className="w-full border rounded-md px-3 py-2"
    type="text"
    name="partenaire"
    value={selectedValue?.partenaires[index]?.partenaire} // Accès au nom du partenaire à l'index spécifié
    onChange={(event) => handleInputChange(index, event)} // Appel de la fonction handleInputChange avec l'index
    placeholder="Nom"
    required
  />
        </div>
        <div className="form-group px-6 mb-4">
          <label className="block mb-1">Type:</label>
          <DropdownMenu>
               <DropdownMenuTrigger>
                  <button className="w-full border rounded-md px-3 py-2 text-left">
                     {partenaire.type || selectedValue?.partenaires[index]?.type}
                  </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="origin-top-right right-0">
                   <DropdownMenuItem onSelect={(e) => {
                       
                        handleTypeChange(index, e.target.textContent);
                      
                        }}>
                          Initiative Nationale pour le Développement Humain
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                      handleTypeChange(index, e.target.textContent);
                            }}>
                          Ministère de la Solidarité, de l&apos;Insertion Sociale et de la Famille
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                          handleTypeChange(index, e.target.textContent);
                            }}>
                         Autre Ministère 
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                          handleTypeChange(index, e.target.textContent);
                            }}>
                         	Wilaya
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                          handleTypeChange(index, e.target.textContent);
                            }}>
                         	Province/préfecture 
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                        handleTypeChange(index, e.target.textContent);
                                 }}>
                          Etablissement public 
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                     handleTypeChange(index, e.target.textContent);
                      }}>
                     Collectivité territoriale
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => {
                       handleTypeChange(index, e.target.textContent);
                          }}>
                        Association nationale
                    </DropdownMenuItem>

                    <DropdownMenuItem onSelect={(e) => {
                       handleTypeChange(index, e.target.textContent);
                          }}>
                        Association locale
                    </DropdownMenuItem>

                    <DropdownMenuItem onSelect={(e) => {
                              handleTypeChange(index, e.target.textContent);
                             }}>
                          Coopérative
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => {
                        handleTypeChange(index, e.target.textContent);
                             }}>
                               Réseau d&apos;associations
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => {
                            handleTypeChange(index, e.target.textContent);
                                 
                                    }}>
                             Coopération internationale
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => {
                           handleTypeChange(index, e.target.textContent);
                                 }}>
                              ONG internationales
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => {
                        handleTypeChange(index, e.target.textContent);
                               }}>
                         Secteur privé
                    </DropdownMenuItem>
                </DropdownMenuContent>
          </DropdownMenu>
          </div>
          {(showSubTypeDropdown || selectedValue?.partenaires[index]?.type === "Collectivité territoriale") && (
        <div className="form-group px-6 mb-4">
          <label className="block mb-1">Précisez le type:</label>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button className="w-full border rounded-md px-3 py-2 text-left">
              {selectedSubTypePartenaire || partenaire.soustype || selectedValue?.partenaires[index]?.soustype}
              
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="origin-top-right right-0">
              <DropdownMenuItem onSelect={() => handleSubTypeChange(index,"Conseil régional")}>Conseil régional</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleSubTypeChange(index,"Conseil provincial/préfectoral")}>Conseil provincial/préfectoral</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleSubTypeChange(index,"Commune urbaine/rurale")}>Commune urbaine/rurale</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
        


        <div className="form-group px-6 mb-4">
          <label className="block mb-1">Téléphone:</label>
          <input className="w-full border rounded-md px-3 py-2"
            type="text"
            name="tel"
            value={selectedValue?.partenaires[index]?.tel}
            onChange={(event) => handleInputChange(index, event)}
            placeholder="Téléphone"
                     />
        </div>
        <div className="form-group px-6 mb-4">
          <label className="block mb-1">Fax:</label>
          <input className="w-full border rounded-md px-3 py-2"
            type="text"
            name="fax"
            value={selectedValue?.partenaires[index]?.fax}
            onChange={(event) => handleInputChange(index, event)}
            placeholder="Fax"
            
          />
        </div>
        <div className="form-group px-6 mb-4">
          <label className="block mb-1">Adresse:</label>
          <input className="w-full border rounded-md px-3 py-2"
            type="text"
            name="adresse"
            value={selectedValue?.partenaires[index]?.adresse}
            onChange={(event) => handleInputChange(index, event)}
            placeholder="Adresse"
          />
        </div>
        <div className="form-group px-6 mb-4">
          <label className="block mb-1">Email:</label>
          <input className="w-full border rounded-md px-3 py-2"
            type="text"
            name="email"
            value={selectedValue?.partenaires[index]?.email}
            onChange={(event) => handleInputChange(index, event)}
            placeholder="Email"
          />
        </div>
        <div className="form-group px-6 mb-4">
          <label className="block mb-1">Site web:</label>
          <input className="w-full border rounded-md px-3 py-2"
            type="text"
            name="web"
            value={selectedValue?.partenaires[index]?.web}
            onChange={(event) => handleInputChange(index, event)}
            placeholder="Site web"
          />
          </div>
          
        
          

 
          <div className="px-6 mb-4">
  <label className="block mb-1" htmlFor="contribution">
    Type de contribution
  </label>
 
  <div  className="flex flex-wrap">
 
    <div key={index}className="w-1/2 mb-2">
      <input
        type="checkbox"
        key={index}
        id="contribution1"
        value="Suivi et accompagnement"
        checked={selectedValue && selectedValue.partenaires[index] && selectedValue.partenaires[index].contribution && selectedValue.partenaires[index].contribution.includes("Suivi et accompagnement")}
        onChange={(e) => handleCheckboxChangeContribution(index,e, "Suivi et accompagnement")}
      />
      <label htmlFor="contribution1" className="ml-2">Suivi et accompagnement</label>
    </div> 
    
    <div key={index} className="w-1/2 mb-2">
      <input
        type="checkbox"
        key={index}
        id="contribution2"
        value="Sensibilisation"
        checked={selectedValue && selectedValue.partenaires[index] && selectedValue.partenaires[index].contribution && selectedValue.partenaires[index].contribution.includes("Sensibilisation")}
        onChange={(e) => handleCheckboxChangeContribution(index,e, "Sensibilisation")}
      />
      <label htmlFor="contribution2" className="ml-2">Sensibilisation</label>
    </div>
    <div key={index} className="w-1/2 mb-2">
      <input
        type="checkbox"
        key={index}
        id="contribution3"
        value="Hébergement provisoire"
        checked={selectedValue && selectedValue.partenaires[index] && selectedValue.partenaires[index].contribution && selectedValue.partenaires[index].contribution.includes("Hébergement provisoire")}
        onChange={(e) => handleCheckboxChangeContribution(index,e, "Hébergement provisoire")}
      />
      <label htmlFor="contribution3" className="ml-2">Hébergement provisoire</label>
    </div>
   
    <div key={index} className="w-1/2 mb-2">
      <input
        type="checkbox"
        key={index}
        id="contribution4"
        value="Assistance sociale"
        checked={selectedValue && selectedValue.partenaires[index] && selectedValue.partenaires[index].contribution && selectedValue.partenaires[index].contribution.includes("Assistance sociale")}
        onChange={(e) => handleCheckboxChangeContribution(index,e, "Assistance sociale")}
      />
      <label htmlFor="contribution4" className="ml-2">Assistance sociale</label>
    </div>
    <div key={index} className="w-1/2 mb-2">
      <input
        type="checkbox"
        key={index}
        id="contribution5"
        value="Aide sociale en nature"
        checked={selectedValue && selectedValue.partenaires[index] && selectedValue.partenaires[index].contribution && selectedValue.partenaires[index].contribution.includes("Aide sociale en nature")}
        onChange={(e) => handleCheckboxChangeContribution(index,e, "Aide sociale en nature")}
      />
      <label htmlFor="contribution5" className="ml-2">Aide sociale en nature</label>
    </div>
    <div key={index} className="w-1/2 mb-2">
  <input
    type="checkbox"
    key={index}
    id="contribution6"
    value="Equipement"
    checked={selectedValue && selectedValue.partenaires[index] && selectedValue.partenaires[index].contribution && selectedValue.partenaires[index].contribution.includes("Equipement")}
    onChange={(e) => handleCheckboxChangeContribution(index, e,"Equipement")}
  />
  <label htmlFor="contribution6" className="ml-2">Equipement</label>
</div>
<div key={index} className="w-1/2 mb-2">
  <input
    type="checkbox"
    key={index}
    id="contribution7"
    value="Encadrement"
    checked={selectedValue && selectedValue.partenaires[index] && selectedValue.partenaires[index].contribution && selectedValue.partenaires[index].contribution.includes("Encadrement")}
    onChange={(e) => handleCheckboxChangeContribution(index,e, "Encadrement")}
  />
  <label htmlFor="contribution7" className="ml-2">Encadrement</label>
</div>
<div key={index} className="w-1/2 mb-2">
      <input
        type="checkbox"
        key={index}
        id="contribution15"
        value="Cogestion"
        checked={selectedValue && selectedValue.partenaires[index] && selectedValue.partenaires[index].contribution && selectedValue.partenaires[index].contribution.includes("Cogestion")}
        onChange={(e) => handleCheckboxChangeContribution(index,e, "Cogestion")}
      />
      <label htmlFor="contribution15" className="ml-2">Cogestion</label>
    </div>
    <div key={index} className="w-1/2 mb-2">
      <input
        type="checkbox"
        key={index}
        id="contribution16"
        value="Construction"
        checked={selectedValue && selectedValue.partenaires[index] && selectedValue.partenaires[index].contribution && selectedValue.partenaires[index].contribution.includes("Construction")}
        onChange={(e) => handleCheckboxChangeContribution(index,e, "Construction")}
      />
      <label htmlFor="contribution16" className="ml-2">Construction</label>
    </div>


    <div key={index} className="w-1/2 mb-2">
      <input
        type="checkbox"
        key={index}
        id="contribution20"
        value="Aménagement"
        checked={selectedValue && selectedValue.partenaires[index] && selectedValue.partenaires[index].contribution && selectedValue.partenaires[index].contribution.includes("Aménagement")}
        onChange={(e) => handleCheckboxChangeContribution(index, e,"Aménagement")}
      />
      <label htmlFor="contribution20" className="ml-2">Aménagement</label>
    </div>






    <div key={index} className="w-1/2 mb-2">
      <input
        type="checkbox"
        key={index}
        id="contribution8"
        value="Disponibilité du foncier"
        checked={selectedValue && selectedValue.partenaires[index] && selectedValue.partenaires[index].contribution && selectedValue.partenaires[index].contribution.includes("Disponibilité du foncier")}
        onChange={(e) => handleCheckboxChangeContribution(index,e, "Disponibilité du foncier")}
      />
      <label htmlFor="contribution8" className="ml-2">Disponibilité du foncier</label>
    </div>
    <div key={index} className="w-1/2 mb-2">
      <input
        type="checkbox"
        key={index}
        id="contribution9"
        value="Appui financier"
        checked={selectedValue && selectedValue.partenaires[index] && selectedValue.partenaires[index].contribution && selectedValue.partenaires[index].contribution.includes("Appui financier")}
        onChange={(e) => handleCheckboxChangeContribution(index,e, "Appui financier")}
      />
      <label htmlFor="contribution9" className="ml-2">Appui financier</label>
    </div>
    <div key={index} className="w-1/2 mb-2">
      <input
        type="checkbox"
        key={index}
        id="contribution10"
        value="Renforcement de capacités"
        checked={selectedValue && selectedValue.partenaires[index] && selectedValue.partenaires[index].contribution && selectedValue.partenaires[index].contribution.includes("Renforcement de capacités")}
        onChange={(e) => handleCheckboxChangeContribution(index,e, "Renforcement de capacités")}
      />
      <label htmlFor="contribution10" className="ml-2">Renforcement de capacités</label>
    </div>
    <div key={index} className="w-1/2 mb-2">
      <input
        type="checkbox"
        key={index}
        id="contribution11"
        value="Mise à disposition d’un espace, centre ou structure"
        checked={selectedValue && selectedValue.partenaires[index] && selectedValue.partenaires[index].contribution && selectedValue.partenaires[index].contribution.includes("Mise à disposition d’un espace, centre ou structure")}
        onChange={(e) => handleCheckboxChangeContribution(index,e, "Mise à disposition d’un espace, centre ou structure")}
      />
      <label htmlFor="contribution11" className="ml-2">Mise à disposition d&apos;un espace, centre ou structure</label>
    </div>
    <div key={index} className="w-1/2 mb-2">
      <input
        type="checkbox"
        key={index}
        id="contribution12"
        value="Prise en charge des frais d'eau et d'électricité"
        checked={selectedValue && selectedValue.partenaires[index] && selectedValue.partenaires[index].contribution && selectedValue.partenaires[index].contribution.includes("Prise en charge des frais d'eau et d'électricité")}
        onChange={(e) => handleCheckboxChangeContribution(index,e, "Prise en charge des frais d'eau et d'électricité")}
      />
      <label htmlFor="contribution12" className="ml-2">Prise en charge des frais d&apos;eau et d&apos;électricité</label>
    </div>
    <div key={index} className="w-1/2 mb-2">
      <input
        type="checkbox"
        key={index}
        id="contribution13"
        value="Acquisition d'un véhicule pour les déplacements"
        checked={selectedValue && selectedValue.partenaires[index] && selectedValue.partenaires[index].contribution && selectedValue.partenaires[index].contribution.includes("Acquisition d'un véhicule pour les déplacements")}
        onChange={(e) => handleCheckboxChangeContribution(index,e, "Acquisition d'un véhicule pour les déplacements")}
      />
      <label htmlFor="contribution13" className="ml-2">Acquisition d&apos;un véhicule pour les déplacements</label>
    </div>
    <div key={index} className="w-1/2 mb-2">
      <input
        type="checkbox"
        key={index}
        id="contribution14"
        value="Réalisation des études techniques"
        checked={selectedValue && selectedValue.partenaires[index] && selectedValue.partenaires[index].contribution && selectedValue.partenaires[index].contribution.includes("Réalisation des études techniques")}
        onChange={(e) => handleCheckboxChangeContribution(index,e, "Réalisation des études techniques")}
      />
      <label htmlFor="contribution14" className="ml-2">Réalisation des études techniques</label>
    </div>
  </div>
</div>

















<div className="form-group px-6 mb-4">
          <label className="block mb-1">Contribution financière:</label>
          <input className="w-full border rounded-md px-3 py-2"
            type="number"
            name="estimContribFinanc"
            value={selectedValue?.partenaires[index]?.estimContribFinanc}
            onChange={(event) => handleInputChange(index, event)}
            placeholder="Contribution financière"
          />
        </div>
        
        {index !== 0 && (
          <button type="button" onClick={() => handleRemoveClick(index)} className="bg-yellow-500 text-white px-4 py-2 rounded-md">
            Supprimer
          </button>
        )}
      </div>
    );
  })}
  <div>
    <button type="button" onClick={handleAddClick}  style={actionButtonStyle}>
      Ajouter un autre partenaire
    </button>
  </div>
</div>


         </fieldset>

          <div className="mt-4 px-6 flex justify-end">
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-md">
              Envoyer
            </button>
          </div>
        </form>
      </Modal>
      <DataTable
        title={"Partenariats"}
        filterCol="numero"
        columns={dataToShow}
        data={filteredData || []}
        setOpenModal={openModal}
        settypeOfSubmit={settypeOfSubmit}
        canAdd={true}
      />
    </div>
  );
};

export default Page;


















import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';

const SuiviModal = ({ isOpen, closeModal, selectedValue, refetch, toast }) => {
  const [suivis, setSuivis] = useState([]);
  const [suiviToUpdateId, setSuiviToUpdateId] = useState(null);
  const [suiviData, setSuiviData] = useState({
    etatAvancement: 0,
    
    etat:'',
    commentaire: '',
    projetOperationel: '',
    objectifAtteints:'',
    avenant:'',
    dateSuivi:''
    // Autres champs de suivi
  });
  const handleUpdateClick = (suiviId) => {
    setIsAddingSuivi(true);
    setSuiviToUpdateId(suiviId);
    // Récupérez les détails du suivi à mettre à jour et initialisez le state suiviData avec ces détails
    const suiviToUpdate = suivis.find(suivi => suivi.id === suiviId);
    if (suiviToUpdate) {
      setSuiviData({
        etatAvancement: suiviToUpdate.etatAvancement,
        etat: suiviToUpdate.etat,
        commentaire: suiviToUpdate.commentaire,
        avenant:suiviToUpdate.avenant,
        projetOperationel: suiviToUpdate.projetOperationel,
        objectifAtteints: suiviToUpdate.objectifAtteints,
        dateSuivi: suiviToUpdate.dateSuivi
      });
    }
  };
  
  const loadSuivis = useCallback(async () => {
    const token = getCookie('token'); 
    const partenariatId = parseFloat(selectedValue.id);
    try {
      const response = await api.get("/suivie/byPartenariatid/"+ selectedValue.id ,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setSuivis(response.data);
    } catch (error) {
      console.error("Error loading suivis: ", error);
    }
  }, [ selectedValue.id, setSuivis]);
  useEffect(() => {
    // Chargez les suivis existants au moment du montage
    if (isOpen) {
      loadSuivis();
    }
  }, [isOpen, loadSuivis]);
  const formStyle = {
    maxWidth: '500px',
    margin: 'auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  };
  
  const inputContainerStyle = {
    marginBottom: '20px',
  };
  
  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '16px',
    
    color: '#333', // Couleur du texte
    fontFamily: 'Arial, sans-serif', // Police de caractères
  };
  
  const inputStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  };
  
  const buttonStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };
  
  const tableHeaderStyle = {
    backgroundColor: '#ccc',
    color: '#333',
    padding: '10px',
    textAlign: 'center',
};

const actionButtonStyle = {
  backgroundColor: '#f2f2f2', // Gris clair
    color: '#333', // Texte en gris foncé
    padding: '6px 12px', // Petit rembourrage
    borderRadius: '3px', // Coins arrondis
    border: 'none', // Pas de bordure
    cursor: 'pointer',
    margin: '0 4px',
    transition: 'background-color 0.3s, color 0.3s',
};
  
  const suiviItemStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between'
  };

  



 

  const handleAddSuivi = async (event) => {
    event.preventDefault();
    const token = getCookie('token');
    const etatAvancement=suiviData.etatAvancement;
   
    try {
     
      
     const response = await api.put('/suivie/create/'+ selectedValue.id, {...suiviData, idpart:parseInt(selectedValue.id),etatAvancement:parseFloat(etatAvancement)}, {
       headers: {
           Authorization: `Bearer ${token}`,
       }
    });
      setSuivis([...suivis, response.data]);
    
      toast({
        description: <span style={{ color: 'white', fontFamily: 'Arial, sans-serif' }}>Suivi ajouté avec succès </span>,
        className: "bg-green-500 text-white", // Fond vert, texte blanc
        duration: 2000,
        title: "Succès",
    })
      
    setIsAddingSuivi(false)
    } catch (error) {
      
      
      toast({
        description: <span style={{ color: 'white', fontFamily: 'Arial, sans-serif' }}>Erreur lors de l&apos;ajout du suivi </span>,
        variant: "destructive",
        duration: 2000,
        title: "Erreur",
    })



    //  console.error("Error adding suivi: ", error);
    }
  };

  const handleDeleteSuivi = async (suiviId) => {
    const token = getCookie('token');
    try {
      // Logique pour supprimer le suivi
      await api.delete('/suivie/'+ selectedValue.id +'/'+ suiviId, {
        headers: {
          Authorization: `Bearer ${token}`,
        }});
      setSuivis(suivis.filter(suivi => suivi.id !== suiviId));
     

      toast({
        description: <span style={{ color: 'white', fontFamily: 'Arial, sans-serif' }}>Suivi supprimé avec succès </span>,
        className: "bg-green-500 text-white", // Fond vert, texte blanc
        duration: 2000,
        title: "Succès",
    })



    } catch (error) {
    

      toast({
        description: <span style={{ color: 'white', fontFamily: 'Arial, sans-serif' }}>Erreur lors de la suppression du suivi </span>,
        variant: "destructive",
        duration: 2000,
        title: "Erreur",
    })



      console.error("Error deleting suivi: ", error);
    }
  };

  const handleEditSuivi = async () => {
    const token = getCookie('token');
    const etatAvancement=suiviData.etatAvancement;
    

    try {
      
      // Logique pour modifier le suivi
      
        await api.put('/suivie/update/'+ selectedValue.id +'/'+ suiviToUpdateId,  {...suiviData, idpart:parseInt(selectedValue.id),etatAvancement:parseFloat(etatAvancement), id:suiviToUpdateId}, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
  
       // const updatedSuivis = suivis.map(suivi =>
        //  suivi.id === suiviToUpdateId ? { ...suivi, ...suiviData } : suivi
       // );
       // setSuivis(updatedSuivis);
        
       
        
        toast({
          description: <span style={{ color: 'white', fontFamily: 'Arial, sans-serif' }}>Suivi modifié avec succès </span>,
          className: "bg-green-500 text-white", // Fond vert, texte blanc
          duration: 2000,
          title: "Succès",
      })

      
      
        // Gérez l'erreur si suiviToUpdateId n'est pas défini
       
    } catch (error) {
      
      toast({
        description: <span style={{ color: 'white', fontFamily: 'Arial, sans-serif' }}>Erreur lors de la modification du suivi </span>,
        variant: "destructive",
        duration: 2000,
        title: "Erreur",
    })
      console.error("Error updating suivi: ", error);
    }
  };
  const [isAddingSuivi, setIsAddingSuivi] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSuiviData({ ...suiviData, [name]: value });
   
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} contentLabel="Suivi" shouldCloseOnOverlayClick={true}>
     <h2 className="text-center text-2xl font-bold mb-4 font-serif">Suivi de Partenariats</h2>
      {isAddingSuivi ? (
    <form class="max-w-full mx-auto  py-6 bg-white shadow-md rounded-md" onSubmit={suiviToUpdateId ? handleEditSuivi : handleAddSuivi}>
      <h3 className="text-lg font-semibold mb-4 px-6 text-center text-gray-800 font-serif">
    Ajouter un Suivi
</h3>
      {/* Champs de saisie pour le nouveau suivi */}
       <div className=" px-6  mb-4" style={inputContainerStyle}>
    <label className="block mb-1" htmlFor="dateSuivi">Date:</label>
    <input className="w-full border rounded-md px-3 py-2"
      type="text"
      name="dateSuivi"
      value={suiviData.dateSuivi}
      onChange={handleInputChange}
      style={inputStyle}
      placeholder="format JJ/MM/AAAA"
    />
  </div>
      <div className=" px-6  mb-4" style={inputContainerStyle}>
    <label htmlFor="etatAvancement">État d&apos;avancement (Par exemple, pour 70%, saisissez simplement 70) :</label>
    <input
      type="number"
      name="etatAvancement"
      value={suiviData.etatAvancement}
      onChange={handleInputChange}
      style={inputStyle}
      placeholder="Pour 70% par exemple saisisez 70"
    />
  </div>
     

  






  <div className=" px-6  mb-4" style={inputContainerStyle}>
    <label htmlFor="commentaire" >Commentaire:</label>
    <input
      type="text"
      name="commentaire"
      value={suiviData.commentaire}
      onChange={handleInputChange}
      style={inputStyle}
      placeholder="Commentaire"
    />
  </div>
  <div className=" px-6  mb-4" style={inputContainerStyle}>
    <label htmlFor="avenant" >Avenant:</label>
    <input
      type="text"
      name="avenant"
      value={suiviData.avenant}
      onChange={handleInputChange}
      style={inputStyle}
      placeholder="avenant"
    />
  </div>
  <div className=" px-6  mb-4" style={inputContainerStyle}>
    <label htmlFor="objectifAtteints">Objectifs Atteints:</label>
    <input
      type="text"
      name="objectifAtteints"
      value={suiviData.objectifAtteints}
      onChange={handleInputChange}
      style={inputStyle}
      placeholder="Objectifs Atteints"
    />
  </div>


  <div className="px-6 mb-4" style={inputContainerStyle}>
  <label htmlFor="projetOperationel">Projet Opérationnel:</label>
  <div>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <button className="w-full border rounded-md px-3 py-2 text-left">
        {suiviData.projetOperationel || "Choisissez ..."}
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="origin-top-right right-0">
      <DropdownMenuItem onSelect={(e) => {
        setSuiviData({
          ...suiviData,
          projetOperationel: e.target.textContent,
        });
      }}>
        Oui
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={(e) => {
        setSuiviData({
          ...suiviData,
          projetOperationel: e.target.textContent,
        });
      }}>
        Non
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  </div>
</div>
<div className="px-6 mb-4" style={inputContainerStyle}>
  <label htmlFor="etat">État:</label>
</div>
<div className="px-6 mb-4" style={inputContainerStyle}>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <button className="w-full border rounded-md px-3 py-2 text-left">
        {suiviData.etat || "Choisissez ..."}
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="origin-top-right right-0">
      <DropdownMenuItem onSelect={(e) => {
        setSuiviData({
          ...suiviData,
          etat: e.target.textContent,
        });
      }}>
        Active
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={(e) => {
        setSuiviData({
          ...suiviData,
          etat: e.target.textContent,
        });
      }}>
        Inactive
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={(e) => {
        setSuiviData({
          ...suiviData,
          etat: e.target.textContent,
        });
      }}>
        Résiliée
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>

 
      
     
  <button style={actionButtonStyle} type="submit">
  {suiviToUpdateId ? "Mettre à jour" : "Ajouter"}
</button>
      
<button style={actionButtonStyle} onClick={() => setIsAddingSuivi(false)}>Fermer</button>
    </form>
     
     ) : (
      <div style={{ marginBottom: '2rem', padding: '1rem' }}>
  <div style={{ display: 'flex', alignItems: 'center',justifyContent: 'space-between', marginBottom: '1rem' }}>
    
    <button
       style={{
        ...actionButtonStyle,
        marginBottom: '20px',
        backgroundColor: '#f2f2f2', // Couleur gris clair
        color: '#000', // Couleur du texte
         // Coins arrondis
        padding: '8px 16px', // Rembourrage
      }}
      onClick={() => setIsAddingSuivi(true)}
    >
      Ajouter un suivi
    </button>
    <a href="/partenariat">
        <button style={{
        ...actionButtonStyle,
        marginBottom: '20px',
        backgroundColor: '#f2f2f2', // Couleur gris clair
        color: '#000', // Couleur du texte
         // Coins arrondis
        padding: '8px 16px', // Rembourrage
      }}>Fermer</button> {/* Bouton pour fermer la modal */}
      </a> 
  </div>


     <TableContainer component={Paper} style={{ backgroundColor: '#f5f5f5' }}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Date</TableCell>
        <TableCell>État d&apos;avancement</TableCell>
        <TableCell>État</TableCell>
        <TableCell>Commentaire</TableCell>
        <TableCell>Avenant</TableCell>
        <TableCell>Projet opérationnel</TableCell>
        <TableCell>Objectifs atteints</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {suivis.map((suivi) => (
        <TableRow key={suivi.id}>
          <TableCell style={{ textAlign: 'center' }}>{suivi.dateSuivi}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{suivi.etatAvancement}%</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{suivi.etat}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{suivi.commentaire}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{suivi.avenant}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{suivi.projetOperationel}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{suivi.objectifAtteints}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="contained" color="primary" style={{ border: '1px solid #000' }} onClick={() => handleUpdateClick(suivi.id)}>
                Mettre à jour
              </Button>
              <Button variant="contained" color="secondary" style={{ border: '1px solid #000' }} onClick={() => handleDeleteSuivi(suivi.id)}>
                Supprimer
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
</div>
                )}
                 
  </Modal>
);
};

const AttachmentModal = ({ isOpen, closeModal, selectedValue, refetch, toast, idpart }) => {
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
  const [files, setFiles] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadAttachments();
    }
  }, [isOpen]);

  const loadAttachments = async () => {
    const token = getCookie('token');
    try {
      const response = await api.get(`/attachments/by-article/${idpart}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const attachments = response.data;
      setAttachments(attachments);
      await loadImageUrls(attachments, token);
    } catch (error) {
      console.error('Error loading pieces jointes:', error);
    }
  };

  const loadImageUrls = async (attachments, token) => {
    const urls = {};
    for (const attachment of attachments) {
      if (attachment.fileType.startsWith('image/')) {
        const response = await api.get(`http://154.144.246.177:8081/attachments/download/${attachment.id}`, {
                   headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const blob = await response.blob();
        urls[attachment.id] = URL.createObjectURL(blob);
      }
    }
    setImageUrls(urls);
  };

  const handleDownloadClick = async (e, fileId, fileName) => {
    e.preventDefault();

    try {
      const token = getCookie('token');
      const response = await api.get(`http://154.144.246.177:8081/attachments/download/${fileId}`, {
               headers: {
          Authorization: `Bearer ${token}`,
        },
      responseType: 'blob',
      });
     
     
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier :', error);
    }
  };

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    setFiles(Array.from(selectedFiles));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await api.put(`/attachments/create/${parseFloat(idpart)}`, formData, {
        headers: {
          Authorization: `Bearer ${getCookie('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        description: 'Pièces jointes ajoutées avec succès',
        className: 'bg-green-500 text-white',
        duration: 2000,
        title: 'Success',
      });

      refetch();
      closeModal();
    } catch (error) {
      toast({
        description: 'Erreur lors de l\'ajout des pièces jointes',
        className: 'bg-red-500 text-white',
        duration: 2000,
        title: 'Error',
      });

      console.error('Error adding attachments:', error);
    }
  };

  const renderIcon = (fileType) => {
    if (fileType === 'application/pdf') {
      return <i className="far fa-file-pdf" style={styles.fileIcon}></i>;
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return <i className="far fa-file-word" style={styles.fileIcon}></i>;
    } else {
      return <i className="far fa-file-alt" style={styles.fileIcon}></i>;
    }
  };
  const handleDeleteClick = async (e, fileId) => {
    e.preventDefault();

    try {
      const token = getCookie('token');
      const response = await api.delete(`http://154.144.246.177:8081/attachments/delete/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      

      // Rafraîchir les données après la suppression
      refetch();
      setAttachments(attachments.filter(attachment => attachment.id !== fileId));
      toast({
        description: 'Pièce jointe supprimée avec succès',
        className: 'bg-green-500 text-white',
        duration: 2000,
        title: 'Success',
      });
    } catch (error) {
      

      toast({
        description: 'Erreur lors de la suppression de la pièce jointe',
        className: 'bg-red-500 text-white',
        duration: 2000,
        title: 'Error',
      });
    }
  };

  return (
    
    <Modal isOpen={isOpen} onRequestClose={closeModal}  style={customStyles}>
      <form className="max-w-full mx-auto py-6 bg-white shadow-md rounded-md" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-16 px-6">Pièce jointe : Convention</h2>
          <div className="flex">
            <input type="file" multiple onChange={handleFileChange} className="mr-2" />
            <button type="submit"  className="bg-gray-300 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded">Ajouter</button>
          </div>
        </div>
      </form>

     {/* <table className="table-auto w-full">
        <thead>
          <tr>
            <th style={styles.tableHeader}>Nom de fichier</th>
            <th style={styles.tableHeader}>Titre de l'article</th>
          </tr>
        </thead>
        <tbody>
          {attachments.map(attachment => (
            <tr key={attachment.id}>
              <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{attachment.fileName}</td>
              <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{attachment.article.title}</td>
            </tr>
          ))}
        </tbody>
        </table>
 <div className="mt-16 shadow-md rounded-md">
      <ul style={styles.attachmentList}>
        {attachments.map(attachment => (
          <li key={attachment.id} style={styles.attachmentItem}>
            {attachment.fileType.startsWith('image/') ? (
              <img src={imageUrls[attachment.id]} alt={attachment.fileName} style={styles.imagePreview} />
            ) : (
              renderIcon(attachment.fileType)
            )}
            <span style={styles.fileName}>{attachment.fileName}</span>
            <a href="#" onClick={e => handleDownloadClick(e, attachment.id, attachment.fileName)} style={styles.downloadLink}>Télécharger</a>
          </li>
        ))}
      </ul>
      </div>  */}
     <div className="mt-16 flex flex-col items-center">
  <h2 className="text-lg font-semibold mb-4 px-6">Fichiers de Partenariat</h2>
</div>
<div className="mt-4 shadow-md rounded-md flex justify-center">
  <ul style={styles.attachmentList} className="grid gap-16">
    {attachments.map(attachment => (
      <li key={attachment.id} style={styles.attachmentItem}>
        {renderIcon(attachment.fileType)}
        <span style={styles.fileName}>{attachment.fileName}</span>
        <a href="#" onClick={e => handleDownloadClick(e, attachment.id, attachment.fileName)} style={styles.downloadLink}>Télécharger</a>
        <span style={styles.space}></span>
        <a href="#" onClick={e => handleDeleteClick(e, attachment.id)} style={styles.downloadLink}>Supprimer</a>
      </li>
    ))}
  </ul>
</div>
    </Modal>
  );
};

const styles = {
  attachmentList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  attachmentItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #ccc',
  },
  imagePreview: {
    maxWidth: '70px',
    maxHeight: '70px',
    marginRight: '10px',
    borderRadius: '4px',
  },
  fileIcon: {
    fontSize: '24px',
    marginRight: '10px',
  },
  fileName: {
    flexGrow: 1,
  },
  downloadLink: {
    textDecoration: 'none',
    color: '#7C3AED', // Changer la couleur en bleu
    cursor: 'pointer',
    marginLeft: '40px',
    marginRight: '40px',
    fontFamily: 'Arial, sans-serif', // Changer la police de texte
    fontWeight: 'bold', // Rendre le texte en gras
  },
  downloadLinkHover: {
    textDecoration: 'underline',
  },
  tableHeader: {
    backgroundColor: '#ccc',
    color: '#333',
    padding: '10px',
    textAlign: 'center',
  },
  space: {
    margin: '0 10px', // Ajout d'un espace de 10 pixels entre les deux liens
  },
};









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
  const { data: part, refetch:repart} = useQuery({
    queryKey: ['partenariats'],
    queryFn: getPartenariats(),
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getCookie('token'); 
    
    const headers = {
        Authorization: `Bearer ${token}`
    };
    try {
      await api.delete("/part/delete/" + selectedValue.id,{
        headers: headers
             
            } )
     
      toast({
        description: <span style={{ color: 'white', fontFamily: 'Arial, sans-serif' }}> Partenariat Supprimé avec succès ✔️</span>,
        className: "bg-green-500 text-white", // Fond vert, texte blanc
        duration: 2000,
        title: "Succès",
    })
      closeModal()
      repart()
    } catch (e) {
    
      toast({
        description: <span style={{ color: 'white', fontFamily: 'Arial, sans-serif' }}>Erreur lors de la suppression du partenariat ❌</span>,
        variant: "destructive",
        duration: 2000,
        title: "Erreur",
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
  }

