
import axios from "axios";
import { useEffect, useState } from "react";
import { ProductContext } from "./ProductContext";

const filters = {
    'age': [
        { min: 3, max: 4 },
        { min: 4, max: 6 },
        { min: 6, max: 9 },
        { min: 9, max: 12 },
        { min: 12, max: Infinity },
    ],
    'type': ['application', 'audiobook', 'course', 'ebook', 'worksheet'],
    'subject': ['coding', 'math', 'language', 'science', 'english', 'others', 'skill', 'art'],
    'price': [
        { min: 0, max: 100 },
        { min: 101, max: 500 },
        { min: 501, max: 1000 },
        { min: 1001, max: 2000 },
        { min: 2001, max: Infinity },
    ],
};

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterList, setFilterList] = useState({ age: [], type: [], subject: [], price: [] });
    const [filterProducts, setFilterProducts] = useState([]);

    const getProducts = async () => {
        const API_URL = 'https://68996cd3fed141b96b9f74eb.mockapi.io/babychub/products';
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            setProducts(response.data);
            setFilterProducts(response.data);
            // console.log(response.data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    const applyFilter = () => {
        let productsCopy = products.slice();
        console.log('original product:', products)
        if (filterList.age.length > 0) {
            productsCopy = productsCopy.filter(item => (
                filterList.age.some(ageRange => item.age.min >= ageRange.min && item.age.min <= ageRange.max)
            ));
        }

        if (filterList.price.length > 0) {
            productsCopy = productsCopy.filter(item => (
                filterList.price.some(priceRange => (
                    item.prices.oneTime ? item.prices.oneTime >= priceRange.min && item.prices.oneTime <= priceRange.max :
                        (item.prices.monthly >= priceRange.min && item.prices.monthly <= priceRange.max) ||
                        (item.prices.yearly >= priceRange.min && item.prices.yearly <= priceRange.max)
                ))
            ));
        }
        
        if (filterList.type.length > 0) {
            productsCopy = productsCopy.filter(item => (
                filterList.type.includes(item.type)
            ));
        }

        if (filterList.subject.length > 0) {
            productsCopy = productsCopy.filter(item => (
                filterList.subject.includes(...item.subjects)
            ));
        }
        console.log('product:', productsCopy);

        setFilterProducts(productsCopy);
    };

    const handleProductFilter = (filterTopic, filterOption) => {
            
        if (JSON.stringify(filterList[filterTopic]).includes(JSON.stringify(filterOption))) {
            console.log('remove')
            setFilterList({
                ...filterList,
                [filterTopic]: filterList[filterTopic].filter(item => JSON.stringify(item) !== JSON.stringify(filterOption))
            });
        } else {
            console.log('add')
            setFilterList({
                ...filterList,
                [filterTopic]: [
                    ...filterList[filterTopic],
                    filterOption
                ]
            }); 
        }
    }

    useEffect(() => {
        getProducts();
    }, [])

    useEffect(() => {
        applyFilter();
        console.log('apply filter')
    }, [filterList]);

    return (
        <ProductContext.Provider
            value={{products, loading, filters, filterProducts, handleProductFilter}}
        >
            {children}
        </ProductContext.Provider>
    );
}
