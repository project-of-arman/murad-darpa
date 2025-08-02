
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllResults } from "@/lib/actions/results-actions";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import ResultsTable from "@/components/admin/results/results-table";
import { useEffect, useState } from "react";
import type { ResultWithStudentInfo } from "@/lib/actions/results-actions";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectRole } from "@/lib/redux/slices/user-slice";

export default function AdminResultsPage() {
  const [results, setResults] = useState<ResultWithStudentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const userRole = useAppSelector(selectRole);

  useEffect(() => {
    async function fetchResults() {
      const data = await getAllResults();
      setResults(data);
      setLoading(false);
    }
    fetchResults();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>ফলাফল ব্যবস্থাপনা</CardTitle>
        {userRole !== 'visitor' && (
          <Button asChild>
            <Link href="/admin/results/create">
              <PlusCircle className="mx-2 h-4 w-4" />
                <span className="hidden sm:flex">নতুন ফলাফল যোগ করুন</span>
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? <p>Loading results...</p> : <ResultsTable results={results} />}
      </CardContent>
    </Card>
  );
}
