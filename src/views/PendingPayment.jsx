import { useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckoutContext } from "../context/CheckoutContext";
import { updateOrder } from "../services/orderService";
import { toast } from "sonner";
import { useRef } from "react";


export function PendingPayment() {
    const { order } = useContext(CheckoutContext);
    const navigate = useNavigate();
    const hasExecuted = useRef(false);

    const simulatePaymentConfirmation = useCallback(
        async (order) => {
            try {
                const data = await updateOrder(order._id, 'paid');  // simulate payment confirmation
                toast.success(data.libraryStatus);
                
            } catch (error) {
                console.error(error);
                toast.error(error);
            }
        }, []
    );
    
    useEffect(() => {
        console.log('useEffect')
        if (order && !hasExecuted.current) {
            hasExecuted.current = true;
            simulatePaymentConfirmation(order);
            
            setTimeout(() => {
                console.log('setTimeout run')
                navigate('/');
            }, 3000);    
        }
    }, [order]);

    return (
        <div className="grid h-screen">
            <h2 className="pt-24 font-semibold text-3xl text-center text-primary">
                Pending Payment...
            </h2>
        </div>
    );
}