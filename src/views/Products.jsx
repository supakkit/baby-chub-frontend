import { useCallback, useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { ProductFilter } from "../components/ProductFilter";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProduct } from "../context/ProductProvider";


export function Products() {
    const { pageSize, loadingProducts, error, getProductsByQuery } = useProduct();
    const [filteredProducts, setFilteredProducts] = useState([]);

    const defaultFilters = { age: [], type: [], subject: [], price: [] };
    const [selectedFilters, setSelectedFilters] = useState(defaultFilters);
    
    const [searchParams, setSearchParams] = useSearchParams();
    
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
    }, [setSearchParams, pageSize]);

    const fetchProducts = async (query) => {
        const data = await getProductsByQuery(query);
        // console.log('data:', data)
        setFilteredProducts(data.products || []);
        
        if (typeof data.total === "number") setTotal(data.total);
        if (typeof data.page === "number") setPage(data.page);
        // console.log('total:', data.total)

        // reflect current state in URL
        setURLParams({ ...selectedFilters, page, limit: pageSize });    
    };

    const handlePrev = () => {
        fetchProducts({ ...selectedFilters, page: page-1 });
    };

    const handleNext = () => {
         if (page < totalPages) fetchProducts({ ...selectedFilters, page: page+1 });
    };

    const handleApplyFilter = () => {
        // console.log('apply selectedFilters:', selectedFilters);
        fetchProducts(selectedFilters);
    };

    const clearFilter = () => {
        setSelectedFilters(defaultFilters);
        fetchProducts(defaultFilters);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // if (loadingProducts)
    //     return (
    //     <div className="min-h-screen text-center mt-10 text-xl text-primary">Loading products...</div>
    // );

    if (error)
        return <div className="min-h-screen text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="layout py-8 min-h-screen relative"> 
            <div
                className="text-3xl font-bold text-center text-primary pb-8"
            >Products</div>
            {/* {loadingProducts
            ? <div className="min-h-screen text-center mt-10 text-xl text-primary">Loading products...</div>
            : filteredProducts?.length > 0 ? null :
            <div className="text-center text-xl text-primary">Sorry, no products found!</div>} */}
            <div className="flex flex-col md:flex-row gap-8 mb-16 relative">
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
                {loadingProducts
                ? <div className="md:absolute w-full text-center mt-10 text-xl text-primary">Loading products...</div>
                : filteredProducts?.length > 0 ?
                    <div className="grid content-start grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div> 
                : <div className="md:absolute w-full text-center mt-10 text-xl text-primary">Sorry, no products found!</div>
                }
            </div>
            <div className="absolute w-full bottom-0 flex justify-center items-center py-4">
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