import { useEffect, useState } from "react";
import { ApplyDiscountContext } from "./ApplyDiscountContext";


export function ApplyDiscountProvider({ children }) {
    const [promotionForm, setPromotionForm] = useState('');
    const [discount, setDiscount] = useState(0);
    const [promoApplyStatus, setPromoApplyStatus] = useState('');
    const [subTotalPrice, setSubTotalPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    // let totalPrice = subTotalPrice - discount;

    const applyPromotionCode = (event, code = '', subTotalPrice ) => {
        event.preventDefault(); 
        if (code.length > 0) {
            // mock data before connecting with backend
            if (code === 'BABYCHUB') {
                const percentageDiscount = 30;
                const discount = Math.floor(subTotalPrice * percentageDiscount * 0.01);
                setDiscount(discount);
                setPromoApplyStatus('applied');
            } else {
                setDiscount(0);
                setPromoApplyStatus('wrong');
            }
        } else {
            setDiscount(0);
            console.log('code:', code)
            setPromoApplyStatus('');
        }
    };

    const calSubTotalPrice = (products) => {
        const subTotalPrice = products.reduce((total, item) => total + Object.values(item.selectPlan)[0], 0);
        setSubTotalPrice(subTotalPrice);
    };

    useEffect(() => {
        setTotalPrice(subTotalPrice - discount);
    }, [subTotalPrice, discount]);

    return (
        <ApplyDiscountContext.Provider
            value={{
                promotionForm,
                setPromotionForm,
                discount,
                promoApplyStatus,
                subTotalPrice,
                totalPrice,
                applyPromotionCode,
                calSubTotalPrice,
            }}
        >
            {children}
        </ApplyDiscountContext.Provider>
    );
}