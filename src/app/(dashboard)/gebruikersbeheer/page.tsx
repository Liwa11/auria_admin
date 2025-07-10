"use client";

import CrudTable from '@/components/CrudTable';

export default function GebruikersbeheerPage() {
  return (
    <div className="p-6">
      <CrudTable tableKey="admin_users" />
    </div>
  );
} 