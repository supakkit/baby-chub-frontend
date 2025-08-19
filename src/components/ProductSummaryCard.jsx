import { Badge } from "@/components/ui/badge"


export function ProductSummaryCard({ product, removeFromCart }) {


  return (
      <div className="flex gap-6 rounded-lg h-36 hover:bg-neutral-50 relative pr-4">
          <div
            onClick={() => removeFromCart(product)}
            className="text-center absolute top-2 right-2 w-6 h-6 rounded-full hover:transition-opacity duration-500 ease-in-out hover:bg-primary/30 cursor-pointer"
          >
            X
          </div>
          <img
            src={product.image}
            alt=""
            className="rounded-lg max-w-36 object-cover"
          />
          <div className="flex flex-col gap-2 py-2">
              <h3
                className="text-lg md:text-xl font-semibold line-clamp-2"
              >{product.name}</h3>
              <div className="flex items-center gap-2">
                  <Badge 
                    variant="default"
                    className=""
                  >{product.type}</Badge>
                  <div
                    className="border-l-1 h-4"
                  ></div>
                  <p
                    className="text-sm"
                  >{product.prices[0].value} THB</p>
              </div>
              <p
                className="text-sm line-clamp-2"
              >{product.description}</p>
          </div>
      </div>
  );
}
