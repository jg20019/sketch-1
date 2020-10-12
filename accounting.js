function sum(arr, fn=(x) => x) {
    return arr.reduce((total, item) => {
        return total + fn(item)
    }, 0); 
}

const DEFAULT_SHIPPING = 5 

function calculateSubTotal(items) {
    return sum(items, item => {
        return item.price * item.quantity
    })
}

function applyDiscount(subTotal, discount=0) {
    return subTotal - subTotal * discount 
}

function addSalesTax(subTotal) {
    const SALES_TAX = 1.1
    return subTotal * SALES_TAX
}

function addShippingCosts(subTotal, shipping_costs=5) {
    return subTotal + shipping_costs 
}

class $ {
    constructor(val) {
        this.val = val; 
    }

    andThen(...exprs) {
        // expr : function ..args
        return exprs.reduce((result, expr) => {
            if (typeof expr === 'function'){
                return expr(result)
            } else {
                const [fn, ...args] = expr 
                return fn(...[result].concat(args))
            }
        }, this.val) 
    }
}

function calculateTotal(items, options={}) {
    let shipping = 0; 

    if (options.shippingCost !== 0) {
        shipping = options.shippingCost || DEFAULT_SHIPPING; 
    }

    const discount = options.discount || 0; 
    return new $(calculateSubTotal(items)).andThen(
                [applyDiscount, discount],
                addSalesTax, 
                [addShippingCosts, shipping]
    ); 
}

const items = [
    {price: 5, quantity: 4}
]; 


console.log(calculateTotal(items))