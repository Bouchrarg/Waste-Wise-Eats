import React from 'react';

const StaticStorageTips = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold text-orange-600 mb-4">Food Storage & Preservation Tips</h1>
      <p className="text-lg mb-6">🍽️ <strong>Keep Your Food Fresh Longer!</strong></p>
      
      <p className="mb-4">
        Food waste often happens because we don’t store food properly. With the right storage and preservation techniques, 
        you can reduce waste, save money, and keep food fresh longer.
      </p>

      <h2 className="text-2xl font-semibold text-green-600 mt-8 mb-2">🥕 General Food Storage Rules</h2>
      <ul className="list-disc list-inside space-y-2">
        <li><strong>First In, First Out (FIFO):</strong> Always use older food before newer purchases.</li>
        <li><strong>Label & Date Everything:</strong> Write dates on containers to avoid forgetting leftovers.</li>
        <li><strong>Keep Your Fridge Organized:</strong> Store similar items together for easy access.</li>
        <li><strong>Know the Right Temperature:</strong><br />
          Fridge: 1-4°C (34-40°F)<br />
          Freezer: -18°C (0°F) or lower
        </li>
        <li><strong>Avoid Overpacking:</strong> Proper air circulation keeps food fresh longer.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-green-600 mt-8 mb-2">🥩 How to Store Different Types of Food</h2>
      
      <h3 className="text-xl font-semibold text-orange-500 mt-6">🍎 Fruits & Vegetables</h3>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li><strong>Fridge:</strong> Apples, berries, carrots, leafy greens, cucumbers</li>
        <li><strong>Counter:</strong> Bananas, tomatoes, potatoes, onions (keep dry)</li>
        <li><strong>Special Tip:</strong> Store herbs in water like a bouquet for freshness!</li>
      </ul>

      <h3 className="text-xl font-semibold text-orange-500 mt-6">🍞 Bread & Baked Goods</h3>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li><strong>Room Temperature:</strong> Store in an airtight container</li>
        <li><strong>Freezing Option:</strong> Freeze slices in a sealed bag for longer life</li>
      </ul>

      <h3 className="text-xl font-semibold text-orange-500 mt-6">🥩 Meat, Poultry & Fish</h3>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li><strong>Fridge:</strong> Use within 1–2 days or freeze immediately</li>
        <li><strong>Freezer:</strong> Wrap tightly in plastic wrap or vacuum-seal for long-term storage</li>
      </ul>

      <h3 className="text-xl font-semibold text-orange-500 mt-6">🧀 Dairy & Eggs</h3>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li><strong>Milk & Yogurt:</strong> Store at the back of the fridge (coldest part)</li>
        <li><strong>Cheese:</strong> Wrap in wax paper, then in a plastic bag</li>
        <li><strong>Eggs:</strong> Keep in their original carton (not in the fridge door)</li>
      </ul>

      <h3 className="text-xl font-semibold text-orange-500 mt-6">🍚 Dry Goods</h3>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li>Store in airtight containers to prevent pests</li>
        <li>Keep in a cool, dry place away from sunlight</li>
      </ul>

      <h2 className="text-2xl font-semibold text-green-600 mt-8 mb-2">❄️ Freezing & Preserving Food the Right Way</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Blanch vegetables before freezing to keep color and nutrients</li>
        <li>Use ice cube trays for freezing leftover broth, sauces, or herbs</li>
        <li>Freeze in small portions to make defrosting easier</li>
        <li>Label frozen items with dates (food is best within 3–6 months)</li>
      </ul>

      <h2 className="text-2xl font-semibold text-green-600 mt-8 mb-2">💡 Bonus: Reduce Waste with Smart Preservation!</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>🥒 <strong>Pickling:</strong> Preserve cucumbers, onions, and carrots in vinegar</li>
        <li>🍓 <strong>Drying:</strong> Dehydrate fruits like apples & mangoes for snacks</li>
        <li>🍲 <strong>Canning:</strong> Store homemade sauces or jams in sealed jars</li>
      </ul>

      <p className="mt-8 text-lg font-medium text-green-700">
        ✅ Follow these tips to keep your food fresh, reduce waste, and save money!
      </p>
    </div>
  );
};

export default StaticStorageTips;
