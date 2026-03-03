import { useMemo } from 'react';
import { Transaction } from './useTransactions';
import { useLanguage } from '@/contexts/LanguageContext';

export interface FlaggedTransaction extends Transaction {
    riskScore: 'low' | 'warning' | 'critical';
    reason: string;
    reason_ta?: string;
}

export const useFraudAnalysis = (transactions: Transaction[]) => {
    const { language } = useLanguage();

    const flaggedTransactions = useMemo(() => {
        const flagged: FlaggedTransaction[] = [];
        const sortedTransactions = [...transactions].sort((a, b) =>
            new Date(b.date + ' ' + (b.time || '00:00')).getTime() -
            new Date(a.date + ' ' + (a.time || '00:00')).getTime()
        );

        // 1. Duplicate Detection (Identical amount & merchant/description within 1 hour)
        for (let i = 0; i < sortedTransactions.length; i++) {
            for (let j = i + 1; j < sortedTransactions.length; j++) {
                const t1 = sortedTransactions[i];
                const t2 = sortedTransactions[j];

                if (t1.amount === t2.amount && t1.description === t2.description) {
                    const d1 = new Date(t1.date + ' ' + (t1.time || '00:00')).getTime();
                    const d2 = new Date(t2.date + ' ' + (t2.time || '00:00')).getTime();
                    const diffInMinutes = Math.abs(d1 - d2) / (1000 * 60);

                    if (diffInMinutes <= 60) {
                        flagged.push({
                            ...t1,
                            riskScore: 'warning',
                            reason: 'Potential duplicate transaction detected within an hour.',
                            reason_ta: 'ஒரு மணி நேரத்திற்குள் ஒரே மாதிரியான பரிவர்த்தனை கண்டறியப்பட்டது.'
                        });
                        break; // Avoid double flagging the same pair
                    }
                }
            }
        }

        // 2. Unusual Spikes (Exceeding 3x category average)
        const categoryTotals: Record<string, { sum: number, count: number }> = {};
        transactions.forEach(t => {
            if (!categoryTotals[t.category]) categoryTotals[t.category] = { sum: 0, count: 0 };
            categoryTotals[t.category].sum += Number(t.amount);
            categoryTotals[t.category].count += 1;
        });

        transactions.forEach(t => {
            const avg = categoryTotals[t.category].sum / categoryTotals[t.category].count;
            if (t.amount > avg * 3 && t.amount > 5000) { // Only flag substantial spikes
                // Check if already flagged as duplicate
                if (!flagged.some(f => f.id === t.id)) {
                    flagged.push({
                        ...t,
                        riskScore: 'critical',
                        reason: `Unusually high amount for ${t.category}. 300% higher than your average.`,
                        reason_ta: `${t.category} பிரிவில் வழக்கத்திற்கு மாறான அதிகத் தொகை. உங்கள் சராசரியை விட 300% அதிகம்.`
                    });
                }
            }
        });

        // 3. Velocity Checks (3+ transactions within 10 minutes)
        for (let i = 0; i < sortedTransactions.length - 2; i++) {
            const t1 = sortedTransactions[i];
            const t2 = sortedTransactions[i + 1];
            const t3 = sortedTransactions[i + 2];

            const d1 = new Date(t1.date + ' ' + (t1.time || '00:00')).getTime();
            const d3 = new Date(t3.date + ' ' + (t3.time || '00:00')).getTime();
            const diffInMinutes = Math.abs(d1 - d3) / (1000 * 60);

            if (diffInMinutes <= 10) {
                [t1, t2, t3].forEach(t => {
                    if (!flagged.some(f => f.id === t.id)) {
                        flagged.push({
                            ...t,
                            riskScore: 'critical',
                            reason: 'Rapid-fire transactions detected (Velocity alert).',
                            reason_ta: 'குறுகிய காலத்தில் பல பரிவர்த்தனைகள் கண்டறியப்பட்டன.'
                        });
                    }
                });
            }
        }

        return flagged;
    }, [transactions]);

    return { flaggedTransactions };
};
