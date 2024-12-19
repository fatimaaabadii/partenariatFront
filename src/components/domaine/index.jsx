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
        let domaineList = [];

        if (typeof partenariat.domaine === 'string') {
          domaineList = partenariat.domaine.replace(/"/g, "").split(",");
        } else if (Array.isArray(partenariat.domaine)) {
          domaineList = partenariat.domaine;
        } else {
          domaineList.push(partenariat.domaine);
        }

        domaineList.forEach(domaine => addPartnershipCount(partnershipCounts, domaine, partenariat.dateSignature));  
      });

      const dataForTable = Object.keys(partnershipCounts).map(domaine => ({
        domaine: domaine,
        domaineLabel: mapDomaineLabel(domaine),
        parttotal: partnershipCounts[domaine],
        dateSignatures: partenariatsData
          .filter(p => p.domaine.includes(domaine))
          .map(p => p.dateSignature)
      }));

      setTableData(dataForTable.filter(entry => entry.parttotal > 0));
    }
  }, [partenariatsData]);

  const mapDomaineLabel = (domaine) => {
    switch (domaine) {
      case "domaine1":
        return "Assistance sociale";
      case "domaine2":
        return "Aide sociale en nature";
      case "domaine3":
        return "Formation au profit des personnes en situation difficile";
      case "domaine5":
        return "Contribution au soutien et à la gestion des centres et des structures sociales";
      case "domaineC":
        return "Appui aux centres, établissements et espaces sociaux";
      case "domaine7":
        return "Intégration sociale et économique des personnes en situation difficile";
      default:
        return domaine;
    }
  };

  const addPartnershipCount = (partnershipCounts, domaine, dateSignature) => {
    if (!partnershipCounts[domaine]) {
      partnershipCounts[domaine] = 1;
    } else {
      partnershipCounts[domaine]++;
    }
  };

  const handleFilterByYear = (year) => {
    setFilterYear(year);
  };

  const filteredData = filterYear ? tableData.map(entry => ({
    domaine: entry.domaine,
    domaineLabel: entry.domaineLabel,
    parttotal: entry.dateSignatures.filter(date => date.split("/")[2] === filterYear).length
  })).filter(entry => entry.parttotal > 0) : tableData;

  return (
    <div className="px-6 py-4 mt-0" id="Materiels" style={{ backgroundColor: 'white' }}>
     <h2 style={{ fontFamily: 'Roboto, sans-serif', fontSize: '1.3rem', fontWeight: 'bold', color: '#333', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', paddingBottom: '20px', textAlign: 'center' }}>
  Nombre Total de Partenariats par Domaine de Partenariat
</h2>
      <div style={{ textAlign: 'center'}}>
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
            accessorKey: "domaineLabel",
            header: "Domaine de partenariat",
            cell: ({ row }) => <div >{row.getValue("domaineLabel")}</div>,
          },
          {
            accessorKey: "parttotal",
            header: "Nombre Total de Partenariats",
            cell: ({ row }) => <div >{row.getValue("parttotal")}</div>,
          }
        ]}
        data={filteredData}
        filterCol="domaineLabel"
      />
    </div>
  );
};

export default Page;