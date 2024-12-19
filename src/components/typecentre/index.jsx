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
        let typeCentreList = [];

        if (typeof partenariat.typeCentre === 'string') {
          typeCentreList = partenariat.typeCentre.replace(/"/g, "").split(",");
        } else if (Array.isArray(partenariat.typeCentre)) {
          typeCentreList = partenariat.typeCentre;
        } else {
          typeCentreList.push(partenariat.typeCentre);
        }

        typeCentreList.forEach(typeCentre => addPartnershipCount(partnershipCounts, typeCentre, partenariat.dateSignature));  
      });

      const dataForTable = Object.keys(partnershipCounts).map(typeCentre => ({
        typeCentre: typeCentre,
        parttotal: partnershipCounts[typeCentre],
        dateSignatures: partenariatsData
          .filter(p => p.typeCentre.includes(typeCentre))
          .map(p => p.dateSignature)
      }));

      setTableData(dataForTable.filter(entry => entry.parttotal > 0));
    }
  }, [partenariatsData]);

  const addPartnershipCount = (partnershipCounts, typeCentre, dateSignature) => {
    if (!partnershipCounts[typeCentre]) {
      partnershipCounts[typeCentre] = 1;
    } else {
      partnershipCounts[typeCentre]++;
    }
  };

  const handleFilterByYear = (year) => {
    setFilterYear(year);
  };

  const filteredData = filterYear ? tableData.map(entry => ({
    typeCentre: entry.typeCentre,
    parttotal: entry.dateSignatures.filter(date => date.split("/")[2] === filterYear).length
  })).filter(entry => entry.parttotal > 0) : tableData;

  return (
    <div className="px-6 py-4 mt-10" id="Materiels" style={{ backgroundColor: 'white' }}>
      <h2 style={{ fontFamily: 'Roboto, sans-serif', fontSize: '1.3rem', fontWeight: 'bold', color: '#333', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', paddingBottom: '10px',textAlign: 'center' }}>
        Nombre Total de Partenariats par Type de Centre
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
            accessorKey: "typeCentre",
            header: "Type de Centre",
            cell: ({ row }) => <div >{row.getValue("typeCentre")}</div>,
          },
          {
            accessorKey: "parttotal",
            header: "Nombre Total de Partenariats",
            cell: ({ row }) => <div >{row.getValue("parttotal")}</div>,
          }
        ]}
        data={filteredData}
        filterCol="typeCentre"
      />
    </div>
  );
};

export default Page;