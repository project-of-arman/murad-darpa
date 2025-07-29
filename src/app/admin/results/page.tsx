
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllResults } from "@/lib/actions/results-actions";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import ResultsTable from "@/components/admin/results/results-table";

export default async function AdminResultsPage() {
  const results = await getAllResults();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>ফলাফল ব্যবস্থাপনা</CardTitle>
        <Button asChild>
          <Link href="/admin/results/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            নতুন ফলাফল যোগ করুন
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <ResultsTable results={results} />
      </CardContent>
    </Card>
  );
}
