import { useState, useMemo, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { BreadCrumb } from "primereact/breadcrumb";
import type { MenuItem } from "primereact/menuitem";
import { loadEscolasFromCsv } from "../utils/csvParser";
import "./SAAR.Filtros.css";

interface FiltroContexto {
  estado?: { label: string; value: string };
  regional?: { label: string; value: string };
  municipio?: { label: string; value: string };
  escola?: { label: string; value: string };
  saar?: { label: string; value: string };
}

interface SAARFiltrosProps {
  onFiltrosChange?: (filtros: FiltroContexto) => void;
}

export default function SAARFiltros({ onFiltrosChange }: SAARFiltrosProps) {
  const [filtroVisivel, setFiltroVisivel] = useState<boolean>(true);
  const opcoesSAAR = [
    { label: "SAAR I", value: "saar-i" },
    { label: "SAAR II", value: "saar-ii" },
    { label: "Balanço Final", value: "balanco-final" },
  ];

  const [filtros, setFiltros] = useState<FiltroContexto>({
    estado: { label: "Espírito Santo", value: "espirito-santo" },
    regional: undefined,
    municipio: undefined,
    escola: undefined,
    saar: { label: "SAAR I", value: "saar-i" },
  });

  const estados = [{ label: "Espírito Santo", value: "espirito-santo" }];
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

        // Filtrar municípios baseado na regional selecionada
        if (filtros.regional) {
          const municipiosSet = new Set<string>();
          escolasData
            .filter((escola) => escola.regional === filtros.regional?.label)
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

        // Filtrar escolas baseado no município selecionado
        if (filtros.municipio) {
          const escolasList = escolasData
            .filter(
              (escola) =>
                escola.municipio === filtros.municipio?.label &&
                (!filtros.regional || escola.regional === filtros.regional?.label)
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
  }, [filtros.regional, filtros.municipio]);

  const handleLimpar = () => {
    setFiltros({
      estado: { label: "Espírito Santo", value: "espirito-santo" },
      regional: undefined,
      municipio: undefined,
      escola: undefined,
      saar: { label: "SAAR I", value: "saar-i" },
    });
  };

  const handleBreadcrumbClick = (
    nivel: "estado" | "regional" | "municipio" | "escola"
  ) => {
    switch (nivel) {
      case "estado":
        setFiltros({
          estado: { label: "Espírito Santo", value: "espirito-santo" },
          regional: undefined,
          municipio: undefined,
          escola: undefined,
          saar: filtros.saar,
        });
        break;
      case "regional":
        setFiltros({
          ...filtros,
          regional: undefined,
          municipio: undefined,
          escola: undefined,
        });
        break;
      case "municipio":
        setFiltros({
          ...filtros,
          municipio: undefined,
          escola: undefined,
        });
        break;
      case "escola":
        setFiltros({
          ...filtros,
          escola: undefined,
        });
        break;
    }
  };

  const breadcrumbItemsHierarquia: MenuItem[] = useMemo(() => {
    const items: MenuItem[] = [];

    if (filtros.estado) {
      items.push({
        label: filtros.estado.label,
        command: () => handleBreadcrumbClick("estado"),
      });
    }

    if (filtros.regional) {
      items.push({
        label: filtros.regional.label,
        command: () => handleBreadcrumbClick("regional"),
      });
    }

    if (filtros.municipio) {
      items.push({
        label: filtros.municipio.label,
        command: () => handleBreadcrumbClick("municipio"),
      });
    }

    if (filtros.escola) {
      items.push({
        label: filtros.escola.label,
        command: () => handleBreadcrumbClick("escola"),
      });
    }

    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros.estado, filtros.regional, filtros.municipio, filtros.escola]);

  const breadcrumbItemsSAAR: MenuItem[] = useMemo(() => {
    const items: MenuItem[] = [];

    if (filtros.saar) {
      items.push({
        label: filtros.saar.label,
        command: () => {
          setFiltros({ ...filtros, saar: undefined });
        },
      });
    }

    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros.saar]);

  const handleFiltrar = () => {
    // TODO: Implementar lógica de filtro
    console.log("Filtrar:", filtros);
  };

  return (
    <div
      className={`saar-filtros-container ${filtroVisivel ? "" : "collapsed"}`}
    >
      <div className="saar-filtros-header">
        <h3 className="saar-filtros-titulo">Filtros</h3>
        <button
          className="saar-filtros-toggle"
          onClick={() => setFiltroVisivel(!filtroVisivel)}
          aria-label={filtroVisivel ? "Ocultar filtro" : "Mostrar filtro"}
        >
          {filtroVisivel ? (
            <>
              Ocultar filtro
              <i className="pi pi-chevron-up" />
            </>
          ) : (
            <>
              Mostrar filtro
              <i className="pi pi-chevron-down" />
            </>
          )}
        </button>
      </div>

      {filtroVisivel && (
        <div className="saar-filtros-content">
          <div className="saar-filtros-grid">
            <div className="saar-filtros-categoria saar-filtros-saar">
              <div className="saar-filtros-breadcrumb">
                <BreadCrumb model={breadcrumbItemsSAAR} />
              </div>
              <div className="saar-filtros-categoria-content">
                <div className="saar-filtro-item">
                  <label htmlFor="saar-select">SAAR</label>
                  <Dropdown
                    id="saar-select"
                    value={filtros.saar?.value}
                    options={opcoesSAAR}
                    onChange={(e) => {
                      const selected = opcoesSAAR.find(
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
              <div className="saar-filtros-breadcrumb">
                <BreadCrumb model={breadcrumbItemsHierarquia} />
              </div>
              <div className="saar-filtros-categoria-content">
                <div className="saar-filtro-item">
                  <label htmlFor="regional-select">Selecionar regional</label>
                  <Dropdown
                    id="regional-select"
                    value={filtros.regional?.value}
                    options={regionais}
                    onChange={(e) => {
                      const selected = regionais.find(
                        (opt) => opt.value === e.value
                      );
                      const novosFiltros = {
                        ...filtros,
                        regional: selected,
                        municipio: undefined,
                        escola: undefined,
                      };
                      setFiltros(novosFiltros);
                      onFiltrosChange?.(novosFiltros);
                    }}
                    placeholder="Selecionar regional"
                    className="saar-dropdown"
                    showClear
                    optionLabel="label"
                    optionValue="value"
                  />
                </div>

                <div className="saar-filtro-item">
                  <label htmlFor="municipio-select">Selecionar município</label>
                  <Dropdown
                    id="municipio-select"
                    value={filtros.municipio?.value}
                    options={municipios}
                    onChange={(e) => {
                      const selected = municipios.find(
                        (opt) => opt.value === e.value
                      );
                      const novosFiltros = {
                        ...filtros,
                        municipio: selected,
                        escola: undefined,
                      };
                      setFiltros(novosFiltros);
                      onFiltrosChange?.(novosFiltros);
                    }}
                    placeholder="Selecionar município"
                    className="saar-dropdown"
                    showClear
                    disabled={!filtros.regional}
                    optionLabel="label"
                    optionValue="value"
                  />
                </div>

                <div className="saar-filtro-item">
                  <label htmlFor="escola-select">Selecionar escola</label>
                  <Dropdown
                    id="escola-select"
                    value={filtros.escola?.value}
                    options={escolas}
                    onChange={(e) => {
                      const selected = escolas.find(
                        (opt) => opt.value === e.value
                      );
                      const novosFiltros = { ...filtros, escola: selected };
                      setFiltros(novosFiltros);
                      onFiltrosChange?.(novosFiltros);
                    }}
                    placeholder="Selecionar escola"
                    className="saar-dropdown"
                    showClear
                    disabled={!filtros.municipio}
                    optionLabel="label"
                    optionValue="value"
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
