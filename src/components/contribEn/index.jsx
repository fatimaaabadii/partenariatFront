
"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPartenariats } from "@/api";
import { DataTable } from "@/components/hometable";

const Page = () => {
  const [tableData, setTableData] = useState([]);
  const [filterYear, setFilterYear] = useState("");
  const { data: partenariatsData } = useQuery({
    queryKey: ['Partenariats'],
    queryFn: getPartenariats(),
  });

  useEffect(() => {
    if (partenariatsData && partenariatsData.length > 0) {
      const partnershipCounts = {};

      partenariatsData.forEach(partenariat => {
        let contribEnList = [];

        if (typeof partenariat.contribEn === 'string') {
          contribEnList = partenariat.contribEn.replace(/"/g, "").split(",");
        } else if (Array.isArray(partenariat.contribEn)) {
          contribEnList = partenariat.contribEn;
        } else {
          contribEnList.push(partenariat.contribEn);
        }

        contribEnList.forEach(contribEn => addPartnershipCount(partnershipCounts, contribEn, partenariat.dateSignature));  
      });

      const dataForTable = Object.keys(partnershipCounts).map(contribEn => ({
        contribEn: contribEn,
        contribEnLabel: mapcontribEnLabel(contribEn),
        parttotal: partnershipCounts[contribEn],
        dateSignatures: partenariatsData
          .filter(p => p.contribEn.includes(contribEn))
          .map(p => p.dateSignature)
      }));

      setTableData(dataForTable.filter(entry => entry.parttotal > 0));
    }
  }, [partenariatsData]);

  const mapcontribEnLabel = (contribEn) => {
    switch (contribEn) {
      case "contrib1":
        return "Suivi et accompagnement";
      case "contrib2":
        return "Délivrance des diplômes";
      case "contrib3":
        return "Subvention annuelle";
      case "contrib4":
        return "Appui financier";
      case "contrib5":
        return "Mettre certaines salles ou espaces à la disposition des programmes de partenariat";
      case "contrib6":
        return "Equipement";
      case "contrib7":
        return "Cogestion";
      case "contrib8":
        return "Encadrement";
      case "contrib9":
        return "Formation";
      case "contribC":
        return "Construction";
      case "contribB":
        return "Réalisation des études techniques";
      case "contribA":
        return "Aménagement";
      default:
        return contribEn;
    }
  };

  const addPartnershipCount = (partnershipCounts, contribEn, dateSignature) => {
    if (!partnershipCounts[contribEn]) {
      partnershipCounts[contribEn] = 1;
    } else {
      partnershipCounts[contribEn]++;
    }
  };

  const handleFilterByYear = (year) => {
    setFilterYear(year);
  };

  const filteredData = filterYear ? tableData.map(entry => ({
    contribEn: entry.contribEn,
    contribEnLabel: entry.contribEnLabel,
    parttotal: entry.dateSignatures.filter(date => date.split("/")[2] === filterYear).length
  })).filter(entry => entry.parttotal > 0) : tableData;

  return (
    <div className="px-6 py-4 mt-10" id="Materiels" style={{ backgroundColor: 'white' }}>
      <h2 style={{ fontFamily: 'Roboto, sans-serif', fontSize: '1.3rem', fontWeight: 'bold', color: '#333', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', paddingBottom: '10px' ,textAlign: 'center'}}>
        Nombre Total de Partenariats par contribution de l&apos;Entraide Nationale
      </h2>
      <div style={{textAlign: 'center'}}>
        <label htmlFor="yearFilter">Filtrer par année : </label>
        <select id="yearFilter" onChange={(e) => handleFilterByYear(e.target.value)}>
          <option value="">Toutes les années</option>
             {partenariatsData && partenariatsData.length > 0 && 
            Array.from(new Set(partenariatsData.map(partenariat => 
              partenariat.dateSignature ? partenariat.dateSignature.split("/")[2] : null)))
              .filter(year => year !== null && year !== " ") // filtrer les valeurs null
              .sort((a, b) => b - a) 
              .map(year => (
                <option key={year} value={year}>{year}</option>
              ))
          }
        </select>
      </div>
      <DataTable
        columns={[
          {
            accessorKey: "contribEnLabel",
            header: "Contribution de l'EN",
            cell: ({ row }) => <div >{row.getValue("contribEnLabel")}</div>,
          },
          {
            accessorKey: "parttotal",
            header: "Nombre Total de Partenariats",
            cell: ({ row }) => <div >{row.getValue("parttotal")}</div>,
          }
        ]}
        data={filteredData}
        filterCol="contribEnLabel"
      />
    </div>
  );
};

export default Page;