interface DashboardCityscapeBackgroundProps {
    imageSrc?: string;
}

export function DashboardCityscapeBackground({ imageSrc = '/asset/mapa.svg' }: DashboardCityscapeBackgroundProps) {
    return (
        <div aria-hidden className="dashboard-cityscape-layer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageSrc} alt="" />
            <div className="dashboard-cityscape-tint" />
        </div>
    );
}
