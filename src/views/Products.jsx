import { useCallback, useContext, useEffect, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import { ProductCard } from "../components/ProductCard";
import { ProductFilter } from "../components/ProductFilter";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../services/productsService";
import { Button } from "@/components/ui/button";


export function Products() {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [error, setError] = useState("");

    const defaultFilters = { age: [], type: [], subject: [], price: [] };
    const [selectedFilters, setSelectedFilters] = useState(defaultFilters);
    
    const [searchParams, setSearchParams] = useSearchParams();
    const pageSize = 4;
    const [page, setPage] = useState(() => Math.max(1, parseInt(searchParams.get("page") || "1", 10)));
    const [total, setTotal] = useState(0);
    const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));

    const setURLParams = useCallback(({age = [], price = [], type = [], subject = [], page = 1, limit = pageSize, q = ''} = {}) => {
        const paramsObj = {
            page: String(page),
            limit: String(limit),
        };

        if (age.length > 0) paramsObj.age = JSON.stringify(age);
        if (price.length > 0) paramsObj.price = JSON.stringify(price);
        if (type.length > 0) paramsObj.type = JSON.stringify(type);
        if (subject.length > 0) paramsObj.subject = JSON.stringify(subject);
        if (q.trim().length > 0) paramsObj.q = String(q).trim();

        const params = new URLSearchParams(paramsObj);
        setSearchParams(params, { replace: true });
    }, [setSearchParams]);

    const fetchProducts = useCallback(
        async ({ age = [], price = [], type = [], subject = [], page = 1, limit = pageSize, q = '' } = {}) => {
            setLoadingProducts(true);
            const paramsObj = {
                page: String(page),
                limit: String(limit),
            };

            if (age.length > 0) paramsObj.age = JSON.stringify(age);
            if (price.length > 0) paramsObj.price = JSON.stringify(price);
            if (type.length > 0) paramsObj.type = JSON.stringify(type);
            if (subject.length > 0) paramsObj.subject = JSON.stringify(subject);
            if (q.trim().length > 0) paramsObj.q = String(q).trim();

            try {
                console.log('paramsObj:', paramsObj);
                const data = await getProducts( paramsObj );
                setFilteredProducts(data.products || []);
                // console.log('data:', data)
                if (typeof data.total === "number") setTotal(data.total);
                if (typeof data.page === "number") setPage(data.page);
                // console.log('total:', data.total)

                // reflect current state in URL
                setURLParams({ ...selectedFilters, page, limit: pageSize });
            } catch (err) {
                console.error(err);
                setError("Failed to load products.");
            } finally {
                setLoadingProducts(false);
            }
        },
        [page, setURLParams]
    );

    const handlePrev = () => {
        fetchProducts({ ...selectedFilters, page: page-1 });
    };

    const handleNext = () => {
         if (page < totalPages) fetchProducts({ ...selectedFilters, page: page+1 });
    };

    const handleApplyFilter = () => {
        console.log('apply selectedFilters:', selectedFilters);
        fetchProducts(selectedFilters);
    };

    const clearFilter = () => {
        setSelectedFilters(defaultFilters);
        fetchProducts(defaultFilters);
    };

    useEffect(() => {
        fetchProducts({q: 'logic'});
    }, []);

    if (loadingProducts)
        return (
        <div className="min-h-screen text-center mt-10 text-xl text-primary">Loading products...</div>
    );

    if (error)
        return <div className="min-h-screen text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="layout py-8 min-h-screen"> 
            <div
                className="text-4xl font-bold text-center text-primary pb-8"
            >Products</div>
            {filteredProducts?.length === 0 ? 
            <div className="text-center text-xl text-primary py-4">Sorry, no products matched your selection...</div> : null}
            <div className="flex flex-col md:flex-row gap-8">
                <div className="">
                    <ProductFilter
                        products={filteredProducts}
                        setFilteredProducts={setFilteredProducts} 
                        defaultFilters={defaultFilters}
                        selectedFilters={selectedFilters}
                        setSelectedFilters={setSelectedFilters}
                        handleApplyFilter={handleApplyFilter}
                        clearFilter={clearFilter}
                    />
                </div>
                {filteredProducts?.length === 0 ? null :
                    <div className="grid content-start grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>    
                }
            </div>
            <div className="flex justify-center items-center pt-8">
                <Button
                    variant="link"
                    onClick={handlePrev}
                    disabled={page <= 1}
                    className={`font-bold text-md ${
                    page <= 1
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                >
                    Prev
                </Button>
                <span className="text-primary font-mono">
                    Page {page} of {Math.max(1, Math.ceil((total || 0) / pageSize))}
                </span>
                <Button
                    variant="link"
                    onClick={handleNext}
                    disabled={
                        page >= Math.max(1, Math.ceil((total || 0) / pageSize))
                    }
                    className={`font-bold text-md ${
                        page >= Math.max(1, Math.ceil((total || 0) / pageSize))
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                >
                    Next
                </Button>    
            </div>
        </div>
    );
}