import { useEffect, useState } from "react";
import { getSalesReport } from "../../services/reportService";

function SalesReport() {

    const [report, setReport] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSalesReport();
    }, []);

    const fetchSalesReport = async () => {

        try {

            setLoading(true);

            const response = await getSalesReport();

            setReport(response.data);

        } catch (error) {

            console.error(
                "Error fetching sales report:",
                error
            );

        } finally {

            setLoading(false);

        }
    };

    if (loading) {

        return (
            <p>
                Loading sales report...
            </p>
        );
    }

    if (!report) {

        return (
            <p className="text-red-500">
                Failed to load sales report.
            </p>
        );
    }

    return (

        <div>

            {/* Summary Cards */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                <div className="bg-white shadow rounded-lg p-6">

                    <p className="text-gray-500">
                        Total Sales
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {report.summary.totalSales}
                    </h2>

                </div>

                <div className="bg-white shadow rounded-lg p-6">

                    <p className="text-gray-500">
                        Total Revenue
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        ₹{report.summary.totalRevenue}
                    </h2>

                </div>

            </div>


            {/* Sales Details */}

            <div className="bg-white shadow rounded-lg overflow-hidden">

                <h2 className="text-xl font-bold p-6">
                    Sales Details
                </h2>

                <table className="min-w-full">

                    <thead className="bg-gray-100">

                    <tr>

                        <th className="px-6 py-3 text-left">
                            Sale ID
                        </th>

                        <th className="px-6 py-3 text-left">
                            Product ID
                        </th>

                        <th className="px-6 py-3 text-left">
                            Product Name
                        </th>

                        <th className="px-6 py-3 text-left">
                            Quantity
                        </th>

                        <th className="px-6 py-3 text-left">
                            Price
                        </th>

                        <th className="px-6 py-3 text-left">
                            Total Amount
                        </th>

                        <th className="px-6 py-3 text-left">
                            Date
                        </th>

                    </tr>

                    </thead>


                    <tbody>

                    {report.sales.length === 0 ? (

                        <tr>

                            <td
                                colSpan="7"
                                className="text-center py-6 text-gray-500"
                            >
                                No sales records found.
                            </td>

                        </tr>

                    ) : (

                        report.sales.map((sale) => (

                            <tr
                                key={sale.id}
                                className="border-t hover:bg-gray-50"
                            >

                                <td className="px-6 py-4">
                                    #{sale.id}
                                </td>

                                <td className="px-6 py-4">
                                    #{sale.productId}
                                </td>

                                <td className="px-6 py-4">
                                    {sale.productName}
                                </td>

                                <td className="px-6 py-4">
                                    {sale.quantity}
                                </td>

                                <td className="px-6 py-4">
                                    ₹{sale.price}
                                </td>

                                <td className="px-6 py-4">
                                    ₹{sale.totalAmount}
                                </td>

                                <td className="px-6 py-4">
                                    {new Date(
                                        sale.createdAt
                                    ).toLocaleDateString()}
                                </td>

                            </tr>

                        ))

                    )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default SalesReport;