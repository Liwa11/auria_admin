"use client";

import CrudTable from '@/components/CrudTable';

export default function KlantenPage() {
  return (
    <div className="p-6">
      <CrudTable tableKey="klanten" />
    </div>
  );
} 