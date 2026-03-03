import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useStockData, StockQuote } from './useStockData';

export interface Investment {
    id: string;
    user_id: string;
    symbol: string;
    name: string;
    quantity: number;
    average_price: number;
    type: string;
    created_at: string;
    updated_at: string;
}

export interface InvestmentWithQuote extends Investment {
    quote?: StockQuote;
    currentValue: number;
    investedValue: number;
    profitLoss: number;
    profitLossPercent: number;
}

export function useInvestments() {
    const { user } = useAuth();
    const { getBatchQuotes } = useStockData();
    const [investments, setInvestments] = useState<InvestmentWithQuote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInvestments = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('investments')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            const items = data as Investment[];

            if (items.length === 0) {
                setInvestments([]);
                return;
            }

            // Fetch live quotes for stock/mutual fund symbols
            const symbolsToFetch = items
                .filter(item => item.type === 'stock' || item.type === 'mutual_fund')
                .map(item => item.symbol);

            const quotes = await getBatchQuotes(symbolsToFetch);
            const quotesMap = new Map(quotes.map(q => [q.symbol, q]));

            const enrichedInvestments: InvestmentWithQuote[] = items.map(item => {
                const quote = quotesMap.get(item.symbol);
                // If bank/fd/rd or gold, we might not have a quote, use average_price or hardcoded logic
                // For simplicity, if no live quote, assume price = average_price
                const currentPrice = quote?.price || item.average_price;

                const investedValue = item.quantity * item.average_price;
                const currentValue = item.quantity * currentPrice;
                const profitLoss = currentValue - investedValue;
                const profitLossPercent = investedValue > 0 ? (profitLoss / investedValue) * 100 : 0;

                return {
                    ...item,
                    quote,
                    currentValue,
                    investedValue,
                    profitLoss,
                    profitLossPercent
                };
            });

            setInvestments(enrichedInvestments);
        } catch (err: any) {
            setError(err.message);
            console.error('Error fetching investments:', err);
        } finally {
            setLoading(false);
        }
    }, [user, getBatchQuotes]);

    useEffect(() => {
        fetchInvestments();
    }, [fetchInvestments]);

    const addInvestment = async (investment: Omit<Investment, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
        if (!user) return { error: new Error('Not authenticated') };

        try {
            const { data, error } = await supabase
                .from('investments')
                .insert([{ ...investment, user_id: user.id }])
                .select()
                .single();

            if (error) throw error;

            await fetchInvestments();
            return { data, error: null };
        } catch (err: any) {
            return { data: null, error: err };
        }
    };

    const removeInvestment = async (id: string) => {
        try {
            const { error } = await supabase
                .from('investments')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setInvestments(prev => prev.filter(i => i.id !== id));
            return { error: null };
        } catch (err: any) {
            return { error: err };
        }
    };

    return { investments, loading, error, fetchInvestments, addInvestment, removeInvestment };
}
