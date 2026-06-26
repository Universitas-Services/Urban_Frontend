import { InicioHero } from './InicioHero';
import { InicioServiciosGrid } from './InicioServiciosGrid';
import { InicioActualidad } from './InicioActualidad';
import { InicioConocenos } from './InicioConocenos';

export function InicioPageContent() {
    return (
        <div className="flex-1 p-6">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 md:gap-5">
                <InicioHero />
                <InicioServiciosGrid />
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
                    <InicioActualidad />
                    <InicioConocenos />
                </div>
            </div>
        </div>
    );
}
