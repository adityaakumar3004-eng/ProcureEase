function DashboardCard({ title, value, color }) {

    return (
        <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">

            {/* Top Accent */}
            <div
                className={`absolute left-0 top-0 h-1 w-full ${color.replace(
                    "text-",
                    "bg-"
                )}`}
            />

            {/* Card Title */}
            <h3 className="text-sm font-medium text-slate-500">

                {title}

            </h3>


            {/* Card Value */}
            <p
                className={`mt-3 text-3xl font-bold tracking-tight ${color}`}
            >

                {value}

            </p>


            {/* Bottom Label */}
            <div className="mt-4 flex items-center text-xs text-slate-400">

                <span className="mr-1 h-2 w-2 rounded-full bg-slate-300" />

                Updated overview

            </div>

        </div>
    );
}

export default DashboardCard;