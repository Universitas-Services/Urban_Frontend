export function DashboardCityscapeBackground() {
    return (
        <div aria-hidden className="dashboard-cityscape-layer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/asset/City.svg" alt="" />
            <div className="dashboard-cityscape-tint" />
        </div>
    );
}
