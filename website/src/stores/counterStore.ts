import { create } from 'zustand';

export interface CounterState {
    count: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
    incrementBy: (amount: number) => void;
}

export const useCounterStore = create<CounterState>((set) => ({
    count: 0,
    increment: () => set(state => ({ count: state.count + 1 })),
    decrement: () => set(state => ({ count: state.count - 1 })),
    reset: () => set({ count: 0 }),
    incrementBy: (amount: number) => set(state => ({ count: state.count + amount })),
}));

// Selector hooks for better performance
export const useCount = () => useCounterStore(state => state.count);
export const useCounterActions = () =>
    useCounterStore(state => ({
        increment: state.increment,
        decrement: state.decrement,
        reset: state.reset,
        incrementBy: state.incrementBy,
    }));
