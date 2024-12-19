"use client";
import PartnershipsPieChart from '@/components/Piechart';
import Footer from '@/components/Footer';
import Card from "@/components/card";
import PartnershipsChart from '@/components/chart';
import { FaUserFriends } from 'react-icons/fa';
import ContribFinanceTable from "@/components/contribFinance";
import Typecentre from "@/components/typecentre";
import ContribEn from "@/components/contribEn";
import Domaine from "@/components/domaine";
import { IoGift } from "react-icons/io5";
import { FaBriefcase } from "react-icons/fa";
import { MdDirectionsWalk } from "react-icons/md";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaHandshake } from 'react-icons/fa';
import { FaMapMarker } from 'react-icons/fa';
import { BiMapPin } from 'react-icons/bi';
import { MdCheckCircle } from 'react-icons/md';
import { api,getPartenariats ,getPartenaires} from '@/api';
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { FaChartLine } from "react-icons/fa";
import { FaChartBar } from "react-icons/fa";
import { FaCog } from "react-icons/fa";
import { FiBriefcase } from "react-icons/fi";
import { IoIosAnalytics } from "react-icons/io";
import { MdPieChart } from "react-icons/md";
import { BsChartDonut } from "react-icons/bs";
import { TiChartBarOutline } from "react-icons/ti";
import { BiPieChart } from "react-icons/bi";

