'use client';

import { useEffect, useState } from 'react';
import type { Estado, Municipio } from '@universitas/sdk-global';
import { sdkApi } from '@/lib/api/universitas.sdk';

export function useBibliotecaLegalTerritorioFilters() {
    const [estados, setEstados] = useState<Estado[]>([]);
    const [municipios, setMunicipios] = useState<Municipio[]>([]);
    const [selectedEstadoId, setSelectedEstadoId] = useState<number | null>(null);
    const [selectedMunicipioNombre, setSelectedMunicipioNombre] = useState('all');
    const [isLoadingEstados, setIsLoadingEstados] = useState(false);
    const [isLoadingMunicipios, setIsLoadingMunicipios] = useState(false);

    useEffect(() => {
        const loadEstados = async () => {
            setIsLoadingEstados(true);
            try {
                const response = await sdkApi.territorio.getEstados();
                setEstados(response.data);
            } catch (error) {
                console.error('Error loading estados:', error);
            } finally {
                setIsLoadingEstados(false);
            }
        };

        void loadEstados();
    }, []);

    useEffect(() => {
        const loadMunicipios = async () => {
            if (!selectedEstadoId) {
                setMunicipios([]);
                return;
            }

            setIsLoadingMunicipios(true);
            try {
                const response = await sdkApi.territorio.getMunicipios(selectedEstadoId);
                setMunicipios(response.data);
            } catch (error) {
                console.error('Error loading municipios:', error);
            } finally {
                setIsLoadingMunicipios(false);
            }
        };

        void loadMunicipios();
    }, [selectedEstadoId]);

    const selectedEstadoNombre = estados.find((estado) => estado.id === selectedEstadoId)?.nombre ?? null;

    const handleEstadoChange = (value: string) => {
        if (value === 'all') {
            setSelectedEstadoId(null);
            setSelectedMunicipioNombre('all');
            setMunicipios([]);
            return;
        }

        setSelectedEstadoId(Number.parseInt(value, 10));
        setSelectedMunicipioNombre('all');
    };

    const handleMunicipioChange = (value: string) => {
        setSelectedMunicipioNombre(value);
    };

    const resetTerritorioFilters = () => {
        setSelectedEstadoId(null);
        setSelectedMunicipioNombre('all');
        setMunicipios([]);
    };

    return {
        estados,
        municipios,
        selectedEstadoId,
        selectedEstadoNombre,
        selectedMunicipioNombre,
        isLoadingEstados,
        isLoadingMunicipios,
        handleEstadoChange,
        handleMunicipioChange,
        resetTerritorioFilters,
    };
}
