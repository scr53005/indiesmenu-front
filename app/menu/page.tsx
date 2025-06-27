// indiesmenu-front/app/menu/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function MenuPage() {
  const [dishes, setDishes] = useState([]);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const table = searchParams.get('table') || 'Unknown';

  useEffect(() => {
    fetch('http://localhost:3000/api/dishes')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch dishes');
        return res.json();
      })
      .then(setDishes)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl">Menu for Table {table}</h1>
      <ul>
        {dishes.map((dish: any) => (
          <li key={dish.id} className="py-2">
            {dish.name} - ${dish.price}
            {dish.categories.length > 0 && (
              <span> ({dish.categories.map((c: any) => c.name).join(', ')})</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}