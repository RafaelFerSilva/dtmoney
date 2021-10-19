import { createContext, ReactNode, useEffect, useState } from 'react'
import { api } from './services/api';

interface Transaction{
    id: number,
    title: string,
    type: string,
    category: string,
    amount: number,
    createdAt: string,
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

interface TransactionProviderProps {
    children: ReactNode;
}

interface TransactionsContextData {
    transactions: Transaction[];
    createTransactions: (transaction: TransactionInput) => Promise<void>;
}

export const TransactionsContext = createContext<TransactionsContextData>(
    {} as TransactionsContextData
);

export function TransactionsProvider({ children }: TransactionProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        api.get('transactions')
            .then(response => setTransactions(response.data.transactions))
    }, []);


    async function createTransactions(transactionInput: TransactionInput) {
        const response = await api.post('/transactions', {
            ...transactionInput,
            createdAt: new Date(),
        })
        const { transactions } = response.data;

        console.log(transactions)

        setTransactions([
            ...transactions,
            transactions,
        ]);
    }


    return (
        <TransactionsContext.Provider value={{ transactions, createTransactions }}>
            {children}
        </TransactionsContext.Provider>
    );
}
