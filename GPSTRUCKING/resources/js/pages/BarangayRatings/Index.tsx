import React from 'react';
import { InertiaLink } from '@inertiajs/react';

type Props = {
  barangays: {
    id: number;
    name: string;
    avg_rating: number;
    total_ratings: number;
  }[];
};

export default function Index({ barangays }: Props) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Barangay Ratings</h1>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Barangay</th>
            <th className="border px-4 py-2">Average Rating</th>
            <th className="border px-4 py-2">Total Ratings</th>
          </tr>
        </thead>
        <tbody>
          {barangays.map((b) => (
            <tr key={b.id}>
              <td className="border px-4 py-2">{b.name}</td>
              <td className="border px-4 py-2">{b.avg_rating.toFixed(2)} ⭐</td>
              <td className="border px-4 py-2">{b.total_ratings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
