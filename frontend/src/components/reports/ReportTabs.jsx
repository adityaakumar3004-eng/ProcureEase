function ReportTabs({ activeTab, setActiveTab }) {
    const tabs = [
        {
            id: "sales",
            label: "Sales Report",
        },
        {
            id: "purchases",
            label: "Purchase Report",
        },
        {
            id: "inventory",
            label: "Inventory Report",
        },
        {
            id: "vendors",
            label: "Vendor Report",
        },
    ];

    return (
        <div className="flex gap-3 mb-6 flex-wrap">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-5 py-2 rounded-lg font-medium transition ${
                        activeTab === tab.id
                            ? "bg-blue-600 text-white"
                            : "bg-white border hover:bg-gray-100"
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

export default ReportTabs;