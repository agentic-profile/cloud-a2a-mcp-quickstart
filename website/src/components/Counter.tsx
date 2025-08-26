import { useState } from 'react';
import { useCount, useCounterActions } from '../stores/counterStore';

export const Counter = () => {
    const [incrementAmount, setIncrementAmount] = useState(5);
    const count = useCount();
    const { increment, decrement, reset, incrementBy } = useCounterActions();

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Counter Store Demo
            </h3>

            <div className="text-center mb-6">
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                    {count}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Current count value from Zustand store
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                    onClick={increment}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
                >
                    +1
                </button>
                <button
                    onClick={decrement}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                >
                    -1
                </button>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                    <input
                        type="number"
                        value={incrementAmount}
                        onChange={e => setIncrementAmount(Number(e.target.value))}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        min="1"
                        max="100"
                    />
                    <button
                        onClick={() => incrementBy(incrementAmount)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                    >
                        Add {incrementAmount}
                    </button>
                </div>

                <button
                    onClick={reset}
                    className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                >
                    Reset to 0
                </button>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                This counter demonstrates Zustand's simple state management with actions and
                selectors.
            </div>
        </div>
    );
};
