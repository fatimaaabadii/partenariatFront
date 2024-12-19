"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDelegations, getPartenariats } from "@/api";
import { DataTable } from "@/components/hometable";

const Page = () => {
  const [selectedCoordination, setSelectedCoordination] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [filteredDelegationData, setFilteredDelegationData] = useState([]);
  const [coordinationOptions, setCoordinationOptions] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);

  const { data: delegationsData } = useQuery({
    queryKey: ['Delegations'],
    queryFn: getDelegations(),
  });

  const { data: partenariatsData } = useQuery({
    queryKey: ['Partenariats'],
    queryFn: getPartenariats(),
  });

  useEffect(() => {
    if (delegationsData && partenariatsData) {
      const uniqueCoordinations = [...new Set(delegationsData.map((delegation) => delegation.coordination))];
      setCoordinationOptions(uniqueCoordinations);
    }
  }, [delegationsData, partenariatsData]);

  useEffect(() => {
    if (selectedCoordination && partenariatsData) {
      const coordinationPartenariats = partenariatsData.filter(partenariat => partenariat.delegations.some(delegation => delegation.coordination === selectedCoordination));
      const years = Array.from(new Set(coordinationPartenariats.flatMap(partenariat => partenariat.dateSignature.split("/")[2])));
      setAvailableYears(years);
    }
  }, [selectedCoordination, partenariatsData]);

  useEffect(() => {
    if (delegationsData && partenariatsData) {
      const calculateDelegationValues = (partenariats) => {
        const delegationValues = {};
  
        partenariats.forEach((partenariat) => {
          const partenariatYear = partenariat.dateSignature.split("/")[2];
          if (selectedYear === "" || partenariatYear === selectedYear) {
            if (Array.isArray(partenariat.delegations)) {
              partenariat.delegations.forEach((delegation) => {
                if (!delegationValues[delegation.delegation]) {
                  delegationValues[delegation.delegation] = {
                    coordination: delegation.coordination,
                    parttotal: 1,
                    montant_global: partenariat.montant_global,
                    estimatioFinancier: partenariat.estimatioFinancier,
                    estimatioFinanciertotal: 0,
                    dateSignature: partenariat.dateSignature,
                  };
                } else {
                  delegationValues[delegation.delegation].parttotal += 1;
                  delegationValues[delegation.delegation].montant_global += partenariat.montant_global;
                  delegationValues[delegation.delegation].estimatioFinancier += partenariat.estimatioFinancier;
                }
                if (Array.isArray(partenariat.partenaires)) {
                  partenariat.partenaires.forEach((partenaire) => {
                    if (!isNaN(parseFloat(partenaire.estimContribFinanc))) {
                      delegationValues[delegation.delegation].estimatioFinanciertotal += parseFloat(partenaire.estimContribFinanc);
                    }
                  });
                }
              });
            }
          }
        });
  
        const delegationData = Object.keys(delegationValues).map((delegation) => {
          return {
            coordination: delegationValues[delegation].coordination,
            delegation: delegation,
            parttotal: delegationValues[delegation].parttotal,
            montant_global: delegationValues[delegation].montant_global,
            estimatioFinancier: delegationValues[delegation].estimatioFinancier,
            estimatioFinanciertotal: delegationValues[delegation].estimatioFinanciertotal,
            dateSignature: delegationValues[delegation].dateSignature,
          };
        });
  
        return delegationData;
      };
  
      const delegationData = calculateDelegationValues(partenariatsData);
      setFilteredDelegationData(delegationData);
    }
  }, [delegationsData, partenariatsData, selectedYear]);

  const handleCoordinationChange = (e) => {
    setSelectedCoordination(e.target.value);
    setSelectedYear(""); // Réinitialiser l'année sélectionnée lors du changement de coordination
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const filteredData = filteredDelegationData.filter((delegation) => {
    return (
      (selectedCoordination === "" || delegation.coordination === selectedCoordination) &&
      (selectedYear === "" || delegation.dateSignature.split("/")[2] === selectedYear)
    );
  });

  return (
    <div className="px-6 py-4 mt-0" id="Materiels" style={{ backgroundColor: 'white' }}>
      <h2 style={{ fontFamily: 'Roboto, sans-serif', fontSize: '1.3rem', fontWeight: 'bold', color: '#333', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', paddingBottom: '10px' ,textAlign: 'center'}}>
        Contribution Financière
      </h2>
      <div className="flex space-x-6">
      <div style={{ display: 'flex', alignItems: 'center' }} >
        <h2 style={{ marginRight: '30px' }}>Choisissez une coordination :</h2>
        <select value={selectedCoordination} onChange={handleCoordinationChange}>
          <option value="">Sélectionner une Coordination</option>
          {coordinationOptions.map((coordination, index) => (
            <option key={index} value={coordination}>
              {coordination}
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2 style={{ marginRight: '30px' }}>Choisissez une année :</h2>
        <select value={selectedYear} onChange={handleYearChange}>
          <option value="">Toutes les années</option>

          {availableYears.sort((a, b) => b - a).map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}

               </select>
      </div>
      </div>
      {selectedCoordination && (
        <DataTable
          filterCol="delegation"
          columns={[
            {
              accessorKey: "delegation",
              header: "Délégation",
              cell: ({ row }) => <div className="capitalize">{row.getValue("delegation")}</div>,
            },
            {
              accessorKey: "parttotal",
              header: "Nombre total de partenariats",
              cell: ({ row }) => <div className="capitalize">{row.getValue("parttotal")}</div>,
            },
            {
              accessorKey: "montant_global",
              header: "Montant global des partenariats",
              cell: ({ row }) => <div className="capitalize">{row.getValue("montant_global")}</div>,
            },
            {
              accessorKey: "estimatioFinancier",
              header: "Contribution financière de l'Entraide",
              cell: ({ row }) => <div className="capitalize">{row.getValue("estimatioFinancier")}</div>,
            },
           /* {
              accessorKey: "estimatioFinanciertotal",
              header: "Contribution financière des partenaires",
              cell: ({ row }) => <div className="capitalize">{row.getValue("estimatioFinanciertotal")}</div>,
            },*/
          ]}
          data={filteredData}
          canAdd={true}
        />
      )}
    </div>
  );
};

export default Page;