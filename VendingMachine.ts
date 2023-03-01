export const ACCEPTABLE_COINS = {
    1: 1,
    2: 2,
    5: 5,
    10: 10,
    20: 20,
    50: 50
};

export const PRODUCTS = {
    A: {
        name: "A",
        price: 95,
        quantity: 10
    },
    B:  {
        name: "B",
        price: 126,
        quantity: 10
    },
    C:  {
        name: "C",
        price: 233,
        quantity: 10
    }
};

interface IProduct {
    name: string;
    price: number;
    quantity: number;
}

class Product implements IProduct {
    name: string;
    price: number;
    quantity: number;
}

class BoxOfCoins {
    coinTypes = {};

    constructor(coinTypes, shouldFill = false) {
        this.registerCoinTypes(coinTypes, shouldFill);
    }

    registerCoinTypes(types: Array<number>, shouldFill: boolean): void {
        for (let i = 0; i < types.length; i++) {
            this.coinTypes[types[i]] = shouldFill ? Number.MAX_SAFE_INTEGER : 0;
        }
    }

    insertCoin(coin: number): void {
        if(!this.coinTypes[coin]) {
            this.coinTypes[coin] = 0;
        }

        this.coinTypes[coin]++;
    }

    retrieveCoin(coin: number): number {
        if(!this.coinTypes[coin]) {
            throw new Error(`Invalid amount.`);
        }

        this.coinTypes[coin]--;
        return coin;
    }
}

class VendingMachine {
    boxOfCoins = null;
    currentTractionAmount = 0;

    constructor() {
        const coinTypes = Object.keys(ACCEPTABLE_COINS);
        this.boxOfCoins = new BoxOfCoins(coinTypes, true);
    }
    

    receiveCoin(coin: number) {
        if(!ACCEPTABLE_COINS[coin]) {
            throw new Error(`Invalid coin received "${coin}"`);
        }

        this.currentTractionAmount += coin;
    }

    acceptProductName(productName: string) {
        if(!PRODUCTS[productName]) {
            throw new Error(`Invalid product selected "${productName}".`);
        }

        const desiredProduct = PRODUCTS[productName];

        if(desiredProduct.price > this.currentTractionAmount) {
            throw new Error(`Not enough coins.`);
        }

        if(desiredProduct.quantity <= 0) {
            throw new Error(`"${productName}" is out of stock.`);
        }

        const product: Product = this.getProduct(productName);
        const change: BoxOfCoins = this.getChange(product.price);

        return [product, change];
    }

    getProduct(productName: string): Product {
        const product = PRODUCTS[productName];
        PRODUCTS[productName].quantity--;

        return product;
    }

    getChange(price: number): BoxOfCoins {
        if(price === this.currentTractionAmount) {
            return null;
        }

        const amountToReturn: number = this.currentTractionAmount - price;
        let coinsGatheredForReturn = 0;

        const coinTypes = Object.keys(ACCEPTABLE_COINS);
        const coinBox = new BoxOfCoins(coinTypes);

        let coinIndex = 0;
        const coinsToUse = Object.values(ACCEPTABLE_COINS).sort((a, b) => b - a);

        // Commented mistake
        // while(coinsGatheredForReturn === amountToReturn) {
        while(coinsGatheredForReturn < amountToReturn) {
            const currentCoin = coinsToUse[coinIndex];

            if(coinsGatheredForReturn + currentCoin > amountToReturn) {
                coinIndex++;
                continue;
            }

            coinsGatheredForReturn += currentCoin;
            
            const coin = this.getCoinFromDeposit(currentCoin);
            coinBox.insertCoin(coin);
        }

        return coinBox;
    }

    getCoinFromDeposit(coinType: number): number {
        const coin = this.boxOfCoins.retrieveCoin(coinType);
        return coin;
    }
}

function run() {
    const vendingMachine = new VendingMachine();

    const userCoins = [50, 50];
    const selectedProduct = PRODUCTS.A.name;

    for (let i = 0; i < userCoins.length; i++) {
        const coin = userCoins[i];
        vendingMachine.receiveCoin(coin);
    }

    const result = vendingMachine.acceptProductName(selectedProduct);
    console.log(result);
}

run();

export default VendingMachine;
