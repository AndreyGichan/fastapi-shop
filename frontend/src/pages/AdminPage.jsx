import Header from "../components/Header"

const AdminPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-gray-600 mt-2">Admin page content will be implemented here.</p>
            </div>
        </div>
    )
}

export default AdminPage
