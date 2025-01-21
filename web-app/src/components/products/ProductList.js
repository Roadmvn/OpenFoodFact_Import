const ProductList = () => {
    let products = [];
    let loading = true;
    let error = null;
    let search = '';
    let page = 1;
    let totalPages = 1;
    const itemsPerPage = 12;

    const fetchProducts = async (searchQuery = '') => {
        try {
            loading = true;
            const endpoint = searchQuery
                ? `/api/products/search?query=${searchQuery}`
                : '/api/products';
            const response = await fetch(endpoint);
            const data = await response.json();
            products = data.data;
            totalPages = Math.ceil(data.data.length / itemsPerPage);
            error = null;
        } catch (err) {
            error = 'Error fetching products. Please try again later.';
            console.error('Error:', err);
        } finally {
            loading = false;
        }
    };

    const handleSearchChange = (event) => {
        search = event.target.value;
        page = 1;
        if (event.target.value) {
            fetchProducts(event.target.value);
        } else {
            fetchProducts();
        }
    };

    const handlePageChange = (event, value) => {
        page = value;
    };

    const getCurrentPageProducts = () => {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return products.slice(start, end);
    };

    // Initial load
    fetchProducts();

    return {
        products,
        loading,
        error,
        search,
        page,
        totalPages,
        handleSearchChange,
        handlePageChange,
        getCurrentPageProducts
    };
};

export default ProductList;
