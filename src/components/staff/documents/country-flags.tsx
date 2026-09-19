'use client';

import * as React from 'react';
import { hasFlag, countries as flagCountryCodes } from 'country-flag-icons';
import * as FlagIcons from 'country-flag-icons/react/3x2';
import { Globe2 } from 'lucide-react';
import countries from 'i18n-iso-countries';
import esLocale from 'i18n-iso-countries/langs/es.json';

countries.registerLocale(esLocale);

type FlagComponent = React.ComponentType<React.SVGProps<SVGSVGElement> & { title?: string }>;

export type CountryOption = {
    code: string;
    name: string;
};

let cachedWorldCountries: CountryOption[] | null = null;

/** Lista de países con nombre en español + ISO alpha-2 (con bandera disponible). */
export function getWorldCountriesEs(): CountryOption[] {
    if (cachedWorldCountries) return cachedWorldCountries;

    cachedWorldCountries = flagCountryCodes
        .filter((code) => code.length === 2 && hasFlag(code))
        .map((code) => {
            const name = countries.getName(code, 'es');
            return name ? { code, name } : null;
        })
        .filter((item): item is CountryOption => item !== null)
        .sort((a, b) => a.name.localeCompare(b.name, 'es'));

    return cachedWorldCountries;
}

export function findCountryByName(name: string): CountryOption | undefined {
    const normalized = name.trim().toLowerCase();
    if (!normalized) return undefined;
    return getWorldCountriesEs().find((c) => c.name.toLowerCase() === normalized);
}

export function CountryFlag({ code, title, className }: { code?: string; title: string; className?: string }) {
    const flagClass = className ?? 'h-4 w-6 shrink-0 rounded-[2px] object-cover shadow-sm';

    if (!code || !hasFlag(code)) {
        return <Globe2 className="size-4 shrink-0 text-muted-foreground" aria-hidden />;
    }

    const Flag = (FlagIcons as Record<string, FlagComponent>)[code];
    if (!Flag) {
        return <Globe2 className="size-4 shrink-0 text-muted-foreground" aria-hidden />;
    }

    return <Flag title={title} className={flagClass} />;
}
