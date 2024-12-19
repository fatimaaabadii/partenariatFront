import Link from "next/link";
import { FaUser, FaUsers } from "react-icons/fa";
import { MdDevices } from "react-icons/md";
import { FaUserFriends } from 'react-icons/fa';
import { FaHandshake } from 'react-icons/fa';
import { FaMapMarker } from 'react-icons/fa';
import { BiMapPin } from 'react-icons/bi';
import { FaShareAlt } from 'react-icons/fa';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { FaSitemap } from 'react-icons/fa';
import { useQuery } from "@tanstack/react-query";
import { api, getDelegations, getUsers, getCurrentUser } from "@/api";
import { FaAddressBook } from 'react-icons/fa';
import { FaFolderOpen } from 'react-icons/fa';
import { FaPhone } from 'react-icons/fa';
const Sidebar = () => {
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser(),
  });
  
  
  
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
  return (
    <div className="fixed flex flex-col top-0 left-0 w-64 bg-[#7C3AED] h-full border-r text-white">
     <div className="flex items-center justify-center border-b" style={{ height: '100px' }}>
      <div className="text-center">
  <p className="mb-2 text-l font-serif  tracking-wide">Administration du Partenariat </p>
  <p className="mb-2 text-l font-serif  tracking-wide"> et Coopération</p>
</div>
</div>
      <div className="overflow-y-auto overflow-x-hidden flex-grow justify-between flex flex-col">
        <ul className="flex flex-col py-4 space-y-2">
          <li>
            <Link
              href="/"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-white hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-1">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </span>
              <span className="ml-2 text-l font-serif tracking-wide truncate">
                 Accueil
              </span>
            </Link>
          </li>
          {/*<li>
            <Link
              href="/partenaire"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-white hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-4">
              <FaUserFriends className="w-8 h-4" />
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">
              Gestion des Partenaires
              </span>
            </Link>
  </li>*/}
  { (userData?.roles === "ADMIN_ROLES" || userData?.roles === "DELEGUE_ROLES" || userData?.roles === "COORDINATEUR_ROLES" || userData?.roles === "SIEGE_ROLES") && (
          <li>
            <Link
              href="/partenariat"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-white hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-1">
              <FaHandshake  className="w-8 h-4" />
              </span>
              <span className="ml-2 text-l font-serif tracking-wide truncate">
              Gestion des Partenariats
              </span>
            </Link>
          </li>
  )}
          
          { (userData?.roles === "ADMIN_ROLES" || userData?.roles === "TECHNIQUE_ROLES") && (

          <li>
            <Link
              href="/delegation"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-white hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-1">
              <FaSitemap className="w-8 h-4" />
              </span>
              <span className="ml-2 text-l font-serif tracking-wide truncate">
              Gestion des délégations
              </span>
            </Link>
            
          </li>


          



          )}
           <li>
            <Link
              href="/annuaire"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-white hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-1">
              <FaAddressBook   className="w-8 h-4" />
              </span>
              <span className="ml-2 text-l font-serif tracking-wide truncate">
              Annuaire des délégations
              </span>
            </Link>
            
          </li>
          {/* <li>
            <Link
              href="/commune"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-white hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-4">
              <BiMapPin className="w-8 h-4" />
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">
              Gestion des communes
              </span>
            </Link>
          </li>*/}

{ (userData?.roles === "ADMIN_ROLES" || userData?.roles === "DELEGUE_ROLES" || userData?.roles === "COORDINATEUR_ROLES") && (
          <li>
            <Link
              href="/coordonnees"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-white hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-1">
              <FaPhone   className="w-8 h-4" />
              </span>
              <span className="ml-2 text-l font-serif tracking-wide truncate">
              Coordonnées de ma structure
              </span>
            </Link>
            
          </li>

)}


        { (userData?.roles === "ADMIN_ROLES" || userData?.roles === "TECHNIQUE_ROLES") && (
          <li>
            <Link
              href="/utilisateurs"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-white hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-1">
                <FaUsers className="w-5 h-5" />
              </span>
              <span className="ml-2 text-l font-serif tracking-wide truncate">
              Gestion des Utilisateurs
              </span>
            </Link>
          </li>)}
        </ul>

        <div className="py-4 space-y-1">
          <Link
            href="/user"
            className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-white hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
          >
            <span className="inline-flex justify-center items-center ml-1">
              <FaUser className="w-5 h-5" />
            </span>
            <span className="ml-2 text-l font-serif tracking-wide truncate">
              Mon Profil
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
