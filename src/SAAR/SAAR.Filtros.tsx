import { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { loadEscolasFromCsv } from "../utils/csvParser";
import type { FiltroContexto } from "../types/shared.types";
import { ESTADO_PADRAO, SAAR_PADRAO, OPCOES_SAAR } from "./constants/shared.constants";
import "./SAAR.Filtros.css";

interface SAARFiltrosProps {
  onFiltrosChange?: (filtros: FiltroContexto) => void;
}

export default function SAARFiltros({ onFiltrosChange }: SAARFiltrosProps) {
  const [filtroVisivel, setFiltroVisivel] = useState<boolean>(true);

  const [filtros, setFiltros] = useState<FiltroContexto>({
    estado: ESTADO_PADRAO,
    regional: undefined,
    municipio: undefined,
    escola: undefined,
    saar: SAAR_PADRAO,
  });

  const [regionais, setRegionais] = useState<{ label: string; value: string }[]>([]);
  const [municipios, setMunicipios] = useState<{ label: string; value: string }[]>([]);
  const [escolas, setEscolas] = useState<{ label: string; value: string }[]>([]);

  // Carregar dados dos CSVs
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const escolasData = await loadEscolasFromCsv();
        
        // Extrair regionais únicas
        const regionaisSet = new Set<string>();
        escolasData.forEach((escola) => {
          if (escola.regional) {
            regionaisSet.add(escola.regional);
          }
        });
        const regionaisList = Array.from(regionaisSet)
          .sort()
          .map((regional) => ({
            label: regional,
            value: regional.toLowerCase().replace(/\s+/g, "-"),
          }));
        setRegionais(regionaisList);

        // Filtrar municípios baseado nas regionais selecionadas
        const regionaisSelecionadas = Array.isArray(filtros.regional)
          ? filtros.regional.map((r: { label: string; value: string }) => r.label)
          : filtros.regional
          ? [filtros.regional.label]
          : [];

        if (regionaisSelecionadas.length > 0) {
          const municipiosSet = new Set<string>();
          escolasData
            .filter((escola) => regionaisSelecionadas.includes(escola.regional || ""))
            .forEach((escola) => {
              if (escola.municipio) {
                municipiosSet.add(escola.municipio);
              }
            });
          const municipiosList = Array.from(municipiosSet)
            .sort()
            .map((municipio) => ({
              label: municipio,
              value: municipio.toLowerCase().replace(/\s+/g, "-"),
            }));
          setMunicipios(municipiosList);
        } else {
          setMunicipios([]);
        }

        // Filtrar escolas baseado nos municípios selecionados
        const municipiosSelecionados = Array.isArray(filtros.municipio)
          ? filtros.municipio.map((m: { label: string; value: string }) => m.label)
          : filtros.municipio
          ? [filtros.municipio.label]
          : [];

        if (municipiosSelecionados.length > 0) {
          const escolasList = escolasData
            .filter(
              (escola) =>
                municipiosSelecionados.includes(escola.municipio || "") &&
                (regionaisSelecionadas.length === 0 ||
                  regionaisSelecionadas.includes(escola.regional || ""))
            )
            .map((escola) => ({
              label: escola.nome,
              value: escola.id.toString(),
            }));
          setEscolas(escolasList);
        } else {
          setEscolas([]);
        }
      } catch (error) {
        console.error("Erro ao carregar dados dos filtros:", error);
      }
    };

    carregarDados();
  }, [
    filtros.regional,
    filtros.municipio,
  ]);

  const handleLimpar = () => {
    setFiltros({
      estado: ESTADO_PADRAO,
      regional: undefined,
      municipio: undefined,
      escola: undefined,
      saar: SAAR_PADRAO,
    });
  };



  const handleFiltrar = () => {
    // Filtros são aplicados automaticamente através do estado
  };

  return (
    <div
      className={`saar-filtros-container ${filtroVisivel ? "" : "collapsed"}`}
    >
      <div className="saar-filtros-header">
        <h3 className="saar-filtros-titulo">Filtros</h3>
        <Button
          label={filtroVisivel ? "Ocultar filtro" : "Mostrar filtro"}
          icon={filtroVisivel ? "pi pi-chevron-up" : "pi pi-chevron-down"}
          onClick={() => setFiltroVisivel(!filtroVisivel)}
          className="saar-filtros-toggle"
          text
          aria-label={filtroVisivel ? "Ocultar filtro" : "Mostrar filtro"}
        />
      </div>

      {filtroVisivel && (
        <div className="saar-filtros-content">
          <div className="saar-filtros-grid">
            <div className="saar-filtros-categoria saar-filtros-saar">
              <div className="saar-filtros-categoria-content">
                <div className="saar-filtro-item">
                  <label htmlFor="saar-select">SAAR</label>
                  <Dropdown
                    id="saar-select"
                    value={filtros.saar?.value}
                    options={[...OPCOES_SAAR]}
                    onChange={(e) => {
                      const selected = OPCOES_SAAR.find(
                        (opt) => opt.value === e.value
                      );
                      const novosFiltros = { ...filtros, saar: selected };
                      setFiltros(novosFiltros);
                      onFiltrosChange?.(novosFiltros);
                    }}
                    placeholder="Selecione a SAAR"
                    className="saar-dropdown"
                    showClear
                    optionLabel="label"
                    optionValue="value"
                  />
                </div>
              </div>
            </div>

            <div className="saar-filtros-categoria saar-filtros-hierarquia">
              <div className="saar-filtros-categoria-content">
                <div className="saar-filtro-item">
                  <label htmlFor="regional-select">Selecionar regional</label>
                  <MultiSelect
                    id="regional-select"
                    value={
                      Array.isArray(filtros.regional)
                        ? filtros.regional.map((r: { label: string; value: string }) => r.value)
                        : filtros.regional
                        ? [filtros.regional.value]
                        : []
                    }
                    options={regionais}
                    onChange={(e) => {
                      const selectedValues = e.value || [];
                      const selected = selectedValues
                        .map((val: string) =>
                          regionais.find((opt) => opt.value === val)
                        )
                        .filter(Boolean) as { label: string; value: string }[];
                      const novosFiltros = {
                        ...filtros,
                        regional: selected.length > 0 ? selected : undefined,
                        municipio: undefined,
                        escola: undefined,
                      };
                      setFiltros(novosFiltros);
                      onFiltrosChange?.(novosFiltros);
                    }}
                    placeholder="Selecionar regional"
                    className="saar-multiselect"
                    display="chip"
                    optionLabel="label"
                    optionValue="value"
                    showClear
                  />
                </div>

                <div className="saar-filtro-item">
                  <label htmlFor="municipio-select">Selecionar município</label>
                  <MultiSelect
                    id="municipio-select"
                    value={
                      Array.isArray(filtros.municipio)
                        ? filtros.municipio.map((m: { label: string; value: string }) => m.value)
                        : filtros.municipio
                        ? [filtros.municipio.value]
                        : []
                    }
                    options={municipios}
                    onChange={(e) => {
                      const selectedValues = e.value || [];
                      const selected = selectedValues
                        .map((val: string) =>
                          municipios.find((opt) => opt.value === val)
                        )
                        .filter(Boolean) as { label: string; value: string }[];
                      const novosFiltros = {
                        ...filtros,
                        municipio: selected.length > 0 ? selected : undefined,
                        escola: undefined,
                      };
                      setFiltros(novosFiltros);
                      onFiltrosChange?.(novosFiltros);
                    }}
                    placeholder="Selecionar município"
                    className="saar-multiselect"
                    display="chip"
                    optionLabel="label"
                    optionValue="value"
                    showClear
                    disabled={
                      !filtros.regional ||
                      (Array.isArray(filtros.regional)
                        ? filtros.regional.length === 0
                        : false)
                    }
                  />
                </div>

                <div className="saar-filtro-item">
                  <label htmlFor="escola-select">Selecionar escola</label>
                  <MultiSelect
                    id="escola-select"
                    value={
                      Array.isArray(filtros.escola)
                        ? filtros.escola.map((e: { label: string; value: string }) => e.value)
                        : filtros.escola
                        ? [filtros.escola.value]
                        : []
                    }
                    options={escolas}
                    onChange={(e) => {
                      const selectedValues = e.value || [];
                      const selected = selectedValues
                        .map((val: string) =>
                          escolas.find((opt) => opt.value === val)
                        )
                        .filter(Boolean) as { label: string; value: string }[];
                      const novosFiltros = {
                        ...filtros,
                        escola: selected.length > 0 ? selected : undefined,
                      };
                      setFiltros(novosFiltros);
                      onFiltrosChange?.(novosFiltros);
                    }}
                    placeholder="Selecionar escola"
                    className="saar-multiselect"
                    display="chip"
                    optionLabel="label"
                    optionValue="value"
                    showClear
                    disabled={
                      !filtros.municipio ||
                      (Array.isArray(filtros.municipio)
                        ? filtros.municipio.length === 0
                        : false)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="saar-filtros-actions">
            <Button
              label="Limpar"
              icon="pi pi-refresh"
              className="saar-button-limpar"
              onClick={handleLimpar}
            />
            <Button
              label="Filtrar"
              icon="pi pi-filter"
              className="saar-button-filtrar"
              onClick={handleFiltrar}
            />
          </div>
        </div>
      )}
    </div>
  );
}