const partnershipData = [
  { domain: 'Éducation', count: 25 },
  { domain: 'Santé', count: 30 },
  { domain: 'Technologie', count: 60 },
  { domain: 'Sensibilisation', count: 20 },
  { domain: 'Construction', count: 10 },
  { domain: 'Equipement', count: 5 },
  { domain: 'Sport', count: 30 },
  { domain: 'Ecoute et orientation', count: 15 },
  // et ainsi de suite...
];
const partnershipsData = {
  'Délegation 1': 10,
  'Délegation 2': 20,
  'Délegation 3': 15,
  // Ajoutez d'autres données de partenariats par délégations ici
};
async function getSuivisByPartenariatId(partenariatId) {
    // Appel à votre API pour récupérer les suivis par ID de partenariat
    const token = getCookie('token');
    const response = await api.get(`/suivie/byPartenariatid/${partenariatId}`, {
        
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data;
}

// Fonction pour récupérer les partenariats


// Fonction pour calculer le nombre de partenariats actifs
async function calculerNombrePartenariatsActifs(partenariats) {
    if (!partenariats || !Array.isArray(partenariats)) {
        console.error("Les données de partenariats ne sont pas définies ou ne sont pas dans le format attendu.");
        return;
    }

    let nombrePartenariatsActifs = 0;

    // Parcourir chaque partenariat
    for (const partenariat of partenariats) {
        try {
            // Récupérer les suivis pour ce partenariat
            const suivis = await getSuivisByPartenariatId(partenariat.id);

            // Vérifier s'il y a des suivis pour ce partenariat
            if (suivis.length > 0) {
                // Trouver le dernier suivi en récupérant l'élément à l'index le plus élevé
                const dernierSuivi = suivis[suivis.length - 1];

                // Vérifier si l'état du dernier suivi est "actif"
                if (dernierSuivi.etat === "Active") {
                    nombrePartenariatsActifs++;
                }
            }
        } catch (error) {
            console.error(`Erreur lors de la récupération des suivis pour le partenariat ${partenariat.id}:`, error);
        }
    }
    console.log("Nombre de partenariats actifs:", nombrePartenariatsActifs);
    return nombrePartenariatsActifs;}



    async function calculerNombreProjetsOperationnels(partenariats) {
        if (!partenariats || !Array.isArray(partenariats)) {
        console.error("Les données de partenariats ne sont pas définies ou ne sont pas dans le format attendu.");
        return;
    }

    let nombreProjetsOperationnels = 0;

    // Parcourir chaque partenariat
    for (const partenariat of partenariats) {
        try {
            // Récupérer les suivis pour ce partenariat
            const suivis = await getSuivisByPartenariatId(partenariat.id);

            // Vérifier s'il y a des suivis pour ce partenariat
            if (suivis.length > 0) {
                // Trouver le dernier suivi en récupérant l'élément à l'index le plus élevé
                const dernierSuivi = suivis[suivis.length - 1];

                // Vérifier si l'état du dernier suivi est "actif"
                if (dernierSuivi.projetOperationel === "Oui") {
                    nombreProjetsOperationnels++;
                }
            }
        } catch (error) {
            console.error(`Erreur lors de la récupération des suivis pour le partenariat ${partenariat.id}:`, error);
        }
    }
    console.log("Nombre de partenariats opérationels:", nombreProjetsOperationnels);
    return nombreProjetsOperationnels;}

const Page = () => {
    const [nombrePartenariatsActifs, setNombrePartenariatsActifs] = useState(null);
    const [nombreProjetsOperationnels, setNombreProjetsOperationnels] = useState(null);

    const { data: partenariats, refetch: refetchPartenariats } = useQuery({
        queryKey: ['partenariats'],
        queryFn: getPartenariats(),
    });
    
    useEffect(() => {
        if (partenariats) {
            calculerNombrePartenariatsActifs(partenariats)
                .then(result => setNombrePartenariatsActifs(result))
                .catch(error => console.error("Erreur lors du calcul du nombre de partenariats actifs:", error));

            calculerNombreProjetsOperationnels(partenariats)
                .then(result => setNombreProjetsOperationnels(result))
                .catch(error => console.error("Erreur lors du calcul du nombre de projets opérationnels:", error));
        }
    }, [partenariats]);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const { data: partenariatsData } = useQuery({
        queryKey: ['Partenariats'],
        queryFn: getPartenariats(),
      });
      const getTotalPartenariats = () => {
        if (partenariatsData) {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const partenariatsAnneeActuelle = partenariatsData.filter(partenariat => {
                const partenariatYear = partenariat.dateSignature.split("/")[2];
                
                return partenariatYear == currentYear;
            });
            return partenariatsAnneeActuelle.length;
        }
        return 0;
         // Retourne 0 si les données de partenariats ne sont pas encore chargées
    };
    const { data: partenaireData } = useQuery({
        queryKey: ['partenaires'],
        queryFn: getPartenaires(),
      });
 
    


  return (
      <div className="bg-white">
          <div className="p-6" >
              <div className="flex flex-row justify-between" >
                  <Card
                
                name={`Nombre total de partenariats signés (${currentYear})`}
                      count={getTotalPartenariats()}
                      svg={<FaChartLine size={32} />}
                  />
                  <Card
                      name="Nombre de partenariats actifs"
                      count={nombrePartenariatsActifs !== null ? nombrePartenariatsActifs : "Chargement..."}
                      svg={<FaChartBar size={32} />}
                  />
                  
                  <Card
                      name="Nombre de projets opérationnels"
                      count={nombreProjetsOperationnels !== null ? nombreProjetsOperationnels : "Chargement..."}
                      svg={ <BiPieChart size={32} />}
                  />
              </div>
              
                          <div>
                           <ContribEn />
                           <Domaine />
                           <ContribFinanceTable />
                           <Typecentre />
                           
                          

                         </div>
              
             {/* <div className="mt-4 flex flex-row">
                  <div className="w-1/2 mr-4" style={{ marginTop: '75px' }}>
                      <h1>Répartition des partenariats par domaine</h1>
                      <PartnershipsPieChart partnershipData={partnershipData} />
                  </div>
                  <div className="w-1/2" style={{ marginTop: '60px' }}>
                      <h1 className="mt-4">Nombre de partenariats par délégations</h1>
                      <PartnershipsChart data={partnershipsData} />
                  </div>
  </div>*/}
          </div>
          <Footer />
      </div>
  );
};
export default Page;